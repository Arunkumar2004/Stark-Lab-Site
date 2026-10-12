/* 14 Restaurant order screen: point-of-sale for a casual dining restaurant with floor plan, menu and GST bill. */

const CSS = `
.s-14-app{display:flex;flex-direction:column;height:100%;font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1f2329;background:#f6f6f4}
.s-14-top{display:flex;align-items:center;gap:18px;padding:10px 20px;background:#fff;border-bottom:1px solid #e5e5e0}
.s-14-brand{font-weight:700;font-size:15px}
.s-14-brand span{color:#b91c1c}
.s-14-tabs{display:flex;gap:4px}
.s-14-tab{border:0;background:none;font:inherit;padding:7px 14px;border-radius:8px;cursor:pointer;color:#5d636e}
.s-14-tab:hover{background:#f3f3f0}
.s-14-tab.s-14-on{background:#b91c1c;color:#fff;font-weight:600}
.s-14-clock{margin-left:auto;color:#7b818b;font-size:12px}
.s-14-body{flex:1;display:grid;grid-template-columns:270px 1fr 320px;min-height:0}
.s-14-floor{background:#fff;border-right:1px solid #e5e5e0;padding:14px;overflow:auto}
.s-14-h2{margin:0 0 10px;font-size:13px;font-weight:650;color:#3d424b}
.s-14-legend{display:flex;gap:10px;font-size:11px;color:#7b818b;margin-top:8px}
.s-14-lg{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px}
.s-14-menu{padding:14px 16px;overflow:auto}
.s-14-cats{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.s-14-cat{border:1px solid #dcdcd6;background:#fff;border-radius:999px;padding:5px 12px;font:inherit;font-size:12px;cursor:pointer}
.s-14-cat:hover{border-color:#b91c1c}
.s-14-cat.s-14-on{background:#1f2329;color:#fff;border-color:#1f2329}
.s-14-items{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.s-14-item{background:#fff;border:1px solid #e5e5e0;border-radius:10px;padding:12px;cursor:pointer;text-align:left;font:inherit;display:flex;flex-direction:column;gap:4px;min-height:84px}
.s-14-item:hover{border-color:#b91c1c;box-shadow:0 3px 10px rgba(0,0,0,.06)}
.s-14-item:active{transform:scale(.98)}
.s-14-veg{width:10px;height:10px;border:1.5px solid #15803d;display:inline-grid;place-items:center;margin-right:5px;vertical-align:-1px}
.s-14-veg::after{content:"";width:4px;height:4px;border-radius:50%;background:#15803d}
.s-14-veg.s-14-nv{border-color:#b91c1c}
.s-14-veg.s-14-nv::after{background:#b91c1c}
.s-14-price{margin-top:auto;color:#5d636e;font-weight:600}
.s-14-ticket{background:#fff;border-left:1px solid #e5e5e0;display:flex;flex-direction:column;min-height:0}
.s-14-th{padding:14px 16px;border-bottom:1px solid #eee}
.s-14-sub{color:#7b818b;font-size:12px}
.s-14-lines{flex:1;overflow:auto;padding:6px 16px}
.s-14-line{display:grid;grid-template-columns:1fr auto 64px;gap:8px;align-items:center;padding:8px 0;border-bottom:1px dashed #ecece8}
.s-14-sent{color:#7b818b}
.s-14-qty{display:flex;align-items:center;gap:6px}
.s-14-q{width:24px;height:24px;border-radius:6px;border:1px solid #dcdcd6;background:#fff;cursor:pointer;font:inherit;line-height:1}
.s-14-q:hover{border-color:#b91c1c;color:#b91c1c}
.s-14-amt{text-align:right}
.s-14-empty{color:#9aa0a8;text-align:center;padding:40px 10px}
.s-14-sum{padding:12px 16px;border-top:1px solid #eee;display:grid;grid-template-columns:1fr auto;gap:4px;font-size:12px}
.s-14-total{font-size:16px;font-weight:700;margin-top:4px}
.s-14-acts{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px 16px}
.s-14-btn{border:0;border-radius:9px;padding:11px;font:inherit;font-weight:600;cursor:pointer;background:#f1f1ee;color:#1f2329}
.s-14-btn:hover{background:#e6e6e1}
.s-14-btn.s-14-pri{background:#b91c1c;color:#fff}
.s-14-btn.s-14-pri:hover{background:#991b1b}
.s-14-btn:disabled{opacity:.45;cursor:not-allowed}
.s-14-toast{font-size:12px;color:#15803d;padding:0 16px 10px;min-height:18px}
`;

