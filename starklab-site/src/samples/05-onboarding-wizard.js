/* Sample 05: Product onboarding wizard. Follows src/samples/_contract.md (prefix s-05-). */

const STEPS = ['Your workspace', 'Look and feel', 'Invite your team', 'Connect tools', 'Review and launch'];
const SWATCHES = ['#15803D', '#2563EB', '#9333EA', '#DB2777', '#EA580C', '#0F766E'];
const TOOLS = [
  ['slack', 'Team chat', 'Post task updates to a channel'], ['gcal', 'Calendar', 'Show due dates on your calendar'],
  ['drive', 'File storage', 'Attach files from shared drives'], ['git', 'Code hosting', 'Link pull requests to tasks'],
  ['mail', 'Email', 'Turn forwarded emails into tasks'],
];

const CSS = `
.s-05-app{display:grid;grid-template-columns:260px 1fr 340px;height:100%;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111827;background:#fff}
.s-05-app *{box-sizing:border-box}
.s-05-rail{background:#F9FAFB;border-right:1px solid #E5E7EB;padding:24px 20px;display:flex;flex-direction:column}
.s-05-brand{font-weight:800;font-size:16px;margin-bottom:26px;display:flex;gap:8px;align-items:center}
.s-05-logo{width:24px;height:24px;border-radius:7px;background:#15803D}
.s-05-step{display:flex;gap:12px;align-items:flex-start;padding:8px 6px;border-radius:8px;cursor:pointer;color:#6B7280}
.s-05-step:hover{background:#F3F4F6}
.s-05-step[data-state=todo]{cursor:default}
.s-05-step[data-state=todo]:hover{background:none}
.s-05-step[data-state=now]{color:#111827;font-weight:600}
.s-05-step[data-state=done]{color:#374151}
.s-05-num{width:24px;height:24px;flex:none;border-radius:50%;border:2px solid #D1D5DB;display:grid;place-items:center;font-size:12px;font-weight:700;background:#fff}
.s-05-step[data-state=now] .s-05-num{border-color:#15803D;color:#15803D}
.s-05-step[data-state=done] .s-05-num{border-color:#15803D;background:#15803D;color:#fff}
.s-05-help{margin-top:auto;font-size:12px;color:#6B7280;border-top:1px solid #E5E7EB;padding-top:14px}
.s-05-main{padding:34px 44px;overflow:auto;display:flex;flex-direction:column}
.s-05-prog{height:6px;background:#F3F4F6;border-radius:99px;overflow:hidden;margin-bottom:26px}
.s-05-progfill{height:100%;background:#15803D;transition:width .25s}
.s-05-eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#15803D;font-weight:700}
.s-05-h1{font-size:24px;margin:4px 0 6px}
.s-05-lead{color:#6B7280;margin:0 0 22px}
.s-05-field{margin-bottom:16px;max-width:440px}
.s-05-label{display:block;font-size:13px;font-weight:600;margin-bottom:5px}
.s-05-in{width:100%;border:1px solid #D1D5DB;border-radius:8px;padding:9px 11px;font:inherit}
.s-05-in:focus{outline:3px solid #BBF7D0;border-color:#15803D}
.s-05-opts{display:flex;gap:8px;flex-wrap:wrap}
.s-05-opt{border:1px solid #D1D5DB;border-radius:8px;padding:7px 14px;cursor:pointer;background:#fff;font:inherit;font-size:13px}
.s-05-opt:hover{border-color:#86EFAC}
.s-05-opt[data-on]{border-color:#15803D;background:#F0FDF4;color:#166534;font-weight:600}
.s-05-sw{width:34px;height:34px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 1px #D1D5DB;cursor:pointer}
.s-05-sw[data-on]{box-shadow:0 0 0 2px #111827}
.s-05-row{display:flex;gap:8px;max-width:520px}
.s-05-list{list-style:none;padding:0;margin:14px 0 0;max-width:520px}
.s-05-list li{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;font-size:13px}
.s-05-x{border:0;background:none;color:#9CA3AF;cursor:pointer;font:inherit}
.s-05-x:hover{color:#B91C1C}
.s-05-tool{display:flex;align-items:center;gap:12px;padding:11px 12px;border:1px solid #E5E7EB;border-radius:10px;margin-bottom:8px;max-width:520px}
.s-05-tool:hover{border-color:#BBF7D0}
.s-05-sw2{margin-left:auto;width:38px;height:22px;border-radius:99px;background:#D1D5DB;position:relative;cursor:pointer;border:0;transition:background .15s}
.s-05-sw2::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s}
.s-05-sw2[data-on]{background:#15803D}
.s-05-sw2[data-on]::after{left:19px}
.s-05-muted{color:#6B7280;font-size:13px}
.s-05-err{color:#B91C1C;font-size:12px;min-height:18px}
.s-05-nav{margin-top:auto;padding-top:20px;display:flex;justify-content:space-between;max-width:520px}
.s-05-btn{border:1px solid #D1D5DB;background:#fff;border-radius:8px;padding:9px 18px;font:inherit;font-weight:600;cursor:pointer}
.s-05-btn:hover{background:#F9FAFB}
.s-05-primary{background:#15803D;border-color:#15803D;color:#fff}
.s-05-primary:hover{background:#166534}
.s-05-preview{background:#F9FAFB;border-left:1px solid #E5E7EB;padding:24px 22px}
.s-05-review{display:grid;grid-template-columns:140px 1fr;gap:8px 12px;max-width:520px;font-size:14px}
.s-05-done{padding:16px;border-radius:10px;background:#F0FDF4;border:1px solid #BBF7D0;color:#166534;max-width:520px}
`;

