/* Sample 09: Course player and progress. Follows src/samples/_contract.md (prefix s-09-). */

const MODULES = [
  { title: 'Getting your data in shape', lessons: [['Why clean data matters', 312, true], ['Removing duplicates and blanks', 486, true], ['Text, dates and number formats', 540, true]] },
  { title: 'Summaries that answer questions', lessons: [['Pivot tables from scratch', 624, true], ['Grouping by month and region', 455, false], ['Calculated fields', 398, false]] },
  { title: 'Charts people understand', lessons: [['Choosing the right chart', 370, false], ['Annotating the point', 290, false], ['Building a one-page dashboard', 702, false]] },
];
const QUIZ = { q: 'You want monthly sales by region. Which pivot table layout fits best?', opts: ['Region in Values, Month in Filters', 'Month in Rows, Region in Columns, Sales in Values', 'Sales in Rows, Region in Values', 'Everything in Filters'], answer: 1 };
const WEEK = [['Mon', 34], ['Tue', 12], ['Wed', 48], ['Thu', 26], ['Fri', 0], ['Sat', 62], ['Sun', 20]];
const mmss = n => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;

const CSS = `
.s-09-app{display:grid;grid-template-columns:290px 1fr 260px;grid-template-rows:56px 1fr;height:100%;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1C1917;background:#FFFBF5}
.s-09-app *{box-sizing:border-box}
.s-09-top{grid-column:1/-1;display:flex;align-items:center;gap:16px;padding:0 20px;background:#fff;border-bottom:1px solid #EDE7DF}
.s-09-brand{font-weight:800;color:#B45309}
.s-09-course{font-weight:600}
.s-09-topbar{margin-left:auto;display:flex;align-items:center;gap:10px;font-size:13px;color:#57534E}
.s-09-tprog{width:160px;height:6px;border-radius:99px;background:#F5EDE3;overflow:hidden}
.s-09-tfill{height:100%;background:#B45309;transition:width .3s}
.s-09-outline{background:#fff;border-right:1px solid #EDE7DF;overflow:auto;padding:10px 0}
.s-09-mod{padding:10px 18px 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#78716C;cursor:pointer;display:flex;justify-content:space-between}
.s-09-mod:hover{color:#1C1917}
.s-09-les{display:flex;gap:10px;align-items:flex-start;padding:8px 18px;cursor:pointer;font-size:13px;border-left:3px solid transparent}
.s-09-les:hover{background:#FFF7ED}
.s-09-les[data-on]{background:#FFF7ED;border-left-color:#B45309;font-weight:600}
.s-09-check{width:18px;height:18px;flex:none;border-radius:50%;border:2px solid #D6D3D1;display:grid;place-items:center;font-size:10px;color:#fff;margin-top:1px}
.s-09-check[data-done]{background:#B45309;border-color:#B45309}
.s-09-dur{margin-left:auto;color:#A8A29E;font-size:12px}
.s-09-main{overflow:auto;padding:18px 24px}
.s-09-player{background:#1C1917;border-radius:12px;overflow:hidden}
.s-09-stage{display:block;width:100%;height:auto;aspect-ratio:16/8}
.s-09-ctrl{display:flex;align-items:center;gap:12px;padding:10px 14px;color:#E7E5E4;font-size:12px}
.s-09-play{width:34px;height:34px;border-radius:50%;border:0;background:#B45309;color:#fff;cursor:pointer;font:inherit;font-weight:700}
.s-09-play:hover{background:#92400E}
.s-09-scrub{flex:1;height:6px;border-radius:99px;background:#44403C;cursor:pointer;position:relative}
.s-09-sfill{position:absolute;left:0;top:0;bottom:0;background:#F59E0B;border-radius:99px}
.s-09-speed{border:1px solid #57534E;background:none;color:#E7E5E4;border-radius:6px;padding:3px 8px;font:inherit;font-size:12px;cursor:pointer}
.s-09-h1{font-size:20px;margin:16px 0 4px}
.s-09-muted{color:#78716C;font-size:13px}
.s-09-tabs{display:flex;gap:18px;border-bottom:1px solid #EDE7DF;margin:14px 0}
.s-09-tab{border:0;background:none;padding:8px 0;font:inherit;color:#78716C;cursor:pointer;border-bottom:2px solid transparent}
.s-09-tab:hover{color:#1C1917}
.s-09-tab[data-on]{color:#1C1917;border-bottom-color:#B45309;font-weight:600}
.s-09-btn{border:0;background:#B45309;color:#fff;border-radius:8px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer}
.s-09-btn:hover{background:#92400E}
.s-09-btn:disabled{background:#D6D3D1;cursor:default}
.s-09-in{flex:1;border:1px solid #D6D3D1;border-radius:8px;padding:8px 10px;font:inherit}
.s-09-in:focus{outline:2px solid #FDE68A;border-color:#B45309}
.s-09-note{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #F5EDE3;font-size:13px}
.s-09-ts{color:#B45309;font-weight:600;font-variant-numeric:tabular-nums}
.s-09-opt{display:block;width:100%;text-align:left;border:1px solid #E7E5E4;background:#fff;border-radius:8px;padding:9px 12px;margin-bottom:6px;font:inherit;cursor:pointer}
.s-09-opt:hover{border-color:#FCD34D}
.s-09-opt[data-on]{border-color:#B45309;background:#FFF7ED}
.s-09-opt[data-res=right]{border-color:#059669;background:#ECFDF5}
.s-09-opt[data-res=wrong]{border-color:#DC2626;background:#FEF2F2}
.s-09-side{border-left:1px solid #EDE7DF;background:#fff;padding:18px;overflow:auto}
.s-09-h2{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#78716C;margin:0 0 10px}
.s-09-stat{display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #F5EDE3}
`;

