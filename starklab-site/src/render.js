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
/* root = '' on the home page, '/' on sub-pages so #anchors point home */
const navLinks = (root='') => C.menu.map(m =>
  m.action==='product-modal'
    ? (root ? `<a href="/#services">${esc(m.label)}</a>` : `<a href="#" data-product>${esc(m.label)}</a>`)
    : `<a href="${esc(m.href.startsWith('#') ? root + m.href : m.href)}">${esc(m.label)}</a>`).join('');

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

/* ---------- home: explore the work ---------- */
/* the shared section head: mono eyebrow, h2 with one *em* word, short lead */
const shead = o =>
  `<div class="shead rv"><div><span class="m a">${esc(o.eyebrow)}</span><h2>${em(o.heading)}</h2></div>`
  + (o.sub ? `<p class="lead sm">${esc(o.sub)}</p>` : '') + '</div>';

/* CSS-only preview art: outlined shapes suggesting screens, an agent run or a stack of kits */
/* CSS-only preview drawings, one per card: product screens, an agent run, a stack of kits */
const xArt = kind => kind === 'agent'
  ? '<div class="xart ag" aria-hidden="true">'
    + '<div class="xin"><b class="xh"></b><u></u><u></u><u></u><s class="run"></s></div>'
    + '<em></em>'
    + '<div class="xout"><b class="xh"></b><span><i></i><u></u></span><span><i></i><u></u></span><span><i></i><u class="xl"></u></span></div></div>'
  : kind === 'kit'
  ? '<div class="xart kb" aria-hidden="true"><em></em><i class="b1"><u></u></i><i class="b2"></i><i class="b3"><s></s></i></div>'
  : '<div class="xart sc" aria-hidden="true">'
    + '<div class="win"><b class="bar"><s></s><s></s><s></s></b><span class="side"><u></u><u></u><u></u><u></u></span>'
    + '<span class="kpi"><u></u><u></u><u></u></span>'
    + '<span class="chart"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points="0,32 14,26 28,29 42,18 56,21 70,11 84,14 100,5"/></svg></span></div>'
    + '<div class="ph"><b></b><u></u><u></u><u class="t"></u></div></div>';

const exploreSection = () => shead(C.explore)
  + '<div class="xgrid rv">' + C.explore.items.map(it =>
    `<article class="xcard">${xArt(it.art)}
       <div class="xt"><span class="m a">${esc(it.tag)}</span><span class="m">${esc(it.note||'Self-initiated')}</span></div>
       <h3>${esc(it.title)}</h3>
       <ul>${it.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
       <a class="btn g s" href="${esc(it.href)}">${esc(it.cta)}<span class="ar">&rarr;</span></a>
     </article>`).join('') + '</div>';

/* ---------- home: founder note and questions ---------- */
const founderSection = () => { const f = C.founder; return `<div class="fgrid rv">
       <div class="fcopy"><span class="m a">${esc(f.eyebrow)}</span><h2>${em(f.heading)}</h2>
         <p>${esc(f.note)}</p><p class="fsig"><b>${esc(f.name)}</b><span>${esc(f.role)}</span></p></div>
       <div class="fvid" role="note" aria-label="${esc(f.video.label)}"><span class="m">${esc(f.video.label)}</span><p>${esc(f.video.text)}</p></div>
     </div>`; };

const faqSection = () => `<div class="fqhead">${shead(C.faq)}</div>`
  + '<div class="fqlist rv">' + C.faq.items.map(f =>
    `<details class="fq"><summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary><p>${esc(f.a)}</p></details>`).join('') + '</div>';

/* FAQPage structured data from the same config; "<" escaped so it cannot end the script */
const faqJsonLd = () => '<script type="application/ld+json">' + JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: C.faq.items.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
}).replace(/</g, '\\u003c') + '</script>';

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
export function renderAll(root=''){
  const b = C.business, first = C.catalogue[0];
  return {
    NAV:        navLinks(root),
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
    EXPLORE:    exploreSection(),
    FOUNDER:    founderSection(),
    FAQ:        faqSection(),
    FAQ_LD:     faqJsonLd(),
    YEAR:       String(new Date().getFullYear())
  };
}
