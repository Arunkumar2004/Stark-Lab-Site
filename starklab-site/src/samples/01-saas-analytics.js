/* Sample 01: SaaS analytics dashboard. Follows src/samples/_contract.md (prefix s-01-). */

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('en-US');

function series(n, base, drift, wobble, seed) {
  let s = seed;
  const out = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(Math.max(0, Math.round(base + drift * i + (s / 233280 - 0.5) * wobble)));
  }
  return out;
}

const RANGES = { '7d': 7, '30d': 30, '90d': 90 };
const METRICS = {
  mrr: { label: 'MRR', fmt: v => usd.format(v), make: n => series(n, 182000 - n * 260, 260 + 14, 2600, 11) },
  active: { label: 'Active users', fmt: v => num.format(v), make: n => series(n, 8400 - n * 18, 19, 520, 7) },
  signups: { label: 'Sign-ups', fmt: v => num.format(v), make: n => series(n, 118, 0.6, 46, 3) },
};
const KPIS = {
  '7d': [['MRR', '$184,320', '+1.4%', 1], ['Active users', '8,512', '+2.1%', 1], ['Net revenue retention', '112%', '+0.3 pt', 1], ['Logo churn', '0.9%', '+0.2 pt', 0]],
  '30d': [['MRR', '$184,320', '+5.8%', 1], ['Active users', '8,512', '+6.4%', 1], ['Net revenue retention', '114%', '+1.1 pt', 1], ['Logo churn', '1.6%', '-0.4 pt', 1]],
  '90d': [['MRR', '$184,320', '+17.2%', 1], ['Active users', '8,512', '+19.0%', 1], ['Net revenue retention', '116%', '+2.6 pt', 1], ['Logo churn', '4.1%', '-1.2 pt', 1]],
};
const ACCOUNTS = [
  ['Halcyon Freight', 'Enterprise', 420, 18400, 12.4], ['Northwind Studio', 'Scale', 86, 4128, 3.1],
  ['Kestrel Robotics', 'Enterprise', 310, 14260, -2.2], ['Saffron Lane Foods', 'Growth', 24, 1176, 8.9],
  ['Bluepeak Clinics', 'Scale', 140, 6720, 5.5], ['Marlow & Finch', 'Growth', 18, 882, -6.1],
  ['Tidewater Labs', 'Scale', 64, 3072, 1.8], ['Orchid Ledger', 'Growth', 31, 1519, 14.0],
];
const PLAN_MIX = [['Enterprise', 52, '#4F46E5'], ['Scale', 31, '#818CF8'], ['Growth', 17, '#C7D2FE']];

const CSS = `
.s-01-app{display:grid;grid-template-columns:208px 1fr;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111827;background:#F6F7F9}
.s-01-app *{box-sizing:border-box}
.s-01-side{background:#fff;border-right:1px solid #E5E7EB;padding:18px 12px;display:flex;flex-direction:column;gap:2px}
.s-01-brand{display:flex;align-items:center;gap:8px;font-weight:700;font-size:15px;padding:0 8px 16px}
.s-01-logo{width:24px;height:24px;border-radius:6px;background:#4F46E5}
.s-01-nav{padding:8px 10px;border-radius:7px;color:#4B5563;cursor:pointer}
.s-01-nav:hover{background:#F3F4F6;color:#111827}
.s-01-nav[data-on]{background:#EEF2FF;color:#4338CA;font-weight:600}
.s-01-sidefoot{margin-top:auto;font-size:12px;color:#6B7280;padding:8px 10px}
.s-01-main{overflow:auto;padding:22px 28px}
.s-01-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.s-01-title{font-size:21px;font-weight:700;margin:0}
.s-01-sub{color:#6B7280;font-size:13px}
.s-01-seg{display:inline-flex;background:#fff;border:1px solid #E5E7EB;border-radius:8px;padding:3px}
.s-01-seg button{border:0;background:none;padding:5px 12px;border-radius:6px;font:inherit;font-size:13px;color:#4B5563;cursor:pointer}
.s-01-seg button:hover{color:#111827}
.s-01-seg button[data-on]{background:#4F46E5;color:#fff}
.s-01-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px}
.s-01-card{background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px}
.s-01-kpi{transition:border-color .15s,box-shadow .15s}
.s-01-kpi:hover{border-color:#C7D2FE;box-shadow:0 2px 8px rgba(79,70,229,.08)}
.s-01-klabel{font-size:12px;color:#6B7280}
.s-01-kval{font-size:22px;font-weight:700;margin:4px 0 2px;font-variant-numeric:tabular-nums}
.s-01-delta{font-size:12px;font-weight:600}
.s-01-delta[data-tone=up]{color:#047857}
.s-01-delta[data-tone=down]{color:#B91C1C}
.s-01-row{display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:16px}
.s-01-cardhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.s-01-h2{font-size:14px;font-weight:600;margin:0}
.s-01-chartwrap{position:relative}
.s-01-tip{position:absolute;pointer-events:none;background:#111827;color:#fff;font-size:12px;padding:5px 8px;border-radius:6px;white-space:nowrap;transform:translate(-50%,-120%);opacity:0;transition:opacity .1s}
.s-01-legend{list-style:none;margin:10px 0 0;padding:0;font-size:13px}
.s-01-legend li{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #F3F4F6}
.s-01-dot{width:10px;height:10px;border-radius:3px}
.s-01-pct{margin-left:auto;font-weight:600;font-variant-numeric:tabular-nums}
.s-01-table{width:100%;border-collapse:collapse;font-size:13px}
.s-01-table th{text-align:left;font-weight:500;color:#6B7280;padding:8px 10px;border-bottom:1px solid #E5E7EB}
.s-01-table td{padding:9px 10px;border-bottom:1px solid #F3F4F6;font-variant-numeric:tabular-nums}
.s-01-table tr:hover td{background:#FAFAFF}
.s-01-r{text-align:right}
.s-01-pill{display:inline-block;padding:1px 8px;border-radius:999px;font-size:12px;background:#EEF2FF;color:#4338CA}
.s-01-chips{display:flex;gap:6px}
.s-01-chip{border:1px solid #E5E7EB;background:#fff;border-radius:999px;padding:3px 10px;font:inherit;font-size:12px;cursor:pointer;color:#4B5563}
.s-01-chip:hover{border-color:#A5B4FC}
.s-01-chip[data-on]{border-color:#4F46E5;color:#4338CA;background:#EEF2FF}
.s-01-empty{padding:18px;text-align:center;color:#6B7280}
`;

