/* Sample 04: Subscription billing portal. Follows src/samples/_contract.md (prefix s-04-). */

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
const PLANS = [
  { id: 'starter', name: 'Starter', monthly: 29, seats: 5, api: '50k', blurb: 'For small teams getting set up.' },
  { id: 'team', name: 'Team', monthly: 99, seats: 25, api: '500k', blurb: 'Shared workspaces and audit history.' },
  { id: 'business', name: 'Business', monthly: 249, seats: 100, api: '2M', blurb: 'SSO, data residency and priority support.' },
];
const USAGE = {
  api: { label: 'API calls', unit: 'k', cap: 500, data: [212, 248, 301, 287, 356, 412] },
  seats: { label: 'Seats', unit: '', cap: 25, data: [14, 15, 17, 18, 21, 22] },
  storage: { label: 'Storage', unit: ' GB', cap: 200, data: [61, 70, 84, 96, 118, 131] },
};
const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const INVOICES = [
  ['INV-3108', '1 Oct 2026', 99, 'Due'], ['INV-2976', '1 Sep 2026', 99, 'Paid'], ['INV-2851', '1 Aug 2026', 99, 'Paid'],
  ['INV-2790', '14 Jul 2026', 34.5, 'Refunded'], ['INV-2722', '1 Jul 2026', 99, 'Paid'], ['INV-2604', '1 Jun 2026', 29, 'Paid'],
];

const CSS = `
.s-04-app{display:flex;flex-direction:column;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#18181B;background:#FAFAFA}
.s-04-app *{box-sizing:border-box}
.s-04-top{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:#fff;border-bottom:1px solid #E4E4E7}
.s-04-brand{font-weight:700;display:flex;gap:8px;align-items:center}
.s-04-logo{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,#7C3AED,#A78BFA)}
.s-04-user{font-size:13px;color:#52525B}
.s-04-wrap{flex:1;display:grid;grid-template-columns:200px 1fr;min-height:0}
.s-04-nav{padding:18px 12px;border-right:1px solid #E4E4E7;background:#fff}
.s-04-ni{padding:7px 10px;border-radius:7px;color:#52525B;cursor:pointer}
.s-04-ni:hover{background:#F4F4F5}
.s-04-ni[data-on]{background:#F5F3FF;color:#6D28D9;font-weight:600}
.s-04-main{overflow:auto;padding:22px 28px}
.s-04-h1{font-size:21px;margin:0 0 2px}
.s-04-muted{color:#71717A;font-size:13px}
.s-04-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:16px;margin-top:18px}
.s-04-card{background:#fff;border:1px solid #E4E4E7;border-radius:12px;padding:16px 18px}
.s-04-h2{font-size:14px;margin:0 0 10px;display:flex;justify-content:space-between;align-items:center}
.s-04-toggle{display:inline-flex;background:#F4F4F5;border-radius:999px;padding:3px;font-size:12px}
.s-04-toggle button{border:0;background:none;border-radius:999px;padding:4px 12px;font:inherit;cursor:pointer;color:#52525B}
.s-04-toggle button[data-on]{background:#fff;color:#18181B;box-shadow:0 1px 2px rgba(0,0,0,.08);font-weight:600}
.s-04-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.s-04-plan{border:1px solid #E4E4E7;border-radius:10px;padding:12px;cursor:pointer;transition:border-color .15s,background .15s}
.s-04-plan:hover{border-color:#C4B5FD}
.s-04-plan[data-on]{border-color:#7C3AED;background:#F5F3FF}
.s-04-pname{font-weight:600}
.s-04-price{font-size:22px;font-weight:700;margin:4px 0;font-variant-numeric:tabular-nums}
.s-04-tag{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;background:#EDE9FE;color:#6D28D9}
.s-04-sum{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid #F4F4F5}
.s-04-btn{border:0;background:#7C3AED;color:#fff;border-radius:8px;padding:8px 14px;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.s-04-btn:hover{background:#6D28D9}
.s-04-btn:disabled{background:#D4D4D8;cursor:default}
.s-04-sel{border:1px solid #D4D4D8;border-radius:7px;padding:4px 8px;font:inherit;font-size:12px;background:#fff}
.s-04-meter{margin:8px 0}
.s-04-bar{height:8px;background:#F4F4F5;border-radius:99px;overflow:hidden;margin-top:4px}
.s-04-fill{height:100%;background:#7C3AED;border-radius:99px}
.s-04-pm{display:flex;align-items:center;gap:12px;margin-top:12px;padding:10px;border:1px dashed #D4D4D8;border-radius:10px;font-size:13px}
.s-04-cardicon{width:40px;height:26px;border-radius:5px;background:#18181B;color:#fff;font-size:9px;display:grid;place-items:center;font-weight:700}
.s-04-table{width:100%;border-collapse:collapse;font-size:13px}
.s-04-table th{text-align:left;color:#71717A;font-weight:500;padding:7px 8px;border-bottom:1px solid #E4E4E7}
.s-04-table td{padding:9px 8px;border-bottom:1px solid #F4F4F5;font-variant-numeric:tabular-nums}
.s-04-table tr:hover td{background:#FAFAFA}
.s-04-st{font-size:12px;padding:2px 8px;border-radius:999px;background:#F4F4F5}
.s-04-st[data-s=Paid]{background:#DCFCE7;color:#166534}
.s-04-st[data-s=Due]{background:#FEF3C7;color:#92400E}
.s-04-a{color:#6D28D9;cursor:pointer}
.s-04-a:hover{text-decoration:underline}
.s-04-note{margin-top:8px;font-size:12px;color:#166534;min-height:16px}
`;

