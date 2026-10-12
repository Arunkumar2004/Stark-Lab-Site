/* Work page: a gallery of self-initiated sample UIs and a viewer to use them.
   Samples come from src/samples (contract: src/samples/_contract.md). The page
   works with any number of them, including none. */
import { SAMPLES, CATEGORIES } from './samples/index.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ---------------- shared chrome (same as app.js) ---------------- */
(() => {
  const burger = $('#burger'), drawer = $('#drawer');
  if (!burger || !drawer) return;
  const setOpen = on => { burger.setAttribute('aria-expanded', String(on)); drawer.hidden = !on; document.body.style.overflow = on ? 'hidden' : ''; };
  burger.addEventListener('click', () => setOpen(drawer.hidden));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) setOpen(false); });
  addEventListener('resize', () => { if (innerWidth > 1080) setOpen(false); });
})();
(() => {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
  document.querySelectorAll('.rv').forEach(n => io.observe(n));
})();

/* ---------------- helpers ---------------- */
const SCREEN = { desktop: { w: 1280, h: 800 }, phone: { w: 390, h: 844 } };
const FRAME = { desktop: { w: 1280, h: 838 }, phone: { w: 414, h: 868 } };   // screen plus browser bar or bezel
const devOf = s => (s.device === 'phone' ? 'phone' : 'desktop');
const devName = d => (d === 'phone' ? 'Phone' : 'Desktop');
const accentOf = s => (/^#[0-9a-f]{3,8}$/i.test(String(s.accent || '')) ? s.accent : 'var(--ac)');
const byId = id => SAMPLES.find(s => s.id === id);

/* Runs a sample's render into root. A broken sample shows a note instead of breaking the page. */
function mount(sample, root) {
  try {
    const off = sample.render(root);
    return typeof off === 'function' ? off : null;
  } catch (err) {
    console.warn(`Sample ${sample.id} failed to render`, err);
    root.innerHTML = '<div class="wfail"><b>This sample could not load.</b><span>Try another one.</span></div>';
    return null;
  }
}
const run = off => { if (off) { try { off(); } catch (err) { console.warn('Sample cleanup failed', err); } } };
const makeRoot = () => { const r = document.createElement('div'); r.className = 'wroot'; return r; };

/* ---------------- filters ---------------- */
const cats = $('#wcats'), devs = $('#wdev'), grid = $('#wgrid'), empty = $('#wempty'), count = $('#wcount');
const state = { cat: 'All', dev: 'all' };
const matchCat = (s, c = state.cat) => c === 'All' || s.category === c;
const matchDev = (s, d = state.dev) => d === 'all' || devOf(s) === d;
const visible = () => SAMPLES.filter(s => matchCat(s) && matchDev(s));

function renderFilters() {
  cats.innerHTML = ['All', ...CATEGORIES].map(c => {
    const n = SAMPLES.filter(s => matchCat(s, c) && matchDev(s)).length;
    return `<button class="cbtn${n ? '' : ' zero'}" role="tab" type="button" data-cat="${esc(c)}" aria-selected="${c === state.cat}">${esc(c)}<i>${String(n).padStart(2, '0')}</i></button>`;
  }).join('');
  devs.innerHTML = [['all', 'All'], ['desktop', 'Desktop'], ['phone', 'Phone']].map(([d, label]) => {
    const n = SAMPLES.filter(s => matchCat(s) && matchDev(s, d)).length;
    return `<button class="wdbtn" role="radio" type="button" data-dev="${d}" aria-checked="${d === state.dev}">${label}<i>${n}</i></button>`;
  }).join('');
}
function applyFilter() {
  const shown = new Set(visible().map(s => s.id));
  grid.querySelectorAll('.wtile').forEach(t => { t.hidden = !shown.has(t.dataset.id); });
  empty.hidden = shown.size > 0;
  $('#wemptytx').textContent = SAMPLES.length ? 'No sample matches this filter. Choose All to see every one.' : 'The samples are being added to this page. Check back shortly.';
  count.textContent = SAMPLES.length ? `Showing ${shown.size} of ${SAMPLES.length} self-initiated samples` : '';
  renderFilters();
}
cats.addEventListener('click', e => { const b = e.target.closest('.cbtn'); if (!b) return; state.cat = b.dataset.cat; applyFilter(); });
devs.addEventListener('click', e => { const b = e.target.closest('.wdbtn'); if (!b) return; state.dev = b.dataset.dev; applyFilter(); });

/* ---------------- gallery ---------------- */
grid.innerHTML = SAMPLES.map(s => {
  const d = devOf(s);
  return `<article class="wtile" tabindex="0" role="button" data-id="${esc(s.id)}" style="--acc:${esc(accentOf(s))}" aria-label="Open the ${esc(s.name)} sample">
    <div class="wmini ${d}"><div class="wscr" inert aria-hidden="true" style="width:${SCREEN[d].w}px;height:${SCREEN[d].h}px"></div><span class="wload m">Loading</span></div>
    <div class="wbody"><div class="wtop"><span class="m">${esc(s.category)} · ${esc(s.sector)}</span><span class="wdevb">${devName(d)}</span></div>
      <b>${esc(s.name)}</b><p>${esc(s.blurb)}</p></div>
  </article>`;
}).join('');

/* Miniature scale: every tile has the same width, so one measurement serves all. */
const sizeMinis = () => {
  const mini = grid.querySelector('.wtile:not([hidden]) .wmini'); if (!mini) return;
  const w = mini.clientWidth, h = mini.clientHeight;
  grid.style.setProperty('--kd', String(Math.min(w / 1280, h / 800)));
  grid.style.setProperty('--kp', String((h * 0.88) / 844));
};
new ResizeObserver(sizeMinis).observe(grid);

/* Render miniatures only near the viewport, at most two per frame. */
const queue = [], miniOff = [];
let pumping = false;
const pump = () => {
  for (let i = 0; i < 2 && queue.length; i++) {
    const tile = queue.shift(), s = byId(tile.dataset.id), scr = tile.querySelector('.wscr');
    const root = makeRoot(); scr.appendChild(root);
    miniOff.push(mount(s, root));
    tile.classList.add('ready');
  }
  if (queue.length) requestAnimationFrame(pump); else pumping = false;
};
const near = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  near.unobserve(e.target); queue.push(e.target);
  if (!pumping) { pumping = true; requestAnimationFrame(pump); }
}), { rootMargin: '400px 0px' });
grid.querySelectorAll('.wtile').forEach(t => near.observe(t));
addEventListener('pagehide', () => { miniOff.forEach(run); miniOff.length = 0; });

