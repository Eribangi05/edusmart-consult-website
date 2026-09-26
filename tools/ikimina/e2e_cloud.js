// End to end test of Ikimina cloud sync with three real browser profiles (President, Accountant, Member) against a local cloud server.
//   1. node scripts/dev-console.js         (in Cloud Sync Server, serves http://localhost:4300)
//   2. IKI_TEST_CLOUD=http://localhost:4300 python tools/ikimina/build.py ; python -m http.server 4310   (in the website folder)
//   3. node tools/ikimina/e2e_cloud.js
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path'); const http = require('http'); const os = require('os');
const BASE = process.env.BASE || 'http://localhost:4310/ikimina/index.html';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + (JSON.stringify(a) === JSON.stringify(b) ? '' : '  got ' + JSON.stringify(a) + ' expected ' + JSON.stringify(b)));

async function device(name, port) {
  const prof = path.join(os.tmpdir(), 'ikie2e-' + name + Date.now());
  const proc = spawn(edge, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let tabs; for (let i = 0; i < 80; i++) { try { tabs = await get('http://127.0.0.1:' + port + '/json'); if (tabs.length) break; } catch (e) { /* wait */ } await sleep(300); }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {}; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } });
  const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await Promise.race([send('Runtime.evaluate', { expression: '(async()=>{' + expr + '})()', awaitPromise: true, returnByValue: true }), new Promise((_, rej) => setTimeout(() => rej(new Error(name + ': timed out running ' + expr.slice(0, 90))), 90000))]); if (r.result.exceptionDetails) throw new Error(name + ': ' + JSON.stringify(r.result.exceptionDetails.exception && r.result.exceptionDetails.exception.description)); return r.result.result.value; };
  await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE }); await sleep(1800);
  await ev("localStorage.setItem('iki_cloud','http://localhost:4300');localStorage.setItem('iki-web-note','1');return 1");
  await send('Page.navigate', { url: BASE + '?r=' + Date.now() }); await sleep(1800);
  return { name, ev, send, close: async () => { try { ws.close(); proc.kill(); } catch (e) { /* ignore */ } await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) { /* ignore */ } } };
}
const wait = (ms) => sleep(ms);