export default {
  id: '01-saas-analytics',
  name: 'SaaS analytics dashboard',
  category: 'SaaS',
  sector: 'B2B software',
  blurb: 'A revenue and usage dashboard that founders and growth teams check every morning.',
  device: 'desktop',
  accent: '#4F46E5',
  tags: ['dashboard', 'charts', 'KPIs'],
  render(root) {
    const state = { range: '30d', metric: 'mrr', plan: 'All' };
    const nav = ['Overview', 'Revenue', 'Customers', 'Cohorts', 'Experiments', 'Settings'];
    root.innerHTML = `<style>${CSS}</style>
<div class="s-01-app">
  <aside class="s-01-side">
    <div class="s-01-brand"><span class="s-01-logo"></span>Pulsegrid</div>
    ${nav.map((n, i) => `<div class="s-01-nav" ${i === 0 ? 'data-on' : ''}>${n}</div>`).join('')}
    <div class="s-01-sidefoot">Workspace: Lumen Analytics<br>Plan: Scale</div>
  </aside>
  <main class="s-01-main">
    <div class="s-01-head">
      <div><h1 class="s-01-title">Overview</h1><div class="s-01-sub">All products, all regions. Updated 4 minutes ago.</div></div>
      <div class="s-01-seg" data-k="range">${Object.keys(RANGES).map(r => `<button type="button" data-v="${r}">Last ${r.replace('d', ' days')}</button>`).join('')}</div>
    </div>
    <section class="s-01-kpis"></section>
    <div class="s-01-row">
      <div class="s-01-card">
        <div class="s-01-cardhead"><h2 class="s-01-h2">Trend</h2>
          <div class="s-01-seg" data-k="metric">${Object.entries(METRICS).map(([k, m]) => `<button type="button" data-v="${k}">${m.label}</button>`).join('')}</div></div>
        <div class="s-01-chartwrap"><svg class="s-01-chart" viewBox="0 0 640 220" width="100%" height="220"></svg><div class="s-01-tip"></div></div>
      </div>
      <div class="s-01-card"><div class="s-01-cardhead"><h2 class="s-01-h2">Revenue by plan</h2></div>
        <svg viewBox="0 0 160 160" width="150" height="150" style="display:block;margin:0 auto">${donut()}</svg>
        <ul class="s-01-legend">${PLAN_MIX.map(([n, p, c]) => `<li><span class="s-01-dot" style="background:${c}"></span>${n}<span class="s-01-pct">${p}%</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="s-01-card">
      <div class="s-01-cardhead"><h2 class="s-01-h2">Top accounts</h2>
        <div class="s-01-chips">${['All', 'Enterprise', 'Scale', 'Growth'].map(p => `<button type="button" class="s-01-chip" data-plan="${p}">${p}</button>`).join('')}</div></div>
      <table class="s-01-table"><thead><tr><th>Account</th><th>Plan</th><th class="s-01-r">Seats</th><th class="s-01-r">MRR</th><th class="s-01-r">30-day change</th></tr></thead><tbody></tbody></table>
    </div>
  </main>
</div>`;

    function donut() {
      let acc = 0;
      const r = 60, c = 2 * Math.PI * r;
      return PLAN_MIX.map(([, p, col]) => {
        const seg = `<circle cx="80" cy="80" r="${r}" fill="none" stroke="${col}" stroke-width="22" stroke-dasharray="${(p / 100) * c} ${c}" stroke-dashoffset="${-acc * c / 100}" transform="rotate(-90 80 80)"/>`;
        acc += p;
        return seg;
      }).join('') + '<text x="80" y="76" text-anchor="middle" font-size="11" fill="#6B7280">MRR</text><text x="80" y="94" text-anchor="middle" font-size="15" font-weight="700" fill="#111827">$184k</text>';
    }

    const $ = s => root.querySelector(s);
    const svg = $('.s-01-chart'), tip = $('.s-01-tip');
    let pts = [];

    function drawChart() {
      const m = METRICS[state.metric], data = m.make(RANGES[state.range]);
      const W = 640, H = 220, pl = 8, pr = 8, pt = 14, pb = 24;
      const max = Math.max(...data) * 1.04, min = Math.min(...data) * 0.96;
      pts = data.map((v, i) => [pl + (i / (data.length - 1)) * (W - pl - pr), pt + (1 - (v - min) / (max - min)) * (H - pt - pb), v]);
      const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
      const grid = [0, 1, 2, 3].map(i => `<line x1="0" x2="${W}" y1="${pt + i * (H - pt - pb) / 3}" y2="${pt + i * (H - pt - pb) / 3}" stroke="#F0F1F4"/>`).join('');
      const labels = [0, Math.floor(data.length / 2), data.length - 1].map(i => `<text x="${pts[i][0]}" y="${H - 6}" font-size="11" fill="#9CA3AF" text-anchor="${i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}">${dayLabel(data.length - 1 - i)}</text>`).join('');
      svg.innerHTML = `<defs><linearGradient id="s01g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4F46E5" stop-opacity=".22"/><stop offset="1" stop-color="#4F46E5" stop-opacity="0"/></linearGradient></defs>${grid}
        <path d="${line}L${pts[pts.length - 1][0]},${H - pb}L${pts[0][0]},${H - pb}Z" fill="url(#s01g)"/>
        <path d="${line}" fill="none" stroke="#4F46E5" stroke-width="2.2" stroke-linejoin="round"/>${labels}
        <circle class="s-01-hover" r="4.5" fill="#fff" stroke="#4F46E5" stroke-width="2" style="display:none"/>`;
    }
    function dayLabel(daysAgo) {
      const d = new Date(2026, 9, 6 - daysAgo);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
    function drawKpis() {
      $('.s-01-kpis').innerHTML = KPIS[state.range].map(([l, v, d, good]) =>
        `<div class="s-01-card s-01-kpi"><div class="s-01-klabel">${l}</div><div class="s-01-kval">${v}</div><span class="s-01-delta" data-tone="${good ? 'up' : 'down'}">${d}</span> <span class="s-01-sub">vs previous period</span></div>`).join('');
    }
    function drawTable() {
      const rows = ACCOUNTS.filter(a => state.plan === 'All' || a[1] === state.plan).sort((a, b) => b[3] - a[3]);
      $('.s-01-table tbody').innerHTML = rows.length ? rows.map(([n, p, s, m, c]) =>
        `<tr><td>${n}</td><td><span class="s-01-pill">${p}</span></td><td class="s-01-r">${s}</td><td class="s-01-r">${usd.format(m)}</td><td class="s-01-r s-01-delta" data-tone="${c >= 0 ? 'up' : 'down'}">${c > 0 ? '+' : ''}${c.toFixed(1)}%</td></tr>`).join('')
        : '<tr><td colspan="5" class="s-01-empty">No accounts on this plan.</td></tr>';
    }
    function mark() {
      root.querySelectorAll('.s-01-seg[data-k] button').forEach(b => b.toggleAttribute('data-on', state[b.parentElement.dataset.k] === b.dataset.v));
      root.querySelectorAll('.s-01-chip').forEach(b => b.toggleAttribute('data-on', b.dataset.plan === state.plan));
    }
    function all() { mark(); drawKpis(); drawChart(); drawTable(); }

    root.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b && b.parentElement.dataset.k) { state[b.parentElement.dataset.k] = b.dataset.v; all(); }
      else if (b && b.dataset.plan) { state.plan = b.dataset.plan; mark(); drawTable(); }
      const n = e.target.closest('.s-01-nav');
      if (n) root.querySelectorAll('.s-01-nav').forEach(x => x.toggleAttribute('data-on', x === n));
    });
    svg.addEventListener('mousemove', e => {
      const box = svg.getBoundingClientRect(), x = ((e.clientX - box.left) / box.width) * 640;
      let best = pts[0];
      for (const p of pts) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
      const dot = svg.querySelector('.s-01-hover');
      dot.setAttribute('cx', best[0]); dot.setAttribute('cy', best[1]); dot.style.display = '';
      tip.textContent = `${dayLabel(pts.length - 1 - pts.indexOf(best))}: ${METRICS[state.metric].fmt(best[2])}`;
      tip.style.left = (best[0] / 640) * box.width + 'px';
      tip.style.top = (best[1] / 220) * box.height + 'px';
      tip.style.opacity = 1;
    });
    svg.addEventListener('mouseleave', () => { tip.style.opacity = 0; const d = svg.querySelector('.s-01-hover'); if (d) d.style.display = 'none'; });
    all();
  },
};
