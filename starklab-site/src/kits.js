/* Agent Kits page. Every price and every "installed in" figure is read from
   the catalogue in config.js, so this file never carries a number of its own.
   Scores come from demo-scores.json when the evaluation has been run. */
import { catalogue } from './config.js';
import scores from './demo-scores.json';
import { initChrome, rememberInterest, esc } from './chrome.js';

const $ = s => document.querySelector(s);

/* ---------------- the catalogue lookups ---------------- */
const agentsCat = catalogue.find(c => c.name === 'AI agents') || { items: [] };
const offer = name => agentsCat.items.find(i => i.name === name) || null;

/* ---------------- what each kit does (copy only; numbers come from the catalogue) ---------------- */
const KITS = [
  { slug: 'support', name: 'Support agent', demo: 'support-triage', demoName: 'Support triage',
    job: 'Reads each ticket, sets category and priority, and drafts the reply your team approves.',
    reads: 'Support tickets, inbox and chat transcripts', drafts: 'A categorised ticket with priority and a reply draft',
    approves: 'Your support lead', connects: 'Help desk, shared inbox, your own docs',
    box: ['The Support agent, configured for your tone, your products and your rules', 'Connections to your help desk, shared inbox and docs'] },

  { slug: 'sales', name: 'Sales & lead agent', demo: 'lead-qualifier', demoName: 'Lead qualifier',
    job: 'Scores each enquiry on budget and timeline, routes it, and drafts the first reply.',
    reads: 'Inbound enquiries, forms and email', drafts: 'A lead score, a route and the first reply',
    approves: 'Your sales owner', connects: 'CRM, inbox, booking link',
    box: ['The Sales & lead agent, configured for your offers and your qualifying questions', 'Connections to your CRM, inbox and booking link'] },

  { slug: 'ops', name: 'Internal ops agent', demo: 'meeting-actions', demoName: 'Meeting notes to actions',
    alt: { id: 'order-parser', name: 'order parser' },
    job: 'Turns notes, messages and messy orders into clean records and owned actions.',
    reads: 'Meeting notes, WhatsApp and SMS orders, internal forms', drafts: 'Owned actions with dates, clean orders with questions to confirm',
    approves: 'Your ops lead', connects: 'Sheets, your task tool, your order system',
    box: ['The Internal ops agent, configured for the repetitive jobs your team names', 'Connections to your sheets, task tool and order system'] },

  { slug: 'knowledge', name: 'Knowledge assistant', demo: 'knowledge-assistant', demoName: 'Knowledge assistant',
    job: 'Answers questions from your documents only, and cites the exact words it used.',
    reads: 'Your documents, policies and manuals', drafts: 'A cited answer, or a plain statement that the documents do not say',
    approves: 'The document owner, for anything published', connects: 'Drive, Notion, SharePoint, your wiki',
    box: ['The Knowledge assistant, indexed over your documents with citations on every answer', 'Connections to Drive, Notion, SharePoint or your wiki'] }
];

/* the three bullets every kit shares */
const SHARED_BOX = [
  'A human approval step before anything is sent, posted or changed',
  'Logging of every run, with alerts when a case is uncertain or a connection fails',
  'A 30-minute recorded handover for your team'
];

const CARE = 'Agent care plan';

/* ---------------- score line ---------------- */
function scoreLine(demoId) {
  const s = scores[demoId];
  if (s && Number.isFinite(s.pct) && s.cases) return `Scored <b>${esc(s.pct)}%</b> on ${esc(s.cases)} self-made cases`;
  return '<b>20 test cases</b> ready';
}

/* ---------------- cards ---------------- */
function kitCard(k, i) {
  const o = offer(k.name);
  const price = o ? esc(o.price) : 'On the call';
  const days = o ? esc(o.days) : 'On the call';
  const bullets = [...k.box, ...SHARED_BOX].map(b => `<li>${esc(b)}</li>`).join('');
  const alt = k.alt ? ` <span class="kalt">or the <a href="/demos#${esc(k.alt.id)}" data-kit="${esc(k.name)}">${esc(k.alt.name)}</a></span>` : '';
  return `<article class="kcard" id="kit-${esc(k.slug)}">
    <div class="kt"><span class="m a">Kit 0${i + 1}</span><span class="m">Demo &middot; ${esc(k.demoName)}</span></div>
    <h3>${esc(k.name)}</h3>
    <p class="kjob">${esc(k.job)}</p>
    <div class="kbox"><span class="m">What is in the box</span><ul>${bullets}</ul></div>
    <dl class="kmeta">
      <div><dt>Installed in</dt><dd class="kd">${days}</dd></div>
      <div><dt>Price</dt><dd class="kp">${price}<s>fixed</s></dd></div>
      <div><dt>Tested on</dt><dd class="ks">${scoreLine(k.demo)}</dd></div>
    </dl>
    <div class="kact">
      <a class="btn s" href="/#contact" data-kit="${esc(k.name)}">Get this kit<span class="ar">&rarr;</span></a>
      <a class="btn g s" href="/demos#${esc(k.demo)}" data-kit="${esc(k.name)}">Try the live demo<span class="ar">&rarr;</span></a>${alt}
    </div>
  </article>`;
}

