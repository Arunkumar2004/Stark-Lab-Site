/* Sample 07: Fleet dispatch board. Follows src/samples/_contract.md (prefix s-07-). */

const ROUTES = {
  R1: [[60, 400], [60, 260], [220, 260], [220, 120], [420, 120]],
  R2: [[60, 400], [300, 400], [300, 300], [540, 300]],
  R3: [[60, 400], [140, 400], [140, 180], [340, 180], [340, 60], [540, 60]],
  R4: [[60, 400], [60, 120], [140, 120], [140, 40]],
  R5: [[60, 400], [460, 400], [460, 200], [540, 200]],
};
const VEHICLES = [
  { id: 'MH12 KT 4410', type: '14 ft truck', driver: 'Sandeep Kulkarni', route: 'R1', t: 0.42, status: 'En route', load: 86, eta: '11:40', dest: 'Chakan MIDC', stops: ['Bhosari depot', 'Pimpri hub', 'Chakan MIDC'] },
  { id: 'MH14 GD 2381', type: '19 ft truck', driver: 'Farah Siddiqui', route: 'R2', t: 0.7, status: 'Delayed', load: 64, eta: '12:25', dest: 'Hadapsar warehouse', stops: ['Bhosari depot', 'Kharadi', 'Hadapsar warehouse'] },
  { id: 'MH12 QW 9024', type: 'Mini truck', driver: 'Ravi Pawar', route: 'R3', t: 0.18, status: 'En route', load: 92, eta: '13:05', dest: 'Hinjewadi Phase 3', stops: ['Bhosari depot', 'Wakad', 'Hinjewadi Phase 1', 'Hinjewadi Phase 3'] },
  { id: 'MH14 LM 7765', type: '14 ft truck', driver: 'Joseph Mathew', route: 'R4', t: 0, status: 'Loading', load: 35, eta: '14:10', dest: 'Talegaon', stops: ['Bhosari depot', 'Talegaon'] },
  { id: 'MH12 ZX 1156', type: 'Mini truck', driver: 'Kiran Bhosale', route: 'R5', t: 0, status: 'Idle', load: 0, eta: '-', dest: 'Unassigned', stops: ['Bhosari depot'] },
  { id: 'MH14 PB 3092', type: '19 ft truck', driver: 'Harpreet Gill', route: 'R5', t: 0.55, status: 'En route', load: 71, eta: '12:50', dest: 'Ranjangaon', stops: ['Bhosari depot', 'Shikrapur', 'Ranjangaon'] },
];
const JOBS = [['JOB-5521', 'Kharadi to Magarpatta', '1.2 t', 'R2'], ['JOB-5524', 'Bhosari to Chakan', '0.6 t', 'R1'], ['JOB-5530', 'Bhosari to Ranjangaon', '2.4 t', 'R5']];
const TONE = { 'En route': '#1C6DD0', Delayed: '#DC2626', Loading: '#D97706', Idle: '#6B7280' };

