/* Sample 06: Storefront and cart. Follows src/samples/_contract.md (prefix s-06-). */

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const PRODUCTS = [
  { id: 1, name: 'Indigo block-print cushion', cat: 'Textiles', price: 1290, rating: 4.7, reviews: 312, shape: 'cushion', c: '#3B4B8C' },
  { id: 2, name: 'Terracotta bud vase', cat: 'Decor', price: 690, rating: 4.5, reviews: 128, shape: 'vase', c: '#C2643A' },
  { id: 3, name: 'Brass table lamp', cat: 'Lighting', price: 4450, rating: 4.8, reviews: 76, shape: 'lamp', c: '#B8892B' },
  { id: 4, name: 'Handloom cotton throw', cat: 'Textiles', price: 2390, rating: 4.6, reviews: 201, shape: 'throw', c: '#BE185D' },
  { id: 5, name: 'Stoneware mug, set of 2', cat: 'Kitchen', price: 890, rating: 4.4, reviews: 540, shape: 'mug', c: '#4B7F6A' },
  { id: 6, name: 'Cane pendant shade', cat: 'Lighting', price: 3190, rating: 4.3, reviews: 54, shape: 'pendant', c: '#A0743F' },
  { id: 7, name: 'Hand-painted serving plate', cat: 'Kitchen', price: 1150, rating: 4.9, reviews: 98, shape: 'plate', c: '#2F6F9F' },
  { id: 8, name: 'Jute floor basket', cat: 'Decor', price: 1690, rating: 4.5, reviews: 167, shape: 'basket', c: '#9C7A44' },
];
const SHAPES = {
  cushion: c => `<rect x="30" y="40" width="100" height="70" rx="16" fill="${c}"/><path d="M40 55h80M40 75h80M40 95h80" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="6 6"/>`,
  vase: c => `<path d="M70 30h20v18c18 10 22 34 14 56-4 10-44 10-48 0-8-22-4-46 14-56z" fill="${c}"/><path d="M80 30c-6-14 2-22 10-26" stroke="#4B7F6A" stroke-width="3" fill="none"/>`,
  lamp: c => `<path d="M50 30h60l14 40H36z" fill="${c}" opacity=".85"/><rect x="77" y="70" width="6" height="34" fill="${c}"/><rect x="58" y="104" width="44" height="8" rx="3" fill="${c}"/>`,
  throw: c => `<path d="M30 34h100v62l-12 14H30z" fill="${c}"/><path d="M30 96h88" stroke="#fff" stroke-opacity=".4" stroke-width="4"/><path d="M36 110v8M46 110v8M56 110v8M66 110v8M76 110v8M86 110v8M96 110v8M106 110v8" stroke="${c}" stroke-width="2"/>`,
  mug: c => `<rect x="40" y="46" width="44" height="56" rx="6" fill="${c}"/><path d="M84 58c16 0 16 30 0 30" stroke="${c}" stroke-width="6" fill="none"/><rect x="92" y="56" width="34" height="46" rx="6" fill="${c}" opacity=".6"/>`,
  pendant: c => `<path d="M80 6v30" stroke="#57534E" stroke-width="2"/><path d="M50 82a30 46 0 0 1 60 0z" fill="${c}"/><path d="M58 60h44M54 72h52" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`,
  plate: c => `<circle cx="80" cy="72" r="46" fill="#fff" stroke="${c}" stroke-width="5"/><circle cx="80" cy="72" r="28" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="4 5"/><circle cx="80" cy="72" r="8" fill="${c}"/>`,
  basket: c => `<path d="M40 48h80l-8 64H48z" fill="${c}"/><path d="M44 64h72M46 80h68M47 96h66" stroke="#fff" stroke-opacity=".35" stroke-width="3"/><path d="M58 48c0-18 44-18 44 0" stroke="${c}" stroke-width="4" fill="none"/>`,
};

