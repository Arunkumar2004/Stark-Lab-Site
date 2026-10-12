/* 18 Field inspection checklist: a technician audits a rooftop solar install on site, item by item, then submits the report. */

const CSS = `
.s-18-app{height:100%;display:flex;flex-direction:column;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1c2128;background:#f3f4f6}
.s-18-status{height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;font-size:13px;font-weight:600;background:#fff}
.s-18-bar{background:#fff;padding:6px 18px 14px;border-bottom:1px solid #e5e7eb}
.s-18-bar h1{margin:0;font-size:21px}
.s-18-sub{color:#6b7280;font-size:12px}
.s-18-net{display:inline-flex;align-items:center;gap:6px;font-size:12px;border:0;background:#fef3c7;color:#92400e;border-radius:999px;padding:4px 10px;cursor:pointer;font:inherit;font-size:12px;margin-top:8px}
.s-18-net.s-18-online{background:#dcfce7;color:#166534}
.s-18-view{flex:1;overflow:auto;padding:14px 16px 20px}
.s-18-job{background:#fff;border-radius:16px;padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:center;border:2px solid transparent;cursor:pointer;width:100%;font:inherit;text-align:left;color:inherit}
.s-18-job:hover{border-color:#fcd9b8}
.s-18-job.s-18-cur{border-color:#d9480f}
.s-18-time{width:52px;text-align:center;font-weight:700;color:#d9480f;font-size:13px;flex:none}
.s-18-grow{flex:1;min-width:0}
.s-18-tag{font-size:11px;font-weight:600;border-radius:999px;padding:2px 8px;background:#f3f4f6;color:#4b5563}
.s-18-tag.s-18-done{background:#dcfce7;color:#166534}
.s-18-tag.s-18-now{background:#ffedd5;color:#9a3412}
.s-18-head{display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:14px;margin-bottom:12px}
.s-18-filters{display:flex;gap:6px;margin-bottom:12px}
.s-18-f{flex:1;border:1px solid #d1d5db;background:#fff;border-radius:999px;padding:8px 4px;font:inherit;font-size:13px;cursor:pointer}
.s-18-f.s-18-on{background:#1c2128;color:#fff;border-color:#1c2128}
.s-18-sec{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;font-weight:600;margin:14px 4px 6px}
.s-18-item{background:#fff;border-radius:14px;padding:12px;margin-bottom:8px}
.s-18-q{font-weight:500;margin-bottom:10px}
.s-18-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.s-18-opt{border:1.5px solid #d1d5db;background:#fff;border-radius:10px;padding:10px 0;font:inherit;font-size:14px;font-weight:600;cursor:pointer;color:#4b5563;min-height:44px}
.s-18-opt.s-18-pass{background:#16a34a;border-color:#16a34a;color:#fff}
.s-18-opt.s-18-fail{background:#dc2626;border-color:#dc2626;color:#fff}
.s-18-opt.s-18-na{background:#6b7280;border-color:#6b7280;color:#fff}
.s-18-note{width:100%;box-sizing:border-box;margin-top:8px;border:1px solid #fca5a5;background:#fef2f2;border-radius:10px;padding:10px;font:inherit;font-size:13px}
.s-18-empty{text-align:center;color:#9ca3af;padding:30px}
.s-18-btn{width:100%;border:0;background:#d9480f;color:#fff;border-radius:14px;padding:15px;font:inherit;font-weight:700;font-size:15px;cursor:pointer;margin-top:12px}
.s-18-btn:disabled{background:#d1d5db;color:#6b7280;cursor:not-allowed}
.s-18-sum{background:#fff;border-radius:16px;padding:16px;margin-bottom:10px}
.s-18-kv{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6}
.s-18-fl{color:#b91c1c;font-size:13px;padding:6px 0}
.s-18-tabs{display:grid;grid-template-columns:repeat(3,1fr);background:#fff;border-top:1px solid #e5e7eb;padding:8px 6px 22px}
.s-18-tab{border:0;background:none;font:inherit;font-size:11px;color:#9ca3af;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px}
.s-18-tab.s-18-on{color:#d9480f;font-weight:600}
.s-18-badge{background:#d9480f;color:#fff;border-radius:999px;font-size:10px;padding:0 6px;margin-left:3px}
`;