grid.addEventListener('click', e => { const t = e.target.closest('.wtile'); if (t) open(t.dataset.id); });
grid.addEventListener('keydown', e => {
  const t = e.target.closest('.wtile');
  if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(t.dataset.id); }
});

/* ---------------- viewer ---------------- */
const viewer = $('#viewer'), view = $('#vview'), stage = $('#vstage'), box = $('#vbox'), frame = $('#vframe');
const fullBtn = $('#vfull');
const shell = [$('main'), $('nav'), $('footer')];
let cur = null, curOff = null, lastFocus = null;

const canFull = !!(stage.requestFullscreen || stage.webkitRequestFullscreen);
if (!canFull) fullBtn.hidden = true;
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;

function fit() {
  if (!cur) return;
  const d = devOf(cur), { w: fw, h: fh } = FRAME[d];
  const cs = getComputedStyle(stage);
  const W = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const tall = fsEl() === stage || innerWidth > 720;
  const H = tall ? stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) : Infinity;
  const k = Math.max(0.1, Math.min(1, W / fw, H / fh));
  frame.style.width = `${fw}px`; frame.style.height = `${fh}px`;
  frame.style.transform = `scale(${k})`;
  box.style.width = `${Math.floor(fw * k)}px`; box.style.height = `${Math.floor(fh * k)}px`;
}

