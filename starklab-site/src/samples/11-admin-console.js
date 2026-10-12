/* 11 Admin console with roles and audit: workspace admin screen for a B2B SaaS tenant. */

const CSS = `
.s-11-app{display:grid;grid-template-columns:208px 1fr;height:100%;font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1f2430;background:#f6f7f9}
.s-11-nav{background:#fff;border-right:1px solid #e4e7ec;padding:18px 12px;display:flex;flex-direction:column;gap:2px}
.s-11-brand{display:flex;align-items:center;gap:8px;font-weight:650;font-size:14px;padding:0 8px 18px}
.s-11-logo{width:26px;height:26px;border-radius:7px;background:#5b4bdb;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700}
.s-11-navitem{padding:8px 10px;border-radius:7px;color:#4a5160;cursor:pointer;display:flex;justify-content:space-between;border:0;background:none;font:inherit;text-align:left}
.s-11-navitem:hover{background:#f1f0fd;color:#1f2430}
.s-11-navitem.s-11-on{background:#ecebfc;color:#3f31b8;font-weight:600}
.s-11-count{font-size:11px;color:#8a91a0}
.s-11-navfoot{margin-top:auto;font-size:11px;color:#8a91a0;padding:8px}
.s-11-main{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.s-11-top{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:#fff;border-bottom:1px solid #e4e7ec}
.s-11-crumb{color:#8a91a0;font-size:12px}
.s-11-title{font-size:18px;font-weight:650;margin:0}
.s-11-who{display:flex;align-items:center;gap:8px;color:#4a5160}
.s-11-av{width:28px;height:28px;border-radius:50%;background:#d9d6fa;color:#3f31b8;display:grid;place-items:center;font-size:11px;font-weight:700}
.s-11-body{flex:1;overflow:auto;padding:20px 24px;display:flex;flex-direction:column;gap:16px}
.s-11-kpis{display:grid;grid-template-columns:repeat(3,1fr) 1.6fr;gap:12px}
.s-11-card{background:#fff;border:1px solid #e4e7ec;border-radius:10px;padding:14px 16px}
.s-11-kl{font-size:12px;color:#6b7280}
.s-11-kv{font-size:22px;font-weight:650;margin-top:4px}
.s-11-kd{font-size:11px;color:#16803c}
.s-11-split{display:grid;grid-template-columns:1fr 300px;gap:16px;min-height:0}
.s-11-bar{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.s-11-chip{border:1px solid #d6d9e0;background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12px;cursor:pointer;color:#4a5160}
.s-11-chip:hover{border-color:#5b4bdb}
.s-11-chip.s-11-on{background:#5b4bdb;border-color:#5b4bdb;color:#fff}
.s-11-search{margin-left:auto;border:1px solid #d6d9e0;border-radius:7px;padding:6px 10px;font:inherit;width:190px}
.s-11-table{width:100%;border-collapse:collapse}
.s-11-table th{text-align:left;font-size:11px;font-weight:600;color:#8a91a0;text-transform:uppercase;letter-spacing:.04em;padding:8px 10px;border-bottom:1px solid #e4e7ec}
.s-11-table td{padding:9px 10px;border-bottom:1px solid #f0f1f4}
.s-11-row{cursor:pointer}
.s-11-row:hover td{background:#faf9ff}
.s-11-row.s-11-sel td{background:#f1f0fd}
.s-11-role{font-size:11px;padding:2px 8px;border-radius:999px;background:#f1f2f5;color:#4a5160;font-weight:600}
.s-11-role.s-11-Owner{background:#ecebfc;color:#3f31b8}
.s-11-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;background:#16a34a}
.s-11-dot.s-11-off{background:#c4c8d0}
.s-11-empty{padding:28px;text-align:center;color:#8a91a0}
.s-11-dl{display:grid;grid-template-columns:90px 1fr;gap:8px 10px;margin:14px 0;font-size:12px}
.s-11-dl dt{color:#8a91a0}
.s-11-dl dd{margin:0}
.s-11-select{width:100%;border:1px solid #d6d9e0;border-radius:7px;padding:7px;font:inherit;background:#fff}
.s-11-toggle{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
.s-11-sw{width:36px;height:20px;border-radius:999px;background:#c4c8d0;position:relative;cursor:pointer;border:0}
.s-11-sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s}
.s-11-sw.s-11-on{background:#5b4bdb}
.s-11-sw.s-11-on::after{left:18px}
.s-11-log{list-style:none;margin:0;padding:0}
.s-11-log li{display:grid;grid-template-columns:120px 1fr;gap:12px;padding:10px 0;border-bottom:1px solid #f0f1f4}
.s-11-time{color:#8a91a0;font-size:12px}
.s-11-new{animation:s-11-flash 1.2s}
@keyframes s-11-flash{from{background:#ecebfc}to{background:transparent}}
`;

