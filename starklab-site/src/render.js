/* Build-time HTML generation. Every section is produced from src/config.js
   so the shipped page is real static HTML — fast, and readable by Google. */
import * as C from './config.js';

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
/* *word* -> italic serif ;  **word** -> bold ink */
const em   = s => esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<em>$1</em>');

/* ---------- pipeline svg ---------- */
function pipeSvg(){
  const p = C.pipeline, cy=[68,138,208,278], oy=[85,173,261];
  const wires = [
    'M262,68 H322 Q350,68 350,96 V145 Q350,173 378,173 H430',
    'M262,138 H330 Q350,138 350,155 V155 Q350,173 370,173 H430',
    'M262,208 H330 Q350,208 350,191 V191 Q350,173 370,173 H430',
    'M262,278 H322 Q350,278 350,250 V201 Q350,173 378,173 H430',
    'M690,173 H732 Q760,173 760,145 V113 Q760,85 788,85 H840',
    'M690,173 H840',
    'M690,173 H732 Q760,173 760,201 V233 Q760,261 788,261 H840'
  ];
  let s = '<svg class="pw" viewBox="0 0 1120 330" role="img" aria-label="Delivery pipeline">';
  s += `<text class="cap" x="34" y="20">${esc(p.leftLabel)}</text>`;
  s += `<text class="cap" x="560" y="20" text-anchor="middle">${esc(p.middleLabel)}</text>`;
  s += `<text class="cap" x="1086" y="20" text-anchor="end">${esc(p.rightLabel)}</text>`;
  wires.forEach((d,i)=>{ s += `<path id="${i<4?'wi'+i:'wo'+(i-4)}" class="wr" d="${d}"/>`; });
  p.inputs.slice(0,4).forEach((t,i)=>{
    s += `<g class="nd"><rect x="32" y="${cy[i]-29}" width="230" height="58" rx="14"/>`
       + `<text class="lb" x="58" y="${cy[i]+7}">${esc(t)}</text></g>`;
  });
  s += '<rect class="core" x="430" y="36" width="260" height="274" rx="20"/>';
  s += `<text class="mini" x="560" y="68" text-anchor="middle">${esc(p.coreNote)}</text>`;
  p.stages.slice(0,3).forEach((t,i)=>{
    const y = 86 + i*74;
    s += `<g class="stg"><rect x="452" y="${y}" width="216" height="58" rx="13"/>`
       + `<text class="sl" x="560" y="${y+37}">${esc(t)}</text></g>`;
  });
  p.outputs.slice(0,3).forEach((o,i)=>{
    const y = oy[i]-33;
    s += `<g class="nd o"><rect x="840" y="${y}" width="248" height="66" rx="14"/>`
       + `<text class="lb" x="866" y="${y+29}">${esc(o.name)}</text>`
       + `<text class="dy" x="866" y="${y+50}">${esc(o.day)}</text></g>`;
  });
  return s + '<g id="dots"></g></svg>';
}

/* ---------- sections ---------- */
const navLinks = () => C.menu.map(m =>
  m.action==='product-modal'
    ? `<a href="#" data-product>${esc(m.label)}</a>`
    : `<a href="${esc(m.href)}">${esc(m.label)}</a>`).join('');

const heroFacts = () => C.hero.facts.map((f,i)=>
  `<div class="hf"><s>0${i+1}</s><b>${esc(f.big)}</b><i>${esc(f.label)}</i></div>`).join('');

const layerPlates = () => C.layers.map((l,i)=>{
  const z = (C.layers.length-1-i)*46;
  return `<div class="ly" data-i="${i}" style="--lc:${esc(l.color)};transform:translateZ(${z}px);z-index:${C.layers.length-i}">`
       + `<u>${esc(l.name)}</u></div>`;
}).join('');

const layerPills = () => C.layers.map((l,i)=>
  `<button class="lp" type="button" data-i="${i}" style="--lc:${esc(l.color)}">${esc(l.name)}</button>`).join('');

const builtForStrip = () => C.builtFor.map(b=>`<b>${esc(b)}</b>`).join('');

const pipeStats = () => C.pipeline.stats.map(s=>
  `<div><b${s.accent?' class="a"':''} data-to="${s.value}"${s.suffix?` data-suf="${esc(s.suffix)}"`:''}>0${esc(s.suffix||'')}</b>`
  + `<span>${esc(s.label)}</span></div>`).join('');

