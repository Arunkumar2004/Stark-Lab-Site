/* Sample 10: Invoice builder with GST. Follows src/samples/_contract.md (prefix s-10-). */

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
const SELLER = { name: 'Meridian Components Pvt Ltd', gstin: '29AAKCM4821Q1Z3', state: 'Karnataka', code: '29', addr: 'Plot 14, Peenya Industrial Area, Bengaluru 560058' };
const BUYERS = [
  { name: 'Saffron Lane Foods LLP', gstin: '29AAPFS7710K1ZB', state: 'Karnataka', code: '29', addr: 'Whitefield, Bengaluru 560066' },
  { name: 'Narmada Pharma Ltd', gstin: '24AABCN3390M1Z8', state: 'Gujarat', code: '24', addr: 'Sanand GIDC, Ahmedabad 382110' },
  { name: 'Konkan Logistics Pvt Ltd', gstin: '27AAGCK5521H1ZQ', state: 'Maharashtra', code: '27', addr: 'Bhiwandi, Thane 421302' },
];
const SEED = [
  ['Stainless steel hex bolts M10, box of 100', '7318', 12, 1450, 18],
  ['Precision bearing 6205-2RS', '8482', 40, 312, 18],
  ['Installation and calibration service', '998719', 1, 8500, 18],
  ['Corrugated packing cartons', '4819', 200, 18.5, 12],
];
const RATES = [0, 5, 12, 18, 28];

function words(n) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const two = x => (x < 20 ? a[x] : `${b[Math.floor(x / 10)]}${x % 10 ? ' ' + a[x % 10] : ''}`);
  const three = x => `${x >= 100 ? a[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' : '') : ''}${two(x % 100)}`;
  if (n === 0) return 'Zero';
  const parts = [[1e7, 'Crore'], [1e5, 'Lakh'], [1e3, 'Thousand']];
  let out = '', r = n;
  for (const [v, w] of parts) { const q = Math.floor(r / v); if (q) { out += `${q >= 100 ? three(q) : two(q)} ${w} `; r %= v; } }
  return (out + three(r)).trim();
}

const CSS = `
.s-10-app{display:flex;flex-direction:column;height:100%;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#111827;background:#F3F5F4}
.s-10-app *{box-sizing:border-box}
.s-10-top{height:52px;display:flex;align-items:center;gap:14px;padding:0 22px;background:#fff;border-bottom:1px solid #E5E7EB}
.s-10-brand{font-weight:800;color:#047857}
.s-10-crumb{color:#6B7280;font-size:13px}
.s-10-actions{margin-left:auto;display:flex;gap:8px}
.s-10-btn{border:1px solid #D1D5DB;background:#fff;border-radius:7px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer}
.s-10-btn:hover{background:#F9FAFB}
.s-10-primary{background:#047857;border-color:#047857;color:#fff;font-weight:600}
.s-10-primary:hover{background:#065F46}
.s-10-body{flex:1;display:grid;grid-template-columns:1fr 470px;gap:18px;padding:16px 22px;min-height:0}
.s-10-editor{overflow:auto;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:16px 18px}
.s-10-h1{font-size:19px;margin:0 0 12px;display:flex;align-items:center;gap:10px}
.s-10-status{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:#FEF3C7;color:#92400E}
.s-10-status[data-s=Issued]{background:#D1FAE5;color:#065F46}
.s-10-fields{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;margin-bottom:14px}
.s-10-lbl{display:block;font-size:12px;color:#6B7280;margin-bottom:3px}
.s-10-in{width:100%;border:1px solid #D1D5DB;border-radius:7px;padding:6px 8px;font:inherit;font-size:13px;background:#fff}
.s-10-in:focus{outline:2px solid #A7F3D0;border-color:#047857}
.s-10-num{text-align:right;font-variant-numeric:tabular-nums}
.s-10-supply{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#ECFDF5;color:#065F46;font-size:13px;margin-bottom:12px}
.s-10-table{width:100%;border-collapse:collapse;font-size:13px}
.s-10-table th{text-align:left;font-weight:500;color:#6B7280;font-size:12px;padding:6px 4px;border-bottom:1px solid #E5E7EB}
.s-10-table td{padding:5px 4px;border-bottom:1px solid #F3F4F6;vertical-align:middle}
.s-10-table tr:hover td{background:#FAFAFA}
.s-10-x{border:0;background:none;color:#9CA3AF;cursor:pointer;font:inherit;font-size:16px;padding:2px 6px}
.s-10-x:hover{color:#DC2626}
.s-10-addrow{display:grid;grid-template-columns:3fr 1fr 70px 100px 80px auto;gap:6px;margin-top:10px}
.s-10-chart{margin-top:16px;border-top:1px solid #F3F4F6;padding-top:12px}
.s-10-h2{font-size:13px;font-weight:600;margin:0 0 6px}
.s-10-paper{overflow:auto;background:#fff;border:1px solid #E5E7EB;border-radius:6px;padding:26px 28px;box-shadow:0 6px 18px rgba(17,24,39,.06);font-size:12px}
.s-10-ph{display:flex;justify-content:space-between;border-bottom:2px solid #047857;padding-bottom:10px;margin-bottom:12px}
.s-10-pt{font-size:18px;font-weight:800;color:#047857;letter-spacing:.02em}
.s-10-pmuted{color:#6B7280}
.s-10-parties{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px}
.s-10-ptable{width:100%;border-collapse:collapse;margin-bottom:10px}
.s-10-ptable th{background:#F0FDF4;text-align:left;padding:5px;font-weight:600;font-size:11px}
.s-10-ptable td{padding:5px;border-bottom:1px solid #F3F4F6;font-variant-numeric:tabular-nums}
.s-10-r{text-align:right}
.s-10-tot{margin-left:auto;width:250px}
.s-10-tl{display:flex;justify-content:space-between;padding:3px 0;font-variant-numeric:tabular-nums}
.s-10-grand{border-top:1px solid #111827;margin-top:4px;padding-top:6px;font-size:14px;font-weight:800}
.s-10-words{margin-top:10px;padding:8px;background:#F9FAFB;border-radius:6px}
.s-10-empty{padding:14px;text-align:center;color:#9CA3AF}
`;

