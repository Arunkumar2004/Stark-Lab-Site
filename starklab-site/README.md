# Stark Lab — website

Built with **Vite**. One config file controls all the content.

---

## Edit anything (prices, services, text, contact)

Open **`src/config.js`**. Everything is in there:

| What you want to change | Where in config.js |
|---|---|
| Any price | `catalogue` or `mainServices` |
| Add / remove a service | `catalogue` → copy or delete a `{ }` line |
| Add a whole category | `catalogue` → copy a whole `{ name … items:[] }` block |
| Rename a service | `catalogue` → change `name` |
| The 3 big cards | `mainServices` |
| Phone / email / hours | `business` |
| Headline and hero text | `hero` |
| The 4 layers in the diagram | `layers` |
| Pipeline labels and stats | `pipeline` |
| The Product pop-up | `ownProduct` |
| Menu items | `menu` |
| Colours | `theme` + the `:root` block in `src/styles.css` |
| Where the form saves | `database` |

Save the file — the page updates instantly while `npm run dev` is running.

---

## How to open it on your own computer

### Easiest — no tools needed
Open **`dist/starklab-offline.html`** by double-clicking it.
That one file contains the whole site and works offline.

> Do NOT double-click the `index.html` in the main folder.
> That one is a template full of placeholders — it will look broken.
> And `dist/index.html` needs a server, because browsers block
> JavaScript modules opened directly from your hard drive.

### Proper way — live editing
```bash
npm install     # once
npm run dev     # opens http://localhost:5173 — edits appear instantly
```

### Other commands
```bash
npm run build   # builds dist/ AND dist/starklab-offline.html
npm run preview # serves the built site so you can check it
```

### No Node installed? Any of these also work
```bash
npx serve dist            # needs Node
python -m http.server 8000 -d dist     # needs Python — then open localhost:8000
```
Or install the **Live Server** extension in VS Code, right-click `dist/index.html`
→ "Open with Live Server".

---

## Deploy to Vercel (free)

**Option A — drag and drop**
1. `npm run build`
2. Go to vercel.com → Add New → Project → deploy without Git
3. Drag the **`dist`** folder in

**Option B — GitHub (recommended, auto-deploys on every change)**
1. Push this folder to a GitHub repo
2. Vercel → Import that repo
3. Vercel detects Vite automatically. Build `npm run build`, output `dist`

---

## The contact form

Saves to Supabase. Settings are in `config.js` → `database`.

Your table must be called **`enquiries`** with these text columns:

```
name · email · service · budget · message · source · page
```

plus `created_at` (timestamptz, default `now()`).

Run this once in the Supabase SQL editor so the website can write to it:

```sql
alter table enquiries enable row level security;

create policy "website can submit"
on enquiries for insert
to anon
with check (true);
```

If saving ever fails, the form opens WhatsApp with the enquiry pre-typed,
so an enquiry is never lost.

---

## Files

```
src/config.js    ← EVERYTHING you edit lives here
src/render.js    builds the HTML from config at build time
src/app.js       menu, dropdowns, animations, form
src/styles.css   all styling (colours at the top)
index.html       page skeleton
public/          robots.txt, sitemap.xml
```

---

Stark Lab · stark.connect@gmail.com · +91 98426 66957
