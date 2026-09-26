/* Browser replacement for the Electron bridge (window.api) used by the Windows app.
   The site ships a free sample of the content. A code from EduSmart Consult unlocks the full content, which is fetched from
   the Smart School Cloud server and kept in this browser, so the app then also works without a connection. */
(function () {
  'use strict';
  var CLOUD = 'https://smart-school-cloud-sync.onrender.com';
  var SCRIPT = document.currentScript && document.currentScript.src;
  var BASE = SCRIPT ? new URL('.', SCRIPT).href : './';
  var NAMES = ['questions', 'signs', 'glossary', 'lessons', 'gazette'];

  // ---- storage that never throws (private windows and blocked storage fall back to memory)
  var mem = {};
  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { if (v === undefined) return mem[k] == null ? null : mem[k]; if (v === null) delete mem[k]; else mem[k] = v; }
    return null;
  }
  // for local testing only: on localhost the server address can be pointed at a local copy of the cloud server
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && ls('amg_cloud')) CLOUD = ls('amg_cloud');
  function parse(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function deviceId() {
    var d = ls('amg_dev');
    if (!d) { d = 'web-' + Math.random().toString(36).slice(2) + Date.now().toString(36); ls('amg_dev', d); }
    return d;
  }

  var state = { mode: 'sample', data: {}, meta: null, label: '', expires: null, notice: '' };

  function unlockCall(code, have) {
    return fetch(CLOUD + '/v1/theory/unlock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code, device: deviceId(), have: have || null }) })
      .then(function (r) { return r.json().then(function (j) { j._status = r.status; return j; }); });
  }
  function storeFull(code, j) {
    ls('amg_code', code);
    ls('amg_full', JSON.stringify({ version: j.version, bundle: j.bundle, label: j.label, expires: j.expires_at }));
  }

  function getJSON(name) { return fetch(BASE + 'data/' + name + '.json').then(function (r) { if (!r.ok) throw new Error(name); return r.json(); }); }

  var ready = Promise.all(NAMES.concat(['meta']).map(getJSON)).then(function (all) {
    NAMES.forEach(function (n, i) { state.data[n] = all[i]; });
    state.meta = all[NAMES.length];
    var code = ls('amg_code'); var full = parse(ls('amg_full'));
    if (!code) return;
    if (full && full.bundle) {
      state.data = full.bundle; state.mode = 'full'; state.label = full.label || ''; state.expires = full.expires;
      if (navigator.onLine) unlockCall(code, full.version).then(function (j) {          // quiet re-check: revoked codes stop working
        if (j.ok && j.bundle) storeFull(code, j);
        else if (!j.ok && (j.error === 'invalid_code' || j.error === 'code_expired')) { ls('amg_code', null); ls('amg_full', null); ls('amg_notice', j.message || 'Your code is no longer valid.'); }
      }).catch(function () {});
      return;
    }
    return unlockCall(code, null).then(function (j) {                                     // code known but content not cached yet
      if (j.ok && j.bundle) { storeFull(code, j); state.data = j.bundle; state.mode = 'full'; state.label = j.label || ''; state.expires = j.expires_at; }
      else if (!j.ok && (j.error === 'invalid_code' || j.error === 'code_expired' || j.error === 'code_used_up')) { ls('amg_code', null); state.notice = j.message || ''; }
    }).catch(function () { state.notice = 'You are offline, so the sample is shown. Connect once to load the full version again.'; });
  });

  // ---- file helpers used by backup, restore and school logo
  function download(name, content, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type: type || 'text/plain' }));
    a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function pickFile(accept, asDataUrl) {
    return new Promise(function (resolve) {
      var i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.style.display = 'none'; document.body.appendChild(i);
      i.onchange = function () {
        var f = i.files && i.files[0]; i.remove(); if (!f) return resolve(null);
        if (asDataUrl && f.size > 2 * 1024 * 1024) return resolve({ error: 'too_big' });
        var fr = new FileReader(); fr.onload = function () { resolve({ result: fr.result }); }; fr.onerror = function () { resolve(null); };
        asDataUrl ? fr.readAsDataURL(f) : fr.readAsText(f);
      };
      i.click();
    });
  }
  function readSync(url) {
    try { var x = new XMLHttpRequest(); x.open('GET', url, false); x.send(); return x.status === 200 ? JSON.parse(x.responseText) : null; } catch (e) { return null; }
  }

  window.api = {
    // A visitor is one learner on their own device, so a default school is filled in and the "register your school" step is skipped.
    getStore: function () { return Promise.resolve(parse(ls('amg_store')) || { school: { name: "Amategeko y'Umuhanda", location: '', contact: '' } }); },
    setStore: function (o) { ls('amg_store', JSON.stringify(o)); return Promise.resolve(true); },
    openExternal: function (u) { window.open(u, '_blank', 'noopener'); return Promise.resolve(true); },
    loadQuestions: function () { return state.data.questions; },
    loadSigns: function () { return state.data.signs; },
    loadGlossary: function () { return state.data.glossary; },
    loadLessons: function () { return state.data.lessons; },
    loadGazette: function () { return state.data.gazette; },
    loadGazetteIndex: function (n) { return state.mode === 'full' ? readSync(BASE + 'assets/gazette/' + n + '.idx.json') : null; },
    gazettePath: function (n) { return BASE + 'assets/gazette/' + n + '.pdf'; },
    assetPath: function () { return BASE + 'assets'; },
    loadContentUpdate: function () { return Promise.resolve(null); },
    importContentUpdate: function () { return Promise.resolve({ ok: false }); },
    clearContentUpdate: function () { return Promise.resolve(true); },
    pickImage: function () { return pickFile('image/*', true).then(function (r) { return r && r.error ? r : (r ? { dataUrl: r.result } : null); }); },
    licenseInfo: function () { return Promise.resolve({ activated: true, machineId: 'WEB' }); },
    activate: function () { return Promise.resolve({ ok: true }); },
    saveText: function (o) { download(o.defaultName || 'amategeko.txt', o.content || '', /json/i.test(o.defaultName || '') ? 'application/json' : 'text/csv'); return Promise.resolve({ ok: true }); },
    openText: function () { return pickFile('.json,application/json', false).then(function (r) { return r ? { ok: true, content: r.result } : { ok: false, canceled: true }; }); },
    setFullscreen: function (on) {
      try { if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* not allowed here */ }
      return Promise.resolve(true);
    }
  };
  window.__amgReady = ready;

  // ---- sample banner, unlock dialog and small-screen menu (added once the app has drawn itself)
  var CSS_ID = 'amg-web-ui';
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function lang() { try { var s = parse(ls('amg_store')); return (s && s.lang) || 'rw'; } catch (e) { return 'rw'; } }
  var T = {
    rw: { sample: 'Verisiyo y’ubuntu', unlock: 'Fungura byose', full: 'Verisiyo yuzuye', title: 'Fungura verisiyo yuzuye', intro: 'Injiza kode wahawe n’ishuri ryawe cyangwa na EduSmart Consult.', code: 'Kode', go: 'Fungura', bad: 'Kode ntiyemewe.', net: 'Nta murongo wa interineti. Ongera ugerageze.', get: 'Nta kode ufite? Tuvugishe', close: 'Funga', left: 'Ibibazo', of: 'kuri', menu: 'Menu', busy: 'Tegereza…', done: 'Byafunguwe!' },
    en: { sample: 'Free sample', unlock: 'Unlock full version', full: 'Full version', title: 'Unlock the full version', intro: 'Enter the code from your driving school or from EduSmart Consult.', code: 'Code', go: 'Unlock', bad: 'That code is not valid.', net: 'No internet connection. Try again.', get: 'No code? Contact us', close: 'Close', left: 'Questions', of: 'of', menu: 'Menu', busy: 'Please wait…', done: 'Unlocked!' },
    fr: { sample: 'Échantillon gratuit', unlock: 'Débloquer tout', full: 'Version complète', title: 'Débloquer la version complète', intro: 'Saisissez le code de votre auto-école ou d’EduSmart Consult.', code: 'Code', go: 'Débloquer', bad: 'Ce code n’est pas valide.', net: 'Pas de connexion. Réessayez.', get: 'Pas de code ? Contactez-nous', close: 'Fermer', left: 'Questions', of: 'sur', menu: 'Menu', busy: 'Patientez…', done: 'Débloqué !' }
  };
  function tt(k) { return (T[lang()] || T.en)[k]; }

  function openUnlock() {
    var old = document.getElementById('amgUnlock'); if (old) old.remove();
    var d = el('div', { id: 'amgUnlock', class: 'amg-overlay', role: 'dialog', 'aria-modal': 'true' },
      '<div class="amg-box"><h3>' + tt('title') + '</h3><p>' + tt('intro') + '</p>' +
      '<label>' + tt('code') + '<input id="amgCode" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="AMG-XXXX-XXXX"></label>' +
      '<div id="amgErr" class="amg-err" aria-live="polite"></div>' +
      '<div class="amg-row"><button id="amgGo" class="amg-btn">' + tt('go') + '</button><button id="amgX" class="amg-btn amg-ghost">' + tt('close') + '</button></div>' +
      '<a class="amg-link" href="../contact.html">' + tt('get') + '</a></div>');
    document.body.appendChild(d);
    var inp = d.querySelector('#amgCode'), err = d.querySelector('#amgErr'), go = d.querySelector('#amgGo');
    inp.focus();
    d.querySelector('#amgX').onclick = function () { d.remove(); };
    d.addEventListener('click', function (e) { if (e.target === d) d.remove(); });
    function run() {
      var code = inp.value.trim(); if (!code) return;
      err.textContent = ''; go.disabled = true; go.textContent = tt('busy');
      unlockCall(code, null).then(function (j) {
        if (j.ok && j.bundle) { storeFull(code, j); ls('amg_notice', null); go.textContent = tt('done'); setTimeout(function () { location.reload(); }, 500); }
        else { err.textContent = j.message || tt('bad'); go.disabled = false; go.textContent = tt('go'); }
      }).catch(function () { err.textContent = tt('net'); go.disabled = false; go.textContent = tt('go'); });
    }
    go.onclick = run; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
  }

  function decorate() {
    if (!document.getElementById('app')) return;
    var right = document.querySelector('.topbar-right');
    if (right && !document.getElementById('amgChip')) {
      var chip = el('button', { id: 'amgChip', class: 'amg-chip ' + (state.mode === 'full' ? 'is-full' : 'is-sample'), type: 'button' });
      chip.textContent = state.mode === 'full' ? '✓ ' + tt('full') : '🔓 ' + tt('unlock');
      if (state.mode !== 'full') chip.onclick = openUnlock; else chip.title = state.label || '';
      right.insertBefore(chip, right.firstChild);
    }
    var top = document.querySelector('.topbar');
    if (top && !document.getElementById('amgMenuBtn')) {
      var mb = el('button', { id: 'amgMenuBtn', class: 'amg-menu-btn', type: 'button', 'aria-label': tt('menu') }, '☰');
      mb.onclick = function () { document.body.classList.toggle('amg-nav-open'); };
      top.insertBefore(mb, top.firstChild);
      var back = el('div', { class: 'amg-backdrop' }); back.onclick = function () { document.body.classList.remove('amg-nav-open'); }; document.body.appendChild(back);
      var nav = document.getElementById('nav'); if (nav) nav.addEventListener('click', function () { document.body.classList.remove('amg-nav-open'); });
    }
  }
  function refreshChip() { var c = document.getElementById('amgChip'); if (c && state.mode !== 'full') c.textContent = '🔓 ' + tt('unlock'); }

  function showNotice() {
    var n = ls('amg_notice') || state.notice; if (!n) return;
    ls('amg_notice', null);
    var b = el('div', { class: 'amg-notice' }, '<span></span><button type="button" aria-label="x">×</button>'); b.firstChild.textContent = n;
    b.lastChild.onclick = function () { b.remove(); }; document.body.appendChild(b);
  }

  window.__amgAfterStart = function () {
    decorate(); showNotice();
    new MutationObserver(function () { decorate(); refreshChip(); }).observe(document.getElementById('app'), { childList: true, subtree: true });
  };
})();