const USERS = [
  { id: 1, name: 'Ananya Iyer', email: 'ananya@northwind-labs.io', role: 'Owner', last: '2 min ago', active: true, mfa: true, team: 'Leadership' },
  { id: 2, name: 'Marcus Lindqvist', email: 'marcus@northwind-labs.io', role: 'Admin', last: '18 min ago', active: true, mfa: true, team: 'Platform' },
  { id: 3, name: 'Priya Raghavan', email: 'priya@northwind-labs.io', role: 'Editor', last: '1 h ago', active: true, mfa: false, team: 'Finance' },
  { id: 4, name: 'Tomás Herrera', email: 'tomas@northwind-labs.io', role: 'Editor', last: 'Yesterday', active: true, mfa: true, team: 'Support' },
  { id: 5, name: 'Kavya Menon', email: 'kavya@northwind-labs.io', role: 'Viewer', last: '3 days ago', active: true, mfa: false, team: 'Sales' },
  { id: 6, name: 'Oliver Grant', email: 'oliver@northwind-labs.io', role: 'Admin', last: '5 h ago', active: true, mfa: true, team: 'Security' },
  { id: 7, name: 'Rohan Desai', email: 'rohan@northwind-labs.io', role: 'Viewer', last: '21 days ago', active: false, mfa: false, team: 'Operations' },
  { id: 8, name: 'Hana Sato', email: 'hana@northwind-labs.io', role: 'Editor', last: '40 min ago', active: true, mfa: true, team: 'Design' }
];
const ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'];
const SIGNINS = [42, 51, 47, 18, 12, 55, 61, 58, 49, 63, 21, 15, 66, 71];

