/* 16 AI assistant with approval cards: the assistant proposes changes, a person approves or rejects, every outcome is logged. */

const CSS = `
.s-16-app{display:grid;grid-template-columns:220px 1fr 300px;height:100%;font:13px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d2330;background:#f6f7f9}
.s-16-side{background:#fff;border-right:1px solid #e3e6eb;padding:16px 12px;display:flex;flex-direction:column;gap:4px}
.s-16-brand{font-weight:700;font-size:15px;padding:0 8px 14px;display:flex;gap:8px;align-items:center}
.s-16-mark{width:24px;height:24px;border-radius:7px;background:#2f6bd8;display:grid;place-items:center}
.s-16-conv{padding:8px 10px;border-radius:8px;cursor:pointer;color:#4b5362;border:0;background:none;font:inherit;text-align:left}
.s-16-conv:hover{background:#f0f4fd}
.s-16-conv.s-16-on{background:#e8effc;color:#1d4fb0;font-weight:600}
.s-16-small{font-size:11px;color:#8a91a0}
.s-16-chat{display:flex;flex-direction:column;min-height:0}
.s-16-head{padding:14px 22px;background:#fff;border-bottom:1px solid #e3e6eb;display:flex;justify-content:space-between;align-items:center}
.s-16-h{margin:0;font-size:16px}
.s-16-pill{font-size:11px;padding:3px 9px;border-radius:999px;background:#e8effc;color:#1d4fb0;font-weight:600}
.s-16-thread{flex:1;overflow:auto;padding:20px 22px;display:flex;flex-direction:column;gap:14px}
.s-16-msg{max-width:78%;padding:10px 14px;border-radius:14px;background:#fff;border:1px solid #e3e6eb}
.s-16-msg.s-16-user{align-self:flex-end;background:#2f6bd8;color:#fff;border-color:#2f6bd8;border-bottom-right-radius:4px}
.s-16-msg.s-16-bot{border-bottom-left-radius:4px}
.s-16-typing{color:#8a91a0;font-style:italic}
.s-16-card{max-width:86%;background:#fff;border:1px solid #c9d8f5;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(47,107,216,.07)}
.s-16-ch{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f3f7fe;border-bottom:1px solid #dfe8f9;font-weight:650}
.s-16-state{font-size:11px;padding:2px 9px;border-radius:999px;font-weight:600;background:#fff4d6;color:#8a5a00}
.s-16-state.s-16-applied{background:#dcfce7;color:#166534}
.s-16-state.s-16-rejected{background:#f1f2f5;color:#5b6170}
.s-16-state.s-16-undone{background:#fee2e2;color:#991b1b}
.s-16-cb{padding:12px 14px}
.s-16-diff{width:100%;border-collapse:collapse;margin:8px 0;font-size:12px}
.s-16-diff th{text-align:left;color:#8a91a0;font-weight:600;padding:4px 6px;border-bottom:1px solid #eceef2}
.s-16-diff td{padding:6px;border-bottom:1px solid #f3f4f6}
.s-16-old{color:#9b2c2c;text-decoration:line-through}
.s-16-new{color:#166534;font-weight:600}
.s-16-note{font-size:12px;color:#5b6170;background:#f8f9fb;border-radius:8px;padding:8px 10px}
.s-16-acts{display:flex;gap:8px;padding:0 14px 14px}
.s-16-btn{border:1px solid #d5d9e0;background:#fff;border-radius:8px;padding:7px 16px;font:inherit;font-weight:600;cursor:pointer}
.s-16-btn:hover{border-color:#2f6bd8;color:#2f6bd8}
.s-16-btn.s-16-pri{background:#2f6bd8;border-color:#2f6bd8;color:#fff}
.s-16-btn.s-16-pri:hover{background:#2156b8;color:#fff}
.s-16-compose{padding:12px 22px 16px;background:#fff;border-top:1px solid #e3e6eb}
.s-16-sugs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.s-16-sug{border:1px solid #d5d9e0;background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12px;cursor:pointer;color:#4b5362}
.s-16-sug:hover{border-color:#2f6bd8;color:#2f6bd8}
.s-16-form{display:flex;gap:8px}
.s-16-in{flex:1;border:1px solid #d5d9e0;border-radius:10px;padding:10px 12px;font:inherit}
.s-16-in:focus{outline:2px solid #cfe0fb;border-color:#2f6bd8}
.s-16-log{background:#fff;border-left:1px solid #e3e6eb;padding:16px;overflow:auto}
.s-16-lh{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#8a91a0;font-weight:600;margin:0 0 10px}
.s-16-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:14px}
.s-16-stat{background:#f6f7f9;border-radius:8px;padding:8px;text-align:center}
.s-16-stat b{display:block;font-size:18px}
.s-16-line{border-left:2px solid #c9d8f5;padding:2px 0 10px 10px;font-size:12px}
.s-16-line.s-16-applied{border-color:#22a35a}
.s-16-line.s-16-rejected{border-color:#a0a6b2}
.s-16-line.s-16-undone{border-color:#dc4c4c}
.s-16-undo{border:0;background:none;color:#2f6bd8;font:inherit;font-size:12px;cursor:pointer;padding:0;text-decoration:underline}
`;

