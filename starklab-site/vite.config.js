import { defineConfig } from 'vite';
import { renderAll } from './src/render.js';

/* Builds every data-driven section into the HTML at build time.
   Result: real static HTML — best possible speed and SEO. */
function prerender() {
  return {
    name: 'starklab-prerender',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const parts = renderAll();
        return html.replace(/<!--\s*@(\w+)\s*-->/g, (m, key) => parts[key] ?? m);
      }
    }
  };
}

export default defineConfig({
  base: './',   // so dist/index.html also works by double-clicking
  plugins: [prerender()],
  build: {
    target: 'es2019',
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: { output: { assetFileNames: 'assets/[name]-[hash][extname]' } }
  }
});
