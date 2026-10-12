# Sample UI contract (the Work page, `/work`)

Each file in `src/samples/NN-slug.js` is one explorable product UI. The Work page loads them with
`import.meta.glob('./samples/*.js')`, so a missing file is simply absent; a broken file breaks the page.

```js
export default {
  id: 'NN-slug',                  // same as the file name without .js
  name: 'Fleet dispatch board',   // 2-4 words, Title case first word only
  category: 'Operations',         // one of: SaaS, Operations, Commerce, Finance, Health, Education, Field, Internal tools, Mobile, AI
  sector: 'Logistics',            // free text, one or two words
  blurb: 'One sentence on what the screen is for and who uses it.',
  device: 'desktop',              // 'desktop' (1280x800 frame) or 'phone' (390x844 frame)
  accent: '#1C6DD0',              // one brand colour for the gallery tile
  tags: ['dashboard', 'map', 'live status'],
  render(root) { ... }            // builds the UI inside `root` (an empty <div>); may return a cleanup function
};
```

Rules

1. **Self-contained.** Vanilla DOM and inline SVG only. No external scripts, fonts or images. Data is synthetic and
   written in the file. Company and people names are clearly fictional ("Meridian Components", "A. Rao").
2. **Scoped styles.** Every class starts with `s-NN-` (for example `s-07-`). Inject one `<style>` element into
   `root` from `render`; never touch `document.head` or global selectors. The root is `position:relative;
   width:100%; height:100%; overflow:hidden` and the sample fills it (use `height:100%`, flex or grid).
3. **Interactive.** At least three things respond: tabs or filters, a toggle or form control, a hover or click
   that changes state, a chart that updates. Keep it believable, not a slideshow.
4. **Looks finished.** Real product typography (system-ui stack is fine inside the frame), consistent spacing,
   empty states where it makes sense, numbers formatted properly (en-IN for INR, en-US for USD).
5. **Text.** British English, no emoji, no placeholder "Lorem ipsum", no "signed / sealed / tamper-proof /
   court-ready" claims.
6. **Size.** 150-350 lines per file. Prefer fewer, well-built screens over sprawling ones.
7. **Cleanup.** If you start timers, return a function that clears them.

Registry of the twenty ids (owner in brackets):

| id | name | device | owner |
|---|---|---|---|
| 01-saas-analytics | SaaS analytics dashboard | desktop | A1 |
| 02-support-inbox | Support inbox with AI triage | desktop | A1 |
| 03-crm-pipeline | CRM pipeline board | desktop | A1 |
| 04-billing-portal | Subscription billing portal | desktop | A1 |
| 05-onboarding-wizard | Product onboarding wizard | desktop | A1 |
| 06-ecommerce-storefront | Storefront and cart | desktop | A1 |
| 07-fleet-dispatch | Fleet dispatch board | desktop | A1 |
| 08-clinic-scheduler | Clinic appointment scheduler | desktop | A1 |
| 09-lms-course | Course player and progress | desktop | A1 |
| 10-invoice-builder | Invoice builder with GST | desktop | A1 |
| 11-admin-console | Admin console with roles and audit | desktop | A2 |
| 12-kanban-sprint | Sprint board | desktop | A2 |
| 13-hr-portal | Leave and attendance portal | desktop | A2 |
| 14-restaurant-orders | Restaurant order screen | desktop | A2 |
| 15-property-listing | Property listing and enquiry | desktop | A2 |
| 16-ai-chat-approvals | AI assistant with approval cards | desktop | A2 |
| 17-fintech-wallet | Wallet and payments | phone | A2 |
| 18-field-inspection | Field inspection checklist | phone | A2 |
| 19-food-delivery | Delivery tracking | phone | A2 |
| 20-habit-health | Health and habit tracker | phone | A2 |
