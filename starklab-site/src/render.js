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
    'M690,173 H722 Q750,173 750,145 V113 Q750,85 778,85 H826',
    'M690,173 H826',
    'M690,173 H722 Q750,173 750,201 V233 Q750,261 778,261 H826'
  ];
  /* unbuilt work is drawn as a dashed sketch, shipped work as a solid card with a tick */
  let s = '<svg class="pw" viewBox="0 0 1120 330" role="img" aria-label="Delivery pipeline">';
  s += `<text class="cap" x="34" y="20">${esc(p.leftLabel)}</text>`;
  s += `<text class="cap" x="560" y="20" text-anchor="middle">${esc(p.middleLabel)}</text>`;
  s += `<text class="cap" x="1086" y="20" text-anchor="end">${esc(p.rightLabel)}</text>`;
  wires.forEach((d,i)=>{ s += `<path id="${i<4?'wi'+i:'wo'+(i-4)}" class="wr${i<4?' in':''}" d="${d}"/>`; });
  p.inputs.slice(0,4).forEach((t,i)=>{
    s += `<g class="nd"><rect x="32" y="${cy[i]-29}" width="230" height="58" rx="14"/>`
       + `<text class="lb" x="58" y="${cy[i]+7}">${esc(t)}</text>`
       + `<circle class="port" cx="262" cy="${cy[i]}" r="4.5"/></g>`;
  });
  s += '<rect class="core" x="430" y="36" width="260" height="274" rx="20"/>';
  s += `<text class="mini" x="560" y="68" text-anchor="middle">${esc(p.coreNote)}</text>`;
  /* the three stages hang on one rail, numbered, with a short note on the right */
  s += '<path class="rail" d="M478,115 V263"/>';
  p.stages.slice(0,3).forEach((t,i)=>{
    const y = 86 + i*74, n = (p.stageNotes||[])[i];
    s += `<g class="stg"><rect x="452" y="${y}" width="216" height="58" rx="13"/>`
       + `<circle class="sn${i===2?' last':''}" cx="478" cy="${y+29}" r="12"/>`
       + `<text class="snt${i===2?' last':''}" x="478" y="${y+33}" text-anchor="middle">0${i+1}</text>`
       + `<text class="sl" x="502" y="${y+36}">${esc(t)}</text>`
       + (n ? `<text class="sm" x="654" y="${y+34}" text-anchor="end">${esc(n)}</text>` : '') + '</g>';
  });
  p.outputs.slice(0,3).forEach((o,i)=>{
    const y = oy[i]-33;
    s += `<g class="nd o"><rect x="826" y="${y}" width="262" height="66" rx="14"/>`
       + `<circle class="tick" cx="852" cy="${y+33}" r="11"/><path class="tk" d="M847,${y+33} l3.6,3.6 l6.4,-7"/>`
       + `<text class="lb" x="874" y="${y+29}">${esc(o.name)}</text>`
       + `<text class="dy" x="874" y="${y+50}">${esc(o.day)}</text></g>`;
  });
  return s + '<g id="dots"></g></svg>';
}

/* ---------- pipeline, phone version ----------
   The wide drawing does not fit a phone, so phones get the same content
   as a top-to-bottom flow: unbuilt work, the three stages, what ships. */
function pipeMobile(){
  const p = C.pipeline, notes = p.stageNotes || [];
  return `<div class="pmsec"><span class="m">${esc(p.leftLabel)}</span>`
    + `<div class="pmin">${p.inputs.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>`
    + '<i class="pmarrow" aria-hidden="true"></i>'
    + `<div class="pmcore"><span class="pmnote">${esc(p.coreNote)}</span>`
    + p.stages.map((t,i) => `<div class="pmst"><b${i===p.stages.length-1?' class="last"':''}>0${i+1}</b>`
      + `<span>${esc(t)}</span>${notes[i] ? `<em>${esc(notes[i])}</em>` : ''}</div>`).join('') + '</div>'
    + '<i class="pmarrow" aria-hidden="true"></i>'
    + `<div class="pmsec"><span class="m">${esc(p.rightLabel)}</span>`
    + p.outputs.map(o => `<div class="pmout"><i class="tk" aria-hidden="true"></i><span><b>${esc(o.name)}</b><s>${esc(o.day)}</s></span></div>`).join('')
    + '</div>';
}

/* ---------- sections ---------- */
/* root = '' on the home page, '/' on sub-pages so #anchors point home */
const navLinks = (root='') => C.menu.map(m =>
  m.action==='product-modal'
    ? (root ? `<a href="/#services">${esc(m.label)}</a>` : `<a href="#" data-product>${esc(m.label)}</a>`)
    : `<a href="${esc(m.href.startsWith('#') ? root + m.href : m.href)}">${esc(m.label)}</a>`).join('');

const heroFacts = () => C.hero.facts.map((f,i)=>
  `<div class="hf"><s>0${i+1}</s><b>${esc(f.big)}</b><i>${esc(f.label)}</i></div>`).join('');

