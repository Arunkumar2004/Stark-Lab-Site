/* 17 Wallet and payments: a mobile wallet with UPI transfers, spend insights and card controls. */

const CSS = `
.s-17-app{height:100%;display:flex;flex-direction:column;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#17202b;background:#f4f5f7}
.s-17-status{height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;font-size:13px;font-weight:600}
.s-17-view{flex:1;overflow:auto;padding:4px 18px 18px}
.s-17-hi{display:flex;justify-content:space-between;align-items:center;margin:4px 0 14px}
.s-17-hi h1{margin:0;font-size:22px}
.s-17-av{width:40px;height:40px;border-radius:50%;background:#dff3ea;color:#047857;display:grid;place-items:center;font-weight:700}
.s-17-bal{background:linear-gradient(135deg,#047857,#065f46);color:#fff;border-radius:20px;padding:18px;box-shadow:0 10px 24px rgba(4,120,87,.25)}
.s-17-bl{opacity:.8;font-size:12px;display:flex;justify-content:space-between;align-items:center}
.s-17-eye{border:0;background:rgba(255,255,255,.16);color:#fff;border-radius:999px;padding:4px 10px;font:inherit;font-size:12px;cursor:pointer}
.s-17-amt{font-size:30px;font-weight:700;margin:6px 0 2px;letter-spacing:-.5px}
.s-17-quick{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0}
.s-17-q{border:0;background:#fff;border-radius:16px;padding:12px 4px;font:inherit;font-size:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;min-height:72px}
.s-17-q:active,.s-17-row:active{transform:scale(.97)}
.s-17-qi{width:34px;height:34px;border-radius:12px;background:#e7f6ef;display:grid;place-items:center;color:#047857;font-weight:700}
.s-17-sec{display:flex;justify-content:space-between;align-items:baseline;margin:18px 0 8px}
.s-17-sec h2{margin:0;font-size:16px}
.s-17-link{color:#047857;font-size:13px;border:0;background:none;font:inherit;cursor:pointer}
.s-17-card{background:#fff;border-radius:16px;padding:6px 14px}
.s-17-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #f0f1f3}
.s-17-row:last-child{border-bottom:0}
.s-17-ico{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-weight:700;font-size:13px;flex:none}
.s-17-grow{flex:1;min-width:0}
.s-17-sub{color:#7b8491;font-size:12px}
.s-17-neg{font-weight:600}
.s-17-pos{font-weight:600;color:#047857}
.s-17-contacts{display:flex;gap:12px;overflow-x:auto;padding:4px 0 10px}
.s-17-contact{border:0;background:none;font:inherit;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;min-width:62px}
.s-17-contact .s-17-av{border:2px solid transparent}
.s-17-contact.s-17-on .s-17-av{border-color:#047857}
.s-17-big{width:100%;box-sizing:border-box;border:0;background:#fff;border-radius:16px;padding:18px;font:inherit;font-size:30px;font-weight:700;text-align:center}
.s-17-big:focus{outline:2px solid #a7e3c9}
.s-17-chips{display:flex;gap:8px;margin:10px 0}
.s-17-chip{flex:1;border:1px solid #d9dde3;background:#fff;border-radius:999px;padding:8px;font:inherit;font-size:13px;cursor:pointer}
.s-17-chip.s-17-on{background:#047857;border-color:#047857;color:#fff}
.s-17-note{width:100%;box-sizing:border-box;border:1px solid #d9dde3;border-radius:12px;padding:12px;font:inherit;margin-bottom:12px;background:#fff}
.s-17-btn{width:100%;border:0;background:#047857;color:#fff;border-radius:16px;padding:15px;font:inherit;font-weight:700;font-size:15px;cursor:pointer}
.s-17-btn:disabled{background:#a6b5ae}
.s-17-msg{text-align:center;font-size:13px;margin-top:10px;min-height:20px;color:#047857}
.s-17-msg.s-17-err{color:#b42318}
.s-17-ringwrap{display:flex;align-items:center;gap:16px;background:#fff;border-radius:16px;padding:16px}
.s-17-bar{height:8px;border-radius:4px;background:#eef0f2;overflow:hidden;margin-top:6px}
.s-17-bar i{display:block;height:100%;border-radius:4px;background:#047857}
.s-17-plastic{height:190px;border-radius:20px;background:linear-gradient(135deg,#1f2937,#047857);color:#fff;padding:20px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;transition:filter .2s}
.s-17-plastic.s-17-frozen{filter:grayscale(1) brightness(.85)}
.s-17-tog{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #f0f1f3}
.s-17-sw{width:48px;height:28px;border-radius:999px;border:0;background:#cfd4da;position:relative;cursor:pointer;flex:none}
.s-17-sw::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.s-17-sw.s-17-on{background:#047857}
.s-17-sw.s-17-on::after{left:23px}
.s-17-tabs{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:1px solid #e6e8eb;padding:8px 6px 22px}
.s-17-tab{border:0;background:none;font:inherit;font-size:11px;color:#8a929e;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px}
.s-17-tab.s-17-on{color:#047857;font-weight:600}
`;