(async () => {
  const P = await device('president', 9811), A = await device('accountant', 9812), M = await device('member', 9813);
  try {
    // ---- President: a real group with data, cloud account, cloud group, two invitation codes
    await P.ev("DB=await buildDemo();DB.demo=false;DB.members[0].phone='0788600001';DB.members[1].phone='0788600002';DB.members[2].phone='0788600003';migrate();Store.save(DB);applyPrefs();loginScreen();await new Promise(r=>setTimeout(r,400));ACT.pickUser({id:'m1'});['1','2','3','4'].forEach(k=>ACT.key({k}));await new Promise(r=>setTimeout(r,1500));ACT.go({r:'settings'});await new Promise(r=>setTimeout(r,400));return 1");
    await P.ev("document.getElementById('cloudPin').value='1234';document.querySelector('[data-act=cloudCreate]').click();await new Promise(r=>setTimeout(r,2500));return 1");
    ok(await P.ev("return !!(DB.cloud&&DB.cloud.token)"), 'President created a cloud account from Settings');
    await P.ev("document.querySelector('[data-act=cloudEnable]').click();await new Promise(r=>setTimeout(r,6000));return 1");
    const pInfo = JSON.parse(await P.ev("return JSON.stringify({linked:!!DB.cloud.groupId,cash:S.cash(),contribs:DB.contributions.length,name:DB.group.name})"));
    ok(pInfo.linked, 'President turned on cloud sync for the group');
    const codes = {};
    for (const [id, key] of [['m2', 'acc'], ['m3', 'mem'], ['m4', 'mem2']]) {
      codes[key] = await P.ev(`document.querySelector('[data-act=cloudInvite]').click();await new Promise(r=>setTimeout(r,400));document.querySelector('#modal-root select[name=id]').value='${id}';document.querySelector('#modal-root .btn.p').click();await new Promise(r=>setTimeout(r,2500));const m=(document.getElementById('modal-root').innerText.match(/IKM-[A-Z0-9]{4}-[A-Z0-9]{4}/)||[])[0];closeModal();return m`);
    }
    ok(/^IKM-/.test(codes.acc) && /^IKM-/.test(codes.mem), 'invitation codes were created through the invite screen');

    // ---- Accountant joins with a code on a brand new device
    const join = (dev, name, phone, pin, code) => dev.ev(`ACT.cloudJoin();await new Promise(r=>setTimeout(r,300));const f=document.getElementById('joinf');f.name.value='${name}';f.phone.value='${phone}';f.pin.value='${pin}';f.code.value='${code}';document.getElementById('joinGo').click();await new Promise(r=>setTimeout(r,7000));return JSON.stringify({role:SESSION&&SESSION.role,name:SESSION&&SESSION.name,group:DB.group.name,amount:DB.group.amount,members:DB.members.length,contribs:DB.contributions.length,loans:DB.loans.length,cash:typeof S.cash==='function'?S.cash():null,err:(document.getElementById('joinErr')||{}).textContent||''})`);
    const a = JSON.parse(await join(A, 'Niyonzima Jean Claude', '0788 600 002', '4321', codes.acc));
    eq([a.role, a.group, a.amount, a.members, a.contribs], ['ACCOUNTANT', pInfo.name, 20000, 13, pInfo.contribs], 'Accountant joined, is signed in as Accountant, and received the whole group');
    eq(a.cash, pInfo.cash, "Accountant's cash in hand equals the President's");
    const pGroup = JSON.parse(await P.ev("await Cloud.syncNow();return JSON.stringify({name:DB.group.name,amount:DB.group.amount})"));
    eq(pGroup, { name: pInfo.name, amount: 20000 }, "a new device's empty defaults did not overwrite the group settings");
    ok(await A.ev("return (await hashPin('4321',DB.members.find(m=>m.id==='m2').salt))===DB.members.find(m=>m.id==='m2').pinHash"), "the Accountant's cloud PIN became the PIN inside the group");

    // ---- Accountant records a payment; the President receives it
    await A.ev("DB.seq.rc++;const c={id:uid(),memberId:'m4',amount:20000,date:Date.now(),period:curPeriod(),method:'CASH',ref:'',note:'',by:who(),receiptNo:'RC-'+String(DB.seq.rc).padStart(5,'0')};DB.contributions.push(c);audit('Contribution recorded','test');commit();await new Promise(r=>setTimeout(r,6500));return 1");
    const p2 = JSON.parse(await P.ev("await Cloud.syncNow();return JSON.stringify({contribs:DB.contributions.length,cash:S.cash(),rc:DB.seq.rc})"));
    eq(p2.contribs, pInfo.contribs + 1, "the Accountant's payment reached the President");
    eq(p2.cash, pInfo.cash + 20000, "the President's cash in hand went up by the payment");
    eq(p2.rc, 1, 'the receipt counter on the President device continued from the receipt the Accountant issued');

    // ---- Member joins, sees only their own things
    const m = JSON.parse(await join(M, 'Mukamana Alice', '0788600003', '2468', codes.mem));
    eq(m.role, 'MEMBER', 'Member joined and is signed in as Member');
    const mv = JSON.parse(await M.ev("return JSON.stringify({own:DB.contributions.every(c=>c.memberId==='m3'),n:DB.contributions.length,loansOwn:DB.loans.every(l=>l.memberId==='m3'),expenses:DB.expenses.length,income:DB.income.length,auditFromGroup:DB.audit.filter(a=>a.by!=='Mukamana Alice').length,payouts:DB.payouts.every(p=>p.memberId==='m3'),other:DB.members.find(x=>x.id==='m4'),self:DB.members.find(x=>x.id==='m3').pinHash!==undefined,ann:DB.announcements.length,meet:DB.meetings.length,reqOwn:DB.requests.every(r=>r.memberId==='m3')})"));
    ok(mv.own && mv.n > 0 && mv.n < 20, 'the Member holds only their own contributions (' + mv.n + ')');
    ok(mv.loansOwn && mv.expenses === 0 && mv.income === 0 && mv.auditFromGroup === 0 && mv.payouts && mv.reqOwn, "the Member does not hold others' loans, the cashbook, the group's audit trail, others' payouts or requests " + JSON.stringify(mv));
    ok(mv.other && mv.other.pinHash === undefined && mv.other.phone === undefined && mv.other.idNumber === undefined && mv.other.name, "another member's private details are not sent to the Member");
    ok(mv.self && mv.ann >= 3 && mv.meet >= 1, 'the Member still sees the group announcements and meetings');

    // ---- A member request travels to the officers; a member cannot alter money records
    await M.ev("DB.requests.push({id:uid(),memberId:'m3',type:'LOAN',message:'School fees',amount:60000,n:3,status:'PENDING',at:Date.now()});commit();await new Promise(r=>setTimeout(r,6500));return 1");
    const pr = await P.ev("await Cloud.syncNow();return DB.requests.some(r=>r.message==='School fees'&&r.memberId==='m3')");
    ok(pr, "the Member's loan request reached the President");
    await M.ev("const c=DB.contributions[0];c.amount=1;commit();await new Promise(r=>setTimeout(r,6500));return 1");
    const stillOk = await P.ev("await Cloud.syncNow();const c=DB.contributions.find(x=>x.memberId==='m3');return c.amount>1");
    ok(stillOk, 'a Member editing a money record on their own device changes nothing for the group');

    // ---- Both officers edit at the same time (offline), both converge
    await A.ev("DB.announcements.push({id:'annA',title:'From Accountant',body:'x',pinned:false,at:Date.now(),by:'A'});commit();return 1");
    await P.ev("DB.announcements.push({id:'annP',title:'From President',body:'y',pinned:false,at:Date.now(),by:'P'});commit();return 1");
    await wait(6500); await A.ev("await Cloud.syncNow();return 1"); await P.ev("await Cloud.syncNow();return 1"); await A.ev("await Cloud.syncNow();return 1");
    const ids = async (d) => JSON.parse(await d.ev("return JSON.stringify(DB.announcements.map(a=>a.id).filter(i=>i==='annA'||i==='annP').sort())"));
    eq(await ids(A), ['annA', 'annP'], 'both offline announcements exist on the Accountant device');
    eq(await ids(P), ['annA', 'annP'], 'both offline announcements exist on the President device');

    // ---- A deleted record is deleted everywhere
    await P.ev("DB.announcements=DB.announcements.filter(a=>a.id!=='annA');commit();await new Promise(r=>setTimeout(r,6500));return 1");
    await A.ev("await Cloud.syncNow();return 1");
    eq(await ids(A), ['annP'], 'a record deleted by the President is deleted on the Accountant device');

    // ---- The President removes the Member's access; the member is cut off but keeps their copy
    await P.ev("ACT.cloudPeople();await new Promise(r=>setTimeout(r,1200));return 1");
    const people = await P.ev("return document.getElementById('modal-root').innerText");
    ok(/Mukamana Alice/.test(people) && /Niyonzima Jean Claude/.test(people), 'the President can see who has access');
    await P.ev("const b=[...document.querySelectorAll('[data-act=cloudRemove]')];const row=b.find(x=>x.closest('.row').innerText.includes('Mukamana'));row.click();await new Promise(r=>setTimeout(r,2500));closeModal();return 1");
    await M.ev("DB.requests.push({id:uid(),memberId:'m3',type:'ABSENT',message:'after removal',amount:0,n:0,status:'PENDING',at:Date.now()});await Cloud.syncNow();return 1");
    const cut = await P.ev("await Cloud.syncNow();return DB.requests.some(r=>r.message==='after removal')");
    ok(!cut, 'after being removed, the Member can no longer send anything to the group');
    ok(await M.ev("return DB.contributions.length>0"), "the removed Member's own copy of their records is still there");

    // ---- Backup files never contain the cloud sign-in
    const bk = await P.ev("let out='';const oc=URL.createObjectURL;URL.createObjectURL=(b)=>{b.text().then(t=>{window.__bk=t});return 'blob:x'};await ACT.backup();await new Promise(r=>setTimeout(r,400));URL.createObjectURL=oc;return window.__bk?window.__bk.includes('\"token\"'):'nodata'");
    ok(bk === false, 'a backup file does not contain the cloud sign-in token');
  } catch (e) { console.log('ERROR', e.message); fails++; }
  await P.close(); await A.close(); await M.close();
  console.log(fails ? fails + ' check(s) failed' : 'all checks passed');
  process.exit(fails ? 1 : 0);
})();
