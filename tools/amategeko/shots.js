// Captures marketing screenshots of the Amategeko web app (desktop and phone) with headless Edge over the DevTools protocol.
// usage: node tools/amategeko/shots.js <outdir>     (serve the site first: python -m http.server 4400)
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path'); const http = require('http');
const outDir = process.argv[2] || 'shots'; fs.mkdirSync(outDir, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:4400/amategeko/';
const CLOUD = path.join(__dirname, '..', '..', '..', 'Cloud Sync Server', 'content-theory');
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));

async function session(W, H, mobile, steps) {
  const port = 9400 + Math.floor(Math.random() * 90);
  const prof = path.join(outDir, '_prof' + port);
  const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 40; i++) { try { tabs = await get('http://127.0.0.1:' + port + '/json'); if (tabs.length) break; } catch (e) { /* wait */ } await sleep(300); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {}; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } });
  const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && r.result.result.value; };
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: mobile ? 2 : 1.5, mobile });
  await send('Page.navigate', { url: BASE }); await sleep(2500);
  // the full content, exactly as an unlocked browser would hold it
  const full = { version: 'shots', label: 'shots', bundle: {} };
  for (const n of ['questions', 'signs', 'glossary', 'lessons', 'gazette']) full.bundle[n] = JSON.parse(fs.readFileSync(path.join(CLOUD, n + '.json'), 'utf8'));
  await evalJs('localStorage.setItem("amg_code","SHOTS");localStorage.setItem("amg_full",' + JSON.stringify(JSON.stringify(full)) + ');1');
  await send('Page.navigate', { url: BASE + '?r=' + Date.now() }); await sleep(3000);
  await evalJs('(async()=>{S.lang="en";S.onboarded=true;await accRegister("0788123456","Aline Uwase","1234");S.currentPhone="0788123456";await persist();buildLang();enterApp();return 1})()'); await sleep(1500);
  for (const [name, js, wait] of steps) {
    if (js) { await evalJs(js); await sleep(wait || 1500); }
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(shot.result.data, 'base64')); console.log('saved', name);
  }
  ws.close(); proc.kill(); await sleep(1200); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) { /* ignore */ }
}

const nav = (k) => `go('${k}');1`;
const practiceSigns = "go('practice');setTimeout(()=>{[...document.querySelectorAll('.chip')].find(c=>/Road signs/i.test(c.innerText)).click()},900);1";
const answer = "document.querySelectorAll('.opt')[0].click();1";
(async () => {
  await session(1440, 900, false, [
    ['amg-d-home', null], ['amg-d-practice', practiceSigns, 2500], ['amg-d-answered', answer, 900],
    ['amg-d-signs', nav('signs'), 2500], ['amg-d-markings', nav('markings'), 2000], ['amg-d-glossary', nav('glossary'), 1500], ['amg-d-progress', nav('progress'), 1500],
  ]);
  await session(412, 860, true, [
    ['amg-m-home', null], ['amg-m-practice', practiceSigns, 2500], ['amg-m-answered', answer, 900], ['amg-m-signs', nav('signs'), 2500],
  ]);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
