"""Builds the browser version of Amategeko y'Umuhanda from the Windows app's sources.

Run from the website folder:   python tools/amategeko/build.py

  reads    RwandaTheoryApp/AmategekoWindows   (src/renderer, data, assets)
  writes   amategeko/                          (the public web app: sample content only)
           ../Cloud Sync Server/content-theory  (the FULL content, served only for an unlock code)

The Windows app's own files are never changed. Re-run after the app or its content changes, then deploy the site and the cloud server."""
import os, re, json, shutil, hashlib, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
SRC = os.environ.get("AMG_SRC") or r"C:\Users\ingab\AndroidStudioProjects\RwandaTheoryApp\AmategekoWindows"
CLOUD_DIR = os.environ.get("AMG_CLOUD") or os.path.join(os.path.dirname(SITE), "Cloud Sync Server")
OUT = os.path.join(SITE, "amategeko")

# how many items the free sample holds
SAMPLE = {"questions": 40, "signs": 36, "glossary": 15, "lessons": 2}


def read_json(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def write_json(p, o):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(o, f, ensure_ascii=False, separators=(",", ":"))


def cloud_url():
    cfg = open(os.path.join(SITE, "assets", "config.js"), encoding="utf-8").read()
    m = re.search(r'baseUrl:\s*"([^"]+)"', cfg)
    return m.group(1).rstrip("/") if m else ""


def spread(items, key, n):
    """n items, spread over the groups in proportion to their size, in stable order"""
    groups = {}
    for it in items:
        groups.setdefault(key(it), []).append(it)
    total = len(items)
    quota = {g: len(v) * n / total for g, v in groups.items()}
    take = {g: int(q) for g, q in quota.items()}
    left = n - sum(take.values())
    for g in sorted(groups, key=lambda g: quota[g] - take[g], reverse=True)[:left]:
        take[g] += 1
    out = []
    for g in sorted(groups):
        out.extend(groups[g][: take[g]])
    return out


def main():
    if not os.path.isdir(SRC):
        sys.exit("Cannot find the Windows app at " + SRC)
    data = {n: read_json(os.path.join(SRC, "data", n + ".json")) for n in ["questions", "signs", "glossary", "lessons", "gazette"]}

    # ---- sample content (deterministic, so a rebuild does not shuffle what visitors see)
    qs = sorted(data["questions"], key=lambda q: q["id"])
    sample = {
        "questions": spread(qs, lambda q: q.get("category"), SAMPLE["questions"]),
        "signs": spread(sorted(data["signs"], key=lambda s: s["code"]), lambda s: s.get("family"), SAMPLE["signs"]),
        "glossary": sorted(data["glossary"], key=lambda g: g.get("order", 0))[: SAMPLE["glossary"]],
        "lessons": data["lessons"][: SAMPLE["lessons"]],
        "gazette": [],
    }
    meta = {"full": {k: len(data[k]) for k in ["questions", "signs", "glossary", "lessons"]},
            "sample": {k: len(sample[k]) for k in ["questions", "signs", "glossary", "lessons"]}}

    # ---- fresh output folder
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, "data"))
    for n, v in sample.items():
        write_json(os.path.join(OUT, "data", n + ".json"), v)
    write_json(os.path.join(OUT, "data", "meta.json"), meta)

    # ---- the full content goes to the cloud server, not the public site
    full_dir = os.path.join(CLOUD_DIR, "content-theory")
    if os.path.isdir(CLOUD_DIR):
        for n in data:
            write_json(os.path.join(full_dir, n + ".json"), data[n])
    else:
        print("WARNING: cloud folder not found, full content not written:", CLOUD_DIR)

    # ---- app files
    R = os.path.join(SRC, "src", "renderer")
    shutil.copy(os.path.join(R, "styles.css"), os.path.join(OUT, "styles.css"))
    app = open(os.path.join(R, "app.js"), encoding="utf-8").read()
    n_paths = app.count("../../assets/")
    app = app.replace("../../assets/", "assets/")
    # The Windows app forgets who is signed in on every start (shared school computers). A visitor's own phone or laptop should not.
    a1 = "  S.currentPhone = null;\n  if(saved && saved.currentPhone){ persist(); }   // clear the stale session in the store\n"
    assert a1 in app, "session line not found: the app changed, review the web build"
    app = app.replace(a1, "  S.currentPhone = (saved && saved.currentPhone) || null;   // web: stay signed in on this device\n", 1)
    open(os.path.join(OUT, "app.js"), "w", encoding="utf-8").write(app)
    shutil.copy(os.path.join(HERE, "web.css"), os.path.join(OUT, "web.css"))
    shim = open(os.path.join(HERE, "web-shim.js"), encoding="utf-8").read().replace("__CLOUD_URL__", cloud_url())
    open(os.path.join(OUT, "web-shim.js"), "w", encoding="utf-8").write(shim)

    # cache-busting id changes whenever anything the browser loads changes
    hh = hashlib.sha1()
    for fn in ("app.js", "web-shim.js", "web.css", "styles.css"):
        hh.update(open(os.path.join(OUT, fn), "rb").read())
    build_id = hh.hexdigest()[:8]
    html = open(os.path.join(R, "index.html"), encoding="utf-8").read()
    csp_old = re.search(r'<meta http-equiv="Content-Security-Policy"[^>]*/>', html, re.S)
    assert csp_old, "CSP tag not found"
    connect = cloud_url() or "'self'"
    if os.environ.get("AMG_TEST_CLOUD"):          # local testing only: also allow a local copy of the cloud server
        connect += " " + os.environ["AMG_TEST_CLOUD"]
    csp = ('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; img-src \'self\' data:; style-src \'self\' \'unsafe-inline\'; '
           'script-src \'self\' \'unsafe-inline\'; frame-src \'self\'; object-src \'self\'; connect-src \'self\' ' + connect + ';" />\n'
           '  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n'
           '  <meta name="theme-color" content="#12276b" />\n  <meta name="robots" content="noindex" />\n'
           '  <link rel="icon" href="assets/icons/appicon.png" />')
    html = html.replace(csp_old.group(0), csp)
    html = html.replace('<link rel="stylesheet" href="styles.css" />', '<link rel="stylesheet" href="styles.css" />\n  <link rel="stylesheet" href="web.css?v=' + build_id + '" />')
    loader = ('<noscript><p style="padding:24px;font-family:sans-serif">This app needs JavaScript.</p></noscript>\n'
              '  <script src="web-shim.js?v=' + build_id + '"></script>\n'
              '  <script>\n  __amgReady.then(function () {\n    var s = document.createElement("script"); s.src = "app.js?v=' + build_id + '";\n'
              '    s.onload = function () { if (window.__amgAfterStart) window.__amgAfterStart(); };\n    document.body.appendChild(s);\n'
              '  }).catch(function () { document.body.innerHTML = "<p style=\\"padding:24px;font-family:sans-serif\\">The app could not load. Check your connection and reload the page.</p>"; });\n  </script>')
    assert '<script src="app.js"></script>' in html
    html = html.replace('<script src="app.js"></script>', loader)
    html = html.replace("<title>Amategeko y'Umuhanda</title>", "<title>Amategeko y'Umuhanda | Road code theory practice</title>")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(html)

    # ---- pictures, signs, question images, the law documents
    for d in ["signs", "qimg", "practical", "icons", "gazette"]:
        s = os.path.join(SRC, "assets", d)
        if os.path.isdir(s):
            shutil.copytree(s, os.path.join(OUT, "assets", d))
    total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs)
    print("built", OUT)
    print("  asset paths rewritten:", n_paths, "| build id:", build_id, "| size: %.1f MB" % (total / 1048576))
    print("  sample:", meta["sample"], "of", meta["full"])
    print("  full content ->", full_dir if os.path.isdir(CLOUD_DIR) else "not written")


main()
