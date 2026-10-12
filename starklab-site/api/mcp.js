/* /api/mcp - a small, real MCP server (Streamable HTTP transport, JSON-RPC 2.0)
   over a demo order book. Anyone can point an MCP client at it.

   Read tools answer directly. The one write tool never changes anything: it
   returns a change set that waits for a named human to approve. That is the
   shape every Stark Lab agent follows, so the demo shows the real product
   behaviour rather than a toy.

   Deliberately dependency-free so it also runs under the local dev server. */

const PROTOCOL = '2025-06-18';

const ORDERS = [
  { id: 'SO-1041', customer: 'Northstar Pty Ltd',  country: 'AU', status: 'paid',      total: 1500, currency: 'USD', items: ['Landing page'],        placed: '2026-09-28' },
  { id: 'SO-1042', customer: 'Loopline Inc',       country: 'US', status: 'in_build',  total: 5500, currency: 'USD', items: ['Agent Sprint'],        placed: '2026-09-30' },
  { id: 'SO-1043', customer: 'Formly Ltd',         country: 'UK', status: 'delivered', total: 3500, currency: 'USD', items: ['Agent Kit: Support Triage'], placed: '2026-09-14' },
  { id: 'SO-1044', customer: 'Lumen Studio',       country: 'NL', status: 'overdue',   total: 3200, currency: 'USD', items: ['Marketing site'],      placed: '2026-08-30' },
  { id: 'SO-1045', customer: 'Bharat Traders',     country: 'IN', status: 'paid',      total: 4000, currency: 'USD', items: ['MCP Server Build'],    placed: '2026-10-02' }
];

const TOOLS = [
  {
    name: 'list_orders',
    description: 'List orders in the demo order book. Optional filter by status.',
    inputSchema: { type: 'object', properties: { status: { type: 'string', enum: ['paid', 'in_build', 'delivered', 'overdue'] } }, additionalProperties: false },
    annotations: { readOnlyHint: true }
  },
  {
    name: 'get_order',
    description: 'Fetch one order by id, for example SO-1042.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
    annotations: { readOnlyHint: true }
  },
  {
    name: 'revenue_summary',
    description: 'Total order value grouped by status.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true }
  },
  {
    name: 'request_refund',
    description: 'Draft a refund for an order. Nothing is changed: the tool returns a change set that a named human must approve.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' }, amount: { type: 'number' }, reason: { type: 'string' } }, required: ['id', 'amount', 'reason'], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: false }
  }
];

function callTool(name, args = {}) {
  switch (name) {
    case 'list_orders': {
      const rows = args.status ? ORDERS.filter(o => o.status === args.status) : ORDERS;
      return { orders: rows, count: rows.length };
    }
    case 'get_order': {
      const o = ORDERS.find(x => x.id === String(args.id || '').toUpperCase());
      if (!o) return { error: `No order ${args.id}.` };
      return o;
    }
    case 'revenue_summary': {
      const by = {};
      for (const o of ORDERS) by[o.status] = (by[o.status] || 0) + o.total;
      return { currency: 'USD', by_status: by, total: ORDERS.reduce((s, o) => s + o.total, 0) };
    }
    case 'request_refund': {
      const o = ORDERS.find(x => x.id === String(args.id || '').toUpperCase());
      if (!o) return { error: `No order ${args.id}.` };
      const amount = Number(args.amount);
      if (!(amount > 0) || amount > o.total) return { error: `Amount must be between 0 and ${o.total}.` };
      return {
        change_set: {
          id: `CS-${Date.now().toString(36).toUpperCase()}`,
          risk: 'R3',
          status: 'awaiting_approval',
          approver: 'owner (not the requester)',
          ops: [{ op: 'create', record: 'Refund', data: { order: o.id, amount, currency: o.currency, reason: String(args.reason).slice(0, 200) } }],
          inverse: [{ op: 'cancel', record: 'Refund', match: { order: o.id, amount } }],
          preview: `Refund ${o.currency} ${amount} to ${o.customer} against ${o.id}. Nothing moves until the owner approves. Undo: cancel the refund.`
        }
      };
    }
    default:
      return null;
  }
}

const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result });

export function handleRpc(msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return rpcError(msg?.id ?? null, -32600, 'Invalid request');
  const { id, method, params = {} } = msg;
  if (method.startsWith('notifications/')) return null;           // no reply to notifications
  switch (method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'starklab-demo-orders', version: '1.0.0' },
        instructions: 'Demo order book from Stark Lab. Read tools answer directly; request_refund only drafts a change set for human approval.'
      });
    case 'ping':
      return rpcResult(id, {});
    case 'tools/list':
      return rpcResult(id, { tools: TOOLS });
    case 'tools/call': {
      const tool = TOOLS.find(t => t.name === params.name);
      if (!tool) return rpcError(id, -32602, `Unknown tool ${params.name}`);
      const out = callTool(params.name, params.arguments || {});
      return rpcResult(id, { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }], isError: Boolean(out && out.error) });
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 100_000) reject(new Error('too-large')); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : null); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  if (req.method === 'GET') {
    // No server-initiated stream in this demo; describe the endpoint instead.
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ server: 'starklab-demo-orders', transport: 'streamable-http', protocolVersion: PROTOCOL,
      usage: 'POST JSON-RPC 2.0 messages to this URL. Methods: initialize, tools/list, tools/call, ping.', tools: TOOLS.map(t => t.name) }));
  }
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }

  let body;
  try { body = await readBody(req); } catch { res.statusCode = 400; return res.end(JSON.stringify(rpcError(null, -32700, 'Parse error'))); }
  const batch = Array.isArray(body) ? body : [body];
  const replies = batch.map(handleRpc).filter(Boolean);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!replies.length) { res.statusCode = 202; return res.end(); }
  res.statusCode = 200;
  res.end(JSON.stringify(Array.isArray(body) ? replies : replies[0]));
}
