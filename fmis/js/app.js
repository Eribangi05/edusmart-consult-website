/* ===== FMIS app: boot, sign-in, navigation and the shell ===== */
'use strict';
let ROUTE = 'dashboard', PICK = null, PIN = '', TRIES = {}, LOCK = 0;

const NAV = {
  ADMIN: [['overview', ['dashboard', '🏠'], ['map', '🗺️'], ['performance', '🏆']], ['field', ['projects', '📁'], ['tasks', '✅'], ['forms', '📝'], ['submissions', '📥'], ['attendance', '📍']], ['team', ['team', '👥'], ['messages', '💬'], ['certificates', '🎓'], ['library', '📚']], ['admin', ['reports', '📊'], ['audit', '🛡️'], ['settings', '⚙️']]],
  SUPERVISOR: [['overview', ['dashboard', '🏠'], ['map', '🗺️'], ['performance', '🏆']], ['field', ['tasks', '✅'], ['forms', '📝'], ['submissions', '📥'], ['attendance', '📍']], ['team', ['team', '👥'], ['messages', '💬'], ['library', '📚']], ['admin', ['reports', '📊'], ['settings', '⚙️']]],
  AGENT: [['field', ['dashboard', '🏠'], ['collect', '✍️'], ['submissions', '📥'], ['tasks', '✅'], ['attendance', '📍']], ['team', ['messages', '💬'], ['reports', '📊'], ['library', '📚'], ['profile', '👤']]],
  VIEWER: [['overview', ['dashboard', '🏠'], ['projects', '📁'], ['tasks', '✅'], ['submissions', '📥'], ['map', '🗺️']], ['team', ['library', '📚'], ['reports', '📊'], ['profile', '👤']]],
};
NAV.MANAGER = NAV.ADMIN;
const BOTTOM = { ADMIN: ['dashboard', 'projects', 'tasks', 'submissions', 'messages'], MANAGER: ['dashboard', 'projects', 'tasks', 'submissions', 'messages'], SUPERVISOR: ['dashboard', 'tasks', 'submissions', 'attendance', 'messages'], AGENT: ['dashboard', 'collect', 'tasks', 'attendance', 'messages'], VIEWER: ['dashboard', 'projects', 'submissions', 'map', 'library'] };
const ICONS = Object.fromEntries(Object.values(NAV).flat().flatMap((s) => s.slice(1)).map(([r, i]) => [r, i]));
const routeAllowed = (r) => NAV[role()].some(([, ...items]) => items.some(([k]) => k === r)) || r === 'profile';

/* ---------- boot ---------- */
async function boot() {
  DB = await Store.load();
  if (!DB) { welcome(); return; }
  migrate(); applyPrefs(); if (window.Cloud) Cloud.start(); loginScreen();
}
function applyPrefs() { document.documentElement.dataset.theme = DB.prefs.theme || 'light'; LANG = DB.prefs.lang || 'en'; document.documentElement.lang = LANG; }