export default {
  id: '09-lms-course',
  name: 'Course player and progress',
  category: 'Education',
  sector: 'Online learning',
  blurb: 'A learner view for an online course: lesson outline, a player with notes and quick checks, and weekly study progress.',
  device: 'desktop',
  accent: '#B45309',
  tags: ['e-learning', 'video player', 'progress'],
  render(root) {
    const mods = MODULES.map(m => ({ ...m, open: true, lessons: m.lessons.map(l => ({ title: l[0], len: l[1], done: l[2] })) }));
    const flat = () => mods.flatMap((m, mi) => m.lessons.map((l, li) => ({ ...l, mi, li })));
    const s = { mi: 1, li: 1, pos: 132, playing: false, speed: 1, tab: 'Overview', notes: [[48, 'Group dates by month from the right-click menu.'], [121, 'Region goes in Columns for side-by-side totals.']], pickQ: null, checked: false };
    root.innerHTML = `<style>${CSS}</style>
<div class="s-09-app">
  <header class="s-09-top"><span class="s-09-brand">Learnwell</span><span class="s-09-course">Practical data analysis with spreadsheets</span>
    <div class="s-09-topbar"><span class="s-09-ptext"></span><div class="s-09-tprog"><div class="s-09-tfill"></div></div></div></header>
  <nav class="s-09-outline"></nav>
  <main class="s-09-main">
    <div class="s-09-player"><svg class="s-09-stage" viewBox="0 0 640 320"></svg>
      <div class="s-09-ctrl"><button type="button" class="s-09-play" aria-label="Play">&#9654;</button><span class="s-09-time"></span><div class="s-09-scrub"><div class="s-09-sfill"></div></div><button type="button" class="s-09-speed">1x</button></div></div>
    <h1 class="s-09-h1"></h1><div class="s-09-muted">Sahana Murthy · Learnwell Academy</div>
    <div class="s-09-tabs">${['Overview', 'Notes', 'Quick check'].map(t => `<button type="button" class="s-09-tab" data-tab="${t}">${t}</button>`).join('')}</div>
    <div class="s-09-panel"></div>
  </main>
  <aside class="s-09-side"></aside>
</div>`;
    const $ = q => root.querySelector(q);
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const cur = () => mods[s.mi].lessons[s.li];

    function drawOutline() {
      $('.s-09-outline').innerHTML = mods.map((m, mi) => `<div class="s-09-mod" data-mod="${mi}"><span>${mi + 1}. ${m.title}</span><span>${m.open ? '-' : '+'}</span></div>
        ${m.open ? m.lessons.map((l, li) => `<div class="s-09-les" data-mi="${mi}" data-li="${li}" ${mi === s.mi && li === s.li ? 'data-on' : ''}><span class="s-09-check" ${l.done ? 'data-done' : ''}>${l.done ? '&#10003;' : ''}</span><span>${l.title}</span><span class="s-09-dur">${mmss(l.len)}</span></div>`).join('') : ''}`).join('');
      const f = flat(), done = f.filter(l => l.done).length;
      $('.s-09-ptext').textContent = `${done} of ${f.length} lessons`;
      $('.s-09-tfill').style.width = `${(done / f.length) * 100}%`;
    }
    function drawStage() {
      const l = cur(), seed = s.mi * 3 + s.li, cols = ['Region', 'Jan', 'Feb', 'Mar'];
      const rows = ['North', 'South', 'East', 'West'].map((r, i) => [r, ...[0, 1, 2].map(j => 120 + ((seed + i * 7 + j * 13) % 9) * 35)]);
      const shown = Math.min(4, Math.floor((s.pos / l.len) * 6) + 1);
      $('.s-09-stage').innerHTML = `<rect width="640" height="320" fill="#292524"/><text x="32" y="44" font-size="13" fill="#F59E0B" font-weight="700">MODULE ${s.mi + 1} · LESSON ${s.li + 1}</text>
        <text x="32" y="74" font-size="22" fill="#FAFAF9" font-weight="700">${l.title}</text>
        <g transform="translate(32 100)">${cols.map((c, i) => `<text x="${i * 90 + 8}" y="18" font-size="12" fill="#A8A29E">${c}</text>`).join('')}
        ${rows.slice(0, shown).map((r, ri) => r.map((v, ci) => `<rect x="${ci * 90}" y="${28 + ri * 30}" width="86" height="26" fill="${ci ? '#44403C' : '#3F3A36'}"/><text x="${ci * 90 + 8}" y="${46 + ri * 30}" font-size="12" fill="#E7E5E4">${ci ? `₹${v}k` : v}</text>`).join('')).join('')}</g>
        <g transform="translate(420 110)">${rows.slice(0, shown).map((r, i) => `<rect x="${i * 44}" y="${150 - r[1] / 3}" width="30" height="${r[1] / 3}" rx="3" fill="#F59E0B" opacity="${0.5 + i * 0.15}"/><text x="${i * 44 + 15}" y="168" font-size="10" fill="#A8A29E" text-anchor="middle">${r[0]}</text>`).join('')}</g>
        ${s.playing ? '' : '<circle cx="320" cy="160" r="34" fill="#000" opacity=".45"/><path d="M310 142l30 18-30 18z" fill="#fff"/>'}`;
      $('.s-09-time').textContent = `${mmss(s.pos)} / ${mmss(l.len)}`;
      $('.s-09-sfill').style.width = `${(s.pos / l.len) * 100}%`;
      $('.s-09-play').innerHTML = s.playing ? '&#10073;&#10073;' : '&#9654;';
      $('.s-09-h1').textContent = l.title;
    }
    function drawPanel() {
      const l = cur();
      root.querySelectorAll('.s-09-tab').forEach(b => b.toggleAttribute('data-on', b.dataset.tab === s.tab));
      if (s.tab === 'Overview') {
        $('.s-09-panel').innerHTML = `<p>In this lesson you will build the summary step by step on the sample sales file and learn when each layout answers a different question.</p>
          <p class="s-09-muted">Resources: sales-q3-sample.xlsx, pivot-cheatsheet.pdf</p><button type="button" class="s-09-btn s-09-done" ${l.done ? 'disabled' : ''}>${l.done ? 'Completed' : 'Mark as complete'}</button>`;
      } else if (s.tab === 'Notes') {
        $('.s-09-panel').innerHTML = `<form class="s-09-nform" style="display:flex;gap:8px"><input class="s-09-in" name="note" placeholder="Add a note at ${mmss(s.pos)}" required><button class="s-09-btn">Save note</button></form>
          ${s.notes.length ? s.notes.slice().sort((a, b) => a[0] - b[0]).map(([t, n]) => `<div class="s-09-note"><span class="s-09-ts" data-seek="${t}" style="cursor:pointer">${mmss(t)}</span><span>${esc(n)}</span></div>`).join('') : '<p class="s-09-muted">No notes yet.</p>'}`;
      } else {
        const res = i => (!s.checked ? '' : i === QUIZ.answer ? 'data-res="right"' : i === s.pickQ ? 'data-res="wrong"' : '');
        $('.s-09-panel').innerHTML = `<p><strong>${QUIZ.q}</strong></p>${QUIZ.opts.map((o, i) => `<button type="button" class="s-09-opt" data-opt="${i}" ${s.pickQ === i ? 'data-on' : ''} ${res(i)}>${o}</button>`).join('')}
          <button type="button" class="s-09-btn s-09-checkq" ${s.pickQ === null ? 'disabled' : ''}>Check answer</button> <span class="s-09-muted">${s.checked ? (s.pickQ === QUIZ.answer ? 'Correct. Months as rows read top to bottom like a timeline.' : 'Not quite. Try putting time on the rows.') : ''}</span>`;
      }
    }
    function drawSide() {
      const f = flat(), pct = Math.round((f.filter(l => l.done).length / f.length) * 100), r = 46, c = 2 * Math.PI * r;
      const max = Math.max(...WEEK.map(w => w[1])), total = WEEK.reduce((a, w) => a + w[1], 0);
      $('.s-09-side').innerHTML = `<h2 class="s-09-h2">Your progress</h2><svg viewBox="0 0 120 120" width="130" height="130" style="display:block;margin:0 auto 6px"><circle cx="60" cy="60" r="${r}" fill="none" stroke="#F5EDE3" stroke-width="10"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="#B45309" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(pct / 100) * c} ${c}" transform="rotate(-90 60 60)"/><text x="60" y="64" text-anchor="middle" font-size="20" font-weight="700" fill="#1C1917">${pct}%</text></svg>
        <div class="s-09-stat"><span>Current streak</span><strong>4 days</strong></div><div class="s-09-stat"><span>Quiz average</span><strong>86%</strong></div><div class="s-09-stat"><span>Certificate</span><strong>${pct === 100 ? 'Ready' : 'At 100%'}</strong></div>
        <h2 class="s-09-h2" style="margin-top:18px">This week · ${total} min</h2><svg viewBox="0 0 220 110" width="100%">${WEEK.map(([d, m], i) => `<rect x="${i * 31 + 4}" y="${88 - (m / max) * 74}" width="22" height="${Math.max(2, (m / max) * 74)}" rx="3" fill="#B45309" opacity="${i === 5 ? 1 : 0.4}"><title>${d}: ${m} min</title></rect><text x="${i * 31 + 15}" y="104" font-size="10" text-anchor="middle" fill="#78716C">${d}</text>`).join('')}</svg>`;
    }
    function all() { drawOutline(); drawStage(); drawPanel(); drawSide(); }

    root.addEventListener('click', e => {
      const t = e.target;
      const les = t.closest('.s-09-les'); if (les) { s.mi = +les.dataset.mi; s.li = +les.dataset.li; s.pos = 0; s.playing = false; s.pickQ = null; s.checked = false; all(); return; }
      const mod = t.closest('.s-09-mod'); if (mod) { mods[+mod.dataset.mod].open = !mods[+mod.dataset.mod].open; drawOutline(); return; }
      const tab = t.closest('.s-09-tab'); if (tab) { s.tab = tab.dataset.tab; drawPanel(); return; }
      if (t.closest('.s-09-play') || t.closest('.s-09-stage')) { s.playing = !s.playing; drawStage(); return; }
      if (t.closest('.s-09-speed')) { s.speed = s.speed === 1 ? 1.5 : s.speed === 1.5 ? 2 : 1; t.closest('.s-09-speed').textContent = `${s.speed}x`; return; }
      const scrub = t.closest('.s-09-scrub'); if (scrub) { const b = scrub.getBoundingClientRect(); s.pos = Math.round(((e.clientX - b.left) / b.width) * cur().len); drawStage(); return; }
      const seek = t.closest('[data-seek]'); if (seek) { s.pos = +seek.dataset.seek; drawStage(); return; }
      if (t.closest('.s-09-done')) { cur().done = true; all(); return; }
      const opt = t.closest('[data-opt]'); if (opt) { s.pickQ = +opt.dataset.opt; s.checked = false; drawPanel(); return; }
      if (t.closest('.s-09-checkq')) { s.checked = true; drawPanel(); }
    });
    root.addEventListener('submit', e => { e.preventDefault(); const v = e.target.elements.note.value.trim(); if (v) { s.notes.push([s.pos, v]); drawPanel(); } });
    const timer = setInterval(() => {
      if (!s.playing) return;
      s.pos = Math.min(cur().len, s.pos + 4 * s.speed);
      if (s.pos >= cur().len) { s.playing = false; cur().done = true; drawOutline(); drawSide(); }
      drawStage();
    }, 500);
    all();
    return () => clearInterval(timer);
  },
};
