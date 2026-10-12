/* POST /api/agent  { agent: <one of the ids in api/_agents.js>,
                      input: string, question?: string }
   -> { ok: true, agent, result, usage, ms }  or  { ok: false, error, code }

   Vercel serverless function (Node). The API key is read from the
   ANTHROPIC_API_KEY environment variable and never reaches the browser. */
import Anthropic from '@anthropic-ai/sdk';
import { AGENTS } from './_agents.js';

const MODEL = 'claude-opus-5-5';
const MAX_INPUT = 12000;          // characters; keeps every demo quick and cheap
const WINDOW_MS = 60_000, PER_WINDOW = 12;
const hits = new Map();           // best-effort per-instance rate limit

function limited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { t: now, n: 0 };
  if (now - rec.t > WINDOW_MS) { rec.t = now; rec.n = 0; }
  rec.n += 1; hits.set(ip, rec);
  return rec.n > PER_WINDOW;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 200_000) reject(new Error('too-large')); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

const send = (res, status, obj) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
};

export function fence(text) {
  // Untrusted text is data, not instructions: strip our own tag names so it cannot close the fence.
  return String(text).replace(/<\/?(input|doc)\b[^>]*>/gi, '');
}

export function buildUserMessage(agentId, input, question) {
  if (agentId === 'knowledge-assistant') {
    return `<input>\n<doc name="pasted document">\n${fence(input)}\n</doc>\n</input>\n\nQuestion: ${fence(question || '').slice(0, 500)}`;
  }
  return `<input>\n${fence(input)}\n</input>`;
}

export async function runAgent(client, agentId, input, question) {
  const agent = AGENTS[agentId];
  const t0 = Date.now();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: agent.schema }
    },
    system: [{ type: 'text', text: agent.system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: buildUserMessage(agentId, input, question) }]
  });
  if (response.stop_reason === 'refusal') {
    return { refused: true, category: response.stop_details?.category ?? null, ms: Date.now() - t0 };
  }
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  let result;
  try { result = JSON.parse(text); } catch { throw Object.assign(new Error('bad-json'), { code: 'BAD_JSON' }); }
  return { result, usage: response.usage, stop_reason: response.stop_reason, ms: Date.now() - t0 };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, code: 'METHOD', error: 'POST only.' });
  if (!process.env.ANTHROPIC_API_KEY) {
    return send(res, 503, { ok: false, code: 'NOT_CONFIGURED', error: 'The demo key is not configured on this deployment yet.' });
  }
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  if (limited(ip)) return send(res, 429, { ok: false, code: 'RATE', error: 'Twelve runs a minute per visitor. Try again shortly.' });

  let body;
  try { body = await readBody(req); } catch { return send(res, 400, { ok: false, code: 'BODY', error: 'Could not read the request.' }); }
  const { agent: agentId, input, question } = body || {};
  if (!AGENTS[agentId]) return send(res, 400, { ok: false, code: 'AGENT', error: 'Unknown agent.' });
  if (typeof input !== 'string' || !input.trim()) return send(res, 400, { ok: false, code: 'INPUT', error: 'Paste some text first.' });
  if (input.length > MAX_INPUT) return send(res, 400, { ok: false, code: 'LONG', error: `Keep the input under ${MAX_INPUT} characters for the demo.` });
  if (agentId === 'knowledge-assistant' && (typeof question !== 'string' || !question.trim())) {
    return send(res, 400, { ok: false, code: 'QUESTION', error: 'Ask a question about the document.' });
  }

  const client = new Anthropic();
  try {
    const out = await runAgent(client, agentId, input, question);
    if (out.refused) return send(res, 200, { ok: false, code: 'REFUSED', error: 'The model declined this input.', ms: out.ms });
    return send(res, 200, { ok: true, agent: agentId, result: out.result, ms: out.ms,
      usage: { input: out.usage.input_tokens, output: out.usage.output_tokens, cached: out.usage.cache_read_input_tokens || 0 } });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return send(res, 429, { ok: false, code: 'UPSTREAM_RATE', error: 'Busy right now. Try again in a minute.' });
    if (err instanceof Anthropic.AuthenticationError) return send(res, 503, { ok: false, code: 'KEY', error: 'The demo key is not valid on this deployment.' });
    if (err instanceof Anthropic.APIError) return send(res, 502, { ok: false, code: 'UPSTREAM', error: `Model error ${err.status}.` });
    if (err.code === 'BAD_JSON') return send(res, 502, { ok: false, code: 'BAD_JSON', error: 'The model returned something that was not valid JSON.' });
    console.error(err);
    return send(res, 500, { ok: false, code: 'SERVER', error: 'Something broke on our side.' });
  }
}