/* one round slice per layer: an oval top face over a curved side, top disc first */
const layerDiscs = () => C.layers.map((l,i)=>
  `<button class="dk" type="button" data-i="${i}" aria-pressed="false" style="--i:${i};z-index:${C.layers.length-i}">`
  + `<span class="dkin"><i class="dside"></i><i class="dtop"></i><u><s>0${i+1}</s>${esc(l.name)}</u></span></button>`).join('');

const layerPills = () => C.layers.map((l,i)=>
  `<button class="lp" type="button" data-i="${i}" aria-pressed="false">${esc(l.name)}</button>`).join('');

const layerIntro = () => { const s = C.stackIntro;
  return `<span class="m">${esc(s.label)}</span><b>${esc(s.title)}</b><p>${esc(s.text)}</p>`; };

/* ---------- footer ---------- */
const ICONS = {
  whatsapp:  '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.6-4.9c-.4-.7-.9-1.6-.9-2.5s.5-1.4.7-1.6c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c0 .2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6a8 8 0 0 0 3.7 3.2c.3.1.5.1.6-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.1Z"/>',
  email:     '<path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2-.5 6.8 5.3L18.8 6H5.2Z"/>',
  linkedin:  '<path d="M5 3.5a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8ZM3 9.6h4v11H3v-11Zm6.4 0h3.8v1.6c.6-1 1.9-1.9 3.8-1.9 4 0 4.6 2.6 4.6 6v5.3h-4v-4.7c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7v4.8h-4.3v-11Z"/>',
  x:         '<path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/>',
  instagram: '<path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5-3.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/>'
};

const socialIcons = () => C.socials.filter(s => s.url && ICONS[s.icon]).map(s => {
  const ext = /^https?:/.test(s.url);
  return `<a class="sfso" href="${esc(s.url)}" aria-label="${esc(s.name)}"${ext?' target="_blank" rel="noopener"':''}>`
    + `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.icon]}</svg></a>`; }).join('');

const siteFooter = (root='') => { const f = C.footer, b = C.business;
  const link = l => `<a href="${esc(l.href.startsWith('#') ? root + l.href : l.href)}">${esc(l.label)}</a>`;
  return `<footer class="sf"><div class="w">
    <div class="sftop">
      <div><p class="sfbig">${em(f.heading)}</p><p class="sfline">${esc(f.line)}</p></div>
      <a class="btn" href="${root}#contact">Book a call<span class="ar">&rarr;</span></a>
    </div>
    <div class="sfcols">
      <div class="sfcol"><span class="m">Reach us</span>
        <a href="mailto:${esc(b.email)}">${esc(b.email)}</a>
        <a href="https://wa.me/${esc(b.whatsapp)}" target="_blank" rel="noopener">${esc(b.whatsappDisplay)}</a>
        <span class="sfhours">${esc(b.hours)}</span></div>
      ${f.columns.map(c => `<div class="sfcol"><span class="m">${esc(c.title)}</span>${c.links.map(link).join('')}</div>`).join('')}
    </div>
    <div class="sfbar">
      <span class="m">&copy; ${new Date().getFullYear()} ${esc(b.name)} &middot; Fixed price &middot; fixed date</span>
      <div class="sfsocial">${socialIcons()}</div>
    </div>
  </div></footer>`; };

/* ---------- light / dark ---------- */
/* runs in <head> before the page paints, so a dark visit never flashes white */
const themeBoot = () => `<script>(function(){var d=document.documentElement,k='starklab-theme',m=matchMedia('(prefers-color-scheme: dark)'),`
  + `s=function(){try{return localStorage.getItem(k)}catch(e){return null}},`
  + `set=function(t){d.dataset.theme=t;var c=document.querySelector('meta[name=theme-color]');if(c)c.content=t==='dark'?'#0F0F0E':'#FBFBF9';`
  + `document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.setAttribute('aria-pressed',String(t==='dark'));b.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode')})};`
  + `set(s()||(m.matches?'dark':'light'));`
  + `m.addEventListener&&m.addEventListener('change',function(e){if(!s())set(e.matches?'dark':'light')});`
  + `document.addEventListener('DOMContentLoaded',function(){set(d.dataset.theme)});`
  + `document.addEventListener('click',function(e){if(!e.target.closest('[data-theme-toggle]'))return;var t=d.dataset.theme==='dark'?'light':'dark';`
  + `try{localStorage.setItem(k,t)}catch(e){}set(t)})})()</script>`;

const themeBtn = () => '<button class="thm" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false">'
  + '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>'
  + '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z"/></svg></button>';

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
    LAYERS:     layerDiscs(),
    LAYER_PILLS:layerPills(),
    LAYER_TEXT: layerIntro(),
    THEME_BOOT: themeBoot(),
    THEME_BTN:  themeBtn(),
    FOOTER:     siteFooter(root),
    BUILT_FOR:  builtForStrip(),
    PIPE_H2:    em(C.pipeline.heading),
    PIPE_SUB:   esc(C.pipeline.sub),
    PIPE_SVG:   pipeSvg(),
    PIPE_MOBILE:pipeMobile(),
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
