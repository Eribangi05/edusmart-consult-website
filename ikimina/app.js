/* ===== Ikimina Desktop — UI, roles, views ===== */
let ROUTE = 'dashboard';
const VS = { tab: {}, q: {}, period: null };
const ACT = {};
const PAY_METHODS = { CASH: 'Cash', MOMO: 'Mobile Money', BANK: 'Bank transfer', CHEQUE: 'Cheque', OTHER: 'Other' };

/* ---------- UI helpers ---------- */
function toast(msg, bad) {
  const el = document.createElement('div'); el.className = 'toast' + (bad ? ' bad' : ''); el.innerHTML = (bad ? '⚠️ ' : '✅ ') + esc(msg);
  $('#toasts').appendChild(el); setTimeout(() => { el.style.opacity = 0; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 3200);
}
function closeModal() { $('#modal-root').innerHTML = ''; }
function modal({ title, body, wide, submit = 'Save', onSubmit, onInput, footer, cancel = 'Cancel', danger }) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="ov"><form class="modal ${wide ? 'wide' : ''}" autocomplete="off"><header><h2>${title}</h2><button type="button" class="x" data-act="closeModal">✕</button></header>
    <div class="bd">${body}</div><footer>${footer || ''}${onSubmit ? `<button type="button" class="btn" data-act="closeModal">${cancel}</button><button class="btn ${danger ? 'r' : 'p'}" type="submit">${submit}</button>` : `<button type="button" class="btn p" data-act="closeModal">Close</button>`}</footer></form></div>`;
  const form = $('form.modal', root);
  const first = $('input:not([type=hidden]):not([readonly]),select', form); if (first && onSubmit) setTimeout(() => first.focus(), 30);
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!onSubmit) return;
    const fd = Object.fromEntries(new FormData(form).entries());
    const res = await onSubmit(fd, form); if (res !== false) closeModal();
  });
  if (onInput) { form.addEventListener('input', () => onInput(Object.fromEntries(new FormData(form).entries()), form)); onInput(Object.fromEntries(new FormData(form).entries()), form); }
  root.firstElementChild.addEventListener('mousedown', (e) => { if (e.target.classList.contains('ov')) closeModal(); });
  return form;
}
function fld(f) {
  const { name, label, type = 'text', value = '', options, required, placeholder, hint, full, min, step, readonly } = f;
  let input;
  if (options) input = `<select name="${name}" ${required ? 'required' : ''}>${options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  else if (type === 'textarea') input = `<textarea name="${name}" rows="3" placeholder="${esc(placeholder || '')}" ${required ? 'required' : ''}>${esc(value)}</textarea>`;
  else input = `<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder || '')}" ${required ? 'required' : ''} ${min !== undefined ? `min="${min}"` : ''} ${step ? `step="${step}"` : ''} ${readonly ? 'readonly' : ''} ${type === 'number' ? 'inputmode="decimal"' : ''}>`;
  return `<div class="${full ? 'full' : ''}"><label class="f">${label}${required ? ' *' : ''}${input.length ? '' : ''}</label>${input}${hint ? `<span class="f"><span class="hint muted">${hint}</span></span>` : ''}</div>`;
}
const F = (fields) => `<div class="fg">${fields.map(fld).join('')}</div>`;
const memberOptions = (list = S.active()) => list.map(m => [m.id, m.name]);
const empty = (icon, text, sub = '') => `<div class="empty"><div class="e">${icon}</div><b>${text}</b><div>${sub}</div></div>`;
const pill = (txt, cls = '') => `<span class="pill ${cls}">${txt}</span>`;
const kpi = (cls, ico, label, val, desc = '') => `<div class="kpi ${cls}"><div class="ico">${ico}</div><div class="l">${label}</div><div class="v">${val}</div><div class="d">${desc}</div></div>`;
const roleTag = (r) => `<span class="role ${r}">${ROLES[r]}</span>`;
const loanPill = (l) => ({ PENDING: pill('⏳ Awaiting approval', 'warn'), APPROVED: pill('✔ Approved · to disburse', 'info'), ACTIVE: S.overdueOf(l) > 0 ? pill('⚠ Overdue', 'bad') : pill('Active', 'ok'), PAID: pill('Paid off', 'pur'), REJECTED: pill('Rejected', 'bad') }[l.status]);
const guard = (ok, msg) => { if (!ok) { toast(msg || 'You do not have permission for this action', true); } return ok; };

/* ---------- boot ---------- */
async function boot() {
  DB = await Store.load();
  if (!DB) { welcome(); return; }
  migrate(); applyPrefs(); if (window.Cloud) Cloud.start(); loginScreen();
}
function migrate() { DB.seq = DB.seq || { rc: 0 }; DB.notes = DB.notes || []; DB.prefs = DB.prefs || { theme: 'light', lang: 'en' }; }
function applyPrefs() { document.documentElement.dataset.theme = DB.prefs.theme || 'light'; LANG = DB.prefs.lang || 'en'; }

/* ---------- welcome / setup ---------- */
function authLeft() {
  return `<div class="left"><div class="orb" style="width:260px;height:260px;top:-80px;right:-60px"></div><div class="orb" style="width:140px;height:140px;bottom:60px;left:-40px;animation-delay:-3s"></div>
  <div class="row"><img class="logo" src="assets/logo-96.png" alt="" width="46" height="46"><div><b style="font-size:20px">Ikimina</b><div style="opacity:.7;font-size:12px">Web Edition</div></div></div>
  <h1>Your group.<br>Your savings.<br><span style="color:var(--gold)">Your future.</span></h1>
  <p>The complete workspace for savings groups — contributions, loans, rotation and transparent reporting, with the right access for every role.</p>
  <div class="feat"><div>💰 Accountant records every payment</div><div>🏛️ President oversees & approves</div><div>👥 Members see their own savings</div><div>📄 PDF receipts & statements</div></div></div>`;
}
function welcome() {
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><div class="box">
    <h1 style="font-size:30px">Welcome 👋</h1><p class="muted" style="margin:8px 0 26px">Let's get your savings group running. Choose how you'd like to begin.</p>
    <div class="ucard" data-act="startSetup"><span style="font-size:30px">🌱</span><div><b>Create my group</b><small>Set up your real group in two minutes</small></div></div>
    <div class="ucard" data-act="startDemo"><span style="font-size:30px">✨</span><div><b>Explore with demo data</b><small>A sample group with 13 members, loans and history</small></div></div>
    ${window.Cloud ? Cloud.welcomeCard() : ''}
    <div class="ucard" data-act="restoreBackup"><span style="font-size:30px">📥</span><div><b>Restore from backup</b><small>Import a .json backup file</small></div></div></div></div></div>`;
}
ACT.startDemo = async () => { DB = await buildDemo(); migrate(); Store.save(DB); applyPrefs(); toast('Demo group loaded — every PIN is 1234'); loginScreen(); };
ACT.restoreBackup = async () => {
  let txt = null;
  if (window.api) txt = await window.api.importFile(); else { txt = await new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.onchange = () => i.files[0].text().then(res); i.click(); }); }
  if (!txt) return;
  try { const d = JSON.parse(txt); if (!d.group || !d.members) throw 0; DB = d; migrate(); Store.save(DB); applyPrefs(); toast('Backup restored'); loginScreen(); } catch { toast('That file is not a valid Ikimina backup', true); }
};
ACT.startSetup = () => {
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><form class="box" id="setup"><h1 style="font-size:26px">Create your group</h1><p class="muted" style="margin:6px 0 18px">You can change everything later in Settings.</p>
   <h4 class="mt">The group</h4>${F([
    { name: 'gname', label: 'Group name', required: true, full: true, placeholder: 'e.g. Twisungane Ikimina' }, { name: 'location', label: 'Location', placeholder: 'Kigali' },
    { name: 'currency', label: 'Currency', value: 'RWF', required: true }, { name: 'cycle', label: 'Contribution frequency', options: Object.entries(CYCLES), value: 'MONTHLY' },
    { name: 'amount', label: 'Contribution per period', type: 'number', required: true, min: 0, value: 10000 }, { name: 'rate', label: 'Loan interest (% per month)', type: 'number', step: '0.1', value: 5 }])}
   <h4 style="margin-top:20px">President</h4>${F([{ name: 'pname', label: 'Full name', required: true }, { name: 'pphone', label: 'Phone', required: true }, { name: 'ppin', label: '4-digit PIN', type: 'password', required: true, placeholder: '••••' }])}
   <h4 style="margin-top:20px">Accountant <small>(the person who receives & records money)</small></h4>${F([{ name: 'aname', label: 'Full name', required: true }, { name: 'aphone', label: 'Phone', required: true }, { name: 'apin', label: '4-digit PIN', type: 'password', required: true, placeholder: '••••' }])}
   <div class="row mt"><button type="button" class="btn" data-act="back0">← Back</button><span class="sp"></span><button class="btn p" type="submit">Create group →</button></div></form></div></div>`;
  $('#setup').onsubmit = async (e) => {
    e.preventDefault(); const v = Object.fromEntries(new FormData(e.target).entries());
    if (!/^\d{4}$/.test(v.ppin) || !/^\d{4}$/.test(v.apin)) return toast('PINs must be exactly 4 digits', true);
    DB = await buildEmpty({ name: v.gname, location: v.location, currency: v.currency.toUpperCase(), cycle: v.cycle, amount: +v.amount, interestRate: +v.rate, objective: '' },
      { name: v.pname, phone: v.pphone, pin: v.ppin }, { name: v.aname, phone: v.aphone, pin: v.apin });
    migrate(); Store.save(DB); applyPrefs(); toast('Group created! Sign in to begin.'); loginScreen();
  };
};
ACT.back0 = welcome;

/* ---------- login ---------- */
let PIN = '', PICK = null, TRIES = {}, LOCK = 0;
function loginScreen() {
  SESSION = null; PICK = null; PIN = ''; closeModal();
  const users = DB.members.filter(m => m.status === 'ACTIVE').sort((a, b) => ['PRESIDENT', 'ACCOUNTANT', 'MEMBER'].indexOf(a.role) - ['PRESIDENT', 'ACCOUNTANT', 'MEMBER'].indexOf(b.role) || a.name.localeCompare(b.name));
  const q = (VS.q.login || '').toLowerCase();
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><div class="box">
    <div class="row"><div><h1 style="font-size:28px">${esc(DB.group.name)}</h1><p class="muted" style="margin:4px 0 0">Choose your profile to sign in</p></div></div>
    ${DB.demo ? `<div class="alert mt" style="margin-bottom:0">✨ <span>Demo mode — every PIN is <b>1234</b></span></div>` : ''}
    <input class="mt" data-filter="login" placeholder="Search your name…" value="${esc(VS.q.login || '')}" style="margin-bottom:14px">
    <div style="max-height:52vh;overflow:auto;padding:2px">${users.filter(u => u.name.toLowerCase().includes(q)).map(u => `<div class="ucard" data-act="pickUser" data-id="${u.id}">${avatar(u.name, 44)}<div class="sp"><b>${esc(u.name)}</b>${roleTag(u.role)}</div><span class="muted">→</span></div>`).join('') || empty('🔎', 'No match')}</div>
    <div class="row mt"><button class="btn s o" data-act="toggleTheme">🌓 Theme</button><span class="sp"></span><button class="btn s o" data-act="langCycle">🌍 ${LANGS[LANG]}</button></div></div></div></div>`;
}
ACT.pickUser = ({ id }) => { PICK = S.member(id); PIN = ''; pinScreen(); };
function pinScreen(shake) {
  const u = PICK;
  $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><div class="box c">
   <div style="display:grid;place-items:center">${avatar(u.name, 76)}</div><h2 style="margin-top:12px">${esc(u.name)}</h2>${roleTag(u.role)}
   <p class="muted">Enter your 4-digit PIN</p><div class="dots ${shake ? 'shake' : ''}">${[0, 1, 2, 3].map(i => `<i class="${i < PIN.length ? 'on' : ''}"></i>`).join('')}</div>
   <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-act="key" data-k="${n}">${n}</button>`).join('')}<button data-act="pinBack" style="font-size:15px">← Back</button><button data-act="key" data-k="0">0</button><button data-act="pinDel">⌫</button></div></div></div></div>`;
}
ACT.pinBack = loginScreen; ACT.pinDel = () => { PIN = PIN.slice(0, -1); pinScreen(); };
ACT.key = ({ k }) => { if (PIN.length >= 4) return; PIN += k; pinScreen(); if (PIN.length === 4) setTimeout(tryLogin, 120); };
async function tryLogin() {
  const u = PICK; if (Date.now() < LOCK) { toast(`Too many attempts. Try again in ${Math.ceil((LOCK - Date.now()) / 1000)}s`, true); PIN = ''; return pinScreen(true); }
  const ok = (await hashPin(PIN, u.salt)) === u.pinHash;
  if (!ok) { TRIES[u.id] = (TRIES[u.id] || 0) + 1; PIN = ''; if (TRIES[u.id] >= 5) { LOCK = Date.now() + 30000; TRIES[u.id] = 0; toast('Locked for 30 seconds', true); } else toast('Wrong PIN', true); return pinScreen(true); }
  TRIES[u.id] = 0; SESSION = u; ROUTE = 'dashboard'; DB.prefs.lastUser = u.id; audit('Signed in', ROLES[u.role]); commit(); shell(); toast(`Welcome back, ${u.name.split(' ')[0]}!`);
}
document.addEventListener('keydown', (e) => {
  if (PICK && !SESSION && /^\d$/.test(e.key)) ACT.key({ k: e.key }); else if (PICK && !SESSION && e.key === 'Backspace') ACT.pinDel(); else if (PICK && !SESSION && e.key === 'Escape') loginScreen();
  if (SESSION && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette(); }
  if (e.key === 'Escape') { closeModal(); $('#pop') && $('#pop').remove(); }
});
let idleT; function bumpIdle() { clearTimeout(idleT); if (SESSION) idleT = setTimeout(() => { toast('Locked after 10 minutes of inactivity'); loginScreen(); }, 600000); }
['mousemove', 'keydown', 'click'].forEach(ev => document.addEventListener(ev, bumpIdle));

/* ---------- shell & navigation ---------- */
const NAV = {
  PRESIDENT: [['Overview', ['dashboard', '🏠', 'dashboard'], ['analytics', '📊', 'analytics']], ['Group', ['members', '👥', 'members'], ['contributions', '💰', 'contributions'], ['loans', '🏦', 'loans'], ['requests', '📨', 'requests'], ['finance', '🧾', 'finance'], ['rotation', '🔄', 'rotation']], ['Community', ['meetings', '📅', 'meetings'], ['announcements', '📣', 'announcements']], ['Admin', ['reports', '📄', 'reports'], ['audit', '🛡️', 'audit'], ['settings', '⚙️', 'settings']]],
  ACCOUNTANT: [['Overview', ['dashboard', '🏠', 'dashboard']], ['Cashbook', ['contributions', '💰', 'contributions'], ['loans', '🏦', 'loans'], ['finance', '🧾', 'finance'], ['rotation', '🔄', 'rotation']], ['Group', ['members', '👥', 'members'], ['requests', '📨', 'requests'], ['meetings', '📅', 'meetings'], ['announcements', '📣', 'announcements']], ['Admin', ['reports', '📄', 'reports']]],
  MEMBER: [['My account', ['dashboard', '🏠', 'dashboard'], ['mysavings', '💰', 'mysavings'], ['myloans', '🏦', 'myloans'], ['requests', '📨', 'requests']], ['Community', ['meetings', '📅', 'meetings'], ['announcements', '📣', 'announcements']]]
};
const TITLES = { dashboard: 'dashboard', analytics: 'analytics', members: 'members', contributions: 'contributions', loans: 'loans', requests: 'requests', finance: 'finance', rotation: 'rotation', meetings: 'meetings', announcements: 'announcements', reports: 'reports', audit: 'audit', settings: 'settings', mysavings: 'mysavings', myloans: 'myloans', profile: 'profile' };
const pendingCount = () => DB.requests.filter(r => r.status === 'PENDING').length + (can.approve() ? DB.loans.filter(l => l.status === 'PENDING').length : can.record() ? DB.loans.filter(l => l.status === 'APPROVED').length : 0);
function shell() {
  const nav = NAV[SESSION.role].map(([sec, ...items]) => `<div class="sec">${sec}</div>` + items.map(([r, ic, k]) =>
    `<a data-act="go" data-r="${r}" class="${ROUTE === r ? 'on' : ''}"><span class="ic">${ic}</span>${t(k)}${r === 'requests' && can.admin() && pendingCount() ? `<span class="badge">${pendingCount()}</span>` : ''}</a>`).join('')).join('');
  const nn = notifications().length;
  $('#app').innerHTML = `<div class="shell"><aside class="side"><div class="brand"><img class="logo" src="assets/logo-96.png" alt="" width="46" height="46"><div><b>Ikimina</b><span>${esc(DB.group.name)}</span></div></div><nav class="nav">${nav}</nav>
    <div class="me"><span data-act="go" data-r="profile" style="cursor:pointer">${avatar(SESSION.name, 38)}</span><div data-act="go" data-r="profile" style="cursor:pointer;min-width:0"><b>${esc(SESSION.name.split(' ').slice(0, 2).join(' '))}</b><span>${ROLES[SESSION.role]}</span></div><button class="iconbtn" style="background:rgba(255,255,255,.1);border:0;color:#fff;width:34px;height:34px" title="${t('signout')}" data-act="signout">⎋</button></div></aside>
    <section class="main"><div class="top"><div><h1 id="ttl"></h1><div class="sub" id="sub"></div></div><span class="sp"></span>
    <div class="searchbox" data-act="palette">🔍 <span>Search…</span><kbd>Ctrl K</kbd></div>
    <button class="iconbtn" data-act="toggleTheme" title="Theme">🌓</button><button class="iconbtn" data-act="bell" title="Notifications">🔔${nn ? `<span class="dot">${nn}</span>` : ''}</button></div>
    <div class="view" id="view"></div></section></div>`;
  render(); bumpIdle();
}
ACT.go = ({ r }) => { ROUTE = r; $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r === r)); render(); $('#pop') && $('#pop').remove(); closeModal(); };
ACT.signout = () => { audit('Signed out', ''); commit(); loginScreen(); };
ACT.closeModal = closeModal;
ACT.toggleTheme = () => { DB.prefs.theme = DB.prefs.theme === 'dark' ? 'light' : 'dark'; applyPrefs(); commit(); };
ACT.langCycle = () => { const ks = Object.keys(LANGS); DB.prefs.lang = ks[(ks.indexOf(LANG) + 1) % ks.length]; applyPrefs(); commit(); SESSION ? shell() : (PICK ? pinScreen() : loginScreen()); };
function subtitle() {
  const g = DB.group; return `${esc(g.name)} · ${CYCLES[g.cycle]} contributions of ${money(g.amount)} ${esc(g.currency)}`;
}
function render() {
  const fn = VIEWS[ROUTE] || VIEWS.dashboard;
  $('#ttl').textContent = ROUTE === 'dashboard' && SESSION.role === 'MEMBER' ? `${t('welcome')}, ${SESSION.name.split(' ')[0]}` : t(TITLES[ROUTE] || ROUTE);
  $('#sub').innerHTML = subtitle();
  $('#view').innerHTML = fn(); $('#view').scrollTop = 0;
}
function refresh() { const v = $('#view'); const st = v.scrollTop; render(); v.scrollTop = st; const nn = notifications().length; const b = $('[data-act=bell]'); if (b) b.innerHTML = `🔔${nn ? `<span class="dot">${nn}</span>` : ''}`; $$('.nav .badge').forEach(x => x.remove()); const rq = $('.nav a[data-r=requests]'); if (rq && can.admin() && pendingCount()) rq.insertAdjacentHTML('beforeend', `<span class="badge">${pendingCount()}</span>`); }

/* ---------- notifications & search ---------- */
function notifications() {
  const out = [], me = SESSION; if (!me) return out;
  if (me.role === 'MEMBER') {
    const m = me, p = curPeriod(), st = S.periodStatus(m, p);
    if (st !== 'PAID') out.push({ icon: '💰', text: `Your ${periodLabel(p)} contribution is ${st === 'PARTIAL' ? 'partly paid' : 'not yet paid'} (${money(S.expectedPer(m) - S.paidInPeriod(m.id, p))} ${cur()} remaining)` });
    S.loansOf(m.id).filter(l => l.status === 'ACTIVE').forEach(l => { const n = S.nextInstallment(l); if (n) out.push({ icon: '🏦', text: `Loan installment ${n.no} of ${money(n.remaining)} ${cur()} due ${fdate(n.due)}` }); });
  } else {
    if (can.approve()) DB.loans.filter(l => l.status === 'PENDING').forEach(l => out.push({ icon: '⏳', text: `Loan of ${money(l.principal)} for ${S.name(l.memberId)} awaits your approval` }));
    if (can.record()) DB.loans.filter(l => l.status === 'APPROVED').forEach(l => out.push({ icon: '💸', text: `Approved loan for ${S.name(l.memberId)} is ready to disburse` }));
    DB.requests.filter(r => r.status === 'PENDING').forEach(r => out.push({ icon: '📨', text: `${S.name(r.memberId)}: ${reqLabel(r.type)}` }));
    S.inFlight().filter(l => S.overdueOf(l) > 0).forEach(l => out.push({ icon: '⚠️', text: `${S.name(l.memberId)} is overdue by ${money(S.overdueOf(l))} ${cur()}` }));
  }
  DB.notes.filter(n => n.memberId === me.id).slice(0, 5).forEach(n => out.push({ icon: n.icon, text: n.text }));
  const nm = DB.meetings.filter(x => !x.done && x.at > Date.now()).sort((a, b) => a.at - b.at)[0];
  if (nm && nm.at - Date.now() < 7 * DAY) out.push({ icon: '📅', text: `${nm.title} on ${fdate(nm.at)} at ${nm.location}` });
  return out;
}
ACT.bell = () => {
  if ($('#pop')) return $('#pop').remove(); const n = notifications();
  $('.main').insertAdjacentHTML('beforeend', `<div class="pop" id="pop"><h3 style="margin-bottom:8px">Notifications</h3>${n.length ? `<div class="list">${n.map(x => `<div><span style="font-size:22px">${x.icon}</span><div class="t"><span style="color:var(--ink)">${esc(x.text)}</span></div></div>`).join('')}</div>` : empty('🎉', "You're all caught up")}</div>`);
};
function palette() {
  const items = []; NAV[SESSION.role].forEach(([, ...its]) => its.forEach(([r, ic, k]) => items.push({ ic, label: 'Go to ' + t(k), act: 'go', r })));
  if (can.admin()) DB.members.forEach(m => items.push({ ic: '👤', label: m.name, sub: ROLES[m.role] + ' · ' + m.phone, act: 'member', id: m.id }));
  if (can.record()) items.unshift({ ic: '➕', label: 'Record a contribution', act: 'recordC' });
  if (can.approve()) items.unshift({ ic: '📣', label: 'Post an announcement', act: 'postAnn' });
  $('#modal-root').innerHTML = `<div class="ov"><div class="pal"><input id="pq" placeholder="Search members, pages, actions…" autofocus><div class="res" id="pres"></div></div></div>`;
  const draw = () => { const q = $('#pq').value.toLowerCase(); const r = items.filter(i => (i.label + (i.sub || '')).toLowerCase().includes(q)).slice(0, 9); $('#pres').innerHTML = r.map((i, n) => `<a class="${n === 0 ? 'hl' : ''}" data-i="${items.indexOf(i)}"><span style="font-size:20px">${i.ic}</span><div><b>${esc(i.label)}</b>${i.sub ? `<div class="muted" style="font-size:12px">${esc(i.sub)}</div>` : ''}</div></a>`).join('') || empty('🔎', 'Nothing found'); };
  const go = (i) => { closeModal(); const it = items[i]; if (!it) return; if (it.act === 'go') ACT.go({ r: it.r }); else ACT[it.act]({ id: it.id }); };
  $('#pq').oninput = draw; $('#pq').onkeydown = (e) => { if (e.key === 'Enter') { const a = $('#pres a'); if (a) go(+a.dataset.i); } }; $('#pres').onclick = (e) => { const a = e.target.closest('a'); if (a) go(+a.dataset.i); }; draw();
  $('.ov').addEventListener('mousedown', (e) => { if (e.target.classList.contains('ov')) closeModal(); });
}
ACT.palette = palette;

/* ---------- global events ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el) { if ($('#pop') && !e.target.closest('#pop')) $('#pop').remove(); return; }
  const a = el.dataset.act; if (ACT[a]) ACT[a](el.dataset, el, e);
});
document.addEventListener('input', (e) => {
  const key = e.target.dataset && e.target.dataset.filter; if (!key) return;
  VS.q[key] = e.target.value; const pos = e.target.selectionStart;
  if (SESSION) refresh(); else loginScreen();
  const n = $(`[data-filter=${key}]`); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener('submit', (e) => { if (!e.target.classList.contains('modal')) e.preventDefault(); });
document.addEventListener('change', (e) => { const k = e.target.dataset && e.target.dataset.sel; if (k) { if (k === 'period') VS.period = +e.target.value; else VS.tab[k] = e.target.value; refresh(); } });
ACT.tab = ({ k, v }) => { VS.tab[k] = v; refresh(); };
const tabs = (k, opts, def) => { const cur = VS.tab[k] || def || opts[0][0]; return `<div class="tabs">${opts.map(([v, l]) => `<button data-act="tab" data-k="${k}" data-v="${v}" class="${cur === v ? 'on' : ''}">${l}</button>`).join('')}</div>`; };
const curTab = (k, def) => VS.tab[k] || def;
const searchInput = (k, ph = 'Search…') => `<input data-filter="${k}" placeholder="🔍 ${ph}" value="${esc(VS.q[k] || '')}" style="width:250px">`;

/* ================= VIEWS ================= */
const VIEWS = {};

/* ---- dashboards ---- */
VIEWS.dashboard = () => SESSION.role === 'MEMBER' ? memberDash() : adminDash();

function adminDash() {
  const col = S.collection(), m6 = S.monthly(6), pin = DB.announcements.find(a => a.pinned);
  const next = DB.meetings.filter(x => !x.done && x.at > Date.now()).sort((a, b) => a.at - b.at)[0];
  const overdue = S.inFlight().filter(l => S.overdueOf(l) > 0);
  const unpaid = S.active().filter(m => S.periodStatus(m, curPeriod()) === 'UNPAID');
  const recent = [...DB.contributions.map(c => ({ t: c.date, ic: '💰', title: S.name(c.memberId), sub: 'Contribution · ' + PAY_METHODS[c.method], v: c.amount, in: 1 })),
    ...DB.repayments.map(c => ({ t: c.date, ic: '🏦', title: S.name((DB.loans.find(l => l.id === c.loanId) || {}).memberId), sub: 'Loan repayment', v: c.amount, in: 1 })),
    ...DB.expenses.map(c => ({ t: c.date, ic: '🧾', title: c.category, sub: c.description, v: c.amount, in: 0 })),
    ...DB.income.map(c => ({ t: c.date, ic: '✨', title: c.source, sub: c.description, v: c.amount, in: 1 }))].sort((a, b) => b.t - a.t).slice(0, 7);
  const top = S.rankSavers().slice(0, 5);
  const actions = can.record() ? `<button class="btn p" data-act="recordC">➕ Record contribution</button><button class="btn g" data-act="go" data-r="loans">🏦 Loans & repayments</button>` :
    `<button class="btn p" data-act="go" data-r="requests">✔ Review approvals${pendingCount() ? ` (${pendingCount()})` : ''}</button><button class="btn g" data-act="postAnn">📣 Post announcement</button>`;
  return `
  <div class="hero"><div class="row wrap"><div><div class="l">Cash in hand · ${ROLES[SESSION.role]} view</div><div class="big">${money(S.cash())} <small>${esc(cur())}</small></div><div style="opacity:.75;font-size:13px">Total group worth ${money(S.cash() + S.outstanding())} ${esc(cur())} including loans out</div></div><span class="sp"></span>
    <div class="row wrap" style="position:relative;z-index:1">${actions}</div></div>
    <div class="chips"><div class="chip">Members<b>${S.active().length}</b></div><div class="chip">Total savings<b>${money(S.totalSavings(), true)}</b></div><div class="chip">Loans out<b>${money(S.outstanding(), true)}</b></div><div class="chip">Interest & income<b>${money(S.interestEarned() + S.income(), true)}</b></div><div class="chip">Expenses<b>${money(S.expenses(), true)}</b></div></div></div>
  <div class="grid g4 mt">${kpi('a', '💰', 'Total savings', moneyC(S.totalSavings()), `${DB.contributions.length} contributions recorded`)}${kpi('b', '🏦', 'Loans outstanding', moneyC(S.outstanding()), `${S.inFlight().length} active loans`)}${kpi('c', '📈', 'Interest earned', moneyC(S.interestEarned()), 'From repaid loans')}${kpi('d', '🔄', 'Pot payouts', moneyC(S.payouts()), `${DB.payouts.length} rounds paid`)}</div>
  ${(overdue.length || unpaid.length) ? `<div class="mt">${overdue.length ? `<div class="alert bad">⚠️ <span><b>${overdue.length}</b> overdue loan${overdue.length > 1 ? 's' : ''}: ${overdue.map(l => esc(S.name(l.memberId))).join(', ')}</span><span class="sp"></span><button class="btn s" data-act="go" data-r="loans">Review</button></div>` : ''}
    ${unpaid.length ? `<div class="alert">⏰ <span><b>${unpaid.length}</b> member${unpaid.length > 1 ? 's have' : ' has'} not paid for ${periodLabel(curPeriod())}</span><span class="sp"></span><button class="btn s" data-act="go" data-r="contributions">View board</button></div>` : ''}</div>` : ''}
  <div class="grid g21 mt"><div class="card"><h3>📊 Cash flow — last 6 months <span class="sp"></span><span class="muted" style="font-weight:500;font-size:12px"><b style="color:var(--emerald)">■</b> Savings <b style="color:var(--gold)">■</b> Income <b style="color:var(--red)">■</b> Expenses</span></h3>${Charts.bars(m6, ['savings', 'income', 'expenses'], ['#12804a', '#f5b301', '#ef5350'])}</div>
   <div class="card"><h3>🎯 ${periodLabel(curPeriod())} collection</h3><div class="row" style="justify-content:center;gap:22px;flex-wrap:wrap">${Charts.ring(col.pct, Math.round(col.pct) + '%', `${col.paid}/${col.total} paid`, col.pct > 80 ? 'var(--emerald)' : col.pct > 50 ? 'var(--gold)' : 'var(--red)', 150)}<div><div class="muted">Collected</div><b style="font-size:20px">${money(col.got)}</b><div class="muted mt">Expected</div><b style="font-size:20px">${money(col.expected)}</b></div></div></div></div>
  <div class="grid g3 mt"><div class="card"><h3>🕒 Recent activity</h3>${recent.length ? `<div class="list">${recent.map(r => `<div><span style="font-size:22px">${r.ic}</span><div class="t"><b>${esc(r.title)}</b><span>${esc(r.sub)} · ${ago(r.t)}</span></div><span class="amt ${r.in ? 'in' : 'out'}">${r.in ? '+' : '−'}${money(r.v)}</span></div>`).join('')}</div>` : empty('📭', 'No activity yet')}</div>
   <div class="card"><h3>🏆 Top savers</h3>${top.length ? Charts.hbars(top.map((x, i) => ({ l: x.m.name, v: x.v, c: ['#f5b301', '#12804a', '#2563eb', '#7c3aed', '#0ea5a4'][i] }))) : empty('🏅', 'No savings yet')}</div>
   <div class="card"><h3>📌 Community</h3>${pin ? `<div class="ann pin"><h4>📌 ${esc(pin.title)}</h4><p>${esc(pin.body)}</p></div>` : ''}${next ? `<div class="ann"><h4>📅 ${esc(next.title)}</h4><p>${fdate(next.at, { weekday: 'long', day: 'numeric', month: 'long' })} · ${esc(next.location)}</p></div>` : empty('📅', 'No upcoming meeting')}</div></div>`;
}

function memberDash() {
  const m = SESSION, saved = S.savedBy(m.id), p = curPeriod(), st = S.periodStatus(m, p), sc = S.score(m);
  const mine = DB.contributions.filter(c => c.memberId === m.id).sort((a, b) => a.date - b.date);
  let run = 0; const pts = mine.map(c => run += c.amount); const labels = mine.map((c, i) => i % Math.ceil(mine.length / 6 || 1) === 0 ? fdate(c.date, { month: 'short' }) : '');
  const loan = S.loansOf(m.id).find(l => l.status === 'ACTIVE'), pin = DB.announcements.find(a => a.pinned);
  const next = DB.meetings.filter(x => !x.done && x.at > Date.now()).sort((a, b) => a.at - b.at)[0];
  const rank = S.rankSavers().findIndex(x => x.m.id === m.id) + 1, arrears = S.arrears(m);
  const nl = loan && S.nextInstallment(loan);
  return `<div class="hero"><div class="l">My total savings</div><div class="big">${money(saved)} <small>${esc(cur())}</small></div><div style="opacity:.8">${mine.length} contributions since ${fdate(m.joinDate, { month: 'long', year: 'numeric' })}</div>
    <div class="chips"><div class="chip">${periodLabel(p)}<b>${st === 'PAID' ? '✅ Paid' : st === 'PARTIAL' ? '🟡 Partial' : '🔴 Unpaid'}</b></div><div class="chip">Group rank<b>#${rank || '-'} of ${S.active().length}</b></div><div class="chip">Goal<b>${esc(m.goal || '—')}</b></div><div class="chip">Reliability<b>${sc}/100</b></div></div></div>
  ${arrears > 0 ? `<div class="alert mt">⏰ <span>You have <b>${money(arrears)} ${esc(cur())}</b> in missed contributions. Please pay your accountant.</span></div>` : `<div class="alert ok mt">🎉 <span>You're fully up to date with your contributions. Great job!</span></div>`}
  <div class="grid g21 mt"><div class="card"><h3>📈 My savings growth</h3>${pts.length ? Charts.area(pts, 'var(--emerald)', 190, labels) : empty('🌱', 'Your growth chart will appear after your first contribution')}</div>
   <div class="card"><h3>🏦 My loan</h3>${loan ? `<div class="c">${Charts.ring(loan.totalRepay ? S.paidOn(loan) / loan.totalRepay * 100 : 0, Math.round(S.paidOn(loan) / loan.totalRepay * 100) + '%', 'repaid', 'var(--blue)', 130)}</div><div class="row mt"><span class="muted">Balance</span><span class="sp"></span><b>${money(S.balance(loan))} ${esc(cur())}</b></div>${nl ? `<div class="row"><span class="muted">Next payment</span><span class="sp"></span><b>${money(nl.remaining)} · ${fdate(nl.due, { day: 'numeric', month: 'short' })}</b></div>` : ''}` : `<div class="empty"><div class="e">🏦</div>No active loan<div>You can borrow up to <b>${money(S.maxLoan(m))} ${esc(cur())}</b></div><button class="btn p s mt" data-act="reqLoan">Request a loan</button></div>`}</div></div>
  <div class="grid g2 mt"><div class="card"><h3>🕒 Recent contributions</h3>${mine.length ? `<div class="list">${[...mine].reverse().slice(0, 6).map(c => `<div><span style="font-size:22px">💰</span><div class="t"><b>${periodLabel(c.period)}</b><span>${fdate(c.date)} · ${PAY_METHODS[c.method]}</span></div><span class="amt in">+${money(c.amount)}</span></div>`).join('')}</div>` : empty('📭', 'Nothing yet')}</div>
   <div class="card"><h3>📣 Latest news</h3>${pin ? `<div class="ann pin"><h4>📌 ${esc(pin.title)}</h4><p>${esc(pin.body)}</p></div>` : ''}${next ? `<div class="ann"><h4>📅 ${esc(next.title)}</h4><p>${fdate(next.at, { weekday: 'long', day: 'numeric', month: 'long' })} · ${esc(next.location)}</p></div>` : ''}${!pin && !next ? empty('📭', 'No news') : ''}</div></div>`;
}

/* ---- contributions ---- */
VIEWS.contributions = () => {
  const p = VS.period ?? curPeriod(), q = (VS.q.contrib || '').toLowerCase();
  const periods = []; for (let i = 0; i < 12; i++) periods.push(curPeriod() - i);
  const mem = S.active().filter(m => periodIdx(m.joinDate) <= p);
  const paid = mem.filter(m => S.periodStatus(m, p) === 'PAID').length;
  const rows = DB.contributions.filter(c => (!q || S.name(c.memberId).toLowerCase().includes(q)) && (curTab('cf', 'all') === 'all' || c.period === p)).sort((a, b) => b.date - a.date).slice(0, 150);
  return `<div class="row wrap"><select style="width:190px" data-sel="period">${periods.map(x => `<option value="${x}" ${x === p ? 'selected' : ''}>${periodLabel(x)}${x === curPeriod() ? ' (current)' : ''}</option>`).join('')}</select>
   <span class="pill ok">${paid} paid</span><span class="pill bad">${mem.length - paid} pending</span><span class="sp"></span>
   ${can.record() ? `<button class="btn p" data-act="recordC">➕ Record contribution</button>` : `<span class="pill info">👁 View-only — the accountant records payments</span>`}<button class="btn" data-act="exportC">⬇ Export CSV</button></div>
  <div class="card mt"><h3>✅ Collection board — ${periodLabel(p)}</h3><div class="board">${mem.map(m => { const st = S.periodStatus(m, p), pd = S.paidInPeriod(m.id, p);
    return `<div class="bm ${st}">${avatar(m.name, 36)}<div class="n"><b>${esc(m.name)}</b><span class="muted">${money(pd)} / ${money(S.expectedPer(m))}</span></div>${st === 'PAID' ? '<span>✅</span>' : can.record() ? `<button class="btn s p" data-act="recordC" data-id="${m.id}" data-p="${p}">Pay</button>` : '<span>⏳</span>'}</div>`; }).join('') || empty('👥', 'No members')}</div></div>
  <div class="card mt"><h3>📒 Ledger <span class="sp"></span>${tabs('cf', [['all', 'All periods'], ['per', 'This period']], 'all')} ${searchInput('contrib', 'Search member')}</h3>
   ${rows.length ? `<div class="tw"><table><thead><tr><th>Receipt</th><th>Date</th><th>Member</th><th>Period</th><th>Method</th><th class="right">Amount</th><th>Recorded by</th><th></th></tr></thead><tbody>${rows.map(c => `<tr><td><b>${esc(c.receiptNo || 'RC-' + c.id.slice(-5).toUpperCase())}</b></td><td>${fdate(c.date)}</td><td><div class="row">${avatar(S.name(c.memberId), 28)}${esc(S.name(c.memberId))}</div></td><td>${periodLabel(c.period)}</td><td>${PAY_METHODS[c.method]}</td><td class="right amt in">${money(c.amount)}</td><td class="muted">${esc(c.by)}</td><td class="right"><button class="btn s" data-act="receipt" data-id="${c.id}">🧾</button>${can.record() ? `<button class="btn s r" data-act="reverse" data-t="contributions" data-id="${c.id}">↩</button>` : ''}</td></tr>`).join('')}</tbody></table></div>` : empty('💰', 'No contributions found')}</div>`;
};
ACT.recordC = ({ id, p }) => {
  if (!guard(can.record(), 'Only the Accountant can record payments')) return;
  const pre = id || ''; const per = p !== undefined ? +p : curPeriod();
  const periods = []; for (let i = 0; i < 12; i++) periods.push([curPeriod() - i, periodLabel(curPeriod() - i)]);
  modal({
    title: '💰 Record contribution', submit: 'Save & issue receipt',
    body: F([{ name: 'memberId', label: 'Member', options: memberOptions(), value: pre, required: true, full: true }, { name: 'period', label: 'For period', options: periods, value: per }, { name: 'amount', label: `Amount (${cur()})`, type: 'number', required: true, min: 1, value: 0 },
      { name: 'date', label: 'Date received', type: 'date', value: toInputDate(Date.now()), required: true }, { name: 'method', label: 'Payment method', options: Object.entries(PAY_METHODS) }, { name: 'ref', label: 'Reference / MoMo txn ID', placeholder: 'Optional' }, { name: 'note', label: 'Note', full: true }]) + `<div id="cinfo" class="alert mt" style="margin-bottom:0"></div>`,
    onInput: (v, f) => { const m = S.member(v.memberId); if (!m) return; const rem = Math.max(0, S.expectedPer(m) - S.paidInPeriod(m.id, +v.period)); if (!f._touched && !f.amount.value || f.amount.value == 0) { f.amount.value = rem || S.expectedPer(m); } $('#cinfo').innerHTML = `ℹ️ <span>${esc(m.name)} owes <b>${money(rem)} ${cur()}</b> for ${periodLabel(+v.period)} · total saved ${money(S.savedBy(m.id))}</span>`; },
    onSubmit: (v) => {
      const amt = +v.amount; if (!(amt > 0)) { toast('Enter a valid amount', true); return false; }
      DB.seq.rc++; const c = { id: uid(), memberId: v.memberId, amount: amt, date: fromInputDate(v.date), period: +v.period, method: v.method, ref: v.ref, note: v.note, by: who(), receiptNo: 'RC-' + String(DB.seq.rc).padStart(5, '0') };
      DB.contributions.push(c); audit('Contribution recorded', `${S.name(c.memberId)} · ${money(amt)} ${cur()} · ${c.receiptNo}`);
      notify(`Your contribution of ${money(amt)} ${cur()} was recorded (${c.receiptNo}). Thank you!`, c.memberId, '✅'); commit(); refresh();
      setTimeout(() => modal({ title: '✅ Payment recorded', body: `<div class="c"><div style="font-size:52px">🎉</div><h3 style="margin:8px 0">${money(amt)} ${esc(cur())} from ${esc(S.name(c.memberId))}</h3><p class="muted">Receipt ${c.receiptNo} has been issued.</p></div>`, footer: `<button type="button" class="btn g" data-act="receipt" data-id="${c.id}">🧾 Save PDF receipt</button><button type="button" class="btn" data-act="recordC">➕ Record another</button>` }), 60);
    }
  });
};
ACT.receipt = async ({ id }) => {
  const c = DB.contributions.find(x => x.id === id); if (!c) return; const m = S.member(c.memberId), no = c.receiptNo || 'RC-' + c.id.slice(-5).toUpperCase();
  const r = await savePDF(`Receipt-${no}.pdf`, 'Payment receipt', `<div class="box"><div class="muted">RECEIPT ${no}</div><div class="big">${money(c.amount)} ${esc(cur())}</div><table style="margin-top:16px"><tr><td class="muted">Received from</td><td><b>${esc(m.name)}</b></td></tr><tr><td class="muted">Phone</td><td>${esc(m.phone)}</td></tr><tr><td class="muted">For period</td><td>${periodLabel(c.period)}</td></tr><tr><td class="muted">Date</td><td>${fdate(c.date)}</td></tr><tr><td class="muted">Method</td><td>${PAY_METHODS[c.method]} ${esc(c.ref || '')}</td></tr><tr><td class="muted">Member total savings</td><td><b>${money(S.savedBy(m.id))} ${esc(cur())}</b></td></tr></table></div><div class="sig"><div>Received by (${esc(c.by)})</div><div>Member signature</div></div>`);
  if (r) toast('Receipt saved');
};
ACT.reverse = ({ t, id }) => {
  if (!guard(can.record())) return; const it = DB[t].find(x => x.id === id); if (!it) return;
  modal({ title: '↩ Reverse entry', danger: true, submit: 'Reverse', body: `<p>This removes the entry of <b>${money(it.amount)} ${esc(cur())}</b> and logs the reversal in the audit trail.</p>${F([{ name: 'why', label: 'Reason', required: true, full: true }])}`, onSubmit: (v) => { DB[t] = DB[t].filter(x => x.id !== id); audit('Entry reversed', `${t}: ${money(it.amount)} — ${v.why}`); commit(); refresh(); toast('Entry reversed'); } });
};
ACT.exportC = async () => { await exportCSV('contributions.csv', [['Receipt', 'Date', 'Member', 'Period', 'Method', 'Amount', 'Recorded by'], ...DB.contributions.map(c => [c.receiptNo || '', fdate(c.date), S.name(c.memberId), periodLabel(c.period), PAY_METHODS[c.method], c.amount, c.by])]); toast('Exported'); };

/* ---- members ---- */
VIEWS.members = () => {
  const q = (VS.q.mem || '').toLowerCase(), f = curTab('mf', 'ACTIVE');
  const list = DB.members.filter(m => (f === 'ALL' || m.status === f) && (m.name + m.phone).toLowerCase().includes(q));
  return `<div class="row wrap">${searchInput('mem', 'Search name or phone')}${tabs('mf', [['ACTIVE', 'Active'], ['SUSPENDED', 'Suspended'], ['ALL', 'All']], 'ACTIVE')}<span class="sp"></span>${can.manage() ? `<button class="btn p" data-act="addMember">➕ Add member</button>` : ''}<button class="btn" data-act="exportM">⬇ Export</button></div>
  <div class="card mt"><div class="tw"><table><thead><tr><th>Member</th><th>Role</th><th>Phone</th><th class="right">Savings</th><th class="right">Arrears</th><th>Reliability</th><th>${periodLabel(curPeriod())}</th></tr></thead><tbody>${list.map(m => { const sc = S.score(m), st = S.periodStatus(m, curPeriod()), ar = S.arrears(m);
    return `<tr class="click" data-act="member" data-id="${m.id}"><td><div class="row">${avatar(m.name, 38)}<div><b>${esc(m.name)}</b><div class="muted" style="font-size:12px">Joined ${fdate(m.joinDate, { month: 'short', year: 'numeric' })}${m.shares > 1 ? ` · ${m.shares} shares` : ''}</div></div></div></td><td>${roleTag(m.role)}</td><td>${esc(m.phone)}</td><td class="right amt">${money(S.savedBy(m.id))}</td><td class="right amt ${ar ? 'out' : ''}">${ar ? money(ar) : '—'}</td>
    <td><span class="sc" style="--p:${sc};--c:${sc > 80 ? 'var(--emerald)' : sc > 55 ? 'var(--gold)' : 'var(--red)'}" data-v="${sc}"></span></td><td>${m.status !== 'ACTIVE' ? pill(m.status, 'bad') : st === 'PAID' ? pill('Paid', 'ok') : st === 'PARTIAL' ? pill('Partial', 'warn') : pill('Unpaid', 'bad')}</td></tr>`; }).join('')}</tbody></table></div>${list.length ? '' : empty('👥', 'No members found')}</div>`;
};
ACT.exportM = async () => { await exportCSV('members.csv', [['Name', 'Role', 'Phone', 'ID number', 'Address', 'Joined', 'Shares', 'Status', 'Savings', 'Arrears'], ...DB.members.map(m => [m.name, ROLES[m.role], m.phone, m.idNumber, m.address, fdate(m.joinDate), m.shares, m.status, S.savedBy(m.id), S.arrears(m)])]); toast('Exported'); };
const memberFields = (m = {}) => F([{ name: 'name', label: 'Full name', required: true, value: m.name, full: true }, { name: 'phone', label: 'Phone', required: true, value: m.phone }, { name: 'idNumber', label: 'National ID', value: m.idNumber }, { name: 'address', label: 'Address', value: m.address }, { name: 'nextOfKin', label: 'Next of kin', value: m.nextOfKin }, { name: 'goal', label: 'Savings goal', value: m.goal, placeholder: 'e.g. School fees' }, { name: 'shares', label: 'Shares (contribution multiplier)', type: 'number', min: 1, value: m.shares || 1 }, { name: 'joinDate', label: 'Join date', type: 'date', value: toInputDate(m.joinDate || Date.now()) }]);
ACT.addMember = () => {
  if (!guard(can.manage(), 'Only the President can add members')) return;
  modal({ title: '➕ Add member', body: memberFields() + `<div class="alert ok mt" style="margin-bottom:0">🔐 The member receives temporary PIN <b>0000</b> and should change it after first sign-in.</div>`, submit: 'Add member', onSubmit: async (v) => {
    if (DB.members.some(m => m.phone === v.phone)) { toast('A member with this phone already exists', true); return false; }
    const m = { id: uid(), name: v.name.trim(), role: 'MEMBER', phone: v.phone, idNumber: v.idNumber, address: v.address, nextOfKin: v.nextOfKin, goal: v.goal, shares: Math.max(1, +v.shares || 1), joinDate: fromInputDate(v.joinDate), status: 'ACTIVE', ...(await makeCred('0000')) };
    DB.members.push(m); audit('Member added', m.name); commit(); refresh(); toast(m.name + ' added');
  } });
};
ACT.member = ({ id }) => {
  const m = S.member(id); if (!m) return; const mine = DB.contributions.filter(c => c.memberId === id).sort((a, b) => b.date - a.date), loans = S.loansOf(id), sc = S.score(m);
  const foot = `${can.manage() ? `<button type="button" class="btn" data-act="editMember" data-id="${id}">✏️ Edit</button><button type="button" class="btn" data-act="resetPin" data-id="${id}">🔑 Reset PIN</button>` : ''}<button type="button" class="btn g" data-act="memberStatement" data-id="${id}">📄 Statement</button>`;
  modal({ wide: true, title: `${esc(m.name)} ${roleTag(m.role)}`, footer: foot, body: `<div class="grid g4">${kpi('a', '💰', 'Savings', moneyC(S.savedBy(id)))}${kpi('c', '⏰', 'Arrears', moneyC(S.arrears(m)))}${kpi('b', '🏦', 'Loan balance', moneyC(loans.filter(l => l.status === 'ACTIVE').reduce((a, l) => a + S.balance(l), 0)))}${kpi('d', '⭐', 'Reliability', sc + '/100', sc > 80 ? 'Excellent' : sc > 55 ? 'Fair' : 'At risk')}</div>
   <div class="grid g2 mt"><div class="card"><h3>Profile</h3><div class="list">${[['📞', 'Phone', m.phone], ['🪪', 'National ID', m.idNumber || '—'], ['📍', 'Address', m.address || '—'], ['👪', 'Next of kin', m.nextOfKin || '—'], ['🎯', 'Goal', m.goal || '—'], ['📅', 'Joined', fdate(m.joinDate)], ['📊', 'Max loan', money(S.maxLoan(m)) + ' ' + cur()]].map(([i, l, v]) => `<div><span>${i}</span><div class="t"><span>${l}</span><b>${esc(v)}</b></div></div>`).join('')}</div></div>
   <div class="card"><h3>Contribution history</h3>${mine.length ? `<div class="list" style="max-height:290px;overflow:auto">${mine.slice(0, 20).map(c => `<div><div class="t"><b>${periodLabel(c.period)}</b><span>${fdate(c.date)} · ${PAY_METHODS[c.method]}</span></div><span class="amt in">+${money(c.amount)}</span></div>`).join('')}</div>` : empty('📭', 'None yet')}</div></div>` });
};
ACT.editMember = ({ id }) => {
  const m = S.member(id); const roleOpts = Object.entries(ROLES).map(([k, v]) => [k, v]);
  modal({ title: '✏️ Edit member', body: memberFields(m) + F([{ name: 'role', label: 'Role', options: roleOpts, value: m.role }, { name: 'status', label: 'Status', options: [['ACTIVE', 'Active'], ['SUSPENDED', 'Suspended'], ['DROPPED', 'Left group']], value: m.status }]), onSubmit: (v) => {
    if (m.role === 'PRESIDENT' && v.role !== 'PRESIDENT' && DB.members.filter(x => x.role === 'PRESIDENT').length < 2) { toast('The group needs a President', true); return false; }
    if (v.role === 'ACCOUNTANT' && DB.members.some(x => x.role === 'ACCOUNTANT' && x.id !== id)) { toast('There is already an Accountant — change their role first', true); return false; }
    Object.assign(m, { name: v.name, phone: v.phone, idNumber: v.idNumber, address: v.address, nextOfKin: v.nextOfKin, goal: v.goal, shares: Math.max(1, +v.shares || 1), joinDate: fromInputDate(v.joinDate), role: v.role, status: v.status });
    audit('Member updated', m.name); commit(); refresh(); toast('Saved');
  } });
};
ACT.resetPin = ({ id }) => { const m = S.member(id); modal({ title: '🔑 Reset PIN', submit: 'Reset to 0000', body: `<p>Reset the PIN of <b>${esc(m.name)}</b> to <b>0000</b>? They should change it at next sign-in.</p>`, onSubmit: async () => { Object.assign(m, await makeCred('0000')); audit('PIN reset', m.name); commit(); toast('PIN reset'); } }); };
ACT.memberStatement = async ({ id }) => {
  const m = S.member(id), mine = DB.contributions.filter(c => c.memberId === id).sort((a, b) => a.date - b.date); let run = 0;
  const loans = S.loansOf(id).filter(l => l.disbursedAt);
  const r = await savePDF(`Statement-${m.name.replace(/\s+/g, '_')}.pdf`, 'Member statement', `<h2>${esc(m.name)}</h2><div class="muted">${esc(m.phone)} · Member since ${fdate(m.joinDate)}</div><div class="kpis"><div class="k">Total savings<b>${money(S.savedBy(id))} ${esc(cur())}</b></div><div class="k">Arrears<b>${money(S.arrears(m))}</b></div><div class="k">Loan balance<b>${money(loans.reduce((a, l) => a + S.balance(l), 0))}</b></div></div>
   <h2>Contributions</h2><table><tr><th>Date</th><th>Period</th><th>Method</th><th class="r">Amount</th><th class="r">Running total</th></tr>${mine.map(c => `<tr><td>${fdate(c.date)}</td><td>${periodLabel(c.period)}</td><td>${PAY_METHODS[c.method]}</td><td class="r">${money(c.amount)}</td><td class="r">${money(run += c.amount)}</td></tr>`).join('')}</table>
   ${loans.length ? `<h2>Loans</h2><table><tr><th>Disbursed</th><th class="r">Principal</th><th class="r">Total to repay</th><th class="r">Paid</th><th class="r">Balance</th><th>Status</th></tr>${loans.map(l => `<tr><td>${fdate(l.disbursedAt)}</td><td class="r">${money(l.principal)}</td><td class="r">${money(l.totalRepay)}</td><td class="r">${money(S.paidOn(l))}</td><td class="r">${money(S.balance(l))}</td><td>${l.status}</td></tr>`).join('')}</table>` : ''}`);
  if (r) toast('Statement saved');
};

/* ---- loans ---- */
VIEWS.loans = () => {
  const f = curTab('lf', 'ALL'), q = (VS.q.loan || '').toLowerCase();
  const list = DB.loans.filter(l => (f === 'ALL' || (f === 'OVERDUE' ? S.overdueOf(l) > 0 : l.status === f)) && S.name(l.memberId).toLowerCase().includes(q)).sort((a, b) => (b.disbursedAt || b.requestedAt) - (a.disbursedAt || a.requestedAt));
  const toAct = can.approve() ? DB.loans.filter(l => l.status === 'PENDING').length : DB.loans.filter(l => l.status === 'APPROVED').length;
  return `<div class="grid g4">${kpi('b', '💸', 'Disbursed', moneyC(S.disbursed()), `${DB.loans.filter(l => l.disbursedAt).length} loans`)}${kpi('a', '✅', 'Repaid', moneyC(S.repaid()))}${kpi('c', '⏳', 'Outstanding', moneyC(S.outstanding()))}${kpi('d', '📈', 'Interest earned', moneyC(S.interestEarned()))}</div>
  ${toAct ? `<div class="alert mt">🔔 <span><b>${toAct}</b> loan${toAct > 1 ? 's' : ''} ${can.approve() ? 'awaiting your approval' : can.record() ? 'approved and ready to disburse' : ''}</span></div>` : ''}
  <div class="row wrap mt">${searchInput('loan', 'Search member')}${tabs('lf', [['ALL', 'All'], ['PENDING', 'Pending'], ['APPROVED', 'Approved'], ['ACTIVE', 'Active'], ['OVERDUE', 'Overdue'], ['PAID', 'Paid off']], 'ALL')}<span class="sp"></span><button class="btn" data-act="calc">🧮 Calculator</button>${can.admin() ? `<button class="btn p" data-act="newLoan">➕ New loan</button>` : ''}</div>
  <div class="card mt"><div class="tw"><table><thead><tr><th>Borrower</th><th class="right">Principal</th><th>Terms</th><th class="right">Repaid</th><th class="right">Balance</th><th>Progress</th><th>Status</th></tr></thead><tbody>${list.map(l => { const pct = l.totalRepay ? S.paidOn(l) / l.totalRepay * 100 : 0;
    return `<tr class="click" data-act="loan" data-id="${l.id}"><td><div class="row">${avatar(S.name(l.memberId), 34)}<div><b>${esc(S.name(l.memberId))}</b><div class="muted" style="font-size:12px">${esc(l.purpose || '')}</div></div></div></td><td class="right amt">${money(l.principal)}</td><td>${l.n} × ${money(l.installment)}<div class="muted" style="font-size:12px">${l.rate}% ${l.type === 'FLAT' ? 'flat' : 'declining'}</div></td><td class="right amt in">${money(S.paidOn(l))}</td><td class="right amt">${money(S.balance(l))}</td><td style="width:130px"><div class="bar-t"><i style="width:${pct}%"></i></div></td><td>${loanPill(l)}</td></tr>`; }).join('')}</tbody></table></div>${list.length ? '' : empty('🏦', 'No loans here')}</div>`;
};
function loanForm(pre = {}) {
  const g = DB.group;
  return F([{ name: 'memberId', label: 'Borrower', options: memberOptions(), value: pre.memberId, required: true, full: true }, { name: 'principal', label: `Amount (${cur()})`, type: 'number', min: 1, required: true, value: pre.principal || 100000 }, { name: 'n', label: 'Installments (months)', type: 'number', min: 1, required: true, value: pre.n || 4 },
    { name: 'rate', label: 'Interest % per month', type: 'number', step: '0.1', value: g.interestRate }, { name: 'type', label: 'Interest type', options: [['FLAT', 'Flat'], ['DECLINING', 'Declining balance']], value: g.interestType }, { name: 'first', label: 'First repayment', type: 'date', value: toInputDate(addMonths(Date.now(), 1)) },
    { name: 'guarantorId', label: 'Guarantor', options: [['', '— None —'], ...memberOptions()] }, { name: 'purpose', label: 'Purpose', value: pre.purpose || '', full: true }]) + `<div id="lprev" class="mt"></div>`;
}
function loanPreview(v) {
  const m = S.member(v.memberId); if (!m) return; const p = +v.principal, n = Math.max(1, +v.n | 0); if (!(p > 0)) return;
  const c = calcLoan(p, +v.rate || 0, n, v.type === 'DECLINING' ? 'DECLINING' : 'FLAT', fromInputDate(v.first)); const over = p > S.maxLoan(m);
  $('#lprev').innerHTML = `<div class="grid g3"><div class="kpi a"><div class="l">Installment</div><div class="v" style="font-size:20px">${money(c.installment)}</div></div><div class="kpi c"><div class="l">Interest</div><div class="v" style="font-size:20px">${money(c.totalInterest)}</div></div><div class="kpi b"><div class="l">Total repay</div><div class="v" style="font-size:20px">${money(c.totalRepay)}</div></div></div>
   ${over ? `<div class="alert bad mt" style="margin-bottom:0">⚠️ <span>Above ${esc(m.name.split(' ')[0])}'s limit of ${money(S.maxLoan(m))} ${cur()} (${DB.group.loanMultiplier}× savings). Approval is at the President's discretion.</span></div>` : `<div class="alert ok mt" style="margin-bottom:0">✅ <span>Within borrowing limit of ${money(S.maxLoan(m))} ${cur()}</span></div>`}`;
}
function createLoan(v, by, autoApproved) {
  const type = v.type === 'DECLINING' ? 'DECLINING' : 'FLAT', c = calcLoan(+v.principal, +v.rate, +v.n, type, fromInputDate(v.first));
  const l = { id: uid(), memberId: v.memberId, principal: +v.principal, rate: +v.rate, type, n: +v.n, purpose: v.purpose, guarantorId: v.guarantorId || '', status: (DB.group.requireApproval && !autoApproved) ? 'PENDING' : 'APPROVED', requestedAt: Date.now(), requestedBy: by, ...c };
  if (l.status === 'APPROVED') l.approvedBy = by; DB.loans.push(l); return l;
}
ACT.newLoan = () => modal({ wide: true, title: '🏦 New loan', submit: DB.group.requireApproval ? 'Submit for approval' : 'Create loan', body: loanForm(), onInput: loanPreview, onSubmit: (v) => {
  const l = createLoan(v, who()); audit('Loan created', `${S.name(l.memberId)} · ${money(l.principal)} (${l.status})`); if (l.status === 'PENDING') notify(`Your loan request of ${money(l.principal)} ${cur()} is awaiting approval`, l.memberId, '⏳'); commit(); refresh(); toast(l.status === 'PENDING' ? 'Sent to the President for approval' : 'Loan approved — ready to disburse');
} });
ACT.calc = () => modal({ title: '🧮 Loan calculator', body: F([{ name: 'principal', label: 'Amount', type: 'number', value: 200000 }, { name: 'n', label: 'Months', type: 'number', value: 6 }, { name: 'rate', label: '% per month', type: 'number', step: '0.1', value: DB.group.interestRate }, { name: 'type', label: 'Type', options: [['FLAT', 'Flat'], ['DECLINING', 'Declining balance']] }, { name: 'first', label: 'Start', type: 'date', value: toInputDate(addMonths(Date.now(), 1)) }]) + `<div id="cres" class="mt"></div>`, onInput: (v) => {
  const c = calcLoan(+v.principal || 0, +v.rate || 0, Math.max(1, +v.n | 0), v.type, fromInputDate(v.first));
  $('#cres').innerHTML = `<div class="grid g3"><div class="kpi a"><div class="l">Installment</div><div class="v" style="font-size:19px">${money(c.installment)}</div></div><div class="kpi c"><div class="l">Interest</div><div class="v" style="font-size:19px">${money(c.totalInterest)}</div></div><div class="kpi b"><div class="l">Total</div><div class="v" style="font-size:19px">${money(c.totalRepay)}</div></div></div><div class="tw mt" style="max-height:220px;overflow:auto"><table><thead><tr><th>#</th><th>Due</th><th class="right">Principal</th><th class="right">Interest</th><th class="right">Payment</th><th class="right">Balance</th></tr></thead><tbody>${c.schedule.map(r => `<tr><td>${r.no}</td><td>${fdate(r.due)}</td><td class="right">${money(r.principal)}</td><td class="right">${money(r.interest)}</td><td class="right"><b>${money(r.total)}</b></td><td class="right">${money(r.balance)}</td></tr>`).join('')}</tbody></table></div>`;
} });
ACT.loan = ({ id }) => {
  const l = DB.loans.find(x => x.id === id); if (!l) return; const m = S.member(l.memberId), paid = S.paidOn(l), pen = S.penaltyFor(l);
  let cum = 0; const reps = DB.repayments.filter(r => r.loanId === id).sort((a, b) => b.date - a.date);
  let actions = '';
  if (l.status === 'PENDING' && can.approve()) actions += `<button type="button" class="btn r" data-act="loanReject" data-id="${id}">✕ Reject</button><button type="button" class="btn p" data-act="loanApprove" data-id="${id}">✔ Approve loan</button>`;
  if (l.status === 'APPROVED' && can.record()) actions += `<button type="button" class="btn g" data-act="loanDisburse" data-id="${id}">💸 Disburse ${money(l.principal)}</button>`;
  if (l.status === 'ACTIVE' && can.record()) actions += `${pen > 0 ? `<button type="button" class="btn r" data-act="loanPenalty" data-id="${id}">⚠ Charge penalty ${money(pen)}</button>` : ''}<button type="button" class="btn p" data-act="repay" data-id="${id}">💵 Record repayment</button>`;
  const sc = l.schedule.map(r => { const before = cum; cum += r.total; const st = paid >= cum - .5 ? 'paid' : paid > before ? 'part' : r.due < Date.now() ? 'late' : ''; return `<tr class="sched-row ${st === 'paid' ? 'paid' : ''}"><td>${r.no}</td><td>${fdate(r.due)}</td><td class="right">${money(r.principal)}</td><td class="right">${money(r.interest)}</td><td class="right"><b>${money(r.total)}</b></td><td>${st === 'paid' ? pill('Paid', 'ok') : st === 'part' ? pill('Partial', 'warn') : st === 'late' ? pill('Overdue', 'bad') : pill('Upcoming')}</td></tr>`; }).join('');
  modal({ wide: true, title: `🏦 ${esc(m.name)} — ${money(l.principal)} ${esc(cur())} ${loanPill(l)}`, footer: actions + `<button type="button" class="btn" data-act="loanStatement" data-id="${id}">📄 PDF</button>`, body: `<div class="grid g4">${kpi('b', '💵', 'Total to repay', moneyC(l.totalRepay), `Interest ${money(l.totalInterest)}`)}${kpi('a', '✅', 'Repaid', moneyC(paid))}${kpi('c', '⏳', 'Balance', moneyC(S.balance(l)))}${kpi('d', '⚠️', 'Overdue', moneyC(S.overdueOf(l)), pen ? `Penalty ${money(pen)}` : 'On track')}</div>
   <div class="grid g21 mt"><div class="card"><h3>📅 Repayment schedule</h3><div class="tw" style="max-height:300px;overflow:auto"><table><thead><tr><th>#</th><th>Due</th><th class="right">Principal</th><th class="right">Interest</th><th class="right">Payment</th><th></th></tr></thead><tbody>${sc}</tbody></table></div></div>
   <div class="card"><h3>Details</h3><div class="list">${[['Purpose', l.purpose || '—'], ['Rate', `${l.rate}% ${l.type === 'FLAT' ? 'flat' : 'declining'}`], ['Guarantor', l.guarantorId ? S.name(l.guarantorId) : '—'], ['Approved by', l.approvedBy || '—'], ['Disbursed', l.disbursedAt ? fdate(l.disbursedAt) : '—']].map(([a, b]) => `<div><div class="t"><span>${a}</span><b>${esc(b)}</b></div></div>`).join('')}</div>
   <h3 class="mt">Payments</h3>${reps.length ? `<div class="list" style="max-height:150px;overflow:auto">${reps.map(r => `<div><div class="t"><b>${fdate(r.date)}</b><span>${PAY_METHODS[r.method] || ''}</span></div><span class="amt in">+${money(r.amount)}</span></div>`).join('')}</div>` : '<div class="muted">No payments yet</div>'}</div></div>` });
};
ACT.loanApprove = ({ id }) => { if (!guard(can.approve(), 'Only the President can approve')) return; const l = DB.loans.find(x => x.id === id); l.status = 'APPROVED'; l.approvedBy = who(); audit('Loan approved', `${S.name(l.memberId)} · ${money(l.principal)}`); notify(`Your loan of ${money(l.principal)} ${cur()} was approved 🎉`, l.memberId, '✅'); commit(); closeModal(); refresh(); toast('Loan approved — the Accountant can now disburse'); };
ACT.loanReject = ({ id }) => modal({ title: 'Reject loan', danger: true, submit: 'Reject', body: F([{ name: 'why', label: 'Reason (shared with member)', required: true, full: true }]), onSubmit: (v) => { const l = DB.loans.find(x => x.id === id); l.status = 'REJECTED'; audit('Loan rejected', `${S.name(l.memberId)} — ${v.why}`); notify(`Your loan request was declined: ${v.why}`, l.memberId, '❌'); commit(); refresh(); toast('Loan rejected'); } });
ACT.loanDisburse = ({ id }) => { if (!guard(can.record(), 'Only the Accountant disburses loans')) return; const l = DB.loans.find(x => x.id === id);
  if (S.cash() < l.principal) return toast(`Not enough cash (${money(S.cash())} ${cur()} available)`, true);
  l.status = 'ACTIVE'; l.disbursedAt = Date.now(); l.disbursedBy = who(); audit('Loan disbursed', `${S.name(l.memberId)} · ${money(l.principal)}`); notify(`Your loan of ${money(l.principal)} ${cur()} has been disbursed. First payment ${fdate(l.schedule[0].due)}.`, l.memberId, '💸'); commit(); closeModal(); refresh(); toast('Loan disbursed'); };
