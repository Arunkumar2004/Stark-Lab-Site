/* Sample 02: Support inbox with AI triage. Follows src/samples/_contract.md (prefix s-02-). */

const TICKETS = [
  { id: 4821, from: 'Priya Venkatesh', org: 'Saffron Lane Foods', subject: 'Charged twice for the October invoice', tag: 'Billing', pri: 'Urgent', mins: 6, sentiment: [-0.1, -0.4, -0.7],
    body: 'Hello, our card was charged twice for invoice INV-20931 (Rs 18,400 each). Please refund the duplicate today, our accounts close on Friday.',
    ai: { conf: 94, summary: 'Duplicate card charge on INV-20931. Customer wants a same-week refund.', reply: 'Hello Priya, thank you for flagging this. I can see two captures for INV-20931 and have raised a refund for the duplicate Rs 18,400. It should reach your card in 3 to 5 working days. I will confirm here once the bank acknowledges it.' } },
  { id: 4819, from: 'Tom Hallworth', org: 'Marlow & Finch', subject: 'SSO login loops back to the sign-in page', tag: 'Technical', pri: 'High', mins: 22, sentiment: [0, -0.2, -0.3],
    body: 'Since this morning, staff signing in through our identity provider land back on the sign-in page. Password login still works.',
    ai: { conf: 81, summary: 'SSO redirect loop after the IdP certificate rotation. Password login unaffected.', reply: 'Hello Tom, this pattern usually follows a certificate rotation on the identity provider side. Could you upload the new signing certificate under Settings, Single sign-on? I have also asked our platform team to check the logs for your workspace.' } },
  { id: 4816, from: 'Aisha Rahman', org: 'Bluepeak Clinics', subject: 'Can we add 40 more seats mid-cycle?', tag: 'Sales', pri: 'Normal', mins: 48, sentiment: [0.3, 0.4, 0.5],
    body: 'We are opening two more branches next month. Can we add 40 seats now and pay the difference pro rata?',
    ai: { conf: 88, summary: 'Expansion request: 40 seats, pro rata billing, two new branches.', reply: 'Hello Aisha, congratulations on the new branches. Yes, seats can be added at any time and the difference is billed pro rata on your next invoice. I have looped in your account manager, Kabir, to share a quote today.' } },
  { id: 4812, from: 'Rohan Mehta', org: 'Tidewater Labs', subject: 'Export to CSV drops the last column', tag: 'Technical', pri: 'Normal', mins: 95, sentiment: [0, -0.1, -0.1],
    body: 'When I export the shipments report the Remarks column is missing from the CSV. The on-screen table shows it.',
    ai: { conf: 72, summary: 'CSV export omits the Remarks column on the shipments report.', reply: 'Hello Rohan, thanks for the clear report. We have reproduced the missing Remarks column and logged it with engineering. As a workaround, the Excel export includes the column.' } },
  { id: 4807, from: 'Elena Duarte', org: 'Northwind Studio', subject: 'GST number on invoices', tag: 'Billing', pri: 'Normal', mins: 170, sentiment: [0.1, 0.1, 0.2],
    body: 'Please add our GSTIN 29ABCDE1234F1Z5 to future invoices and reissue September if possible.',
    ai: { conf: 90, summary: 'Add GSTIN to billing profile and reissue the September invoice.', reply: 'Hello Elena, I have added the GSTIN to your billing profile. Future invoices will carry it, and a reissued September invoice is attached to this thread.' } },
];

