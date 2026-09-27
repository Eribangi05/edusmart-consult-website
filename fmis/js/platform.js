/* Platform bridge. On Windows the Electron preload provides window.api; on Android this file builds it on top of the native FmisNative object.
   In a normal browser neither exists and the app falls back to browser storage and downloads. */
(function () {
  'use strict';
  if (window.api || !window.FmisNative) return;
  const N = window.FmisNative; window.FMIS_PLATFORM = 'android';
  const waiting = {}; let seq = 0;
  window.__fmisResolve = (id, v) => { const f = waiting[id]; if (f) { delete waiting[id]; f(v); } };
  const b64 = (s) => btoa(unescape(encodeURIComponent(s)));
  const unb64 = (s) => decodeURIComponent(escape(atob(s)));
  const ask = (fn) => new Promise((res) => { const id = 'r' + (++seq); waiting[id] = res; fn(id); });
  window.api = {
    load: async () => { try { const t = N.load(); return t ? JSON.parse(t) : null; } catch (e) { return null; } },
    save: async (d) => (d === null ? N.clear() : N.save(JSON.stringify(d))),
    exportFile: (o) => ask((id) => N.exportFile(id, o.name, b64(o.content))).then((ok) => (ok ? o.name : false)),
    importFile: () => ask((id) => N.importFile(id)).then((v) => (typeof v === 'string' ? unb64(v) : null)),
    savePdf: (o) => ask((id) => N.printHtml(id, o.name, b64(o.html))).then((ok) => (ok ? o.name : false)),
    openExternal: async (u) => { N.openExternal(u); return true; },
  };
  // The hardware back button: close what is open, then go back to the dashboard, and only then leave the app.
  window.__androidBack = () => {
    try {
      if (typeof modalOpen === 'function' && modalOpen()) { closeModal(); return true; }
      const p = document.getElementById('pop'); if (p) { p.remove(); return true; }
      if (document.body.classList.contains('nav-open')) { document.body.classList.remove('nav-open'); return true; }
      if (typeof VS !== 'undefined' && VS.sel && VS.sel.thread && ROUTE === 'messages') { ACT.closeThread(); return true; }
      if (typeof SESSION !== 'undefined' && SESSION && ROUTE !== 'dashboard') { ACT.go({ r: 'dashboard' }); return true; }
    } catch (e) { /* fall through to leaving the app */ }
    return false;
  };
  window.__flush = () => { try { if (typeof DB !== 'undefined' && DB) Store.flush(DB); } catch (e) { /* ignore */ } };
})();

/* web build: on localhost the cloud address can be pointed at a local server (tests only) */
(function () { try { window.FMIS_PLATFORM = 'web'; if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && localStorage.getItem('fmis_cloud')) window.FMIS_CLOUD_URL = localStorage.getItem('fmis_cloud'); } catch (e) { /* ignore */ } })();

/* installable and offline: register the service worker on the web only (never inside the Android or Windows apps) */
(function () { try { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !window.api && !window.FmisNative) navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) { /* ignore */ } })();
