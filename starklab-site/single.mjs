/* Makes ONE self-contained .html file you can just double-click — no server needed. */
import fs from 'fs'; import path from 'path';
const dist = 'dist', out = 'starklab-offline.html';
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
let css = 0, js = '';

html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="\.?\/?(assets\/[^"]+\.css)"[^>]*>/g, (m, f) => {
  css++; return '<style>' + fs.readFileSync(path.join(dist, f), 'utf8') + '</style>';
});
/* pull the script OUT of <head> — an inline classic script there would run
   before the page exists. It goes at the end of <body> instead.          */
html = html.replace(/<script[^>]*src="\.?\/?(assets\/[^"]+\.js)"[^>]*><\/script>/g, (m, f) => {
  js = fs.readFileSync(path.join(dist, f), 'utf8'); return '';
});
if (js) html = html.replace('</body>', '<script>' + js.replace(/<\/script>/gi, '<\\/script>') + '</script>\n</body>');

fs.writeFileSync(path.join(dist, out), html);
console.log(`inlined ${css} css + ${js ? 1 : 0} js -> ${dist}/${out}  ${Math.round(html.length/1024)} KB`);