ACT.repay = ({ id }) => { const l = DB.loans.find(x => x.id === id), n = S.nextInstallment(l);
  modal({ title: `💵 Repayment — ${esc(S.name(l.memberId))}`, submit: 'Save repayment', body: F([{ name: 'amount', label: `Amount (${cur()})`, type: 'number', min: 1, required: true, value: Math.round(n ? n.remaining : S.balance(l)), hint: `Balance ${money(S.balance(l))} ${cur()}` }, { name: 'date', label: 'Date', type: 'date', value: toInputDate(Date.now()) }, { name: 'method', label: 'Method', options: Object.entries(PAY_METHODS) }, { name: 'ref', label: 'Reference' }]),
    onSubmit: (v) => { const a = Math.min(+v.amount, S.balance(l)); if (!(a > 0)) { toast('Invalid amount', true); return false; } DB.repayments.push({ id: uid(), loanId: id, amount: a, date: fromInputDate(v.date), method: v.method, ref: v.ref, by: who() });
      audit('Repayment recorded', `${S.name(l.memberId)} · ${money(a)}`); notify(`Loan repayment of ${money(a)} ${cur()} received. Balance ${money(S.balance(l))}.`, l.memberId, '💵'); if (S.balance(l) <= .5) { l.status = 'PAID'; notify('Congratulations — your loan is fully paid! 🎉', l.memberId, '🎉'); } commit(); refresh(); toast('Repayment saved'); setTimeout(() => ACT.loan({ id }), 60); } }); };