const PEOPLE = [
  ['Riya S.', 'riya.s@okaxis'],
  ['Kabir M.', 'kabir.m@oksbi'],
  ['Elena V.', 'elena.v@okicici'],
  ['Arjun P.', 'arjun.p@ybl'],
  ['Zoya K.', 'zoya.k@okhdfc']
];
const CATS = [
  ['Food', 6420, '#047857'],
  ['Travel', 4180, '#10b981'],
  ['Bills', 3550, '#6ee7b7'],
  ['Shopping', 2890, '#a7f3d0']
];
const inr = n => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
const ICONS = { home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', pay: 'M4 12h14M13 6l6 6-6 6', insights: 'M5 20V10M12 20V4M19 20v-7', cards: 'M3 6h18v12H3zM3 10h18' };

export default {
  id: '17-fintech-wallet',
  name: 'Wallet and payments',
  category: 'Mobile',
  sector: 'Fintech',
  blurb: 'A UPI wallet for everyday payments: check the balance, pay a contact, see where the money went and freeze a card in one tap.',
  device: 'phone',
  accent: '#047857',
  tags: ['UPI', 'payments', 'mobile app'],
  render(root) {
    const st = { tab: 'home', hide: false, bal: 48250.75, to: 0, freeze: false, intl: false, online: true, msg: '', err: false };
    const tx = [
      { who: 'Blue Tokai Coffee', sub: 'Today, 09:12', amt: -340, c: '#fef3c7' },
      { who: 'Salary: Orbitron Labs', sub: 'Yesterday', amt: 86500, c: '#dcfce7' },
      { who: 'Riya S.', sub: 'Yesterday, Split dinner', amt: -1250, c: '#e0e7ff' },
      { who: 'Namma Metro top-up', sub: '4 Oct', amt: -500, c: '#fce7f3' },
      { who: 'BESCOM electricity', sub: '3 Oct', amt: -2184, c: '#e0f2fe' }
    ];

    root.innerHTML = `<style>${CSS}</style><div class="s-17-app"><div class="s-17-status"><span>9:41</span><span>5G  86%</span></div><div class="s-17-view" data-k="view"></div>
      <nav class="s-17-tabs">${Object.keys(ICONS).map(t => `<button class="s-17-tab" data-tab="${t}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[t]}"/></svg>${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</nav></div>`;
    const $ = s => root.querySelector(s);
    const txRows = list => list.map(t => `<div class="s-17-row"><span class="s-17-ico" style="background:${t.c}">${t.who.split(/[ :]/)[0].slice(0, 2).toUpperCase()}</span><div class="s-17-grow"><div>${t.who}</div><div class="s-17-sub">${t.sub}</div></div><span class="s-17-${t.amt<0?'neg':'pos'}">${t.amt < 0 ? '-' : '+'}${inr(Math.abs(t.amt))}</span></div>`).join('');

    const home = () => `<div class="s-17-hi"><div><div class="s-17-sub">Good morning</div><h1>Aarav Shah</h1></div><span class="s-17-av">AS</span></div>
      <div class="s-17-bal"><div class="s-17-bl"><span>Wallet balance</span><button class="s-17-eye" data-k="hide">${st.hide ? 'Show' : 'Hide'}</button></div>
        <div class="s-17-amt">${st.hide ? '₹ ••••••' : inr(st.bal)}</div><div class="s-17-bl">UPI ID aarav.shah@pinewallet</div></div>
      <div class="s-17-quick">${[['Pay', 'pay', '→'], ['Scan QR', 'pay', '▣'], ['Bills', 'insights', '₹'], ['Cards', 'cards', '▭']].map(q => `<button class="s-17-q" data-tab="${q[1]}"><span class="s-17-qi">${q[2]}</span>${q[0]}</button>`).join('')}</div>
      <div class="s-17-sec"><h2>Recent activity</h2><button class="s-17-link" data-tab="insights">Insights</button></div><div class="s-17-card">${txRows(tx.slice(0, 5))}</div>`;

    const pay = () => `<div class="s-17-hi"><h1>Send money</h1></div>
      <div class="s-17-contacts">${PEOPLE.map((p, i) => `<button class="s-17-contact s-17-${i===st.to?'on':'off'}" data-to="${i}"><span class="s-17-av">${p[0].slice(0, 1)}${p[0].split(' ')[1][0]}</span>${p[0]}</button>`).join('')}</div>
      <div class="s-17-sub" style="margin-bottom:8px">To ${PEOPLE[st.to][0]} · ${PEOPLE[st.to][1]}</div>
      <input class="s-17-big" data-k="amt" inputmode="decimal" placeholder="₹0" aria-label="Amount">
      <div class="s-17-chips">${[200, 500, 1000].map(v => `<button class="s-17-chip" data-quick="${v}">${inr(v)}</button>`).join('')}</div>
      <input class="s-17-note" data-k="note" placeholder="Add a note (optional)" maxlength="40">
      <button class="s-17-btn" data-k="send">Pay securely</button><div class="s-17-msg s-17-${st.err?'err':'ok'}">${st.msg}</div>
      <div class="s-17-sub" style="text-align:center;margin-top:6px">Daily UPI limit ₹1,00,000 · Available ${inr(st.bal)}</div>`;

    const ring = () => {
      const total = CATS.reduce((a, c) => a + c[1], 0), r = 52, C = 2 * Math.PI * r;
      let off = 0;
      const arcs = CATS.map(c => { const len = (c[1] / total) * C, s = `<circle cx="64" cy="64" r="${r}" fill="none" stroke="${c[2]}" stroke-width="14" stroke-dasharray="${len - 2} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 64 64)"><title>${c[0]}: ${inr(c[1])}</title></circle>`; off += len; return s; }).join('');
      return `<svg width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Spend by category">${arcs}<text x="64" y="60" text-anchor="middle" font-size="11" fill="#7b8491">October</text><text x="64" y="78" text-anchor="middle" font-size="16" font-weight="700" fill="#17202b">${inr(total)}</text></svg>`;
    };
    const insights = () => {
      const budget = 20000, spent = CATS.reduce((a, c) => a + c[1], 0);
      return `<div class="s-17-hi"><h1>Insights</h1></div><div class="s-17-ringwrap">${ring()}<div>${CATS.map(c => `<div style="font-size:13px;margin:3px 0"><span style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${c[2]};margin-right:6px"></span>${c[0]} <b>${inr(c[1])}</b></div>`).join('')}</div></div>
        <div class="s-17-sec"><h2>Monthly budget</h2><span class="s-17-sub">${Math.round((spent / budget) * 100)}% used</span></div>
        <div class="s-17-card" style="padding:14px"><div style="display:flex;justify-content:space-between"><span>${inr(spent)} spent</span><span class="s-17-sub">of ${inr(budget)}</span></div><div class="s-17-bar"><i style="width:${Math.min(100, (spent / budget) * 100)}%"></i></div><div class="s-17-sub" style="margin-top:8px">${inr(budget - spent)} left for 24 days, about ${inr(Math.round((budget - spent) / 24))} a day.</div></div>
        <div class="s-17-sec"><h2>All transactions</h2></div><div class="s-17-card">${txRows(tx)}</div>`;
    };
    const cards = () => `<div class="s-17-hi"><h1>Cards</h1></div>
      <div class="s-17-plastic s-17-${st.freeze?'frozen':'live'}"><div style="display:flex;justify-content:space-between"><b>Pine Wallet</b><span>${st.freeze ? 'Frozen' : 'Virtual'}</span></div>
        <div style="font-size:18px;letter-spacing:2px">•••• •••• •••• 4821</div><div style="display:flex;justify-content:space-between;font-size:12px"><span>AARAV SHAH</span><span>09/29</span></div></div>
      <div class="s-17-card" style="margin-top:16px">${[['freeze', 'Freeze card', 'Blocks all new payments instantly'], ['online', 'Online payments', 'Shopping sites and apps'], ['intl', 'International use', 'Off by default for safety']].map(([k, a, b]) => `<div class="s-17-tog"><div><div>${a}</div><div class="s-17-sub">${b}</div></div><button class="s-17-sw s-17-${st[k]?'on':'off'}" data-sw="${k}" aria-pressed="${st[k]}" aria-label="${a}"></button></div>`).join('')}</div>`;

    const draw = () => {
      $('[data-k="view"]').innerHTML = { home, pay, insights, cards }[st.tab]();
      root.querySelectorAll('.s-17-tab').forEach(b => b.classList.toggle('s-17-on', b.dataset.tab === st.tab));
    };

    root.addEventListener('click', e => {
      const t = e.target, tab = t.closest('[data-tab]'), to = t.closest('[data-to]'), q = t.closest('[data-quick]'), sw = t.closest('[data-sw]');
      if (tab) { st.tab = tab.dataset.tab; st.msg = ''; draw(); $('[data-k="view"]').scrollTop = 0; return; }
      if (t.closest('[data-k="hide"]')) { st.hide = !st.hide; draw(); return; }
      if (to) { st.to = +to.dataset.to; st.msg = ''; draw(); return; }
      if (q) { $('[data-k="amt"]').value = q.dataset.quick; return; }
      if (sw) { st[sw.dataset.sw] = !st[sw.dataset.sw]; draw(); return; }
      if (t.closest('[data-k="send"]')) {
        const amt = Math.round(parseFloat($('[data-k="amt"]').value.replace(/[^0-9.]/g, '')) * 100) / 100;
        const note = $('[data-k="note"]').value.trim();
        if (!amt || amt <= 0) { st.msg = 'Enter an amount to pay.'; st.err = true; }
        else if (amt > st.bal) { st.msg = 'That is more than your wallet balance.'; st.err = true; }
        else {
          st.bal -= amt; st.err = false; st.msg = `Paid ${inr(amt)} to ${PEOPLE[st.to][0]}. Reference UPI ${Math.floor(400000000 + amt * 997) % 1e9}.`;
          tx.unshift({ who: PEOPLE[st.to][0], sub: 'Just now' + (note ? ', ' + note.replace(/</g, '') : ''), amt: -amt, c: '#e0e7ff' });
        }
        draw();
      }
    });
    draw();
  }
};