const mainCards = () => C.mainServices.items.map(it=>
  `<article class="pc${it.featured?' f':''}">
     <div class="t"><span class="m${it.featured?' a':''}">${esc(it.tag)}</span><span class="dy">${esc(it.timeline)}</span></div>
     <h3>${esc(it.name)}</h3><p>${esc(it.blurb)}</p>
     <ul>${it.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
     <div class="f2"><span class="pz">${esc(it.price)}<s>from</s></span><span class="dy">${esc(it.days)}</span></div>
   </article>`).join('');

const catChips = () => C.catalogue.map((c,i)=>
  `<button class="cbtn" type="button" role="tab" data-i="${i}" aria-selected="${i===0}" aria-controls="cl">`
  + `${esc(c.name)} <i>${c.items.length}</i></button>`).join('');

const catRows = (cat) => cat.items.map((o,k)=>
  `<article class="srow"><div class="sin">
     <span class="n">${String(k+1).padStart(2,'0')}</span>
     <b>${esc(o.name)}</b>
     <span class="pr">${esc(o.price)}</span>
     <span class="dd">${esc(o.days)}</span>
     <span class="d">${esc(o.desc||'')}</span>
     ${o.get?`<span class="got"><b>You get</b>${esc(o.get)}</span>`:''}
     ${o.offer?`<span class="ofr"><em></em>Offer · ${esc(o.offer)}</span>`:''}
   </div></article>`).join('');

const processNodes = () => C.process.steps.map((s,i)=>
  `${i?'<span class="cl"></span>':''}<div class="nd2"><div class="c">0${i+1}</div>`
  + `<b>${esc(s.name)}</b><span>${esc(s.text)}</span></div>`).join('');

const budgetOptions = () => C.contact.budgets.map(b=>`<option>${esc(b)}</option>`).join('');

/* ---------- public ---------- */
export function renderAll(){
  const b = C.business, first = C.catalogue[0];
  return {
    NAV:        navLinks(),
    BRAND:      esc(b.name),
    HERO_CHIP:  `Taking ${b.openSlots} projects · next slot ${esc(b.nextSlot)}`,
    HERO_H1:    em(C.hero.heading),
    HERO_SUB:   esc(C.hero.sub),
    HERO_CTA1:  esc(C.hero.primaryCta),
    HERO_CTA2:  esc(C.hero.secondaryCta),
    HERO_SMALL: esc(C.hero.smallprint),
    HERO_FACTS: heroFacts(),
    LAYERS:     layerPlates(),
    LAYER_PILLS:layerPills(),
    LAYER_TEXT: em(C.layers[0].text),
    BUILT_FOR:  builtForStrip(),
    PIPE_H2:    em(C.pipeline.heading),
    PIPE_SUB:   esc(C.pipeline.sub),
    PIPE_SVG:   pipeSvg(),
    PIPE_STATS: pipeStats(),
    SVC_H2:     em(C.mainServices.heading),
    SVC_SUB:    esc(C.mainServices.sub),
    SVC_CARDS:  mainCards(),
    CAT_CHIPS:  catChips(),
    CAT_NAME:   esc(first.name),
    CAT_TAG:    esc(first.tagline),
    CAT_ROWS:   catRows(first),
    PROC_H2:    em(C.process.heading),
    PROC_NODES: processNodes(),
    CONTACT_H2: em(C.contact.heading),
    CONTACT_SUB:esc(C.contact.sub),
    BUDGETS:    budgetOptions(),
    REPLY_NOTE: esc(C.contact.replyNote),
    WA:         esc(b.whatsapp),
    WA_DISPLAY: esc(b.whatsappDisplay),
    EMAIL:      esc(b.email),
    HOURS:      esc(b.hours),
    HOURS_NOTE: esc(b.hoursNote),
    PROD_TITLE: esc(C.ownProduct.title),
    PROD_BODY:  esc(C.ownProduct.body),
    PROD_NOTE:  em(C.ownProduct.note),
    PROD_CTA:   esc(C.ownProduct.cta),
    YEAR:       String(new Date().getFullYear())
  };
}