ACT.loanPenalty = ({ id }) => { const l = DB.loans.find(x => x.id === id), p = Math.round(S.penaltyFor(l)); DB.income.push({ id: uid(), source: 'Fine', description: `Late repayment penalty — ${S.name(l.memberId)}`, amount: p, date: Date.now(), by: who() }); audit('Penalty charged', `${S.name(l.memberId)} · ${money(p)}`); notify(`A late-payment penalty of ${money(p)} ${cur()} was charged`, l.memberId, '⚠️'); commit(); refresh(); toast('Penalty recorded as group income'); closeModal(); };
ACT.loanStatement = async ({ id }) => { const l = DB.loans.find(x => x.id === id), paid = S.paidOn(l); let cum = 0;
  await savePDF(`Loan-${S.name(l.memberId).replace(/\s+/g, '_')}.pdf`, 'Loan statement', `<h2>${esc(S.name(l.memberId))} — ${money(l.principal)} ${esc(cur())}</h2><div class="kpis"><div class="k">Total repay<b>${money(l.totalRepay)}</b></div><div class="k">Paid<b>${money(paid)}</b></div><div class="k">Balance<b>${money(S.balance(l))}</b></div></div><table><tr><th>#</th><th>Due</th><th class="r">Principal</th><th class="r">Interest</th><th class="r">Payment</th><th>Status</th></tr>${l.schedule.map(r => { cum += r.total; return `<tr><td>${r.no}</td><td>${fdate(r.due)}</td><td class="r">${money(r.principal)}</td><td class="r">${money(r.interest)}</td><td class="r">${money(r.total)}</td><td>${paid >= cum - .5 ? 'Paid' : ''}</td></tr>`; }).join('')}</table>`); };