const JOBS = [
  { id: 'INS-2291', time: '08:30', site: 'Greenleaf Apartments, Block C', addr: 'HSR Layout, Bengaluru', kw: '24 kWp', state: 'Done' },
  { id: 'INS-2294', time: '11:00', site: 'Vasundhara Textiles warehouse', addr: 'Peenya Industrial Area', kw: '110 kWp', state: 'In progress' },
  { id: 'INS-2297', time: '14:30', site: 'St. Brendan School', addr: 'Frazer Town, Bengaluru', kw: '48 kWp', state: 'Scheduled' },
  { id: 'INS-2302', time: '16:45', site: 'Hollis Family residence', addr: 'Yelahanka New Town', kw: '6 kWp', state: 'Scheduled' }
];
const CHECKS = [
  ['Roof and mounting', ['Mounting rails fixed at every anchor point', 'Roof penetrations flashed and watertight', 'Panel tilt matches the design (13 degrees)']],
  ['Electrical', ['DC isolator labelled and accessible', 'String voltages within 2% of each other', 'Earthing resistance below 2 ohms', 'AC cables in conduit, no exposed joints']],
  ['Safety and handover', ['Warning signage at meter and inverter', 'Fire extinguisher within 5 m of inverter', 'Owner shown emergency shutdown']]
].map(([sec, qs]) => ({ sec, items: qs.map(q => ({ q, v: null, note: '' })) }));
const ICONS = { jobs: 'M4 6h16M4 12h16M4 18h10', inspect: 'M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11', report: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6' };

export default {
  id: '18-field-inspection',
  name: 'Field inspection checklist',
  category: 'Field',
  sector: 'Solar energy',
  blurb: 'Technicians inspect rooftop solar installs on site, mark each check pass or fail with notes, work offline and submit the report.',
  device: 'phone',
  accent: '#D9480F',
  tags: ['checklist', 'offline first', 'field service'],
  render(root) {
    const checks = CHECKS.map(s => ({ sec: s.sec, items: s.items.map((it, i) => ({ ...it, v: s.sec === 'Roof and mounting' ? 'pass' : s.sec === 'Electrical' && i === 0 ? 'pass' : null })) }));
    const jobs = JOBS.map(j => ({ ...j }));
    const st = { tab: 'inspect', filter: 'All', online: false, job: 'INS-2294', queued: 0 };
    const all = () => checks.flatMap(s => s.items);

    root.innerHTML = `<style>${CSS}</style><div class="s-18-app"><div class="s-18-status"><span>11:24</span><span data-k="sig"></span></div>
      <div class="s-18-bar"><h1 data-k="title"></h1><div class="s-18-sub" data-k="subtitle"></div><button class="s-18-net" data-k="net"></button></div>
      <div class="s-18-view" data-k="view"></div>
      <nav class="s-18-tabs">${Object.keys(ICONS).map(t => `<button class="s-18-tab" data-tab="${t}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[t]}"/></svg><span>${t[0].toUpperCase() + t.slice(1)}<span class="s-18-badge" data-badge="${t}"></span></span></button>`).join('')}</nav></div>`;
    const $ = s => root.querySelector(s);

    const ring = (done, total) => {
      const r = 26, C = 2 * Math.PI * r, p = total ? done / total : 0;
      return `<svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="${done} of ${total} checks done"><circle cx="32" cy="32" r="${r}" fill="none" stroke="#f3f4f6" stroke-width="7"/>
        <circle cx="32" cy="32" r="${r}" fill="none" stroke="#d9480f" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C * p} ${C}" transform="rotate(-90 32 32)"/>
        <text x="32" y="37" text-anchor="middle" font-size="14" font-weight="700" fill="#1c2128">${Math.round(p * 100)}%</text></svg>`;
    };

    const jobsView = () => jobs.map(j => `<button class="s-18-job s-18-${j.id===st.job?'cur':'x'}" data-job="${j.id}"><span class="s-18-time">${j.time}</span>
      <span class="s-18-grow"><b>${j.site}</b><div class="s-18-sub">${j.addr} · ${j.kw}</div></span><span class="s-18-tag s-18-${j.state==='Done'?'done':j.state[0]==='I'?'now':'later'}">${j.state}</span></button>`).join('');

    const inspectView = () => {
      const job = jobs.find(j => j.id === st.job), items = all(), done = items.filter(i => i.v).length;
      if (job.state !== 'In progress') return `<div class="s-18-empty">${job.state === 'Done' ? `${job.site} was inspected and submitted.` : `${job.site} starts at ${job.time}.`}<br>Pick the job in progress from Jobs to continue.</div>`;
      const show = it => st.filter === 'All' || (st.filter === 'Open' && !it.v) || (st.filter === 'Failed' && it.v === 'fail');
      const body = checks.map((s, si) => {
        const rows = s.items.map((it, ii) => (show(it) ? `<div class="s-18-item"><div class="s-18-q">${it.q}</div><div class="s-18-seg">${[['pass', 'Pass'], ['fail', 'Fail'], ['na', 'N/A']].map(([v, l]) => `<button class="s-18-opt s-18-${it.v===v?v:'off'}" data-s="${si}" data-i="${ii}" data-v="${v}">${l}</button>`).join('')}</div>
          ${it.v === 'fail' ? `<textarea class="s-18-note" data-s="${si}" data-i="${ii}" rows="2" placeholder="What is wrong and what is needed to fix it?">${it.note.replace(/</g, '&lt;')}</textarea>` : ''}</div>` : '')).join('');
        return rows ? `<div class="s-18-sec">${s.sec}</div>${rows}` : '';
      }).join('');
      return `<div class="s-18-head">${ring(done, items.length)}<div><b>${done} of ${items.length} checks done</b><div class="s-18-sub">${items.filter(i => i.v === 'fail').length} failed · photos attach from the report</div></div></div>
        <div class="s-18-filters">${['All', 'Open', 'Failed'].map(f => `<button class="s-18-f s-18-${st.filter===f?'on':'off'}" data-filter="${f}">${f}</button>`).join('')}</div>
        ${body || `<div class="s-18-empty">No ${st.filter.toLowerCase()} checks. ${st.filter === 'Open' ? 'Everything is marked.' : ''}</div>`}`;
    };

    const reportView = () => {
      const job = jobs.find(j => j.id === st.job), items = all(), fails = items.filter(i => i.v === 'fail'), done = items.filter(i => i.v).length;
      const missingNotes = fails.some(f => !f.note.trim()), ready = job.state === 'In progress' && done === items.length && !missingNotes;
      return `<div class="s-18-sum"><b>${job.site}</b><div class="s-18-sub">${job.id} · ${job.kw} · Inspector D. Okonkwo</div>
        <div class="s-18-kv"><span>Checks completed</span><b>${done} / ${items.length}</b></div><div class="s-18-kv"><span>Passed</span><b>${items.filter(i => i.v === 'pass').length}</b></div>
        <div class="s-18-kv"><span>Failed</span><b style="color:${fails.length ? '#b91c1c' : 'inherit'}">${fails.length}</b></div><div class="s-18-kv"><span>Result</span><b>${fails.length ? 'Rework needed' : done === items.length ? 'Ready to commission' : 'Incomplete'}</b></div></div>
        ${fails.length ? `<div class="s-18-sum"><b>Failed checks</b>${fails.map(f => `<div class="s-18-fl">${f.q}<div class="s-18-sub">${f.note || 'Note required before submitting'}</div></div>`).join('')}</div>` : ''}
        <button class="s-18-btn" data-k="submit" ${ready ? '' : 'disabled'}>${job.state === 'Done' ? 'Report submitted' : st.online ? 'Submit report' : 'Save and submit when online'}</button>
        <div class="s-18-sub" style="text-align:center;margin-top:8px">${ready || job.state !== 'In progress' ? '' : done < items.length ? `${items.length - done} checks still open` : 'Add a note to every failed check'}</div>`;
    };

    const draw = () => {
      const job = jobs.find(j => j.id === st.job);
      $('[data-k="title"]').textContent = { jobs: "Today's jobs", inspect: 'Inspection', report: 'Report' }[st.tab];
      $('[data-k="subtitle"]').textContent = st.tab === 'jobs' ? 'Wednesday 7 October · 4 sites' : `${job.site} · ${job.id}`;
      const net = $('[data-k="net"]');
      net.className = 's-18-net s-18-' + (st.online ? 'online' : 'offline');
      net.textContent = st.online ? 'Online · all changes synced' : `Offline · ${st.queued} change${st.queued === 1 ? '' : 's'} saved on device`;
      $('[data-k="sig"]').textContent = st.online ? '4G  72%' : 'No signal  72%';
      $('[data-k="view"]').innerHTML = { jobs: jobsView, inspect: inspectView, report: reportView }[st.tab]();
      root.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('s-18-on', b.dataset.tab === st.tab));
      const open = all().filter(i => !i.v).length;
      $('[data-badge="inspect"]').textContent = job.state === 'In progress' && open ? open : '';
      $('[data-badge="inspect"]').style.display = job.state === 'In progress' && open ? '' : 'none';
      root.querySelectorAll('[data-badge="jobs"],[data-badge="report"]').forEach(b => { b.style.display = 'none'; });
    };

    root.addEventListener('click', e => {
      const t = e.target, tab = t.closest('[data-tab]'), opt = t.closest('[data-v]'), f = t.closest('[data-filter]'), job = t.closest('[data-job]');
      if (tab) { st.tab = tab.dataset.tab; draw(); return; }
      if (job) { st.job = job.dataset.job; st.tab = 'inspect'; draw(); return; }
      if (f) { st.filter = f.dataset.filter; draw(); return; }
      if (t.closest('[data-k="net"]')) { st.online = !st.online; if (st.online) st.queued = 0; draw(); return; }
      if (opt) {
        const it = checks[+opt.dataset.s].items[+opt.dataset.i];
        it.v = it.v === opt.dataset.v ? null : opt.dataset.v;
        if (!st.online) st.queued++;
        draw(); return;
      }
      if (t.closest('[data-k="submit"]')) { jobs.find(j => j.id === st.job).state = 'Done'; if (!st.online) st.queued++; draw(); }
    });
    root.addEventListener('input', e => {
      if (e.target.tagName !== 'TEXTAREA') return;
      checks[+e.target.dataset.s].items[+e.target.dataset.i].note = e.target.value;
    });
    draw();
  }
};
