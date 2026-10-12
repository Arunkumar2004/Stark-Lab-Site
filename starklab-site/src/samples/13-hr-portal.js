/* 13 Leave and attendance portal: employee self-service with balances, attendance calendar and leave requests. */

const CSS = `
.s-13-app{display:grid;grid-template-columns:200px 1fr;height:100%;font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1e2532;background:#f6f7f9}
.s-13-nav{background:#fff;border-right:1px solid #e3e6eb;padding:18px 12px;display:flex;flex-direction:column;gap:2px}
.s-13-brand{font-weight:700;font-size:15px;padding:0 8px 16px;color:#c2410c}
.s-13-ni{padding:8px 10px;border-radius:7px;color:#4b5362}
.s-13-ni.s-13-on{background:#fff1e8;color:#9a3412;font-weight:600}
.s-13-me{margin-top:auto;display:flex;gap:8px;align-items:center;padding:8px;font-size:12px}
.s-13-av{width:30px;height:30px;border-radius:50%;background:#fde3d2;color:#9a3412;display:grid;place-items:center;font-weight:700;font-size:11px}
.s-13-main{overflow:auto;padding:20px 26px;display:flex;flex-direction:column;gap:16px}
.s-13-head{display:flex;justify-content:space-between;align-items:flex-end}
.s-13-h{margin:0;font-size:20px;font-weight:650}
.s-13-sub{color:#7b8392;font-size:12px}
.s-13-seg{display:inline-flex;background:#eceef2;border-radius:8px;padding:3px}
.s-13-seg button{border:0;background:none;font:inherit;padding:5px 12px;border-radius:6px;cursor:pointer;color:#4b5362}
.s-13-seg button.s-13-on{background:#fff;color:#1e2532;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.s-13-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.s-13-card{background:#fff;border:1px solid #e3e6eb;border-radius:10px;padding:14px 16px}
.s-13-kl{color:#7b8392;font-size:12px}
.s-13-kv{font-size:22px;font-weight:650;margin:2px 0 6px}
.s-13-meter{height:6px;border-radius:3px;background:#f0f1f4;overflow:hidden}
.s-13-meter i{display:block;height:100%;background:#ea6a2a;border-radius:3px}
.s-13-grid{display:grid;grid-template-columns:330px 1fr;gap:16px}
.s-13-ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.s-13-ch h2,.s-13-card h2{margin:0;font-size:14px}
.s-13-arrow{border:1px solid #d6dae1;background:#fff;border-radius:6px;width:26px;height:26px;cursor:pointer;font:inherit}
.s-13-arrow:hover{border-color:#ea6a2a}
.s-13-legend{display:flex;gap:10px;flex-wrap:wrap;font-size:11px;color:#7b8392;margin-top:8px}
.s-13-lg{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.s-13-form{display:grid;grid-template-columns:1fr 1fr 1fr 1.4fr auto;gap:8px;align-items:end;margin:10px 0 14px}
.s-13-form label{font-size:11px;color:#7b8392;display:flex;flex-direction:column;gap:3px}
.s-13-in{border:1px solid #d6dae1;border-radius:7px;padding:7px 8px;font:inherit;background:#fff}
.s-13-btn{border:0;background:#ea6a2a;color:#fff;border-radius:7px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer}
.s-13-btn:hover{background:#c2410c}
.s-13-err{color:#b42318;font-size:12px;min-height:16px}
.s-13-table{width:100%;border-collapse:collapse}
.s-13-table th{text-align:left;font-size:11px;color:#7b8392;font-weight:600;padding:7px 8px;border-bottom:1px solid #e3e6eb}
.s-13-table td{padding:9px 8px;border-bottom:1px solid #f0f1f4}
.s-13-table tr:hover td{background:#fffaf6}
.s-13-st{font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px}
.s-13-st.s-13-Pending{background:#fef3c7;color:#92400e}
.s-13-st.s-13-Approved{background:#dcfce7;color:#166534}
.s-13-st.s-13-Rejected{background:#fee2e2;color:#991b1b}
.s-13-act{border:1px solid #d6dae1;background:#fff;border-radius:6px;padding:3px 9px;font:inherit;font-size:12px;cursor:pointer;margin-left:4px}
.s-13-act:hover{border-color:#ea6a2a;color:#c2410c}
.s-13-empty{text-align:center;color:#9aa1ad;padding:20px}
`;

const TYPES = { Casual: 12, Sick: 8, Earned: 18 };
const MONTHS = [
  { label: 'August 2026', start: 5, days: 31, marks: { 15: 'H', 7: 'L', 8: 'L', 20: 'W', 21: 'W', 26: 'A' } },
  { label: 'September 2026', start: 1, days: 30, marks: { 3: 'W', 4: 'W', 17: 'L', 14: 'H', 24: 'W' } },
  { label: 'October 2026', start: 3, days: 31, marks: { 2: 'H', 20: 'H', 1: 'W', 6: 'W' } }
];
const COLORS = { P: '#fde8db', L: '#ea6a2a', H: '#94a3b8', W: '#fdba74', A: '#fca5a5', F: '#ffffff', X: '#f3f4f6' };
const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5) + 1;

