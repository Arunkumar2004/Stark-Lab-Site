/* Shared page chrome for sub-pages: mobile drawer, reveal-on-scroll
   and the "came from a demo" hand-off to the contact form. The home page keeps
   its own copy in app.js. */

export function initChrome() {
  const $ = s => document.querySelector(s);

  const burger = $('#burger'), drawer = $('#drawer');
  if (burger && drawer) {
    const setOpen = on => { burger.setAttribute('aria-expanded', String(on)); drawer.hidden = !on; document.body.style.overflow = on ? 'hidden' : ''; };
    burger.addEventListener('click', () => setOpen(drawer.hidden));
    drawer.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) setOpen(false); });
    addEventListener('resize', () => { if (innerWidth > 1080) setOpen(false); });
  }

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
  document.querySelectorAll('.rv').forEach(n => io.observe(n));
}

/* Remember what the visitor was looking at so the home contact form can start the message. */
export function rememberInterest(label) {
  try { sessionStorage.setItem('starklab-demo', label); } catch {}
}

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