const PROPOSALS = [
  { match: /credit|limit/i, ask: 'Raise the credit limit for Brightwater Interiors to 5 lakh',
    reply: 'Brightwater Interiors has paid 14 of their last 14 invoices on time. Here is the change I would make:',
    title: 'Update customer credit limit', rows: [['Brightwater Interiors', 'Credit limit', '₹2,50,000', '₹5,00,000']],
    note: 'Affects 1 customer record. New orders above the old limit stop needing manual release.' },
  { match: /price|sku|cushion/i, ask: 'Increase cushion cover prices by 8% from Monday',
    reply: 'I found 3 active cushion cover SKUs. Proposed new prices, rounded to the nearest rupee:',
    title: 'Schedule price change for 3 SKUs', rows: [['LH-CC-201 Indigo block print', 'Price', '₹649', '₹701'], ['LH-CC-204 Linen stripe', 'Price', '₹799', '₹863'], ['LH-CC-210 Velvet ochre', 'Price', '₹1,199', '₹1,295']],
    note: 'Takes effect Monday 12 Oct at 00:00. Open carts keep the old price until checkout.' },
  { match: /reorder|stock|lamp/i, ask: 'Set a reorder point for the Rattan table lamp',
    reply: 'The Rattan table lamp sold 42 units in the last 30 days and the supplier lead time is 9 days. I suggest:',
    title: 'Set reorder rule', rows: [['LH-LT-077 Rattan table lamp', 'Reorder point', 'Not set', '18 units'], ['LH-LT-077 Rattan table lamp', 'Reorder quantity', 'Not set', '60 units']],
    note: 'Creates a draft purchase order for Kaveri Crafts when stock falls to 18. Nothing is ordered today.' }
];
const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export default {
  id: '16-ai-chat-approvals',
  name: 'AI assistant with approval cards',
  category: 'AI',
  sector: 'Retail operations',
  blurb: 'An operations assistant drafts changes in plain language; a named person approves or rejects each one, and every outcome is logged and can be undone.',
  device: 'desktop',
  accent: '#2F6BD8',
  tags: ['AI assistant', 'human approval', 'audit trail'],
  render(root) {
    const timers = [];
    const items = [
      { kind: 'bot', text: 'Good morning, Nisha. I can draft changes to customers, prices and stock rules. Nothing changes until you approve it.' }
    ];
    const log = [{ t: '09:05', text: 'Assistant session started by Nisha Kapoor', s: 'info' }];
    const st = { busy: false, conv: 0 };

    root.innerHTML = `<style>${CSS}</style>
      <div class="s-16-app">
        <aside class="s-16-side"><div class="s-16-brand"><span class="s-16-mark"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2l2.6 6.9L22 12l-7.4 3.1L12 22l-2.6-6.9L2 12l7.4-3.1z" fill="#fff"/></svg></span>Larkspur Ops</div>
          ${['Today: catalogue and credit', 'Diwali stock plan', 'Supplier follow-ups'].map((c, i) => `<button class="s-16-conv" data-conv="${i}">${c}<div class="s-16-small">${['Now', 'Yesterday', '2 Oct'][i]}</div></button>`).join('')}
          <div class="s-16-small" style="margin-top:auto;padding:8px">Larkspur Home Goods · Approver: Nisha Kapoor</div></aside>
        <section class="s-16-chat">
          <div class="s-16-head"><h1 class="s-16-h">Operations assistant</h1><span class="s-16-pill">Approval required for every change</span></div>
          <div class="s-16-thread" data-k="thread"></div>
          <div class="s-16-compose"><div class="s-16-sugs">${PROPOSALS.map((p, i) => `<button class="s-16-sug" data-sug="${i}">${p.ask}</button>`).join('')}</div>
            <form class="s-16-form" data-k="form"><input class="s-16-in" name="msg" placeholder="Ask for a change, for example a price or a credit limit" autocomplete="off"><button class="s-16-btn s-16-pri" type="submit">Send</button></form></div>
        </section>
        <aside class="s-16-log"><h2 class="s-16-lh">Today</h2><div class="s-16-stats" data-k="stats"></div><h2 class="s-16-lh">Activity log</h2><div data-k="log"></div></aside>
      </div>`;
    const $ = s => root.querySelector(s);

    const card = (it, i) => `<div class="s-16-card"><div class="s-16-ch"><span>${it.p.title}</span><span class="s-16-state s-16-${it.state}">${{ pending: 'Awaiting approval', applied: 'Applied', rejected: 'Rejected', undone: 'Undone' }[it.state]}</span></div>
      <div class="s-16-cb"><div>In plain words: ${it.p.ask.charAt(0).toLowerCase() + it.p.ask.slice(1)}.</div>
        <table class="s-16-diff"><thead><tr><th>Record</th><th>Field</th><th>Now</th><th>After</th></tr></thead><tbody>${it.p.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="s-16-old">${r[2]}</td><td class="s-16-new">${r[3]}</td></tr>`).join('')}</tbody></table>
        <div class="s-16-note">${it.p.note} If you approve, you can undo this for 30 days from the activity log.</div></div>
      ${it.state === 'pending' ? `<div class="s-16-acts"><button class="s-16-btn s-16-pri" data-approve="${i}">Approve</button><button class="s-16-btn" data-reject="${i}">Reject</button></div>` : ''}</div>`;

    const drawThread = () => {
      const th = $('[data-k="thread"]');
      if (st.conv) {
        th.innerHTML = `<div class="s-16-msg s-16-bot">${['', 'Archived thread. 2 changes were approved yesterday: festive bundle prices and a reorder rule for brass diyas.', 'Archived thread. I drafted follow-up emails to Kaveri Crafts and Nilgiri Weaves; both were rejected and nothing was sent.'][st.conv]}</div><div class="s-16-msg s-16-bot s-16-typing">Open today's conversation to make new changes.</div>`;
        return;
      }
      th.innerHTML = items.map((it, i) => (it.kind === 'card' ? card(it, i) : `<div class="s-16-msg s-16-${it.kind}">${it.text}</div>`)).join('')
        + (st.busy ? '<div class="s-16-msg s-16-bot s-16-typing">Assistant is checking the records...</div>' : '');
      th.scrollTop = th.scrollHeight;
    };
    const drawLog = () => {
      const c = s => items.filter(it => it.kind === 'card' && it.state === s).length;
      $('[data-k="stats"]').innerHTML = `<div class="s-16-stat"><b>${c('pending')}</b><span class="s-16-small">Pending</span></div><div class="s-16-stat"><b>${c('applied')}</b><span class="s-16-small">Applied</span></div><div class="s-16-stat"><b>${c('rejected') + c('undone')}</b><span class="s-16-small">Not applied</span></div>`;
      $('[data-k="log"]').innerHTML = log.map(l => `<div class="s-16-line s-16-${l.s}"><div class="s-16-small">${l.t}</div>${l.text}${l.undo !== undefined && items[l.undo].state === 'applied' ? ` <button class="s-16-undo" data-undo="${l.undo}">Undo</button>` : ''}</div>`).join('');
      root.querySelectorAll('[data-conv]').forEach(b => b.classList.toggle('s-16-on', +b.dataset.conv === st.conv));
    };
    const draw = () => { drawThread(); drawLog(); };
    const addLog = (text, s, undo) => log.unshift({ t: now(), text, s, undo });

    const send = text => {
      if (!text.trim() || st.busy) return;
      st.conv = 0;
      items.push({ kind: 'user', text: text.replace(/</g, '&lt;') });
      st.busy = true; draw();
      timers.push(setTimeout(() => {
        st.busy = false;
        const p = PROPOSALS.find(x => x.match.test(text));
        if (p) { items.push({ kind: 'bot', text: p.reply }); items.push({ kind: 'card', p, state: 'pending' }); addLog(`Assistant proposed: ${p.title}`, 'info'); }
        else items.push({ kind: 'bot', text: 'I can only draft changes to customer credit, product prices and reorder rules here. Could you say which record you mean?' });
        draw();
      }, 900));
    };

    root.addEventListener('click', e => {
      const t = e.target, sug = t.closest('[data-sug]'), ap = t.closest('[data-approve]'), rj = t.closest('[data-reject]'), un = t.closest('[data-undo]'), cv = t.closest('[data-conv]');
      if (sug) send(PROPOSALS[+sug.dataset.sug].ask);
      if (ap) { const i = +ap.dataset.approve; items[i].state = 'applied'; addLog(`Nisha Kapoor approved: ${items[i].p.title}. Change applied.`, 'applied', i); items.push({ kind: 'bot', text: 'Done. The change is live and recorded in the activity log.' }); draw(); }
      if (rj) { const i = +rj.dataset.reject; items[i].state = 'rejected'; addLog(`Nisha Kapoor rejected: ${items[i].p.title}. Nothing changed.`, 'rejected'); draw(); }
      if (un) { const i = +un.dataset.undo; items[i].state = 'undone'; addLog(`Nisha Kapoor undid: ${items[i].p.title}. Previous values restored.`, 'undone'); draw(); }
      if (cv) { st.conv = +cv.dataset.conv; draw(); }
    });
    $('[data-k="form"]').addEventListener('submit', e => {
      e.preventDefault();
      const input = e.target.elements.msg;
      send(input.value); input.value = '';
    });
    draw();
    return () => timers.forEach(clearTimeout);
  }
};
