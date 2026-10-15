/* Interactions only — all content comes from config.js at build time. */
import { catalogue, layers, contact, database, business } from './config.js';

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ---------------- mobile menu ---------------- */
(() => {
  const burger = $('#burger'), drawer = $('#drawer');
  if (!burger || !drawer) return;
  const setOpen = on => {
    burger.setAttribute('aria-expanded', String(on));
    drawer.hidden = !on;
    document.body.style.overflow = on ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setOpen(drawer.hidden));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) setOpen(false); });
  addEventListener('resize', () => { if (innerWidth > 1080) setOpen(false); });
})();

/* ---------------- clock ---------------- */
(() => {
  const el = $('#clk'); if (!el) return;
  const tick = () => el.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  tick(); setInterval(tick, 1000);
})();

/* ---------------- layer stack ---------------- */
/* Still until someone interacts. Hovering a disc (or its pill) pulls it out and shows its
   text; leaving puts it back. A click (or tap) keeps it out; the same disc again, a click
   outside or Esc puts it back. */
(() => {
  const sw = $('#sw'), lp = $('#lp'), ld = $('#ld');
  if (!sw || !lp || !ld) return;
  const intro = ld.innerHTML;
  const md = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  let cur = -1, pinned = -1, hover = -1;
  const show = () => { const i = hover > -1 ? hover : pinned; if (i !== cur) pick(i); };
  const pick = i => {
    cur = i;
    sw.classList.toggle('picked', i > -1);
    [sw, lp].forEach(g => Array.from(g.children).forEach((d, k) => {
      d.classList.toggle('on', k === i); d.setAttribute('aria-pressed', String(k === i));
    }));
    ld.classList.toggle('on', i > -1);
    ld.innerHTML = i < 0 ? intro
      : `<span class="m">0${i+1} / 0${layers.length}</span><b>${esc(layers[i].name)}</b><p>${md(layers[i].text)}</p>`;
  };
  const click = e => { const t = e.target.closest('[data-i]'); if (!t) return;
    const i = +t.dataset.i; pinned = pinned === i ? -1 : i; hover = -1; show(); };
  sw.addEventListener('click', click);
  lp.addEventListener('click', click);
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const over = e => { const t = e.target.closest('[data-i]'); if (t && +t.dataset.i !== hover) { hover = +t.dataset.i; show(); } };
    const out = () => { hover = -1; show(); };
    [sw, lp].forEach(g => { g.addEventListener('mouseover', over); g.addEventListener('mouseleave', out); });
  }
  addEventListener('click', e => { if (pinned > -1 && !e.target.closest('.hart')) { pinned = -1; show(); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && pinned > -1) { pinned = -1; hover = -1; show(); } });
})();

/* ---------------- catalogue ---------------- */
(() => {
  const cs = $('#cs'), cl = $('#cl'), ct = $('#ct'), cd = $('#cd');
  if (!cs || !cl) return;
  let first = true;
  const show = i => {
    const C = catalogue[i];
    Array.from(cs.children).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    ct.textContent = C.name; cd.textContent = C.tagline;
    cl.innerHTML = C.items.map((o, k) => `
      <article class="srow" style="animation-delay:${k*55}ms"><div class="sin">
        <span class="n">${String(k+1).padStart(2,'0')}</span>
        <b>${esc(o.name)}</b>
        <span class="pr">${esc(o.price)}</span>
        <span class="dd">${esc(o.days)}</span>
        <span class="d">${esc(o.desc||'')}</span>
        ${o.get   ? `<span class="got"><b>You get</b>${esc(o.get)}</span>` : ''}
        ${o.offer ? `<span class="ofr"><em></em>Offer · ${esc(o.offer)}</span>` : ''}
      </div></article>`).join('');
    if (!first) cs.children[i]?.scrollIntoView({block:'nearest', inline:'nearest', behavior:'smooth'});
    first = false;
  };
  cs.addEventListener('click', e => { const t = e.target.closest('.cbtn'); if (t) show(+t.dataset.i); });
  cs.addEventListener('keydown', e => {
    const t = e.target.closest('.cbtn'); if (!t) return;
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    e.preventDefault();
    const n = (+t.dataset.i + d + catalogue.length) % catalogue.length;
    cs.children[n].focus(); show(n);
  });
  $('#nx').onclick = () => cs.scrollBy({left: cs.clientWidth * .7, behavior:'smooth'});
  $('#pv').onclick = () => cs.scrollBy({left: -cs.clientWidth * .7, behavior:'smooth'});
  let down = false, sx = 0, sc = 0;
  cs.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sc = cs.scrollLeft; cs.classList.add('drag'); });
  addEventListener('pointerup', () => { down = false; cs.classList.remove('drag'); });
  cs.addEventListener('pointermove', e => { if (down) cs.scrollLeft = sc - (e.clientX - sx); });
})();