export default {
  id: '11-admin-console',
  name: 'Admin console with roles and audit',
  category: 'Internal tools',
  sector: 'B2B SaaS',
  blurb: 'Workspace admins manage members, assign roles, enforce two-factor sign-in and review every change in the audit log.',
  device: 'desktop',
  accent: '#5B4BDB',
  tags: ['RBAC', 'audit log', 'user management'],
  render(root) {
    const users = USERS.map(u => ({ ...u }));
    const audit = [
      { t: 'Today 09:42', m: 'Marcus Lindqvist enabled SSO enforcement for Platform team' },
      { t: 'Today 08:15', m: 'Ananya Iyer invited hana@northwind-labs.io as Editor' },
      { t: 'Yesterday 17:03', m: 'Oliver Grant rotated the SCIM provisioning token' },
      { t: 'Yesterday 11:27', m: 'Rohan Desai was deactivated after 21 days of inactivity' }
    ];
    const st = { view: 'members', filter: 'All', q: '', sel: 3 };

    root.innerHTML = `<style>${CSS}</style>
      <div class="s-11-app">
        <nav class="s-11-nav">
          <div class="s-11-brand"><span class="s-11-logo">NW</span>Northwind Labs</div>
          <button class="s-11-navitem s-11-on" data-view="members">Members <span class="s-11-count">${users.length}</span></button>
          <button class="s-11-navitem" data-view="audit">Audit log <span class="s-11-count" data-k="ac"></span></button>
          <button class="s-11-navitem" data-view="members">Billing</button>
          <button class="s-11-navitem" data-view="members">Integrations</button>
          <div class="s-11-navfoot">Plan: Business · 25 seats</div>
        </nav>
        <div class="s-11-main">
          <header class="s-11-top">
            <div><div class="s-11-crumb">Settings / Workspace</div><h1 class="s-11-title" data-k="title">Members and roles</h1></div>
            <div class="s-11-who"><span class="s-11-av">AI</span>Ananya Iyer</div>
          </header>
          <div class="s-11-body" data-k="body"></div>
        </div>
      </div>`;
    const $ = s => root.querySelector(s);
    const body = $('[data-k="body"]');

    const chart = () => {
      const max = Math.max(...SIGNINS), w = 300, hgt = 54, bw = w / SIGNINS.length;
      const bars = SIGNINS.map((v, i) => {
        const bh = (v / max) * (hgt - 6);
        return `<rect x="${i * bw + 2}" y="${hgt - bh}" width="${bw - 4}" height="${bh}" rx="2" fill="${i === SIGNINS.length - 1 ? '#5b4bdb' : '#c9c4f5'}"><title>${v} sign-ins</title></rect>`;
      }).join('');
      return `<svg viewBox="0 0 ${w} ${hgt}" width="100%" height="${hgt}" role="img" aria-label="Sign-ins over 14 days">${bars}</svg>`;
    };

    const kpis = () => {
      const active = users.filter(u => u.active).length;
      const mfa = Math.round((users.filter(u => u.mfa).length / users.length) * 100);
      const admins = users.filter(u => u.role === 'Owner' || u.role === 'Admin').length;
      return `<div class="s-11-kpis">
        <div class="s-11-card"><div class="s-11-kl">Active members</div><div class="s-11-kv">${active} / 25</div><div class="s-11-kd">${25 - active} seats free</div></div>
        <div class="s-11-card"><div class="s-11-kl">Two-factor coverage</div><div class="s-11-kv">${mfa}%</div><div class="s-11-kd" style="color:${mfa < 80 ? '#b45309' : '#16803c'}">${mfa < 80 ? 'Below the 80% policy' : 'Meets policy'}</div></div>
        <div class="s-11-card"><div class="s-11-kl">Admins and owners</div><div class="s-11-kv">${admins}</div><div class="s-11-kd">Least privilege review due 14 Oct</div></div>
        <div class="s-11-card"><div class="s-11-kl">Sign-ins, last 14 days</div>${chart()}</div>
      </div>`;
    };

    const detail = () => {
      const u = users.find(x => x.id === st.sel);
      if (!u) return `<div class="s-11-card s-11-empty">Select a member to see details</div>`;
      return `<div class="s-11-card">
        <div style="display:flex;gap:10px;align-items:center"><span class="s-11-av">${u.name.split(' ').map(p => p[0]).join('')}</span><div><b>${u.name}</b><div class="s-11-time">${u.email}</div></div></div>
        <dl class="s-11-dl"><dt>Team</dt><dd>${u.team}</dd><dt>Status</dt><dd>${u.active ? 'Active' : 'Deactivated'}</dd><dt>Last seen</dt><dd>${u.last}</dd></dl>
        <label class="s-11-kl" for="s-11-role">Role</label>
        <select class="s-11-select" id="s-11-role" data-k="role" ${u.role === 'Owner' ? 'disabled' : ''}>${ROLES.map(r => `<option ${r === u.role ? 'selected' : ''}>${r}</option>`).join('')}</select>
        <div class="s-11-toggle"><span>Require two-factor sign-in</span><button class="s-11-sw s-11-${u.mfa?'on':'off'}" data-k="mfa" aria-pressed="${u.mfa}" aria-label="Toggle two-factor"></button></div>
        <div class="s-11-toggle"><span>Account active</span><button class="s-11-sw s-11-${u.active?'on':'off'}" data-k="act" aria-pressed="${u.active}" aria-label="Toggle active" ${u.role === 'Owner' ? 'disabled' : ''}></button></div>
        ${u.role === 'Owner' ? '<p class="s-11-time">Owner role is transferred from Billing, not here.</p>' : ''}
      </div>`;
    };

    const membersView = () => {
      const rows = users.filter(u => (st.filter === 'All' || u.role === st.filter) && (u.name + u.email).toLowerCase().includes(st.q.toLowerCase()));
      return `${kpis()}
        <div class="s-11-split">
          <div class="s-11-card">
            <div class="s-11-bar">${['All', ...ROLES].map(r => `<button class="s-11-chip s-11-${st.filter===r?'on':'off'}" data-filter="${r}">${r}</button>`).join('')}
              <input class="s-11-search" data-k="q" placeholder="Search name or email" value="${st.q}"></div>
            <table class="s-11-table"><thead><tr><th>Member</th><th>Role</th><th>Two-factor</th><th>Last seen</th></tr></thead><tbody>
            ${rows.map(u => `<tr class="s-11-row s-11-${u.id===st.sel?'sel':'n'}" data-id="${u.id}"><td><span class="s-11-dot s-11-${u.active?'on':'off'}"></span>${u.name}</td><td><span class="s-11-role s-11-${u.role}">${u.role}</span></td><td>${u.mfa ? 'Enabled' : 'Not set'}</td><td class="s-11-time">${u.last}</td></tr>`).join('')}
            </tbody></table>
            ${rows.length ? '' : '<div class="s-11-empty">No members match this filter</div>'}
          </div>
          <div data-k="detail">${detail()}</div>
        </div>`;
    };

    const auditView = () => `<div class="s-11-card"><ul class="s-11-log">${audit.map(a => `<li class="s-11-${a.fresh?'new':'old'}"><span class="s-11-time">${a.t}</span><span>${a.m}</span></li>`).join('')}</ul></div>`;

    const draw = () => {
      $('[data-k="ac"]').textContent = audit.length;
      $('[data-k="title"]').textContent = st.view === 'audit' ? 'Audit log' : 'Members and roles';
      root.querySelectorAll('.s-11-navitem').forEach((b, i) => b.classList.toggle('s-11-on', (i === 1) === (st.view === 'audit') && i < 2));
      body.innerHTML = st.view === 'audit' ? auditView() : membersView();
      if (st.view === 'audit') audit.forEach(a => { a.fresh = false; });
    };
    const log = m => audit.unshift({ t: 'Today ' + new Date().toTimeString().slice(0, 5), m: 'Ananya Iyer ' + m, fresh: true });

    root.addEventListener('click', e => {
      const nav = e.target.closest('[data-view]');
      if (nav) { st.view = nav.dataset.view; draw(); return; }
      const f = e.target.closest('[data-filter]');
      if (f) { st.filter = f.dataset.filter; draw(); return; }
      const row = e.target.closest('[data-id]');
      if (row) { st.sel = +row.dataset.id; draw(); return; }
      const u = users.find(x => x.id === st.sel);
      if (e.target.closest('[data-k="mfa"]') && u) { u.mfa = !u.mfa; log(`${u.mfa ? 'required' : 'removed'} two-factor sign-in for ${u.name}`); draw(); }
      if (e.target.closest('[data-k="act"]') && u && u.role !== 'Owner') { u.active = !u.active; log(`${u.active ? 'reactivated' : 'deactivated'} ${u.name}`); draw(); }
    });
    root.addEventListener('change', e => {
      if (e.target.dataset.k !== 'role') return;
      const u = users.find(x => x.id === st.sel);
      log(`changed ${u.name} from ${u.role} to ${e.target.value}`);
      u.role = e.target.value; draw();
    });
    root.addEventListener('input', e => {
      if (e.target.dataset.k !== 'q') return;
      st.q = e.target.value; draw();
      const q = $('[data-k="q"]'); q.focus(); q.setSelectionRange(st.q.length, st.q.length);
    });
    draw();
  }
};
