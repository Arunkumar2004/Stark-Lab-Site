/* Sample 03: CRM pipeline board. Follows src/samples/_contract.md (prefix s-03-). */

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const lakh = v => (v >= 1e7 ? `₹${(v / 1e7).toFixed(2)} Cr` : `₹${(v / 1e5).toFixed(1)} L`);

const STAGES = [['lead', 'Lead', 0.1], ['qual', 'Qualified', 0.25], ['prop', 'Proposal', 0.5], ['nego', 'Negotiation', 0.75], ['won', 'Won', 1]];
const OWNERS = { AR: 'Anika Rao', VS: 'Vikram Sethi', ML: 'Maya Lindqvist' };
const DEALS = [
  ['Warehouse barcode rollout', 'Deccan Agro Mills', 1850000, 'lead', 'AR', 'Pune'], ['Annual maintenance contract', 'Coromandel Textiles', 640000, 'lead', 'VS', 'Chennai'],
  ['Dealer portal phase 2', 'Shivalik Tractors', 2400000, 'qual', 'ML', 'Ludhiana'], ['Fleet telematics pilot', 'Konkan Logistics', 920000, 'qual', 'AR', 'Mumbai'],
  ['Clinic ERP migration', 'Bluepeak Clinics', 3150000, 'prop', 'VS', 'Bengaluru'], ['Payroll integration', 'Indus Ceramics', 480000, 'prop', 'ML', 'Morbi'],
  ['Multi-site inventory', 'Narmada Pharma', 5200000, 'nego', 'AR', 'Ahmedabad'], ['Field service app', 'Garuda Elevators', 1360000, 'nego', 'VS', 'Hyderabad'],
  ['GST e-invoicing module', 'Saffron Lane Foods', 720000, 'won', 'ML', 'Kochi'], ['Customer self-service', 'Meridian Components', 1980000, 'won', 'AR', 'Coimbatore'],
];

const CSS = `
.s-03-app{display:flex;flex-direction:column;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1C1917;background:#FAFAF9}
.s-03-app *{box-sizing:border-box}
.s-03-top{display:flex;align-items:center;gap:20px;padding:0 22px;height:52px;background:#fff;border-bottom:1px solid #E7E5E4}
.s-03-brand{font-weight:800;color:#C2410C;letter-spacing:-.01em}
.s-03-link{color:#57534E;cursor:pointer;padding:15px 0;border-bottom:2px solid transparent}
.s-03-link:hover{color:#1C1917}
.s-03-link[data-on]{color:#1C1917;border-bottom-color:#C2410C;font-weight:600}
.s-03-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:16px 22px 10px}
.s-03-title{margin:0;font-size:21px}
.s-03-sub{color:#78716C;font-size:13px}
.s-03-kpis{display:flex;gap:10px}
.s-03-kpi{background:#fff;border:1px solid #E7E5E4;border-radius:9px;padding:8px 14px;min-width:132px}
.s-03-kl{font-size:12px;color:#78716C}
.s-03-kv{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums}
.s-03-tools{display:flex;gap:8px;align-items:center;padding:0 22px 12px}
.s-03-chip{border:1px solid #E7E5E4;background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12px;cursor:pointer;color:#57534E}
.s-03-chip:hover{border-color:#FDBA74}
.s-03-chip[data-on]{background:#FFF7ED;border-color:#C2410C;color:#9A3412}
.s-03-add{margin-left:auto;display:flex;gap:6px}
.s-03-in{border:1px solid #D6D3D1;border-radius:7px;padding:5px 9px;font:inherit;font-size:13px;width:150px}
.s-03-in:focus{outline:2px solid #FED7AA;border-color:#C2410C}
.s-03-btn{border:0;background:#C2410C;color:#fff;border-radius:7px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer}
.s-03-btn:hover{background:#9A3412}
.s-03-ghost{background:#fff;color:#1C1917;border:1px solid #D6D3D1}
.s-03-ghost:hover{background:#F5F5F4}
.s-03-btn:disabled{opacity:.45;cursor:default}
.s-03-body{flex:1;display:grid;grid-template-columns:1fr 280px;gap:14px;padding:0 22px 18px;min-height:0}
.s-03-board{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;min-height:0}
.s-03-col{background:#F5F5F4;border-radius:10px;padding:8px;display:flex;flex-direction:column;min-height:0}
.s-03-col[data-over]{background:#FFEDD5}
.s-03-colhead{display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#44403C;padding:4px 4px 8px}
.s-03-cards{overflow:auto;flex:1;display:flex;flex-direction:column;gap:8px}
.s-03-card{background:#fff;border:1px solid #E7E5E4;border-radius:8px;padding:9px 10px;cursor:grab;transition:box-shadow .15s,border-color .15s}
.s-03-card:hover{border-color:#FDBA74;box-shadow:0 2px 6px rgba(28,25,23,.06)}
.s-03-card[data-on]{border-color:#C2410C;box-shadow:0 0 0 2px #FED7AA}
.s-03-cname{font-weight:600;font-size:13px}
.s-03-cco{font-size:12px;color:#78716C}
.s-03-crow{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:13px;font-variant-numeric:tabular-nums}
.s-03-av{width:22px;height:22px;border-radius:50%;background:#FFEDD5;color:#9A3412;font-size:10px;font-weight:700;display:grid;place-items:center}
.s-03-panel{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:14px;overflow:auto}
.s-03-h2{font-size:13px;font-weight:600;margin:0 0 8px;color:#44403C}
.s-03-dl{display:grid;grid-template-columns:90px 1fr;gap:5px 8px;font-size:13px;margin:10px 0 12px}
.s-03-dl dt{color:#78716C}
.s-03-dl dd{margin:0}
.s-03-empty{color:#A8A29E;font-size:12px;text-align:center;padding:12px 0}
`;