export default {
  id: '13-hr-portal',
  name: 'Leave and attendance portal',
  category: 'Internal tools',
  sector: 'HR',
  blurb: 'Employees check leave balances and attendance and apply for time off; managers approve their team in the same screen.',
  device: 'desktop',
  accent: '#EA6A2A',
  tags: ['HR', 'self-service', 'approvals'],
  render(root) {
    const used = { Casual: 4, Sick: 1, Earned: 6 };
    const reqs = [
      { who: 'Meera Pillai', type: 'Earned', from: '2026-10-22', to: '2026-10-24', reason: 'Family wedding in Kochi', status: 'Pending', mine: true },
      { who: 'Meera Pillai', type: 'Sick', from: '2026-09-17', to: '2026-09-17', reason: 'Fever', status: 'Approved', mine: true },
      { who: 'Arjun Batra', type: 'Casual', from: '2026-10-13', to: '2026-10-14', reason: 'Moving house', status: 'Pending', mine: false },
      { who: 'Fatima Sheikh', type: 'Earned', from: '2026-11-02', to: '2026-11-06', reason: 'Trip to Jaipur', status: 'Pending', mine: false },
      { who: 'Daniel Brooks', type: 'Casual', from: '2026-09-29', to: '2026-09-29', reason: 'Visa appointment', status: 'Approved', mine: false }
    ];
    const st = { view: 'mine', month: 2 };

    root.innerHTML = `<style>${CSS}</style>
      <div class="s-13-app">
        <nav class="s-13-nav"><div class="s-13-brand">Kestrel People</div>
          <div class="s-13-ni">Home</div><div class="s-13-ni s-13-on">Leave and attendance</div><div class="s-13-ni">Payslips</div><div class="s-13-ni">Directory</div><div class="s-13-ni">Policies</div>
          <div class="s-13-me"><span class="s-13-av">MP</span><div>Meera Pillai<div class="s-13-sub">Product designer · Bengaluru</div></div></div></nav>
        <main class="s-13-main">
          <div class="s-13-head"><div><h1 class="s-13-h">Leave and attendance</h1><div class="s-13-sub">Leave year April 2026 to March 2027</div></div>
            <div class="s-13-seg"><button class="s-13-on" data-view="mine">My requests</button><button data-view="team">Team approvals</button></div></div>
          <div class="s-13-kpis" data-k="kpis"></div>
          <div class="s-13-grid">
            <div class="s-13-card"><div class="s-13-ch"><button class="s-13-arrow" data-m="-1" aria-label="Previous month">&lsaquo;</button><h2 data-k="mlabel"></h2><button class="s-13-arrow" data-m="1" aria-label="Next month">&rsaquo;</button></div>
              <div data-k="cal"></div>
              <div class="s-13-legend"><span><i class="s-13-lg" style="background:${COLORS.P}"></i>Present</span><span><i class="s-13-lg" style="background:${COLORS.W}"></i>Work from home</span><span><i class="s-13-lg" style="background:${COLORS.L}"></i>Leave</span><span><i class="s-13-lg" style="background:${COLORS.H}"></i>Holiday</span><span><i class="s-13-lg" style="background:${COLORS.A}"></i>Missed punch</span></div></div>
            <div class="s-13-card"><h2 data-k="ltitle"></h2>
              <form class="s-13-form" data-k="form">
                <label>Type<select class="s-13-in" name="type">${Object.keys(TYPES).map(t => `<option>${t}</option>`).join('')}</select></label>
                <label>From<input class="s-13-in" type="date" name="from" value="2026-10-28"></label>
                <label>To<input class="s-13-in" type="date" name="to" value="2026-10-29"></label>
                <label>Reason<input class="s-13-in" name="reason" placeholder="Optional note for your manager"></label>
                <button class="s-13-btn" type="submit">Apply</button></form>
              <div class="s-13-err" data-k="err"></div>
              <div data-k="list"></div></div>
          </div>
        </main>
      </div>`;
    const $ = s => root.querySelector(s);

    const drawKpis = () => {
      const pend = reqs.filter(r => r.status === 'Pending' && !r.mine).length;
      $('[data-k="kpis"]').innerHTML = Object.entries(TYPES).map(([t, tot]) => `<div class="s-13-card"><div class="s-13-kl">${t} leave</div>
        <div class="s-13-kv">${tot - used[t]} <span class="s-13-sub">of ${tot} days left</span></div><div class="s-13-meter"><i style="width:${(used[t] / tot) * 100}%"></i></div></div>`).join('')
        + `<div class="s-13-card"><div class="s-13-kl">Attendance this month</div><div class="s-13-kv">96.4%</div><div class="s-13-sub">${pend} team request${pend === 1 ? '' : 's'} awaiting you</div></div>`;
    };

    const drawCal = () => {
      const m = MONTHS[st.month], cell = 40, gap = 4;
      const marks = { ...m.marks };
      reqs.filter(r => r.mine && r.status !== 'Rejected').forEach(r => {
        for (let d = new Date(r.from + 'T12:00:00'); d <= new Date(r.to + 'T12:00:00'); d.setDate(d.getDate() + 1)) {
          if (d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) === m.label) marks[d.getDate()] = 'L';
        }
      });
      let svg = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<text x="${i * (cell + gap) + cell / 2}" y="12" text-anchor="middle" font-size="10" fill="#7b8392">${d}</text>`).join('');
      for (let d = 1; d <= m.days; d++) {
        const idx = m.start + d - 1, col = idx % 7, row = Math.floor(idx / 7), weekend = col > 4;
        const isFuture = st.month === 2 && d > 7;
        const k = marks[d] || (weekend ? 'X' : isFuture ? 'F' : 'P');
        const x = col * (cell + gap), y = 20 + row * (cell + gap - 8);
        svg += `<g><rect x="${x}" y="${y}" width="${cell}" height="${cell - 8}" rx="6" fill="${COLORS[k]}" stroke="${k === 'F' ? '#e3e6eb' : 'none'}"><title>${d} ${m.label}</title></rect>
          <text x="${x + 6}" y="${y + 14}" font-size="10" fill="${k === 'L' ? '#fff' : '#4b5362'}">${d}</text></g>`;
      }
      $('[data-k="mlabel"]').textContent = m.label;
      $('[data-k="cal"]').innerHTML = `<svg viewBox="0 0 ${7 * (cell + gap)} ${20 + 6 * (cell + gap - 8)}" width="100%" role="img" aria-label="Attendance calendar">${svg}</svg>`;
      root.querySelectorAll('[data-m]').forEach(b => { b.disabled = (b.dataset.m === '-1' && st.month === 0) || (b.dataset.m === '1' && st.month === MONTHS.length - 1); });
    };

    const drawList = () => {
      const team = st.view === 'team';
      const rows = reqs.filter(r => r.mine !== team);
      $('[data-k="form"]').style.display = team ? 'none' : '';
      $('[data-k="ltitle"]').textContent = team ? 'Requests from your team' : 'Apply for leave';
      $('[data-k="list"]').innerHTML = rows.length ? `<table class="s-13-table"><thead><tr>${team ? '<th>Employee</th>' : ''}<th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead><tbody>
        ${rows.map(r => `<tr>${team ? `<td>${r.who}</td>` : ''}<td>${r.type}</td><td>${fmt(r.from)}${r.to !== r.from ? ' to ' + fmt(r.to) : ''}</td><td>${days(r.from, r.to)}</td><td>${r.reason || '<span class="s-13-sub">No note</span>'}</td>
          <td><span class="s-13-st s-13-${r.status}">${r.status}</span>${team && r.status === 'Pending' ? `<button class="s-13-act" data-dec="Approved" data-i="${reqs.indexOf(r)}">Approve</button><button class="s-13-act" data-dec="Rejected" data-i="${reqs.indexOf(r)}">Reject</button>` : ''}</td></tr>`).join('')}
        </tbody></table>` : '<div class="s-13-empty">Nothing here yet</div>';
      root.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('s-13-on', b.dataset.view === st.view));
    };
    const draw = () => { drawKpis(); drawCal(); drawList(); };

    root.addEventListener('click', e => {
      const v = e.target.closest('[data-view]');
      if (v) { st.view = v.dataset.view; drawList(); return; }
      const m = e.target.closest('[data-m]');
      if (m) { st.month = Math.min(MONTHS.length - 1, Math.max(0, st.month + +m.dataset.m)); drawCal(); return; }
      const d = e.target.closest('[data-dec]');
      if (d) { reqs[+d.dataset.i].status = d.dataset.dec; drawKpis(); drawList(); }
    });
    $('[data-k="form"]').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements, type = f.type.value, from = f.from.value, to = f.to.value, err = $('[data-k="err"]');
      if (!from || !to || to < from) { err.textContent = 'The end date must be on or after the start date.'; return; }
      const n = days(from, to);
      if (n > TYPES[type] - used[type]) { err.textContent = `Only ${TYPES[type] - used[type]} ${type.toLowerCase()} days left this year.`; return; }
      err.textContent = '';
      used[type] += n;
      reqs.unshift({ who: 'Meera Pillai', type, from, to, reason: f.reason.value.trim(), status: 'Pending', mine: true });
      f.reason.value = '';
      st.month = 2; draw();
    });
    draw();
  }
};