/* ---- my savings / my loans (member) ---- */
VIEWS.mysavings = () => {
  const m = SESSION, mine = DB.contributions.filter(c => c.memberId === m.id).sort((a, b) => b.date - a.date), p = curPeriod();
  const perRows = []; for (let i = periodIdx(m.joinDate); i <= p; i++) perRows.push(i); const hist = perRows.slice(-12).reverse();
  return `<div class="grid g4">${kpi('a', '💰', 'Total saved', moneyC(S.savedBy(m.id)), `${mine.length} payments`)}${kpi('c', '🎯', 'Expected / period', moneyC(S.expectedPer(m)))}${kpi('b', '⏰', 'Arrears', moneyC(S.arrears(m)), S.arrears(m) ? 'Please pay soon' : 'All clear')}${kpi('d', '🏆', 'Reliability', S.score(m) + '/100')}</div>
  <div class="grid g12 mt"><div class="card"><h3>📆 Payment calendar</h3><div class="list">${hist.map(x => { const st = S.periodStatus(m, x); return `<div><div class="t"><b>${periodLabel(x)}</b><span>${money(S.paidInPeriod(m.id, x))} / ${money(S.expectedPer(m))}</span></div>${st === 'PAID' ? pill('Paid', 'ok') : st === 'PARTIAL' ? pill('Partial', 'warn') : pill('Unpaid', 'bad')}</div>`; }).join('')}</div></div>
  <div class="card"><h3>🧾 Transaction history <span class="sp"></span><button class="btn s g" data-act="memberStatement" data-id="${m.id}">📄 My statement</button></h3>${mine.length ? `<div class="tw"><table><thead><tr><th>Receipt</th><th>Date</th><th>Period</th><th>Method</th><th class="right">Amount</th><th></th></tr></thead><tbody>${mine.map(c => `<tr><td>${esc(c.receiptNo || '—')}</td><td>${fdate(c.date)}</td><td>${periodLabel(c.period)}</td><td>${PAY_METHODS[c.method]}</td><td class="right amt in">+${money(c.amount)}</td><td><button class="btn s" data-act="receipt" data-id="${c.id}">🧾</button></td></tr>`).join('')}</tbody></table></div>` : empty('📭', 'No payments yet')}</div></div>`;
};
VIEWS.myloans = () => {
  const ls = S.loansOf(SESSION.id).sort((a, b) => b.requestedAt - a.requestedAt);
  return `<div class="row"><div class="alert ok sp" style="margin:0">💡 <span>You can borrow up to <b>${money(S.maxLoan(SESSION))} ${esc(cur())}</b> (${DB.group.loanMultiplier}× your savings)</span></div><button class="btn p" data-act="reqLoan">➕ Request a loan</button></div>
  <div class="mt grid g2">${ls.map(l => `<div class="card" style="cursor:pointer" data-act="loan" data-id="${l.id}"><div class="row"><h3 style="margin:0">${money(l.principal)} ${esc(cur())}</h3><span class="sp"></span>${loanPill(l)}</div><div class="muted mt">${esc(l.purpose || '')}</div><div class="bar-t mt"><i style="width:${l.totalRepay ? S.paidOn(l) / l.totalRepay * 100 : 0}%"></i></div><div class="row mt"><small>Paid ${money(S.paidOn(l))}</small><span class="sp"></span><small>Balance ${money(S.balance(l))}</small></div></div>`).join('') || `<div class="card" style="grid-column:1/-1">${empty('🏦', 'You have no loans', 'Request one when you need it')}</div>`}</div>`;
};

