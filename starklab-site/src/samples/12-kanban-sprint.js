/* 12 Sprint board: product team board with drag and drop, assignee filter, burndown and quick add. */

const CSS = `
.s-12-app{display:flex;flex-direction:column;height:100%;font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d2433;background:#f5f6f8}
.s-12-top{display:flex;align-items:center;gap:16px;padding:12px 22px;background:#fff;border-bottom:1px solid #e3e6eb}
.s-12-logo{width:28px;height:28px;border-radius:8px;background:#0e8a6d;color:#fff;display:grid;place-items:center;font-weight:700;font-size:12px}
.s-12-h{margin:0;font-size:17px;font-weight:650}
.s-12-sub{color:#7a8291;font-size:12px}
.s-12-avs{display:flex;gap:4px;margin-left:auto;align-items:center}
.s-12-av{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:700;color:#fff;border:2px solid #fff;cursor:pointer;opacity:.95}
.s-12-av:hover{transform:translateY(-1px)}
.s-12-av.s-12-dim{opacity:.3}
.s-12-av.s-12-sm{width:22px;height:22px;font-size:9px;border:0;cursor:default}
.s-12-clear{border:0;background:none;color:#0e8a6d;font:inherit;cursor:pointer;margin-left:6px}
.s-12-wrap{flex:1;display:grid;grid-template-columns:1fr 280px;min-height:0}
.s-12-board{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:16px 18px;overflow:auto}
.s-12-col{background:#eceef2;border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px;min-height:0}
.s-12-col.s-12-over{background:#dcf1ea;outline:2px dashed #0e8a6d}
.s-12-colh{display:flex;justify-content:space-between;font-weight:600;font-size:12px;color:#4b5363;padding:2px 4px}
.s-12-card{background:#fff;border-radius:8px;padding:10px;border:1px solid #e3e6eb;cursor:grab;box-shadow:0 1px 1px rgba(16,24,40,.04)}
.s-12-card:hover{border-color:#0e8a6d;box-shadow:0 3px 8px rgba(16,24,40,.08)}
.s-12-card.s-12-sel{border-color:#0e8a6d;box-shadow:0 0 0 2px #bfe6da}
.s-12-key{color:#7a8291;font-size:11px}
.s-12-meta{display:flex;align-items:center;gap:6px;margin-top:8px}
.s-12-tag{font-size:10px;font-weight:600;padding:2px 7px;border-radius:999px;background:#f0f1f4;color:#4b5363}
.s-12-tag.s-12-bug{background:#fde8e8;color:#b42318}
.s-12-tag.s-12-feature{background:#e3f4ee;color:#0b6b55}
.s-12-pts{margin-left:auto;font-size:11px;background:#f0f1f4;border-radius:5px;padding:1px 6px;font-weight:600}
.s-12-side{background:#fff;border-left:1px solid #e3e6eb;padding:16px;display:flex;flex-direction:column;gap:14px;overflow:auto}
.s-12-box h3{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#7a8291}
.s-12-in{width:100%;box-sizing:border-box;border:1px solid #d5d9e0;border-radius:7px;padding:7px 9px;font:inherit;margin-bottom:6px;background:#fff}
.s-12-row{display:flex;gap:6px}
.s-12-btn{border:0;background:#0e8a6d;color:#fff;border-radius:7px;padding:7px 12px;font:inherit;font-weight:600;cursor:pointer}
.s-12-btn:hover{background:#0b6f58}
.s-12-empty{color:#9aa1ad;font-size:12px;text-align:center;padding:14px 4px;border:1px dashed #cdd2da;border-radius:8px}
.s-12-legend{display:flex;gap:12px;font-size:11px;color:#7a8291}
.s-12-sw{display:inline-block;width:10px;height:3px;vertical-align:middle;margin-right:4px}
`;

