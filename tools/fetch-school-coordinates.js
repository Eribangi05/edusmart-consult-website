// Downloads real per-school coordinates from the public "All Schools of Rwanda" ArcGIS FeatureServer
// (MINEDUC/REB/NESA/RTB, spatial distribution of all schools, 2022 - item 40023640a9ad4123948ca15b4de41568
// on arcgis.com, public/no key needed) and matches them onto assets/data/rwanda-sectors.json's school
// lists by normalised name + district + sector, so the map can show a real pin for a school instead of
// just counting it inside its sector.
//
// Usage:  node tools/fetch-school-coordinates.js
//
// Matching is conservative: a school only gets a pin if its normalised name AND normalised district+sector
// match a record in the ArcGIS layer exactly. Schools that don't match (different spelling, closed/renamed,
// merged campuses, etc.) simply keep their existing name-only entry - nothing is guessed or interpolated.
const fs = require('fs');
const path = require('path');

const SERVICE = 'https://services9.arcgis.com/MA14Su4yNGn53wNB/arcgis/rest/services/Schools/FeatureServer/0/query';
const OUT = path.join(__dirname, '..', 'assets', 'data', 'rwanda-sectors.json');
const ALIASES = { shyrongi: 'shyorongi' };
const norm = (s) => {
  const n = String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return ALIASES[n] || n;
};
// strip common school-type prefixes ("EP ", "GS ", "ES ", "G.S", "E.P" ...) before matching names, since
// the two datasets don't always agree on which prefix (or whether one) to use for the same school
const normName = (s) => norm(s).replace(/^(ep|es|gs|gp|ttc|tvet)/, '');

async function fetchAll() {
  let out = [], offset = 0;
  for (;;) {
    const url = `${SERVICE}/query?where=1=1&outFields=School_name,Latitude,Longitude,District,Sector&resultOffset=${offset}&resultRecordCount=1000&f=json`;
    const j = await fetch(url).then((r) => r.json());
    if (!j.features || !j.features.length) break;
    out = out.concat(j.features.map((f) => f.attributes));
    if (j.features.length < 1000) break;
    offset += 1000;
  }
  return out;
}

async function main() {
  console.log('Fetching the ArcGIS schools layer...');
  const rows = await fetchAll();
  console.log(`  got ${rows.length} records`);

  const byKey = new Map(); // districtSectorKey -> Map(normName -> {lat, lon})
  for (const r of rows) {
    if (r.Latitude == null || r.Longitude == null) continue;
    const dsKey = norm(r.District) + '|' + norm(r.Sector);
    let m = byKey.get(dsKey);
    if (!m) byKey.set(dsKey, (m = new Map()));
    const nn = normName(r.School_name);
    if (!m.has(nn)) m.set(nn, { lat: r.Latitude, lon: r.Longitude }); // first match wins on a rare duplicate name
  }

  const gj = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  let matched = 0, total = 0;
  for (const f of gj.features) {
    const dsKey = norm(f.properties.district) + '|' + norm(f.properties.sector);
    const m = byKey.get(dsKey);
    f.properties.schools = (f.properties.schools || []).map((name) => {
      total++;
      const hit = m && m.get(normName(name));
      if (!hit) return name;
      matched++;
      return { name, lat: Math.round(hit.lat * 100000) / 100000, lon: Math.round(hit.lon * 100000) / 100000 };
    });
  }

  fs.writeFileSync(OUT, JSON.stringify(gj));
  console.log(`  matched ${matched} / ${total} schools to a real coordinate (${(matched / total * 100).toFixed(1)}%)`);
  console.log(`  wrote ${OUT} (${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
