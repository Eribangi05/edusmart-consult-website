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
  function styleFor(f) { return { fillColor: COLORS[bucket(f.properties.n)], weight: 1, color: '#ffffff', fillOpacity: .88 }; }

  function showSector(p, lyr) {
    if (active) active.setStyle({ weight: 1, color: '#ffffff' });
    active = lyr; lyr.setStyle({ weight: 2.5, color: '#221a00' }); lyr.bringToFront();
    if (!panel) return;
    panel.innerHTML = '<h3>' + esc(p.sector) + '</h3><p class="sub">' + esc(p.district) + ' district, ' + esc(p.province) + '</p>' +
      '<p class="rwmap-count"><b>' + p.n + '</b> accredited school' + (p.n === 1 ? '' : 's') + '<span>NESA directory</span></p>' +
      (p.schools.length ? '<ul>' + p.schools.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '<p class="muted">No accredited school recorded here yet.</p>');
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