const PEOPLE = {
  AR: { name: 'Aditi Rao', c: '#0e8a6d' },
  JK: { name: 'Jonas Keller', c: '#3a6fd8' },
  SM: { name: 'Sneha Mukherjee', c: '#c2410c' },
  LO: { name: 'Lena Okafor', c: '#7c3aed' }
};
const COLS = ['To do', 'In progress', 'Review', 'Done'];
const SEED = [
  ['PAY-412', 'UPI autopay mandate retries', 'feature', 'AR', 5, 'In progress'],
  ['PAY-418', 'Refund webhook sends duplicate events', 'bug', 'JK', 3, 'Review'],
  ['PAY-421', 'Settlement report CSV export', 'feature', 'SM', 3, 'To do'],
  ['PAY-423', 'Rate limit merchant API keys', 'chore', 'LO', 2, 'To do'],
  ['PAY-405', 'Dark mode tokens for checkout', 'feature', 'SM', 2, 'Done'],
  ['PAY-409', 'Currency rounding on partial refunds', 'bug', 'AR', 3, 'Done'],
  ['PAY-415', 'Dispute evidence upload flow', 'feature', 'LO', 8, 'In progress'],
  ['PAY-426', 'Flaky test in ledger reconciliation', 'bug', 'JK', 1, 'To do'],
  ['PAY-402', 'Merchant onboarding KYC copy', 'chore', 'SM', 1, 'Done']
];
const DAYS = 10;