export default {
  id: '04-billing-portal',
  name: 'Subscription billing portal',
  category: 'Finance',
  sector: 'SaaS billing',
  blurb: 'The self-serve billing page where a customer changes plan, watches usage against limits and downloads invoices.',
  device: 'desktop',
  accent: '#7C3AED',
  tags: ['billing', 'plans', 'usage meters'],
  render(root) {
    const usage = JSON.parse(JSON.stringify(USAGE)), invoices = INVOICES.map(r => [...r]);
    const state = { cycle: 'monthly', current: 'team', pick: 'team', usage: 'api', status: 'All' };
    const price = p => (state.cycle === 'annual' ? p.monthly * 0.8 : p.monthly);
    root.innerHTML = `<style>${CSS}</style>
<div class="s-04-app">
  <header class="s-04-top"><div class="s-04-brand"><span class="s-04-logo"></span>Cloudmint</div><div class="s-04-user">Orbital Design Co. · Hana Okafor (owner)</div></header>
  <div class="s-04-wrap">
    <nav class="s-04-nav">${['General', 'Members', 'Billing', 'Integrations', 'Security'].map(n => `<div class="s-04-ni" ${n === 'Billing' ? 'data-on' : ''}>${n}</div>`).join('')}</nav>
    <main class="s-04-main">
      <h1 class="s-04-h1">Billing</h1><div class="s-04-muted">Manage your plan, usage and invoices. Changes are prorated to the day.</div>
      <div class="s-04-grid">
        <section class="s-04-card"><h2 class="s-04-h2">Plan<span class="s-04-toggle"><button type="button" data-cycle="monthly">Monthly</button><button type="button" data-cycle="annual">Annual, save 20%</button></span></h2>
          <div class="s-04-plans"></div><div class="s-04-sum"></div><div class="s-04-note"></div></section>
        <section class="s-04-card"><h2 class="s-04-h2">Usage this cycle<select class="s-04-sel">${Object.entries(usage).map(([k, u]) => `<option value="${k}">${u.label}</option>`).join('')}</select></h2>
          <svg class="s-04-chart" viewBox="0 0 320 130" width="100%" height="130"></svg><div class="s-04-meters"></div>
          <div class="s-04-pm"><span class="s-04-cardicon">VISA</span><div>Visa ending 0118<div class="s-04-muted">Expires 09/28 · billing@orbital.example</div></div><span class="s-04-a" style="margin-left:auto">Update</span></div></section>
      </div>
      <section class="s-04-card" style="margin-top:16px"><h2 class="s-04-h2">Invoices<span class="s-04-toggle s-04-status">${['All', 'Paid', 'Due', 'Refunded'].map(s => `<button type="button" data-status="${s}">${s}</button>`).join('')}</span></h2>
        <table class="s-04-table"><thead><tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody></tbody></table></section>
    </main>
  </div>
</div>`;
    const $ = s => root.querySelector(s);

    function drawPlans() {
      $('.s-04-plans').innerHTML = PLANS.map(p => `<div class="s-04-plan" data-plan="${p.id}" ${p.id === state.pick ? 'data-on' : ''}><div class="s-04-pname">${p.name} ${p.id === state.current ? '<span class="s-04-tag">Current</span>' : ''}</div>
        <div class="s-04-price">${usd.format(price(p)).replace('.00', '')}<span class="s-04-muted"> /mo</span></div><div class="s-04-muted">${p.seats} seats · ${p.api} API calls</div><div class="s-04-muted" style="margin-top:4px">${p.blurb}</div></div>`).join('');
      const pick = PLANS.find(p => p.id === state.pick), cur = PLANS.find(p => p.id === state.current);
      const factor = state.cycle === 'annual' ? 12 : 1, next = price(pick) * factor;
      const diff = ((price(pick) - price(cur)) * 0.5).toFixed(2);
      $('.s-04-sum').innerHTML = `<div><div class="s-04-muted">Next invoice on 1 Nov 2026</div><strong>${usd.format(next)}</strong> <span class="s-04-muted">${state.cycle === 'annual' ? 'billed yearly' : 'billed monthly'}${pick.id !== cur.id ? ` · prorated adjustment ${diff >= 0 ? '' : '-'}${usd.format(Math.abs(diff))}` : ''}</span></div>
        <button type="button" class="s-04-btn s-04-apply" ${pick.id === cur.id ? 'disabled' : ''}>${pick.id === cur.id ? 'Current plan' : `Switch to ${pick.name}`}</button>`;
      root.querySelectorAll('[data-cycle]').forEach(b => b.toggleAttribute('data-on', b.dataset.cycle === state.cycle));
    }
    function drawUsage() {
      const u = usage[state.usage], max = Math.max(u.cap, ...u.data);
      const bw = 34, gap = 16, base = 108;
      const capY = base - (u.cap / max) * 92;
      const bars = u.data.map((v, i) => {
        const h = (v / max) * 92, x = 20 + i * (bw + gap);
        return `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="4" fill="#7C3AED" opacity="${i === 5 ? 1 : 0.35}"><title>${MONTHS[i]}: ${v}${u.unit}</title></rect><text x="${x + bw / 2}" y="124" font-size="10" text-anchor="middle" fill="#71717A">${MONTHS[i]}</text>`;
      }).join('');
      $('.s-04-chart').innerHTML = `<line x1="10" x2="315" y1="${capY}" y2="${capY}" stroke="#F59E0B" stroke-dasharray="4 3"/><text x="315" y="${capY - 4}" font-size="10" text-anchor="end" fill="#B45309">Plan limit ${u.cap}${u.unit}</text>${bars}`;
      $('.s-04-meters').innerHTML = Object.values(usage).map(m => {
        const v = m.data[5], pct = Math.min(100, Math.round((v / m.cap) * 100));
        return `<div class="s-04-meter"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${m.label}</span><span class="s-04-muted">${v}${m.unit} of ${m.cap}${m.unit} · ${pct}%</span></div><div class="s-04-bar"><div class="s-04-fill" style="width:${pct}%"></div></div></div>`;
      }).join('');
    }
    function drawInvoices() {
      const rows = invoices.filter(r => state.status === 'All' || r[3] === state.status);
      $('.s-04-table tbody').innerHTML = rows.length ? rows.map(([n, d, a, s]) => `<tr><td>${n}</td><td>${d}</td><td>${usd.format(a)}</td><td><span class="s-04-st" data-s="${s}">${s}</span></td>
        <td style="text-align:right">${s === 'Due' ? '<span class="s-04-a s-04-pay">Pay now</span>' : '<span class="s-04-a">Download PDF</span>'}</td></tr>`).join('')
        : '<tr><td colspan="5" class="s-04-muted" style="text-align:center;padding:16px">No invoices with this status.</td></tr>';
      root.querySelectorAll('[data-status]').forEach(b => b.toggleAttribute('data-on', b.dataset.status === state.status));
    }

    root.addEventListener('click', e => {
      const t = e.target;
      const c = t.closest('[data-cycle]'); if (c) { state.cycle = c.dataset.cycle; drawPlans(); return; }
      const p = t.closest('[data-plan]'); if (p) { state.pick = p.dataset.plan; $('.s-04-note').textContent = ''; drawPlans(); return; }
      const s = t.closest('[data-status]'); if (s) { state.status = s.dataset.status; drawInvoices(); return; }
      const n = t.closest('.s-04-ni'); if (n) root.querySelectorAll('.s-04-ni').forEach(x => x.toggleAttribute('data-on', x === n));
      if (t.closest('.s-04-apply')) {
        state.current = state.pick;
        $('.s-04-note').textContent = `Plan changed to ${PLANS.find(x => x.id === state.current).name}. A confirmation email is on its way.`;
        usage.seats.cap = PLANS.find(x => x.id === state.current).seats;
        drawPlans(); drawUsage();
      }
      if (t.closest('.s-04-pay')) { invoices[0][3] = 'Paid'; drawInvoices(); }
    });
    root.addEventListener('change', e => { if (e.target.classList.contains('s-04-sel')) { state.usage = e.target.value; drawUsage(); } });
    drawPlans(); drawUsage(); drawInvoices();
  },
};
