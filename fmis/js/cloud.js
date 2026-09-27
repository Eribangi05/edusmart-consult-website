/* ===== FMIS cloud sync: one workspace shared by the whole field team across phones, tablets and computers =====
   Offline first: every device keeps its own full copy and works with no internet. This file only sends what changed and applies what other
   devices sent. Server: the Smart School Cloud (/v1/acct/workspaces and /v1/acct/sync, app "fms"). What each role receives is decided by the
   server (Admins and Managers everything, Supervisors the field work, Field agents their own work, Viewers approved data). */
(function () {
  'use strict';
  const DEFAULT_URL = 'https://smart-school-cloud-sync.onrender.com';
  const SINGLES = { org: 'org' };
  const CHUNK = 300;
  let running = false, again = false, timer = null, suppress = false, status = { state: 'idle', msg: '' };

  const base = () => String(window.FMIS_CLOUD_URL || DEFAULT_URL).replace(/\/$/, '') + '/v1/acct';
  const cl = () => (DB && DB.cloud && DB.cloud.token ? DB.cloud : null);
  const linked = () => !!(cl() && cl().workspaceId);
  const digits = (p) => String(p || '').replace(/\D/g, '');
  const samePhone = (a, b) => { a = digits(a); b = digits(b); return a.length >= 9 && b.length >= 9 && a.slice(-9) === b.slice(-9); };
  const devId = () => 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const canon = (v) => Array.isArray(v) ? '[' + v.map(canon).join(',') + ']' : (v && typeof v === 'object') ? '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}' : JSON.stringify(v);
  function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36) + s.length.toString(36); }
  const hashOf = (o) => fnv(canon(o));
  const friendly = (j) => (j && j.message) || 'That did not work. Try again.';
  const netMsg = 'Could not reach the server. Check your internet connection and try again.';

    // The free server sleeps when idle and needs up to a minute to wake: ask it to wake up as soon as the app opens, so the first sync is quick
  try { if (navigator.onLine !== false && typeof fetch === 'function') fetch(base().replace('/v1/acct', '/v1/public/status'), { method: 'GET' }).catch(function () {}); } catch (e) { /* ignore */ }

  function paintDot() {
    const d = document.getElementById('syncdot'); if (!d) return;
    const map = { idle: ['#8aa0aa', linked() ? 'Sync on' : 'Sync off (this device only)'], syncing: ['#f5a623', 'Syncing…'], ok: ['#1a9f6e', 'Synced'], error: ['#d64545', status.msg || 'Sync problem'] };
    const [c, t] = linked() ? map[status.state] || map.idle : map.idle; d.style.background = c; d.title = t; d.style.opacity = linked() ? 1 : 0.35;
  }
  function say(state, msg) { status = { state, msg: msg || '' }; const el = document.getElementById('cloudStatus'); if (el) el.textContent = statusText(); paintDot(); }
  function statusText() {
    if (status.state === 'syncing') return 'Syncing…'; if (status.state === 'error') return status.msg;
    const c = cl(); return c && c.lastSync ? 'Last synced ' + new Date(c.lastSync).toLocaleString() : '';
  }
  function call(method, path, body, auth) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null; const to = ctl ? setTimeout(() => ctl.abort(), 65000) : null;   // the free server can take a while to wake up
    const headers = { 'Content-Type': 'application/json' }; if (auth !== false && cl()) headers.Authorization = 'Bearer ' + cl().token;
    return fetch(base() + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then((r) => { if (to) clearTimeout(to); return r.json().catch(() => ({})).then((j) => { j._status = r.status; return j; }); });
  }

  /* ---------- what this device may send (the server checks again) ---------- */
  function iterDocs() {
    const out = [];
    for (const coll of COLLECTIONS) for (const it of (DB[coll] || [])) if (it && it.id) out.push([coll, String(it.id), it]);
    for (const k of Object.keys(SINGLES)) if (DB[k]) out.push([SINGLES[k], 'main', DB[k]]);
    return out;
  }
  function collectChanges() {
    const c = cl(); const now = Date.now(); const changes = []; const sig = {}; const seen = {};   // everything that changed is sent; the server decides, and hands back its own copy of anything it refuses
    for (const [coll, id, data] of iterDocs()) {
      (seen[coll] = seen[coll] || new Set()).add(id);
      const h = hashOf(data); if ((c.shadow[coll] || {})[id] === h) continue;
      changes.push({ coll, id, u: now, data }); (sig[coll] = sig[coll] || {})[id] = h;
    }
    for (const coll of Object.keys(c.shadow)) for (const id of Object.keys(c.shadow[coll])) if (!(seen[coll] && seen[coll].has(id))) { changes.push({ coll, id, u: now, deleted: true }); (sig[coll] = sig[coll] || {})[id] = null; }
    return { changes, sig };
  }

  /* ---------- what arrives ---------- */
  function putLocal(coll, id, data) {                                     // data null removes the record
    const c = cl(); const sh = (c.shadow[coll] = c.shadow[coll] || {});
    if (coll === 'org') { if (data) { DB.org = data; sh.main = hashOf(data); } return; }
    const list = DB[coll] = DB[coll] || []; const i = list.findIndex((x) => String(x.id) === id);
    if (!data) { if (i >= 0) list.splice(i, 1); delete sh[id]; return; }
    if (i >= 0) list[i] = data; else list.push(data); sh[id] = hashOf(data);
  }
  function applyRemote(ch) {
    if (ch.coll !== 'org' && !COLLECTIONS.includes(ch.coll)) return false;
    putLocal(ch.coll, ch.id, ch.deleted ? null : ch.data); return true;
  }
  function afterApply() {
    let cert = (DB.seq && DB.seq.cert) || 0;                             // certificate numbers keep counting from the highest one issued anywhere
    for (const x of (DB.certificates || [])) { const m = /^CERT-(\d+)$/.exec(x.serial || ''); if (m) cert = Math.max(cert, +m[1]); }
    DB.seq = DB.seq || { cert: 0 }; DB.seq.cert = cert;
    if (SESSION) { const m = DB.members.find((x) => x.id === SESSION.id); if (m) SESSION = m; }
  }
  function refreshUI() {
    try { if (!SESSION || modalOpen()) return; const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return; if (typeof refresh === 'function') refresh(); } catch (e) { /* the screen was not ready */ }
  }

  /* ---------- the sync round ---------- */
  function syncNow() {
    if (!linked()) return Promise.resolve();
    if (running) { again = true; return Promise.resolve(); }
    if (navigator.onLine === false) { say('error', 'You are offline. It will sync when you are back online.'); return Promise.resolve(); }
    running = true; again = false; say('syncing');
    const c = cl(); let touched = false, passes = 0;
    const round = () => {
      passes++;
      const firstPull = !c.pulled;                                       // a new device receives first and only then sends, so its empty defaults never overwrite the workspace
      const { changes, sig } = firstPull ? { changes: [], sig: {} } : collectChanges();
      let cursor = c.cursor || 0, idx = 0;
      const step = () => {
        const part = changes.slice(idx, idx + CHUNK); idx += CHUNK;
        return call('POST', '/sync', { app: 'fms', scope: 'w:' + c.workspaceId, cursor, changes: part }).then((r) => {
          if (r._status === 401) { c.token = null; throw { msg: r.message || 'You were signed out. Sign in again.', out: true }; }
          if (r._status === 403) throw { msg: 'You no longer have access to this workspace.', out: true };
          if (!r.ok) throw { msg: friendly(r) };
          for (const p of part) { const s = sig[p.coll] && sig[p.coll][p.id]; if (p.deleted) { if (c.shadow[p.coll]) delete c.shadow[p.coll][p.id]; } else if (s) (c.shadow[p.coll] = c.shadow[p.coll] || {})[p.id] = s; }
          for (const s of (r.skipped || [])) if (s.reason === 'not_allowed') { putLocal(s.coll, s.id, s.current || null); touched = true; }   // the server keeps its own copy: put ours back
          for (const x of (r.changes || [])) if (applyRemote(x)) touched = true;
          cursor = r.cursor; c.cursor = cursor;
          if (r.more || idx < changes.length) return step();
        });
      };
      return step().then(() => {
        c.lastSync = Date.now(); if (touched) afterApply(); suppress = true; Store.save(DB); suppress = false;
        if (firstPull) { c.pulled = true; touched = false; return round(); }
        if (touched && passes < 3) { touched = false; return round(); }
      });
    };
    return round().then(() => { say('ok'); refreshUI(); renderCard(); })
      .catch((e) => { suppress = false; say('error', (e && e.msg) || 'Could not sync. It will try again.'); if (e && e.out) renderCard(); })
      .then(() => { running = false; if (again) { again = false; changed(); } });
  }
  function changed() { if (suppress || !linked()) return; clearTimeout(timer); timer = setTimeout(syncNow, 4000); }

  /* ---------- account and workspace actions ---------- */
  const signIn = (phone, pin) => call('POST', '/login', { phone, pin, device: devId(), label: navigator.platform || 'device', platform: window.FMIS_PLATFORM || 'web' }, false);
  const register = (phone, name, pin) => call('POST', '/register', { phone, name, pin, device: devId(), label: navigator.platform || 'device', platform: window.FMIS_PLATFORM || 'web' }, false);
  function setAccount(j) { DB.cloud = Object.assign({ shadow: {}, cursor: 0 }, DB.cloud || {}, { token: j.token, user: j.user, device: (DB.cloud && DB.cloud.device) || devId() }); }
  async function enableWorkspace() {
    const g = await call('POST', '/workspaces', { name: DB.org.name }); if (!g.ok) return g;
    Object.assign(DB.cloud, { workspaceId: g.workspace.id, role: 'ADMIN', memberId: SESSION.id, shadow: {}, cursor: 0, pulled: true });   // the server side is empty, so the Admin sends everything
    audit('Cloud sync turned on', ''); Store.save(DB); return g;
  }
  function unlink() { if (DB.cloud) call('POST', '/logout', {}).catch(() => {}); delete DB.cloud; Store.save(DB); }
  const emptyShell = () => ({ v: 1, org: { name: 'Workspace', sector: '', country: '', createdAt: Date.now() }, members: [], projects: [], tasks: [], forms: [], submissions: [], checkins: [], messages: [], reports: [], library: [], certificates: [], audit: [], seq: { cert: 0 }, notes: [], prefs: { theme: 'light', lang: 'en', lastUser: null, read: {} }, demo: false });

  /* ---------- screens ---------- */
  function cardHtml() {
    const c = DB.cloud; const head = '<h3>☁️ Cloud sync</h3>';
    if (linked()) {
      const canInvite = c.role === 'ADMIN' || c.role === 'MANAGER';
      return `${head}<p class="muted">This workspace is shared across devices. You are signed in as <b>${esc(c.user.name)}</b> (${esc(ROLES[c.role] || c.role)}). Everything still works without internet and syncs when you are online.</p><div class="muted" id="cloudStatus" style="font-size:13px;margin:6px 0 12px">${esc(statusText())}</div>
        <div class="row wrap"><button class="btn" data-act="cloudSyncNow">🔄 Sync now</button>${canInvite ? '<button class="btn p" data-act="cloudInvite">➕ Invite someone</button><button class="btn" data-act="cloudPeople">👥 Who has access</button>' : ''}<button class="btn r" data-act="cloudUnlink">Stop syncing on this device</button></div>`;
    }
    if (c && c.token) return `${head}<p class="muted">Signed in to the cloud as <b>${esc(c.user.name)}</b>.</p>${SESSION && SESSION.role === 'ADMIN' ? '<p class="muted">Turn on sync to share this workspace with your team on their own phones and computers.</p><button class="btn p" data-act="cloudEnable">Turn on cloud sync for this workspace</button> ' : '<p class="muted">Only the Admin can turn on sync. Ask them for an invitation code.</p>'}<button class="btn" data-act="cloudOut">Sign out of the cloud</button>`;
    return `${head}<p class="muted">Optional. Share one workspace between your team on different phones and computers, so reports, tasks and submissions arrive in real time. Each role sees only what it should.</p>
      <div class="fg"><div><label class="f">Phone</label><input id="cloudPhone" value="${esc(SESSION ? SESSION.phone : '')}" inputmode="numeric"></div><div><label class="f">PIN (4 digits)</label><input id="cloudPin" type="password" inputmode="numeric" maxlength="4"></div></div><div class="err" id="cloudErr" style="color:var(--red)"></div>
      <div class="row wrap mt"><button class="btn p" data-act="cloudSignIn">Sign in</button><button class="btn" data-act="cloudCreate">Create cloud account</button></div>`;
  }
  const card = () => `<div class="card mt" id="cloudCard">${cardHtml()}</div>`;
  function renderCard() { const h = document.getElementById('cloudCard'); if (h) h.innerHTML = cardHtml(); }
  const cerr = (m) => { const e = document.getElementById('cloudErr'); if (e) e.textContent = m || ''; };

  function install() {
    ACT.cloudSyncNow = () => { syncNow(); };
    ACT.cloudOut = () => { unlink(); renderCard(); paintDot(); toast('Signed out of the cloud'); };
    ACT.cloudUnlink = () => modal({ title: 'Stop syncing on this device?', submit: 'Stop syncing', danger: true, body: '<p>This device keeps its copy and keeps working, but it will no longer send or receive changes. You can turn sync on again with an invitation code.</p>', onSubmit: () => { unlink(); renderCard(); paintDot(); toast('Sync stopped on this device'); } });
    const acctForm = async (create) => {
      const phone = document.getElementById('cloudPhone').value.trim(), pin = document.getElementById('cloudPin').value;
      if (digits(phone).length < 9) return cerr('Enter your phone number.'); if (!/^\d{4}$/.test(pin)) return cerr('The PIN must be exactly 4 digits.'); cerr('Please wait…');
      try { const j = create ? await register(phone, SESSION ? SESSION.name : phone, pin) : await signIn(phone, pin); if (!j.ok) return cerr(friendly(j)); setAccount(j); Store.save(DB); renderCard(); toast('Signed in to the cloud'); } catch (e) { cerr(netMsg); }
    };
    ACT.cloudSignIn = () => acctForm(false); ACT.cloudCreate = () => acctForm(true);
    ACT.cloudEnable = async () => { if (!guard(can.admin())) return; try { const g = await enableWorkspace(); if (!g.ok) return toast(friendly(g), true); renderCard(); paintDot(); toast('Cloud sync is on'); syncNow(); } catch (e) { toast(netMsg, true); } };
    const inviteFor = (m) => async () => {
      try {
        const j = await call('POST', `/workspaces/${cl().workspaceId}/codes`, { role: m.role, member_id: m.id, days: 7, max_uses: 1 }); if (!j.ok) { toast(friendly(j), true); return false; }
        const text = `FMIS invitation for ${m.name} (${ROLES[m.role]}). Workspace: ${DB.org.name}. Code: ${j.code} (valid 7 days, one use). Open FMIS, choose "Join a workspace online" and enter this code with your phone number and a 4-digit PIN.`;
        setTimeout(() => modal({ title: '✅ Invitation ready', cancel: 'Close', submit: 'Copy message', body: `<div class="c"><div class="muted">Give this code to ${esc(m.name)}</div><div style="font-size:30px;font-weight:800;letter-spacing:2px;margin:12px 0">${esc(j.code)}</div><div class="muted sm">Valid for 7 days, works once.</div></div>`, onSubmit: () => { try { navigator.clipboard.writeText(text); toast('Copied. Paste it into WhatsApp or SMS.'); } catch (e) { toast(text); } return false; } }), 50);
      } catch (e) { toast(netMsg, true); return false; }
    };
    ACT.cloudInvite = () => {
      const people = DB.members.filter((m) => m.status !== 'INACTIVE' && m.role !== 'ADMIN' && m.id !== (SESSION && SESSION.id)); if (!people.length) return toast('Add people to the team first.', true);
      modal({ title: '➕ Invite someone', submit: 'Create invitation code', body: '<p class="muted">Choose the person. They install or open FMIS, choose <b>Join a workspace online</b>, and type the code with their own phone number and a PIN.</p>' + F([{ name: 'id', label: 'Who is this for?', options: people.map((m) => [m.id, `${m.name} (${ROLES[m.role]})`]), full: true }]), onSubmit: (v) => inviteFor(S.member(v.id))() });
    };
    ACT.cloudInviteFor = ({ id }) => { const m = S.member(id); if (m.role === 'ADMIN') return toast('An Admin cannot be invited.', true); closeModal(); inviteFor(m)().then((r) => { if (r === false) return; }); };
    ACT.cloudPeople = async () => {
      try { const j = await call('GET', `/workspaces/${cl().workspaceId}/people`); if (!j.ok) return toast(friendly(j), true);
        modal({ title: '👥 Who has access', cancel: 'Close', submit: 'Done', onSubmit: () => {}, body: `<div class="list">${j.people.map((p) => `<div class="row li"><div class="sp"><b>${esc(p.name)}</b><div class="muted sm">${esc(p.phone)} · ${esc(ROLES[p.role] || p.role)}</div></div>${p.role === 'ADMIN' ? '' : `<button type="button" class="btn s r" data-act="cloudRemove" data-id="${esc(p.user_id)}">Remove</button>`}</div>`).join('') || '<div class="muted">Nobody else yet.</div>'}</div>` });
      } catch (e) { toast(netMsg, true); }
    };
    ACT.cloudRemove = async ({ id }) => { try { const j = await call('POST', `/workspaces/${cl().workspaceId}/people/${id}/remove`, {}); if (!j.ok) return toast(friendly(j), true); toast('Access removed'); closeModal(); ACT.cloudPeople(); } catch (e) { toast(netMsg, true); } };

    ACT.cloudJoin = () => {
      $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><form class="box" id="joinf"><h1 style="font-size:26px">Join a workspace online</h1><p class="muted" style="margin:6px 0 16px">Your manager gave you a code like FMS-ABCD-EFGH. Use your own phone number and choose a 4-digit PIN. If you already have a cloud account, use the same phone and PIN.</p>
        ${F([{ name: 'name', label: 'Your full name', required: true, full: true }, { name: 'phone', label: 'Phone', required: true }, { name: 'pin', label: '4-digit PIN', type: 'password', required: true, placeholder: '••••' }, { name: 'code', label: 'Invitation code', required: true, full: true, placeholder: 'FMS-XXXX-XXXX' }])}
        <div class="err" id="joinErr" style="color:var(--red);margin-top:8px"></div><div class="row mt"><button type="button" class="btn" data-act="back0">← Back</button><span class="sp"></span><button class="btn p" type="submit" id="joinGo">Join →</button></div></form></div></div>`;
      $('#joinf').onsubmit = async (e) => {
        e.preventDefault(); const v = Object.fromEntries(new FormData(e.target).entries()); const err = (m) => { $('#joinErr').textContent = m; };
        if (!/^\d{4}$/.test(v.pin)) return err('The PIN must be exactly 4 digits.'); err('Please wait…'); $('#joinGo').disabled = true;
        const prev = DB;
        try {
          let j = await signIn(v.phone, v.pin);
          if (!j.ok && j.error === 'invalid_login') { const r = await register(v.phone, v.name, v.pin); if (r.ok) j = r; else if (r.error === 'phone_taken') { $('#joinGo').disabled = false; return err('That phone number already has a cloud account with a different PIN. Use the PIN you chose before.'); } else j = r; }
          if (!j.ok) { $('#joinGo').disabled = false; return err(friendly(j)); }
          DB = emptyShell(); DB.cloud = { shadow: {}, cursor: 0 }; setAccount(j);
          const g = await call('POST', '/workspaces/join', { code: v.code });
          if (!g.ok) { DB = prev; $('#joinGo').disabled = false; return err(friendly(g)); }
          Object.assign(DB.cloud, { workspaceId: g.workspace.id, role: g.workspace.role, memberId: g.workspace.member_id || null });
          await syncNow();
          const me = DB.members.find((m) => m.id === g.workspace.member_id) || DB.members.find((m) => samePhone(m.phone, v.phone));
          if (!me) { DB = prev; $('#joinGo').disabled = false; return err('The workspace was found, but your phone number is not on its team list. Ask the Admin to check your number.'); }
          if (!DB.cloud.memberId) DB.cloud.memberId = me.id;
          Object.assign(me, await makeCred(v.pin));                        // the PIN just proved to the cloud becomes the PIN in the workspace too
          migrate(); applyPrefs(); SESSION = me; ROUTE = 'dashboard'; audit('Joined the workspace online', me.name); commit(); shell(); toast(`Welcome, ${me.name.split(' ')[0]}!`);
        } catch (e2) { DB = prev; $('#joinGo').disabled = false; err(netMsg); }
      };
    };
  }
  const welcomeCard = () => '<div class="ucard" data-act="cloudJoin"><span class="ue">☁️</span><div><b>Join a workspace online</b><small>Use a code from your manager</small></div></div>';
  function start() {
    if (!linked()) return;
    setTimeout(syncNow, 2500); window.addEventListener('online', syncNow);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
    setInterval(() => { if (!document.hidden) syncNow(); }, 90000);
  }
  window.Cloud = { install, card, welcomeCard, changed, start, syncNow, linked, paintDot, _canon: canon, _hash: hashOf };
})();