export default {
  id: '12-kanban-sprint',
  name: 'Sprint board',
  category: 'SaaS',
  sector: 'Fintech',
  blurb: 'A payments squad plans and tracks a two-week sprint, moving tickets across the board while the burndown updates.',
  device: 'desktop',
  accent: '#0E8A6D',
  tags: ['kanban', 'drag and drop', 'burndown'],
  render(root) {
    const cards = SEED.map(([key, title, type, who, pts, col]) => ({ key, title, type, who, pts, col }));
    const st = { who: null, sel: 'PAY-415', next: 427, today: 6 };
    const burnHistory = [28, 28, 26, 23, 23, 21];

    root.innerHTML = `<style>${CSS}</style>
      <div class="s-12-app">
        <header class="s-12-top">
          <span class="s-12-logo">QB</span>
          <div><h1 class="s-12-h">Payments squad · Sprint 34</h1><div class="s-12-sub">29 Sep to 10 Oct · Goal: ship autopay retries and dispute evidence</div></div>
          <div class="s-12-avs">${Object.entries(PEOPLE).map(([k, p]) => `<span class="s-12-av" data-who="${k}" title="${p.name}" style="background:${p.c}">${k}</span>`).join('')}
            <button class="s-12-clear" data-k="clear">Show all</button></div>
        </header>
        <div class="s-12-wrap">
          <div class="s-12-board" data-k="board"></div>
          <aside class="s-12-side">
            <div class="s-12-box"><h3>Burndown</h3><div data-k="chart"></div>
              <div class="s-12-legend"><span><i class="s-12-sw" style="background:#0e8a6d"></i>Remaining</span><span><i class="s-12-sw" style="background:#c5cad3"></i>Ideal</span></div></div>
            <div class="s-12-box"><h3>Selected ticket</h3><div data-k="detail"></div></div>
            <form class="s-12-box" data-k="form"><h3>Quick add</h3>
              <input class="s-12-in" name="title" placeholder="Ticket title" required maxlength="60">
              <div class="s-12-row"><select class="s-12-in" name="who">${Object.entries(PEOPLE).map(([k, p]) => `<option value="${k}">${p.name}</option>`).join('')}</select>
              <select class="s-12-in" name="pts" style="width:70px">${[1, 2, 3, 5, 8].map(n => `<option>${n}</option>`).join('')}</select></div>
              <button class="s-12-btn" type="submit">Add to To do</button></form>
          </aside>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);
    const remaining = () => cards.filter(c => c.col !== 'Done').reduce((a, c) => a + c.pts, 0);
    const total = () => cards.reduce((a, c) => a + c.pts, 0);

    const drawChart = () => {
      const pts = [...burnHistory.slice(0, st.today - 1), remaining()];
      const W = 248, H = 120, top = Math.max(total(), ...pts), x = i => 8 + (i / (DAYS - 1)) * (W - 16), y = v => 8 + (1 - v / top) * (H - 24);
      const line = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
      $('[data-k="chart"]').innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Sprint burndown">
        <line x1="${x(0)}" y1="${y(top)}" x2="${x(DAYS - 1)}" y2="${y(0)}" stroke="#c5cad3" stroke-dasharray="4 4"/>
        <line x1="8" y1="${H - 16}" x2="${W - 8}" y2="${H - 16}" stroke="#e3e6eb"/>
        <path d="${line}" fill="none" stroke="#0e8a6d" stroke-width="2.2" stroke-linejoin="round"/>
        ${pts.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${i === pts.length - 1 ? 4 : 2.5}" fill="#0e8a6d"><title>Day ${i + 1}: ${v} points left</title></circle>`).join('')}
        <text x="8" y="${H - 3}" font-size="9" fill="#7a8291">Day 1</text><text x="${W - 8}" y="${H - 3}" font-size="9" fill="#7a8291" text-anchor="end">Day ${DAYS}</text>
        <text x="${x(pts.length - 1) + 7}" y="${y(remaining()) - 6}" font-size="10" font-weight="600" fill="#1d2433">${remaining()} pts</text></svg>`;
    };

    const drawDetail = () => {
      const c = cards.find(k => k.key === st.sel);
      $('[data-k="detail"]').innerHTML = c ? `<div class="s-12-key">${c.key} · ${c.type}</div><div style="font-weight:600;margin:2px 0 8px">${c.title}</div>
        <div class="s-12-sub" style="margin-bottom:6px">Assignee: ${PEOPLE[c.who].name} · ${c.pts} points</div>
        <select class="s-12-in" data-k="move">${COLS.map(k => `<option ${k === c.col ? 'selected' : ''}>${k}</option>`).join('')}</select>`
        : '<div class="s-12-empty">Click a ticket to see it here</div>';
    };

    const drawBoard = () => {
      $('[data-k="board"]').innerHTML = COLS.map(col => {
        const list = cards.filter(c => c.col === col && (!st.who || c.who === st.who));
        const pts = list.reduce((a, c) => a + c.pts, 0);
        return `<section class="s-12-col" data-col="${col}"><div class="s-12-colh"><span>${col} · ${list.length}</span><span>${pts} pts</span></div>
          ${list.map(c => `<article class="s-12-card s-12-${c.key===st.sel?'sel':'n'}" draggable="true" data-key="${c.key}">
            <div class="s-12-key">${c.key}</div><div>${c.title}</div>
            <div class="s-12-meta"><span class="s-12-tag s-12-${c.type}">${c.type}</span><span class="s-12-av s-12-sm" style="background:${PEOPLE[c.who].c}">${c.who}</span><span class="s-12-pts">${c.pts}</span></div></article>`).join('')}
          ${list.length ? '' : '<div class="s-12-empty">Drop a ticket here</div>'}</section>`;
      }).join('');
      root.querySelectorAll('[data-who]').forEach(a => a.classList.toggle('s-12-dim', !!st.who && a.dataset.who !== st.who));
    };
    const draw = () => { drawBoard(); drawDetail(); drawChart(); };

    root.addEventListener('click', e => {
      const a = e.target.closest('[data-who]');
      if (a) { st.who = st.who === a.dataset.who ? null : a.dataset.who; drawBoard(); return; }
      if (e.target.closest('[data-k="clear"]')) { st.who = null; drawBoard(); return; }
      const c = e.target.closest('[data-key]');
      if (c) { st.sel = c.dataset.key; drawBoard(); drawDetail(); }
    });
    root.addEventListener('change', e => {
      if (e.target.dataset.k !== 'move') return;
      cards.find(k => k.key === st.sel).col = e.target.value; draw();
    });
    root.addEventListener('dragstart', e => {
      const c = e.target.closest('[data-key]');
      if (c) { e.dataTransfer.setData('text/plain', c.dataset.key); e.dataTransfer.effectAllowed = 'move'; }
    });
    root.addEventListener('dragover', e => {
      const col = e.target.closest('[data-col]');
      if (!col) return;
      e.preventDefault();
      root.querySelectorAll('.s-12-over').forEach(n => n !== col && n.classList.remove('s-12-over'));
      col.classList.add('s-12-over');
    });
    root.addEventListener('dragleave', e => { if (e.target.matches && e.target.matches('[data-col]')) e.target.classList.remove('s-12-over'); });
    root.addEventListener('drop', e => {
      const col = e.target.closest('[data-col]');
      if (!col) return;
      e.preventDefault();
      const c = cards.find(k => k.key === e.dataTransfer.getData('text/plain'));
      if (c) { c.col = col.dataset.col; st.sel = c.key; }
      draw();
    });
    $('[data-k="form"]').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements, title = f.title.value.trim();
      if (!title) return;
      const card = { key: 'PAY-' + st.next++, title, type: 'feature', who: f.who.value, pts: +f.pts.value, col: 'To do' };
      cards.push(card); st.sel = card.key; f.title.value = ''; draw();
    });
    draw();
  }
};
