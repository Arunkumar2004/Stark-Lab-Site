/* 15 Property listing and enquiry: home buyers filter flats, compare prices, work out the EMI and send an enquiry. */

const CSS = `
.s-15-app{display:flex;flex-direction:column;height:100%;font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1c2430;background:#f5f7f8}
.s-15-top{display:flex;align-items:center;gap:16px;padding:12px 22px;background:#fff;border-bottom:1px solid #e2e6ea}
.s-15-brand{font-weight:750;font-size:16px;color:#0f6e8c}
.s-15-search{flex:0 1 340px;border:1px solid #d3d9df;border-radius:8px;padding:8px 11px;font:inherit}
.s-15-search:focus,.s-15-in:focus{outline:2px solid #bfe1ec;border-color:#0f6e8c}
.s-15-links{margin-left:auto;display:flex;gap:16px;color:#5a6472}
.s-15-body{flex:1;display:grid;grid-template-columns:200px 1fr 360px;min-height:0}
.s-15-filters{padding:16px;border-right:1px solid #e2e6ea;background:#fff;display:flex;flex-direction:column;gap:16px}
.s-15-fl{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#7a8492;margin-bottom:6px;font-weight:600}
.s-15-chips{display:flex;gap:6px;flex-wrap:wrap}
.s-15-chip{border:1px solid #d3d9df;background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12px;cursor:pointer}
.s-15-chip:hover{border-color:#0f6e8c}
.s-15-chip.s-15-on{background:#0f6e8c;color:#fff;border-color:#0f6e8c}
.s-15-range{width:100%;accent-color:#0f6e8c}
.s-15-list{overflow:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.s-15-count{color:#5a6472;font-size:12px}
.s-15-card{display:grid;grid-template-columns:132px 1fr auto;gap:14px;background:#fff;border:1px solid #e2e6ea;border-radius:12px;padding:10px;cursor:pointer}
.s-15-card:hover{border-color:#0f6e8c;box-shadow:0 4px 14px rgba(15,110,140,.08)}
.s-15-card.s-15-sel{border-color:#0f6e8c;box-shadow:0 0 0 2px #cfe8f0}
.s-15-thumb{border-radius:8px;display:block}
.s-15-name{font-weight:650;font-size:14px}
.s-15-sub{color:#6b7584;font-size:12px}
.s-15-price{font-weight:700;font-size:15px;margin-top:6px}
.s-15-feats{display:flex;gap:10px;color:#5a6472;font-size:12px;margin-top:4px}
.s-15-heart{border:0;background:none;cursor:pointer;width:32px;height:32px;border-radius:50%;align-self:start}
.s-15-heart:hover{background:#eef6f9}
.s-15-empty{text-align:center;color:#8a93a0;padding:40px}
.s-15-detail{background:#fff;border-left:1px solid #e2e6ea;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:14px}
.s-15-box{border:1px solid #e2e6ea;border-radius:10px;padding:12px}
.s-15-bh{font-weight:650;margin-bottom:6px;display:flex;justify-content:space-between}
.s-15-emi{font-size:20px;font-weight:700;color:#0f6e8c}
.s-15-in{width:100%;box-sizing:border-box;border:1px solid #d3d9df;border-radius:7px;padding:7px 9px;font:inherit;margin-bottom:6px}
.s-15-btn{width:100%;border:0;background:#0f6e8c;color:#fff;border-radius:8px;padding:9px;font:inherit;font-weight:600;cursor:pointer}
.s-15-btn:hover{background:#0b5870}
.s-15-ok{background:#e8f6ee;color:#14663a;border-radius:8px;padding:10px;font-size:12px}
`;

