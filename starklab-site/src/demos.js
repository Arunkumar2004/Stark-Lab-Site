/* Demos page: nine agents and an MCP server, one panel. Content and test cases in demo-data.js. */
import { SAMPLES, TESTS, AGENT_META, CATEGORIES } from './demo-data.js';
import scores from './demo-scores.json';
import { business } from './config.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const nice = s => String(s ?? '').replace(/_/g, ' ');

/* ---------------- shared chrome (same as app.js) ---------------- */
(() => {
  const burger = $('#burger'), drawer = $('#drawer');
  if (!burger || !drawer) return;
  const setOpen = on => { burger.setAttribute('aria-expanded', String(on)); drawer.hidden = !on; document.body.style.overflow = on ? 'hidden' : ''; };
  burger.addEventListener('click', () => setOpen(drawer.hidden));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) setOpen(false); });
  addEventListener('resize', () => { if (innerWidth > 1080) setOpen(false); });
})();
(() => {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
  document.querySelectorAll('.rv').forEach(n => io.observe(n));
})();

/* ---------------- state ---------------- */
const rail = $('#drail'), input = $('#dinput'), qwrap = $('#dqwrap'), question = $('#dquestion');
const run = $('#drun'), msg = $('#dmsg'), out = $('#dresult'), empty = $('#dempty');
const mcpSection = $('#mcp'), grid = $('#dgrid');
let current = null;

/* Chips are ordered by category; a filter row above the rail narrows them. */
const catIndex = c => { const i = CATEGORIES.indexOf(c); return i < 0 ? CATEGORIES.length : i; };
const ordered = AGENT_META.map((a, i) => [a, i]).sort((x, y) => catIndex(x[0].cat) - catIndex(y[0].cat) || x[1] - y[1]).map(x => x[0]);
rail.innerHTML = ordered.map(a =>
  `<button class="dchip" role="tab" type="button" data-id="${a.id}" data-cat="${esc(a.cat)}" aria-selected="false"><s>${esc(a.cat)} · ${esc(a.tag)}</s><b>${esc(a.name)}</b><i>${esc(a.job)}</i></button>`).join('');
rail.addEventListener('click', e => { const t = e.target.closest('.dchip'); if (t) select(t.dataset.id); });
const chips = () => Array.from(rail.querySelectorAll('.dchip'));

const filterRow = document.createElement('div');
filterRow.className = 'dfilter';
filterRow.setAttribute('role', 'group');
filterRow.setAttribute('aria-label', 'Filter demos by category');
const usedCats = CATEGORIES.filter(c => AGENT_META.some(a => a.cat === c));
filterRow.innerHTML = [['All', AGENT_META.length], ...usedCats.map(c => [c, AGENT_META.filter(a => a.cat === c).length])]
  .map(([c, n]) => `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === 'All'}">${esc(c)}<span>${n}</span></button>`).join('');
rail.before(filterRow);
function filterTo(cat) {
  filterRow.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
  chips().forEach(b => { b.hidden = cat !== 'All' && b.dataset.cat !== cat; });
  rail.scrollLeft = 0;
}
filterRow.addEventListener('click', e => { const b = e.target.closest('button'); if (b) filterTo(b.dataset.cat); });

function revealChip(id) {
  const chip = chips().find(b => b.dataset.id === id);
  if (!chip) return;
  if (chip.hidden) filterTo('All');
  const r = rail.getBoundingClientRect(), c = chip.getBoundingClientRect();
  if (c.left < r.left || c.right > r.right) rail.scrollLeft += c.left - r.left - 16;
}

