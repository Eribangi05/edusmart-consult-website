/* Interactive Rwanda sectors map: real sector boundaries (NISR/OCHA, CC BY-IGO) shaded by how many
   NESA-accredited schools they contain; click a sector to see the real school names in it. Loaded
   only on the pages that use it (see rwmap() in build.py) - not part of the site-wide bundle. */
(function () {
  var el = document.getElementById('rwMap');
  if (!el || !window.L) return;
  var panel = document.getElementById('rwMapPanel');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var map = L.map(el, { zoomControl: true, scrollWheelZoom: false, attributionControl: false, minZoom: 7, maxZoom: 12 });
  var COLORS = ['#dbe7f7', '#a9cdef', '#63a8e6', '#1f7fd6', '#06307a'];
  // breakpoints tuned to the real distribution of this dataset (min 3, median 10, max 57 schools per sector)
  function bucket(n) { return n < 8 ? 0 : n < 10 ? 1 : n < 13 ? 2 : n < 20 ? 3 : 4; }

  var active = null;
  var pins = L.layerGroup().addTo(map); // real per-school markers for whichever sector is open - cleared on each new click
  var pinIcon = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>';
  function styleFor(f) { return { fillColor: COLORS[bucket(f.properties.n)], weight: 1, color: '#ffffff', fillOpacity: .88 }; }

  function showSector(p, lyr) {
    if (active) active.setStyle({ weight: 1, color: '#ffffff' });
    active = lyr; lyr.setStyle({ weight: 2.5, color: '#221a00' }); lyr.bringToFront();
    pins.clearLayers();
    var markers = [];
    p.schools.forEach(function (s) {
      if (typeof s !== 'object' || s.lat == null) return;
      var m = L.circleMarker([s.lat, s.lon], { radius: 6, weight: 2, color: '#221a00', fillColor: '#F2C200', fillOpacity: .95 }).addTo(pins);
      m.bindTooltip(esc(s.name), { direction: 'top', offset: [0, -4] });
      markers.push(m);
    });
    if (!panel) return;
    var known = p.schools.filter(function (s) { return typeof s === 'object'; }).length;
    panel.innerHTML = '<h3>' + esc(p.sector) + '</h3><p class="sub">' + esc(p.district) + ' district, ' + esc(p.province) + '</p>' +
      '<p class="rwmap-count"><b>' + p.n + '</b> accredited school' + (p.n === 1 ? '' : 's') + '<span>' + (known ? known + ' with a known location' : 'NESA directory') + '</span></p>' +
      (p.schools.length ? '<ul>' + p.schools.map(function (s, i) {
        var name = typeof s === 'object' ? s.name : s;
        return typeof s === 'object' ? '<li class="pinned" data-i="' + i + '">' + pinIcon + esc(name) + '</li>' : '<li>' + esc(name) + '</li>';
      }).join('') + '</ul>' : '<p class="muted">No accredited school recorded here yet.</p>');
    panel.querySelectorAll('li.pinned').forEach(function (li) {
      li.addEventListener('click', function () {
        var s = p.schools[+li.dataset.i], idx = p.schools.slice(0, +li.dataset.i + 1).filter(function (x) { return typeof x === 'object'; }).length - 1;
        var m = markers[idx]; if (!m) return;
        map.setView([s.lat, s.lon], 14); m.openTooltip();
      });
    });
  }

  fetch('assets/data/rwanda-sectors.json').then(function (r) { return r.json(); }).then(function (gj) {
    var layer = L.geoJSON(gj, {
      style: styleFor,
      onEachFeature: function (f, lyr) {
        var p = f.properties;
        lyr.bindTooltip(esc(p.sector) + ' — ' + p.n + ' school' + (p.n === 1 ? '' : 's'), { sticky: true });
        lyr.on('mouseover', function () { if (lyr !== active) lyr.setStyle({ weight: 2, color: '#0aa0f0' }); });
        lyr.on('mouseout', function () { if (lyr !== active) lyr.setStyle({ weight: 1, color: '#ffffff' }); });
        lyr.on('click', function () { showSector(p, lyr); });
      }
    }).addTo(map);
    map.fitBounds(layer.getBounds(), { padding: [8, 8] });
  }).catch(function () {
    el.innerHTML = '<p class="muted" style="padding:1.2rem">The map could not be loaded right now.</p>';
  });
})();