const CSS = `
.s-06-app{display:flex;flex-direction:column;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1F2937;background:#fff}
.s-06-app *{box-sizing:border-box}
.s-06-top{display:flex;align-items:center;gap:22px;padding:0 24px;height:58px;border-bottom:1px solid #F1E7EC}
.s-06-brand{font-family:Georgia,"Times New Roman",serif;font-size:21px;font-weight:700;color:#BE185D}
.s-06-search{flex:1;max-width:380px;border:1px solid #E5E7EB;border-radius:999px;padding:8px 14px;font:inherit;background:#F9FAFB}
.s-06-search:focus{outline:2px solid #FBCFE8;background:#fff}
.s-06-cartbtn{margin-left:auto;border:1px solid #E5E7EB;background:#fff;border-radius:999px;padding:7px 14px;font:inherit;cursor:pointer}
.s-06-cartbtn:hover{border-color:#BE185D}
.s-06-count{display:inline-block;min-width:20px;padding:0 6px;border-radius:99px;background:#BE185D;color:#fff;font-size:12px;text-align:center;margin-left:4px}
.s-06-body{flex:1;display:grid;grid-template-columns:1fr 320px;min-height:0}
.s-06-shop{overflow:auto;padding:18px 24px}
.s-06-hero{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px}
.s-06-h1{margin:0;font-size:22px}
.s-06-muted{color:#6B7280;font-size:13px}
.s-06-bar{display:flex;gap:6px;align-items:center;margin-bottom:14px}
.s-06-cat{border:0;background:#F3F4F6;border-radius:999px;padding:5px 13px;font:inherit;font-size:13px;cursor:pointer;color:#374151}
.s-06-cat:hover{background:#FCE7F3}
.s-06-cat[data-on]{background:#1F2937;color:#fff}
.s-06-sort{margin-left:auto;border:1px solid #E5E7EB;border-radius:8px;padding:5px 8px;font:inherit;font-size:13px}
.s-06-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.s-06-card{border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;transition:box-shadow .15s,transform .15s}
.s-06-card:hover{box-shadow:0 8px 20px rgba(31,41,55,.08);transform:translateY(-2px)}
.s-06-img{background:#FDF6F9;display:block;width:100%;height:140px}
.s-06-info{padding:10px 12px 12px}
.s-06-name{font-weight:600;font-size:13px;min-height:36px}
.s-06-price{font-weight:700;font-variant-numeric:tabular-nums}
.s-06-row{display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.s-06-add{border:1px solid #BE185D;color:#BE185D;background:#fff;border-radius:8px;padding:5px 10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer}
.s-06-add:hover{background:#BE185D;color:#fff}
.s-06-add[data-in]{background:#FCE7F3;border-color:#FCE7F3}
.s-06-cart{border-left:1px solid #F3F4F6;background:#FCFCFD;display:flex;flex-direction:column;min-height:0}
.s-06-ch{padding:16px 18px;border-bottom:1px solid #F3F4F6;font-weight:700;font-size:16px}
.s-06-lines{flex:1;overflow:auto;padding:6px 18px}
.s-06-line{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6}
.s-06-thumb{width:44px;height:44px;border-radius:8px;background:#FDF6F9}
.s-06-qty{display:inline-flex;align-items:center;border:1px solid #E5E7EB;border-radius:7px;margin-top:4px}
.s-06-qty button{border:0;background:none;width:24px;height:22px;cursor:pointer;font:inherit}
.s-06-qty button:hover{background:#F3F4F6}
.s-06-qty span{min-width:22px;text-align:center;font-size:13px}
.s-06-sum{padding:14px 18px;border-top:1px solid #F3F4F6;font-size:13px}
.s-06-sl{display:flex;justify-content:space-between;margin:4px 0;font-variant-numeric:tabular-nums}
.s-06-total{font-size:16px;font-weight:700}
.s-06-promo{display:flex;gap:6px;margin:8px 0}
.s-06-pin{flex:1;border:1px solid #E5E7EB;border-radius:7px;padding:6px 9px;font:inherit;font-size:13px;text-transform:uppercase}
.s-06-pbtn{border:1px solid #1F2937;background:#fff;border-radius:7px;padding:6px 10px;font:inherit;font-size:12px;cursor:pointer}
.s-06-ship{height:6px;background:#F3F4F6;border-radius:99px;overflow:hidden;margin:6px 0 2px}
.s-06-shipfill{height:100%;background:#BE185D}
.s-06-checkout{width:100%;border:0;background:#BE185D;color:#fff;border-radius:9px;padding:11px;font:inherit;font-weight:700;cursor:pointer;margin-top:10px}
.s-06-checkout:hover{background:#9D174D}
.s-06-checkout:disabled{background:#E5E7EB;color:#9CA3AF;cursor:default}
.s-06-empty{text-align:center;color:#9CA3AF;padding:40px 10px}
`;