/* ---- requests ---- */
const reqLabel = (t) => ({ LOAN: 'Loan request', LATE: 'Late notice', ABSENT: 'Absence notice', OTHER: 'Message' }[t]);
VIEWS.requests = () => {
  const mem = SESSION.role === 'MEMBER', f = curTab('rf', 'PENDING');
  const list = DB.requests.filter(r => (mem ? r.memberId === SESSION.id : true) && (f === 'ALL' || r.status === f)).sort((a, b) => b.at - a.at);
  const pendingLoans = can.approve() ? DB.loans.filter(l => l.status === 'PENDING') : [];
  return `<div class="row">${tabs('rf', [['PENDING', 'Pending'], ['ALL', 'All']], 'PENDING')}<span class="sp"></span>${mem ? `<button class="btn" data-act="reqNote">💬 Send notice</button><button class="btn p" data-act="reqLoan">🏦 Request loan</button>` : ''}</div>
  ${pendingLoans.length && f === 'PENDING' ? `<div class="card mt"><h3>🏦 Loans awaiting approval</h3><div class="list">${pendingLoans.map(l => `<div>${avatar(S.name(l.memberId), 38)}<div class="t"><b>${esc(S.name(l.memberId))} — ${money(l.principal)} ${esc(cur())}</b><span>${l.n} months · ${esc(l.purpose || '')}</span></div><button class="btn s p" data-act="loan" data-id="${l.id}">Review</button></div>`).join('')}</div></div>` : ''}
  <div class="card mt"><h3>📨 Requests & notices</h3>${list.length ? `<div class="list">${list.map(r => `<div>${avatar(S.name(r.memberId), 40)}<div class="t"><b>${esc(S.name(r.memberId))} · ${reqLabel(r.type)}${r.amount ? ` · ${money(r.amount)} ${esc(cur())} × ${r.n} months` : ''}</b><span>${esc(r.message)} · ${ago(r.at)}${r.reply ? ` · <i>Reply: ${esc(r.reply)}</i>` : ''}</span></div>${r.status === 'PENDING' ? (can.approve() ? `<button class="btn s r" data-act="reqDecide" data-id="${r.id}" data-d="REJECTED">Decline</button><button class="btn s p" data-act="reqDecide" data-id="${r.id}" data-d="APPROVED">${r.type === 'LOAN' ? 'Approve' : 'Acknowledge'}</button>` : pill('Pending', 'warn')) : pill(r.status === 'APPROVED' ? 'Approved' : 'Declined', r.status === 'APPROVED' ? 'ok' : 'bad')}</div>`).join('')}</div>` : empty('📭', 'Nothing here')}</div>`;
};
ACT.reqLoan = () => modal({ title: '🏦 Request a loan', submit: 'Send request', body: `<div class="alert ok" style="margin-bottom:12px">💡 <span>Your limit is <b>${money(S.maxLoan(SESSION))} ${esc(cur())}</b></span></div>` + F([{ name: 'amount', label: `Amount (${cur()})`, type: 'number', min: 1, required: true, value: 50000 }, { name: 'n', label: 'Months to repay', type: 'number', min: 1, required: true, value: 3 }, { name: 'message', label: 'Purpose', required: true, full: true }]), onSubmit: (v) => {
  DB.requests.push({ id: uid(), memberId: SESSION.id, type: 'LOAN', message: v.message, amount: +v.amount, n: +v.n, status: 'PENDING', at: Date.now() }); audit('Loan requested', `${SESSION.name} · ${money(+v.amount)}`); commit(); refresh(); toast('Request sent to the President'); } });
