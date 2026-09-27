"""Builds the browser version of Ikimina from the Windows app's sources.



Run from the website folder:   python tools/ikimina/build.py

Copies IkiminaDesktop/src to ikimina/ (the app already falls back to browser storage when there is no Electron bridge),

adds a small web banner script and web.css. The Windows app's own files are never changed."""

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

SRC = os.environ.get("IKI_SRC") or r"C:\Users\ingab\IkiminaDesktop\src"

OUT = os.path.join(SITE, "ikimina")

if not os.path.isdir(SRC):

    sys.exit("Cannot find the Windows app sources at " + SRC)

if os.path.isdir(OUT):

    for n in os.listdir(OUT):

        q = os.path.join(OUT, n)

        shutil.rmtree(q) if os.path.isdir(q) else os.remove(q)

shutil.copytree(SRC, OUT, dirs_exist_ok=True)

shutil.copy(os.path.join(HERE, "web.css"), os.path.join(OUT, "web.css"))
shutil.copy(os.path.join(HERE, "web.js"), os.path.join(OUT, "web.js"))

h = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()

h = h.replace("<title>Ikimina Desktop</title>", "<title>Ikimina | Savings group manager</title>")

h = h.replace('<link rel="stylesheet" href="styles.css">', '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n<link rel="icon" href="../assets/products/ikimina.png">\n<link rel="stylesheet" href="styles.css">\n<link rel="stylesheet" href="web.css">')

h = h.replace('<script src="app.js"></script>', '<script src="app.js"></script>\n<script src="web.js"></script>')

if os.environ.get("IKI_TEST_CLOUD"):          # local testing only: also allow a local copy of the cloud server
    h = h.replace("connect-src 'self'", "connect-src 'self' " + os.environ["IKI_TEST_CLOUD"], 1)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(h)

for fn, a, b in [("app.js", "Desktop Edition", "Web Edition"), ("i18n-data.js", "D('Desktop Edition', 'Édition Bureau', 'Verisiyo ya mudasobwa')", "D('Web Edition', 'Édition Web', 'Verisiyo y’urubuga')")]:
    q = os.path.join(OUT, fn); t = open(q, encoding="utf-8").read(); open(q, "w", encoding="utf-8").write(t.replace(a, b))

with open(os.path.join(OUT, "web.js"), "a", encoding="utf-8") as f:
    f.write("\n/* installable and offline: register the service worker on the web only (never inside the Android or Windows apps) */\n(function () { try { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && !window.api && !window.FmisNative) navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) { /* ignore */ } })();\n".replace("!window.FmisNative", "!window.IKI_NATIVE"))
_h = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()
_h = _h.replace('<meta name="robots"', '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="assets/logo-192.png">\n<meta name="robots"', 1)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(_h)
make_pwa(OUT, "Ikimina Savings Group Manager", "Ikimina", "Savings group management: contributions, loans, rotation and reports", "#0f5132", "assets/logo-192.png", "assets/logo-192.png")
print("built", OUT, sum(len(f) for _, _, f in os.walk(OUT)), "files")

