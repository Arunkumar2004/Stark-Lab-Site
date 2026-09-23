/* ==========================================================================
   STARK LAB — SITE CONFIGURATION
   --------------------------------------------------------------------------
   EVERYTHING on the website is controlled from this one file.
   Change a price, rename a service, add a category, edit the phone number —
   it is all here. Save the file, run  npm run build , and the site updates.

   After editing:   npm run dev     (see it live while you type)
                    npm run build   (make the final files for Vercel)
   ========================================================================== */

export const business = {
  name:      'Stark Lab',
  tagline:   'Your whole product stack. One studio.',
  email:     'stark.connect@gmail.com',
  whatsapp:  '919842666957',            // country code + number, no + or spaces
  whatsappDisplay: '+91 98426 66957',
  hours:     'Mon – Sat · 9:00 – 21:00 IST',
  hoursNote: 'We take clients worldwide and work to your timezone.',
  url:       'https://starklab.vercel.app',
  nextSlot:  '30 Sep',                  // shown in the hero chip
  openSlots: 2
};

/* ---- where the contact form sends enquiries ---------------------------- */
export const database = {
  url:   'https://fzschatuixvjgdzzmvdb.supabase.co',
  key:   'sb_publishable_Q2T6_DXRNRWCbGvJSd2qFg_UR8Lc_l-',  // publishable key — safe in public code
  table: 'enquiries'
};

/* ---- hero -------------------------------------------------------------- */
export const hero = {
  // the word inside *stars* is shown in the italic serif
  heading: 'Your whole product stack. *One* studio.',
  sub:     'Websites, AI agents and MVPs — designed, built and shipped on a fixed price and a fixed date.',
  primaryCta:   'Book a 20-minute call',
  secondaryCta: 'See everything we do',
  smallprint:   'Fixed price · fixed date · written down before you pay',
  facts: [
    { big: '7 days',  label: 'to a live website' },
    { big: '100%',    label: 'delivered on the promised date' },
    { big: '1 price', label: 'written down before you pay' }
  ]
};

/* ---- the 4 layers in the hero diagram ---------------------------------- */
export const layers = [
  { name: 'Interface',      color: '#BDB4A8', text: '**What your customers touch.** Fast, clear screens on every device — written and designed, not templated.' },
  { name: 'Agents',         color: '#8B8175', text: '**Software that does the work.** Automation that finishes the job inside your workflow, every day.' },
  { name: 'Data & logic',   color: '#57514A', text: '**Your rules and your records.** Connected properly to the tools you already pay for.' },
  { name: 'Infrastructure', color: '#1C1A17', text: '**Hosting, monitoring and security.** Tested before launch, boring on purpose, and it stays up.' }
];

/* ---- the delivery pipeline diagram ------------------------------------- */
export const pipeline = {
  heading: 'Everything that comes in *leaves* as something shipped.',
  sub:     'One flow, three stages, a date on every outcome.',
  leftLabel: 'Unbuilt', middleLabel: 'Stark Lab', rightLabel: 'Shipped',
  coreNote: 'Fixed price · fixed date',
  inputs:  ['An idea in a doc', 'A design file', 'A stalled backlog', "A site converting 0%"],
  stages:  ['Scope', 'Build', 'Ship'],
  outputs: [
    { name: 'A site that sells',        day: 'DAY 7'  },
    { name: 'An agent doing the work',  day: 'DAY 14' },
    { name: 'An MVP with real users',   day: 'DAY 28' }
  ],
  stats: [
    { value: 24,  suffix: '',  label: 'Projects shipped'  },
    { value: 100, suffix: '%', label: 'Delivered on date', accent: true },
    { value: 11,  suffix: '',  label: 'Avg. days to live' }
  ]
};

/* ---- the 3 big cards --------------------------------------------------- */
export const mainServices = {
  heading: 'Three things most people *start* with.',
  sub:     'Services we deliver for you. Every other service is in the list below.',
  items: [
    { tag: 'Launch',      name: 'Website',   price: '$599',   days: 'Day 7',  timeline: '7 days',
      blurb: 'A site that sells — written, designed, built and live on your domain.',
      points: ['Copy and design included', 'Analytics and forms wired', 'You can edit it after'] },

    { tag: 'Most booked', name: 'AI agent',  price: '$899',   days: 'Day 14', timeline: '14 days', featured: true,
      blurb: 'Software doing a real job inside your workflow, every single day.',
      points: ['Connected to your tools', 'Guardrails and full logging', 'Handover and training'] },

    { tag: 'Full build',  name: 'MVP build', price: '$2,999', days: 'Day 28', timeline: '28 days',
      blurb: 'Auth, payments, admin — a product real people can use and pay for.',
      points: ['Full stack, in your repo', 'Payments and accounts', 'Ready for first users'] }
  ]
};

