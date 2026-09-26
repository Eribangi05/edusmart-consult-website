// Headless-Edge crawl: loads every html page, collects console errors and failed requests.
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path'); const http = require('http');
const BASE = process.env.BASE || 'http://localhost:4400/';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));

const pages = fs.readdirSync('.').filter((f) => f.endsWith('.html'));

(async () => {
  const port = 9500;
  const prof = path.join(require('os').tmpdir(), 'crawlprof' + Date.now());
  const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await get('http://127.0.0.1:' + port + '/json'); if (tabs.length) break; } catch (e) {} await sleep(300); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {};
  const results = [];
  let cur = null;
  ws.addEventListener('message', (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; return; }
    if (!cur) return;
    if (d.method === 'Console.messageAdded' && d.params.message.level === 'error') cur.errors.push(d.params.message.text.slice(0, 200));
    if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') cur.errors.push((d.params.entry.text || '').slice(0, 200));
    if (d.method === 'Network.responseReceived' && d.params.response.status >= 400 && d.params.response.url.startsWith(BASE)) cur.failed.push(d.params.response.status + ' ' + d.params.response.url.replace(BASE, ''));
  });
  const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && r.result.result.value; };
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
  for (const p of pages) {
    cur = { page: p, errors: [], failed: [] };
    await send('Page.navigate', { url: BASE + p }); await sleep(1200);
    await evalJs("document.querySelector('[data-consent=essential]')?.click(); 1");
    results.push(cur);
  }
  ws.close(); proc.kill(); await sleep(500); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
  let bad = 0;
  for (const r of results) {
    if (r.errors.length || r.failed.length) {
      bad++;
      console.log('== ' + r.page);
      r.failed.forEach((f) => console.log('  request: ' + f));
      r.errors.forEach((e) => console.log('  console: ' + e));
    }
  }
  console.log(bad ? `${bad} page(s) with issues, out of ${results.length}` : `all ${results.length} pages clean`);
})().catch((e) => { console.error(e); process.exit(1); });