const CSS = `
.s-02-app{display:grid;grid-template-columns:190px 330px 1fr;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0F172A;background:#fff}
.s-02-app *{box-sizing:border-box}
.s-02-side{background:#F8FAFC;border-right:1px solid #E2E8F0;padding:16px 10px}
.s-02-brand{font-weight:700;padding:0 8px 14px;display:flex;gap:8px;align-items:center}
.s-02-mark{width:22px;height:22px;border-radius:50%;background:#0F766E}
.s-02-folder{display:flex;justify-content:space-between;padding:7px 10px;border-radius:7px;color:#475569;cursor:pointer}
.s-02-folder:hover{background:#EEF2F6}
.s-02-folder[data-on]{background:#CCFBF1;color:#115E59;font-weight:600}
.s-02-count{font-size:12px;color:#64748B}
.s-02-list{border-right:1px solid #E2E8F0;display:flex;flex-direction:column;min-height:0}
.s-02-listhead{padding:16px 16px 10px;border-bottom:1px solid #E2E8F0}
.s-02-title{margin:0 0 10px;font-size:19px}
.s-02-tabs{display:flex;gap:4px}
.s-02-tab{border:0;background:#F1F5F9;border-radius:6px;padding:4px 10px;font:inherit;font-size:12px;color:#475569;cursor:pointer}
.s-02-tab:hover{background:#E2E8F0}
.s-02-tab[data-on]{background:#0F766E;color:#fff}
.s-02-items{overflow:auto;flex:1}
.s-02-item{padding:12px 16px;border-bottom:1px solid #F1F5F9;cursor:pointer;border-left:3px solid transparent}
.s-02-item:hover{background:#F8FAFC}
.s-02-item[data-on]{background:#F0FDFA;border-left-color:#0F766E}
.s-02-item[data-done] .s-02-subj{color:#94A3B8;text-decoration:line-through}
.s-02-meta{display:flex;justify-content:space-between;font-size:12px;color:#64748B}
.s-02-subj{font-weight:600;margin:2px 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.s-02-badge{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;background:#F1F5F9;color:#475569;margin-right:4px}
.s-02-badge[data-p=Urgent]{background:#FEE2E2;color:#B91C1C}
.s-02-badge[data-p=High]{background:#FEF3C7;color:#92400E}
.s-02-detail{display:flex;flex-direction:column;min-height:0}
.s-02-dhead{padding:16px 22px;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center}
.s-02-dsub{font-size:17px;font-weight:700;margin:0}
.s-02-thread{flex:1;overflow:auto;padding:18px 22px;background:#FBFCFD}
.s-02-msg{background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:12px 14px;margin-bottom:12px;max-width:620px}
.s-02-msg[data-agent]{margin-left:auto;background:#F0FDFA;border-color:#99F6E4}
.s-02-who{font-size:12px;color:#64748B;margin-bottom:4px}
.s-02-ai{border:1px solid #99F6E4;border-radius:10px;padding:12px 14px;background:#fff;margin-bottom:12px;display:grid;grid-template-columns:64px 1fr;gap:12px;max-width:620px}
.s-02-ailabel{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#0F766E;font-weight:700}
.s-02-compose{border-top:1px solid #E2E8F0;padding:12px 22px}
.s-02-text{width:100%;min-height:74px;border:1px solid #CBD5E1;border-radius:8px;padding:8px 10px;font:inherit;resize:none}
.s-02-text:focus{outline:2px solid #5EEAD4;border-color:#0F766E}
.s-02-bar{display:flex;gap:8px;justify-content:flex-end;margin-top:8px;align-items:center}
.s-02-btn{border:1px solid #CBD5E1;background:#fff;border-radius:7px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer}
.s-02-btn:hover{background:#F1F5F9}
.s-02-primary{background:#0F766E;border-color:#0F766E;color:#fff}
.s-02-primary:hover{background:#115E59}
.s-02-switch{display:flex;align-items:center;gap:6px;font-size:12px;color:#475569;margin-right:auto;cursor:pointer}
.s-02-empty{padding:30px;color:#64748B;text-align:center}
`;

