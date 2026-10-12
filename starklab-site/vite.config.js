import { defineConfig } from 'vite';
import { renderAll } from './src/render.js';

/* Builds every data-driven section into the HTML at build time.
   Result: real static HTML — best possible speed and SEO. */
function prerender() {
  return {
    name: 'starklab-prerender',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const sub = !/(^|[\/])index\.html$/.test(ctx.filename || ctx.path || '');
        const parts = renderAll(sub ? '/' : '');
        return html.replace(/<!--\s*@(\w+)\s*-->/g, (m, key) => parts[key] ?? m);
      }
    }
  };
}

/* Vercel serves /work, /demos and /kits through cleanUrls; mirror that in dev. */
function cleanUrls() {
  return {
    name: 'starklab-clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const m = (req.url || '').match(/^\/(work|demos|kits)(\?.*)?$/);
        if (m) req.url = `/${m[1]}.html${m[2] || ''}`;
        next();
      });
    }
  };
}

export default defineConfig({
  base: './',   // so dist/index.html also works by double-clicking
  plugins: [cleanUrls(), prerender()],
  server: { proxy: { '/api': 'http://localhost:8787' } },
  build: {
    target: 'es2019',
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: { main: 'index.html', work: 'work.html', demos: 'demos.html', kits: 'kits.html' },
      output: { assetFileNames: 'assets/[name]-[hash][extname]' }
    }
  }
});