function mcpCard() {
  const bullets = ['An MCP server over your product: read tools that answer, and write tools that only draft a change set',
    'Connections to your API or database, and to the clients your team uses (Claude Desktop, Cursor, your own agent)',
    ...SHARED_BOX].map(b => `<li>${esc(b)}</li>`).join('');
  return `<article class="kcard xtra" id="kit-mcp">
    <div class="kt"><span class="m a">Integration</span><span class="m">Demo &middot; MCP server</span></div>
    <h3>MCP server over your product</h3>
    <p class="kjob">Lets any MCP client ask your product questions and propose changes, with the write side held to drafts your team applies.</p>
    <div class="kbox"><span class="m">What is in the box</span><ul>${bullets}</ul></div>
    <dl class="kmeta">
      <div><dt>Installed in</dt><dd class="kd">On the call</dd></div>
      <div><dt>Price</dt><dd class="kp txt">On the call<s>depends on your product</s></dd></div>
      <div><dt>Tested on</dt><dd class="ks"><b>Live endpoint</b> on the demos page</dd></div>
    </dl>
    <div class="kact">
      <a class="btn s" href="/#contact" data-kit="MCP server">Price on the call<span class="ar">&rarr;</span></a>
      <a class="btn g s" href="/demos#mcp-server" data-kit="MCP server">Try the live demo<span class="ar">&rarr;</span></a>
    </div>
  </article>`;
}

function careCard() {
  const o = offer(CARE);
  const price = o ? esc(o.price) : 'On the call';
  const days = o ? esc(o.days) : 'per month';
  const bullets = ['Uptime monitoring on the kit and its connections', 'A monthly report: volume, score on the twenty cases, what was approved and what was not',
    'Tuning and fixes each month, re-scored on the same cases', 'Alerts to a named person when something is off', 'Stop it any month with one message'].map(b => `<li>${esc(b)}</li>`).join('');
  return `<article class="kcard xtra care" id="kit-care">
    <div class="kt"><span class="m a">Monthly add-on</span><span class="m">After any kit</span></div>
    <h3>${esc(CARE)}</h3>
    <p class="kjob">${esc(o ? o.desc : 'Monitoring, tuning and fixes each month')}, so the kit stays at the score it launched with.</p>
    <div class="kbox"><span class="m">What is in the plan</span><ul>${bullets}</ul></div>
    <dl class="kmeta">
      <div><dt>Billed</dt><dd class="kd">${days}</dd></div>
      <div><dt>Price</dt><dd class="kp">${price}<s>${days}</s></dd></div>
      <div><dt>Needs</dt><dd class="ks"><b>Any kit</b> installed first</dd></div>
    </dl>
    <div class="kact">
      <a class="btn s" href="/#contact" data-kit="${esc(CARE)}">Add the care plan<span class="ar">&rarr;</span></a>
      <a class="btn g s" href="#faq">Read the care plan answers</a>
    </div>
  </article>`;
}

/* ---------------- comparison table ---------------- */
function table() {
  const cols = KITS.map(k => ({ ...k, o: offer(k.name) }));
  const mcp = { name: 'MCP server', reads: 'Your product, through read tools', drafts: 'A change set for your team to apply',
    approves: 'Your team, in the client they use', connects: 'Your API or database; Claude Desktop, Cursor, your own agent' };
  const all = [...cols, mcp];
  const row = (label, cell) => `<tr><th scope="row">${esc(label)}</th>${all.map(c => `<td>${cell(c)}</td>`).join('')}</tr>`;
  const head = `<tr><th scope="col"><span class="m">Kit</span></th>${all.map(c => `<th scope="col">${esc(c.name)}</th>`).join('')}</tr>`;
  const body = [
    row('What it reads', c => esc(c.reads)),
    row('What it drafts', c => esc(c.drafts)),
    row('Who approves', c => esc(c.approves)),
    row('Connects to', c => esc(c.connects)),
    row('Test cases agreed', () => '<b>20</b>, on day one'),
    row('Price', c => c.o ? `<b class="kpz">${esc(c.o.price)}</b>` : '<b class="kpz">On the call</b>'),
    row('Days', c => c.o ? `<span class="kdy">${esc(c.o.days)}</span>` : '<span class="kdy">On the call</span>')
  ].join('');
  return `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

/* ---------------- render ---------------- */
$('#kgrid').innerHTML = KITS.map(kitCard).join('');
$('#kextra').innerHTML = mcpCard() + careCard();
$('#ktable').innerHTML = table();

/* prices quoted inside prose come from the catalogue too */
document.querySelectorAll('[data-kit-price]').forEach(el => {
  const o = offer(el.dataset.kitPrice);
  if (o) el.textContent = `${o.price} ${o.days}`;
});

/* remember which kit the visitor chose, so the home contact form can start the message */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-kit]');
  if (a) rememberInterest(a.dataset.kit);
});

initChrome();
