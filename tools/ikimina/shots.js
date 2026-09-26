// Captures screenshots of the Ikimina web app (desktop and phone) with headless Edge. usage: node tools/ikimina/shots.js <outdir>   (serve the site first: python -m http.server 4310)
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path'); const http = require('http');
const outDir = process.argv[2] || 'shots'; fs.mkdirSync(outDir, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:4310/ikimina/index.html';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
async function session(W, H, mobile, user, steps) {
  const port = 9500 + Math.floor(Math.random() * 480); const prof = path.join(outDir, '_prof' + port);
  const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 80; i++) { try { tabs = await get('http://127.0.0.1:' + port + '/json'); if (tabs.length) break; } catch (e) {} await sleep(300); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {}; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } });
  const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && (r.result.result.value !== undefined ? r.result.result.value : r.result.exceptionDetails ? 'ERR ' + JSON.stringify(r.result.exceptionDetails.exception && r.result.exceptionDetails.exception.description) : undefined); };
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: mobile ? 2 : 1.5, mobile });
  await send('Page.navigate', { url: BASE }); await sleep(2000);
  await evalJs('localStorage.setItem("iki-web-note","1");1');
  await send('Page.navigate', { url: BASE + '?r=' + Date.now() }); await sleep(2000);
  const lg = await evalJs(`(async()=>{await ACT.startDemo();await new Promise(r=>setTimeout(r,800));ACT.pickUser({id:'${user}'});['1','2','3','4'].forEach(k=>ACT.key({k}));await new Promise(r=>setTimeout(r,1500));return document.querySelector('#ttl')?'ok':'NOLOGIN '+document.body.innerText.slice(0,80)})()`); console.log('login', lg); await sleep(500);
  for (const [name, js, wait] of steps) {
    if (js) { const r = await evalJs(js); if (typeof r === 'string' && r.startsWith('ERR')) console.log(name, r); await sleep(wait || 1400); }
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(shot.result.data, 'base64')); console.log('saved', name);
  }
  ws.close(); proc.kill(); await sleep(1200); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
}
const go = (r) => `ACT.go({r:'${r}'});1`;
(async () => {
  const M = process.argv[3] || 'all';
  if (M === 'all' || M === 'd') await session(1440, 900, false, 'm1', [
    ['iki-d-dashboard', null, 2200], ['iki-d-members', go('members')], ['iki-d-contrib', go('contributions')], ['iki-d-loans', go('loans')],
    ['iki-d-analytics', go('analytics'), 2000], ['iki-d-rotation', go('rotation')], ['iki-d-finance', go('finance')], ['iki-d-reports', go('reports')], ['iki-d-requests', go('requests')],
  ]);
  if (M === 'all' || M === 'p') await session(412, 860, true, 'm1', [['iki-m-dashboard', null, 2200], ['iki-m-loans', go('loans')], ['iki-m-members', go('members')], ['iki-m-menu', "document.body.classList.add('wb-open');1", 800]]);
  if (M === 'all' || M === 'q') await session(412, 860, true, 'm3', [['iki-m-member', null, 2200], ['iki-m-mysavings', go('mysavings')]]);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