function show(s) {
  run(curOff); curOff = null;
  cur = s;
  const d = devOf(s);
  frame.className = `vframe ${d}`;
  frame.innerHTML = d === 'phone'
    ? '<div class="vnotch"></div><div class="vscreen"></div>'
    : `<div class="vbar"><i></i><i></i><i></i><span class="vurl">${esc(s.name)}</span></div><div class="vscreen"></div>`;
  const screen = frame.querySelector('.vscreen');
  screen.style.width = `${SCREEN[d].w}px`; screen.style.height = `${SCREEN[d].h}px`;
  const root = makeRoot(); screen.appendChild(root);
  viewer.style.setProperty('--acc', accentOf(s));
  $('#vcat').textContent = s.category || '';
  $('#vsector').textContent = s.sector || '';
  $('#vdevice').textContent = devName(d);
  $('#vname').textContent = s.name;
  $('#vblurb').textContent = s.blurb || '';
  $('#vtags').innerHTML = (s.tags || []).map(t => `<span>${esc(t)}</span>`).join('');
  const list = order(), i = list.indexOf(s);
  $('#vpos').textContent = `${i + 1} of ${list.length}`;
  fit();
  curOff = mount(s, root);
  history.replaceState(null, '', `#${s.id}`);
  requestAnimationFrame(fit);
}

/* Prev/next walk the filtered list; a deep link outside the filter walks every sample. */
const order = () => { const v = visible(); return cur && v.includes(cur) ? v : SAMPLES; };
function step(dir) {
  if (!cur) return;
  const list = order(), i = list.indexOf(cur);
  show(list[(i + dir + list.length) % list.length]);
}

function open(id) {
  const s = byId(id); if (!s) return;
  if (viewer.hidden) {
    lastFocus = document.activeElement;
    viewer.hidden = false;
    shell.forEach(n => n && (n.inert = true));
    document.body.style.overflow = 'hidden';
  }
  show(s);
  $('#vclose').focus({ preventScroll: true });
}

function close() {
  if (viewer.hidden) return;
  if (fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  run(curOff); curOff = null; cur = null;
  frame.innerHTML = '';
  viewer.hidden = true;
  shell.forEach(n => n && (n.inert = false));
  document.body.style.overflow = '';
  history.replaceState(null, '', location.pathname + location.search);
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

$('#vprev').addEventListener('click', () => step(-1));
$('#vnext').addEventListener('click', () => step(1));
$('#vclose').addEventListener('click', close);
viewer.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) close(); });
fullBtn.addEventListener('click', () => {
  if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  const req = stage.requestFullscreen || stage.webkitRequestFullscreen;
  try { const p = req.call(stage); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here */ }
});
const onFull = () => { fullBtn.textContent = fsEl() === stage ? 'Exit full screen' : 'Open full screen'; requestAnimationFrame(fit); };
document.addEventListener('fullscreenchange', onFull);
document.addEventListener('webkitfullscreenchange', onFull);
$('#vbuild').addEventListener('click', () => { try { if (cur) sessionStorage.setItem('starklab-demo', cur.name); } catch { /* storage blocked */ } });

addEventListener('keydown', e => {
  if (viewer.hidden || e.defaultPrevented) return;
  if (e.key === 'Escape') { close(); return; }
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const t = e.target;
  if (t instanceof Element && (t.closest('.vscreen') || t.matches('input,textarea,select,[contenteditable]'))) return;
  e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1);
});
addEventListener('resize', () => { fit(); sizeMinis(); });
new ResizeObserver(() => fit()).observe(view);

/* ---------------- boot ---------------- */
applyFilter();
sizeMinis();
const fromHash = () => decodeURIComponent(location.hash.slice(1));
if (byId(fromHash())) open(fromHash());
addEventListener('hashchange', () => { const id = fromHash(); if (byId(id)) open(id); else close(); });
