import re
s = open('build.py', encoding='utf-8').read()

# ---------- ticker from content/announcements.json
a = s.index('TICKER = [')
b = s.index('def topbar():')
s = s[:a] + '''import json
def load_json(name, default):
    try:
        with open(os.path.join(ROOT, "content", name), encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default
TICKER = [(x.get("tag", ""), x.get("text", ""), x.get("href", "#")) for x in load_json("announcements.json", [])]
''' + s[b:]

# ---------- header with resources and about menus, search button
a = s.index('def header(active):')
b = s.index("FOOTER = '''")
s = s[:a] + '''def header(active):
    cur = lambda k: ' aria-current="page"' if active == k else ""
    dd = "".join(f'<a href="{s}.html">{t}</a>' for s, t in DEPT_LIST)
    prod = ('<a href="smart-school-app.html">Smart School App<small>Offline learning suite for Windows and Android</small></a>'
            '<a href="smart-school-cloud.html">Smart School Cloud<small>Online access and device sync</small></a>'
            '<a href="tour.html">Take the tour<small>Screen by screen walkthrough</small></a>'
            '<a href="pricing.html">Pricing and licences<small>Plans and comparison</small></a>'
            '<a href="downloads.html">Downloads<small>Windows, Android and online</small></a>'
            '<a href="products.html">All products<small>Every app we build</small></a>')
    res = ('<a href="news.html">News and tips<small>Updates and teaching guides</small></a>'
           '<a href="stories.html">Success stories<small>What schools say</small></a>'
           '<a href="request.html">Request a demo or quote<small>Tell us what you need</small></a>'
           '<a href="search.html">Search the site<small>Find pages and products</small></a>')
    about = ('<a href="about.html">About us<small>Who we are</small></a>'
             '<a href="team.html">Our team<small>The people behind the work</small></a>'
             '<a href="partners.html">Partners and careers<small>Work and grow with us</small></a>')
    return f\'\'\'<a class="skip" href="#main">Skip to content</a>
{topbar()}
<header class="site-header"><div class="container nav-wrap">
<a class="brand" href="index.html" aria-label="EduSmart Consult home"><img src="assets/logo-horizontal.webp" alt="EduSmart Consult" width="186" height="62"></a>
<button class="menu-toggle" aria-label="Menu" aria-expanded="false">&#9776;</button>
<nav class="nav" aria-label="Main"><a href="index.html"{cur("index.html")}>Home</a>
<div class="dd"><a href="index.html#departments"{cur("dept")}>Departments</a><div class="dd-menu">{dd}</div></div>
<div class="dd"><a href="products.html"{cur("products")}>Products</a><div class="dd-menu">{prod}</div></div>
<div class="dd"><a href="news.html"{cur("resources")}>Resources</a><div class="dd-menu">{res}</div></div>
<div class="dd"><a href="about.html"{cur("about")}>About</a><div class="dd-menu">{about}</div></div>
<a class="nav-search" href="search.html" data-search-open aria-label="Search the site" title="Search (press /)">{ico("search")}</a>
<a href="request.html"{cur("request.html")} class="btn btn-primary btn-sm">Request a demo</a></nav>
</div></header>\'\'\'

''' + s[b:]

# ---------- footer: resources column, install button, consent banner, extra script
s = s.replace('<div><h4>Products</h4><a href="smart-school-app.html">Smart School App</a><a href="smart-school-app.html#download">Download</a><a href="smart-school-cloud.html">Smart School Cloud</a><a href="products.html">All products</a><a href="about.html">About us</a><a href="privacy.html">Privacy</a></div>',
              '<div><h4>Products</h4><a href="smart-school-app.html">Smart School App</a><a href="smart-school-cloud.html">Smart School Cloud</a><a href="tour.html">Take the tour</a><a href="pricing.html">Pricing</a><a href="downloads.html">Downloads</a><a href="products.html">All products</a></div>\n<div><h4>Company</h4><a href="about.html">About us</a><a href="team.html">Our team</a><a href="news.html">News and tips</a><a href="stories.html">Success stories</a><a href="partners.html">Partners and careers</a><a href="request.html">Request a demo</a><a href="privacy.html">Privacy</a></div>')
