"""Builds the browser version of Ikimina from the Windows app's sources.



Run from the website folder:   python tools/ikimina/build.py

Copies IkiminaDesktop/src to ikimina/ (the app already falls back to browser storage when there is no Electron bridge),

adds a small web banner script and web.css. The Windows app's own files are never changed."""

import os, shutil, sys

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

h = h.replace('<link rel="stylesheet" href="styles.css">', '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n<link rel="icon" href="../assets/products/ikimina.svg">\n<link rel="stylesheet" href="styles.css">\n<link rel="stylesheet" href="web.css">')

h = h.replace('<script src="app.js"></script>', '<script src="app.js"></script>\n<script src="web.js"></script>')

if os.environ.get("IKI_TEST_CLOUD"):          # local testing only: also allow a local copy of the cloud server
    h = h.replace("connect-src 'self'", "connect-src 'self' " + os.environ["IKI_TEST_CLOUD"], 1)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(h)

for fn, a, b in [("app.js", "Desktop Edition", "Web Edition"), ("i18n-data.js", "D('Desktop Edition', 'Édition Bureau', 'Verisiyo ya mudasobwa')", "D('Web Edition', 'Édition Web', 'Verisiyo y’urubuga')")]:
    q = os.path.join(OUT, fn); t = open(q, encoding="utf-8").read(); open(q, "w", encoding="utf-8").write(t.replace(a, b))

print("built", OUT, sum(len(f) for _, _, f in os.walk(OUT)), "files")

