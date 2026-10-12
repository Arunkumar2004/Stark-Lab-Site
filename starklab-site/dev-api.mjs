/* Local stand-in for Vercel's /api functions. `npm run dev` starts this on
   port 8787 and Vite proxies /api to it. Reads backend secrets from .env. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const port = Number(process.env.API_PORT || 8787);
if (process.argv.includes('--with-vite')) {
  const { spawn } = await import('node:child_process');
  spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite'], { stdio: 'inherit', shell: process.platform === 'win32' });
}
http.createServer(async (req, res) => {
  const name = (req.url || '').split('?')[0].replace(/^\/api\//, '').replace(/\/$/, '');
  const file = path.join(root, 'api', `${name}.js`);
  if (!/^[a-z0-9-]+$/.test(name) || !fs.existsSync(file)) { res.statusCode = 404; return res.end('not found'); }
  try {
    const mod = await import(pathToFileURL(file).href);
    await mod.default(req, res);
  } catch (e) {
    console.error(e);
    res.statusCode = 500; res.end(JSON.stringify({ ok: false, error: String(e.message) }));
  }
}).listen(port, () => console.log(`api dev server on http://localhost:${port}  key:${process.env.ANTHROPIC_API_KEY ? 'set' : 'missing'}`));
