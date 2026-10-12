/* Headless page check over the Chrome DevTools Protocol. No dependencies.
   Loads a URL in headless Chrome at a given width, collects console errors,
   uncaught exceptions and failed requests, measures horizontal overflow,
   finds same-page anchors with no target, and can take a screenshot.

   node scripts/page-check.mjs <url> [--width 1440] [--height 900] [--dark]
        [--shot out.jpg] [--full] [--click "css selector"]... [--wait 1500]
   Exit code 1 when any error was captured or the page overflows. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--'));
if (!url) { console.error('usage: node scripts/page-check.mjs <url> [--width N] [--height N] [--dark] [--shot file] [--full] [--click sel] [--wait ms]'); process.exit(2); }
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i > -1 ? args[i + 1] : def; };
const width = Number(opt('width', 1440)), height = Number(opt('height', 900)), wait = Number(opt('wait', 1500));
const dark = args.includes('--dark'), full = args.includes('--full'), shot = opt('shot', null);
const clicks = args.flatMap((a, i) => (a === '--click' ? [args[i + 1]] : []));

const CHROME = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(p => fs.existsSync(p));
if (!CHROME) { console.error('No Chrome or Edge found. Set CHROME_PATH.'); process.exit(2); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'sl-check-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, `--window-size=${width},${height}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });

const wsUrl = await new Promise((resolve, reject) => {
  let buf = ''; const t = setTimeout(() => reject(new Error('Chrome did not start')), 15000);
  chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); resolve(m[1]); } });
  chrome.on('exit', () => reject(new Error('Chrome exited early')));
});

const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map(); const listeners = [];
ws.onmessage = ev => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
  else if (msg.method) listeners.forEach(l => l(msg));
};
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
const on = (method, fn) => listeners.push(m => { if (m.method === method) fn(m.params, m.sessionId); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: S } = await send('Target.attachToTarget', { targetId, flatten: true });
const errors = [], warnings = [], failed = [];
on('Runtime.consoleAPICalled', p => { const text = p.args.map(a => a.value ?? a.description ?? '').join(' '); if (p.type === 'error') errors.push(`console.error: ${text}`); else if (p.type === 'warning') warnings.push(`console.warn: ${text}`); });
on('Runtime.exceptionThrown', p => errors.push(`exception: ${p.exceptionDetails.exception?.description || p.exceptionDetails.text}`));
on('Log.entryAdded', p => { if (p.entry.level === 'error') errors.push(`${p.entry.source}: ${p.entry.text}${p.entry.url ? ' ' + p.entry.url : ''}`); });
on('Network.loadingFailed', p => failed.push(p.errorText));
on('Network.responseReceived', p => { if (p.response.status >= 400) failed.push(`${p.response.status} ${p.response.url}`); });

await send('Page.enable', {}, S); await send('Runtime.enable', {}, S); await send('Log.enable', {}, S); await send('Network.enable', {}, S);
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 }, S);
const loaded = () => new Promise(r => { const off = listeners.push(m => { if (m.method === 'Page.loadEventFired' && m.sessionId === S) { listeners.splice(off - 1, 1); r(); } }); });
let ld = loaded(); await send('Page.navigate', { url }, S); await ld;
if (dark) { await send('Runtime.evaluate', { expression: "localStorage.setItem('starklab-theme','dark')" }, S); ld = loaded(); await send('Page.reload', {}, S); await ld; }
await sleep(wait);
const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, S)).result.value;
for (const sel of clicks) {
  const ok = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return false; el.click(); return true; })()`);
  if (!ok) errors.push(`click target not found: ${sel}`);
  await sleep(600);
}
const metrics = await evaluate(`(() => {
  const de = document.documentElement, iw = innerWidth;
  const over = []; for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); const inScroller = (() => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true; } return false; })();
    if (r.width && r.right > iw + 1 && getComputedStyle(el).position !== 'fixed' && !inScroller) { over.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : '') + ' right=' + Math.round(r.right)); if (over.length >= 8) break; } }
  const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
  const deadAnchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !ids.has(h.slice(1)));
  const imgs = [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src);
  return { title: document.title, h1: document.querySelector('h1')?.textContent.trim().slice(0,80) || null, innerWidth: iw, scrollWidth: de.scrollWidth, scrollHeight: de.scrollHeight,
    overflow: de.scrollWidth > iw + 1, overflowing: over, deadAnchors: [...new Set(deadAnchors)], brokenImages: imgs, dark: document.body.classList.contains('dark') };
})()`);
if (shot) {
  const params = { format: 'jpeg', quality: 70 };
  if (full) { params.captureBeyondViewport = true; params.clip = { x: 0, y: 0, width, height: Math.min(metrics.scrollHeight, 12000), scale: 1 }; }
  const { data } = await send('Page.captureScreenshot', params, S);
  fs.writeFileSync(shot, Buffer.from(data, 'base64'));
}
const result = { url, width, dark, ...metrics, errors, warnings, failedRequests: [...new Set(failed)], screenshot: shot || null };
console.log(JSON.stringify(result, null, 2));
try { ws.close(); } catch {}
chrome.kill();
await sleep(200);
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(errors.length || metrics.overflow || failed.length ? 1 : 0);
