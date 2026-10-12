/* Runs every demo agent over its self-made test set and writes
   src/demo-scores.json, which the demos page shows as the accuracy line.
   Usage:  npm run eval:demos            (needs ANTHROPIC_API_KEY in .env) */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { TESTS, SAMPLES } from '../src/demo-data.js';
import { runAgent } from '../api/agent.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
if (!process.env.ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY missing (put it in .env).'); process.exit(2); }

const only = process.argv[2];
const client = new Anthropic();
const out = fs.existsSync(path.join(root, 'src/demo-scores.json'))
  ? JSON.parse(fs.readFileSync(path.join(root, 'src/demo-scores.json'), 'utf8')) : {};

const lc = s => String(s ?? '').toLowerCase();
const has = (arr, field, needle) => (arr || []).some(x => lc(x?.[field]).includes(lc(needle)));
const OPTIONAL = new Set(['contains', 'contains_owner', 'contains_clause', 'contains_item', 'category_of']);

/* What the agent returned for one checked key, for the failure log. */
function got(key, r) {
  switch (key) {
    case 'grand_total':     return (r.amounts || []).map(a => a.value);
    case 'contains':        return (r.answer || '').slice(0, 120);
    case 'count_actions':   return (r.actions || []).length;
    case 'contains_owner':  return (r.actions || []).map(a => a.owner);
    case 'contains_clause': return (r.risks || []).map(x => x.clause);
    case 'count_items':     return (r.items || []).length;
    case 'contains_item':   return (r.items || []).map(i => i.name);
    case 'count_tx':        return (r.transactions || []).length;
    case 'category_of':     return (r.transactions || []).map(x => `${x.description}: ${x.category}`);
    default:                return r[key];
  }
}

function grade(agentId, result, expect) {
  const t = TESTS[agentId];
  const detail = {};
  let ok = true;
  for (const key of t.check) {
    if (OPTIONAL.has(key) && expect[key] === undefined) continue;
    let pass;
    if (key === 'grand_total') {
      const amounts = (result.amounts || []).map(a => Number(a.value));
      pass = amounts.some(v => Math.abs(v - expect.grand_total) < 0.01);
    } else if (key === 'contains') {
      pass = lc(result.answer).includes(lc(expect.contains));
    } else if (key === 'count_actions') {
      pass = (result.actions || []).length === expect.count_actions;
    } else if (key === 'contains_owner') {
      pass = has(result.actions, 'owner', expect.contains_owner);
    } else if (key === 'contains_clause') {
      pass = has(result.risks, 'clause', expect.contains_clause);
    } else if (key === 'count_items') {
      pass = (result.items || []).length === expect.count_items;
    } else if (key === 'contains_item') {
      pass = has(result.items, 'name', expect.contains_item);
    } else if (key === 'count_tx') {
      pass = (result.transactions || []).length === expect.count_tx;
    } else if (key === 'category_of') {
      const tx = (result.transactions || []).find(x => lc(x.description).includes(lc(expect.category_of.desc)));
      pass = !!tx && tx.category === expect.category_of.category;
    } else {
      pass = result[key] === expect[key];
    }
    detail[key] = pass; if (!pass) ok = false;
  }
  return { ok, detail };
}

for (const agentId of Object.keys(TESTS)) {
  if (only && only !== agentId) continue;
  const t = TESTS[agentId];
  let correct = 0, fieldHits = {}, fieldN = {}, ms = 0, failures = [];
  console.log(`\n== ${agentId}: ${t.cases.length} cases`);
  for (const [i, c] of t.cases.entries()) {
    const input = agentId === 'knowledge-assistant' ? SAMPLES['knowledge-assistant'][t.doc].text : c.input;
    let r;
    try { r = await runAgent(client, agentId, input, c.question); }
    catch (e) { console.log(`  ${i + 1}. ERROR ${e.message}`); failures.push({ i: i + 1, error: e.message }); continue; }
    if (r.refused) { console.log(`  ${i + 1}. refused`); failures.push({ i: i + 1, error: 'refused' }); continue; }
    ms += r.ms;
    const g = grade(agentId, r.result, c.expect);
    for (const [k, v] of Object.entries(g.detail)) { fieldHits[k] = (fieldHits[k] || 0) + (v ? 1 : 0); fieldN[k] = (fieldN[k] || 0) + 1; }
    if (g.ok) correct++; else failures.push({ i: i + 1, got: Object.fromEntries(t.check.map(k => [k, got(k, r.result)])), expect: c.expect });
    console.log(`  ${i + 1}. ${g.ok ? 'pass' : 'FAIL'} ${JSON.stringify(g.detail)} ${r.ms}ms`);
  }
  const n = t.cases.length;
  out[agentId] = { cases: n, correct, pct: Math.round(100 * correct / n), fields: Object.fromEntries(Object.entries(fieldHits).map(([k, v]) => [k, Math.round(100 * v / fieldN[k])])),
    avg_ms: Math.round(ms / Math.max(1, n - failures.filter(f => f.error).length)), ran_at: new Date().toISOString(), model: 'claude-opus-5-5', failures };
  console.log(`-> ${correct}/${n} = ${out[agentId].pct}%  avg ${out[agentId].avg_ms}ms`);
}
fs.writeFileSync(path.join(root, 'src/demo-scores.json'), JSON.stringify(out, null, 2));
console.log('\nwrote src/demo-scores.json');