ACT.reqNote = () => modal({ title: '💬 Send a notice', submit: 'Send', body: F([{ name: 'type', label: 'Type', options: [['LATE', 'I will be late'], ['ABSENT', 'I will be absent'], ['OTHER', 'Other message']], full: true }, { name: 'message', label: 'Message', type: 'textarea', required: true, full: true }]), onSubmit: (v) => { DB.requests.push({ id: uid(), memberId: SESSION.id, type: v.type, message: v.message, amount: 0, n: 0, status: 'PENDING', at: Date.now() }); commit(); refresh(); toast('Notice sent'); } });
ACT.reqDecide = ({ id, d }) => {
  if (!guard(can.approve())) return; const r = DB.requests.find(x => x.id === id);
  modal({ title: d === 'APPROVED' ? '✔ Approve' : '✕ Decline', danger: d !== 'APPROVED', submit: d === 'APPROVED' ? 'Confirm' : 'Decline', body: `<p><b>${esc(S.name(r.memberId))}</b>: ${esc(r.message)}</p>${F([{ name: 'reply', label: 'Note to member (optional)', full: true }])}`, onSubmit: (v) => {
    r.status = d; r.reply = v.reply; r.by = who();
    if (r.type === 'LOAN' && d === 'APPROVED') { const l = createLoan({ memberId: r.memberId, principal: r.amount, n: r.n, rate: DB.group.interestRate, type: DB.group.interestType, first: toInputDate(addMonths(Date.now(), 1)), purpose: r.message }, who(), true); audit('Loan request approved', `${S.name(r.memberId)} · ${money(r.amount)}`); notify(`Your loan request of ${money(r.amount)} ${cur()} was approved. The Accountant will disburse it.`, r.memberId, '✅'); }
    else notify(`Your ${reqLabel(r.type).toLowerCase()} was ${d === 'APPROVED' ? 'acknowledged' : 'declined'}${v.reply ? ': ' + v.reply : ''}`, r.memberId, d === 'APPROVED' ? '✅' : '❌');
    commit(); refresh(); toast('Done'); } });
};

/* ---- finance ---- */
VIEWS.finance = () => {
  const f = curTab('ff', 'exp'), m6 = S.monthly(6), byCat = {}, bySrc = {};
  DB.expenses.forEach(e => byCat[e.category] = (byCat[e.category] || 0) + e.amount); DB.income.forEach(e => bySrc[e.source] = (bySrc[e.source] || 0) + e.amount);
  const pal = ['#12804a', '#f5b301', '#2563eb', '#7c3aed', '#ef5350', '#0ea5a4', '#ea7a0c'];
  const list = (f === 'exp' ? DB.expenses : DB.income).slice().sort((a, b) => b.date - a.date);
  return `<div class="grid g4">${kpi('a', '💵', 'Cash in hand', moneyC(S.cash()))}${kpi('c', '✨', 'Other income', moneyC(S.income()), `${DB.income.length} entries`)}${kpi('d', '🧾', 'Expenses', moneyC(S.expenses()), `${DB.expenses.length} entries`)}${kpi('b', '⚖️', 'Net (income − expenses)', moneyC(S.income() - S.expenses()))}</div>
  <div class="grid g2 mt"><div class="card"><h3>Expenses by category</h3>${Charts.donut(Object.entries(byCat).map(([l, v], i) => ({ l, v, c: pal[i % 7] })), money(S.expenses(), true), 'total')}</div><div class="card"><h3>Income by source</h3>${Charts.donut(Object.entries(bySrc).map(([l, v], i) => ({ l, v, c: pal[(i + 2) % 7] })), money(S.income(), true), 'total')}</div></div>
  <div class="card mt"><h3>${tabs('ff', [['exp', '🧾 Expenses'], ['inc', '✨ Income & fines']], 'exp')}<span class="sp"></span>${can.record() ? `<button class="btn p" data-act="${f === 'exp' ? 'addExp' : 'addInc'}">➕ Add ${f === 'exp' ? 'expense' : 'income'}</button>` : '<span class="pill info">👁 View-only</span>'}</h3>
  ${list.length ? `<div class="tw"><table><thead><tr><th>Date</th><th>${f === 'exp' ? 'Category' : 'Source'}</th><th>Description</th><th class="right">Amount</th><th>By</th><th></th></tr></thead><tbody>${list.map(e => `<tr><td>${fdate(e.date)}</td><td>${pill(esc(e.category || e.source), f === 'exp' ? 'bad' : 'ok')}</td><td>${esc(e.description)}</td><td class="right amt ${f === 'exp' ? 'out' : 'in'}">${f === 'exp' ? '−' : '+'}${money(e.amount)}</td><td class="muted">${esc(e.by)}</td><td class="right">${can.record() ? `<button class="btn s r" data-act="reverse" data-t="${f === 'exp' ? 'expenses' : 'income'}" data-id="${e.id}">↩</button>` : ''}</td></tr>`).join('')}</tbody></table></div>` : empty('🧾', 'No entries yet')}</div>`;
};
ACT.addExp = () => guard(can.record()) && modal({ title: '🧾 Add expense', body: F([{ name: 'category', label: 'Category', options: ['Stationery', 'Meeting', 'Transport', 'Solidarity', 'Bank charges', 'Rent', 'Other'] }, { name: 'amount', label: 'Amount', type: 'number', min: 1, required: true }, { name: 'description', label: 'Description', required: true, full: true }, { name: 'date', label: 'Date', type: 'date', value: toInputDate(Date.now()) }]) + (S.cash() < 0 ? '' : ''), onSubmit: (v) => { if (+v.amount > S.cash()) { toast('Expense exceeds cash in hand', true); return false; } DB.expenses.push({ id: uid(), category: v.category, description: v.description, amount: +v.amount, date: fromInputDate(v.date), by: who(), approvedBy: '' }); audit('Expense recorded', `${v.category} · ${money(+v.amount)}`); commit(); refresh(); toast('Expense saved'); } });
ACT.addInc = () => guard(can.record()) && modal({ title: '✨ Add income', body: F([{ name: 'source', label: 'Source', options: ['Fine', 'Membership fee', 'Donation', 'Interest', 'Other'] }, { name: 'amount', label: 'Amount', type: 'number', min: 1, required: true }, { name: 'description', label: 'Description', required: true, full: true }, { name: 'date', label: 'Date', type: 'date', value: toInputDate(Date.now()) }]), onSubmit: (v) => { DB.income.push({ id: uid(), source: v.source, description: v.description, amount: +v.amount, date: fromInputDate(v.date), by: who() }); audit('Income recorded', `${v.source} · ${money(+v.amount)}`); commit(); refresh(); toast('Income saved'); } });

