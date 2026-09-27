// Checks that the FMIS and Ikimina web apps install and open with no internet: registers the service worker, goes offline, reloads.
//   node tools/pwa_check.js        (serve the site first: python -m http.server 4310)
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path'); const http = require('http'); const os = require('os');
const BASE = process.env.BASE || 'http://localhost:4310/';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const port = 9895, prof = path.join(os.tmpdir(), 'pwacheck' + Date.now());
  const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 80; i++) { try { tabs = await get('http://127.0.0.1:' + port + '/json'); if (tabs.length) break; } catch (e) { /* wait */ } await sleep(300); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {}; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } });
  const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: '(async()=>{' + expr + '})()', awaitPromise: true, returnByValue: true }); return r.result.result && r.result.result.value; };
  await send('Page.enable'); await send('Network.enable');
  for (const app of ['fmis', 'ikimina']) {
    await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await send('Page.navigate', { url: BASE + app + '/?first=1' }); await sleep(2500);
    const reg = await ev("const r=await navigator.serviceWorker.ready;return JSON.stringify({scope:r.scope,active:!!r.active})");
    ok(reg && JSON.parse(reg).active, app + ': the service worker is installed and active');
    await sleep(1500);
    const n = await ev("const ks=await caches.keys();if(!ks.length)return 0;return (await (await caches.open(ks[0])).keys()).length");
    ok(n > 8, app + ': the app files are stored on the device (' + n + ' files)');
    const man = await ev("const m=await fetch('manifest.webmanifest').then(r=>r.json());return m.name+'|'+m.icons.length+'|'+m.display");
    ok(/standalone/.test(man || ''), app + ': the manifest makes it installable (' + man + ')');
    await send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await send('Page.navigate', { url: BASE + app + '/?offline=1' }); await sleep(2500);
    const txt = await ev("return document.body.innerText.slice(0,80)");
    ok(/Welcome|Ikimina|FMIS|Explore/.test(txt || ''), app + ': the app opens with no internet (' + String(txt).replace(/\n/g, ' ').slice(0, 40) + ')');
  }
  try { ws.close(); proc.kill(); } catch (e) { /* ignore */ }
  await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  console.log(fails ? fails + ' check(s) failed' : 'all checks passed'); process.exit(fails ? 1 : 0);
})();