/* ---------- welcome, setup and demo ---------- */
function authLeft() {
  return `<div class="left"><div class="orb" style="width:260px;height:260px;top:-80px;right:-60px"></div><div class="orb" style="width:140px;height:140px;bottom:60px;left:-40px;animation-delay:-3s"></div>
  <div class="row"><img class="logo" src="assets/logo-96.png" alt="" width="52" height="52"><div><b style="font-size:22px">FMIS</b><div style="opacity:.75;font-size:12px">Field Management Information System</div></div></div>
  <h1>Collect. Manage.<br>Report. <span style="color:var(--amber)">In the field.</span></h1>
  <p>One workspace for your field team: forms and data collection, tasks, GPS check-ins, reports and messages. Works offline and syncs when you are back online.</p>
  <div class="feat"><div>📝 Forms with GPS and photos</div><div>✅ Tasks and follow-up</div><div>📍 Check-in and field map</div><div>💬 Reports and messages</div></div></div>`;
}
function welcome() {
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><div class="box">
    <h1 style="font-size:28px">Welcome 👋</h1><p class="muted" style="margin:8px 0 22px">Set up a workspace for your organisation, your project team, or just yourself.</p>
    <div class="ucard" data-act="startSetup"><span class="ue">🌱</span><div><b>Create a workspace</b><small>For an institution, a project or an individual</small></div></div>
    <div class="ucard" data-act="startDemo"><span class="ue">✨</span><div><b>Explore with demo data</b><small>A survey team with forms, tasks and field data</small></div></div>
    ${window.Cloud ? Cloud.welcomeCard() : ''}
    <div class="ucard" data-act="restoreBackup"><span class="ue">📥</span><div><b>Restore from backup</b><small>Import a .json backup file</small></div></div></div></div></div>`;
}
ACT.back0 = () => welcome();
ACT.startDemo = async () => { await buildDemo(); migrate(); Store.save(DB); applyPrefs(); toast('Demo workspace loaded. Every PIN is 1234.'); loginScreen(); };
ACT.restoreBackup = async () => {
  let txt = null;
  if (window.api && window.api.importFile) txt = await window.api.importFile(); else txt = await new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json'; i.onchange = () => (i.files[0] ? i.files[0].text().then(res) : res(null)); i.click(); });
  if (!txt) return;
  try { const d = JSON.parse(txt); if (!d.org || !d.members) throw 0; DB = d; migrate(); Store.save(DB); applyPrefs(); toast('Backup restored'); loginScreen(); } catch { toast('That file is not a valid FMIS backup.', true); }
};
ACT.startSetup = () => {
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><form class="box" id="setup"><h1 style="font-size:26px">Create your workspace</h1><p class="muted" style="margin:6px 0 16px">You can change everything later in Settings.</p>
   <h4>The organisation or project</h4>${F([{ name: 'oname', label: 'Name', required: true, full: true, placeholder: 'e.g. Northern Household Survey' }, { name: 'sector', label: 'Sector (optional)', placeholder: 'Health, education, research…' }, { name: 'country', label: 'Country', value: 'Rwanda' }])}
   <h4 style="margin-top:18px">You (the Admin)</h4>${F([{ name: 'name', label: 'Full name', required: true }, { name: 'phone', label: 'Phone', required: true, placeholder: '0788 123 456' }, { name: 'title', label: 'Your position (optional)' }, { name: 'pin', label: '4-digit PIN', type: 'password', required: true, placeholder: '••••' }])}
   <div class="row mt"><button type="button" class="btn" data-act="back0">← Back</button><span class="sp"></span><button class="btn p" type="submit">Create workspace →</button></div></form></div></div>`;
  $('#setup').onsubmit = async (e) => {
    e.preventDefault(); const v = Object.fromEntries(new FormData(e.target).entries());
    if (!/^\d{4}$/.test(v.pin)) return toast('The PIN must be exactly 4 digits.', true);
    await buildEmpty({ name: v.oname, sector: v.sector, country: v.country }, { name: v.name, phone: v.phone, pin: v.pin, title: v.title });
    migrate(); Store.save(DB); applyPrefs(); toast('Workspace created. Sign in to begin.'); loginScreen();
  };
};