const PROPS = [
  { id: 1, name: 'Palm Grove Residences', area: 'Whitefield', city: 'Bengaluru', bhk: 2, sqft: 1180, price: 9400000, hue: 190, trend: [78, 80, 83, 85, 88, 91, 94], age: 'Ready to move' },
  { id: 2, name: 'Skyline Heights', area: 'Hinjewadi', city: 'Pune', bhk: 3, sqft: 1560, price: 12800000, hue: 25, trend: [104, 108, 112, 116, 119, 124, 128], age: 'Possession Mar 2027' },
  { id: 3, name: 'Coral Bay Apartments', area: 'Thane West', city: 'Mumbai', bhk: 2, sqft: 890, price: 14500000, hue: 200, trend: [132, 134, 136, 139, 141, 143, 145], age: 'Ready to move' },
  { id: 4, name: 'Laurel Court', area: 'Gachibowli', city: 'Hyderabad', bhk: 3, sqft: 1720, price: 15600000, hue: 150, trend: [122, 128, 135, 140, 146, 151, 156], age: '2 years old' },
  { id: 5, name: 'Banyan Square', area: 'Sholinganallur', city: 'Chennai', bhk: 1, sqft: 640, price: 4800000, hue: 45, trend: [42, 43, 44, 45, 46, 47, 48], age: 'Ready to move' },
  { id: 6, name: 'Orchid Enclave', area: 'Sector 150', city: 'Noida', bhk: 4, sqft: 2340, price: 24500000, hue: 280, trend: [196, 204, 212, 221, 229, 237, 245], age: 'Possession Dec 2026' }
];
const lakh = n => (n >= 1e7 ? '₹' + (n / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' Cr' : '₹' + (n / 1e5).toLocaleString('en-IN', { maximumFractionDigits: 1 }) + ' L');
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const thumb = p => `<svg class="s-15-thumb" width="132" height="92" viewBox="0 0 132 92" aria-hidden="true"><rect width="132" height="92" fill="hsl(${p.hue},45%,90%)"/>
  <rect x="18" y="${30 - p.bhk * 4}" width="40" height="${62 + p.bhk * 4}" fill="hsl(${p.hue},35%,62%)"/><rect x="62" y="18" width="34" height="74" fill="hsl(${p.hue},38%,52%)"/><rect x="100" y="44" width="22" height="48" fill="hsl(${p.hue},30%,70%)"/>
  ${[0, 1, 2, 3, 4].map(r => `<rect x="68" y="${26 + r * 12}" width="8" height="6" fill="#fff" opacity=".7"/><rect x="82" y="${26 + r * 12}" width="8" height="6" fill="#fff" opacity=".7"/>`).join('')}</svg>`;

export default {
  id: '15-property-listing',
  name: 'Property listing and enquiry',
  category: 'Commerce',
  sector: 'Real estate',
  blurb: 'Home buyers filter flats across Indian cities, check the price trend, work out the monthly EMI and send an enquiry to the builder.',
  device: 'desktop',
  accent: '#0F6E8C',
  tags: ['marketplace', 'EMI calculator', 'lead capture'],
  render(root) {
    const st = { bhk: 0, max: 25000000, q: '', sel: 1, down: 20, saved: new Set([4]), sent: {} };

    root.innerHTML = `<style>${CSS}</style>
      <div class="s-15-app">
        <header class="s-15-top"><div class="s-15-brand">Homestead</div><input class="s-15-search" data-k="q" placeholder="Search by project, locality or city">
          <nav class="s-15-links"><span>Buy</span><span>Rent</span><span>New projects</span><span data-k="savedcount"></span></nav></header>
        <div class="s-15-body">
          <aside class="s-15-filters">
            <div><div class="s-15-fl">Bedrooms</div><div class="s-15-chips">${[0, 1, 2, 3, 4].map(b => `<button class="s-15-chip" data-bhk="${b}">${b ? b + ' BHK' : 'Any'}</button>`).join('')}</div></div>
            <div><div class="s-15-fl">Budget up to</div><input class="s-15-range" type="range" min="4000000" max="25000000" step="500000" value="25000000" data-k="max"><div data-k="maxl"></div></div>
            <div><div class="s-15-fl">Show</div><label class="s-15-sub"><input type="checkbox" data-k="onlysaved"> Shortlisted only</label></div>
            <div class="s-15-sub">Prices include parking. Stamp duty and registration are extra.</div>
          </aside>
          <section class="s-15-list" data-k="list"></section>
          <aside class="s-15-detail" data-k="detail"></aside>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);

    const visible = () => PROPS.filter(p => (!st.bhk || p.bhk === st.bhk) && p.price <= st.max && (!st.only || st.saved.has(p.id))
      && (p.name + p.area + p.city).toLowerCase().includes(st.q.toLowerCase()));

    const drawList = () => {
      const v = visible();
      $('[data-k="list"]').innerHTML = `<div class="s-15-count">${v.length} homes match</div>` + (v.length ? v.map(p => `<article class="s-15-card s-15-${p.id===st.sel?'sel':'n'}" data-id="${p.id}">
        ${thumb(p)}<div><div class="s-15-name">${p.name}</div><div class="s-15-sub">${p.area}, ${p.city} · ${p.age}</div>
        <div class="s-15-price">${lakh(p.price)} <span class="s-15-sub">${inr(p.price / p.sqft)} per sq ft</span></div>
        <div class="s-15-feats"><span>${p.bhk} BHK</span><span>${p.sqft.toLocaleString('en-IN')} sq ft</span>${st.sent[p.id] ? '<span style="color:#14663a">Enquiry sent</span>' : ''}</div></div>
        <button class="s-15-heart" data-save="${p.id}" aria-label="Shortlist" aria-pressed="${st.saved.has(p.id)}"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="${st.saved.has(p.id) ? '#0f6e8c' : 'none'}" stroke="#0f6e8c" stroke-width="1.8"/></svg></button></article>`).join('')
        : '<div class="s-15-empty">No homes match these filters. Try raising the budget.</div>');
      root.querySelectorAll('[data-bhk]').forEach(b => b.classList.toggle('s-15-on', +b.dataset.bhk === st.bhk));
      $('[data-k="maxl"]').textContent = lakh(st.max);
      $('[data-k="savedcount"]').textContent = `Shortlist (${st.saved.size})`;
    };

    const chart = p => {
      const W = 320, H = 110, lo = Math.min(...p.trend) * 0.96, hi = Math.max(...p.trend) * 1.02;
      const x = i => 10 + (i / (p.trend.length - 1)) * (W - 20), y = v => 10 + (1 - (v - lo) / (hi - lo)) * (H - 34);
      const d = p.trend.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
      const qs = ['Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Now'];
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Locality price trend"><path d="${d} L${x(6)},${H - 22} L${x(0)},${H - 22}Z" fill="#0f6e8c" opacity=".08"/>
        <path d="${d}" fill="none" stroke="#0f6e8c" stroke-width="2"/>${p.trend.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="#fff" stroke="#0f6e8c" stroke-width="1.5"><title>${qs[i]}: ${lakh(v * 1e5)}</title></circle>
        <text x="${x(i)}" y="${H - 6}" font-size="9" text-anchor="middle" fill="#7a8492">${qs[i]}</text>`).join('')}</svg>`;
    };

    const drawDetail = () => {
      const p = PROPS.find(x => x.id === st.sel);
      if (!p) { $('[data-k="detail"]').innerHTML = '<div class="s-15-empty">Select a home to see details</div>'; return; }
      const growth = ((p.trend[6] / p.trend[0] - 1) * 100).toFixed(1);
      $('[data-k="detail"]').innerHTML = `<div><div class="s-15-name">${p.name}</div><div class="s-15-sub">${p.bhk} BHK · ${p.area}, ${p.city}</div><div class="s-15-price">${lakh(p.price)}</div></div>
        <div class="s-15-box"><div class="s-15-bh"><span>Price trend in ${p.area}</span><span style="color:#14663a">+${growth}% in 18 months</span></div>${chart(p)}</div>
        <div class="s-15-box"><div class="s-15-bh"><span>Home loan EMI</span><span class="s-15-sub">8.65% for 20 years</span></div>
          <div class="s-15-emi" data-k="emi"></div><div class="s-15-sub" data-k="emisub"></div>
          <input class="s-15-range" type="range" min="10" max="50" step="5" value="${st.down}" data-k="down" aria-label="Down payment percentage"></div>
        <div class="s-15-box"><div class="s-15-bh">Talk to the builder</div>${st.sent[p.id] ? `<div class="s-15-ok">Thanks, ${st.sent[p.id]}. Sunrise Realty will call you within one working day about ${p.name}.</div>` : `<form data-k="form">
          <input class="s-15-in" name="nm" placeholder="Your name" required><input class="s-15-in" name="ph" placeholder="Mobile number" required pattern="[0-9 +]{10,14}" title="10 digit mobile number">
          <select class="s-15-in" name="when"><option>Site visit this weekend</option><option>Video walkthrough</option><option>Call me back</option></select>
          <button class="s-15-btn" type="submit">Send enquiry</button></form>`}</div>`;
      updateEmi();
    };
    const updateEmi = () => {
      const p = PROPS.find(x => x.id === st.sel), el = $('[data-k="emi"]');
      if (!p || !el) return;
      const loan = p.price * (1 - st.down / 100), r = 0.0865 / 12, n = 240, emi = (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1);
      el.textContent = `${inr(emi)} per month`;
      $('[data-k="emisub"]').textContent = `Down payment ${st.down}% (${lakh(p.price * st.down / 100)}), loan ${lakh(loan)}`;
    };
    const draw = () => { drawList(); drawDetail(); };

    root.addEventListener('click', e => {
      const s = e.target.closest('[data-save]');
      if (s) { const id = +s.dataset.save; st.saved.has(id) ? st.saved.delete(id) : st.saved.add(id); drawList(); return; }
      const b = e.target.closest('[data-bhk]');
      if (b) { st.bhk = +b.dataset.bhk; drawList(); return; }
      const c = e.target.closest('[data-id]');
      if (c) { st.sel = +c.dataset.id; draw(); }
    });
    root.addEventListener('input', e => {
      const k = e.target.dataset.k;
      if (k === 'max') { st.max = +e.target.value; drawList(); }
      if (k === 'q') { st.q = e.target.value; drawList(); }
      if (k === 'down') { st.down = +e.target.value; updateEmi(); }
    });
    root.addEventListener('change', e => { if (e.target.dataset.k === 'onlysaved') { st.only = e.target.checked; drawList(); } });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements;
      st.sent[st.sel] = f.nm.value.trim().split(' ')[0];
      draw();
    });
    draw();
  }
};
