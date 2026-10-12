/* 20 Health and habit tracker: daily habits, activity ring, water log and weekly trends in a calm mobile app. */

const CSS = `
.s-20-app{height:100%;display:flex;flex-direction:column;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1b1d2a;background:#f6f5fb}
.s-20-status{height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;font-size:13px;font-weight:600}
.s-20-view{flex:1;overflow:auto;padding:4px 18px 20px}
.s-20-top{display:flex;justify-content:space-between;align-items:center;margin:4px 0 14px}
.s-20-h1{margin:0;font-size:24px}
.s-20-sub{color:#787b8c;font-size:12px}
.s-20-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:14px}
.s-20-day{border:0;background:#fff;border-radius:12px;padding:8px 0;font:inherit;font-size:12px;cursor:pointer;color:#787b8c;display:flex;flex-direction:column;align-items:center;gap:2px}
.s-20-day b{font-size:15px;color:#1b1d2a}
.s-20-day.s-20-on{background:#6d4fd8;color:#e6defc}
.s-20-day.s-20-on b{color:#fff}
.s-20-hero{background:#fff;border-radius:22px;padding:16px;display:flex;align-items:center;gap:16px}
.s-20-leg{display:flex;flex-direction:column;gap:8px;font-size:13px}
.s-20-leg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px}
.s-20-sec{display:flex;justify-content:space-between;align-items:baseline;margin:20px 2px 8px}
.s-20-sec h2{margin:0;font-size:16px}
.s-20-habit{display:flex;align-items:center;gap:12px;background:#fff;border-radius:16px;padding:12px 14px;margin-bottom:8px;cursor:pointer;border:0;width:100%;font:inherit;text-align:left;color:inherit;min-height:60px}
.s-20-habit:hover{background:#fbfaff}
.s-20-check{width:28px;height:28px;border-radius:50%;border:2px solid #d4cff0;display:grid;place-items:center;flex:none}
.s-20-habit.s-20-done .s-20-check{background:#6d4fd8;border-color:#6d4fd8}
.s-20-habit.s-20-done .s-20-name{text-decoration:line-through;color:#9a9caa}
.s-20-grow{flex:1;min-width:0}
.s-20-streak{font-size:12px;color:#6d4fd8;font-weight:600}
.s-20-water{background:#fff;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px}
.s-20-cups{display:flex;gap:4px;flex:1;flex-wrap:wrap}
.s-20-cup{width:18px;height:24px;border-radius:3px 3px 6px 6px;border:2px solid #c8bff3}
.s-20-cup.s-20-full{background:#8b74e6;border-color:#8b74e6}
.s-20-pm{width:40px;height:40px;border-radius:50%;border:0;background:#efebfd;color:#5a3fc4;font-size:20px;cursor:pointer;font-weight:700}
.s-20-pm:active{transform:scale(.94)}
.s-20-seg{display:grid;grid-template-columns:repeat(3,1fr);background:#ebe8f6;border-radius:12px;padding:3px;margin-bottom:14px}
.s-20-sb{border:0;background:none;font:inherit;font-size:13px;padding:8px;border-radius:10px;cursor:pointer;color:#5c5f70}
.s-20-sb.s-20-on{background:#fff;color:#1b1d2a;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.s-20-card{background:#fff;border-radius:18px;padding:16px;margin-bottom:12px}
.s-20-big{font-size:28px;font-weight:750}
.s-20-in{width:100%;box-sizing:border-box;border:1px solid #ddd8f0;border-radius:12px;padding:12px;font:inherit;margin-bottom:10px;background:#fff}
.s-20-btn{width:100%;border:0;background:#6d4fd8;color:#fff;border-radius:14px;padding:14px;font:inherit;font-weight:700;cursor:pointer}
.s-20-btn:disabled{background:#c9c2ea}
.s-20-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f0eef7}
.s-20-row:last-child{border-bottom:0}
.s-20-del{border:0;background:none;color:#b4233a;font:inherit;font-size:13px;cursor:pointer}
.s-20-sw{width:48px;height:28px;border-radius:999px;border:0;background:#d6d3e2;position:relative;cursor:pointer;flex:none}
.s-20-sw::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left .15s}
.s-20-sw.s-20-on{background:#6d4fd8}
.s-20-sw.s-20-on::after{left:23px}
.s-20-tabs{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:1px solid #ebe8f3;padding:8px 6px 22px}
.s-20-tab{border:0;background:none;font:inherit;font-size:11px;color:#9a9caa;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px}
.s-20-tab.s-20-on{color:#6d4fd8;font-weight:600}
`;

const WEEK = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
const DATES = [1, 2, 3, 4, 5, 6, 7];
const SERIES = {
  Steps: { unit: 'steps', goal: 8000, v: [6420, 9130, 11240, 4310, 7860, 8540, 5210] },
  Sleep: { unit: 'hours', goal: 7.5, v: [6.8, 7.2, 8.4, 8.9, 6.1, 7.6, 7.0] },
  Water: { unit: 'glasses', goal: 8, v: [6, 8, 5, 7, 8, 9, 4] }
};
const ICONS = { today: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', trends: 'M3 17l6-6 4 4 8-8M15 7h6v6', habits: 'M9 11l3 3 8-8M4 12a8 8 0 1 0 8-8', me: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' };
const fmt = (n, unit) => (unit === 'steps' ? n.toLocaleString('en-GB') : n) + ' ' + unit;