function pointAt(route, t) {
  const pts = ROUTES[route], seg = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let goal = t * total;
  for (let i = 0; i < seg.length; i++) {
    if (goal <= seg[i]) { const f = goal / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
    goal -= seg[i];
  }
  return pts[pts.length - 1];
}

const CSS = `
.s-07-app{display:grid;grid-template-columns:300px 1fr 300px;grid-template-rows:54px 1fr;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0F172A;background:#F1F5F9}
.s-07-app *{box-sizing:border-box}
.s-07-top{grid-column:1/-1;display:flex;align-items:center;gap:18px;padding:0 20px;background:#0F172A;color:#E2E8F0}
.s-07-brand{font-weight:700;color:#fff}
.s-07-h1{font-size:15px;font-weight:600;margin:0;color:#CBD5E1}
.s-07-stat{font-size:12px;color:#94A3B8}
.s-07-stat b{color:#fff;font-size:14px;margin-right:3px}
.s-07-live{margin-left:auto;display:flex;align-items:center;gap:8px;border:1px solid #334155;background:#1E293B;color:#E2E8F0;border-radius:999px;padding:5px 12px;font:inherit;font-size:12px;cursor:pointer}
.s-07-live:hover{border-color:#64748B}
.s-07-pulse{width:8px;height:8px;border-radius:50%;background:#22C55E}
.s-07-live[data-off] .s-07-pulse{background:#64748B}
.s-07-list{background:#fff;border-right:1px solid #E2E8F0;display:flex;flex-direction:column;min-height:0}
.s-07-filters{display:flex;flex-wrap:wrap;gap:5px;padding:12px;border-bottom:1px solid #E2E8F0}
.s-07-f{border:1px solid #E2E8F0;background:#fff;border-radius:999px;padding:3px 10px;font:inherit;font-size:12px;cursor:pointer;color:#475569}
.s-07-f:hover{border-color:#93C5FD}
.s-07-f[data-on]{background:#1C6DD0;border-color:#1C6DD0;color:#fff}
.s-07-items{overflow:auto;flex:1}
.s-07-v{padding:10px 14px;border-bottom:1px solid #F1F5F9;cursor:pointer;border-left:3px solid transparent}
.s-07-v:hover{background:#F8FAFC}
.s-07-v[data-on]{background:#EFF6FF;border-left-color:#1C6DD0}
.s-07-vtop{display:flex;justify-content:space-between;font-weight:600;font-size:13px}
.s-07-badge{font-size:11px;padding:1px 7px;border-radius:999px;color:#fff;font-weight:600}
.s-07-muted{color:#64748B;font-size:12px}
.s-07-loadbar{height:4px;background:#E2E8F0;border-radius:99px;margin-top:6px;overflow:hidden}
.s-07-loadfill{height:100%;background:#1C6DD0}
.s-07-map{position:relative;padding:14px}
.s-07-svg{width:100%;height:100%;background:#fff;border-radius:12px;border:1px solid #E2E8F0}
.s-07-truck{cursor:pointer}
.s-07-truck:hover circle{stroke-width:4}
.s-07-legend{position:absolute;left:26px;bottom:24px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;padding:6px 10px;display:flex;gap:12px;font-size:12px}
.s-07-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}
.s-07-side{background:#fff;border-left:1px solid #E2E8F0;overflow:auto;padding:16px}
.s-07-h2{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#64748B;margin:0 0 8px}
.s-07-big{font-size:17px;font-weight:700}
.s-07-kv{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}
.s-07-tile{background:#F8FAFC;border-radius:8px;padding:8px 10px}
.s-07-tl{list-style:none;margin:0 0 16px;padding:0}
.s-07-tl li{position:relative;padding:0 0 12px 18px;font-size:13px}
.s-07-tl li::before{content:"";position:absolute;left:3px;top:5px;width:8px;height:8px;border-radius:50%;background:#CBD5E1}
.s-07-tl li[data-done]::before{background:#1C6DD0}
.s-07-job{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:6px;font-size:13px}
.s-07-job:hover{border-color:#93C5FD}
.s-07-btn{border:0;background:#1C6DD0;color:#fff;border-radius:6px;padding:5px 10px;font:inherit;font-size:12px;cursor:pointer}
.s-07-btn:hover{background:#1559AA}
.s-07-btn:disabled{background:#CBD5E1;cursor:default}
.s-07-empty{padding:20px;text-align:center;color:#94A3B8;font-size:13px}
`;

export default {
  id: '07-fleet-dispatch',
  name: 'Fleet dispatch board',
  category: 'Operations',
  sector: 'Logistics',
  blurb: 'A live dispatch board for a regional fleet: see every vehicle on the map, spot delays and assign waiting jobs.',
  device: 'desktop',
  accent: '#1C6DD0',
  tags: ['dashboard', 'map', 'live status'],
  render(root) {
    const fleet = VEHICLES.map(v => ({ ...v, stops: [...v.stops] }));
    const jobs = JOBS.map(j => [...j]);
    const s = { filter: 'All', sel: fleet[0].id, live: true, note: '' };
    root.innerHTML = `<style>${CSS}</style>
<div class="s-07-app">
  <header class="s-07-top"><span class="s-07-brand">Routewise</span><h1 class="s-07-h1">Pune dispatch · Tuesday 7 October</h1><span class="s-07-stats"></span>
    <button type="button" class="s-07-live"><span class="s-07-pulse"></span><span class="s-07-livetxt">Live</span></button></header>
  <section class="s-07-list"><div class="s-07-filters">${['All', 'En route', 'Delayed', 'Loading', 'Idle'].map(f => `<button type="button" class="s-07-f" data-f="${f}">${f}</button>`).join('')}</div><div class="s-07-items"></div></section>
  <section class="s-07-map"><svg class="s-07-svg" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid meet"></svg>
    <div class="s-07-legend">${Object.entries(TONE).map(([k, c]) => `<span><span class="s-07-dot" style="background:${c}"></span>${k}</span>`).join('')}</div></section>
  <aside class="s-07-side"></aside>
</div>`;
    const $ = q => root.querySelector(q);
    const svg = $('.s-07-svg');
    const base = (() => {
      let g = '';
      for (let x = 20; x < 600; x += 40) g += `<line x1="${x}" y1="0" x2="${x}" y2="460" stroke="#F1F5F9"/>`;
      for (let y = 20; y < 460; y += 40) g += `<line x1="0" y1="${y}" x2="600" y2="${y}" stroke="#F1F5F9"/>`;
      return `${g}<path d="M0 330C120 300 200 350 330 330S520 260 600 280" stroke="#BFDBFE" stroke-width="14" fill="none" opacity=".6"/>
        <text x="500" y="276" font-size="10" fill="#60A5FA">Mula-Mutha river</text>`;
    })();

    function drawMap() {
      const sel = fleet.find(v => v.id === s.sel);
      const routes = Object.entries(ROUTES).map(([k, pts]) => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${sel && sel.route === k ? '#1C6DD0' : '#CBD5E1'}" stroke-width="${sel && sel.route === k ? 4 : 3}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="5" fill="#fff" stroke="#94A3B8" stroke-width="2"/>`).join('');
      const trucks = fleet.map(v => { const [x, y] = pointAt(v.route, v.t); return `<g class="s-07-truck" data-v="${v.id}"><circle cx="${x}" cy="${y}" r="${v.id === s.sel ? 10 : 8}" fill="${TONE[v.status]}" stroke="#fff" stroke-width="3"/><title>${v.id} · ${v.driver}</title></g>`; }).join('');
      svg.innerHTML = `${base}${routes}<rect x="44" y="384" width="32" height="32" rx="6" fill="#0F172A"/><text x="60" y="404" font-size="10" fill="#fff" text-anchor="middle">HQ</text>
        <text x="84" y="430" font-size="11" fill="#475569">Bhosari depot</text>${trucks}`;
    }
    function drawList() {
      const list = fleet.filter(v => s.filter === 'All' || v.status === s.filter);
      $('.s-07-items').innerHTML = list.length ? list.map(v => `<div class="s-07-v" data-v="${v.id}" ${v.id === s.sel ? 'data-on' : ''}><div class="s-07-vtop"><span>${v.id}</span><span class="s-07-badge" style="background:${TONE[v.status]}">${v.status}</span></div>
        <div class="s-07-muted">${v.driver} · ${v.type}</div><div class="s-07-muted">To ${v.dest} · ETA ${v.eta}</div><div class="s-07-loadbar"><div class="s-07-loadfill" style="width:${v.load}%"></div></div></div>`).join('')
        : '<div class="s-07-empty">No vehicles with this status.</div>';
      root.querySelectorAll('.s-07-f').forEach(b => b.toggleAttribute('data-on', b.dataset.f === s.filter));
      const c = k => fleet.filter(v => v.status === k).length;
      $('.s-07-stats').innerHTML = `<span class="s-07-stat"><b>${c('En route')}</b>en route</span> &nbsp; <span class="s-07-stat"><b>${c('Delayed')}</b>delayed</span> &nbsp; <span class="s-07-stat"><b>${jobs.length}</b>jobs waiting</span>`;
    }
    function drawSide() {
      const v = fleet.find(x => x.id === s.sel);
      const reached = Math.floor(v.t * (v.stops.length - 1) + 0.001);
      const idle = fleet.filter(x => x.status === 'Idle');
      $('.s-07-side').innerHTML = `${s.note ? `<div class="s-07-tile" style="margin-bottom:10px;color:#1559AA">${s.note}</div>` : ''}<h2 class="s-07-h2">Vehicle</h2><div class="s-07-big">${v.id}</div><div class="s-07-muted">${v.type} · driver ${v.driver}</div>
        <div class="s-07-kv"><div class="s-07-tile"><div class="s-07-muted">Status</div><strong style="color:${TONE[v.status]}">${v.status}</strong></div><div class="s-07-tile"><div class="s-07-muted">ETA</div><strong>${v.eta}</strong></div>
        <div class="s-07-tile"><div class="s-07-muted">Load</div><strong>${v.load}%</strong></div><div class="s-07-tile"><div class="s-07-muted">Progress</div><strong>${Math.round(v.t * 100)}%</strong></div></div>
        <h2 class="s-07-h2">Stops</h2><ul class="s-07-tl">${v.stops.map((st, i) => `<li ${i <= reached ? 'data-done' : ''}>${st}</li>`).join('')}</ul>
        <h2 class="s-07-h2">Unassigned jobs</h2>${jobs.length ? jobs.map(([id, lane, wt], i) => `<div class="s-07-job"><div><strong>${id}</strong><div class="s-07-muted">${lane} · ${wt}</div></div><button type="button" class="s-07-btn" data-job="${i}" ${idle.length ? '' : 'disabled'}>Assign</button></div>`).join('')
        : '<div class="s-07-empty">All jobs are assigned.</div>'}
        <div class="s-07-muted">${idle.length ? `Assign sends the job to the next idle vehicle (${idle[0].id}).` : 'No idle vehicles right now.'}</div>`;
    }
    function all() { drawList(); drawMap(); drawSide(); }

    root.addEventListener('click', e => {
      const t = e.target;
      const f = t.closest('.s-07-f'); if (f) { s.filter = f.dataset.f; drawList(); return; }
      const v = t.closest('[data-v]'); if (v) { s.sel = v.dataset.v; s.note = ''; all(); return; }
      if (t.closest('.s-07-live')) { s.live = !s.live; $('.s-07-live').toggleAttribute('data-off', !s.live); $('.s-07-livetxt').textContent = s.live ? 'Live' : 'Paused'; return; }
      const j = t.closest('[data-job]');
      if (j) {
        const idle = fleet.find(x => x.status === 'Idle'); if (!idle) return;
        const [id, lane, , route] = jobs.splice(+j.dataset.job, 1)[0];
        Object.assign(idle, { status: 'Loading', route, t: 0, load: 40, eta: '15:20', dest: lane.split(' to ')[1], stops: ['Bhosari depot', ...lane.split(' to ')] });
        s.sel = idle.id; s.note = `${id} assigned to ${idle.driver}.`; all();
      }
    });
    const timer = setInterval(() => {
      if (!s.live) return;
      fleet.forEach(v => {
        if (v.status === 'En route' || v.status === 'Delayed') { v.t = Math.min(1, v.t + (v.status === 'Delayed' ? 0.004 : 0.012)); if (v.t >= 1) { v.status = 'Idle'; v.load = 0; v.eta = '-'; v.t = 0; } }
        else if (v.status === 'Loading') { v.load = Math.min(100, v.load + 6); if (v.load >= 80) v.status = 'En route'; }
      });
      drawMap(); drawList();
      drawSide();
    }, 1500);
    all();
    return () => clearInterval(timer);
  },
};