/* ---- rotation ---- */
VIEWS.rotation = () => {
  const r = DB.rotation, order = r.order.map(S.member).filter(Boolean), pos = order.length ? r.pos % order.length : 0, next = order[pos], pot = S.active().length * DB.group.amount;
  return `<div class="hero"><div class="l">Next pot recipient</div><div class="big" style="font-size:32px">${next ? esc(next.name) : 'No rotation yet'}</div><div style="opacity:.8">Suggested pot: ${money(pot)} ${esc(cur())} (${S.active().length} members × ${money(DB.group.amount)})</div>
   <div class="chips">${can.record() && next ? `<button class="btn g" data-act="payout">💸 Record payout</button>` : ''}${can.manage() ? `<button class="btn" data-act="editRotation">✏️ Edit order</button>` : ''}</div></div>
  <div class="card mt"><h3>🔄 Rotation order</h3>${order.length ? `<div class="rot">${order.map((m, i) => { const got = DB.payouts.some(p => p.memberId === m.id); return `<div class="rc ${i === pos ? 'next' : ''} ${got && i !== pos ? 'done' : ''}"><b style="font-size:18px;color:var(--muted)">${i + 1}</b>${avatar(m.name, 36)}<div><b>${esc(m.name)}</b><div class="muted" style="font-size:12px">${i === pos ? '⭐ Next' : got ? '✅ Received' : 'Waiting'}</div></div></div>`; }).join('')}</div>` : empty('🔄', 'No rotation set', can.manage() ? 'Use “Edit order” to choose members' : '')}</div>
  <div class="card mt"><h3>📜 Payout history</h3>${DB.payouts.length ? `<div class="list">${[...DB.payouts].sort((a, b) => b.date - a.date).map(p => `<div>${avatar(S.name(p.memberId), 36)}<div class="t"><b>${esc(S.name(p.memberId))}</b><span>${fdate(p.date)} · ${esc(p.note || '')} · by ${esc(p.by)}</span></div><span class="amt out">−${money(p.amount)}</span></div>`).join('')}</div>` : empty('📜', 'No payouts yet')}</div>`;
};
ACT.payout = () => { const r = DB.rotation, m = S.member(r.order[r.pos % r.order.length]);
  modal({ title: '💸 Record pot payout', submit: 'Pay out', body: `<div class="alert ok">⭐ <span>Recipient: <b>${esc(m.name)}</b></span></div>` + F([{ name: 'amount', label: `Amount (${cur()})`, type: 'number', required: true, value: S.active().length * DB.group.amount, min: 1 }, { name: 'note', label: 'Note', value: `Round ${DB.payouts.length + 1}` }]), onSubmit: (v) => { if (+v.amount > S.cash()) { toast('Not enough cash in hand', true); return false; } DB.payouts.push({ id: uid(), memberId: m.id, amount: +v.amount, date: Date.now(), note: v.note, by: who() }); r.pos = (r.pos + 1) % r.order.length; audit('Pot payout', `${m.name} · ${money(+v.amount)}`); notify(`You received the pot of ${money(+v.amount)} ${cur()} 🎉`, m.id, '🎉'); commit(); refresh(); toast('Payout recorded'); } }); };
ACT.editRotation = () => { const cur0 = DB.rotation.order.slice(); modal({ title: '✏️ Rotation order', submit: 'Save', body: `<p class="muted">Tick members and order them with the arrows.</p><div id="rotlist" class="list"></div>`, onSubmit: () => { DB.rotation.order = cur0; DB.rotation.pos = 0; audit('Rotation updated', cur0.length + ' members'); commit(); refresh(); } });
  const draw = () => { const rest = S.active().filter(m => !cur0.includes(m.id)); $('#rotlist').innerHTML = cur0.map((id, i) => `<div><b>${i + 1}</b>${avatar(S.name(id), 30)}<div class="t"><b>${esc(S.name(id))}</b></div><button type="button" class="btn s" data-x="up" data-i="${i}">↑</button><button type="button" class="btn s" data-x="dn" data-i="${i}">↓</button><button type="button" class="btn s r" data-x="rm" data-i="${i}">✕</button></div>`).join('') + rest.map(m => `<div style="opacity:.7">${avatar(m.name, 30)}<div class="t"><b>${esc(m.name)}</b></div><button type="button" class="btn s" data-x="add" data-id="${m.id}">＋ Add</button></div>`).join(''); };
  draw(); $('#rotlist').onclick = (e) => { const b = e.target.closest('[data-x]'); if (!b) return; const i = +b.dataset.i, x = b.dataset.x; if (x === 'up' && i > 0) [cur0[i - 1], cur0[i]] = [cur0[i], cur0[i - 1]]; if (x === 'dn' && i < cur0.length - 1) [cur0[i + 1], cur0[i]] = [cur0[i], cur0[i + 1]]; if (x === 'rm') cur0.splice(i, 1); if (x === 'add') cur0.push(b.dataset.id); draw(); }; };

/* ---- meetings ---- */
VIEWS.meetings = () => {
  const up = DB.meetings.filter(m => !m.done).sort((a, b) => a.at - b.at), past = DB.meetings.filter(m => m.done).sort((a, b) => b.at - a.at);
  const card = (m) => { const at = m.attendance || {}, present = Object.values(at).filter(x => x === 'PRESENT').length; return `<div class="card"><div class="row"><div style="background:var(--mint);border-radius:14px;padding:8px 14px;text-align:center;min-width:64px"><b style="font-size:22px;color:var(--emerald)">${new Date(m.at).getDate()}</b><div style="font-size:11px;text-transform:uppercase">${fdate(m.at, { month: 'short' })}</div></div><div class="sp"><h3 style="margin:0">${esc(m.title)}</h3><div class="muted">${ftime(m.at)} · ${esc(m.location)}</div></div>${m.done ? pill('Held', 'pur') : pill('Upcoming', 'info')}</div>
   ${m.agenda ? `<p class="muted" style="margin:12px 0 0">📋 ${esc(m.agenda)}</p>` : ''}${m.minutes ? `<div class="ann mt"><b>📝 Minutes</b><p>${esc(m.minutes)}</p></div>` : ''}
   ${SESSION.role === 'MEMBER' ? (m.done && at[SESSION.id] ? `<div class="mt">${at[SESSION.id] === 'PRESENT' ? pill('You attended ✅', 'ok') : pill('You were absent', 'bad')}</div>` : '') : `<div class="row mt">${m.done ? `<span class="muted">Attendance: ${present}/${Object.keys(at).length}</span>` : ''}<span class="sp"></span><button class="btn s" data-act="meeting" data-id="${m.id}">${m.done ? 'Details' : '✔ Attendance & minutes'}</button></div>`}</div>`; };
  return `<div class="row"><span class="sp"></span>${can.manage() ? `<button class="btn p" data-act="addMeeting">➕ Schedule meeting</button>` : ''}</div><h3 class="mt" style="margin-bottom:12px">Upcoming</h3><div class="grid g2">${up.map(card).join('') || `<div class="card" style="grid-column:1/-1">${empty('📅', 'No upcoming meetings')}</div>`}</div><h3 class="mt" style="margin-bottom:12px">Past meetings</h3><div class="grid g2">${past.map(card).join('') || `<div class="card">${empty('🗓️', 'No past meetings')}</div>`}</div>`;
};
ACT.addMeeting = () => modal({ title: '📅 Schedule meeting', body: F([{ name: 'title', label: 'Title', required: true, value: 'General meeting', full: true }, { name: 'date', label: 'Date', type: 'date', required: true, value: toInputDate(Date.now() + 7 * DAY) }, { name: 'time', label: 'Time', type: 'time', value: '14:00' }, { name: 'location', label: 'Location', full: true }, { name: 'agenda', label: 'Agenda', type: 'textarea', full: true }]), onSubmit: (v) => { const at = new Date(v.date + 'T' + v.time).getTime(); DB.meetings.push({ id: uid(), title: v.title, at, location: v.location, agenda: v.agenda, minutes: '', done: false, attendance: {} }); DB.notes.unshift({ id: uid(), text: `New meeting: ${v.title} on ${fdate(at)}`, memberId: null, icon: '📅', at: Date.now() }); S.active().forEach(m => notify(`Meeting scheduled: ${v.title} on ${fdate(at)} at ${v.location || 'TBA'}`, m.id, '📅')); audit('Meeting scheduled', v.title); commit(); refresh(); toast('Meeting scheduled'); } });
ACT.meeting = ({ id }) => { const m = DB.meetings.find(x => x.id === id), at = m.attendance || {}; const editable = can.admin();
  modal({ wide: true, title: `📅 ${esc(m.title)}`, submit: 'Save & mark held', body: `<div class="fg"><div class="full"><label class="f">Minutes / decisions</label><textarea name="minutes" rows="3">${esc(m.minutes)}</textarea></div></div><h4 class="mt">Attendance</h4><div class="board mt">${S.active().map(x => `<label class="bm" style="cursor:pointer">${avatar(x.name, 32)}<div class="n"><b>${esc(x.name)}</b></div><select name="a_${x.id}" style="width:auto;padding:4px 6px"><option value="PRESENT" ${at[x.id] === 'PRESENT' ? 'selected' : ''}>Present</option><option value="ABSENT" ${at[x.id] === 'ABSENT' || !at[x.id] ? 'selected' : ''}>Absent</option></select></label>`).join('')}</div>`, onSubmit: (v) => { m.minutes = v.minutes; m.attendance = {}; S.active().forEach(x => m.attendance[x.id] = v['a_' + x.id]); m.done = true; audit('Meeting held', `${m.title} — ${Object.values(m.attendance).filter(a => a === 'PRESENT').length} present`); commit(); refresh(); toast('Meeting saved'); } }); };

/* ---- announcements ---- */
VIEWS.announcements = () => `<div class="row"><span class="sp"></span>${can.manage() ? `<button class="btn p" data-act="postAnn">📣 New announcement</button>` : ''}</div><div class="mt" style="max-width:860px">${[...DB.announcements].sort((a, b) => (b.pinned - a.pinned) || b.at - a.at).map(a => `<div class="ann ${a.pinned ? 'pin' : ''}"><div class="row"><h4>${a.pinned ? '📌 ' : ''}${esc(a.title)}</h4><span class="sp"></span>${can.manage() ? `<button class="btn s" data-act="pinAnn" data-id="${a.id}">${a.pinned ? 'Unpin' : 'Pin'}</button><button class="btn s r" data-act="delAnn" data-id="${a.id}">🗑</button>` : ''}</div><p>${esc(a.body)}</p><small>${esc(a.by)} · ${fdate(a.at)}</small></div>`).join('') || empty('📣', 'No announcements yet')}</div>`;
ACT.postAnn = () => guard(can.manage(), 'Only the President posts announcements') && modal({ title: '📣 New announcement', submit: 'Publish', body: F([{ name: 'title', label: 'Title', required: true, full: true }, { name: 'body', label: 'Message', type: 'textarea', required: true, full: true }, { name: 'pin', label: 'Pin to top?', options: [['0', 'No'], ['1', 'Yes']] }]), onSubmit: (v) => { DB.announcements.push({ id: uid(), title: v.title, body: v.body, pinned: v.pin === '1', at: Date.now(), by: who() }); S.active().forEach(m => notify(`📣 ${v.title}`, m.id, '📣')); audit('Announcement posted', v.title); commit(); refresh(); toast('Published to all members'); } });
ACT.pinAnn = ({ id }) => { const a = DB.announcements.find(x => x.id === id); a.pinned = !a.pinned; commit(); refresh(); };
ACT.delAnn = ({ id }) => { DB.announcements = DB.announcements.filter(x => x.id !== id); audit('Announcement removed', ''); commit(); refresh(); };

/* ---- analytics (president) ---- */
VIEWS.analytics = () => {
  if (!can.admin()) return empty('🔒', 'Not available');
  const m12 = S.monthly(12); let run = 0; const cum = m12.map(x => run += x.savings);
  const ranked = S.rankSavers(), pal = ['#12804a', '#f5b301', '#2563eb', '#7c3aed', '#ef5350', '#0ea5a4'];
  const risky = S.active().map(m => ({ m, sc: S.score(m), ar: S.arrears(m) })).filter(x => x.sc < 75).sort((a, b) => a.sc - b.sc).slice(0, 6);
  const loansByStatus = [['Active', S.outstanding(), '#2563eb'], ['Repaid', S.repaid(), '#12804a'], ['Interest earned', S.interestEarned(), '#f5b301']];
  const rate = S.active().length ? Math.round(S.active().filter(m => S.arrears(m) === 0).length / S.active().length * 100) : 0;
  return `<div class="grid g4">${kpi('a', '💰', 'Avg savings / member', moneyC(S.totalSavings() / Math.max(1, S.active().length)))}${kpi('b', '✅', 'Members up-to-date', rate + '%', 'No arrears')}${kpi('c', '🏦', 'Loan book / savings', S.totalSavings() ? Math.round(S.outstanding() / S.totalSavings() * 100) + '%' : '0%', 'Lending ratio')}${kpi('d', '📈', 'Return on savings', S.totalSavings() ? (((S.interestEarned() + S.income() - S.expenses()) / S.totalSavings()) * 100).toFixed(1) + '%' : '0%', 'Net gain / savings')}</div>
  <div class="grid g2 mt"><div class="card"><h3>📊 Monthly cash flow (12 months)</h3>${Charts.bars(m12, ['savings', 'expenses'], ['#12804a', '#ef5350'])}</div><div class="card"><h3>📈 Cumulative savings</h3>${Charts.area(cum, 'var(--blue)', 210, m12.map((x, i) => i % 2 ? '' : x.label))}</div></div>
  <div class="grid g3 mt"><div class="card"><h3>🏆 Savings by member</h3>${Charts.hbars(ranked.slice(0, 8).map((x, i) => ({ l: x.m.name, v: x.v, c: pal[i % 6] })))}</div><div class="card"><h3>🏦 Loan portfolio</h3>${Charts.donut(loansByStatus.map(([l, v, c]) => ({ l, v, c })), money(S.disbursed(), true), 'disbursed')}</div>
   <div class="card"><h3>⚠️ Members needing attention</h3>${risky.length ? `<div class="list">${risky.map(x => `<div>${avatar(x.m.name, 34)}<div class="t"><b>${esc(x.m.name)}</b><span>Arrears ${money(x.ar)}</span></div>${pill(x.sc + '/100', x.sc < 55 ? 'bad' : 'warn')}</div>`).join('')}</div>` : empty('🎉', 'Everyone is on track')}</div></div>`;
};

