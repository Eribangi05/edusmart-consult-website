/* Cloud account for Amategeko y'Umuhanda: sign in with phone and PIN on any device (web, Windows, later Android) and the same
   progress, exam history and settings follow the person. Works offline first: everything is saved on the device, and this file only
   sends what changed and merges what other devices sent. Loaded after app.js, so it can use S, persist, accGet, gate, t, loc, toast.
   Server: the Smart School Cloud (POST /v1/acct/...). Set window.AMG_CLOUD_URL to point at another server. */
(function () {
  'use strict';
  var DEFAULT_URL = 'https://smart-school-cloud-sync.onrender.com';
  var running = false, timer = null, suppress = false, again = false;
  var status = { state: 'idle', msg: '' };

  function base() { return String(window.AMG_CLOUD_URL || DEFAULT_URL).replace(/\/$/, '') + '/v1/acct'; }
  function signedIn() { return !!(S.cloud && S.cloud.token); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function canon(v) {
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ':' + canon(v[k]); }).join(',') + '}';
    return JSON.stringify(v);
  }
  function deviceId() { return 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function say(state, msg) { status = { state: state, msg: msg || '' }; var el = document.getElementById('cloudStatus'); if (el) el.textContent = statusText(); }
  function statusText() {
    if (!signedIn()) return '';
    var last = S.cloud.lastSync ? new Date(S.cloud.lastSync).toLocaleString() : '-';
    if (status.state === 'syncing') return loc({ rw: 'Kuvugurura...', en: 'Syncing...', fr: 'Synchronisation...' });
    if (status.state === 'error') return status.msg;
    return loc({ rw: 'Byavuguruwe: ', en: 'Last synced: ', fr: 'Dernière synchro : ' }) + last;
  }

  function call(method, path, body, needAuth) {
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var to = ctl ? setTimeout(function () { ctl.abort(); }, 30000) : null;   // the free server can take a while to wake up
    var headers = { 'Content-Type': 'application/json' };
    if (needAuth !== false && signedIn()) headers.Authorization = 'Bearer ' + S.cloud.token;
    return fetch(base() + path, { method: method, headers: headers, body: body === undefined ? undefined : JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (to) clearTimeout(to); return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); });
  }
  function friendly(j) { return j && j.message ? j.message : loc({ rw: 'Ntibishobotse. Ongera ugerageze.', en: 'That did not work. Try again.', fr: "Cela n'a pas fonctionné. Réessayez." }); }

  /* ---------- what is synced: this person's progress, preferences and name ---------- */
  function localDocs() {
    var p = S.cloud.phone, out = {};
    if (S.progress && S.progress[p]) out['progress:' + p] = S.progress[p];
    out['prefs:main'] = { lang: S.lang, theme: S.theme, textScale: S.textScale || 1, listenMode: !!S.listenMode };
    var acc = accGet(p); if (acc) out['account:' + p] = { name: acc.name };
    return out;
  }
  function mergeQ(a, b) {
    var out = {}; var ids = {}; Object.keys(a).forEach(function (k) { ids[k] = 1; }); Object.keys(b).forEach(function (k) { ids[k] = 1; });
    Object.keys(ids).forEach(function (id) {
      var x = a[id], y = b[id];
      if (!x) out[id] = y; else if (!y) out[id] = x;
      else out[id] = ((y.seen || 0) > (x.seen || 0) || ((y.seen || 0) === (x.seen || 0) && (y.correct || 0) > (x.correct || 0))) ? y : x;   // the side that has seen the question more, so no practice is lost
    });
    return out;
  }
  function mergeHist(a, b) {
    var seen = {}, out = [];
    a.concat(b).forEach(function (h) { var k = canon(h); if (!seen[k]) { seen[k] = 1; out.push(h); } });
    out.sort(function (x, y) { return (y.date || 0) - (x.date || 0); });
    return out.slice(0, 50);
  }
  /** newerIsB: the scalar settings (daily goal, test date, assignment) come from the newer side; counters and history are merged */
  function mergeProgress(a, b, newerIsB) {
    var out = Object.assign({}, newerIsB ? a : b, newerIsB ? b : a);
    out.qstats = mergeQ(a.qstats || {}, b.qstats || {});
    out.history = mergeHist(a.history || [], b.history || []);
    return out;
  }

  function applyRemote(c) {
    var cs = S.cloud, key = c.coll + ':' + c.id;
    if (c.deleted || !c.data) return false;
    var remoteNewer = c.u >= (cs.localU[key] || 0);
    cs.localU[key] = Math.max(cs.localU[key] || 0, c.u);
    cs.shadow[key] = canon(c.data);
    if (c.coll === 'progress' && c.id === cs.phone) {
      var cur = S.progress[cs.phone] || { qstats: {}, history: [] };
      var m = mergeProgress(cur, c.data, remoteNewer);
      S.progress[cs.phone] = m;
      if (S.currentPhone === cs.phone) { S.qstats = m.qstats; S.history = m.history; }
      return true;
    }
    if (c.coll === 'prefs' && c.id === 'main' && remoteNewer) {
      var d = c.data, changed = false;
      if (d.lang && d.lang !== S.lang) { S.lang = d.lang; changed = true; }
      if (d.theme && d.theme !== S.theme) { S.theme = d.theme; changed = true; }
      if (d.textScale && d.textScale !== S.textScale) { S.textScale = d.textScale; changed = true; }
      if (typeof d.listenMode === 'boolean') S.listenMode = d.listenMode;
      if (changed) { try { applyTheme(); applyTextScale(); buildLang(); if (S.currentPhone) { buildNav(); updateCandidateChip(); } } catch (e) { /* screen not ready */ } }
      return true;
    }
    if (c.coll === 'account' && c.id === cs.phone && remoteNewer) {
      var acc = accGet(cs.phone); if (acc && c.data.name && acc.name !== c.data.name) { acc.name = c.data.name; if (S.currentPhone === cs.phone) S.name = acc.name; }
      return true;
    }
    return false;
  }

  function syncNow(manual) {
    if (!signedIn()) return Promise.resolve();
    if (running) { again = true; return Promise.resolve(); }
    if (navigator.onLine === false) { say('error', loc({ rw: 'Nta interineti. Bizavugururwa nyuma.', en: 'You are offline. It will sync later.', fr: 'Hors ligne. La synchro se fera plus tard.' })); return Promise.resolve(); }
    running = true; again = false; say('syncing');
    var cs = S.cloud, pass = 0;
    function round() {
      pass++;
      var docs = localDocs(), changes = [], pushedSig = {};
      Object.keys(docs).forEach(function (key) {
        var sig = canon(docs[key]);
        if (cs.shadow[key] !== sig) { var i = key.indexOf(':'); var u = Date.now(); changes.push({ coll: key.slice(0, i), id: key.slice(i + 1), u: u, data: docs[key] }); pushedSig[key] = { sig: sig, u: u }; }
      });
      var cursor = cs.cursor || 0, touched = false, first = true;
      function page() {
        return call('POST', '/sync', { app: 'amg', scope: 'me', cursor: cursor, changes: first ? changes : [] }).then(function (r) {
          if (r._status === 401) { S.cloud = null; suppress = true; return persist().then(function () { suppress = false; throw { signedOut: true, msg: r.message }; }); }
          if (!r.ok) throw { msg: friendly(r) };
          if (first) { Object.keys(pushedSig).forEach(function (k) { cs.shadow[k] = pushedSig[k].sig; cs.localU[k] = pushedSig[k].u; }); (r.skipped || []).forEach(function (s) { /* rejected records stay unsent */ }); }
          first = false;
          (r.changes || []).forEach(function (c) { if (applyRemote(c)) touched = true; });
          cursor = r.cursor; cs.cursor = cursor;
          return r.more ? page() : null;
        });
      }
      return page().then(function () {
        cs.lastSync = Date.now();
        suppress = true; return persist().then(function () { suppress = false; if (touched && pass < 2) return round(); });
      });
    }
    return round().then(function () { say('ok'); refreshCard(); })
      .catch(function (e) {
        suppress = false;
        if (e && e.signedOut) { say('error', e.msg || loc({ rw: 'Wasohotse. Ongera winjire.', en: 'You were signed out. Sign in again.', fr: 'Déconnecté. Reconnectez-vous.' })); refreshCard(); return; }
        say('error', (e && e.msg) || loc({ rw: 'Ntibyavuguruwe. Bizongera kugeragezwa.', en: 'Could not sync. It will try again.', fr: 'Synchro impossible. Nouvel essai bientôt.' }));
      })
      .then(function () { running = false; if (again) { again = false; changed(); } });
  }

  function changed() {                     // called after every save: sync a few seconds later, once
    if (suppress || !signedIn()) return;
    clearTimeout(timer); timer = setTimeout(function () { syncNow(false); }, 4000);
  }

  /* ---------- account actions ---------- */
  function ensureLocalAccount(phone, name, pin) {
    var acc = accGet(phone);
    if (!acc) return accRegister(phone, name, pin);
    return sha256Hex(acc.salt + pin).then(function (h) {
      if (h !== acc.pinHash) { acc.salt = newSalt(); return sha256Hex(acc.salt + pin).then(function (nh) { acc.pinHash = nh; return persist(); }); }   // the cloud PIN is the one just proved
    });
  }
  function link(j, phone, pin) {
    S.cloud = { phone: j.user.phone, name: j.user.name, token: j.token, device: deviceId(), cursor: 0, shadow: {}, localU: {}, lastSync: 0, user: j.user };
    return ensureLocalAccount(j.user.phone, j.user.name, pin).then(function () { S.onboarded = true; if (!S.school || !S.school.name) S.school = { name: "Amategeko y'Umuhanda", location: '', contact: '' }; return persist(); });
  }
  function signIn(phone, pin) {
    return call('POST', '/login', { phone: phone, pin: pin, device: deviceId(), label: navigator.platform || 'device', platform: window.AMG_PLATFORM || 'web' }, false)
      .then(function (j) { if (!j.ok) return j; return link(j, phone, pin).then(function () { return j; }); });
  }
  function register(phone, name, pin) {
    return call('POST', '/register', { phone: phone, name: name, pin: pin, device: deviceId(), label: navigator.platform || 'device', platform: window.AMG_PLATFORM || 'web' }, false)
      .then(function (j) { if (!j.ok) return j; return link(j, phone, pin).then(function () { return j; }); });
  }
  function signOut() {
    var p = signedIn() ? call('POST', '/logout', {}).catch(function () {}) : Promise.resolve();
    return p.then(function () { S.cloud = null; try { if (window.api && window.api.clearAccountContent) window.api.clearAccountContent(); } catch (e) { /* ignore */ } return persist(); });
  }
  function checkEntitlement() {
    if (!signedIn() || !(window.api && window.api.applyAccountContent)) return Promise.resolve();
    return call('GET', '/entitlements/amg?have=' + encodeURIComponent(S.cloud.contentVersion || '')).then(function (j) {
      if (j.ok && j.bundle) { S.cloud.contentVersion = j.version; return window.api.applyAccountContent(j).then(function () { return persist(); }); }
      if (j._status === 404 || j._status === 410) { try { window.api.clearAccountContent && window.api.clearAccountContent(); } catch (e) { /* ignore */ } }
    }).catch(function () {});
  }
  function redeem(code) {
    return call('POST', '/entitlements/redeem', { app: 'amg', code: code }).then(function (j) {
      if (!j.ok) return j;
      S.cloud.contentVersion = ''; return checkEntitlement().then(function () { return j; });
    });
  }

  /* ---------- screens ---------- */
  var L = function (rw, en, fr) { return loc({ rw: rw, en: en, fr: fr }); };
  function refreshCard() { var host = document.getElementById('cloudCard'); if (host) { host.innerHTML = cardInner(); bindCard(); } }

  function cardInner() {
    var canCode = !!(window.api && window.api.applyAccountContent);
    if (signedIn()) {
      return '<b>☁ ' + L('Konti kuri interineti', 'Cloud account', 'Compte en ligne') + '</b>' +
        '<p class="muted" style="margin:8px 0;line-height:1.5">' + L('Winjiye nka ', 'Signed in as ', 'Connecté en tant que ') + '<b>' + esc(S.cloud.name || '') + '</b> (' + esc(S.cloud.phone) + '). ' +
        L('Amanota n\'imyitozo yawe bigaragara ku bikoresho byawe byose.', 'Your progress follows you to all your devices.', 'Votre progression vous suit sur tous vos appareils.') + '</p>' +
        '<div class="muted" id="cloudStatus" style="font-size:13px;margin-bottom:10px">' + esc(statusText()) + '</div>' +
        '<div class="row"><button class="btn ghost sm" id="cloudSync">🔄 ' + L('Vugurura ubu', 'Sync now', 'Synchroniser') + '</button><button class="btn ghost sm" id="cloudOut" style="color:var(--red)">' + L('Sohoka kuri konti', 'Sign out of cloud', 'Se déconnecter') + '</button></div>' +
        (canCode ? '<div class="field" style="margin-top:14px"><label>' + L('Fungura verisiyo yuzuye ukoresheje code', 'Unlock the full version with a code', 'Débloquer la version complète avec un code') + '</label><input id="cloudCode" placeholder="AMG-XXXX-XXXX"/></div><div class="err" id="cloudErr"></div><button class="btn ghost sm" id="cloudRedeem">' + L('Emeza code', 'Use code', 'Utiliser le code') + '</button>' : '');
    }
    var acc = accGet(S.currentPhone);
    return '<b>☁ ' + L('Konti kuri interineti', 'Cloud account', 'Compte en ligne') + '</b>' +
      '<p class="muted" style="margin:8px 0;line-height:1.5">' + L('Injira kugira ngo amanota yawe agaragare no ku wundi mudasobwa cyangwa telefoni. Ntibisabwa: porogaramu ikora nta interineti.', 'Sign in so your progress is also on your other phone or computer. Optional: the app works without it.', 'Connectez-vous pour retrouver votre progression sur un autre téléphone ou ordinateur. Facultatif : l\'appli fonctionne sans.') + '</p>' +
      '<div class="field"><label>' + t('phone') + '</label><input id="cloudPhone" value="' + esc((acc && acc.phone) || '') + '" inputmode="numeric"/></div>' +
      '<div class="field"><label>PIN</label><input id="cloudPin" type="password" inputmode="numeric" maxlength="8"/></div><div class="err" id="cloudErr"></div>' +
      '<div class="row"><button class="btn sm" id="cloudIn">' + L('Injira', 'Sign in', 'Connexion') + '</button><button class="btn ghost sm" id="cloudNew">' + L('Fungura konti', 'Create cloud account', 'Créer un compte') + '</button></div>';
  }
  function settingsCard() { return '<div class="card" id="cloudCard" style="max-width:560px;margin-top:16px">' + cardInner() + '</div>'; }
  function err(msg) { var e = document.getElementById('cloudErr'); if (e) e.textContent = msg || ''; }

  function bindCard() {
    var q = function (id) { return document.getElementById(id); };
    if (q('cloudSync')) q('cloudSync').onclick = function () { syncNow(true); };
    if (q('cloudOut')) q('cloudOut').onclick = function () { signOut().then(function () { refreshCard(); toast('✓'); }); };
    if (q('cloudRedeem')) q('cloudRedeem').onclick = function () {
      var code = q('cloudCode').value.trim(); if (!code) return err(L('Andika code', 'Enter the code', 'Saisissez le code'));
      err(''); redeem(code).then(function (j) { if (j.ok) { toast('✓ ' + (j.label || '')); setTimeout(function () { location.reload(); }, 600); } else err(friendly(j)); }).catch(function () { err(friendly()); });
    };
    var acct = function (create) {
      var phone = q('cloudPhone').value.trim(), pin = q('cloudPin').value;
      if (!/^\d{10}$/.test(phone.replace(/\D/g, '')) && !/^\+?250\d{9}$/.test(phone.replace(/\s/g, ''))) return err(t('invalid_phone'));
      if (!validPin(pin)) return err(t('invalid_pin'));
      err(L('Tegereza...', 'Please wait...', 'Patientez...'));
      var acc = accGet(S.currentPhone);
      (create ? register(phone, (acc && acc.name) || phone, pin) : signIn(phone, pin)).then(function (j) {
        if (!j.ok) return err(friendly(j));
        toast('✓'); refreshCard(); syncNow(true); checkEntitlement();
      }).catch(function () { err(L('Ntibishoboye kugera kuri seriveri. Reba interineti.', 'Could not reach the server. Check your connection.', 'Serveur injoignable. Vérifiez la connexion.')); });
    };
    if (q('cloudIn')) q('cloudIn').onclick = function () { acct(false); };
    if (q('cloudNew')) q('cloudNew').onclick = function () { acct(true); };
  }

  /** the sign-in screen for a new device, before any local account exists */
  function signInGate() {
    gate('<h2>☁ ' + L('Injira kuri konti yawe', 'Sign in to your cloud account', 'Connexion à votre compte') + '</h2>' +
      '<p class="muted" style="margin:4px 0 12px">' + L('Koresha nimero ya telefoni na PIN wakoresheje. Amanota yawe arahita agaruka.', 'Use the phone number and PIN you registered with. Your progress comes back automatically.', 'Utilisez le numéro et le PIN de votre compte. Votre progression revient automatiquement.') + '</p>' +
      '<div class="field"><label>' + t('phone') + '</label><input id="cgPhone" inputmode="numeric"/></div>' +
      '<div class="field"><label>PIN</label><input id="cgPin" type="password" inputmode="numeric" maxlength="8"/></div><div class="err" id="cgErr"></div>' +
      '<button class="btn wide" id="cgGo">' + L('Injira', 'Sign in', 'Connexion') + '</button>' +
      '<button class="btn ghost wide" id="cgBack" style="margin-top:10px">← ' + t('back') + '</button>');
    document.getElementById('cgBack').onclick = function () { authGate(); };
    var go = function () {
      var phone = document.getElementById('cgPhone').value.trim(), pin = document.getElementById('cgPin').value;
      if (!validPin(pin)) return gateErr('cgErr', t('invalid_pin'));
      gateErr('cgErr', L('Tegereza...', 'Please wait...', 'Patientez...'));
      signIn(phone, pin).then(function (j) {
        if (!j.ok) return gateErr('cgErr', friendly(j));
        S.currentPhone = S.cloud.phone; S.role = 'candidate';
        return syncNow(true).then(function () { checkEntitlement(); enterApp(); });
      }).catch(function () { gateErr('cgErr', L('Ntibishoboye kugera kuri seriveri. Reba interineti.', 'Could not reach the server. Check your connection.', 'Serveur injoignable. Vérifiez la connexion.')); });
    };
    document.getElementById('cgGo').onclick = go;
    document.getElementById('cgPin').addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  }
  function gateLink() { return '<button class="btn ghost wide" id="toCloud" style="margin-top:10px">☁ ' + L('Mfite konti kuri interineti', 'I have a cloud account', "J'ai un compte en ligne") + '</button>'; }
  function bindGateLink() { var b = document.getElementById('toCloud'); if (b) b.onclick = signInGate; }

  function start() {
    if (!S.cloud || typeof S.cloud !== 'object') { S.cloud = null; return; }
    S.cloud.shadow = S.cloud.shadow || {}; S.cloud.localU = S.cloud.localU || {};
    if (!signedIn()) return;
    setTimeout(function () { syncNow(false).then(checkEntitlement); }, 2500);
    window.addEventListener('online', function () { syncNow(false); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) syncNow(false); });
    setInterval(function () { if (!document.hidden) syncNow(false); }, 120000);
  }

  window.Cloud = { start: start, changed: changed, syncNow: syncNow, signedIn: signedIn, settingsCard: settingsCard, bindCard: bindCard, signInGate: signInGate, gateLink: gateLink, bindGateLink: bindGateLink, signIn: signIn, register: register, signOut: signOut, redeem: redeem, checkEntitlement: checkEntitlement, _merge: { mergeProgress: mergeProgress, mergeQ: mergeQ, mergeHist: mergeHist, canon: canon } };
})();
