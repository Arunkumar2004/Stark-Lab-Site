/* 19 Delivery tracking: a food delivery app showing the rider live on a map, the order bill with tip, and help options. */

const CSS = `
.s-19-app{height:100%;display:flex;flex-direction:column;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d1f24;background:#f5f5f5}
.s-19-status{height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;font-size:13px;font-weight:600;background:#fff}
.s-19-view{flex:1;overflow:auto;position:relative}
.s-19-pad{padding:14px 16px 20px}
.s-19-h1{margin:0 0 4px;font-size:22px}
.s-19-sub{color:#71767f;font-size:12px}
.s-19-map{display:block;width:100%;height:330px;background:#eef1ec}
.s-19-sheet{background:#fff;border-radius:22px 22px 0 0;margin-top:-22px;position:relative;padding:18px 18px 16px;box-shadow:0 -6px 20px rgba(0,0,0,.06)}
.s-19-eta{display:flex;justify-content:space-between;align-items:center}
.s-19-mins{font-size:28px;font-weight:750;color:#e23744}
.s-19-steps{display:flex;gap:4px;margin:14px 0}
.s-19-step{flex:1;height:5px;border-radius:3px;background:#ececec}
.s-19-step.s-19-on{background:#e23744}
.s-19-rider{display:flex;align-items:center;gap:12px;padding:12px;background:#fafafa;border-radius:16px}
.s-19-av{width:44px;height:44px;border-radius:50%;background:#ffe1e3;color:#b4232f;display:grid;place-items:center;font-weight:700;flex:none}
.s-19-grow{flex:1;min-width:0}
.s-19-round{width:44px;height:44px;border-radius:50%;border:1px solid #e3e3e3;background:#fff;cursor:pointer;display:grid;place-items:center}
.s-19-round:hover{border-color:#e23744}
.s-19-callbar{margin-top:10px;background:#1d1f24;color:#fff;border-radius:14px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-size:13px}
.s-19-end{border:0;background:#e23744;color:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:12px;cursor:pointer}
.s-19-card{background:#fff;border-radius:16px;padding:14px;margin-bottom:12px}
.s-19-line{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
.s-19-veg{display:inline-block;width:9px;height:9px;border:1.5px solid #15803d;margin-right:6px;position:relative;top:0}
.s-19-veg.s-19-nv{border-color:#b4232f}
.s-19-tot{font-weight:750;font-size:16px;border-top:1px dashed #ddd;margin-top:6px;padding-top:10px}
.s-19-tips{display:flex;gap:8px;margin-top:10px}
.s-19-tip{flex:1;border:1px solid #e0e0e0;background:#fff;border-radius:12px;padding:10px 0;font:inherit;font-weight:600;cursor:pointer;min-height:44px}
.s-19-tip.s-19-on{border-color:#e23744;background:#fff1f2;color:#b4232f}
.s-19-help{width:100%;text-align:left;border:0;background:#fff;border-radius:14px;padding:16px;margin-bottom:8px;font:inherit;cursor:pointer;display:flex;justify-content:space-between}
.s-19-help:hover{background:#fff6f6}
.s-19-reply{background:#fff1f2;color:#7f1d1d;border-radius:14px;padding:14px;font-size:13px;margin-bottom:12px}
.s-19-stars{display:flex;gap:6px;justify-content:center;margin:10px 0}
.s-19-star{border:0;background:none;cursor:pointer;padding:2px}
.s-19-rest{display:flex;gap:12px;background:#fff;border-radius:16px;padding:12px;margin-bottom:10px;align-items:center}
.s-19-thumb{width:64px;height:64px;border-radius:12px;flex:none}
.s-19-pill{display:inline-flex;gap:6px;align-items:center;border:1px solid #ddd;background:#fff;border-radius:999px;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer;margin:10px 6px 12px 0}
.s-19-pill.s-19-on{border-color:#15803d;color:#15803d;background:#effaf2}
.s-19-tabs{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:1px solid #e8e8e8;padding:8px 6px 22px}
.s-19-tab{border:0;background:none;font:inherit;font-size:11px;color:#9a9ea6;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px}
.s-19-tab.s-19-on{color:#e23744;font-weight:600}
`;