const MENU = [
  ['Starters', 'Paneer tikka', 320, 1], ['Starters', 'Chicken 65', 340, 0], ['Starters', 'Hara bhara kebab', 260, 1], ['Starters', 'Tandoori prawns', 520, 0],
  ['Mains', 'Dal makhani', 290, 1], ['Mains', 'Butter chicken', 420, 0], ['Mains', 'Malabar fish curry', 460, 0], ['Mains', 'Kadai vegetables', 300, 1], ['Mains', 'Mutton biryani', 480, 0],
  ['Breads', 'Butter naan', 70, 1], ['Breads', 'Garlic naan', 90, 1], ['Breads', 'Malabar parotta', 80, 1],
  ['Drinks', 'Masala chaas', 90, 1], ['Drinks', 'Fresh lime soda', 110, 1], ['Drinks', 'Filter coffee', 80, 1],
  ['Desserts', 'Gulab jamun', 140, 1], ['Desserts', 'Rasmalai', 160, 1]
].map(([cat, name, price, veg], i) => ({ id: i, cat, name, price, veg }));
const TABLES = [
  { id: 'T1', x: 20, y: 20, seats: 2 }, { id: 'T2', x: 95, y: 20, seats: 2 }, { id: 'T3', x: 170, y: 20, seats: 4 },
  { id: 'T4', x: 20, y: 100, seats: 4 }, { id: 'T5', x: 95, y: 100, seats: 6 }, { id: 'T6', x: 170, y: 100, seats: 4 },
  { id: 'T7', x: 20, y: 180, seats: 8 }, { id: 'T8', x: 170, y: 180, seats: 2 }
];
const inr = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default {
  id: '14-restaurant-orders',
  name: 'Restaurant order screen',
  category: 'Commerce',
  sector: 'Hospitality',
  blurb: 'Floor staff pick a table, punch in dishes, send the kitchen order ticket and settle the bill with GST worked out.',
  device: 'desktop',
  accent: '#B91C1C',
  tags: ['POS', 'floor plan', 'GST billing'],
  render(root) {
    const orders = {
      T3: [{ id: 0, qty: 2, sent: 2 }, { id: 9, qty: 4, sent: 4 }, { id: 5, qty: 1, sent: 1 }],
      T5: [{ id: 8, qty: 3, sent: 3 }, { id: 12, qty: 3, sent: 0 }],
      T7: [{ id: 6, qty: 2, sent: 2 }]
    };
    const st = { mode: 'Dine-in', cat: 'All', table: 'T5', toast: '' };

    root.innerHTML = `<style>${CSS}</style>
      <div class="s-14-app">
        <header class="s-14-top"><div class="s-14-brand">Saffron <span>Table</span></div>
          <div class="s-14-tabs">${['Dine-in', 'Takeaway', 'Delivery'].map(m => `<button class="s-14-tab" data-mode="${m}">${m}</button>`).join('')}</div>
          <div class="s-14-clock">Indiranagar outlet · Shift: K. Fernandes · Wed 7 Oct, 13:42</div></header>
        <div class="s-14-body">
          <section class="s-14-floor" data-k="floor"></section>
          <section class="s-14-menu"><div class="s-14-cats" data-k="cats"></div><div class="s-14-items" data-k="items"></div></section>
          <aside class="s-14-ticket" data-k="ticket"></aside>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);
    const key = () => (st.mode === 'Dine-in' ? st.table : st.mode);
    const lines = () => (orders[key()] = orders[key()] || []);

    const drawFloor = () => {
      const f = $('[data-k="floor"]');
      if (st.mode !== 'Dine-in') {
        f.innerHTML = `<h2 class="s-14-h2">${st.mode} queue</h2><div class="s-14-sub">${st.mode === 'Takeaway' ? 'Token 47 is being prepared. Next token: 48.' : 'Partner pickups: 2 riders waiting, average 6 min.'}</div>`;
        return;
      }
      const svg = TABLES.map(t => {
        const o = orders[t.id] || [], busy = o.length > 0, pending = o.some(l => l.qty > l.sent), sel = t.id === st.table;
        const w = t.seats > 6 ? 130 : 60, fill = pending ? '#fde68a' : busy ? '#fecaca' : '#e7f5ec';
        return `<g data-table="${t.id}" style="cursor:pointer"><rect x="${t.x}" y="${t.y}" width="${w}" height="60" rx="10" fill="${fill}" stroke="${sel ? '#b91c1c' : '#d4d4ce'}" stroke-width="${sel ? 2.5 : 1}"/>
          <text x="${t.x + w / 2}" y="${t.y + 28}" text-anchor="middle" font-size="13" font-weight="700" fill="#1f2329">${t.id}</text>
          <text x="${t.x + w / 2}" y="${t.y + 44}" text-anchor="middle" font-size="10" fill="#5d636e">${t.seats} seats</text><title>${t.id}: ${busy ? 'occupied' : 'free'}</title></g>`;
      }).join('');
      f.innerHTML = `<h2 class="s-14-h2">Ground floor</h2><svg viewBox="0 0 250 250" width="100%" role="img" aria-label="Table floor plan">${svg}</svg>
        <div class="s-14-legend"><span><i class="s-14-lg" style="background:#e7f5ec;border:1px solid #bbb"></i>Free</span><span><i class="s-14-lg" style="background:#fecaca"></i>Occupied</span><span><i class="s-14-lg" style="background:#fde68a"></i>Items not sent</span></div>`;
    };

    const drawMenu = () => {
      $('[data-k="cats"]').innerHTML = ['All', 'Starters', 'Mains', 'Breads', 'Drinks', 'Desserts'].map(c => `<button class="s-14-cat s-14-${c===st.cat?'on':'off'}" data-cat="${c}">${c}</button>`).join('');
      $('[data-k="items"]').innerHTML = MENU.filter(m => st.cat === 'All' || m.cat === st.cat).map(m => `<button class="s-14-item" data-add="${m.id}">
        <span><i class="s-14-veg s-14-${m.veg?'v':'nv'}"></i>${m.name}</span><span class="s-14-sub">${m.cat}</span><span class="s-14-price">${inr(m.price)}</span></button>`).join('');
    };

    const drawTicket = () => {
      const ls = lines(), sub = ls.reduce((a, l) => a + MENU[l.id].price * l.qty, 0);
      const svc = st.mode === 'Dine-in' ? Math.round(sub * 0.05) : 0, cgst = (sub + svc) * 0.025, total = Math.round(sub + svc + cgst * 2);
      const unsent = ls.some(l => l.qty > l.sent);
      $('[data-k="ticket"]').innerHTML = `<div class="s-14-th"><b>${st.mode === 'Dine-in' ? 'Table ' + st.table : st.mode + ' order'}</b><div class="s-14-sub">${ls.length ? ls.reduce((a, l) => a + l.qty, 0) + ' items' : 'No items yet'}</div></div>
        <div class="s-14-lines">${ls.length ? ls.map((l, i) => `<div class="s-14-line"><div>${MENU[l.id].name}${l.sent ? `<div class="s-14-sub s-14-sent">${l.sent} sent to kitchen</div>` : ''}</div>
          <div class="s-14-qty"><button class="s-14-q" data-dq="-1" data-i="${i}" aria-label="Less">-</button>${l.qty}<button class="s-14-q" data-dq="1" data-i="${i}" aria-label="More">+</button></div>
          <div class="s-14-amt">${inr(MENU[l.id].price * l.qty)}</div></div>`).join('') : '<div class="s-14-empty">Tap a dish to start the order</div>'}</div>
        <div class="s-14-sum"><span>Subtotal</span><span>${inr(sub)}</span>${svc ? `<span>Service charge 5%</span><span>${inr(svc)}</span>` : ''}
          <span>CGST 2.5%</span><span>${inr(cgst)}</span><span>SGST 2.5%</span><span>${inr(cgst)}</span>
          <span class="s-14-total">Total</span><span class="s-14-total">${inr(total)}</span></div>
        <div class="s-14-toast">${st.toast}</div>
        <div class="s-14-acts"><button class="s-14-btn" data-k="bill" ${ls.length && !unsent ? '' : 'disabled'}>Settle bill</button><button class="s-14-btn s-14-pri" data-k="kot" ${unsent ? '' : 'disabled'}>Send to kitchen</button></div>`;
      st.toast = '';
    };
    const draw = () => {
      root.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('s-14-on', b.dataset.mode === st.mode));
      drawFloor(); drawMenu(); drawTicket();
    };

    root.addEventListener('click', e => {
      const t = e.target.closest('[data-table]'), m = e.target.closest('[data-mode]'), c = e.target.closest('[data-cat]');
      const add = e.target.closest('[data-add]'), q = e.target.closest('[data-dq]');
      if (m) { st.mode = m.dataset.mode; draw(); } else if (t) { st.table = t.dataset.table; draw(); } else if (c) { st.cat = c.dataset.cat; drawMenu(); } else if (add) {
        const ls = lines(), id = +add.dataset.add, l = ls.find(x => x.id === id);
        if (l) l.qty++; else ls.push({ id, qty: 1, sent: 0 });
        drawFloor(); drawTicket();
      } else if (q) {
        const ls = lines(), l = ls[+q.dataset.i];
        l.qty = Math.max(l.sent, l.qty + +q.dataset.dq);
        if (l.qty === 0) ls.splice(+q.dataset.i, 1);
        if (+q.dataset.dq < 0 && l.qty === l.sent && l.sent) st.toast = 'Sent items can only be voided by a manager.';
        drawFloor(); drawTicket();
      } else if (e.target.closest('[data-k="kot"]')) {
        const n = lines().reduce((a, l) => a + l.qty - l.sent, 0);
        lines().forEach(l => { l.sent = l.qty; });
        st.toast = `Kitchen order ticket sent: ${n} item${n === 1 ? '' : 's'}.`; draw();
      } else if (e.target.closest('[data-k="bill"]')) {
        delete orders[key()];
        st.toast = 'Bill settled by UPI. Table is free.'; drawFloor(); drawTicket();
      }
    });
    draw();
  }
};
