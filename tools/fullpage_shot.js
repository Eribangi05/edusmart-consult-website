// usage: node tools/fullpage_shot.js <url> <out.png> [width] [height]
// Loads a page in headless Edge, scrolls through it to trigger lazy images, then captures the whole page.
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path'); const http = require('http');
const [, , url, out, W = '1280', H = '900'] = process.argv;
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
(async () => {
  const port = 9700 + Math.floor(Math.random() * 50);
  const prof = path.join(require('os').tmpdir(), 'fp' + Date.now());
  const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await get('http://127.0.0.1:' + port + '/json'); if (tabs.length) break; } catch (e) {} await sleep(300); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {}; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } });
  const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && r.result.result.value; };
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: +W < 700 });
  await send('Page.navigate', { url }); await sleep(2500);
  await evalJs("document.querySelector('[data-consent=essential]')&&document.querySelector('[data-consent=essential]').click(); document.documentElement.style.scrollBehavior='auto'; 1");
  // scroll through the page so lazy images and reveal-on-scroll blocks load
  const total = await evalJs('document.documentElement.scrollHeight');
  for (let y = 0; y < total; y += 500) { await evalJs('window.scrollTo(0,' + y + ');1'); await sleep(250); }
  await evalJs('window.scrollTo(0,0);1'); await sleep(800);
  const h = await evalJs('document.documentElement.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width: +W, height: h, deviceScaleFactor: 1, mobile: +W < 700 }); await sleep(800);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64')); console.log('saved', out, W + 'x' + h);
  ws.close(); proc.kill(); await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
