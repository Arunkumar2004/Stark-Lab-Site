# Stark Lab - website

Built with **Vite**. One config file controls all the content.

## Edit the website

Open `src/config.js`. Prices, services, text, contact details, menu items,
theme, and database settings are controlled there.

Run the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Build the production files:

```bash
npm run build
npm run preview
```

The build creates `dist/` and `dist/starklab-offline.html`.

## Deploy with GitHub and Vercel

GitHub stores the code and Vercel hosts the website. Vercel automatically
deploys again whenever you push a change to GitHub.

1. Create a new empty repository on GitHub.
2. Open PowerShell in this project folder and run:

```bash
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

3. Go to **vercel.com** -> **Add New** -> **Project**.
4. Import the GitHub repository.
5. Use these settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
6. Click **Deploy**.

Vercel provides a URL such as `your-project.vercel.app`. The Vercel Hobby
plan is free for personal/non-commercial use.

## Contact form

The contact form saves enquiries to the Supabase `enquiries` table. The table
needs these columns:

```text
id, name, email, service, budget, message, source, page, created_at
```

The website sends an email notification through Make.com when a new enquiry is
inserted. Never put a Supabase `service_role` key in frontend code; the
publishable key in `src/config.js` is intended for public use.

## Files

```text
src/config.js    <- website content and settings
src/render.js    <- build-time HTML generation
src/app.js       <- interactions and contact form
src/styles.css   <- styling
index.html       <- page template
public/          <- robots.txt and sitemap.xml
```

Stark Lab - stark.connect@gmail.com - +91 98426 66957

---

## Demos page and the agent API (added 6 Oct 2026)

`/demos` (source `demos.html`, `src/demos.js`, `src/demos.css`, content in `src/demo-data.js`) hosts five
self-initiated demo agents. The page uses the same stylesheet and nav as the home page.

| Piece | Where |
|---|---|
| Agent prompts and output schemas | `api/_agents.js` |
| `POST /api/agent` (Vercel function, calls Claude, strict JSON output) | `api/agent.js` |
| `/api/mcp` live MCP server over a demo order book | `api/mcp.js` |
| Test sets and sample inputs | `src/demo-data.js` |
| Scores shown on the page | `src/demo-scores.json` (written by `npm run eval:demos`) |

**Secrets.** Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. `.env` is git-ignored. On Vercel, set the
same variable under Project -> Settings -> Environment Variables, then redeploy. Without it the agent endpoint
answers `503 NOT_CONFIGURED` and the page shows "The demo key is not configured on this deployment yet." The MCP
server needs no key.

```bash
npm run dev          # Vite on :5173 plus the local /api server on :8787 (reads .env)
npm run eval:demos   # runs every test set against the live agents, writes src/demo-scores.json
npm run build        # builds index.html, work.html, demos.html and kits.html into dist/
```

Limits in the demo: 12 runs a minute per visitor, inputs under 12,000 characters, nothing is stored.

---

## Site map (7 Oct 2026)

| Page | Source | Purpose |
|---|---|---|
| `/` | `index.html`, `src/app.js`, `src/render.js`, `src/config.js` | Home: services, product, pipeline, catalogue, process, contact |
| `/work` | `work.html`, `src/work.js`, `src/samples/*.js` | Twenty explorable sample product UIs (contract: `src/samples/_contract.md`) |
| `/demos` | `demos.html`, `src/demos.js`, `src/demo-data.js`, `api/` | Nine live agents plus an MCP server |
| `/kits` | `kits.html`, `src/kits.js` | Productised Agent Kits with the 4-day install plan |

Shared chrome for sub-pages lives in `src/chrome.js` and `src/pages.css` (the Work · Demos · Kits switch). Content and prices live only in `src/config.js`.

### Checking a page without a browser

```bash
node scripts/page-check.mjs http://localhost:5173/demos --width 375 --shot shot.jpg
```

Prints JSON with console errors, exceptions, failed requests, horizontal overflow, dead anchors and broken
images; exit code 1 on any problem. Flags: `--width`, `--height`, `--full`, `--click "selector"`
(repeatable), `--wait ms`. Needs Chrome or Edge installed (or `CHROME_PATH`).
