"""Builds the browser version of FMIS from the shared app in AndroidStudioProjects/FMIS/app.

Run from the website folder:   python tools/fmis/build.py
Copies the app to fmis/, marks it not for search engines, and (for local testing only) can allow a local cloud server:
   FMIS_TEST_CLOUD=http://localhost:4300 python tools/fmis/build.py"""
import os, shutil, sys


def make_pwa(out, name, short, desc, theme, icon192, icon512, start="./index.html"):
    """Makes the web app installable and usable offline: a manifest, and a service worker that keeps the app files on the device."""
    import json, hashlib
    files = []
    for dp, _, fs in os.walk(out):
        for f in fs:
            rel = os.path.relpath(os.path.join(dp, f), out).replace("\\", "/")
            if rel not in ("sw.js", "manifest.webmanifest"):
                files.append(rel)
    files.sort()
    h = hashlib.sha1()
    for rel in files:
        h.update(open(os.path.join(out, rel), "rb").read())
    ver = h.hexdigest()[:10]
    manifest = {"name": name, "short_name": short, "description": desc, "start_url": start, "scope": "./", "display": "standalone", "background_color": "#ffffff", "theme_color": theme,
                "icons": [{"src": icon192, "sizes": "192x192", "type": "image/png", "purpose": "any"}, {"src": icon512, "sizes": "512x512", "type": "image/png", "purpose": "any"}]}
    json.dump(manifest, open(os.path.join(out, "manifest.webmanifest"), "w", encoding="utf-8"), indent=1)
    sw = ("/* Keeps the app on the device so it opens with no internet. Cloud requests (other origins) are never cached. */\n"
          "const CACHE = '" + short.lower() + "-" + ver + "';\nconst FILES = " + json.dumps(["./"] + files) + ";\n"
          "self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });\n"
          "self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.indexOf('" + short.lower() + "-') === 0 && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });\n"
          "self.addEventListener('fetch', (e) => {\n  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;\n"
          "  e.respondWith(caches.match(r, { ignoreSearch: true }).then((hit) => hit || fetch(r).catch(() => caches.match('./index.html'))));\n});\n")
    open(os.path.join(out, "sw.js"), "w", encoding="utf-8").write(sw)
    return ver
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
SRC = os.environ.get("FMIS_SRC") or r"C:\Users\ingab\AndroidStudioProjects\FMIS\app"
OUT = os.path.join(SITE, "fmis")
if not os.path.isdir(SRC):
    sys.exit("Cannot find the FMIS app at " + SRC)
if os.path.isdir(OUT):
    for n in os.listdir(OUT):
        q = os.path.join(OUT, n)
        shutil.rmtree(q) if os.path.isdir(q) else os.remove(q)
shutil.copytree(SRC, OUT, dirs_exist_ok=True)
for junk in ("assets/logo-approved.png", "assets/fmis.ico"):     # the big originals are not needed by the web app
    p = os.path.join(OUT, junk)
    if os.path.exists(p):
        os.remove(p)
h = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()
h = h.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"', 1)
if os.environ.get("FMIS_TEST_CLOUD"):
    h = h.replace("connect-src 'self'", "connect-src 'self' " + os.environ["FMIS_TEST_CLOUD"], 1)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(h)
# small web additions: the address of the cloud server can be overridden on localhost for testing
w = "\n/* web build: on localhost the cloud address can be pointed at a local server (tests only) */\n(function () { try { window.FMIS_PLATFORM = 'web'; if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && localStorage.getItem('fmis_cloud')) window.FMIS_CLOUD_URL = localStorage.getItem('fmis_cloud'); } catch (e) { /* ignore */ } })();\n"
with open(os.path.join(OUT, "js", "platform.js"), "a", encoding="utf-8") as f:
    f.write(w)
with open(os.path.join(OUT, "js", "platform.js"), "a", encoding="utf-8") as f:
    f.write("\n/* installable and offline: register the service worker on the web only (never inside the Android or Windows apps) */\n(function () { try { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !window.api && !window.FmisNative) navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) { /* ignore */ } })();\n")
_h = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()
_h = _h.replace('<link rel="icon"', '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="assets/logo-192.png">\n<link rel="icon"', 1)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(_h)
make_pwa(OUT, "FMIS Field Management", "FMIS", "Field data collection, tasks, check-in, reports and team management", "#0a3f5c", "assets/logo-192.png", "assets/logo-512.png")
print("built", OUT, sum(len(f) for _, _, f in os.walk(OUT)), "files")