/* ---------- sign-in ---------- */
function loginScreen() {
  SESSION = null; PICK = null; PIN = ''; closeModal();
  const users = DB.members.filter((m) => m.status !== 'INACTIVE' && m.pinHash).sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.name.localeCompare(b.name));
  const q = (VS.q.login || '').toLowerCase();
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><div class="box">
    <h1 style="font-size:26px">${esc(DB.org.name)}</h1><p class="muted" style="margin:4px 0 12px">Choose your profile to sign in</p>
    ${DB.demo ? '<div class="alert"><span>✨</span><span>Demo mode. Every PIN is <b>1234</b>.</span></div>' : ''}
    <input class="mt" data-filter="login" placeholder="Search your name…" value="${esc(VS.q.login || '')}" style="margin-bottom:12px" aria-label="Search your name">
    <div class="ulist">${users.filter((u) => u.name.toLowerCase().includes(q)).map((u) => `<div class="ucard" data-act="pickUser" data-id="${esc(u.id)}" tabindex="0" role="button">${avatar(u.name, 42)}<div class="sp"><b>${esc(u.name)}</b>${roleTag(u.role)}</div><span class="muted">→</span></div>`).join('') || empty('🔎', 'No one found')}</div>
    <div class="row mt"><button class="btn s" data-act="toggleTheme">🌓 Theme</button><span class="sp"></span><button class="btn s" data-act="langCycle">🌍 ${LANGS[LANG]}</button></div></div></div></div>`;
}
ACT.pickUser = ({ id }) => { PICK = S.member(id); PIN = ''; pinScreen(); };
function pinScreen(shake) {
  const u = PICK;
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><div class="box c">
   <div style="display:grid;place-items:center">${avatar(u.name, 76)}</div><h2 style="margin-top:12px">${esc(u.name)}</h2>${roleTag(u.role)}<p class="muted">Enter your 4-digit PIN</p>
   <div class="dots ${shake ? 'shake' : ''}" aria-live="polite">${[0, 1, 2, 3].map((i) => `<i class="${i < PIN.length ? 'on' : ''}"></i>`).join('')}</div>
   <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-act="key" data-k="${n}">${n}</button>`).join('')}<button type="button" data-act="pinBack">← Back</button><button type="button" data-act="key" data-k="0">0</button><button type="button" data-act="pinDel">⌫</button></div></div></div></div>`;
}
ACT.pinBack = () => loginScreen(); ACT.pinDel = () => { PIN = PIN.slice(0, -1); pinScreen(); };
ACT.key = ({ k }) => { if (PIN.length >= 4) return; PIN += k; pinScreen(); if (PIN.length === 4) setTimeout(tryLogin, 120); };
async function tryLogin() {
  const u = PICK; if (Date.now() < LOCK) { toast(`Too many attempts. Try again in ${Math.ceil((LOCK - Date.now()) / 1000)} s.`, true); PIN = ''; return pinScreen(true); }
  const ok = (await hashPin(PIN, u.salt)) === u.pinHash;
  if (!ok) { TRIES[u.id] = (TRIES[u.id] || 0) + 1; PIN = ''; if (TRIES[u.id] >= 5) { LOCK = Date.now() + 30000; TRIES[u.id] = 0; toast('Locked for 30 seconds.', true); } else toast('Wrong PIN', true); return pinScreen(true); }
  TRIES[u.id] = 0; SESSION = u; ROUTE = 'dashboard'; DB.prefs.lastUser = u.id; audit('Signed in', ROLES[u.role]); commit(); shell(); toast(`Welcome, ${u.name.split(' ')[0]}!`);
}
document.addEventListener('keydown', (e) => {
  if (PICK && !SESSION && /^\d$/.test(e.key)) ACT.key({ k: e.key }); else if (PICK && !SESSION && e.key === 'Backspace') ACT.pinDel(); else if (PICK && !SESSION && e.key === 'Escape') loginScreen();
  if (e.key === 'Escape') { closeModal(); const p = $('#pop'); if (p) p.remove(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.ucard[tabindex]')) { e.preventDefault(); e.target.click(); }
});
let idleT; function bumpIdle() { clearTimeout(idleT); if (SESSION) idleT = setTimeout(() => { toast('Locked after 15 minutes without use.'); loginScreen(); }, 900000); }
['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, bumpIdle));
ACT.signout = () => { audit('Signed out', ''); commit(); loginScreen(); };
ACT.toggleTheme = () => { DB.prefs.theme = DB.prefs.theme === 'dark' ? 'light' : 'dark'; applyPrefs(); Store.save(DB); };
ACT.langCycle = () => { const k = Object.keys(LANGS); DB.prefs.lang = k[(k.indexOf(LANG) + 1) % k.length]; applyPrefs(); Store.save(DB); if (SESSION) shell(); else if (PICK) pinScreen(); else loginScreen(); };

/* ---------- shell ---------- */
const readKey = (thread) => (SESSION ? SESSION.id : '') + '|' + thread;   // read marks are per person, because a shared device can have many people
function unreadCount() {
  if (!SESSION) return 0; let n = 0;
  for (const th of threadsFor()) n += DB.messages.filter((m) => m.thread === th.id && m.from !== SESSION.id && m.at > (DB.prefs.read[readKey(th.id)] || 0)).length;
  return n;
}
function pendingCount() {
  if (!SESSION) return 0;
  if (can.review()) return DB.submissions.filter((s) => s.status === 'SUBMITTED').length + DB.reports.filter((r) => r.status === 'SENT').length;
  return DB.submissions.filter((s) => s.memberId === SESSION.id && (s.status === 'RETURNED' || (s.status === 'REJECTED' && !s.seen))).length;
}
function shell() {
  const nav = NAV[role()].map(([sec, ...items]) => `<div class="sec">${t(sec)}</div>` + items.map(([r, ic]) => `<a data-act="go" data-r="${r}" class="${ROUTE === r ? 'on' : ''}" tabindex="0"><span class="ic">${ic}</span><span>${t(r)}</span>${badgeFor(r)}</a>`).join('')).join('');
  const nn = notifications().length;
  $('#app').innerHTML = `<div class="shell"><aside class="side" id="side"><div class="brand"><img class="logo" src="assets/logo-96.png" alt="" width="40" height="40"><div><b>FMIS</b><span>${esc(DB.org.name)}</span></div></div><nav class="nav" aria-label="Main">${nav}</nav>
    <div class="me"><span data-act="go" data-r="profile" style="cursor:pointer">${avatar(SESSION.name, 38)}</span><div data-act="go" data-r="profile" style="cursor:pointer;min-width:0"><b>${esc(SESSION.name.split(' ').slice(0, 2).join(' '))}</b><span>${esc(ROLES[role()])}</span></div><button class="iconbtn dark" title="${t('signout')}" data-act="signout" aria-label="${t('signout')}">⎋</button></div></aside><div class="scrim2" data-act="closeNav"></div>
    <section class="main"><div class="top"><button class="iconbtn menu" data-act="openNav" aria-label="Menu">☰</button><div class="tt"><h1 id="ttl"></h1><div class="sub" id="sub"></div></div><span class="sp"></span><span class="syncdot" id="syncdot" title="Sync status"></span>
    <button class="iconbtn" data-act="toggleTheme" title="Theme" aria-label="Theme">🌓</button><button class="iconbtn" data-act="bell" title="Notifications" aria-label="Notifications">🔔${nn ? `<span class="dot">${nn}</span>` : ''}</button></div>
    <div class="view" id="view" tabindex="-1"></div></section>
    <nav class="bottombar" aria-label="Quick">${BOTTOM[role()].map((r) => `<a data-act="go" data-r="${r}" class="${ROUTE === r ? 'on' : ''}" tabindex="0"><span class="ic">${ICONS[r] || '•'}</span><small>${t(r)}</small>${badgeFor(r)}</a>`).join('')}</nav></div>`;
  render(); bumpIdle(); if (window.Cloud) Cloud.paintDot();
}
function badgeFor(r) {
  if (r === 'messages') { const n = unreadCount(); return n ? `<span class="badge">${n}</span>` : ''; }
  if (r === 'submissions') { const n = pendingCount(); return n ? `<span class="badge">${n}</span>` : ''; }
  return '';
}
ACT.openNav = () => document.body.classList.add('nav-open'); ACT.closeNav = () => document.body.classList.remove('nav-open');
ACT.go = ({ r }) => { if (!routeAllowed(r)) return; ROUTE = r; document.body.classList.remove('nav-open'); $$('.nav a, .bottombar a').forEach((a) => a.classList.toggle('on', a.dataset.r === r)); render(); $('#pop') && $('#pop').remove(); closeModal(); const v = $('#view'); if (v) v.scrollTop = 0; };
function subtitle() { return `${DB.org.name} · ${ROLES[role()]}`; }
function render() {
  if (!SESSION) return;
  if (!routeAllowed(ROUTE)) ROUTE = 'dashboard';
  const ttl = $('#ttl'); if (ttl) ttl.textContent = ROUTE === 'dashboard' && role() === 'AGENT' ? `${t('welcome')}, ${SESSION.name.split(' ')[0]}` : t(ROUTE);
  const sub = $('#sub'); if (sub) sub.textContent = subtitle();
  const v = $('#view'); if (!v) return; const st = v.scrollTop;
  try { v.innerHTML = (VIEWS[ROUTE] || VIEWS.dashboard)(); } catch (e) { console.error(e); v.innerHTML = empty('⚠️', 'This screen could not be shown', esc(e.message || e)); }
  v.scrollTop = st;
}
function refresh() {
  render();
  $$('.nav .badge, .bottombar .badge').forEach((x) => x.remove());
  $$('.nav a[data-r], .bottombar a[data-r]').forEach((a) => { const h = badgeFor(a.dataset.r); if (h) a.insertAdjacentHTML('beforeend', h); });
  const b = $('[data-act=bell]'); if (b) { const n = notifications().length; b.innerHTML = `🔔${n ? `<span class="dot">${n}</span>` : ''}`; }
}

/* ---------- notifications ---------- */
function notifications() {
  if (!SESSION) return []; const out = []; const me = SESSION.id;
  if (can.review()) {
    const subs = DB.submissions.filter((s) => s.status === 'SUBMITTED').length; if (subs) out.push({ icon: '📥', text: `${subs} submission${subs > 1 ? 's' : ''} waiting for review`, go: 'submissions' });
    const reps = DB.reports.filter((r) => r.status === 'SENT').length; if (reps) out.push({ icon: '📊', text: `${reps} report${reps > 1 ? 's' : ''} waiting for review`, go: 'reports' });
    const late = DB.tasks.filter((t) => S.isOverdue(t)).length; if (late) out.push({ icon: '⏰', text: `${late} overdue task${late > 1 ? 's' : ''}`, go: 'tasks' });
  } else if (role() === 'AGENT') {
    const mine = DB.tasks.filter((t) => t.assigneeId === me && S.isOverdue(t)).length; if (mine) out.push({ icon: '⏰', text: `${mine} of your tasks ${mine > 1 ? 'are' : 'is'} overdue`, go: 'tasks' });
    const ret = DB.submissions.filter((s) => s.memberId === me && s.status === 'RETURNED').length; if (ret) out.push({ icon: '↩️', text: `${ret} of your submissions ${ret > 1 ? 'were' : 'was'} returned for correction`, go: 'collect' });
    const rej = DB.submissions.filter((s) => s.memberId === me && s.status === 'REJECTED' && !s.seen).length; if (rej) out.push({ icon: '❌', text: `${rej} of your submissions ${rej > 1 ? 'were' : 'was'} rejected. Open them to see why.`, go: 'submissions' });
    if (!S.checkedIn(me)) out.push({ icon: '📍', text: 'You have not checked in today', go: 'attendance' });
  }
  const un = unreadCount(); if (un) out.push({ icon: '💬', text: `${un} unread message${un > 1 ? 's' : ''}`, go: 'messages' });
  return out;
}
ACT.bell = (d, e) => {
  const old = $('#pop'); if (old) return old.remove(); const list = notifications();
  const div = document.createElement('div'); div.id = 'pop'; div.className = 'pop';
  div.innerHTML = `<h4>Notifications</h4>${list.length ? list.map((n, i) => `<div class="row pn" data-act="popGo" data-i="${i}" tabindex="0"><span>${n.icon}</span><span class="sp">${esc(n.text)}</span></div>`).join('') : '<div class="muted" style="padding:12px 0">You are all caught up. 🎉</div>'}`;
  document.body.appendChild(div); div._list = list; e.stopPropagation();
  setTimeout(() => document.addEventListener('click', function h(ev) { if (!div.contains(ev.target)) { div.remove(); document.removeEventListener('click', h); } }), 0);
};
ACT.popGo = ({ i }) => { const p = $('#pop'); const n = p && p._list[+i]; if (p) p.remove(); if (n) ACT.go({ r: n.go }); };

/* ---------- start ---------- */
(function () {
  ['render', 'modal', 'shell', 'welcome', 'loginScreen'].forEach(() => {});
  if (window.Cloud) Cloud.install();
  boot();
})();
