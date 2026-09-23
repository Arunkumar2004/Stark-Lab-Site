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