/* ---- your own product (the menu pop-up) -------------------------------- */
export const ownProduct = {
  menuLabel: 'Product',
  title:     'Upcoming.',
  body:      'We’re building a product of our own — an app, with more to follow. It isn’t client work and it isn’t for sale yet.',
  note:      'Everything else on this site is a **service**: we build it for you, on a fixed price and a fixed date.',
  cta:       'Tell me when it launches'
};

/* ==========================================================================
   THE FULL SERVICE CATALOGUE
   --------------------------------------------------------------------------
   To ADD a service   : copy a { } line and change it
   To REMOVE a service: delete its { } line
   To ADD a category  : copy a whole { name … items:[ ] } block
   To REORDER         : move the blocks around — the site follows this order

   name  = what it is        get  = exactly what the client receives
   price = what you charge   days = how long it takes
   offer = optional badge    (delete the line if there is no offer)
   ========================================================================== */
export const catalogue = [
  { name: 'Websites', tagline: 'Sites that sell, not brochures.', items: [
    { name: 'Landing page',           desc: 'One page, one goal, written and built',        get: 'Live page + copy + source files + analytics', price: '$249',   days: '4 days',  offer: 'Copywriting free' },
    { name: 'Business website',       desc: 'Five pages, CMS, contact forms, analytics',    get: 'Live site + CMS login + 5 pages + forms',      price: '$599',   days: '7 days',  offer: '1 month edits free' },
    { name: 'Framer / Webflow build', desc: 'Built so you can edit it yourself afterwards', get: 'Live site + editor access + 30-min training',  price: '$749',   days: '10 days' },
    { name: 'E-commerce store',       desc: 'Catalogue, cart, checkout and payments live',  get: 'Store + payment gateway + 20 products loaded', price: '$1,199', days: '14 days' },
    { name: 'Website redesign',       desc: 'Same content, far better numbers',             get: 'New site + speed report + before/after metrics',price: '$649',   days: '10 days', offer: 'Speed audit free' }
  ]},

  { name: 'UI / UX design', tagline: 'Screens people understand in one look.', items: [
    { name: 'UX audit',               desc: 'Where users drop off, and exactly why',        get: 'PDF report + scored issue list + ranked fixes', price: '$149',   days: '2 days',  offer: 'Free if you book a build' },
    { name: 'Landing page design',    desc: 'Design only, ready for any developer',         get: 'Figma file + desktop and mobile + assets',      price: '$199',   days: '3 days' },
    { name: 'Clickable prototype',    desc: 'Test it with users before you build it',       get: 'Figma prototype link + flows + notes',          price: '$399',   days: '5 days' },
    { name: 'Product UI — 10 screens',desc: 'Full flows, real states, empty states',        get: 'Figma file + 10 screens + all states',         price: '$749',   days: '10 days' },
    { name: 'Design system',          desc: 'Components and tokens your team can reuse',    get: 'Figma library + tokens + written docs',        price: '$1,099', days: '14 days', offer: 'Dev handoff free' }
  ]},

  { name: 'AI agents', tagline: 'Software that does the job, every day.', items: [
    { name: 'Support agent',          desc: 'Answers your customers from your own docs',    get: 'Live agent + your docs indexed + chat widget',  price: '$899',   days: '10 days' },
    { name: 'Sales & lead agent',     desc: 'Qualifies, replies and books the call',        get: 'Agent + CRM connection + booking link',         price: '$1,149', days: '12 days' },
    { name: 'Internal ops agent',     desc: 'Runs the repetitive work your team hates',     get: 'Agent + tool connections + admin dashboard',    price: '$1,499', days: '14 days', offer: '2 weeks tuning free' },
    { name: 'Knowledge assistant',    desc: 'Your documents, searchable and cited (RAG)',   get: 'Search app + vector database + citations',      price: '$1,799', days: '14 days' },
    { name: 'Agent care plan',        desc: 'Monitoring, tuning and fixes each month',      get: 'Uptime monitoring + monthly report + fixes',    price: '$199',   days: 'per month' }
  ]},

  { name: 'MVP & software', tagline: 'A real product people can use.', items: [
    { name: 'Idea to clickable MVP',  desc: 'Prove it works before you spend on code',      get: 'Prototype link + user test notes + build plan', price: '$1,299', days: '12 days' },
    { name: 'Web app MVP',            desc: 'Accounts, database, admin panel, deployed',    get: 'Live app + your repo + admin + docs',           price: '$2,999', days: '21 days' },
    { name: 'Mobile app MVP',         desc: 'iOS and Android from one codebase',            get: 'Both builds + store-ready files + repo',        price: '$3,999', days: '28 days' },
    { name: 'Full product MVP',       desc: 'Payments, roles, analytics, ready for users',  get: 'Live product + payments + analytics + handover',price: '$4,999', days: '28 days', offer: '30 days support free' }
  ]},

  { name: '3D CAD & simulation', tagline: 'Engineering-grade CAD, simulated before it is cut.', items: [
    { name: '3D CAD part model',      desc: 'Parametric part modelled in Fusion 360',       get: 'F3D + STEP + STL files, fully editable',        price: '$99',    days: '3 days' },
    { name: 'Product assembly design',desc: 'Multi-part assembly with joints and fits',     get: 'Assembly file + exploded view + BOM',           price: '$349',   days: '7 days' },
    { name: 'FEA stress simulation',  desc: 'Static stress study in Fusion 360',            get: 'Simulation report + safety factor + weak points',price:'$249',   days: '5 days',  offer: 'One design revision free' },
    { name: 'Thermal & motion study', desc: 'Heat or moving-part behaviour, simulated',     get: 'Study results + result video + written findings',price:'$299',   days: '6 days' },
    { name: 'Manufacturing drawings', desc: 'Drawings a workshop can actually build from',  get: '2D drawings (PDF + DWG), tolerances and GD&T',  price: '$149',   days: '4 days' },
    { name: '3D print & CNC prep',    desc: 'Files checked and prepared for the machine',   get: 'Print-ready STL / CNC toolpaths + wall report', price: '$89',    days: '3 days' },
    { name: 'Photoreal product render',desc:'Studio images of the part before it exists',   get: '6 render images + 360 turntable video',         price: '$199',   days: '4 days' }
  ]},

  { name: '3D & motion', tagline: 'The bit that makes people stop scrolling.', items: [
    { name: 'Hero 3D animation',      desc: 'One scene, built for your website header',     get: 'Web-optimised 3D scene + source file',          price: '$299',   days: '5 days' },
    { name: 'Product explainer film', desc: 'Sixty seconds, script to final cut',           get: '60s video (4K + social crops) + script',        price: '$499',   days: '8 days' },
    { name: 'Motion brand kit',       desc: 'Logo animation, transitions, social templates',get: 'Animated logo + 6 templates + source files',    price: '$599',   days: '10 days' }
  ]},

  { name: 'Security', tagline: 'Found by us, not by someone else.', items: [
    { name: 'Cloud config audit',     desc: 'The misconfigurations that leak data',         get: 'Findings report + fix list ranked by risk',     price: '$399',   days: '4 days' },
    { name: 'API security review',    desc: 'Auth, rate limits and data exposure',          get: 'Report + proof-of-concept + fixes',             price: '$499',   days: '5 days' },
    { name: 'Web app pen test',       desc: 'A report you can forward to a client',         get: 'Pen-test report + severity ratings + retest',   price: '$699',   days: '7 days',  offer: 'Free retest after fixes' }
  ]},

  { name: 'AI consulting', tagline: 'Where AI belongs — and where it does not.', items: [
    { name: 'AI opportunity audit',   desc: 'A scored list of what is worth doing',         get: 'Scored opportunity list + effort vs value map', price: '$499',   days: '5 days' },
    { name: 'AI roadmap',             desc: 'Twelve months, costed and sequenced',          get: 'Roadmap document + costs + hiring plan',        price: '$999',   days: '10 days' },
    { name: 'Transformation programme',desc:'Pilots, rollout and team training',            get: '3 pilots + rollout plan + team training',       price: '$2,499', days: '30 days', offer: 'Team workshop free' },
    { name: 'Fractional CTO',         desc: 'Us in your weekly leadership call',            get: 'Weekly call + architecture reviews + hiring',   price: '$899',   days: 'per month' }
  ]}
];

