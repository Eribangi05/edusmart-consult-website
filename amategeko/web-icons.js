/* Vector icons for the web version. The Windows app draws its icons with emoji, which look different on every phone.
   Here each emoji is swapped for a matching SVG: colourful gradient tiles for the menu and the home tiles, clean line icons
   inline in buttons and headings. Pure decoration: if this file fails, the app still works with its emoji. */
(function () {
  'use strict';
  var P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    books: '<path d="M4 19.5V5a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 19.5A2 2 0 0 0 6 21h12v-3"/><path d="M9 7.5h6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    childsign: '<path d="M12 3 2.5 20h19z"/><circle cx="12" cy="11" r="1.4" fill="currentColor"/><path d="M12 13.5v3.5"/>',
    light: '<rect x="7.5" y="2" width="9" height="20" rx="3.5"/><circle cx="12" cy="7" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="17" r="1.6"/>',
    car: '<path d="M3 13.5 5.2 7.6A2 2 0 0 1 7.1 6.3h9.8a2 2 0 0 1 1.9 1.3L21 13.5"/><rect x="2.5" y="13" width="19" height="5" rx="1.5"/><circle cx="7" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3.5h11a2 2 0 0 1 2 2V17"/><path d="M7 12h5M7 16h3"/>',
    openbook: '<path d="M12 6.5c-2-1.5-4.5-2.2-8-2.2V18c3.5 0 6 .7 8 2.2 2-1.5 4.5-2.2 8-2.2V4.3c-3.5 0-6 .7-8 2.2z"/><path d="M12 6.5v13.7"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7 2.5 13.5a3 3 0 0 0 5 0z"/><path d="M19 7l-2.5 6.5a3 3 0 0 0 5 0z"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4.5 3 3L19 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.8"/>',
    printer: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.6 14-1.6 8 5-3 5 3-1.6-8"/>',
    sliders: '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="10" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/>',
    school: '<path d="M3 21h18"/><path d="M5 21V9.5L12 4l7 5.5V21"/><path d="M9.5 21v-6h5v6"/><path d="M12 10h.01"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    warn: '<path d="M12 3.5 2.8 20h18.4z"/><path d="M12 10v4.5M12 17.6h.01"/>',
    volume: '<path d="M4 9.5v5h4l5 4V5.5l-5 4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    mute: '<path d="M4 9.5v5h4l5 4V5.5l-5 4z"/><path d="m17 9.5 4 5M21 9.5l-4 5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/>',
    camera: '<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    bars: '<path d="M5 21V11M12 21V4M19 21v-7"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-9 9"/>',
    save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3M8 21v-7h8v7"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
    upload: '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
    pencil: '<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="m13.5 6.5 4 4"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 12h6M9 16h4"/>',
    party: '<path d="m4 20 4-11 7 7z"/><path d="M13 5v.01M18 8v.01M19 13v.01M15 3l1 2M20 5l-2 1"/>',
    unlock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.6-1.7"/>',
    hand: '<path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11M10 11V4.5a1.5 1.5 0 0 1 3 0V11M13 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-3 0-4-2-5.5-4.5L3 12.5a1.5 1.5 0 0 1 2.6-1.5L7 13"/>',
    arm: '<path d="M6 15c0-4 2-6 5-6h3l2-3 3 2-2 4c0 4-3 8-8 8H8z"/>'
  };
  // emoji -> [icon, colour A, colour B]
  var M = {
    '🏠': ['home', '#3a6bff', '#1c3aa9'], '📚': ['books', '#8b6cff', '#4b2fd0'], '🎯': ['target', '#ff7a7a', '#e5484d'], '🔎': ['search', '#22c6e8', '#0077b6'],
    '📝': ['doc', '#b06cf7', '#7e22ce'], '🚸': ['childsign', '#ffc046', '#f57c00'], '🚦': ['light', '#34d17a', '#15803d'], '🚙': ['car', '#2dd4bf', '#0f766e'],
    '🃏': ['cards', '#f472b6', '#be185d'], '📖': ['openbook', '#5b9dff', '#1d4ed8'], '⚖': ['scale', '#7c8ba1', '#334155'], '📈': ['chart', '#22d3a0', '#047857'],
    '🕘': ['clock', '#a78bfa', '#6d28d9'], '🖨': ['printer', '#fb7185', '#be123c'], '🏅': ['award', '#fbbf24', '#b45309'], '⚙': ['sliders', '#9aa9bd', '#475569'],
    '🏫': ['school', '#38bdf8', '#0369a1'], '🚗': ['car', '#22d3ee', '#2563eb'],
    '✓': ['check', '#1db954'], '✔': ['check', '#1db954'], '✅': ['check', '#1db954'], '✕': ['x', '#e5484d'], '✗': ['x', '#e5484d'], '❌': ['x', '#e5484d'],
    '⚠': ['warn', '#f59e0b'], '🔊': ['volume', '#2453d6'], '🔇': ['mute', '#64748b'], '🔑': ['key', '#d99000'], '🔐': ['lock', '#2453d6'], '👤': ['user', '#2453d6'],
    '👩': ['user', '#c2410c'], '📅': ['calendar', '#7c3aed'], '🗑': ['trash', '#e5484d'], '📷': ['camera', '#0f766e'], '☀': ['sun', '#f59e0b'], '🌙': ['moon', '#a5b4fc'],
    '🎧': ['headphones', '#7c3aed'], '🚩': ['flag', '#e5484d'], '⚐': ['flag', '#e5484d'], '📊': ['bars', '#0ea5e9'], '🖼': ['image', '#0ea5e9'], '📄': ['doc', '#64748b'],
    '💾': ['save', '#2453d6'], '🔄': ['refresh', '#2453d6'], '⬆': ['upload', '#2453d6'], '✎': ['pencil', '#d97706'], '📋': ['clipboard', '#0f766e'], '⏱': ['clock', '#e5484d'],
    '🎉': ['party', '#f59e0b'], '💪': ['arm', '#d97706'], '🔓': ['unlock', '#d99000'], '👋': ['hand', '#f59e0b']
  };
  var keys = Object.keys(M).sort(function (a, b) { return b.length - a.length; });
  var RE = new RegExp('(' + keys.join('|') + ')\\uFE0F?', 'g');
  var TEST = new RegExp('(' + keys.join('|') + ')');

  function svg(name, cls) {
    return '<svg class="amg-i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[name] + '</svg>';
  }
  function tile(m) { return '<span class="amg-tile" style="--a:' + m[1] + ';--b:' + (m[2] || m[1]) + '">' + svg(m[0]) + '</span>'; }
  function lookup(ch) { return M[ch.replace(/️/g, '')]; }

  function upgrade(root) {
    root = root || document.body;
    // 1) icons that stand alone: coloured tiles in the menu and on the home screen, plain white art in the brand badge and banner
    var big = root.querySelectorAll('.ni-ico, .t-ico, .brand-badge, .hero-emoji');
    for (var i = 0; i < big.length; i++) {
      var el = big[i]; if (el.getAttribute('data-amg') || el.children.length) continue;
      var m = lookup(el.textContent.trim()); if (!m || !P[m[0]]) continue;
      el.setAttribute('data-amg', '1');
      el.innerHTML = (el.classList.contains('brand-badge') || el.classList.contains('hero-emoji')) ? svg(m[0], 'amg-plain') : tile(m);
    }
    // 2) emoji inside text (buttons, headings, messages): a matching line icon in the emoji's colour
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|TITLE)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
      return TEST.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    var nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(function (n) {
      var text = n.nodeValue, html = '', last = 0, mt; RE.lastIndex = 0;
      var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
      while ((mt = RE.exec(text))) {
        var m = lookup(mt[1]); if (!m || !P[m[0]]) continue;
        html += esc(text.slice(last, mt.index)) + '<span class="amg-inl" style="color:' + m[1] + '">' + svg(m[0], 'inl') + '</span>'; last = mt.index + mt[0].length;
      }
      if (!last) return;
      html += esc(text.slice(last));
      var s = document.createElement('span'); s.className = 'amg-run'; s.innerHTML = html; n.parentNode.replaceChild(s, n);
    });
  }
  window.__amgIcons = { upgrade: upgrade, list: P };
})();