const ROUTE = [[300, 60], [300, 140], [210, 140], [210, 230], [120, 230], [120, 290], [70, 290]];
const ITEMS = [['Hyderabadi chicken biryani', 1, 389, 0], ['Paneer butter masala', 1, 279, 1], ['Butter naan', 3, 59, 1], ['Mango lassi', 2, 99, 1]];
const RESTS = [['Biryani Junction', 'Biryani, Mughlai', 4.4, 28, 0, 8], ['Green Bowl Kitchen', 'Salads, Healthy', 4.6, 22, 1, 140], ['Kombu Ramen Bar', 'Japanese, Noodles', 4.3, 35, 0, 20], ['Udupi Sagar', 'South Indian, Tiffin', 4.5, 18, 1, 40]];
const STEPS = ['Order placed', 'Being prepared', 'Picked up', 'Arriving', 'Delivered'];
const inr = n => '₹' + n.toLocaleString('en-IN');
const ICONS = { home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', track: 'M12 21s7-6.1 7-11a7 7 0 0 0-14 0c0 4.9 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', order: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6', help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01' };

export default {
  id: '19-food-delivery',
  name: 'Delivery tracking',
  category: 'Mobile',
  sector: 'Food delivery',
  blurb: 'Customers watch their rider move across the map in real time, adjust the tip, get help with an order and rate the delivery.',
  device: 'phone',
  accent: '#E23744',
  tags: ['live tracking', 'consumer app', 'map'],
  render(root) {
    const st = { tab: 'track', p: 0.18, tip: 30, call: false, help: null, rating: 0, veg: false };
    const segLen = ROUTE.slice(1).map((pt, i) => Math.hypot(pt[0] - ROUTE[i][0], pt[1] - ROUTE[i][1]));
    const total = segLen.reduce((a, b) => a + b, 0);
    const pos = p => {
      let d = p * total;
      for (let i = 0; i < segLen.length; i++) {
        if (d <= segLen[i]) { const f = d / segLen[i]; return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * f, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * f]; }
        d -= segLen[i];
      }
      return ROUTE[ROUTE.length - 1];
    };

    root.innerHTML = `<style>${CSS}</style><div class="s-19-app"><div class="s-19-status"><span>20:14</span><span>5G  64%</span></div><div class="s-19-view" data-k="view"></div>
      <nav class="s-19-tabs">${Object.keys(ICONS).map(t => `<button class="s-19-tab" data-tab="${t}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[t]}"/></svg>${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</nav></div>`;
    const $ = s => root.querySelector(s);
    const step = () => (st.p >= 1 ? 4 : st.p > 0.75 ? 3 : 2);
    const mins = () => Math.max(0, Math.ceil((1 - st.p) * 14));

    const mapSvg = () => {
      const [rx, ry] = pos(st.p), path = ROUTE.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
      const blocks = [[20, 20, 90, 90], [130, 20, 60, 100], [230, 170, 120, 40], [20, 160, 80, 50], [150, 250, 200, 70], [230, 20, 50, 100], [320, 20, 60, 100]].map(b => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="6" fill="#e1e6df"/>`).join('');
      return `<svg class="s-19-map" viewBox="0 0 390 330" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Live map of rider route">${blocks}
        <rect x="16" y="215" width="80" height="60" rx="8" fill="#d4ead6"/><text x="56" y="250" font-size="10" text-anchor="middle" fill="#5d7d61">Cubbon Park</text>
        <path d="${path}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${path}" fill="none" stroke="#e23744" stroke-width="4" stroke-dasharray="1 7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="300" cy="60" r="9" fill="#1d1f24"/><text x="300" y="40" font-size="10" text-anchor="middle" fill="#1d1f24">Biryani Junction</text>
        <circle cx="70" cy="290" r="11" fill="#e23744" stroke="#fff" stroke-width="3"/><text x="70" y="318" font-size="10" text-anchor="middle" fill="#1d1f24">Home</text>
        <g data-k="rider" transform="translate(${rx},${ry})"><circle r="16" fill="#e23744" opacity=".18"/><circle r="10" fill="#fff" stroke="#e23744" stroke-width="3"/></g></svg>`;
    };

    const track = () => `${mapSvg()}<div class="s-19-sheet">
      <div class="s-19-eta"><div><div class="s-19-sub">${STEPS[step()]}</div><div class="s-19-mins" data-k="mins">${st.p >= 1 ? 'Delivered' : mins() + ' min'}</div></div><div class="s-19-sub" style="text-align:right">Order #FD-58213<br>Biryani Junction</div></div>
      <div class="s-19-steps">${STEPS.map((s, i) => `<span class="s-19-step s-19-${i<=step()?'on':'off'}" title="${s}"></span>`).join('')}</div>
      ${st.p >= 1 ? `<div style="text-align:center"><b>How was your delivery?</b><div class="s-19-stars">${[1, 2, 3, 4, 5].map(n => `<button class="s-19-star" data-rate="${n}" aria-label="${n} stars"><svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" fill="${n <= st.rating ? '#f5a524' : '#e3e3e3'}"/></svg></button>`).join('')}</div><div class="s-19-sub">${st.rating ? 'Thanks. Your rating helps Vikram and the kitchen.' : 'Tap a star'}</div></div>`
      : `<div class="s-19-rider"><span class="s-19-av">VR</span><div class="s-19-grow"><b>Vikram Reddy</b><div class="s-19-sub">Electric scooter · KA 03 EV 4417 · 4.8 rating</div></div>
        <button class="s-19-round" data-k="call" aria-label="Call rider"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e23744" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg></button></div>
        ${st.call ? '<div class="s-19-callbar"><span>Calling Vikram through a masked number...</span><button class="s-19-end" data-k="call">End</button></div>' : ''}`}</div>`;

    const order = () => {
      const sub = ITEMS.reduce((a, i) => a + i[1] * i[2], 0), fee = 35, tax = Math.round(sub * 0.05);
      return `<div class="s-19-pad"><h1 class="s-19-h1">Your order</h1><div class="s-19-sub" style="margin-bottom:12px">Biryani Junction, Koramangala · Paid by UPI</div>
        <div class="s-19-card">${ITEMS.map(i => `<div class="s-19-line"><span><i class="s-19-veg s-19-${i[3]?'v':'nv'}"></i>${i[0]} x ${i[1]}</span><span>${inr(i[1] * i[2])}</span></div>`).join('')}</div>
        <div class="s-19-card"><b>Tip Vikram</b><div class="s-19-sub">100% of the tip goes to your rider</div>
          <div class="s-19-tips">${[0, 20, 30, 50].map(t => `<button class="s-19-tip s-19-${st.tip===t?'on':'off'}" data-tip="${t}">${t ? inr(t) : 'None'}</button>`).join('')}</div></div>
        <div class="s-19-card"><div class="s-19-line"><span>Item total</span><span>${inr(sub)}</span></div><div class="s-19-line"><span>Delivery fee</span><span>${inr(fee)}</span></div>
          <div class="s-19-line"><span>GST and restaurant charges</span><span>${inr(tax)}</span></div><div class="s-19-line"><span>Rider tip</span><span>${inr(st.tip)}</span></div>
          <div class="s-19-line s-19-tot"><span>Total paid</span><span>${inr(sub + fee + tax + st.tip)}</span></div></div></div>`;
    };

    const HELP = () => [['Order is running late', `Vikram is ${mins()} minutes away. If it takes more than 20 minutes past the promised time, delivery is free.`], ['Item missing or wrong', 'Tell us which item once it arrives and we will refund it to your UPI account within 2 hours.'], ['Change delivery instructions', 'Saved: "Leave at the security desk, Tower B." Vikram can see this note.']];
    const help = () => `<div class="s-19-pad"><h1 class="s-19-h1">Help with this order</h1><div class="s-19-sub" style="margin-bottom:12px">Order #FD-58213</div>
      ${st.help !== null ? `<div class="s-19-reply">${HELP()[st.help][1]}</div>` : ''}
      ${HELP().map((h, i) => `<button class="s-19-help" data-help="${i}"><span>${h[0]}</span><span>›</span></button>`).join('')}</div>`;

    const home = () => `<div class="s-19-pad"><h1 class="s-19-h1">Deliver to Home</h1><div class="s-19-sub">Tower B, Prestige Lakeside, Koramangala</div>
      <button class="s-19-pill s-19-${st.veg?'on':'off'}" data-k="veg"><i class="s-19-veg s-19-v"></i>Pure veg</button>
      ${RESTS.filter(r => !st.veg || r[4]).map(r => `<div class="s-19-rest"><svg class="s-19-thumb" viewBox="0 0 64 64"><rect width="64" height="64" fill="hsl(${r[5]},70%,90%)"/><circle cx="32" cy="34" r="18" fill="hsl(${r[5]},65%,62%)"/><circle cx="32" cy="34" r="10" fill="hsl(${r[5]},70%,80%)"/></svg>
        <div class="s-19-grow"><b>${r[0]}</b><div class="s-19-sub">${r[1]}</div><div class="s-19-sub">${r[2]} rating · ${r[3]} min</div></div></div>`).join('')}</div>`;

    const draw = () => {
      $('[data-k="view"]').innerHTML = { home, track, order, help }[st.tab]();
      root.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('s-19-on', b.dataset.tab === st.tab));
    };

    const timer = setInterval(() => {
      if (st.p >= 1) return;
      const before = step();
      st.p = Math.min(1, st.p + 0.012);
      if (st.tab !== 'track') return;
      if (step() !== before || st.p >= 1) { st.call = false; draw(); return; }
      const [x, y] = pos(st.p), g = $('[data-k="rider"]'), m = $('[data-k="mins"]');
      if (g) g.setAttribute('transform', `translate(${x},${y})`);
      if (m) m.textContent = mins() + ' min';
    }, 600);

    root.addEventListener('click', e => {
      const t = e.target, tab = t.closest('[data-tab]'), tip = t.closest('[data-tip]'), h = t.closest('[data-help]'), r = t.closest('[data-rate]');
      if (tab) { st.tab = tab.dataset.tab; draw(); return; }
      if (tip) { st.tip = +tip.dataset.tip; draw(); return; }
      if (h) { st.help = +h.dataset.help; draw(); return; }
      if (r) { st.rating = +r.dataset.rate; draw(); return; }
      if (t.closest('[data-k="call"]')) { st.call = !st.call; draw(); return; }
      if (t.closest('[data-k="veg"]')) { st.veg = !st.veg; draw(); }
    });
    draw();
    return () => clearInterval(timer);
  }
};