s = s.replace('.foot-grid', '.foot-grid')  # no-op keeps grid rule
s = s.replace('<script src="assets/config.js"></script><script src="assets/site.js"></script>\'\'\'',
              '<div class="consent hidden" id="consent" role="dialog" aria-label="Privacy notice"><p><b>Your privacy.</b> This site sets no tracking cookies. It only remembers this notice on your device. <a href="privacy.html">Read more</a></p><div><button class="btn btn-primary btn-sm" data-consent="essential">OK</button><button class="btn btn-outline btn-sm" data-consent="all" data-analytics-only hidden>Allow anonymous statistics</button></div></div>\n<button class="install hidden" id="installBtn" type="button">Install this site as an app</button>\n<script src="assets/config.js"></script><script src="assets/site.js"></script><script src="assets/extra.js" defer></script>\'\'\'')

# ---------- page(): registry, per-page og image, extra css, json-ld, verification, sw
s = s.replace('def page(fname, title, desc, active, body, og="assets/og-image.png"):',
              'PAGE_REG = []\ndef page(fname, title, desc, active, body, og=None, ld="", noindex=False):\n    if og is None:\n        og = "assets/og/" + fname.replace(".html", "") + ".png"\n        if not os.path.exists(os.path.join(ROOT, og)): og = "assets/og-image.png"')
s = s.replace('<link rel="stylesheet" href="assets/styles.css">', '<link rel="stylesheet" href="assets/styles.css"><link rel="stylesheet" href="assets/extra.css">\n{"<meta name=\\"robots\\" content=\\"noindex\\">" if noindex else ""}<meta name="google-site-verification" content="{GOOGLE_VERIFICATION}">\n<link rel="alternate" type="application/rss+xml" title="EduSmart Consult news" href="feed.xml">')
s = s.replace('</script>\n</head><body>', '</script>{ld}\n</head><body>', 1)
s = s.replace('    assert "\\u2014" not in html and "\\u2013" not in html, "dash character found in " + fname\n',
              '    assert "\\u2014" not in html and "\\u2013" not in html, "dash character found in " + fname\n    if not noindex:\n        txt = re.sub(r"\\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"<(script|style)[^>]*>.*?</\\1>", " ", body, flags=re.S))).strip()\n        PAGE_REG.append({"url": fname, "title": title.split(" | ")[0], "desc": desc, "text": txt[:900]})\n', 1)
s = s.replace('SITE_URL = "https://www.edusmartconsult.com"', 'SITE_URL = "https://www.edusmartconsult.com"\nGOOGLE_VERIFICATION = ""   # paste the token from Google Search Console here', 1) if 'GOOGLE_VERIFICATION' not in s else s

# ---------- hand over to build2 for the new pages
s = s.replace('\npages = ["", "products.html"', '\nexec(open(os.path.join(ROOT, "build2.py"), encoding="utf-8").read())\npages = ["", "products.html"', 1)
open('build.py', 'w', encoding='utf-8').write(s)
print('patched build.py')

s = open('build.py', encoding='utf-8').read()
s = s.replace('] + [d[0] + ".html" for d in DEPTS]\n', '] + [d[0] + ".html" for d in DEPTS] + EXTRA_PAGES\n', 1)
s = s.replace('"".join(f"<url><loc>{SITE_URL}/{p}</loc></url>\n" for p in pages)', '"".join(f"<url><loc>{SITE_URL}/{p}</loc><lastmod>{TODAY}</lastmod></url>\n" for p in pages)', 1)
i = s.index('with open(os.path.join(ROOT, "site.webmanifest")')
j = s.index('print("built"')
s = s[:i] + '''MANIFEST = {"name": "EduSmart Consult", "short_name": "EduSmart", "description": "Education, research and digital solutions in Rwanda", "start_url": "./index.html", "scope": "./", "display": "standalone",
            "background_color": "#ffffff", "theme_color": "#06307a", "lang": "en",
            "icons": [{"src": "assets/emblem-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "assets/emblem-512.png", "sizes": "512x512", "type": "image/png"}, {"src": "assets/emblem-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}],
            "shortcuts": [{"name": "Request a demo", "url": "request.html"}, {"name": "Smart School App", "url": "smart-school-app.html"}, {"name": "Products", "url": "products.html"}]}
with open(os.path.join(ROOT, "site.webmanifest"), "w") as f:
    json.dump(MANIFEST, f, indent=1)
''' + s[j:]
open('build.py', 'w', encoding='utf-8').write(s)
print('patched tail')