function select(id) {
  current = AGENT_META.find(a => a.id === id) || AGENT_META[0];
  chips().forEach(b => b.setAttribute('aria-selected', String(b.dataset.id === current.id)));
  revealChip(current.id);
  $('#dname').textContent = current.name;
  $('#dretail').textContent = current.retail;
  $('#djob').textContent = current.job;
  history.replaceState(null, '', `#${current.id}`);
  out.hidden = true; out.innerHTML = ''; empty.hidden = false; msg.textContent = ''; msg.className = 'fmsg';
  $('#dbuild').href = `/#contact`;
  sessionStorage.setItem('starklab-demo', current.name);
  renderScore();
  if (current.id === 'mcp-server') { renderMcp(); return; }
  mcpSection.hidden = true;
  const mg = document.getElementById('dmcpgrid'); if (mg) mg.hidden = true;
  grid.hidden = false;
  $('.dfoot').hidden = false;
  qwrap.hidden = current.id !== 'knowledge-assistant';
  const samples = SAMPLES[current.id] || [];
  $('#dsamples').innerHTML = samples.map((s, i) => `<button type="button" data-i="${i}">${esc(s.label)}</button>`).join('');
  input.value = ''; question.value = '';
  if (current.id === 'knowledge-assistant' && samples[0]) {
    $('#dsamples').innerHTML += samples[0].questions.map((q, i) => `<button type="button" data-q="${i}">Q: ${esc(q)}</button>`).join('');
  }
}
$('#dsamples').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.i !== undefined) input.value = SAMPLES[current.id][+b.dataset.i].text;
  if (b.dataset.q !== undefined) { question.value = SAMPLES[current.id][0].questions[+b.dataset.q]; if (!input.value) input.value = SAMPLES[current.id][0].text; }
});