export default {
  id: '05-onboarding-wizard',
  name: 'Product onboarding wizard',
  category: 'SaaS',
  sector: 'Productivity',
  blurb: 'A five-step setup flow that takes a new customer from sign-up to a configured workspace, with a live preview.',
  device: 'desktop',
  accent: '#15803D',
  tags: ['onboarding', 'forms', 'live preview'],
  render(root) {
    const s = { step: 0, name: 'Kaveri Interiors', industry: 'Design studio', size: '11-50', color: '#15803D', invites: [['meera@kaveri.example', 'Admin'], ['jon@kaveri.example', 'Member']], tools: new Set(['slack', 'gcal']), launched: false, error: '' };
    root.innerHTML = `<style>${CSS}</style>
<div class="s-05-app">
  <aside class="s-05-rail"><div class="s-05-brand"><span class="s-05-logo"></span>Tasklane</div><div class="s-05-steps"></div>
    <div class="s-05-help">Need a hand? Our onboarding team replies within an hour, Monday to Saturday.</div></aside>
  <main class="s-05-main"></main>
  <aside class="s-05-preview"><div class="s-05-eyebrow">Live preview</div><p class="s-05-muted" style="margin:4px 0 14px">This is how your workspace will look.</p><svg class="s-05-svg" viewBox="0 0 300 240" width="100%"></svg><div class="s-05-pinfo s-05-muted" style="margin-top:12px"></div></aside>
</div>`;
    const $ = q => root.querySelector(q);
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const initials = () => (s.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'W');

    function body() {
      if (s.launched) return `<div class="s-05-done"><strong>${esc(s.name)} is ready.</strong><br>We have sent ${s.invites.length} invitation${s.invites.length === 1 ? '' : 's'} and connected ${s.tools.size} tool${s.tools.size === 1 ? '' : 's'}. Your first board, "Getting started", is waiting.</div>`;
      switch (s.step) {
        case 0: return `<div class="s-05-field"><label class="s-05-label">Workspace name</label><input class="s-05-in" data-f="name" value="${esc(s.name)}"></div>
          <div class="s-05-field"><label class="s-05-label">Industry</label><select class="s-05-in" data-f="industry">${['Design studio', 'Manufacturing', 'Retail', 'Healthcare', 'Software', 'Education'].map(o => `<option ${o === s.industry ? 'selected' : ''}>${o}</option>`).join('')}</select></div>
          <div class="s-05-field"><span class="s-05-label">Team size</span><div class="s-05-opts">${['1-10', '11-50', '51-200', '200+'].map(o => `<button type="button" class="s-05-opt" data-size="${o}" ${o === s.size ? 'data-on' : ''}>${o}</button>`).join('')}</div></div>`;
        case 1: return `<div class="s-05-field"><span class="s-05-label">Accent colour</span><div class="s-05-opts">${SWATCHES.map(c => `<span class="s-05-sw" data-color="${c}" style="background:${c}" ${c === s.color ? 'data-on' : ''}></span>`).join('')}</div></div>
          <p class="s-05-muted">Used for buttons, highlights and your workspace icon. You can change it later in Settings.</p>`;
        case 2: return `<form class="s-05-row s-05-invite"><input class="s-05-in" name="email" type="email" placeholder="colleague@company.example" required><select class="s-05-in" name="role" style="width:130px"><option>Member</option><option>Admin</option><option>Guest</option></select><button class="s-05-btn s-05-primary">Add</button></form>
          <ul class="s-05-list">${s.invites.map(([e, r], i) => `<li><span>${esc(e)}</span><span><span class="s-05-muted">${r}</span> <button type="button" class="s-05-x" data-del="${i}">Remove</button></span></li>`).join('') || '<li class="s-05-muted">No one invited yet. You can also skip this step.</li>'}</ul>`;
        case 3: return TOOLS.map(([k, n, d]) => `<div class="s-05-tool"><svg width="30" height="30" viewBox="0 0 30 30"><rect width="30" height="30" rx="7" fill="${s.color}" opacity=".14"/><text x="15" y="19" text-anchor="middle" font-size="11" font-weight="700" fill="${s.color}">${n.slice(0, 2).toUpperCase()}</text></svg><div><strong>${n}</strong><div class="s-05-muted">${d}</div></div><button type="button" class="s-05-sw2" data-tool="${k}" ${s.tools.has(k) ? 'data-on' : ''} aria-label="Toggle ${n}"></button></div>`).join('');
        default: return `<div class="s-05-review"><span class="s-05-muted">Workspace</span><strong>${esc(s.name)}</strong><span class="s-05-muted">Industry</span><span>${s.industry}, ${s.size} people</span>
          <span class="s-05-muted">Accent</span><span><span class="s-05-sw" style="background:${s.color};display:inline-block;width:16px;height:16px;vertical-align:-3px"></span> ${s.color}</span>
          <span class="s-05-muted">Invitations</span><span>${s.invites.length}</span><span class="s-05-muted">Connected tools</span><span>${[...s.tools].map(k => TOOLS.find(t => t[0] === k)[1]).join(', ') || 'None'}</span></div>`;
      }
    }
    function draw() {
      $('.s-05-steps').innerHTML = STEPS.map((t, i) => `<div class="s-05-step" data-go="${i}" data-state="${s.launched || i < s.step ? 'done' : i === s.step ? 'now' : 'todo'}"><span class="s-05-num">${s.launched || i < s.step ? '&#10003;' : i + 1}</span><span>${t}</span></div>`).join('');
      const pct = s.launched ? 100 : (s.step / STEPS.length) * 100;
      $('.s-05-main').innerHTML = `<div class="s-05-prog"><div class="s-05-progfill" style="width:${pct}%"></div></div>
        <div class="s-05-eyebrow">Step ${Math.min(s.step + 1, 5)} of 5</div><h1 class="s-05-h1">${s.launched ? 'You are all set' : STEPS[s.step]}</h1>
        <p class="s-05-lead">${['Tell us a little about your organisation.', 'Make the workspace feel like yours.', 'Projects go better together. Invite people now or later.', 'Bring in the tools you already use.', 'Check everything before we create your workspace.'][s.step]}</p>
        ${body()}<div class="s-05-err">${s.error}</div>
        ${s.launched ? '' : `<div class="s-05-nav"><button type="button" class="s-05-btn s-05-back" ${s.step ? '' : 'style="visibility:hidden"'}>Back</button><button type="button" class="s-05-btn s-05-primary s-05-next">${s.step === 4 ? 'Launch workspace' : 'Continue'}</button></div>`}`;
      preview();
    }
    function preview() {
      const c = s.color, cards = [3, 2, 1].map((n, col) => Array.from({ length: n }, (_, i) => `<rect x="${92 + col * 68}" y="${70 + i * 34}" width="60" height="28" rx="4" fill="#fff" stroke="#E5E7EB"/><rect x="${98 + col * 68}" y="${77 + i * 34}" width="${30 + ((i + col) % 3) * 8}" height="4" rx="2" fill="${col === 2 ? c : '#D1D5DB'}"/>`).join('')).join('');
      const avatars = s.invites.slice(0, 5).map((_, i) => `<circle cx="${250 - i * 14}" cy="30" r="8" fill="${c}" opacity="${1 - i * 0.15}" stroke="#fff" stroke-width="2"/>`).join('');
      $('.s-05-svg').innerHTML = `<rect x="1" y="1" width="298" height="238" rx="10" fill="#fff" stroke="#E5E7EB"/><rect x="1" y="1" width="78" height="238" rx="10" fill="#F9FAFB"/>
        <rect x="12" y="14" width="26" height="26" rx="7" fill="${c}"/><text x="25" y="31" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${esc(initials())}</text>
        ${[0, 1, 2, 3].map(i => `<rect x="12" y="${58 + i * 20}" width="${i ? 48 : 54}" height="8" rx="4" fill="${i ? '#E5E7EB' : c}" opacity="${i ? 1 : 0.8}"/>`).join('')}
        <text x="92" y="34" font-size="12" font-weight="700" fill="#111827">${esc(s.name.slice(0, 18) || 'Workspace')}</text>${avatars}
        ${['To do', 'Doing', 'Done'].map((t, i) => `<text x="${92 + i * 68}" y="62" font-size="9" fill="#6B7280">${t}</text>`).join('')}${cards}`;
      $('.s-05-pinfo').textContent = `${s.invites.length + 1} member${s.invites.length ? 's' : ''} · ${s.tools.size} integration${s.tools.size === 1 ? '' : 's'} · ${s.industry}`;
    }
    function valid() {
      if (s.step === 0 && s.name.trim().length < 2) return 'Enter a workspace name of at least two characters.';
      return '';
    }

    root.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('.s-05-next')) { s.error = valid(); if (!s.error) { if (s.step === 4) s.launched = true; else s.step++; } draw(); return; }
      if (t.closest('.s-05-back')) { s.step--; s.error = ''; draw(); return; }
      const go = t.closest('[data-go]'); if (go && !s.launched && +go.dataset.go <= s.step) { s.step = +go.dataset.go; s.error = ''; draw(); return; }
      const size = t.closest('[data-size]'); if (size) { s.size = size.dataset.size; draw(); return; }
      const col = t.closest('[data-color]'); if (col) { s.color = col.dataset.color; draw(); return; }
      const del = t.closest('[data-del]'); if (del) { s.invites.splice(+del.dataset.del, 1); draw(); return; }
      const tool = t.closest('[data-tool]'); if (tool) { const k = tool.dataset.tool; if (s.tools.has(k)) s.tools.delete(k); else s.tools.add(k); draw(); }
    });
    root.addEventListener('input', e => { const f = e.target.dataset.f; if (f) { s[f] = e.target.value; s.error = ''; preview(); } });
    root.addEventListener('change', e => { const f = e.target.dataset.f; if (f) { s[f] = e.target.value; preview(); } });
    root.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.dataset.f === 'name') { e.preventDefault(); const next = root.querySelector('.s-05-next'); if (next) next.click(); }
    });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const el = e.target.elements, email = el.email.value.trim().toLowerCase();
      if (s.invites.some(i => i[0] === email)) { s.error = 'That person is already on the list.'; draw(); return; }
      s.invites.push([email, el.role.value]); s.error = ''; draw();
      const inp = root.querySelector('.s-05-invite input'); if (inp) inp.focus();
    });
    draw();
  },
};
