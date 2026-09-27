/* Extra features: live announcements, request form, news and product filters, share, tour, site search, privacy notice,
   optional analytics, offline copy (service worker), install button and the content editor. No libraries. */
(function () {
  var C = window.EDUSMART || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function getJSON(u) { return fetch(u, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(u); return r.json(); }); }

  // ---------------- live announcements: content/announcements.json wins over the copy built into the page
  var track = $('.ticker-track');
  if (track) {
    getJSON('content/announcements.json').then(function (list) {
      if (!list || !list.length) return;
      var one = list.map(function (x) { return '<a class="tk" href="' + esc(x.href || '#') + '"><b>' + esc(x.tag || '') + '</b> ' + esc(x.text || '') + '</a>'; }).join('');
      track.innerHTML = one + one;
    }).catch(function () { /* keep the built-in list */ });
  }

  // ---------------- pricing from config, downloads checksum
  var pr = C.pricing || {};
  $$('[data-price]').forEach(function (el) { var v = pr[el.getAttribute('data-price')]; if (v) el.textContent = v; });
  var dl = C.downloads || {};
  if (dl.sha256Windows) { var bx = $('[data-sha]'); if (bx) { bx.hidden = false; $('[data-sha-win]', bx).textContent = dl.sha256Windows; } }
  $$('[data-email-link]').forEach(function (a) { a.href = 'mailto:' + (C.email || '') + (a.getAttribute('data-subject') ? '?subject=' + encodeURIComponent(a.getAttribute('data-subject')) : ''); });

  // ---------------- request a demo or quote
  var lead = $('form[data-lead]');
  if (lead) {
    var qs = new URLSearchParams(location.search), svc = qs.get('service'), topic = qs.get('topic');
    var map = { demo: 'Smart School App demo or trial', cloud: 'Smart School Cloud access', training: 'Training for teachers or staff' };
    if (svc && map[svc]) { var box = $('input[name=needs][value="' + map[svc] + '"]', lead); if (box) box.checked = true; }
    if (topic) { var m = lead.elements.message; if (m && !m.value) m.value = topic + '\n'; }
    var steps = $$('.lead-steps span', lead);
    var fs = $$('fieldset', lead);
    function stepUpdate() { var y = window.scrollY + window.innerHeight * 0.45, cur = 0; fs.forEach(function (f, i) { if (f.getBoundingClientRect().top + window.scrollY <= y) cur = i; }); steps.forEach(function (s, i) { s.classList.toggle('on', i === cur); }); }
    window.addEventListener('scroll', stepUpdate, { passive: true }); stepUpdate();
    lead.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('#leadMsg'); msg.className = 'msg'; msg.textContent = '';
      if (lead.elements.website && lead.elements.website.value) return;
      var d = {}; new FormData(lead).forEach(function (v, k) { if (k === 'website') return; if (d[k] === undefined) d[k] = v; else d[k] += ', ' + v; });
      if (!d.name || !d.email || !d.organisation) { msg.className = 'msg err'; msg.textContent = 'Please fill in your name, organisation and email.'; return; }
      if (!/^\S+@\S+\.\S+$/.test(d.email)) { msg.className = 'msg err'; msg.textContent = 'That email address does not look right.'; return; }
      if (!d.consent) { msg.className = 'msg err'; msg.textContent = 'Please tick the box to agree.'; return; }
      var text = Object.keys(d).map(function (k) { return k + ': ' + d[k]; }).join('\n');
      var payload = Object.assign({ _subject: '[Website request] ' + (d.needs || 'Enquiry') + ' | ' + d.organisation }, d);
      var done = function () { $('#leadDone').classList.remove('hidden'); lead.reset(); window.scrollTo({ top: $('.lead-wrap').offsetTop - 120, behavior: 'smooth' }); };
      var btn = $('button[type=submit]', lead); btn.disabled = true;
      try { if (C.cloud && C.cloud.baseUrl) fetch(C.cloud.baseUrl + '/v1/public/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, email: d.email, organisation: d.organisation, message: text }), keepalive: true }).catch(function () {}); } catch (e) {}
      if (C.formEndpoint) {
        fetch(C.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .then(function (r) { if (!r.ok) throw new Error(); done(); })
          .catch(function () { msg.className = 'msg err'; msg.textContent = 'The request could not be sent. Please email ' + C.email + ' or call ' + C.phone + '.'; })
          .then(function () { btn.disabled = false; });
      } else { location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(payload._subject) + '&body=' + encodeURIComponent(text); done(); btn.disabled = false; }
    });
  }

  // ---------------- news filter
  var nq = $('#newsQ');
  if (nq) {
    var ncat = 'all';
    function nApply() { var q = nq.value.trim().toLowerCase(), any = false; $$('.ncard').forEach(function (c) { var ok = (ncat === 'all' || c.getAttribute('data-cat') === ncat) && (!q || c.getAttribute('data-text').indexOf(q) > -1); c.classList.toggle('hidden', !ok); if (ok) any = true; }); $('#newsEmpty').classList.toggle('hidden', any); }
    nq.addEventListener('input', nApply);
    $('#newsCats').addEventListener('click', function (e) { var b = e.target.closest('[data-ncat]'); if (!b) return; ncat = b.getAttribute('data-ncat'); $$('#newsCats .chip').forEach(function (x) { x.classList.toggle('on', x === b); }); nApply(); });
  }

  // ---------------- products: search + platform + category together
  var pq = $('#prodQ');
  if (pq) {
    var pc = 'all', pp = $('#prodPlat');
    function pApply() { var q = pq.value.trim().toLowerCase(), pl = pp.value.toLowerCase(), any = false;
      $$('#all .pcard').forEach(function (c) { var t = c.textContent.toLowerCase(); var ok = (pc === 'all' || c.getAttribute('data-cat') === pc) && (!q || t.indexOf(q) > -1) && (!pl || (c.querySelector('.pplat') || {}).textContent.toLowerCase().indexOf(pl) > -1); c.hidden = !ok; if (ok) any = true; });
      var em = $('#prodEmpty'); if (em) em.classList.toggle('hidden', any); }
    pq.addEventListener('input', pApply); pp.addEventListener('change', pApply);
    $$('[data-filter]').forEach(function (b) { b.addEventListener('click', function () { pc = b.getAttribute('data-filter'); $$('[data-filter]').forEach(function (x) { x.classList.toggle('on', x === b); }); pApply(); }); });
    if (location.hash && $(location.hash + ' , #all .pcard')) { /* hash links from the home page just scroll */ }
  }

  // ---------------- share buttons
  $$('[data-share]').forEach(function (b) {
    var kind = b.getAttribute('data-share'), t = b.getAttribute('data-title') || document.title, u = b.getAttribute('data-url') || location.href;
    if (kind === 'wa') b.href = 'https://wa.me/?text=' + encodeURIComponent(t + ' ' + u);
    if (kind === 'mail') b.href = 'mailto:?subject=' + encodeURIComponent(t) + '&body=' + encodeURIComponent(t + '\n' + u);
    if (kind === 'copy') b.addEventListener('click', function () { (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { b.textContent = 'Link copied'; }, function () { b.textContent = 'Copy failed'; }); });
  });

  // ---------------- tour
  var tour = $('[data-tour]');
  if (tour) {
    var sl = $$('.slide', tour), th = $$('.tthumb', tour), bar = $('.tour-progress i', tour), i = 0, timer = null, play = $('[data-play]', tour);
    function show(n) { i = (n + sl.length) % sl.length; sl.forEach(function (s, k) { s.classList.toggle('on', k === i); }); th.forEach(function (t, k) { t.classList.toggle('on', k === i); }); bar.style.width = ((i + 1) / sl.length * 100) + '%'; }
    function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = 'Play'; play.setAttribute('aria-pressed', 'false'); }
    $('[data-next]', tour).addEventListener('click', function () { stop(); show(i + 1); });
    $('[data-prev]', tour).addEventListener('click', function () { stop(); show(i - 1); });
    play.addEventListener('click', function () { if (timer) { stop(); return; } play.textContent = 'Pause'; play.setAttribute('aria-pressed', 'true'); timer = setInterval(function () { show(i + 1); }, 5000); });
    th.forEach(function (t) { t.addEventListener('click', function () { stop(); show(parseInt(t.getAttribute('data-go'), 10)); }); });
    document.addEventListener('keydown', function (e) { if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) return; if (e.key === 'ArrowRight') { stop(); show(i + 1); } if (e.key === 'ArrowLeft') { stop(); show(i - 1); } });
    show(0);
  }

  // ---------------- site search (page + pop-up opened with the / key or the magnifier)
  var idx = null;
  function loadIdx() { return idx ? Promise.resolve(idx) : getJSON('search-index.json').then(function (d) { idx = d; return d; }); }
  function run(q, box) {
    q = q.trim().toLowerCase(); if (q.length < 2) { box.innerHTML = '<p class="muted">Type at least two letters.</p>'; return; }
    var words = q.split(/\s+/);
    loadIdx().then(function (list) {
      var res = list.map(function (p) { var t = p.t.toLowerCase(), d = (p.d || '').toLowerCase(), x = (p.x || '').toLowerCase(), s = 0;
        words.forEach(function (w) { if (t.indexOf(w) > -1) s += 10; if (d.indexOf(w) > -1) s += 4; if (x.indexOf(w) > -1) s += 1; });
        var all = words.every(function (w) { return (t + ' ' + d + ' ' + x).indexOf(w) > -1; }); return all ? { p: p, s: s } : null; }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 12);
      var hl = function (s) { var out = esc(s); words.forEach(function (w) { out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return out; };
      box.innerHTML = res.length ? res.map(function (r) { return '<a class="r" href="' + esc(r.p.u) + '"><b>' + hl(r.p.t) + '</b><span>' + hl((r.p.d || r.p.x || '').slice(0, 150)) + '</span></a>'; }).join('') : '<p class="muted">Nothing found for "' + esc(q) + '". Try another word, or <a href="contact.html">ask us</a>.</p>';
    }).catch(function () { box.innerHTML = '<p class="muted">Search is not available right now.</p>'; });
  }
  var sq = $('#siteQ');
  if (sq) {
    var box = $('#siteResults'), init = new URLSearchParams(location.search).get('q');
    if (init) { sq.value = init; run(init, box); }
    sq.addEventListener('input', function () { run(sq.value, box); }); $('#siteGo').addEventListener('click', function () { run(sq.value, box); });
  } else {
    var modal = document.createElement('div'); modal.className = 'search-modal'; modal.innerHTML = '<div class="box"><input type="search" placeholder="Search the site" aria-label="Search the site"><div class="results"></div></div>'; document.body.appendChild(modal);
    var mi = $('input', modal), mr = $('.results', modal);
    function open() { modal.classList.add('open'); mi.value = ''; mr.innerHTML = '<p class="muted">Search products, services and guides.</p>'; setTimeout(function () { mi.focus(); }, 30); }
    function close() { modal.classList.remove('open'); }
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    mi.addEventListener('input', function () { run(mi.value, mr); });
    $$('[data-search-open]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); open(); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) { e.preventDefault(); open(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    });
  }

  // ---------------- privacy notice and optional anonymous statistics (nothing is loaded without a choice)
  var an = C.analytics || {}, consent = $('#consent');
  function loadAnalytics() { if (!an.domain || $('script[data-analytics]')) return; var s = document.createElement('script'); s.defer = true; s.src = an.src || 'https://plausible.io/js/script.js'; s.setAttribute('data-domain', an.domain); s.setAttribute('data-analytics', '1'); document.head.appendChild(s); }
  if (consent) {
    var ch = store('edu_consent');
    if (an.domain) { var ab = $('[data-analytics-only]', consent); if (ab) ab.hidden = false; }
    if (!ch) consent.classList.remove('hidden');
    if (ch === 'all') loadAnalytics();
    $$('[data-consent]', consent).forEach(function (b) { b.addEventListener('click', function () { store('edu_consent', b.getAttribute('data-consent')); consent.classList.add('hidden'); if (b.getAttribute('data-consent') === 'all') loadAnalytics(); }); });
  }

  // ---------------- offline copy + install button
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }
  var ib = $('#installBtn'), ibox = $('#installBox'), ix = $('#installX'), deferred = null, itimer = null;
  function hideInstall(remember) { if (!ibox) return; ibox.classList.add('fade'); setTimeout(function () { ibox.classList.add('hidden'); }, 450); if (remember) store('edu_noinstall', '1'); }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    if (!ibox || store('edu_noinstall') || sessionStorage.getItem('edu_installshown')) return;
    setTimeout(function () { ibox.classList.remove('hidden', 'fade'); try { sessionStorage.setItem('edu_installshown', '1'); } catch (x) {} itimer = setTimeout(function () { hideInstall(false); }, 12000); }, 6000);
  });
  if (ib) ib.addEventListener('click', function () { clearTimeout(itimer); if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function () { hideInstall(true); deferred = null; }); });
  if (ix) ix.addEventListener('click', function () { clearTimeout(itimer); hideInstall(true); });

  // ---------------- content editor (prepares files; nothing is saved online from here)
  var ed = $('#editorRoot');
  if (ed) {
    function download(name, obj) { var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
    var ann = [];
    function drawAnn() { $('#annList').innerHTML = ann.map(function (x, k) { return '<div class="ann-row"><input data-k="' + k + '" data-f="tag" value="' + esc(x.tag) + '" placeholder="Label"><input data-k="' + k + '" data-f="text" value="' + esc(x.text) + '" placeholder="Announcement text"><input data-k="' + k + '" data-f="href" value="' + esc(x.href) + '" placeholder="Link, for example news.html"><button class="btn btn-outline btn-sm" data-del="' + k + '" type="button">Remove</button></div>'; }).join(''); }
    getJSON('content/announcements.json').then(function (l) { ann = l; drawAnn(); }).catch(function () { ann = [{ tag: 'New', text: '', href: 'index.html' }]; drawAnn(); });
    $('#annList').addEventListener('input', function (e) { var t = e.target; if (t.dataset.k) ann[+t.dataset.k][t.dataset.f] = t.value; });
    $('#annList').addEventListener('click', function (e) { var b = e.target.closest('[data-del]'); if (b) { ann.splice(+b.dataset.del, 1); drawAnn(); } });
    $('#annAdd').addEventListener('click', function () { ann.push({ tag: 'New', text: '', href: 'index.html' }); drawAnn(); });
    $('#annSave').addEventListener('click', function () { download('announcements.json', ann.filter(function (x) { return x.text.trim(); })); });
    $('#nSave').addEventListener('click', function () {
      var title = $('#nTitle').value.trim(); if (!title) return alert('Give the article a title.');
      var slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
      var blocks = [], lines = $('#nBody').value.split(/\n{2,}/);
      lines.forEach(function (par) { par = par.trim(); if (!par) return; if (par.indexOf('## ') === 0) blocks.push(['h', par.slice(3)]); else if (/^- /m.test(par)) blocks.push(['ul', par.split('\n').map(function (l) { return l.replace(/^- /, ''); })]); else blocks.push(['p', par.replace(/\n/g, ' ')]); });
      getJSON('content/news.json').catch(function () { return []; }).then(function (list) { list.unshift({ slug: slug, title: title, date: new Date().toISOString().slice(0, 10), category: $('#nCat').value.trim() || 'News', summary: $('#nSum').value.trim(), body: blocks }); download('news.json', list); });
    });
    $('#oSave').addEventListener('click', function () {
      var file = $('#oFile').value, name = $('#oName').value.trim(); if (!name) return alert('Enter a name.');
      getJSON('content/' + file).catch(function () { return []; }).then(function (list) {
        var e = file === 'testimonials.json' ? { quote: $('#oText').value.trim(), name: name, role: $('#oRole').value.trim(), organisation: $('#oOrg').value.trim() } : file === 'team.json' ? { name: name, role: $('#oRole').value.trim(), bio: $('#oText').value.trim(), photo: $('#oPic').value.trim() } : { name: name, type: $('#oRole').value.trim(), logo: $('#oPic').value.trim(), url: '' };
        list.push(e); download(file, list);
      });
    });
  }
})();