/* ---- process ----------------------------------------------------------- */
export const process = {
  heading: 'Three steps. *Nothing* hidden in between.',
  steps: [
    { name: 'Brief', text: 'A 20-minute call. You leave with a price and a date.' },
    { name: 'Build', text: 'A live link from day two and a short video every day.' },
    { name: 'Live',  text: 'Shipped on the date. Everything transfers to you.' }
  ]
};

/* ---- contact ----------------------------------------------------------- */
export const contact = {
  heading: "Tell us the deadline. We’ll tell you *if* we can hit it.",
  sub:     'Twenty minutes, no deck. You leave with a price, a date and a plan — whether or not you hire us.',
  budgets: ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 and above', 'Not decided yet'],
  replyNote: 'We reply within one working day. No mailing list, no follow-up spam.'
};

/* ---- who you work for (the strip under the hero) ----------------------- */
export const builtFor = ['Founders', 'Agencies', 'Ops teams', 'Funded startups', 'Enterprise pilots'];

/* ---- menu -------------------------------------------------------------- */
export const menu = [
  { label: 'Services', href: '#services' },
  { label: 'Product',  action: 'product-modal' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Pricing',  href: '#catalogue' },
  { label: 'Process',  href: '#process' },
  { label: 'Contact',  href: '#contact' }
];

/* ---- colours ----------------------------------------------------------- */
export const theme = {
  page: '#FBFBF9', surface: '#F4F4F1', ink: '#0E0E0D',
  text: '#55534E', muted: '#918E88', line: '#EDEBE6', line2: '#DBD8D1',
  accent: '#E0670A', accentSoft: 'rgba(224,103,10,.13)', accentTint: '#FDEEDF'
};
