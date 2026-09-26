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
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) { e.preventDefault(); open(); } });
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
  var ib = $('#installBtn'), deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (ib && !store('edu_noinstall')) ib.classList.remove('hidden'); });
  if (ib) ib.addEventListener('click', function () { if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function () { ib.classList.add('hidden'); deferred = null; store('edu_noinstall', '1'); }); });

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
