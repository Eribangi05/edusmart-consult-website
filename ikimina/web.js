/* Web additions for Ikimina: a "back to website" link and a one-time notice that data stays in this browser. */
(function () {
  try {
    var bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0f5132;color:#fff;font:13px/1.4 system-ui,sans-serif;padding:8px 14px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap';
    bar.innerHTML = '<span>Your group data is saved only in this browser on this device. Use Reports &rsaquo; Backup all data to keep a copy.</span><a href="../savings-groups.html" style="color:#f5b301;font-weight:600">About Ikimina</a><button id="wb-x" style="background:none;border:1px solid #fff8;color:#fff;border-radius:6px;padding:2px 10px;cursor:pointer">OK</button>';
    var seen = false; try { seen = localStorage.getItem('iki-web-note') === '1'; } catch (e) {}
    if (!seen) { document.body.appendChild(bar); bar.querySelector('#wb-x').onclick = function () { bar.remove(); try { localStorage.setItem('iki-web-note', '1'); } catch (e) {} }; }
  } catch (e) {}
})();

/* Phone layout: a menu button opens the side panel. */
(function () {
  try {
    var scrim = document.createElement('div'); scrim.className = 'wb-scrim'; document.body.appendChild(scrim);
    scrim.onclick = function () { document.body.classList.remove('wb-open'); };
    var app = document.getElementById('app');
    function addBtn() {
      var top = document.querySelector('.top');
      if (!top || top.querySelector('.wb-menu')) return;
      var b = document.createElement('button'); b.className = 'wb-menu'; b.type = 'button'; b.setAttribute('aria-label', 'Open menu'); b.innerHTML = '&#9776;';
      b.onclick = function (e) { e.stopPropagation(); document.body.classList.toggle('wb-open'); };
      top.insertBefore(b, top.firstChild);
    }
    new MutationObserver(addBtn).observe(app, { childList: true, subtree: false });
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.side a[data-r]')) document.body.classList.remove('wb-open'); });
    addBtn();
  } catch (e) {}
})();

/* Cloud sync settings for the web build. For local testing only, on localhost the server address can point at a local copy. */
(function () {
  try {
    window.IKI_PLATFORM = 'web';
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && localStorage.getItem('iki_cloud')) window.IKI_CLOUD_URL = localStorage.getItem('iki_cloud');
  } catch (e) {}
})();