export default {
  id: '03-crm-pipeline',
  name: 'CRM pipeline board',
  category: 'SaaS',
  sector: 'B2B sales',
  blurb: 'A deal board for a B2B sales team: drag deals between stages, filter by owner and see the weighted forecast move.',
  device: 'desktop',
  accent: '#C2410C',
  tags: ['kanban', 'sales', 'forecast'],
  render(root) {
    let deals = DEALS.map(([name, co, value, stage, owner, city], i) => ({ id: i + 1, name, co, value, stage, owner, city }));
    const state = { owner: 'All', sel: 7 };
    root.innerHTML = `<style>${CSS}</style>
<div class="s-03-app">
  <nav class="s-03-top"><span class="s-03-brand">Ledgerline CRM</span>${['Pipeline', 'Accounts', 'Contacts', 'Activities', 'Reports'].map((n, i) => `<span class="s-03-link" ${i ? '' : 'data-on'}>${n}</span>`).join('')}</nav>
  <div class="s-03-head"><div><h1 class="s-03-title">Q3 enterprise pipeline</h1><div class="s-03-sub">India West and South · fiscal quarter ends 31 December</div></div><div class="s-03-kpis"></div></div>
  <div class="s-03-tools">${['All', ...Object.keys(OWNERS)].map(o => `<button type="button" class="s-03-chip" data-owner="${o}">${o === 'All' ? 'All owners' : OWNERS[o]}</button>`).join('')}
    <form class="s-03-add"><input class="s-03-in" name="name" placeholder="Deal name" required><input class="s-03-in" name="co" placeholder="Company" required><input class="s-03-in" name="value" placeholder="Value in rupees" inputmode="numeric" required style="width:120px"><button class="s-03-btn">Add deal</button></form></div>
  <div class="s-03-body"><div class="s-03-board"></div><aside class="s-03-panel"></aside></div>
</div>`;
    const $ = s => root.querySelector(s);
    const visible = () => deals.filter(d => state.owner === 'All' || d.owner === state.owner);

    function drawKpis() {
      const v = visible(), open = v.filter(d => d.stage !== 'won'), won = v.filter(d => d.stage === 'won');
      const total = open.reduce((a, d) => a + d.value, 0);
      const weighted = open.reduce((a, d) => a + d.value * STAGES.find(s => s[0] === d.stage)[2], 0);
      const kp = [['Open pipeline', lakh(total)], ['Weighted forecast', lakh(weighted)], ['Won this quarter', lakh(won.reduce((a, d) => a + d.value, 0))], ['Open deals', open.length]];
      $('.s-03-kpis').innerHTML = kp.map(([l, x]) => `<div class="s-03-kpi"><div class="s-03-kl">${l}</div><div class="s-03-kv">${x}</div></div>`).join('');
    }
    function drawBoard() {
      const v = visible();
      $('.s-03-board').innerHTML = STAGES.map(([k, label]) => {
        const items = v.filter(d => d.stage === k), sum = items.reduce((a, d) => a + d.value, 0);
        return `<div class="s-03-col" data-stage="${k}"><div class="s-03-colhead"><span>${label} · ${items.length}</span><span>${lakh(sum)}</span></div><div class="s-03-cards">
          ${items.map(d => `<div class="s-03-card" draggable="true" data-id="${d.id}" ${d.id === state.sel ? 'data-on' : ''}><div class="s-03-cname">${d.name}</div><div class="s-03-cco">${d.co}</div>
            <div class="s-03-crow"><span>${lakh(d.value)}</span><span class="s-03-av" title="${OWNERS[d.owner]}">${d.owner}</span></div></div>`).join('') || '<div class="s-03-empty">No deals</div>'}</div></div>`;
      }).join('');
      root.querySelectorAll('.s-03-chip').forEach(b => b.toggleAttribute('data-on', b.dataset.owner === state.owner));
    }
    function drawPanel() {
      const v = visible();
      const bars = STAGES.map(([k, l], i) => {
        const sum = v.filter(d => d.stage === k).reduce((a, d) => a + d.value, 0), max = Math.max(1, ...STAGES.map(([kk]) => v.filter(d => d.stage === kk).reduce((a, d) => a + d.value, 0)));
        const w = Math.max(4, (sum / max) * 150);
        return `<text x="0" y="${i * 26 + 15}" font-size="11" fill="#57534E">${l}</text><rect x="78" y="${i * 26 + 4}" width="${w}" height="15" rx="3" fill="#C2410C" opacity="${0.45 + i * 0.13}"/><text x="${84 + w}" y="${i * 26 + 15}" font-size="11" fill="#1C1917">${lakh(sum)}</text>`;
      }).join('');
      const d = deals.find(x => x.id === state.sel);
      const idx = d ? STAGES.findIndex(s => s[0] === d.stage) : -1;
      $('.s-03-panel').innerHTML = `<h2 class="s-03-h2">Value by stage</h2><svg viewBox="0 0 250 130" width="100%" height="130">${bars}</svg>
        <h2 class="s-03-h2" style="margin-top:14px">Selected deal</h2>${d ? `<div class="s-03-cname" style="font-size:15px">${d.name}</div><div class="s-03-cco">${d.co} · ${d.city}</div>
        <dl class="s-03-dl"><dt>Value</dt><dd>${inr.format(d.value)}</dd><dt>Stage</dt><dd>${STAGES[idx][1]}</dd><dt>Probability</dt><dd>${Math.round(STAGES[idx][2] * 100)}%</dd><dt>Owner</dt><dd>${OWNERS[d.owner]}</dd><dt>Next step</dt><dd>${idx < 4 ? 'Follow-up call on 14 Oct' : 'Kick-off scheduled'}</dd></dl>
        <div style="display:flex;gap:6px"><button type="button" class="s-03-btn s-03-ghost s-03-back" ${idx <= 0 ? 'disabled' : ''}>Move back</button><button type="button" class="s-03-btn s-03-next" ${idx >= 4 ? 'disabled' : ''}>Advance stage</button></div>`
        : '<div class="s-03-empty">Click a deal to see its details.</div>'}`;
    }
    function all() { drawKpis(); drawBoard(); drawPanel(); }
    function move(id, stage) { const d = deals.find(x => x.id === id); if (d) { d.stage = stage; state.sel = id; all(); } }

    root.addEventListener('click', e => {
      const chip = e.target.closest('.s-03-chip');
      if (chip) { state.owner = chip.dataset.owner; all(); return; }
      const card = e.target.closest('.s-03-card');
      if (card) { state.sel = +card.dataset.id; drawBoard(); drawPanel(); return; }
      const link = e.target.closest('.s-03-link');
      if (link) root.querySelectorAll('.s-03-link').forEach(x => x.toggleAttribute('data-on', x === link));
      const d = deals.find(x => x.id === state.sel);
      if (!d) return;
      const i = STAGES.findIndex(s => s[0] === d.stage);
      if (e.target.closest('.s-03-next') && i < 4) move(d.id, STAGES[i + 1][0]);
      if (e.target.closest('.s-03-back') && i > 0) move(d.id, STAGES[i - 1][0]);
    });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, el = f.elements, value = parseInt(String(el.value.value).replace(/[^0-9]/g, ''), 10);
      if (!value) { el.value.focus(); return; }
      const id = Math.max(...deals.map(x => x.id)) + 1;
      const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
      deals.push({ id, name: esc(el.name.value.trim()), co: esc(el.co.value.trim()), value, stage: 'lead', owner: state.owner === 'All' ? 'AR' : state.owner, city: 'Not set' });
      state.sel = id; f.reset(); all();
    });
    let dragId = null;
    root.addEventListener('dragstart', e => { const c = e.target.closest('.s-03-card'); if (c) { dragId = +c.dataset.id; e.dataTransfer.setData('text/plain', c.dataset.id); } });
    root.addEventListener('dragover', e => { const col = e.target.closest('.s-03-col'); if (col && dragId) { e.preventDefault(); root.querySelectorAll('.s-03-col').forEach(c => c.toggleAttribute('data-over', c === col)); } });
    root.addEventListener('drop', e => { const col = e.target.closest('.s-03-col'); if (col && dragId) { e.preventDefault(); move(dragId, col.dataset.stage); } dragId = null; });
    root.addEventListener('dragend', () => { dragId = null; root.querySelectorAll('.s-03-col').forEach(c => c.removeAttribute('data-over')); });
    all();
  },
};