/* ---------------- reveal + counters ---------------- */
(() => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-to]').forEach(n => {
        if (n.dataset.done) return; n.dataset.done = '1';
        const to = +n.dataset.to, sf = n.dataset.suf || '';
        let t0 = null;
        const step = t => {
          if (!t0) t0 = t;
          let k = Math.min((t - t0) / 1100, 1); k = 1 - Math.pow(1 - k, 3);
          n.textContent = Math.round(to * k) + sf;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      io.unobserve(e.target);
    });
  }, {threshold: .18});
  $$('.rv, .panel').forEach(n => io.observe(n));
})();

/* ---------------- faq: one answer open at a time ---------------- */
(() => {
  const qs = $$('.fq'); if (!qs.length) return;
  qs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) qs.forEach(o => { if (o !== d) o.open = false; });
  }));
})();

/* ---------------- pipeline dots ---------------- */
(() => {
  const g = $('#dots'); if (!g || reduced) return;
  const dots = ['wi0','wi1','wi2','wi3','wo0','wo1','wo2'].map((id, i) => {
    const p = document.getElementById(id); if (!p) return null;
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('r', '6'); el.setAttribute('class', 'dt'); g.appendChild(el);
    return {p, el, len: p.getTotalLength(), off: i * .13};
  }).filter(Boolean);
  let t0 = null;
  const wrap = g.closest('.pwrap');
  const frame = t => {
    if (!t0) t0 = t;
    if (wrap && !wrap.offsetParent) { requestAnimationFrame(frame); return; }  // phones show the other version
    const s = (t - t0) / 1000;
    dots.forEach(d => {
      const k = ((s * .26) + d.off) % 1;
      const pt = d.p.getPointAtLength(k * d.len);
      d.el.setAttribute('cx', pt.x); d.el.setAttribute('cy', pt.y);
      d.el.setAttribute('opacity', (k < .08 ? k/.08 : k > .92 ? (1-k)/.08 : 1).toFixed(2));
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();

/* ---------------- product modal ---------------- */
(() => {
  const mod = $('#mod'); if (!mod) return;
  let last = null;
  const open = e => { e?.preventDefault(); last = document.activeElement; mod.hidden = false;
    document.body.style.overflow = 'hidden'; mod.querySelector('.modx')?.focus(); };
  const close = () => { mod.hidden = true; document.body.style.overflow = ''; last?.focus(); };
  $$('[data-product]').forEach(a => a.addEventListener('click', open));
  mod.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !mod.hidden) close(); });
})();

/* ---------------- custom select ---------------- */
function makeSelect(host, name, groups, placeholder, searchable) {
  let val = '', open = false, hl = -1, flat = [];
  const hid = Object.assign(document.createElement('input'), {type:'hidden', name});
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'selbtn';
  btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span class="selval empty"></span><span class="selprice"></span><i class="selchev"></i>';
  const pan = document.createElement('div'); pan.className = 'selpan'; pan.hidden = true;
  host.append(hid, btn, pan);
  let srch = null;
  if (searchable) {
    const sw = document.createElement('div'); sw.className = 'selsrch';
    srch = Object.assign(document.createElement('input'), {type:'text', placeholder:'Search services…'});
    srch.setAttribute('aria-label', 'Search services'); sw.append(srch); pan.append(sw);
  }
  const list = document.createElement('div'); list.className = 'sellist'; list.setAttribute('role','listbox'); pan.append(list);
  btn.querySelector('.selval').textContent = placeholder;

  const render = q => {
    list.innerHTML = ''; flat = []; q = (q||'').toLowerCase(); let shown = 0;
    groups.forEach(g => {
      const hits = g.items.filter(o => !q || (g.label + ' ' + o.label).toLowerCase().includes(q));
      if (!hits.length) return;
      if (g.label) { const gl = document.createElement('div'); gl.className='selgrp'; gl.textContent=g.label; list.append(gl); }
      hits.forEach(o => {
        const el = document.createElement('div');
        el.className = 'selopt' + (o.value === val ? ' on' : '');
        el.setAttribute('role','option');
        el.innerHTML = `<b>${esc(o.label)}</b>${o.price?`<em>${esc(o.price)}</em>`:''}${o.days?`<span class="dys">${esc(o.days)}</span>`:''}`;
        el.addEventListener('click', () => choose(o));
        list.append(el); flat.push({el, o}); shown++;
      });
    });
    if (!shown) { const n = document.createElement('div'); n.className='selnone'; n.textContent='Nothing matches that.'; list.append(n); }
    hl = -1;
  };
  const choose = o => {
    val = o.value; hid.value = o.value;
    const v = btn.querySelector('.selval'); v.textContent = o.label; v.classList.remove('empty');
    btn.querySelector('.selprice').textContent = o.price || '';
    shut(); btn.focus();
  };
  const openPan = () => { if (open) return; open = true; pan.hidden = false;
    btn.setAttribute('aria-expanded','true'); render(''); if (srch) { srch.value=''; setTimeout(()=>srch.focus(), 20); } };
  const shut = () => { if (!open) return; open = false; pan.hidden = true; btn.setAttribute('aria-expanded','false'); };
  const move = d => {
    if (!flat.length) return;
    if (hl > -1) flat[hl].el.classList.remove('hl');
    hl = (hl + d + flat.length) % flat.length;
    flat[hl].el.classList.add('hl');
    flat[hl].el.scrollIntoView({block:'nearest'});
  };
  btn.addEventListener('click', () => open ? shut() : openPan());
  srch?.addEventListener('input', () => render(srch.value));
  host.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { e.preventDefault(); shut(); btn.focus(); return; }
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter') && document.activeElement === btn) { e.preventDefault(); openPan(); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (hl > -1) choose(flat[hl].o); }
  });
  addEventListener('click', e => { if (open && !host.contains(e.target)) shut(); });
  return { reset(){ val=''; hid.value='';
    const v = btn.querySelector('.selval'); v.textContent = placeholder; v.classList.add('empty');
    btn.querySelector('.selprice').textContent = ''; } };
}