function renderScore() {
  const el = $('#dscore'), s = scores[current.id], t = TESTS[current.id];
  if (current.id === 'mcp-server') { el.innerHTML = `<b>Live endpoint.</b> Four tools, one of them a write that only drafts a change set.`; return; }
  if (!s) { el.innerHTML = `<b>${t ? t.cases.length : 20} self-made test cases</b> ready. Score appears here after the next evaluation run.`; return; }
  const fields = Object.entries(s.fields || {}).map(([k, v]) => `${nice(k)} ${v}%`).join(' · ');
  el.innerHTML = `<span class="pct">${s.pct}%</span> <b>${s.correct} of ${s.cases}</b> self-made cases correct on every checked field${fields ? ` <span class="m">(${esc(fields)})</span>` : ''} · avg ${(s.avg_ms / 1000).toFixed(1)}s · ${new Date(s.ran_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

/* ---------------- run ---------------- */
run.addEventListener('click', async () => {
  if (!current || current.id === 'mcp-server') return;
  const text = input.value.trim();
  if (!text) { msg.className = 'fmsg err'; msg.textContent = 'Paste some text first, or load a sample.'; return; }
  if (current.id === 'knowledge-assistant' && !question.value.trim()) { msg.className = 'fmsg err'; msg.textContent = 'Ask a question about the document.'; return; }
  run.disabled = true; msg.className = 'fmsg'; msg.textContent = 'Running…';
  const t0 = performance.now();
  try {
    const res = await fetch('/api/agent', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: current.id, input: text, question: question.value.trim() || undefined }) });
    const data = await res.json().catch(() => ({ ok: false, error: `Server returned ${res.status}.` }));
    if (!data.ok) { msg.className = 'fmsg err'; msg.textContent = data.error || 'Something went wrong.'; return; }
    msg.textContent = '';
    render(current.id, data.result, data.ms ?? Math.round(performance.now() - t0), data.usage);
  } catch {
    msg.className = 'fmsg err'; msg.textContent = 'Could not reach the demo server.';
  } finally { run.disabled = false; }
});

const kv = pairs => `<div class="dkv">${pairs.filter(p => p[1] !== undefined && p[1] !== null && p[1] !== '').map(([k, v, cls]) => `<div><span>${esc(k)}</span><b${cls ? ` class="${cls}"` : ''}>${esc(v)}</b></div>`).join('')}</div>`;
const block = (title, inner) => `<div class="dblock"><span>${esc(title)}</span>${inner}</div>`;
const list = arr => arr && arr.length ? `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="m">none</p>';
const pct = n => `${Math.round(n * 100)}%`;
/* table(['Head', ...], [[cell, ...], ...]); a cell is a value or [value, 'n' | 'a' | 'ok']. Right-aligned heads end in '#'. */
const table = (heads, rows) => rows.length ? `<div class="dtable"><table><thead><tr>${heads.map(h => `<th${h.endsWith('#') ? ' class="n"' : ''}>${esc(h.replace(/#$/, ''))}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => { const [v, cls] = Array.isArray(c) ? c : [c]; return `<td${cls ? ` class="${cls}"` : ''}>${esc(v)}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>` : '<p class="m">none</p>';
const money = (v, cur) => `${cur && cur !== 'unknown' ? cur + ' ' : ''}${Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const riskCls = r => r === 'high' ? 'a' : r === 'low' ? 'ok' : '';
const words = s => String(s || '').trim().split(/\s+/).filter(Boolean).length;

function render(id, r, ms, usage) {
  let html = '';
  if (id === 'support-triage') {
    html = kv([['Category', nice(r.category)], ['Priority', r.priority, r.priority === 'P1' ? 'a' : ''], ['Sentiment', r.sentiment], ['Needs a human', r.needs_human ? 'Yes' : 'No', r.needs_human ? 'a' : 'ok'], ['Confidence', pct(r.confidence)]])
      + block('Summary', `<p>${esc(r.summary)}</p>`) + block('Draft reply · for the team to approve', `<p>${esc(r.draft_reply)}</p>`);
  } else if (id === 'lead-qualifier') {
    html = kv([['Score', `${r.score} / 100`, r.score >= 80 ? 'a' : ''], ['Tier', r.tier, r.tier === 'hot' ? 'a' : ''], ['Intent', nice(r.intent)], ['Budget', nice(r.budget_signal)], ['Timeline', nice(r.timeline_signal)], ['Route to', nice(r.route_to), 'ok']])
      + block('Why this score', list(r.reasons)) + block('Ask before the call', list(r.missing_info)) + block('Draft reply', `<p>${esc(r.draft_reply)}</p>`);
  } else if (id === 'document-extractor') {
    const rows = (r.line_items || []).map(li => `<tr><td>${esc(li.description)}</td><td class="n">${esc(li.quantity)}</td><td class="n">${esc(li.unit_price)}</td><td class="n">${esc(li.total)}</td></tr>`).join('');
    html = kv([['Document', nice(r.document_type)], ['Confidence', pct(r.confidence)], ...(r.parties || []).map(p => [p.role, p.name + (p.identifier ? ` · ${p.identifier}` : '')]), ...(r.dates || []).map(d => [d.label, d.value]), ...(r.amounts || []).map(a => [a.label, `${a.currency} ${Number(a.value).toLocaleString('en-IN')}`, /total/i.test(a.label) ? 'a' : ''])])
      + (rows ? block('Line items', `<table><thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>`) : '')
      + block('Key terms', list(r.key_terms)) + block('Flags for a human', list(r.flags));
  } else if (id === 'knowledge-assistant') {
    const cites = (r.citations || []).map(c => `<div class="dcite"><b>[${c.n}] ${esc(c.source)}</b> — &ldquo;${esc(c.quote)}&rdquo;</div>`).join('');
    html = kv([['Answered from the documents', r.not_in_documents ? 'No' : 'Yes', r.not_in_documents ? 'a' : 'ok'], ['Citations', (r.citations || []).length]])
      + block('Answer', `<p>${esc(r.answer)}</p>`) + (cites ? block('Cited words', cites) : '') + ((r.follow_up || []).length ? block('Follow-up questions', list(r.follow_up)) : '');
  } else if (id === 'meeting-actions') {
    const actions = r.actions || [];
    html = kv([['Actions', actions.length], ['Decisions', (r.decisions || []).length], ['High priority', actions.filter(a => a.priority === 'high').length, actions.some(a => a.priority === 'high') ? 'a' : ''], ['Unassigned', actions.filter(a => /^unassigned$/i.test(a.owner)).length], ['Confidence', pct(r.confidence)]])
      + block('Summary', `<p>${esc(r.summary)}</p>`)
      + block('Draft action list · for the meeting owner to confirm', table(['Owner', 'Task', 'Due', 'Priority'], actions.map(a => [a.owner, a.task, [a.due || 'no date', 'n'], [a.priority, riskCls(a.priority)]])))
      + block('Decisions', list(r.decisions)) + block('Open questions', list(r.open_questions)) + block('Risks', list(r.risks));
  } else if (id === 'review-responder') {
    html = kv([['Rating guess', `${r.rating_guess} / 5`, r.rating_guess <= 2 ? 'a' : ''], ['Sentiment', r.sentiment], ['Issue', nice(r.issue_type)], ['Escalate to a person', r.escalate ? 'Yes' : 'No', r.escalate ? 'a' : 'ok'], ['Confidence', pct(r.confidence)]])
      + block('Themes', list(r.themes))
      + block(`Draft public reply · ${words(r.reply)} words · for a human to approve and post`, `<p>${esc(r.reply)}</p>`);
  } else if (id === 'contract-risk') {
    const risks = r.risks || [];
    html = kv([['Document', r.document_type], ['Overall risk', r.overall_risk, riskCls(r.overall_risk)], ['Risky clauses', risks.length], ['Missing clauses', (r.missing_clauses || []).length], ['Confidence', pct(r.confidence)]])
      + block('Parties', list(r.parties)) + block('Term', `<p>${esc(r.term_summary)}</p>`)
      + block('Clauses to look at · a first pass, not legal advice', table(['Clause', 'Risk', 'Why', 'Ask for'], risks.map(x => [x.clause, [x.risk, riskCls(x.risk)], x.why, x.suggested_change])))
      + block('Missing clauses', list(r.missing_clauses));
  } else if (id === 'order-parser') {
    const items = r.items || [];
    html = kv([['Customer', r.customer_name || 'not given'], ['Phone', r.phone || 'not given'], ['Deliver to', r.delivery || 'pickup or not given'], ['When', r.requested_time || 'not given'], ['Payment', ({ upi: 'UPI', cod: 'cash on delivery', card: 'card', unknown: 'not stated' })[r.payment_hint] || r.payment_hint], ['Items', items.length], ['Confidence', pct(r.confidence)]])
      + block('Draft order · confirm with the customer before it goes in the book', table(['Item', 'Qty#', 'Unit', 'Notes'], items.map(i => [i.name, [i.quantity ? i.quantity : 'not given', 'n'], i.unit, i.notes || ''])))
      + block('Ask the customer', list(r.unclear));
  } else if (id === 'expense-categoriser') {
    const tx = r.transactions || [];
    const curs = [...new Set(tx.map(x => x.currency).filter(c => c && c !== 'unknown'))];
    const cur = curs.length === 1 ? curs[0] : '';
    const spent = tx.filter(x => x.amount > 0).reduce((sum, x) => sum + x.amount, 0);
    html = kv([['Transactions', tx.length], ['Money out', money(spent, cur)], ['GST hint: claimable', tx.filter(x => x.gst_claimable).length, 'ok'], ['Flags', (r.flags || []).length, (r.flags || []).length ? 'a' : ''], ['Confidence', pct(r.confidence)]])
      + block('Draft categories · for the owner or accountant to check', table(['Date', 'Description', 'Amount#', 'Category', 'GST'], tx.map(x => [x.date || '', x.description, [money(x.amount, x.currency), 'n'], nice(x.category), x.gst_claimable ? 'likely' : 'no'])))
      + block('Totals by category', table(['Category', 'Total#'], (r.totals_by_category || []).map(t => [nice(t.category), [money(t.total, cur), 'n']])))
      + block('Flags for a human', list(r.flags));
  }
  html += `<div class="dmeta"><span>Took <b>${(ms / 1000).toFixed(1)}s</b></span>${usage ? `<span>Tokens in <b>${usage.input + usage.cached}</b> · out <b>${usage.output}</b></span>` : ''}<span>Model <b>Claude Opus 5.5</b></span></div>`;
  html += `<details class="draw"><summary>Raw JSON</summary><pre>${esc(JSON.stringify(r, null, 2))}</pre></details>`;
  out.innerHTML = `<div class="dres">${html}</div>`; out.hidden = false; empty.hidden = true;
}

/* ---------------- MCP ---------------- */
const MCP_URL = `${location.origin}/api/mcp`;
let rpcId = 1;
async function rpc(method, params) {
  const res = await fetch('/api/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: rpcId++, method, params }) });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}
function ensureMcpGrid() {
  let g = document.getElementById('dmcpgrid');
  if (!g) { g = document.createElement('div'); g.id = 'dmcpgrid'; g.className = 'dgrid'; grid.insertAdjacentElement('afterend', g); }
  return g;
}
async function renderMcp() {
  grid.hidden = true; $('.dfoot').hidden = false; mcpSection.hidden = false;
  $('#mcpurl').textContent = MCP_URL;
  $('#mcpcfg').textContent = JSON.stringify({ mcpServers: { 'starklab-demo-orders': { command: 'npx', args: ['-y', 'mcp-remote', MCP_URL] } } }, null, 2);
  out.hidden = true;
  let tools;
  try { await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'starklab-site', version: '1.0' } }); tools = (await rpc('tools/list')).tools; }
  catch (e) { msg.className = 'fmsg err'; msg.textContent = `MCP server unreachable: ${e.message}`; return; }
  const sampleArgs = { get_order: { id: 'SO-1042' }, list_orders: { status: 'overdue' }, request_refund: { id: 'SO-1044', amount: 500, reason: 'Late delivery goodwill' }, revenue_summary: {} };
  const mcpGrid = ensureMcpGrid(); mcpGrid.hidden = false;
  mcpGrid.innerHTML = `<div class="din" style="border-right:0;grid-column:1/-1">
    <div class="dlabel"><span class="m a">Four tools, live from this page</span><span class="m">tools/list · ${tools.length}</span></div>
    <div class="dtools">${tools.map(t => `<div class="dtool" data-tool="${esc(t.name)}"><b>${esc(t.name)}</b><button class="btn s" type="button">Call<span class="ar">&rarr;</span></button><i>${esc(t.description)}</i>
      <div class="dargs" style="grid-column:1/-1">${Object.entries(t.inputSchema.properties || {}).map(([k, p]) => `<input name="${esc(k)}" placeholder="${esc(k)}${p.enum ? ' · ' + p.enum.join('|') : ''}" value="${esc(sampleArgs[t.name]?.[k] ?? '')}">`).join('')}</div></div>`).join('')}</div>
    <div class="dout" style="padding:0;min-height:0;background:transparent"><div id="mcpout"></div></div></div>`;
  mcpGrid.querySelectorAll('.dtool .btn').forEach(btn => btn.addEventListener('click', async () => {
    const box = btn.closest('.dtool'), name = box.dataset.tool, args = {};
    box.querySelectorAll('input').forEach(i => { if (i.value !== '') args[i.name] = i.name === 'amount' ? Number(i.value) : i.value; });
    btn.disabled = true;
    try {
      const t0 = performance.now();
      const r = await rpc('tools/call', { name, arguments: args });
      const text = r.content.map(c => c.text).join('\n');
      $('#mcpout').innerHTML = `<div class="dres">${block(`tools/call · ${name}${r.isError ? ' · error' : ''}`, `<pre style="margin:0;font-family:var(--mono);font-size:12.5px;line-height:1.5;white-space:pre-wrap;color:var(--ink)">${esc(text)}</pre>`)}<div class="dmeta"><span>Took <b>${((performance.now() - t0) / 1000).toFixed(2)}s</b></span><span>Request <b>${esc(JSON.stringify(args))}</b></span></div></div>`;
    } catch (e) { $('#mcpout').innerHTML = `<p class="fmsg err">${esc(e.message)}</p>`; }
    finally { btn.disabled = false; }
  }));
}

/* ---------------- boot ---------------- */
const fromHash = location.hash.slice(1);
select(AGENT_META.some(a => a.id === fromHash) ? fromHash : AGENT_META[0].id);
addEventListener('hashchange', () => { const id = location.hash.slice(1); if (AGENT_META.some(a => a.id === id) && id !== current?.id) select(id); });
void business;