export default {
  id: '06-ecommerce-storefront',
  name: 'Storefront and cart',
  category: 'Commerce',
  sector: 'Home goods D2C',
  blurb: 'A direct-to-consumer storefront with search, filters and a live cart that handles promo codes and free-shipping thresholds.',
  device: 'desktop',
  accent: '#BE185D',
  tags: ['e-commerce', 'cart', 'filters'],
  render(root) {
    const s = { cat: 'All', sort: 'popular', q: '', cart: new Map([[4, 1], [5, 2]]), promo: '', promoMsg: '' };
    const img = (p, h = 140) => `<svg class="s-06-img" viewBox="0 0 160 124" height="${h}" preserveAspectRatio="xMidYMid meet">${SHAPES[p.shape](p.c)}</svg>`;
    root.innerHTML = `<style>${CSS}</style>
<div class="s-06-app">
  <header class="s-06-top"><span class="s-06-brand">Neelam Home</span><input class="s-06-search" type="search" placeholder="Search cushions, lamps, tableware"><button type="button" class="s-06-cartbtn">Cart<span class="s-06-count"></span></button></header>
  <div class="s-06-body">
    <section class="s-06-shop">
      <div class="s-06-hero"><div><h1 class="s-06-h1">The festive edit</h1><div class="s-06-muted">Handmade by artisan partners in Jaipur, Kutch and Channapatna.</div></div><div class="s-06-muted s-06-found"></div></div>
      <div class="s-06-bar">${['All', 'Textiles', 'Decor', 'Lighting', 'Kitchen'].map(c => `<button type="button" class="s-06-cat" data-cat="${c}">${c}</button>`).join('')}
        <select class="s-06-sort"><option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></div>
      <div class="s-06-grid"></div>
    </section>
    <aside class="s-06-cart"><div class="s-06-ch">Your cart</div><div class="s-06-lines"></div><div class="s-06-sum"></div></aside>
  </div>
</div>`;
    const $ = q => root.querySelector(q);

    function drawGrid() {
      let list = PRODUCTS.filter(p => (s.cat === 'All' || p.cat === s.cat) && p.name.toLowerCase().includes(s.q.toLowerCase()));
      const by = { popular: (a, b) => b.reviews - a.reviews, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
      list = list.sort(by[s.sort]);
      $('.s-06-found').textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
      $('.s-06-grid').innerHTML = list.length ? list.map(p => `<article class="s-06-card">${img(p)}<div class="s-06-info"><div class="s-06-muted">${p.cat}</div><div class="s-06-name">${p.name}</div>
        <div class="s-06-muted">${p.rating.toFixed(1)} of 5 · ${p.reviews} reviews</div><div class="s-06-row"><span class="s-06-price">${inr.format(p.price)}</span>
        <button type="button" class="s-06-add" data-add="${p.id}" ${s.cart.has(p.id) ? 'data-in' : ''}>${s.cart.has(p.id) ? `In cart (${s.cart.get(p.id)})` : 'Add to cart'}</button></div></div></article>`).join('')
        : `<div class="s-06-empty" style="grid-column:1/-1">Nothing matches "${s.q.replace(/[<>&"]/g, '')}". Try another word or category.</div>`;
      root.querySelectorAll('.s-06-cat').forEach(b => b.toggleAttribute('data-on', b.dataset.cat === s.cat));
    }
    function drawCart() {
      const lines = [...s.cart].map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id), q }));
      const sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
      const disc = s.promo === 'WELCOME10' ? Math.round(sub * 0.1) : 0;
      const ship = sub - disc >= 1499 || sub === 0 ? 0 : 99, total = sub - disc + ship;
      const items = lines.reduce((a, l) => a + l.q, 0);
      $('.s-06-count').textContent = items;
      $('.s-06-lines').innerHTML = lines.length ? lines.map(({ p, q }) => `<div class="s-06-line"><svg class="s-06-thumb" viewBox="0 0 160 124">${SHAPES[p.shape](p.c)}</svg>
        <div><div style="font-size:13px;font-weight:600">${p.name}</div><div class="s-06-qty"><button type="button" data-dec="${p.id}" aria-label="Decrease">-</button><span>${q}</span><button type="button" data-inc="${p.id}" aria-label="Increase">+</button></div></div>
        <div class="s-06-price" style="font-size:13px">${inr.format(p.price * q)}</div></div>`).join('') : '<div class="s-06-empty">Your cart is empty.<br>Add something you love.</div>';
      const left = Math.max(0, 1499 - (sub - disc));
      $('.s-06-sum').innerHTML = `<div class="s-06-muted">${left ? `Add ${inr.format(left)} more for free delivery` : 'You have free delivery'}</div><div class="s-06-ship"><div class="s-06-shipfill" style="width:${Math.min(100, ((sub - disc) / 1499) * 100)}%"></div></div>
        <form class="s-06-promo"><input class="s-06-pin" name="code" placeholder="Promo code" value="${s.promo}"><button class="s-06-pbtn">Apply</button></form><div class="s-06-muted" style="min-height:18px">${s.promoMsg}</div>
        <div class="s-06-sl"><span>Subtotal (${items} item${items === 1 ? '' : 's'})</span><span>${inr.format(sub)}</span></div>
        ${disc ? `<div class="s-06-sl" style="color:#047857"><span>WELCOME10</span><span>-${inr.format(disc)}</span></div>` : ''}
        <div class="s-06-sl"><span>Delivery</span><span>${ship ? inr.format(ship) : 'Free'}</span></div>
        <div class="s-06-sl s-06-total"><span>Total</span><span>${inr.format(total)}</span></div><div class="s-06-muted">Prices include GST.</div>
        <button type="button" class="s-06-checkout" ${items ? '' : 'disabled'}>Checkout securely</button>`;
    }
    function all() { drawGrid(); drawCart(); }

    root.addEventListener('click', e => {
      const t = e.target;
      const cat = t.closest('[data-cat]'); if (cat) { s.cat = cat.dataset.cat; drawGrid(); return; }
      const add = t.closest('[data-add]'); if (add) { const id = +add.dataset.add; s.cart.set(id, (s.cart.get(id) || 0) + 1); all(); return; }
      const inc = t.closest('[data-inc]'); if (inc) { const id = +inc.dataset.inc; s.cart.set(id, s.cart.get(id) + 1); all(); return; }
      const dec = t.closest('[data-dec]'); if (dec) { const id = +dec.dataset.dec, q = s.cart.get(id) - 1; if (q > 0) s.cart.set(id, q); else s.cart.delete(id); all(); return; }
      if (t.closest('.s-06-checkout')) { $('.s-06-ch').textContent = 'Order placed. Confirmation sent by SMS.'; s.cart.clear(); s.promo = ''; s.promoMsg = ''; all(); }
      if (t.closest('.s-06-cartbtn')) $('.s-06-lines').scrollTop = 0;
    });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const code = e.target.elements.code.value.trim().toUpperCase();
      if (code === 'WELCOME10') { s.promo = code; s.promoMsg = '10% off applied.'; } else { s.promo = ''; s.promoMsg = code ? 'That code is not valid. Try WELCOME10.' : ''; }
      drawCart();
    });
    root.addEventListener('input', e => { if (e.target.classList.contains('s-06-search')) { s.q = e.target.value; drawGrid(); } });
    root.addEventListener('change', e => { if (e.target.classList.contains('s-06-sort')) { s.sort = e.target.value; drawGrid(); } });
    all();
  },
};