/* ---------------- engagement pass: scroll progress, header shadow, card tilt, display settings,
   the "which app" wizard and the Rwanda reach panel. Same no-library, guarded-by-presence style
   as the rest of this file. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar + header elevation + floating buttons (hidden near the very top of the
  // page, where they would sit over the hero's own buttons on shorter screens)
  var bar = $('.scroll-progress'), header = $('.site-header'), waFloat = $('.wa-float'), dispToggle0 = $('.disp-toggle'), dispPanel0 = $('.disp-panel');
  if (bar || header || waFloat || dispToggle0) {
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement, y = h.scrollTop, max = h.scrollHeight - h.clientHeight;
        if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', y > 8);
        var past = y > 420;
        if (waFloat) waFloat.classList.toggle('show', past);
        if (dispToggle0) { dispToggle0.classList.toggle('show', past); if (!past && dispPanel0) dispPanel0.classList.remove('open'); }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // card hover-tilt: only for a real mouse, and only when motion is welcome
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
    document.documentElement.classList.add('tilt-on');
    document.addEventListener('mousemove', function (e) {
      var el = e.target.closest && e.target.closest('.card, .dept, .prod-card');
      if (!el) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--tx', (px * 8).toFixed(2) + 'deg');
      el.style.setProperty('--ty', (py * -8).toFixed(2) + 'deg');
    });
    document.addEventListener('mouseout', function (e) {
      var el = e.target.closest && e.target.closest('.card, .dept, .prod-card');
      if (el) { el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); }
    });
  }

  // display settings: dark mode, text size, high contrast - all three persisted, dark mode also
  // seeded from the system preference the first time a visitor arrives
  var root = document.documentElement;
  // dark mode is opt-in only (not auto-applied from the OS preference): this site's colours were
  // designed and checked for light mode, and silently flipping every dark-mode phone to a
  // half-audited dark palette risks unreadable text for far more visitors than it helps
  var theme = store('edu_theme') || 'light';
  var textStep = Number(store('edu_textstep')) || 0; // -1, 0, 1
  var contrast = store('edu_contrast') === 'high';
  function applyDisplay() {
    root.setAttribute('data-theme', theme);
    if (contrast) root.setAttribute('data-contrast', 'high'); else root.removeAttribute('data-contrast');
    root.style.fontSize = (100 + textStep * 12) + '%';
  }
  applyDisplay();

  var dispToggle = $('.disp-toggle'), dispPanel = $('.disp-panel');
  if (dispToggle && dispPanel) {
    dispToggle.addEventListener('click', function () { dispPanel.classList.toggle('open'); });
    document.addEventListener('click', function (e) { if (!dispPanel.contains(e.target) && e.target !== dispToggle) dispPanel.classList.remove('open'); });
    var darkSwitch = $('#dispDark', dispPanel);
    if (darkSwitch) {
      darkSwitch.classList.toggle('on', theme === 'dark');
      darkSwitch.addEventListener('click', function () { theme = theme === 'dark' ? 'light' : 'dark'; store('edu_theme', theme); darkSwitch.classList.toggle('on', theme === 'dark'); applyDisplay(); });
    }
    var hcSwitch = $('#dispContrast', dispPanel);
    if (hcSwitch) {
      hcSwitch.classList.toggle('on', contrast);
      hcSwitch.addEventListener('click', function () { contrast = !contrast; store('edu_contrast', contrast ? 'high' : ''); hcSwitch.classList.toggle('on', contrast); applyDisplay(); });
    }
    $$('.disp-seg button', dispPanel).forEach(function (b) {
      b.classList.toggle('on', Number(b.dataset.step) === textStep);
      b.addEventListener('click', function () {
        textStep = Number(b.dataset.step); store('edu_textstep', String(textStep));
        $$('.disp-seg button', dispPanel).forEach(function (x) { x.classList.toggle('on', x === b); });
        applyDisplay();
      });
    });
  }

  // "which app is right for you?" wizard (homepage only - no-op elsewhere)
  var wiz = $('#appWizard');
  if (wiz) {
    var RESULTS = {
      smartschool: { name: 'Smart School App', href: 'smart-school-app.html', logo: 'assets/ssa-logo-96.png', text: 'Works fully offline on Windows and Android, with the whole Primary 1 to 6 curriculum, exams and reports built in.' },
      cloud: { name: 'Smart School Cloud', href: 'smart-school-cloud.html', logo: 'assets/ssa-logo-96.png', text: 'The same Smart School App, open in a browser, with records synced automatically between devices.' },
      ikimina: { name: 'Ikimina', href: 'savings-groups.html', logo: 'assets/ikimina-192.png', text: 'Track contributions, loans and meetings for your savings group, from any phone.' },
      fmis: { name: 'FMIS', href: 'field-management.html', logo: 'assets/fmis-96.png', text: 'Collect field data with forms, GPS and photos, assign tasks and see it all on one dashboard.' },
      amategeko: { name: "Amategeko y'Umuhanda", href: 'road-code.html', logo: 'assets/amategeko-192.png', text: 'Practice the official Rwanda road code questions and signs, with a free sample and full offline access.' },
      products: { name: 'all our apps', href: 'products.html', logo: 'assets/logo-horizontal.webp', text: "Here's everything we build, so you can browse and pick what fits." }
    };
    var STEPS = {
      root: { q: 'Who is this mainly for?', opts: [
        { t: 'A school', i: '🏫', to: 'school' },
        { t: 'A savings group or community', i: '💰', to: 'RESULT', r: 'ikimina' },
        { t: 'A field team or organisation', i: '🧭', to: 'RESULT', r: 'fmis' },
        { t: 'A family or one learner', i: '👪', to: 'family' }
      ] },
      school: { q: 'Should it work with no internet at all?', opts: [
        { t: 'Yes, fully offline', i: '📶', to: 'RESULT', r: 'smartschool' },
        { t: 'Online access is fine too', i: '☁️', to: 'RESULT', r: 'cloud' }
      ] },
      family: { q: 'What do they need?', opts: [
        { t: 'Reading, maths and school subjects', i: '📚', to: 'RESULT', r: 'smartschool' },
        { t: 'Learning the road code', i: '🚗', to: 'RESULT', r: 'amategeko' },
        { t: 'Not sure, show me everything', i: '🔎', to: 'RESULT', r: 'products' }
      ] }
    };
    var hist = ['root'];
    function progress() { return '<div class="wizard-progress"><i class="done"></i>' + (hist.length > 1 ? '<i class="done"></i>' : '<i></i>') + '</div>'; }
    function renderStep(key) {
      var s = STEPS[key];
      wiz.innerHTML = progress() + '<p class="wizard-q">' + esc(s.q) + '</p><div class="wizard-opts">' +
        s.opts.map(function (o, idx) { return '<button class="wizard-opt" type="button" data-idx="' + idx + '"><span>' + o.i + '</span> ' + esc(o.t) + '</button>'; }).join('') + '</div>' +
        (hist.length > 1 ? '<button class="wizard-back" type="button" data-back>&larr; Back</button>' : '');
      $$('.wizard-opt', wiz).forEach(function (b) {
        b.addEventListener('click', function () {
          var o = s.opts[Number(b.dataset.idx)];
          if (o.to === 'RESULT') { hist.push('RESULT'); renderResult(o.r); } else { hist.push(o.to); renderStep(o.to); }
        });
      });
      var back = $('[data-back]', wiz); if (back) back.addEventListener('click', function () { hist.pop(); renderStep(hist[hist.length - 1]); });
    }
    function renderResult(key) {
      var r = RESULTS[key];
      wiz.innerHTML = progress() + '<div class="wizard-result"><img src="' + esc(r.logo) + '" alt="" width="64" height="64" loading="lazy"><div><h3 style="margin:0 0 .3rem">' + esc(r.name) + '</h3><p style="margin:0 0 .8rem">' + esc(r.text) + '</p><a class="btn btn-primary btn-sm" href="' + esc(r.href) + '">Explore ' + esc(r.name) + '</a></div></div><button class="wizard-back" type="button" data-restart>Start over</button>';
      $('[data-restart]', wiz).addEventListener('click', function () { hist = ['root']; renderStep('root'); });
    }
    renderStep('root');
  }

  // Rwanda reach panel: numbers are already in the markup (server-rendered from the accredited-
  // schools directory), this only wires up the click-to-see-detail interaction
  var rwPanel = $('#rwPanel'), rwDetail = $('#rwDetail');
  if (rwPanel && rwDetail) {
    $$('.rw-prov', rwPanel).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var already = btn.classList.contains('on');
        $$('.rw-prov', rwPanel).forEach(function (b) { b.classList.remove('on'); });
        if (already) { rwDetail.classList.remove('on'); rwDetail.innerHTML = ''; return; }
        btn.classList.add('on');
        rwDetail.classList.add('on');
        rwDetail.innerHTML = '<div><b>' + esc(btn.dataset.districts) + '</b><span>Districts</span></div>' +
          '<div><b>' + esc(btn.dataset.sectors) + '</b><span>Sectors</span></div>' +
          '<div><b>' + esc(btn.dataset.schools) + '</b><span>Accredited schools (NESA)</span></div>';
      });
    });
  }
})();