export default {
  id: '20-habit-health',
  name: 'Health and habit tracker',
  category: 'Health',
  sector: 'Wellness',
  blurb: 'A personal wellness app for building small daily habits, logging water and checking how steps and sleep trend across the week.',
  device: 'phone',
  accent: '#6D4FD8',
  tags: ['habits', 'wellness', 'charts'],
  render(root) {
    const habits = [
      { name: 'Morning walk, 20 minutes', when: '07:00', streak: 12, done: [1, 1, 1, 0, 1, 1, 1] },
      { name: 'Read 10 pages', when: '21:30', streak: 4, done: [0, 1, 1, 1, 1, 1, 0] },
      { name: 'No screens after 22:30', when: '22:30', streak: 2, done: [1, 0, 0, 1, 1, 1, 0] },
      { name: 'Stretch for 5 minutes', when: '18:00', streak: 0, done: [1, 0, 1, 0, 0, 0, 0] }
    ];
    const st = { tab: 'today', day: 6, metric: 'Steps', remind: true, weekly: true, units: false };
    const water = [...SERIES.Water.v];

    root.innerHTML = `<style>${CSS}</style><div class="s-20-app"><div class="s-20-status"><span>7:52</span><span>LTE  91%</span></div><div class="s-20-view" data-k="view"></div>
      <nav class="s-20-tabs">${Object.keys(ICONS).map(t => `<button class="s-20-tab" data-tab="${t}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[t]}"/></svg>${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</nav></div>`;
    const $ = s => root.querySelector(s);

    const rings = () => {
      const d = st.day, hp = habits.length ? habits.filter(h => h.done[d]).length / habits.length : 0;
      const vals = [[Math.min(1, SERIES.Steps.v[d] / SERIES.Steps.goal), '#6d4fd8', 54], [Math.min(1, water[d] / 8), '#8fb8ff', 40], [hp, '#f29fc5', 26]];
      return `<svg width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Daily rings">${vals.map(([p, c, r]) => {
        const C = 2 * Math.PI * r;
        return `<circle cx="64" cy="64" r="${r}" fill="none" stroke="${c}" stroke-opacity=".18" stroke-width="11"/><circle cx="64" cy="64" r="${r}" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, C * p)} ${C}" transform="rotate(-90 64 64)"/>`;
      }).join('')}</svg>`;
    };

    const today = () => {
      const d = st.day, isToday = d === 6;
      return `<div class="s-20-top"><div><div class="s-20-sub">${isToday ? 'Today' : WEEK[d]}, ${DATES[d]} October</div><h1 class="s-20-h1">Hello, Clara</h1></div></div>
        <div class="s-20-days">${WEEK.map((w, i) => `<button class="s-20-day s-20-${i===d?'on':'off'}" data-day="${i}">${w[0]}<b>${DATES[i]}</b></button>`).join('')}</div>
        <div class="s-20-hero">${rings()}<div class="s-20-leg"><span><i style="background:#6d4fd8"></i>${fmt(SERIES.Steps.v[d], 'steps')}</span><span><i style="background:#8fb8ff"></i>${water[d]} of 8 glasses</span>
          <span><i style="background:#f29fc5"></i>${habits.filter(h => h.done[d]).length} of ${habits.length} habits</span></div></div>
        <div class="s-20-sec"><h2>Habits</h2><span class="s-20-sub">${isToday ? 'Tap to tick off' : 'Past days are read only'}</span></div>
        ${habits.length ? habits.map((h, i) => `<button class="s-20-habit s-20-${h.done[d]?'done':'open'}" data-habit="${i}" ${isToday ? '' : 'disabled'}><span class="s-20-check">${h.done[d] ? '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>' : ''}</span>
          <span class="s-20-grow"><span class="s-20-name">${h.name}</span><div class="s-20-sub">Reminder ${h.when}</div></span><span class="s-20-streak">${h.streak ? h.streak + ' day streak' : 'New'}</span></button>`).join('')
          : '<div class="s-20-card s-20-sub">No habits yet. Add one from the Habits tab.</div>'}
        <div class="s-20-sec"><h2>Water</h2><span class="s-20-sub">250 ml a glass</span></div>
        <div class="s-20-water"><button class="s-20-pm" data-water="-1" aria-label="Remove a glass">-</button><div class="s-20-cups">${Array.from({ length: Math.max(8, water[d]) }, (_, i) => `<span class="s-20-cup s-20-${i<water[d]?'full':'empty'}"></span>`).join('')}</div><button class="s-20-pm" data-water="1" aria-label="Add a glass">+</button></div>`;
    };

    const trends = () => {
      const s = st.metric === 'Water' ? { ...SERIES.Water, v: water } : SERIES[st.metric], max = Math.max(s.goal, ...s.v) * 1.12, W = 340, H = 180, bw = W / 7;
      const avg = s.v.reduce((a, b) => a + b, 0) / 7, gy = H - 22 - (s.goal / max) * (H - 40);
      const bars = s.v.map((v, i) => { const h = (v / max) * (H - 40); return `<rect x="${i * bw + 10}" y="${H - 22 - h}" width="${bw - 20}" height="${h}" rx="7" fill="${v >= s.goal ? '#6d4fd8' : '#cfc5f6'}"><title>${WEEK[i]}: ${fmt(v, s.unit)}</title></rect><text x="${i * bw + bw / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#787b8c">${WEEK[i][0]}</text>`; }).join('');
      const hit = s.v.filter(v => v >= s.goal).length;
      return `<div class="s-20-top"><h1 class="s-20-h1">This week</h1></div>
        <div class="s-20-seg">${Object.keys(SERIES).map(k => `<button class="s-20-sb s-20-${k===st.metric?'on':'off'}" data-metric="${k}">${k}</button>`).join('')}</div>
        <div class="s-20-card"><div class="s-20-sub">Daily average</div><div class="s-20-big">${fmt(st.metric === 'Steps' ? Math.round(avg) : +avg.toFixed(1), s.unit)}</div>
          <svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${st.metric} over seven days">${bars}<line x1="4" x2="${W - 4}" y1="${gy}" y2="${gy}" stroke="#1b1d2a" stroke-dasharray="4 4" opacity=".35"/><text x="${W - 4}" y="${gy - 5}" text-anchor="end" font-size="10" fill="#787b8c">Goal ${s.goal}</text></svg></div>
        <div class="s-20-card"><b>Goal met on ${hit} of 7 days</b><div class="s-20-sub" style="margin-top:4px">${hit >= 5 ? 'A strong week. Keep the same routine.' : 'Try a small step up: set the reminder 30 minutes earlier.'}</div></div>`;
    };

    const manage = () => `<div class="s-20-top"><h1 class="s-20-h1">Habits</h1></div>
      <form class="s-20-card" data-k="add"><b>New habit</b><div class="s-20-sub" style="margin-bottom:10px">Small and specific works best</div>
        <input class="s-20-in" name="name" placeholder="For example, drink water after waking" maxlength="40" required>
        <input class="s-20-in" name="when" type="time" value="08:00"><button class="s-20-btn" type="submit">Add habit</button></form>
      <div class="s-20-card">${habits.map((h, i) => `<div class="s-20-row"><div><div>${h.name}</div><div class="s-20-sub">Daily at ${h.when}</div></div><button class="s-20-del" data-del="${i}">Remove</button></div>`).join('') || '<div class="s-20-sub">No habits yet</div>'}</div>`;

    const me = () => `<div class="s-20-top"><div><h1 class="s-20-h1">Clara Fontaine</h1><div class="s-20-sub">Member since March 2026 · Lyon</div></div></div>
      <div class="s-20-card">${[['remind', 'Habit reminders', 'A gentle nudge at each habit time'], ['weekly', 'Sunday summary', 'Your week in one notification'], ['units', 'Use imperial units', 'Miles and fluid ounces']].map(([k, a, b]) => `<div class="s-20-row"><div><div>${a}</div><div class="s-20-sub">${b}</div></div><button class="s-20-sw s-20-${st[k]?'on':'off'}" data-sw="${k}" aria-pressed="${st[k]}" aria-label="${a}"></button></div>`).join('')}</div>
      <div class="s-20-card s-20-sub">Health data stays on this phone unless you turn on backup. Peach Hill Wellness never sells personal data.</div>`;

    const draw = () => {
      $('[data-k="view"]').innerHTML = { today, trends, habits: manage, me }[st.tab]();
      root.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('s-20-on', b.dataset.tab === st.tab));
    };

    root.addEventListener('click', e => {
      const t = e.target, tab = t.closest('[data-tab]'), day = t.closest('[data-day]'), h = t.closest('[data-habit]'), w = t.closest('[data-water]'), m = t.closest('[data-metric]'), del = t.closest('[data-del]'), sw = t.closest('[data-sw]');
      if (tab) { st.tab = tab.dataset.tab; draw(); $('[data-k="view"]').scrollTop = 0; return; }
      if (day) { st.day = +day.dataset.day; draw(); return; }
      if (h && st.day === 6) { const x = habits[+h.dataset.habit]; x.done[6] = x.done[6] ? 0 : 1; x.streak += x.done[6] ? 1 : -1; draw(); return; }
      if (w) { water[st.day] = Math.max(0, Math.min(14, water[st.day] + +w.dataset.water)); draw(); return; }
      if (m) { st.metric = m.dataset.metric; draw(); return; }
      if (del) { habits.splice(+del.dataset.del, 1); draw(); return; }
      if (sw) { st[sw.dataset.sw] = !st[sw.dataset.sw]; draw(); }
    });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements, name = f.name.value.trim().replace(/</g, '');
      if (!name) return;
      habits.push({ name, when: f.when.value || '08:00', streak: 0, done: [0, 0, 0, 0, 0, 0, 0] });
      st.tab = 'today'; st.day = 6; draw();
    });
    draw();
  }
};
