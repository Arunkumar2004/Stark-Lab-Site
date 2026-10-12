/* Sample 08: Clinic appointment scheduler. Follows src/samples/_contract.md (prefix s-08-). */

const DOCTORS = [
  { id: 'dk', name: 'Dr. Deepa Krishnan', spec: 'General medicine', room: 'Room 2' },
  { id: 'an', name: 'Dr. Arjun Nair', spec: 'Paediatrics', room: 'Room 4' },
  { id: 'sw', name: 'Dr. Sophie Walsh', spec: 'Dermatology', room: 'Room 5' },
];
const SLOTS = Array.from({ length: 16 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
const SEED = {
  0: [['dk', '09:00', 'Ramesh Iyer', 'Follow-up, blood pressure', 'In person', 'Checked in'], ['dk', '10:30', 'Fatima Sheikh', 'Fever and cough', 'In person', 'Booked'],
    ['dk', '12:00', 'Gopal Das', 'Diabetes review', 'Video', 'Booked'], ['an', '09:30', 'Baby Aarav Menon', 'Vaccination, 9 months', 'In person', 'Checked in'],
    ['an', '11:00', 'Ishita Roy', 'Ear pain', 'In person', 'Booked'], ['an', '14:00', 'Kabir Sood', 'Growth check', 'In person', 'Booked'],
    ['sw', '10:00', 'Neha Bansal', 'Acne follow-up', 'Video', 'No-show'], ['sw', '13:30', 'Liam Carter', 'Mole check', 'In person', 'Booked'], ['sw', '15:30', 'Pooja Rane', 'Eczema', 'In person', 'Booked']],
  1: [['dk', '09:30', 'Anil Joshi', 'Annual check-up', 'In person', 'Booked'], ['an', '10:00', 'Riya Thomas', 'Allergy', 'Video', 'Booked'], ['sw', '11:30', 'Omar Haddad', 'Rash', 'In person', 'Booked']],
};
const STATUS_TONE = { Booked: '#0891B2', 'Checked in': '#059669', 'No-show': '#9CA3AF', Cancelled: '#DC2626' };

const CSS = `
.s-08-app{display:grid;grid-template-columns:200px 1fr 300px;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0F172A;background:#fff}
.s-08-app *{box-sizing:border-box}
.s-08-nav{background:#F8FAFC;border-right:1px solid #E2E8F0;padding:18px 12px}
.s-08-brand{font-weight:800;color:#0E7490;padding:0 8px 18px}
.s-08-ni{padding:7px 10px;border-radius:7px;color:#475569;cursor:pointer}
.s-08-ni:hover{background:#EEF2F6}
.s-08-ni[data-on]{background:#CFFAFE;color:#155E75;font-weight:600}
.s-08-main{display:flex;flex-direction:column;min-height:0;padding:16px 20px}
.s-08-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.s-08-h1{margin:0;font-size:20px}
.s-08-muted{color:#64748B;font-size:12px}
.s-08-day{display:flex;align-items:center;gap:6px}
.s-08-ib{border:1px solid #CBD5E1;background:#fff;border-radius:7px;padding:5px 10px;font:inherit;cursor:pointer}
.s-08-ib:hover{background:#F1F5F9}
.s-08-ib:disabled{opacity:.4;cursor:default}
.s-08-kpis{display:grid;grid-template-columns:repeat(4,1fr) 120px;gap:10px;margin-bottom:12px}
.s-08-kpi{border:1px solid #E2E8F0;border-radius:9px;padding:8px 12px}
.s-08-kv{font-size:19px;font-weight:700;font-variant-numeric:tabular-nums}
.s-08-cal{flex:1;overflow:auto;border:1px solid #E2E8F0;border-radius:10px}
.s-08-grid{display:grid;grid-template-columns:62px repeat(3,1fr)}
.s-08-ch{position:sticky;top:0;background:#F8FAFC;border-bottom:1px solid #E2E8F0;padding:8px 10px;font-size:13px;font-weight:600;z-index:1}
.s-08-ch[data-dim]{opacity:.35}
.s-08-time{font-size:11px;color:#94A3B8;padding:4px 8px;border-top:1px solid #F1F5F9;height:44px}
.s-08-cell{border-top:1px solid #F1F5F9;border-left:1px solid #F1F5F9;height:44px;padding:3px;cursor:pointer}
.s-08-cell:hover{background:#ECFEFF}
.s-08-cell[data-dim]{background:#FAFAFA;cursor:default}
.s-08-cell[data-pick]{background:#CFFAFE;outline:2px dashed #0891B2;outline-offset:-3px}
.s-08-appt{height:100%;border-radius:6px;padding:3px 7px;font-size:12px;color:#fff;overflow:hidden;line-height:1.3;cursor:pointer;transition:filter .15s}
.s-08-appt:hover{filter:brightness(1.08)}
.s-08-appt[data-on]{box-shadow:0 0 0 2px #0F172A}
.s-08-side{border-left:1px solid #E2E8F0;padding:18px;overflow:auto;background:#FCFDFE}
.s-08-h2{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#64748B;margin:0 0 10px}
.s-08-lbl{display:block;font-size:12px;font-weight:600;margin:10px 0 4px}
.s-08-in{width:100%;border:1px solid #CBD5E1;border-radius:7px;padding:7px 9px;font:inherit;font-size:13px}
.s-08-in:focus{outline:2px solid #A5F3FC;border-color:#0891B2}
.s-08-seg{display:flex;gap:6px}
.s-08-seg label{flex:1;border:1px solid #CBD5E1;border-radius:7px;padding:6px;text-align:center;font-size:13px;cursor:pointer}
.s-08-seg input{display:none}
.s-08-seg label:has(input:checked){border-color:#0891B2;background:#ECFEFF;color:#155E75;font-weight:600}
.s-08-btn{width:100%;border:0;background:#0891B2;color:#fff;border-radius:8px;padding:9px;font:inherit;font-weight:600;cursor:pointer;margin-top:14px}
.s-08-btn:hover{background:#0E7490}
.s-08-ghost{background:#fff;color:#0F172A;border:1px solid #CBD5E1}
.s-08-ghost:hover{background:#F1F5F9}
.s-08-pill{display:inline-block;font-size:11px;padding:2px 8px;border-radius:999px;color:#fff;font-weight:600}
.s-08-dl{display:grid;grid-template-columns:80px 1fr;gap:6px;font-size:13px;margin:12px 0}
.s-08-dl dt{color:#64748B}
.s-08-dl dd{margin:0}
.s-08-err{color:#DC2626;font-size:12px;margin-top:6px;min-height:16px}
`;

export default {
  id: '08-clinic-scheduler',
  name: 'Clinic appointment scheduler',
  category: 'Health',
  sector: 'Outpatient clinics',
  blurb: 'A front-desk day view for a multi-doctor clinic: book into free slots, check patients in and track utilisation.',
  device: 'desktop',
  accent: '#0891B2',
  tags: ['calendar', 'booking', 'front desk'],
  render(root) {
    const days = { 0: SEED[0].map(a => [...a]), 1: SEED[1].map(a => [...a]) };
    const s = { day: 0, doc: 'all', pick: null, sel: null, err: '' };
    const DATES = ['Tuesday 7 October', 'Wednesday 8 October'];
    root.innerHTML = `<style>${CSS}</style>
<div class="s-08-app">
  <nav class="s-08-nav"><div class="s-08-brand">Arogya Clinics</div>${['Schedule', 'Patients', 'Doctors', 'Billing', 'Reports'].map((n, i) => `<div class="s-08-ni" ${i ? '' : 'data-on'}>${n}</div>`).join('')}
    <div class="s-08-muted" style="padding:20px 10px 0">Indiranagar branch<br>Front desk: Lakshmi P.</div></nav>
  <main class="s-08-main">
    <div class="s-08-head"><div><h1 class="s-08-h1">Appointments</h1><div class="s-08-muted s-08-date"></div></div>
      <div class="s-08-day"><select class="s-08-in s-08-doc" style="width:200px"><option value="all">All doctors</option>${DOCTORS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}</select>
        <button type="button" class="s-08-ib s-08-prev">Previous</button><button type="button" class="s-08-ib s-08-next">Next day</button></div></div>
    <div class="s-08-kpis"></div><div class="s-08-cal"><div class="s-08-grid"></div></div>
  </main>
  <aside class="s-08-side"></aside>
</div>`;
    const $ = q => root.querySelector(q);
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const list = () => days[s.day];
    const find = (doc, time) => list().find(a => a[0] === doc && a[1] === time && a[5] !== 'Cancelled');

    function drawKpis() {
      const l = list().filter(a => s.doc === 'all' || a[0] === s.doc), live = l.filter(a => a[5] !== 'Cancelled');
      const cap = SLOTS.length * (s.doc === 'all' ? 3 : 1), util = Math.round((live.length / cap) * 100);
      const r = 22, c = 2 * Math.PI * r;
      $('.s-08-kpis').innerHTML = [['Booked', live.length], ['Checked in', l.filter(a => a[5] === 'Checked in').length], ['No-shows', l.filter(a => a[5] === 'No-show').length], ['Free slots', cap - live.length]]
        .map(([k, v]) => `<div class="s-08-kpi"><div class="s-08-muted">${k}</div><div class="s-08-kv">${v}</div></div>`).join('')
        + `<div class="s-08-kpi" style="display:flex;align-items:center;gap:6px"><svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="6"/><circle cx="27" cy="27" r="${r}" fill="none" stroke="#0891B2" stroke-width="6" stroke-dasharray="${(util / 100) * c} ${c}" transform="rotate(-90 27 27)" stroke-linecap="round"/><text x="27" y="31" text-anchor="middle" font-size="11" font-weight="700" fill="#0F172A">${util}%</text></svg><span class="s-08-muted">Utilised</span></div>`;
    }
    function drawGrid() {
      const dim = d => s.doc !== 'all' && s.doc !== d.id;
      let h = '<div class="s-08-ch"></div>' + DOCTORS.map(d => `<div class="s-08-ch" ${dim(d) ? 'data-dim' : ''}>${d.name}<div class="s-08-muted">${d.spec} · ${d.room}</div></div>`).join('');
      SLOTS.forEach(t => {
        h += `<div class="s-08-time">${t}</div>`;
        DOCTORS.forEach(d => {
          const a = find(d.id, t), picked = s.pick && s.pick[0] === d.id && s.pick[1] === t;
          h += `<div class="s-08-cell" data-doc="${d.id}" data-t="${t}" ${dim(d) ? 'data-dim' : ''} ${picked ? 'data-pick' : ''}>${a ? `<div class="s-08-appt" data-appt="${list().indexOf(a)}" ${s.sel === list().indexOf(a) ? 'data-on' : ''} style="background:${STATUS_TONE[a[5]]}"><strong>${esc(a[2])}</strong><br>${esc(a[3])}</div>` : ''}</div>`;
        });
      });
      $('.s-08-grid').innerHTML = h;
      $('.s-08-date').textContent = `${DATES[s.day]} 2026 · 09:00 to 17:00`;
      $('.s-08-prev').disabled = s.day === 0; $('.s-08-next').disabled = s.day === 1;
    }
    function drawSide() {
      const side = $('.s-08-side');
      if (s.sel !== null) {
        const a = list()[s.sel], d = DOCTORS.find(x => x.id === a[0]);
        side.innerHTML = `<h2 class="s-08-h2">Appointment</h2><div style="font-size:17px;font-weight:700">${esc(a[2])}</div><span class="s-08-pill" style="background:${STATUS_TONE[a[5]]}">${a[5]}</span>
          <dl class="s-08-dl"><dt>Time</dt><dd>${a[1]}, 30 min</dd><dt>Doctor</dt><dd>${d.name}</dd><dt>Reason</dt><dd>${esc(a[3])}</dd><dt>Mode</dt><dd>${a[4]}${a[4] === 'Video' ? ' (link sent by SMS)' : `, ${d.room}`}</dd></dl>
          ${a[5] === 'Booked' ? '<button type="button" class="s-08-btn" data-set="Checked in">Check in</button><button type="button" class="s-08-btn s-08-ghost" data-set="No-show">Mark no-show</button><button type="button" class="s-08-btn s-08-ghost" data-set="Cancelled">Cancel appointment</button>'
            : '<button type="button" class="s-08-btn s-08-ghost" data-set="Booked">Undo status</button>'}`;
        return;
      }
      const p = s.pick;
      side.innerHTML = `<h2 class="s-08-h2">New appointment</h2>${p ? '' : '<p class="s-08-muted">Click a free slot in the calendar to start a booking.</p>'}
        <form class="s-08-form"><label class="s-08-lbl">Doctor</label><select class="s-08-in" name="doc">${DOCTORS.map(d => `<option value="${d.id}" ${p && p[0] === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}</select>
        <label class="s-08-lbl">Time</label><select class="s-08-in" name="time">${SLOTS.map(t => `<option ${p && p[1] === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
        <label class="s-08-lbl">Patient name</label><input class="s-08-in" name="patient" placeholder="Full name" required>
        <label class="s-08-lbl">Reason for visit</label><input class="s-08-in" name="reason" placeholder="For example, follow-up">
        <label class="s-08-lbl">Mode</label><div class="s-08-seg"><label><input type="radio" name="mode" value="In person" checked>In person</label><label><input type="radio" name="mode" value="Video">Video</label></div>
        <button class="s-08-btn">Book appointment</button><div class="s-08-err">${s.err}</div></form>`;
    }
    function all() { drawKpis(); drawGrid(); drawSide(); }

    root.addEventListener('click', e => {
      const t = e.target;
      const appt = t.closest('[data-appt]'); if (appt) { s.sel = +appt.dataset.appt; s.pick = null; drawGrid(); drawSide(); return; }
      const cell = t.closest('.s-08-cell'); if (cell && !cell.hasAttribute('data-dim')) { s.pick = [cell.dataset.doc, cell.dataset.t]; s.sel = null; s.err = ''; drawGrid(); drawSide(); return; }
      const set = t.closest('[data-set]'); if (set) { list()[s.sel][5] = set.dataset.set; if (set.dataset.set === 'Cancelled') s.sel = null; all(); return; }
      if (t.closest('.s-08-prev')) { s.day = 0; s.sel = null; s.pick = null; all(); }
      if (t.closest('.s-08-next')) { s.day = 1; s.sel = null; s.pick = null; all(); }
      const ni = t.closest('.s-08-ni'); if (ni) root.querySelectorAll('.s-08-ni').forEach(x => x.toggleAttribute('data-on', x === ni));
    });
    root.addEventListener('change', e => { if (e.target.classList.contains('s-08-doc')) { s.doc = e.target.value; s.pick = null; drawKpis(); drawGrid(); } });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements, doc = f.doc.value, time = f.time.value;
      if (find(doc, time)) { s.err = `${time} is already taken for this doctor. Pick another slot.`; drawSide(); return; }
      list().push([doc, time, f.patient.value.trim(), f.reason.value.trim() || 'Consultation', f.mode.value, 'Booked']);
      s.sel = list().length - 1; s.pick = null; s.err = ''; all();
    });
    all();
  },
};
