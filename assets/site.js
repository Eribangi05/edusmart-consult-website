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
  document.querySelectorAll('[data-email-link]').forEach(function (e) { e.href = 'mailto:' + C.email; });
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

// (product filters now live in extra.js)


// gentle reveal on scroll (content stays visible if scripts or IntersectionObserver are unavailable)
(function () {
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
  setTimeout(function () { els.forEach(function (e) { e.classList.add('in'); }); }, 2500);
})();


// Kigali clock (Central Africa Time, UTC+2), rotating headline word, count-up numbers
(function () {
  var tz = 'Africa/Kigali';
  var tf, tfs, df;
  try {
    tfs = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    tf = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    df = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) { return; }
  function tick() {
    var now = new Date();
    document.querySelectorAll('[data-kigali-time]').forEach(function (el) { el.textContent = (el.closest('.tb-clock') ? tfs : tf).format(now); });
    document.querySelectorAll('[data-kigali-date]').forEach(function (el) { el.textContent = 'Kigali, ' + df.format(now); });
  }
  tick(); setInterval(tick, 1000);

  var rot = document.querySelector('.rot');
  if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var words = (rot.getAttribute('data-words') || '').split('|'), i = 0;
    setInterval(function () {
      rot.classList.add('out');
      setTimeout(function () { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 350);
    }, 2600);
  }

  var nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; io.unobserve(en.target);
        var el = en.target, to = parseInt(el.getAttribute('data-count'), 10), t0 = null;
        function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }
})();

// ---------------- featured products carousel: dots, arrows, swipe, gentle auto-advance
(function () {
  var wrap = document.querySelector('[data-feat]');
  if (!wrap) return;
  var slides = Array.prototype.slice.call(wrap.querySelectorAll('.feat-slide'));
  var dots = Array.prototype.slice.call(wrap.querySelectorAll('.feat-dot'));
  if (slides.length < 2) return;
  var i = 0, timer = null;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(next, back) {
    if (next === i) return;
    slides[i].classList.remove('is-active');
    dots[i] && dots[i].classList.remove('is-active'); dots[i] && dots[i].setAttribute('aria-selected', 'false');
    i = (next + slides.length) % slides.length;
    var s = slides[i];
    s.classList.toggle('dir-back', !!back);
    s.classList.add('is-active');
    dots[i] && dots[i].classList.add('is-active'); dots[i] && dots[i].setAttribute('aria-selected', 'true');
  }
  function restart() {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(function () { show(i + 1); }, 6500);
  }

  wrap.querySelector('.feat-next').addEventListener('click', function () { show(i + 1); restart(); });
  wrap.querySelector('.feat-prev').addEventListener('click', function () { show(i - 1, true); restart(); });
  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, k < i); restart(); }); });

  // swipe on touch and mouse drag
  var startX = null;
  var track = wrap.querySelector('.feat-track');
  function dragStart(x) { startX = x; }
  function dragEnd(x) {
    if (startX == null) return;
    var dx = x - startX; startX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) { show(i + 1); } else { show(i - 1, true); }
    restart();
  }
  track.addEventListener('touchstart', function (e) { dragStart(e.touches[0].clientX); }, { passive: true });
  track.addEventListener('touchend', function (e) { dragEnd(e.changedTouches[0].clientX); });
  track.addEventListener('mousedown', function (e) { dragStart(e.clientX); e.preventDefault(); });
  window.addEventListener('mouseup', function (e) { if (startX != null) dragEnd(e.clientX); });

  wrap.addEventListener('mouseenter', function () { clearInterval(timer); });
  wrap.addEventListener('mouseleave', restart);
  restart();
})();