/* ---------------- contact form ---------------- */
(() => {
  const form = $('#cform'); if (!form) return;
  const svcGroups = [{label:'', items:[{label:'Not sure yet — help me choose', value:'Not sure yet'}]}]
    .concat(catalogue.map(c => ({label:c.name, items:c.items.map(o => ({
      label:o.name, value:`${c.name} / ${o.name} (${o.price})`, price:o.price, days:o.days }))})));
  const budGroups = [{label:'', items: contact.budgets.map(b => ({label:b, value:b}))}];
  const selA = makeSelect($('#selService'), 'service', svcGroups, 'Choose a service', true);
  const selB = makeSelect($('#selBudget'),  'budget',  budGroups, 'Select a range',  false);

  const msg = $('#fmsg'), send = $('#fsend');

  /* arrived from a demo: start the message for them */
  const fromDemo = sessionStorage.getItem('starklab-demo');
  if (fromDemo && form.elements.message && !form.elements.message.value) {
    form.elements.message.value = `I tried the ${fromDemo} demo. I'd like one built for: `;
    sessionStorage.removeItem('starklab-demo');
  }

  async function save(d) {
    if (!database.key) throw new Error('not-configured');
    const res = await fetch(`${database.url}/rest/v1/${database.table}`, {
      method: 'POST',
      headers: {
        apikey: database.key,
        Authorization: `Bearer ${database.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify([{ ...d, source:'website', page: location.href }])
    });
    if (!res.ok) { console.error('Supabase insert failed:', res.status, await res.text()); throw new Error('db'); }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(Array.from(new FormData(form), ([k, v]) => [k, String(v).trim()]));
    let bad = false;
    for (const k of ['name','email']) {
      const el = form.elements[k];
      const ok = k === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d[k] || '') : (d[k] || '').length > 1;
      el.classList.toggle('bad', !ok); if (!ok) bad = true;
    }
    if (bad) { msg.className = 'fmsg err'; msg.textContent = 'Add your name and a valid email.'; return; }

    send.disabled = true; msg.className = 'fmsg'; msg.textContent = 'Sending…';
    try {
      await save(d);
      msg.className = 'fmsg ok';
      msg.textContent = 'Sent. We reply within one working day.';
      form.reset(); selA.reset(); selB.reset();
    } catch {
      const text = encodeURIComponent(
        `New enquiry from the website\n\nName: ${d.name}\nEmail: ${d.email}\n` +
        `Service: ${d.service||'-'}\nBudget: ${d.budget||'-'}\nDetails: ${d.message||'-'}`);
      msg.className = 'fmsg';
      msg.innerHTML = `Opening WhatsApp so nothing gets lost… or <a href="mailto:${business.email}" style="color:var(--ink);text-decoration:underline">email us</a>.`;
      open(`https://wa.me/${business.whatsapp}?text=${text}`, '_blank', 'noopener');
    }
    send.disabled = false;
  });
})();