/* ---- reports ---- */
VIEWS.reports = () => `<div class="grid g3">
  ${[['📘', 'Group financial statement', 'Cash, savings, loans, income and expenses in one PDF.', 'groupPDF', 'Generate PDF'],
    ['👤', 'Member statements', 'Choose any member and export a full PDF statement.', 'pickStatement', 'Choose member'],
    ['🎁', 'Share-out calculator', 'Fair year-end distribution proportional to each member’s savings.', 'shareout', 'Open calculator'],
    ['💰', 'Contributions (Excel/CSV)', 'Every contribution, ready for Excel.', 'exportC', 'Export CSV'],
    ['🏦', 'Loans (Excel/CSV)', 'All loans with status and balances.', 'exportL', 'Export CSV'],
    ['🧾', 'Expenses & income (CSV)', 'Group cashbook entries.', 'exportF', 'Export CSV'],
    ['👥', 'Members register', 'Contact list with savings & arrears.', 'exportM', 'Export CSV'],
    ...(can.manage() ? [['💾', 'Backup all data', 'Save a full backup file you can restore anywhere.', 'backup', 'Save backup']] : [])].map(([i, t, d, a, b]) => `<div class="card"><div style="font-size:34px">${i}</div><h3 style="margin:10px 0 6px">${t}</h3><p class="muted" style="margin:0 0 14px;min-height:38px">${d}</p><button class="btn p" data-act="${a}">${b}</button></div>`).join('')}</div>`;
ACT.groupPDF = async () => { const m = S.monthly(6); const r = await savePDF('Group-statement.pdf', 'Financial statement', `<div class="kpis"><div class="k">Cash in hand<b>${money(S.cash())} ${esc(cur())}</b></div><div class="k">Total savings<b>${money(S.totalSavings())}</b></div><div class="k">Loans outstanding<b>${money(S.outstanding())}</b></div><div class="k">Interest earned<b>${money(S.interestEarned())}</b></div></div>
  <h2>Monthly summary</h2><table><tr><th>Month</th><th class="r">Savings</th><th class="r">Income</th><th class="r">Expenses</th></tr>${m.map(x => `<tr><td>${x.label}</td><td class="r">${money(x.savings)}</td><td class="r">${money(x.income)}</td><td class="r">${money(x.expenses)}</td></tr>`).join('')}</table>
  <h2>Member balances</h2><table><tr><th>Member</th><th class="r">Savings</th><th class="r">Arrears</th><th class="r">Loan balance</th></tr>${S.active().map(x => `<tr><td>${esc(x.name)}</td><td class="r">${money(S.savedBy(x.id))}</td><td class="r">${money(S.arrears(x))}</td><td class="r">${money(S.loansOf(x.id).filter(l => l.status === 'ACTIVE').reduce((a, l) => a + S.balance(l), 0))}</td></tr>`).join('')}</table><div class="sig"><div>President</div><div>Accountant</div></div>`); if (r) toast('Statement saved'); };
ACT.pickStatement = () => modal({ title: '👤 Member statement', submit: 'Generate PDF', body: F([{ name: 'id', label: 'Member', options: memberOptions(DB.members), full: true }]), onSubmit: (v) => ACT.memberStatement({ id: v.id }) });
ACT.exportL = async () => { await exportCSV('loans.csv', [['Borrower', 'Status', 'Principal', 'Rate %', 'Type', 'Installments', 'Total repay', 'Paid', 'Balance', 'Disbursed', 'Purpose'], ...DB.loans.map(l => [S.name(l.memberId), l.status, l.principal, l.rate, l.type, l.n, Math.round(l.totalRepay), S.paidOn(l), Math.round(S.balance(l)), l.disbursedAt ? fdate(l.disbursedAt) : '', l.purpose])]); toast('Exported'); };
ACT.exportF = async () => { await exportCSV('cashbook.csv', [['Type', 'Date', 'Category', 'Description', 'Amount', 'By'], ...DB.income.map(e => ['Income', fdate(e.date), e.source, e.description, e.amount, e.by]), ...DB.expenses.map(e => ['Expense', fdate(e.date), e.category, e.description, e.amount, e.by])]); toast('Exported'); };
ACT.backup = async () => { const c = JSON.stringify(Object.assign({}, DB, { cloud: undefined }), null, 1); if (window.api) await window.api.exportFile({ name: `ikimina-backup-${toInputDate(Date.now())}.json`, content: c, filters: [{ name: 'Backup', extensions: ['json'] }] }); else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([c])); a.download = 'ikimina-backup.json'; a.click(); } audit('Backup created', ''); commit(); toast('Backup saved'); };
ACT.shareout = () => { const pool = Math.max(0, S.cash() + S.outstanding()), tot = S.totalSavings() || 1; const rows = S.active().map(m => ({ m, sv: S.savedBy(m.id), sh: S.savedBy(m.id) / tot * pool })).sort((a, b) => b.sv - a.sv);
  modal({ wide: true, title: '🎁 Share-out calculator', submit: 'Save PDF', body: `<div class="grid g3">${kpi('a', '💰', 'Distributable pool', moneyC(pool), 'Cash + loans out')}${kpi('b', '👥', 'Members', S.active().length)}${kpi('c', '📈', 'Growth on savings', ((pool / tot - 1) * 100).toFixed(1) + '%')}</div><div class="tw mt" style="max-height:340px"><table><thead><tr><th>Member</th><th class="right">Savings</th><th class="right">Share %</th><th class="right">Payout</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.m.name)}</td><td class="right">${money(r.sv)}</td><td class="right">${(r.sv / tot * 100).toFixed(1)}%</td><td class="right"><b>${money(r.sh)}</b></td></tr>`).join('')}</tbody></table></div><p class="muted">Payout = member savings ÷ total savings × pool. Outstanding loans are counted in the pool and settled as repaid.</p>`, onSubmit: async () => { await savePDF('Share-out.pdf', 'Share-out plan', `<div class="kpis"><div class="k">Pool<b>${money(pool)} ${esc(cur())}</b></div></div><table><tr><th>Member</th><th class="r">Savings</th><th class="r">Share</th><th class="r">Payout</th></tr>${rows.map(r => `<tr><td>${esc(r.m.name)}</td><td class="r">${money(r.sv)}</td><td class="r">${(r.sv / tot * 100).toFixed(1)}%</td><td class="r">${money(r.sh)}</td></tr>`).join('')}</table>`); } }); };

/* ---- audit ---- */
VIEWS.audit = () => { const q = (VS.q.aud || '').toLowerCase(); const l = DB.audit.filter(a => (a.action + a.details + a.by).toLowerCase().includes(q)).slice(0, 200);
  return `<div class="row">${searchInput('aud', 'Filter log')}<span class="sp"></span><span class="pill ok">🛡 Tamper-evident trail of every action</span></div><div class="card mt">${l.length ? `<div class="timeline">${l.map(a => `<div><b>${esc(a.action)}</b> <span class="muted">— ${esc(a.details)}</span><div class="muted" style="font-size:12px">${esc(a.by)} · ${fdate(a.at)} ${ftime(a.at)}</div></div>`).join('')}</div>` : empty('🛡️', 'Nothing logged')}</div>`; };

/* ---- settings & profile ---- */
VIEWS.settings = () => { const g = DB.group; return `<div class="grid g2"><div class="card"><h3>🏛️ Group settings</h3><form id="gform">${F([{ name: 'name', label: 'Group name', value: g.name, full: true }, { name: 'location', label: 'Location', value: g.location }, { name: 'currency', label: 'Currency', value: g.currency }, { name: 'cycle', label: 'Frequency', options: Object.entries(CYCLES), value: g.cycle }, { name: 'amount', label: 'Contribution / period', type: 'number', value: g.amount }, { name: 'objective', label: 'Objective', value: g.objective, full: true }])}<h4 class="mt">Loan policy</h4>${F([{ name: 'interestRate', label: 'Interest % / month', type: 'number', step: '0.1', value: g.interestRate }, { name: 'interestType', label: 'Interest type', options: [['FLAT', 'Flat'], ['DECLINING', 'Declining']], value: g.interestType }, { name: 'penaltyRate', label: 'Late penalty %', type: 'number', step: '0.1', value: g.penaltyRate }, { name: 'graceDays', label: 'Grace days', type: 'number', value: g.graceDays }, { name: 'loanMultiplier', label: 'Max loan (× savings)', type: 'number', step: '0.5', value: g.loanMultiplier }, { name: 'requireApproval', label: 'President approval', options: [['1', 'Required'], ['0', 'Not required']], value: g.requireApproval ? '1' : '0' }])}<div class="mt"><button class="btn p" data-act="saveGroup">Save settings</button></div></form></div>
  <div><div class="card"><h3>🎨 Appearance & language</h3><div class="row wrap"><button class="btn" data-act="toggleTheme">🌓 Toggle dark mode</button><button class="btn" data-act="langCycle">🌍 ${LANGS[LANG]}</button></div></div>${pinCard()}
  <div class="card mt"><h3>⚠️ Danger zone</h3><p class="muted">Start over with a clean group or reload the demo data. Make a backup first!</p><div class="row wrap"><button class="btn r" data-act="wipe">Erase all data</button></div></div>${window.Cloud && !DB.demo ? Cloud.card() : ''}</div></div>`; };
const pinCard = () => `<div class="card mt"><h3>🔐 Change my PIN</h3><form id="pinform">${F([{ name: 'old', label: 'Current PIN', type: 'password' }, { name: 'nw', label: 'New PIN (4 digits)', type: 'password' }])}<div class="mt"><button class="btn p" data-act="changePin">Update PIN</button></div></form></div>`;
ACT.saveGroup = () => { if (!guard(can.manage())) return; const v = Object.fromEntries(new FormData($('#gform')).entries()), g = DB.group; Object.assign(g, { name: v.name, location: v.location, currency: v.currency.toUpperCase(), cycle: v.cycle, amount: +v.amount, objective: v.objective, interestRate: +v.interestRate, interestType: v.interestType, penaltyRate: +v.penaltyRate, graceDays: +v.graceDays, loanMultiplier: +v.loanMultiplier, requireApproval: v.requireApproval === '1' }); audit('Settings updated', ''); commit(); shell(); toast('Settings saved'); };
ACT.changePin = async () => { const v = Object.fromEntries(new FormData($('#pinform')).entries()); if (!/^\d{4}$/.test(v.nw)) return toast('New PIN must be 4 digits', true); if ((await hashPin(v.old, SESSION.salt)) !== SESSION.pinHash) return toast('Current PIN is incorrect', true); Object.assign(SESSION, await makeCred(v.nw)); audit('PIN changed', ''); commit(); $('#pinform').reset(); toast('PIN updated'); };
ACT.wipe = () => modal({ title: '⚠️ Erase all data', danger: true, submit: 'Erase everything', body: '<p>This permanently deletes the group, members and history from this computer. Type <b>ERASE</b> to confirm.</p>' + F([{ name: 'c', label: 'Confirmation', full: true }]), onSubmit: (v) => { if (v.c !== 'ERASE') { toast('Type ERASE to confirm', true); return false; } DB = null; SESSION = null; if (window.api) window.api.save(null); else localStorage.removeItem('ikimina-db'); welcome(); } });
VIEWS.profile = () => { const m = SESSION; return `<div class="grid g2"><div class="card c">${avatar(m.name, 90)}<h2 style="margin-top:12px">${esc(m.name)}</h2>${roleTag(m.role)}<div class="list mt" style="text-align:left">${[['📞', 'Phone', m.phone], ['📍', 'Address', m.address || '—'], ['🎯', 'Goal', m.goal || '—'], ['📅', 'Member since', fdate(m.joinDate)], ['👪', 'Next of kin', m.nextOfKin || '—']].map(([i, l, v]) => `<div><span>${i}</span><div class="t"><span>${l}</span><b>${esc(v)}</b></div></div>`).join('')}</div></div>
  <div><div class="card"><h3>🎨 Appearance & language</h3><div class="row wrap"><button class="btn" data-act="toggleTheme">🌓 Dark / light</button><button class="btn" data-act="langCycle">🌍 ${LANGS[LANG]}</button></div></div>${pinCard()}
  <div class="card mt"><h3>🔒 What can I do?</h3><div class="muted" style="line-height:1.7">${{ PRESIDENT: '• See every transaction and analytics<br>• Approve loans and requests<br>• Post announcements, schedule meetings<br>• Manage members and settings', ACCOUNTANT: '• Receive & record contributions and repayments<br>• Disburse approved loans, record expenses/income<br>• Record pot payouts<br>• Issue receipts and reports', MEMBER: '• View your own savings and history<br>• Request loans, send notices<br>• Read announcements and meetings<br>• Download your statement & receipts' }[m.role]}</div></div></div></div>`; };

/* translate after every render (belt and braces alongside the MutationObserver) */
['render', 'modal', 'toast', 'shell', 'welcome', 'loginScreen', 'pinScreen', 'palette'].forEach((n) => { const f = window[n]; window[n] = function () { const r = f.apply(this, arguments); trNode(document.body); return r; }; });
['bell', 'startSetup', 'langCycle'].forEach((n) => { const f = ACT[n]; ACT[n] = function () { const r = f.apply(this, arguments); trNode(document.body); return r; }; });

if (window.Cloud) Cloud.install();
boot();
