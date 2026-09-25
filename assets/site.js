(function () {
  var C = window.EDUSMART || {};

  // mobile menu
  var t = document.querySelector('.menu-toggle'), n = document.querySelector('.nav');
  if (t && n) {
    t.addEventListener('click', function () {
      var open = n.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    n.addEventListener('click', function (e) { if (e.target.tagName === 'A') { n.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); } });
  }

  // tabs
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = wrap.querySelectorAll('.tab'), panels = wrap.querySelectorAll('.panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === tab ? 'true' : 'false'); });
        panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
      });
    });
  });

  // download buttons: direct link when configured, otherwise send the visitor to the request form
  var d = C.downloads || {};
  var cl = C.cloud || {}, appUrl = cl.baseUrl ? cl.baseUrl.replace(/\/$/, '') + (cl.appPath || '/app') : (d.webAppUrl || '');
  document.querySelectorAll('[data-download]').forEach(function (a) {
    var key = a.getAttribute('data-download'), url = d[key + 'Url'];
    if (key === 'webApp') { if (appUrl) { a.href = appUrl; a.target = '_blank'; a.rel = 'noopener'; return; } }
    else if (url) { a.href = url; a.setAttribute('rel', 'noopener'); }
    else {
      a.href = 'contact.html?topic=' + encodeURIComponent('Smart School App download (' + key + ')') + '#form';
      var s = a.querySelector('[data-label]'); if (s) s.textContent = key === 'webApp' ? 'Request online access' : 'Request the ' + (key === 'windows' ? 'Windows' : 'Android') + ' download';
    }
  });
  document.querySelectorAll('[data-version]').forEach(function (e) { e.textContent = d.version || ''; });

  // Smart School Cloud: online app link, embedded frame, fallback
  document.querySelectorAll('[data-cloud="app"]').forEach(function (a) {
    if (appUrl) { a.href = appUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else a.href = 'contact.html?topic=' + encodeURIComponent('Smart School Cloud access') + '#form';
  });
  document.querySelectorAll('[data-cloud-frame]').forEach(function (fr) {
    if (!appUrl || !cl.embed) return;
    fr.src = appUrl; fr.hidden = false;
    var fb = document.querySelector('[data-cloud-fallback]'); if (fb) fb.hidden = true;
  });

  // screenshot lightbox
  var note = document.querySelector('[data-cloud-note]');
  if (note && appUrl && !cl.embed) note.innerHTML = '<b>The online app opens in its own tab.</b> <a href="' + appUrl + '" target="_blank" rel="noopener">Open Smart School App online</a> <small style="display:block;opacity:.8">Sign in with your school code, your learner code or staff ID, and your PIN. The first load can take a minute.</small>';
  var lb = document.getElementById('lb');
  if (lb) {
    document.querySelectorAll('img.shot, .phone img').forEach(function (im) {
      if (im.closest('.embed-fallback')) return;
      im.addEventListener('click', function () { lb.querySelector('img').src = im.src; lb.querySelector('img').alt = im.alt; lb.classList.add('open'); });
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
  }

  // contact details from config
  document.querySelectorAll('[data-phone]').forEach(function (e) { e.textContent = C.phone; if (e.tagName === 'A') e.href = 'tel:+' + C.phoneIntl; });
  document.querySelectorAll('[data-email]').forEach(function (e) { e.textContent = C.email; if (e.tagName === 'A') e.href = 'mailto:' + C.email; });
  document.querySelectorAll('[data-wa]').forEach(function (e) { e.href = 'https://wa.me/' + C.phoneIntl + '?text=' + encodeURIComponent(e.getAttribute('data-wa') || 'Hello EduSmart Consult'); });
  document.querySelectorAll('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // contact form
  var form = document.getElementById('contactForm');
  if (form) {
    var qs = new URLSearchParams(location.search);
    if (qs.get('topic')) { var s = form.elements.subject; if (s) s.value = qs.get('topic'); }
    if (qs.get('service')) { var sv = form.elements.service; if (sv) sv.value = qs.get('service'); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website && form.elements.website.value) return;         // spam trap
      var data = {}; new FormData(form).forEach(function (v, k) { if (k !== 'website') data[k] = v; });
      var msg = document.getElementById('formMsg');
      var body = 'Name: ' + data.name + '\nOrganisation: ' + (data.org || '-') + '\nEmail: ' + data.email + '\nPhone: ' + (data.phone || '-') +
        '\nService: ' + data.service + '\n\n' + data.message;
      function done(text) { msg.textContent = text; msg.classList.add('show'); form.reset(); }
      if (C.formEndpoint) {
        fetch(C.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(); done('Thank you. Your message has been sent. We will reply within two working days.'); })
          .catch(function () { msg.textContent = 'The message could not be sent. Please email ' + C.email + ' or call ' + C.phone + '.'; msg.classList.add('show'); });
      } else {
        location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('[Website] ' + (data.subject || data.service)) + '&body=' + encodeURIComponent(body);
        done('Your email app has opened with the message ready to send. If it did not open, write to ' + C.email + ' or message us on WhatsApp.');
      }
    });
  }
})();

// product filters
(function () {
  var fs = document.querySelectorAll('[data-filter]');
  fs.forEach(function (b) {
    b.addEventListener('click', function () {
      fs.forEach(function (x) { x.classList.toggle('on', x === b); });
      var f = b.getAttribute('data-filter');
      document.querySelectorAll('#all .pcard').forEach(function (c) { c.hidden = f !== 'all' && c.getAttribute('data-cat') !== f; });
    });
  });
})();
