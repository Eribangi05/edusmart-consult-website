/* ===== Ikimina cloud sync: officers and members share one set of books across phones and computers =====
   Offline first: every device keeps its own full copy and works without internet. This file only sends what changed and applies what
   other devices sent. Server: the Smart School Cloud (/v1/acct). Loaded after core.js and before app.js (it uses DB, SESSION, S, ACT, modal, toast at call time).
   The President turns cloud sync on for a group and invites the Accountant and members with codes. Officers receive the whole set of books;
   a plain member receives only their own savings, loans and requests plus the group notices (the server enforces this). */
(function () {
  'use strict';
  const DEFAULT_URL = 'https://smart-school-cloud-sync.onrender.com';
  const ARRAYS = ['members', 'contributions', 'loans', 'repayments', 'expenses', 'income', 'announcements', 'meetings', 'requests', 'payouts', 'audit'];
  const SINGLES = { group: 'group', rotation: 'rotation' };
  const CHUNK = 400;
  let running = false, again = false, timer = null, suppress = false, status = { state: 'idle', msg: '' };

  const base = () => String((window.IKI_CLOUD_URL || DEFAULT_URL)).replace(/\/$/, '') + '/v1/acct';
  const cl = () => (DB && DB.cloud && DB.cloud.token ? DB.cloud : null);
  const linked = () => !!(cl() && cl().groupId);
  const digits = (p) => String(p || '').replace(/\D/g, '');
  const samePhone = (a, b) => { a = digits(a); b = digits(b); return a.length >= 9 && b.length >= 9 && a.slice(-9) === b.slice(-9); };
  const devId = () => 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const canon = (v) => Array.isArray(v) ? '[' + v.map(canon).join(',') + ']' : (v && typeof v === 'object') ? '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}' : JSON.stringify(v);
  function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36) + s.length.toString(36); }
  const hashOf = (o) => fnv(canon(o));

    // The free server sleeps when idle and needs up to a minute to wake: ask it to wake up as soon as the app opens, so the first sync is quick
  try { if (navigator.onLine !== false && typeof fetch === 'function') fetch(base().replace('/v1/acct', '/v1/public/status'), { method: 'GET' }).catch(function () {}); } catch (e) { /* ignore */ }

  function say(state, msg) { status = { state, msg: msg || '' }; const el = document.getElementById('cloudStatus'); if (el) el.textContent = statusText(); }
  function statusText() {
    if (status.state === 'syncing') return 'Syncing…';
    if (status.state === 'error') return status.msg;
    const c = cl(); if (!c || !c.lastSync) return '';
    return 'Last synced ' + new Date(c.lastSync).toLocaleString();
  }
  const friendly = (j) => (j && j.message) || 'That did not work. Try again.';

  function call(method, path, body, auth) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const to = ctl ? setTimeout(() => ctl.abort(), 65000) : null;     // the free server can take a while to wake up
    const headers = { 'Content-Type': 'application/json' };
    if (auth !== false && cl()) headers.Authorization = 'Bearer ' + cl().token;
    return fetch(base() + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then((r) => { if (to) clearTimeout(to); return r.json().catch(() => ({})).then((j) => { j._status = r.status; return j; }); });
  }

  /* ---------- what this device may send ---------- */
  function iterDocs() {                                    // every synced record as [coll, id, data]
    const out = [];
    for (const coll of ARRAYS) for (const it of (DB[coll] || [])) if (it && it.id) out.push([coll, String(it.id), it]);
    for (const k of Object.keys(SINGLES)) if (DB[k]) out.push([SINGLES[k], 'main', DB[k]]);
    return out;
  }
  const isMemberRole = () => cl() && cl().role === 'MEMBER';
  function writable(coll, data) { return !isMemberRole() || (coll === 'requests' && data && data.memberId === cl().memberId); }

  function collectChanges() {
    const c = cl(); const now = Date.now(); const changes = []; const sig = {};
    const seen = {};
    for (const [coll, id, data] of iterDocs()) {
      (seen[coll] = seen[coll] || new Set()).add(id);
      if (!writable(coll, data)) continue;
      const h = hashOf(data);
      if ((c.shadow[coll] || {})[id] !== h) { changes.push({ coll, id, u: now, data }); (sig[coll] = sig[coll] || {})[id] = h; }
    }
    for (const coll of Object.keys(c.shadow)) {           // records that were here and are gone now: send a delete
      if (isMemberRole()) continue;
      for (const id of Object.keys(c.shadow[coll])) {
        if (!(seen[coll] && seen[coll].has(id))) { changes.push({ coll, id, u: now, deleted: true }); (sig[coll] = sig[coll] || {})[id] = null; }
      }
    }
    return { changes, sig };
  }

  /* ---------- what arrives from other devices ---------- */
  function applyRemote(ch) {
    const c = cl(); const coll = ch.coll;
    if (coll === 'group' || coll === 'rotation') {
      if (ch.deleted || !ch.data) return false;
      DB[coll] = ch.data; (c.shadow[coll] = c.shadow[coll] || {}).main = hashOf(ch.data); return true;
    }
    if (!ARRAYS.includes(coll)) return false;
    const list = DB[coll] = DB[coll] || [];
    const i = list.findIndex((x) => String(x.id) === ch.id);
    const sh = c.shadow[coll] = c.shadow[coll] || {};
    if (ch.deleted) { if (i >= 0) list.splice(i, 1); delete sh[ch.id]; return true; }
    if (!ch.data) return false;
    if (i >= 0) list[i] = ch.data; else list.push(ch.data);
    sh[ch.id] = hashOf(ch.data);
    return true;
  }
  function afterApply() {
    let rc = (DB.seq && DB.seq.rc) || 0;                     // receipt numbers keep counting from the highest one any device issued
    for (const x of (DB.contributions || [])) { const m = /^RC-(\d+)$/.exec(x.receiptNo || ''); if (m) rc = Math.max(rc, +m[1]); }
    DB.seq = DB.seq || { rc: 0 }; DB.seq.rc = rc;
    if (typeof SESSION !== 'undefined' && SESSION) { const m = DB.members.find((x) => x.id === SESSION.id); if (m) SESSION = m; }
  }
  function refreshUI() {
    try {
      if (typeof SESSION === 'undefined' || !SESSION) return;
      if (document.getElementById('modal-root') && document.getElementById('modal-root').innerHTML.trim()) return;
      const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
      if (typeof refresh === 'function') refresh();
    } catch (e) { /* the screen was not ready */ }
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
      const firstPull = !c.pulled;                             // a new device receives first and only then sends, so its empty defaults never overwrite the group's real data
      const { changes, sig } = firstPull ? { changes: [], sig: {} } : collectChanges();
      let cursor = c.cursor || 0, idx = 0, more = true;
      const step = () => {
        const part = changes.slice(idx, idx + CHUNK); idx += CHUNK;
        return call('POST', '/sync', { app: 'iki', scope: 'g:' + c.groupId, cursor, changes: part }).then((r) => {
          if (r._status === 401) { c.token = null; throw { msg: r.message || 'You were signed out. Sign in again.', out: true }; }
          if (r._status === 403) throw { msg: 'You no longer have access to this group.', out: true };
          if (!r.ok) throw { msg: friendly(r) };
          for (const p of part) { const s = sig[p.coll] && sig[p.coll][p.id]; if (p.deleted) { if (c.shadow[p.coll]) delete c.shadow[p.coll][p.id]; } else if (s) (c.shadow[p.coll] = c.shadow[p.coll] || {})[p.id] = s; }
          for (const x of (r.changes || [])) if (applyRemote(x)) touched = true;
          cursor = r.cursor; c.cursor = cursor; more = r.more;
          if (more || idx < changes.length) return step();
        });
      };
      return step().then(() => {
        c.lastSync = Date.now(); if (touched) afterApply(); suppress = true; Store.save(DB); suppress = false;
        if (firstPull) { c.pulled = true; touched = false; return round(); }
        if (touched && passes < 3) { touched = false; return round(); }
      });
    };
    return round().then(() => { say('ok'); touchedUI(); })
      .catch((e) => { suppress = false; say('error', (e && e.msg) || 'Could not sync. It will try again.'); if (e && e.out) { renderCard(); } })
      .then(() => { running = false; if (again) { again = false; changed(); } });
  }
  function touchedUI() { refreshUI(); renderCard(); }

  function changed() {                                       // after every save: sync a few seconds later, once
    if (suppress || !linked()) return;
    clearTimeout(timer); timer = setTimeout(syncNow, 4000);
  }

  /* ---------- account and group actions ---------- */
  function signIn(phone, pin) { return call('POST', '/login', { phone, pin, device: devId(), label: navigator.platform || 'device', platform: window.IKI_PLATFORM || 'web' }, false); }
  function register(phone, name, pin) { return call('POST', '/register', { phone, name, pin, device: devId(), label: navigator.platform || 'device', platform: window.IKI_PLATFORM || 'web' }, false); }
  function setAccount(j) {
    DB.cloud = Object.assign({ shadow: {}, cursor: 0 }, DB.cloud || {}, { token: j.token, user: j.user, device: DB.cloud && DB.cloud.device || devId() });
  }
  async function enableGroup() {
    const g = await call('POST', '/groups', { name: DB.group.name });
    if (!g.ok) return g;
    Object.assign(DB.cloud, { groupId: g.group.id, role: 'PRESIDENT', memberId: null, shadow: {}, cursor: 0, pulled: true });   // the server side is empty, so the President sends everything
    audit('Cloud sync turned on', ''); Store.save(DB);
    return g;
  }
  function unlink() { const c = DB.cloud; if (c) { call('POST', '/logout', {}).catch(() => {}); } delete DB.cloud; Store.save(DB); }
  const emptyShell = () => ({ v: 1, group: { name: 'Group', location: '', objective: '', currency: 'RWF', cycle: 'MONTHLY', amount: 0, sharePrice: 0, interestRate: 5, interestType: 'FLAT', penaltyRate: 2, graceDays: 7, loanMultiplier: 3, requireApproval: true, createdAt: Date.now(), dueDay: 5 },
    members: [], contributions: [], loans: [], repayments: [], expenses: [], income: [], announcements: [], meetings: [], requests: [], payouts: [], rotation: { order: [], pos: 0 }, audit: [], notes: [], seq: { rc: 0 }, prefs: { theme: 'light', lang: 'en', lastUser: null }, demo: false });

  /* ---------- screens ---------- */
  function cardHtml() {
    const c = DB.cloud;
    const head = '<h3>☁️ Cloud sync</h3>';
    if (linked()) {
      const isP = c.role === 'PRESIDENT';
      return `${head}<p class="muted">This group is shared across devices. You are signed in as <b>${esc(c.user.name)}</b> (${esc(c.role === 'PRESIDENT' ? 'President' : c.role === 'ACCOUNTANT' ? 'Accountant' : 'Member')}). Everything still works without internet and syncs when you are online.</p>
        <div class="muted" id="cloudStatus" style="font-size:13px;margin:6px 0 12px">${esc(statusText())}</div>
        <div class="row wrap"><button class="btn" data-act="cloudSyncNow">🔄 Sync now</button>${isP ? '<button class="btn p" data-act="cloudInvite">➕ Invite someone</button><button class="btn" data-act="cloudPeople">👥 Who has access</button>' : ''}<button class="btn r" data-act="cloudUnlink">Stop syncing on this device</button></div>`;
    }
    if (c && c.token) {
      const isP = SESSION && SESSION.role === 'PRESIDENT';
      return `${head}<p class="muted">Signed in to the cloud as <b>${esc(c.user.name)}</b>.</p>${isP ? '<p class="muted">Turn on sync to share this group with your Accountant and members on their own phones and computers.</p><button class="btn p" data-act="cloudEnable">Turn on cloud sync for this group</button> ' : '<p class="muted">Only the President can turn on sync for a group. Ask them for an invitation code.</p>'}<button class="btn" data-act="cloudOut">Sign out of the cloud</button>`;
    }
    const phone = SESSION ? SESSION.phone : '';
    return `${head}<p class="muted">Optional. Share one set of books between the President, the Accountant and members on different phones and computers. Members see only their own records.</p>
      <div class="fg"><div><label class="f">Phone</label><input id="cloudPhone" value="${esc(phone)}" inputmode="numeric"></div><div><label class="f">PIN (4 digits)</label><input id="cloudPin" type="password" inputmode="numeric" maxlength="4"></div></div>
      <div class="err" id="cloudErr" style="color:var(--red)"></div>
      <div class="row wrap mt"><button class="btn p" data-act="cloudSignIn">Sign in</button><button class="btn" data-act="cloudCreate">Create cloud account</button></div>`;
  }
  const card = () => (window.DB_READY_FOR_CLOUD === false ? '' : `<div class="card mt" id="cloudCard">${cardHtml()}</div>`);
  function renderCard() { const h = document.getElementById('cloudCard'); if (h) h.innerHTML = cardHtml(); }
  const cerr = (m) => { const e = document.getElementById('cloudErr'); if (e) e.textContent = m || ''; };
  const netMsg = 'Could not reach the server. Check your internet connection and try again.';

  function install() {
  ACT.cloudSyncNow = () => { syncNow(); };
  ACT.cloudOut = () => { unlink(); renderCard(); toast('Signed out of the cloud'); };
  ACT.cloudUnlink = () => modal({ title: 'Stop syncing on this device?', submit: 'Stop syncing', danger: true,
    body: '<p>This device keeps its copy of the books and keeps working, but it will no longer send or receive changes. You can turn sync on again later with an invitation code.</p>',
    onSubmit: () => { unlink(); renderCard(); toast('Sync stopped on this device'); } });
  const acctForm = async (create) => {
    const phone = document.getElementById('cloudPhone').value.trim(), pin = document.getElementById('cloudPin').value;
    if (digits(phone).length < 9) return cerr('Enter your phone number.');
    if (!/^\d{4}$/.test(pin)) return cerr('The PIN must be exactly 4 digits.');
    cerr('Please wait…');
    try {
      const j = create ? await register(phone, SESSION ? SESSION.name : phone, pin) : await signIn(phone, pin);
      if (!j.ok) return cerr(friendly(j));
      setAccount(j); Store.save(DB); renderCard(); toast('Signed in to the cloud');
    } catch (e) { cerr(netMsg); }
  };
  ACT.cloudSignIn = () => acctForm(false);
  ACT.cloudCreate = () => acctForm(true);
  ACT.cloudEnable = async () => {
    if (!guard(can.manage())) return;
    try { const g = await enableGroup(); if (!g.ok) return toast(friendly(g), true); renderCard(); toast('Cloud sync is on'); syncNow(); } catch (e) { toast(netMsg, true); }
  };
  ACT.cloudInvite = () => {
    const people = DB.members.filter((m) => m.status === 'ACTIVE' && m.role !== 'PRESIDENT');
    if (!people.length) return toast('Add members first.', true);
    modal({ title: '➕ Invite someone', submit: 'Create invitation code',
      body: '<p class="muted">Choose the person. They install or open Ikimina, choose <b>Join a group online</b>, and type this code with their own phone number and a PIN.</p>' + F([{ name: 'id', label: 'Who is this for?', options: people.map((m) => [m.id, `${m.name} (${m.role === 'ACCOUNTANT' ? 'Accountant' : 'Member'})`]), full: true }]),
      onSubmit: async (v) => {
        const m = S.member(v.id);
        try {
          const j = await call('POST', `/groups/${cl().groupId}/codes`, { role: m.role, member_id: m.id, days: 7, max_uses: 1 });
          if (!j.ok) { toast(friendly(j), true); return false; }
          const text = `Ikimina invitation for ${m.name}. Group: ${DB.group.name}. Code: ${j.code} (valid 7 days, one use). Open Ikimina, choose "Join a group online" and enter this code.`;
          setTimeout(() => modal({ title: '✅ Invitation ready', cancel: 'Close', submit: 'Copy message',
            body: `<div class="c"><div class="muted">Give this code to ${esc(m.name)}</div><div style="font-size:30px;font-weight:800;letter-spacing:2px;margin:12px 0">${esc(j.code)}</div><div class="muted" style="font-size:12px">Valid for 7 days, works once.</div></div>`,
            onSubmit: () => { try { navigator.clipboard.writeText(text); toast('Copied. Paste it into WhatsApp or SMS.'); } catch (e) { toast(text); } return false; } }), 50);
        } catch (e) { toast(netMsg, true); return false; }
      } });
  };
  ACT.cloudPeople = async () => {
    try {
      const j = await call('GET', `/groups/${cl().groupId}/people`);
      if (!j.ok) return toast(friendly(j), true);
      modal({ title: '👥 Who has access', cancel: 'Close', submit: 'Done',
        body: `<div class="list">${j.people.map((p) => `<div class="row" style="padding:8px 0"><div class="sp"><b>${esc(p.name)}</b><div class="muted" style="font-size:12px">${esc(p.phone)} · ${esc(p.role)}</div></div>${p.role === 'PRESIDENT' ? '' : `<button type="button" class="btn s r" data-act="cloudRemove" data-id="${esc(p.user_id)}">Remove</button>`}</div>`).join('') || '<div class="muted">Nobody else yet.</div>'}</div>`,
        onSubmit: () => {} });
    } catch (e) { toast(netMsg, true); }
  };
  ACT.cloudRemove = async ({ id }) => {
    try { const j = await call('POST', `/groups/${cl().groupId}/people/${id}/remove`, {}); if (!j.ok) return toast(friendly(j), true); toast('Access removed'); closeModal(); ACT.cloudPeople(); } catch (e) { toast(netMsg, true); }
  };

  /* Join a group on a new device: cloud account, invitation code, then the books arrive and the person is signed in. */
  ACT.cloudJoin = () => {
    $('#app').innerHTML = `<div class="auth">${authLeft()}<div class="right"><form class="box" id="joinf"><h1 style="font-size:26px">Join a group online</h1><p class="muted" style="margin:6px 0 18px">Your President gave you a code that looks like IKM-ABCD-EFGH. Use your own phone number and choose a 4-digit PIN. If you already have a cloud account, use the same phone and PIN.</p>
      ${F([{ name: 'name', label: 'Your full name', required: true, full: true }, { name: 'phone', label: 'Phone', required: true }, { name: 'pin', label: '4-digit PIN', type: 'password', required: true, placeholder: '••••' }, { name: 'code', label: 'Invitation code', required: true, full: true, placeholder: 'IKM-XXXX-XXXX' }])}
      <div class="err" id="joinErr" style="color:var(--red);margin-top:8px"></div>
      <div class="row mt"><button type="button" class="btn" data-act="back0">← Back</button><span class="sp"></span><button class="btn p" type="submit" id="joinGo">Join →</button></div></form></div></div>`;
    $('#joinf').onsubmit = async (e) => {
      e.preventDefault(); const v = Object.fromEntries(new FormData(e.target).entries()); const err = (m) => { $('#joinErr').textContent = m; };
      if (!/^\d{4}$/.test(v.pin)) return err('The PIN must be exactly 4 digits.');
      err('Please wait…'); $('#joinGo').disabled = true;
      try {
        let j = await signIn(v.phone, v.pin);
        if (!j.ok && j.error === 'invalid_login') { const r = await register(v.phone, v.name, v.pin); if (r.ok) j = r; else if (r.error === 'phone_taken') { $('#joinGo').disabled = false; return err('That phone number already has a cloud account with a different PIN. Use the PIN you chose before.'); } else j = r; }
        if (!j.ok) { $('#joinGo').disabled = false; return err(friendly(j)); }
        const prev = DB; DB = emptyShell(); DB.cloud = { shadow: {}, cursor: 0 };
        setAccount(j);
        const g = await call('POST', '/groups/join', { code: v.code });
        if (!g.ok) { DB = prev; $('#joinGo').disabled = false; return err(friendly(g)); }
        Object.assign(DB.cloud, { groupId: g.group.id, role: g.group.role, memberId: g.group.member_id || null });
        await syncNow();
        const me = g.group.role === 'MEMBER' ? DB.members.find((m) => m.id === g.group.member_id) : DB.members.find((m) => samePhone(m.phone, v.phone) && m.role === g.group.role) || DB.members.find((m) => samePhone(m.phone, v.phone));
        if (!me) { DB = prev; $('#joinGo').disabled = false; return err('The group was found, but your phone number is not on its member list. Ask the President to check your number.'); }
        Object.assign(me, await makeCred(v.pin));       // the PIN just proved to the cloud becomes the PIN in the group too
        DB.prefs = DB.prefs || { theme: 'light', lang: 'en' }; applyPrefs();
        commit(); SESSION = me; ROUTE = 'dashboard'; audit('Joined the group online', me.name); commit(); shell(); toast(`Welcome, ${me.name.split(' ')[0]}!`);
      } catch (e2) { $('#joinGo').disabled = false; err(netMsg); }
    };
  };

  }

  function welcomeCard() { return '<div class="ucard" data-act="cloudJoin"><span style="font-size:30px">☁️</span><div><b>Join a group online</b><small>Use a code from your President</small></div></div>'; }

  function start() {
    if (!linked()) return;
    setTimeout(syncNow, 2500);
    window.addEventListener('online', syncNow);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
    setInterval(() => { if (!document.hidden) syncNow(); }, 120000);
  }

  window.Cloud = { install, card, welcomeCard, changed, start, syncNow, linked, _canon: canon, _hash: hashOf };
})();