export default {
  id: '02-support-inbox',
  name: 'Support inbox with AI triage',
  category: 'AI',
  sector: 'Customer support',
  blurb: 'A shared support inbox where an assistant drafts triage and replies, and an agent reviews before anything is sent.',
  device: 'desktop',
  accent: '#0F766E',
  tags: ['inbox', 'AI triage', 'human review'],
  render(root) {
    const tickets = TICKETS.map(t => ({ ...t, thread: [{ who: t.from, text: t.body }], done: false }));
    const state = { tab: 'All', sel: tickets[0].id, resolveOnSend: true };
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const age = m => (m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`);
    root.innerHTML = `<style>${CSS}</style>
<div class="s-02-app">
  <aside class="s-02-side">
    <div class="s-02-brand"><span class="s-02-mark"></span>Helpwise Desk</div>
    ${[['Open', 5], ['Assigned to me', 3], ['Waiting on customer', 7], ['Escalations', 1], ['Resolved', 214]].map(([n, c], i) => `<div class="s-02-folder" ${i ? '' : 'data-on'}><span>${n}</span><span class="s-02-count">${c}</span></div>`).join('')}
  </aside>
  <section class="s-02-list">
    <div class="s-02-listhead"><h1 class="s-02-title">Open tickets</h1>
      <div class="s-02-tabs">${['All', 'Billing', 'Technical', 'Sales'].map(t => `<button type="button" class="s-02-tab" data-tab="${t}">${t}</button>`).join('')}</div></div>
    <div class="s-02-items"></div>
  </section>
  <section class="s-02-detail"></section>
</div>`;
    const $ = s => root.querySelector(s);

    function ring(conf) {
      const r = 24, c = 2 * Math.PI * r;
      return `<svg viewBox="0 0 64 64" width="64" height="64" aria-label="Confidence ${conf}%"><circle cx="32" cy="32" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="6"/>
        <circle cx="32" cy="32" r="${r}" fill="none" stroke="#0F766E" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(conf / 100) * c} ${c}" transform="rotate(-90 32 32)"/>
        <text x="32" y="36" text-anchor="middle" font-size="13" font-weight="700" fill="#0F172A">${conf}%</text></svg>`;
    }
    function spark(vals) {
      const p = vals.map((v, i) => `${i * 40 + 4},${20 - v * 14}`).join(' ');
      return `<svg viewBox="0 0 88 40" width="88" height="40"><line x1="0" x2="88" y1="20" y2="20" stroke="#E2E8F0" stroke-dasharray="3 3"/><polyline points="${p}" fill="none" stroke="#0F766E" stroke-width="2"/></svg>`;
    }
    function drawList() {
      const rows = tickets.filter(t => state.tab === 'All' || t.tag === state.tab);
      $('.s-02-items').innerHTML = rows.length ? rows.map(t => `<div class="s-02-item" data-id="${t.id}" ${t.id === state.sel ? 'data-on' : ''} ${t.done ? 'data-done' : ''}>
        <div class="s-02-meta"><span>${t.from} · ${t.org}</span><span>${age(t.mins)}</span></div>
        <div class="s-02-subj">${t.subject}</div>
        <span class="s-02-badge" data-p="${t.pri}">${t.pri}</span><span class="s-02-badge">${t.tag}</span><span class="s-02-badge">#${t.id}</span></div>`).join('')
        : '<div class="s-02-empty">No open tickets in this queue.</div>';
      root.querySelectorAll('.s-02-tab').forEach(b => b.toggleAttribute('data-on', b.dataset.tab === state.tab));
    }
    function drawDetail() {
      const t = tickets.find(x => x.id === state.sel);
      if (!t) { $('.s-02-detail').innerHTML = '<div class="s-02-empty">Select a ticket to read it.</div>'; return; }
      $('.s-02-detail').innerHTML = `<div class="s-02-dhead"><div><div class="s-02-who">#${t.id} · ${t.org}</div><h2 class="s-02-dsub">${t.subject}</h2></div>
        <div><span class="s-02-badge" data-p="${t.pri}">${t.pri}</span><span class="s-02-badge">${t.done ? 'Resolved' : 'Open'}</span></div></div>
      <div class="s-02-thread">
        <div class="s-02-ai">${ring(t.ai.conf)}<div><div class="s-02-ailabel">Assistant triage, needs your review</div>
          <div style="margin:4px 0">${t.ai.summary}</div>
          <div class="s-02-who">Suggested: ${t.tag} queue, ${t.pri} priority. Sentiment trend ${spark(t.sentiment)}</div></div></div>
        ${t.thread.map(m => `<div class="s-02-msg" ${m.agent ? 'data-agent' : ''}><div class="s-02-who">${m.who}</div>${m.text}</div>`).join('')}
      </div>
      <div class="s-02-compose"><textarea class="s-02-text" placeholder="Write a reply, or insert the assistant's draft"></textarea>
        <div class="s-02-bar"><label class="s-02-switch"><input type="checkbox" class="s-02-resolve" ${state.resolveOnSend ? 'checked' : ''}> Mark resolved on send</label>
          <button type="button" class="s-02-btn s-02-draft">Insert draft</button><button type="button" class="s-02-btn s-02-primary s-02-send">Send reply</button></div></div>`;
      const th = $('.s-02-thread'); th.scrollTop = th.scrollHeight;
    }

    root.addEventListener('click', e => {
      const tab = e.target.closest('.s-02-tab');
      if (tab) { state.tab = tab.dataset.tab; drawList(); return; }
      const item = e.target.closest('.s-02-item');
      if (item) { state.sel = +item.dataset.id; drawList(); drawDetail(); return; }
      const f = e.target.closest('.s-02-folder');
      if (f) { root.querySelectorAll('.s-02-folder').forEach(x => x.toggleAttribute('data-on', x === f)); return; }
      const t = tickets.find(x => x.id === state.sel);
      if (e.target.closest('.s-02-draft')) { $('.s-02-text').value = t.ai.reply; $('.s-02-text').focus(); }
      if (e.target.closest('.s-02-send')) {
        const text = $('.s-02-text').value.trim();
        if (!text) { $('.s-02-text').placeholder = 'Write something before sending.'; $('.s-02-text').focus(); return; }
        t.thread.push({ who: 'You · just now', text: esc(text), agent: true });
        if (state.resolveOnSend) t.done = true;
        drawList(); drawDetail();
      }
    });
    root.addEventListener('change', e => { if (e.target.classList.contains('s-02-resolve')) state.resolveOnSend = e.target.checked; });
    drawList(); drawDetail();
  },
};
