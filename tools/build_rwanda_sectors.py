# Rebuilds assets/data/rwanda-sectors.json - the simplified GeoJSON behind the interactive Rwanda
# sectors map (assets/map.js), used on index.html and impact.html.
#
# Source data (re-download if you ever need to refresh this):
#   1. Sector boundaries (416 features, admin level 3): National Institute of Statistics of Rwanda
#      (NISR), distributed via OCHA ROSEA on the Humanitarian Data Exchange, CC BY-IGO licence.
#      https://data.humdata.org/dataset/cod-ab-rwa -> "rwa_adm_2006_NISR_WGS1984_20181002_SHP.zip"
#      Unzip it into a folder and point SHP_DIR below at it (only the *_adm3_* files are needed).
#   2. School list: the same NESA accredited-schools directory bundled with the Windows/Android
#      apps and the Support Console (Cloud Sync Server/public/console/data/schools-rwanda.json).
#
# What it does: joins each sector polygon to the real schools recorded in it (matched by district +
# sector name - district names are unique across Rwanda, so this is a safe join key even though
# province names differ in phrasing between the two sources), simplifies the polygons with
# Ramer-Douglas-Peucker (587k points -> ~16k, ~0.45MB), and writes one compact GeoJSON FeatureCollection
# with each sector's real school names embedded in its properties.
#
# Usage:  pip install pyshp  &&  python tools/build_rwanda_sectors.py <path-to-unzipped-SHP-folder>
import shapefile, json, re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHOOLS_JSON = r"C:\Users\ingab\AndroidStudioProjects\REB Books\Cloud Sync Server\public\console\data\schools-rwanda.json"
OUT = os.path.join(ROOT, "assets", "data", "rwanda-sectors.json")
EPS = 0.0015  # simplification tolerance in degrees (~150-170m at Rwanda's latitude) - raise for a smaller file, lower for more faithful shapes


def rdp(points, eps):
    """Ramer-Douglas-Peucker line simplification. points: list of (x, y). Endpoints are always kept."""
    if len(points) < 3:
        return points

    def perp_dist(pt, a, b):
        (x, y), (ax, ay), (bx, by) = pt, a, b
        dx, dy = bx - ax, by - ay
        if dx == 0 and dy == 0:
            return ((x - ax) ** 2 + (y - ay) ** 2) ** 0.5
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
        px, py = ax + t * dx, ay + t * dy
        return ((x - px) ** 2 + (y - py) ** 2) ** 0.5

    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]  # iterative (not recursive) so long rings can't blow the stack
    while stack:
        s, e = stack.pop()
        if e <= s + 1:
            continue
        a, b = points[s], points[e]
        maxd, maxi = -1, -1
        for i in range(s + 1, e):
            d = perp_dist(points[i], a, b)
            if d > maxd:
                maxd, maxi = d, i
        if maxd > eps:
            keep[maxi] = True
            stack.append((s, maxi))
            stack.append((maxi, e))
    return [p for p, k in zip(points, keep) if k]


def shape_to_rings(shp):
    pts = shp.points
    parts = list(shp.parts) + [len(pts)]
    return [pts[parts[i]:parts[i + 1]] for i in range(len(parts) - 1)]


ALIASES = {"shyrongi": "shyorongi"}  # one known spelling difference between the shapefile and the schools directory


def norm(s):
    n = re.sub(r"[^a-z0-9]", "", (s or "").lower())
    return ALIASES.get(n, n)


def main():
    shp_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    shp_path = None
    for f in os.listdir(shp_dir):
        if "_adm3_" in f.lower() and f.lower().endswith(".shp"):
            shp_path = os.path.join(shp_dir, f)
    if not shp_path:
        sys.exit("Could not find an *_adm3_*.shp file in " + shp_dir + " - pass the unzipped SHP folder as the first argument.")

    sf = shapefile.Reader(shp_path)
    schools = json.load(open(SCHOOLS_JSON, encoding="utf-8"))["schools"]
    schools = [s for s in schools if s.get("province") and s.get("district") and s.get("sector")]

    by_dist_sector = {}
    for s in schools:
        by_dist_sector.setdefault((norm(s["district"]), norm(s["sector"])), []).append(s["name"])

    features = []
    matched, unmatched = 0, []
    for rec, shp in zip(sf.records(), sf.shapes()):
        rings = shape_to_rings(shp)
        simp_rings = [rdp(r, EPS) for r in rings]
        coords = [[[round(x, 5), round(y, 5)] for x, y in ring] for ring in simp_rings]
        district, sector = rec["ADM2_EN"], rec["ADM3_EN"]
        names = sorted(by_dist_sector.get((norm(district), norm(sector)), []))
        if names:
            matched += 1
        else:
            unmatched.append((district, sector))
        features.append({
            "type": "Feature",
            "properties": {"province": rec["ADM1_EN"], "district": district, "sector": sector, "n": len(names), "schools": names},
            "geometry": {"type": "Polygon" if len(coords) == 1 else "MultiPolygon",
                         "coordinates": [coords[0]] if len(coords) == 1 else [[c] for c in coords]}
        })

    out = json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":"))
    open(OUT, "w", encoding="utf-8").write(out)
    print(f"wrote {OUT}: {len(features)} sectors, {matched} matched to real schools, {len(unmatched)} unmatched, {len(out)/1024/1024:.2f} MB")
    if unmatched:
        print("unmatched (check for a spelling difference and add it to ALIASES):", unmatched)


if __name__ == "__main__":
    main()
