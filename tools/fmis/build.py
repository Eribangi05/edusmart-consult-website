"""Builds the browser version of FMIS from the shared app in AndroidStudioProjects/FMIS/app.

Run from the website folder:   python tools/fmis/build.py
Copies the app to fmis/, marks it not for search engines, and (for local testing only) can allow a local cloud server:
   FMIS_TEST_CLOUD=http://localhost:4300 python tools/fmis/build.py"""
import os, shutil, sys
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
print("built", OUT, sum(len(f) for _, _, f in os.walk(OUT)), "files")