export default {
  id: '10-invoice-builder',
  name: 'Invoice builder with GST',
  category: 'Finance',
  sector: 'Manufacturing',
  blurb: 'A GST-ready invoice editor for an Indian supplier: line items, HSN codes, automatic CGST and SGST or IGST, and a live print preview.',
  device: 'desktop',
  accent: '#047857',
  tags: ['invoicing', 'GST', 'live preview'],
  render(root) {
    const s = { buyer: 1, no: 'MC/2026-27/0418', date: '2026-10-07', lines: SEED.map(l => [...l]), status: 'Draft' };
    root.innerHTML = `<style>${CSS}</style>
<div class="s-10-app">
  <header class="s-10-top"><span class="s-10-brand">Billbook</span><span class="s-10-crumb">Sales / Invoices / New tax invoice</span>
    <div class="s-10-actions"><button type="button" class="s-10-btn s-10-reset">Reset lines</button><button type="button" class="s-10-btn s-10-primary s-10-issue">Issue invoice</button></div></header>
  <div class="s-10-body">
    <section class="s-10-editor">
      <h1 class="s-10-h1">Tax invoice <span class="s-10-status"></span></h1>
      <div class="s-10-fields">
        <div><label class="s-10-lbl">Bill to</label><select class="s-10-in" data-k="buyer">${BUYERS.map((b, i) => `<option value="${i}">${b.name} (${b.state})</option>`).join('')}</select></div>
        <div><label class="s-10-lbl">Invoice number</label><input class="s-10-in" data-k="no"></div>
        <div><label class="s-10-lbl">Invoice date</label><input class="s-10-in" type="date" data-k="date"></div>
      </div>
      <div class="s-10-supply"></div>
      <table class="s-10-table"><thead><tr><th style="width:38%">Description</th><th>HSN/SAC</th><th class="s-10-r">Qty</th><th class="s-10-r">Rate</th><th>GST</th><th class="s-10-r">Amount</th><th></th></tr></thead><tbody></tbody></table>
      <form class="s-10-addrow"><input class="s-10-in" name="desc" placeholder="Item or service" required><input class="s-10-in" name="hsn" placeholder="HSN/SAC" required pattern="[0-9]{4,8}" title="4 to 8 digits">
        <input class="s-10-in s-10-num" name="qty" type="number" min="1" value="1"><input class="s-10-in s-10-num" name="rate" type="number" min="0" step="0.01" placeholder="Rate" required>
        <select class="s-10-in" name="gst">${RATES.map(r => `<option value="${r}" ${r === 18 ? 'selected' : ''}>${r}%</option>`).join('')}</select><button class="s-10-btn s-10-primary">Add line</button></form>
      <div class="s-10-chart"><h2 class="s-10-h2">Taxable value and tax by GST rate</h2><svg class="s-10-svg" viewBox="0 0 520 120" width="100%" height="120"></svg></div>
    </section>
    <section class="s-10-paper"></section>
  </div>
</div>`;
    const $ = q => root.querySelector(q);
    const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    $('[data-k=buyer]').value = s.buyer; $('[data-k=no]').value = s.no; $('[data-k=date]').value = s.date;

    function calc() {
      const buyer = BUYERS[s.buyer], intra = buyer.code === SELLER.code;
      const lines = s.lines.map(([d, h, q, r, g]) => ({ d, h, q, r, g, amt: q * r, tax: (q * r * g) / 100 }));
      const taxable = lines.reduce((a, l) => a + l.amt, 0), tax = lines.reduce((a, l) => a + l.tax, 0);
      const exact = taxable + tax, total = Math.round(exact);
      const byRate = RATES.map(g => ({ g, amt: lines.filter(l => l.g === g).reduce((a, l) => a + l.amt, 0), tax: lines.filter(l => l.g === g).reduce((a, l) => a + l.tax, 0) })).filter(x => x.amt);
      return { buyer, intra, lines, taxable, tax, total, round: total - exact, byRate };
    }
    function drawLines() {
      $('.s-10-table tbody').innerHTML = s.lines.length ? s.lines.map(([d, h, q, r, g], i) => `<tr><td>${esc(d)}</td><td>${esc(h)}</td>
        <td><input class="s-10-in s-10-num" type="number" min="1" data-i="${i}" data-f="2" value="${q}" style="width:64px"></td>
        <td><input class="s-10-in s-10-num" type="number" min="0" step="0.01" data-i="${i}" data-f="3" value="${r}" style="width:92px"></td>
        <td><select class="s-10-in" data-i="${i}" data-f="4" style="width:66px">${RATES.map(x => `<option value="${x}" ${x === g ? 'selected' : ''}>${x}%</option>`).join('')}</select></td>
        <td class="s-10-r s-10-amt" data-row="${i}">${inr.format(q * r)}</td><td><button type="button" class="s-10-x" data-del="${i}" aria-label="Remove line">&times;</button></td></tr>`).join('')
        : '<tr><td colspan="7" class="s-10-empty">No line items. Add one below.</td></tr>';
    }
    function drawSummary() {
      const c = calc();
      $('.s-10-status').textContent = s.status; $('.s-10-status').dataset.s = s.status;
      $('.s-10-supply').innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#047857"/><path d="M5 8l2 2 4-4" stroke="#fff" stroke-width="2" fill="none"/></svg>
        Place of supply ${c.buyer.state} (${c.buyer.code}). ${c.intra ? 'Intra-state supply: CGST and SGST apply.' : `Inter-state supply from ${SELLER.state}: IGST applies.`}`;
      root.querySelectorAll('.s-10-amt').forEach(td => { const l = s.lines[+td.dataset.row]; td.textContent = inr.format(l[2] * l[3]); });
      const max = Math.max(1, ...c.byRate.map(x => x.amt + x.tax));
      $('.s-10-svg').innerHTML = c.byRate.length ? c.byRate.map((x, i) => {
        const y = i * 28 + 6, w1 = (x.amt / max) * 330, w2 = (x.tax / max) * 330;
        return `<text x="0" y="${y + 14}" font-size="11" fill="#6B7280">GST ${x.g}%</text><rect x="56" y="${y}" width="${w1}" height="18" rx="3" fill="#A7F3D0"/><rect x="${56 + w1}" y="${y}" width="${w2}" height="18" rx="3" fill="#047857"/>
          <text x="${62 + w1 + w2}" y="${y + 14}" font-size="11" fill="#111827">${inr.format(x.amt)} + ${inr.format(x.tax)}</text>`;
      }).join('') : '<text x="0" y="20" font-size="12" fill="#9CA3AF">Add a line to see the breakdown.</text>';
      const half = c.tax / 2;
      $('.s-10-paper').innerHTML = `<div class="s-10-ph"><div><div class="s-10-pt">TAX INVOICE</div><div class="s-10-pmuted">Original for recipient</div></div>
        <div class="s-10-r"><strong>${esc(s.no)}</strong><div class="s-10-pmuted">Date ${new Date(s.date + 'T00:00:00+05:30').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div></div></div>
        <div class="s-10-parties"><div><div class="s-10-pmuted">From</div><strong>${SELLER.name}</strong><div>${SELLER.addr}</div><div>GSTIN ${SELLER.gstin}</div></div>
          <div><div class="s-10-pmuted">Bill to</div><strong>${c.buyer.name}</strong><div>${c.buyer.addr}</div><div>GSTIN ${c.buyer.gstin}</div></div></div>
        <table class="s-10-ptable"><thead><tr><th>#</th><th>Item</th><th>HSN/SAC</th><th class="s-10-r">Qty</th><th class="s-10-r">Taxable</th><th class="s-10-r">GST</th></tr></thead><tbody>
          ${c.lines.map((l, i) => `<tr><td>${i + 1}</td><td>${esc(l.d)}</td><td>${esc(l.h)}</td><td class="s-10-r">${l.q}</td><td class="s-10-r">${inr.format(l.amt)}</td><td class="s-10-r">${l.g}%</td></tr>`).join('') || '<tr><td colspan="6" class="s-10-empty">No items</td></tr>'}</tbody></table>
        <div class="s-10-tot"><div class="s-10-tl"><span>Taxable value</span><span>${inr.format(c.taxable)}</span></div>
          ${c.intra ? `<div class="s-10-tl"><span>CGST</span><span>${inr.format(half)}</span></div><div class="s-10-tl"><span>SGST</span><span>${inr.format(half)}</span></div>` : `<div class="s-10-tl"><span>IGST</span><span>${inr.format(c.tax)}</span></div>`}
          <div class="s-10-tl s-10-pmuted"><span>Round off</span><span>${inr.format(c.round)}</span></div><div class="s-10-tl s-10-grand"><span>Total</span><span>${inr.format(c.total)}</span></div></div>
        <div class="s-10-words"><span class="s-10-pmuted">Amount in words:</span> Indian Rupees ${words(c.total)} Only</div>
        <p class="s-10-pmuted" style="margin-top:12px">Payment due within 30 days of the invoice date. Bank details are printed from Settings, Payment accounts.</p>`;
    }
    function all() { drawLines(); drawSummary(); }

    root.addEventListener('input', e => {
      const el = e.target;
      if (el.dataset.i !== undefined) { const v = parseFloat(el.value); s.lines[+el.dataset.i][+el.dataset.f] = isNaN(v) ? 0 : v; drawSummary(); }
      else if (el.dataset.k === 'no') { s.no = el.value; drawSummary(); }
    });
    root.addEventListener('change', e => {
      const el = e.target;
      if (el.dataset.k === 'buyer') { s.buyer = +el.value; drawSummary(); }
      if (el.dataset.k === 'date') { s.date = el.value || '2026-10-07'; drawSummary(); }
      if (el.tagName === 'SELECT' && el.dataset.i !== undefined) { s.lines[+el.dataset.i][4] = +el.value; drawSummary(); }
    });
    root.addEventListener('click', e => {
      const del = e.target.closest('[data-del]'); if (del) { s.lines.splice(+del.dataset.del, 1); all(); return; }
      if (e.target.closest('.s-10-reset')) { s.lines = SEED.map(l => [...l]); s.status = 'Draft'; all(); }
      if (e.target.closest('.s-10-issue')) { s.status = s.lines.length ? 'Issued' : 'Draft'; drawSummary(); }
    });
    root.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target.elements;
      s.lines.push([f.desc.value.trim(), f.hsn.value.trim(), Math.max(1, +f.qty.value || 1), +f.rate.value || 0, +f.gst.value]);
      e.target.reset(); f.gst.value = '18'; all();
    });
    all();
  },
};
