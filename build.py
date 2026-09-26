#!/usr/bin/env python3
"""Generates the static pages so the header, footer and meta tags stay identical everywhere.
Run:  python build.py      (edit copy in this file, then rebuild)"""
import os, re, json

ROOT = os.path.dirname(os.path.abspath(__file__))
import datetime
TODAY = datetime.date.today().isoformat()
SITE_URL = "https://www.edusmartconsult.com"   # change if the final domain differs
GOOGLE_VERIFICATION = ""   # paste the token from Google Search Console here (see SEO-SETUP.md)

exec(open(os.path.join(ROOT, "make_og.py"), encoding="utf-8").read())
PH = {
 "book": "book-open", "clock": "clock", "chart": "chart-bar", "users": "users-three", "shield": "shield-check", "device": "desktop",
 "wifi": "wifi-high", "file": "file-text", "calendar": "calendar-check", "print": "printer", "target": "target", "edit": "pencil-simple-line",
 "search": "magnifying-glass", "database": "database", "code": "code", "globe": "globe-hemisphere-east", "heart": "heart", "phone": "device-mobile",
 "download": "download-simple", "school": "graduation-cap", "whatsapp": "whatsapp-logo", "call": "phone-call", "mail": "envelope-simple",
 "handshake": "handshake", "translate": "translate", "lock": "lock-key", "cloud": "cloud", "briefcase": "briefcase", "buildings": "buildings",
 "chalkboard": "chalkboard-teacher", "bulb": "lightbulb", "rocket": "rocket", "pin": "map-pin", "handheart": "hand-heart", "books": "books",
}
_ICON_CACHE = {}
def _icon_inner(name):
    if name not in _ICON_CACHE:
        raw = open(os.path.join(ROOT, "assets", "icons", "ph-" + PH[name] + ".svg"), encoding="utf-8").read()
        _ICON_CACHE[name] = re.sub(r"^<svg[^>]*>|</svg>\s*$", "", raw.strip())
    return _ICON_CACHE[name]
def ico(name, cls=""):
    return f'<span class="ico {cls}"><svg viewBox="0 0 256 256" aria-hidden="true" fill="currentColor">{_icon_inner(name)}</svg></span>'

DEPT_LIST = [
 ("education-training", "Education and Training"), ("inclusive-education", "Inclusive and Special Needs Education"),
 ("research-consulting", "Research and Consulting"), ("elearning", "E-Learning and Digital Learning"),
 ("software-development", "Web and Software Development"), ("data-information", "Data and Information Services"),
 ("ict-support", "ICT and Computer Systems Support"), ("environmental-technical", "Environmental and Technical Consulting"),
 ("admin-support", "Administrative, Fundraising and Equipment Support")]

import json
def load_json(name, default):
    try:
        with open(os.path.join(ROOT, "content", name), encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default
TICKER = [(x.get("tag", ""), x.get("text", ""), x.get("href", "#")) for x in load_json("announcements.json", [])]
def topbar():
    items = "".join(f'<a class="tk" href="{h}"><b>{t}</b> {x}</a>' for t, x, h in TICKER)
    return f'''<div class="topbar" role="region" aria-label="Announcements and Kigali time"><div class="container tb-in">
<div class="tb-clock" title="Time in Kigali, Rwanda (Central Africa Time, UTC+2)">{ico("clock")}<span><b data-kigali-time>--:--:--</b><small data-kigali-date>Kigali, Rwanda</small></span></div>
<div class="ticker" aria-live="off"><div class="ticker-track">{items}{items}</div></div>
<a class="tb-call" href="tel:+250782368555">{ico("call")}<span data-phone>+250 782 368 555</span></a>
</div></div>'''

def header(active):
    cur = lambda k: ' aria-current="page"' if active == k else ""
    dd = "".join(f'<a href="{s}.html">{t}</a>' for s, t in DEPT_LIST)
    prod = ('<a href="smart-school-app.html">Smart School App<small>Offline learning suite for Windows and Android</small></a>'
            '<a href="smart-school-cloud.html">Smart School Cloud<small>Online access and device sync</small></a>'
            '<a href="try.html">Try it live<small>Open the demo school in your browser</small></a>'
            "<a href=\"road-code.html\">Amategeko y'Umuhanda<small>Road code practice in your browser</small></a>"
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
    return f'''<a class="skip" href="#main">Skip to content</a>
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
<a href="contact.html"{cur("contact.html")}>Contact</a>
<a href="request.html"{cur("request.html")} class="btn btn-primary btn-sm">Request a demo</a></nav>
</div></header>'''

FOOTER = '''<section class="cta"><div class="container"><h2>Talk to us about your school or organisation.</h2>
<a class="btn btn-gold" href="contact.html#form">Send an enquiry</a></div></section>
<footer class="footer"><div class="container">
<div class="foot-grid">
<div><div class="foot-logo"><img src="assets/logo-horizontal.webp" alt="EduSmart Consult" width="132" height="44"></div>
<p>Better Research | Stronger Education | Brighter Futures</p></div>
<div><h4>Departments</h4><a href="education-training.html">Education and Training</a><a href="inclusive-education.html">Inclusive Education</a><a href="research-consulting.html">Research and Consulting</a><a href="elearning.html">E-Learning</a><a href="software-development.html">Software Development</a><a href="index.html#departments">All departments</a></div>
<div><h4>Products</h4><a href="smart-school-app.html">Smart School App</a><a href="smart-school-cloud.html">Smart School Cloud</a><a href="road-code.html">Amategeko y'Umuhanda</a><a href="tour.html">Take the tour</a><a href="pricing.html">Pricing</a><a href="downloads.html">Downloads</a><a href="products.html">All products</a></div>
<div><h4>Company</h4><a href="about.html">About us</a><a href="team.html">Our team</a><a href="news.html">News and tips</a><a href="stories.html">Success stories</a><a href="partners.html">Partners and careers</a><a href="request.html">Request a demo</a></div>
</div>
<div class="foot-contact"><span>Itetero, Nyagatovu, Kimironko, Gasabo, Kigali, Rwanda</span><a data-phone href="#">+250 782 368 555</a><a data-email href="#">email</a></div>
<div class="foot-legal"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="security.html">Security</a><a href="child-safety.html">Child safety</a><a href="help.html">Help centre</a><a href="status.html">Status</a></div>
<div class="foot-bottom"><span>&copy; <span data-year></span> EduSmart Consult LTD. All rights reserved.</span>
<span>Registered company, Rwanda</span></div>
<p style="font-size:.8rem;margin:1rem 0 0;color:#8ea3cf">Smart School App uses Rwanda Basic Education Board (REB) curriculum materials. EduSmart Consult is an independent company and this site is not an official REB publication.</p>
</div></footer>
<div class="lightbox" id="lb" role="dialog" aria-label="Enlarged screenshot"><img alt=""></div>
<div class="consent hidden" id="consent" role="dialog" aria-label="Privacy notice"><p><b>Your privacy.</b> This site sets no tracking cookies. It only remembers this notice on your device. <a href="privacy.html">Read more</a></p><div><button class="btn btn-primary btn-sm" data-consent="essential">OK</button><button class="btn btn-outline btn-sm" data-consent="all" data-analytics-only hidden>Allow anonymous statistics</button></div></div>
<div class="install hidden" id="installBox" role="dialog" aria-label="Install this site"><button type="button" id="installBtn">Install as an app</button><button type="button" id="installX" aria-label="Dismiss" title="Not now">&times;</button></div>
<script src="assets/config.js"></script><script src="assets/site.js"></script><script src="assets/extra.js" defer></script>'''


PAGE_REG = []
def page(fname, title, desc, active, body, og=None, ld="", noindex=False):
    if og is None:
        og = "assets/og/" + fname.replace(".html", "") + ".png"
        if not os.path.exists(os.path.join(ROOT, og)): og = "assets/og-image.png"
    url = f"{SITE_URL}/{fname if fname != 'index.html' else ''}"
    html = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script>document.documentElement.className+=" js"</script>
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#06307a">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="EduSmart Consult">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{SITE_URL}/{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.ico" sizes="32x32"><link rel="icon" href="assets/favicon.png" type="image/png"><link rel="apple-touch-icon" href="assets/emblem-192.png">
<link rel="manifest" href="site.webmanifest">
<link rel="stylesheet" href="assets/styles.css"><link rel="stylesheet" href="assets/extra.css">
{"<meta name=\"robots\" content=\"noindex\">" if noindex else ""}<meta name="google-site-verification" content="{GOOGLE_VERIFICATION}">
<link rel="alternate" type="application/rss+xml" title="EduSmart Consult news" href="feed.xml">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Organization","name":"EduSmart Consult LTD","url":"{SITE_URL}","logo":"{SITE_URL}/assets/emblem-512.png","email":"hagenalexis2000@gmail.com","telephone":"+250782368555","address":{{"@type":"PostalAddress","streetAddress":"Itetero, Nyagatovu, Kimironko, Gasabo","addressLocality":"Kigali","addressCountry":"RW"}}}}</script>{ld}
</head><body>
{header(active)}
<main id="main">
{body}
</main>
{FOOTER}
</body></html>'''
    assert "\u2014" not in html and "\u2013" not in html, "dash character found in " + fname
    if not noindex:
        txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", body, flags=re.S))).strip()
        PAGE_REG.append({"url": fname, "title": title.split(" | ")[0], "desc": desc, "text": txt[:900]})
    with open(os.path.join(ROOT, fname), "w", encoding="utf-8", newline="\n") as f:
        f.write(html)

def hero_page(crumb, h1, p):
    return f'<section class="page-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> / {crumb}</div><h1>{h1}</h1><p>{p}</p></div></section>'


# ---------------------------------------------------------------- PRODUCT CATALOGUE
PRODUCTS = [
 # (slug, name, category, logo, page or None, description, platform)
 ("smart-school-app", "Smart School App", "School and learning", "ssa-logo-96.png", "smart-school-app.html",
  "Offline learning and school management suite for Primary 1 to 6: books, exams, lesson plans, timetables, marking and reports.", "Windows, Android"),
 ("smart-school-cloud", "Smart School Cloud", "School and learning", "ssa-logo-96.png", "smart-school-cloud.html",
  "The online side of Smart School App: use it in a browser and keep records in step across Windows and Android devices.", "Web, cloud sync"),
 ("reb-class-apps", "REB Class, Reader and Subject Apps", "School and learning", "products/classapps.svg", None,
  "Focused Android apps for each Primary class and subject: class apps, read aloud story readers and single subject pupil book apps.", "Android"),
 ("teacherdesk-pro", "TeacherDesk Pro", "School and learning", "products/teacherdesk.webp", None,
  "A teacher's daily desk: attendance, lesson plans, self assessment, exam results, notes, a book library and a timetable.", "Android"),
 ("studentlearn", "StudentLearn", "School and learning", "products/studentlearn.svg", None,
  "Study planner for students with courses, lessons, flashcards, notes, revision plans, a timetable and tracked study sessions.", "Android"),
 ("kidsreads-rwanda", "KidsReads Rwanda", "School and learning", "products/kidsreads.webp", None,
  "A children's reading library with reader profiles, quizzes, badges and daily reading missions. Learn, Read, Grow.", "Android"),
 ("ubumenyi-bw-abana", "Ubumenyi Bw'Abana", "School and learning", "products/ubumenyi.svg", None,
  "Offline learning app for children aged 3 to 6, aligned to the REB Competence-Based Pre-Primary Curriculum.", "Android"),
 ("nursery-1", "Nursery 1 | Ubumenyi", "School and learning", "products/nursery1.svg", None,
  "Standalone learning app for Nursery 1 (ages 3 to 4). Playful, offline and aligned to the pre-primary curriculum.", "Android"),
 ("nursery-2", "Nursery 2 | Ubumenyi", "School and learning", "products/nursery2.svg", None,
  "Standalone learning app for Nursery 2, continuing the Ubumenyi series with the next level of activities.", "Android"),
 ("nursery-3", "Nursery 3 | Ubumenyi", "School and learning", "products/nursery3.svg", None,
  "Standalone learning app for Nursery 3, preparing children for Primary 1 with the Ubumenyi series.", "Android"),
 ("little-math-stars", "Little Math Stars", "School and learning", "products/littlemathstars.svg", None,
  "Maths activities and mini games for young learners across three levels, with celebration screens and progress.", "Android"),
 ("mindgym-mathematics", "MindGym Mathematics", "School and learning", "products/mindgym.svg", None,
  "A mental maths training game that works your number skills like a gym workout.", "Android"),
 ("ikimina", "Ikimina", "Community and finance", "products/ikimina.svg", None,
  "Offline savings group manager for Ikimina, VSLA and tontine groups, with roles for presidents and members.", "Android"),
 ("budgetwise", "BudgetWise", "Community and finance", "products/budgetwise.webp", None,
  "Personal and group budgeting: track transactions, see analytics on a dashboard and share budgets in groups.", "Android"),
 ("jus-champion", "Jus Champion", "Community and finance", "products/juschampion.webp", None,
  "Offline business finance manager built for a ginger juice business: sales, costs and records in one place.", "Android"),
 ("codevault-manager", "CodeVault Manager", "Community and finance", "products/codevault.svg", None,
  "Offline generator and register of activation codes for our apps, with payment logs and code status tracking.", "Android"),
 ("akazi", "Akazi Job Marketplace", "Jobs and business", "products/akazi.svg", None,
  "Job marketplace for Rwanda with a smart match score, in app CV builder, employer verification and English, French and Kinyarwanda screens.", "Android, web API"),
 ("akazi-template", "Akazi Job Board Template", "Jobs and business", "products/akazi-template.svg", None,
  "The Akazi job marketplace packaged as a ready to brand template for other countries, organisations or sectors.", "Android, web API"),
 ("nightshift-manager", "NightShift Manager", "Jobs and business", "products/nightshift.webp", None,
  "Shift and sales manager for bars and restaurants: menu, orders, waiters, cash sessions and incident records.", "Android"),
 ("smartcart", "SmartCart", "Lifestyle", "products/smartcart.svg", None,
  "Smart shopping lists with a pantry, recipes and meal planning to help households plan and spend well.", "Android"),
 ("ironlog", "IronLog", "Lifestyle", "products/ironlog.svg", None,
  "Workout log with routines, sets, personal records, body measurements and reminders.", "Android"),
 ("amategeko", "Amategeko y'Umuhanda", "Transport and driving", "products/amategeko.png", "road-code.html",
  "Rwanda road code theory practice with 328 questions, 126 road signs, a glossary and timed mock exams, in Kinyarwanda, English and French. Try it in your browser.", "Web, Windows, Android"),
 ("rwanda-drive", "Rwanda Drive", "Transport and driving", "products/rwandadrive.svg", None,
  "Driving school training product: a theory academy plus a 3D driving simulator with a Kigali inspired city. In development.", "Windows (in development)"),
]
CATS = ["School and learning", "Community and finance", "Jobs and business", "Lifestyle", "Transport and driving"]

def prod_card(p):
    slug, name, cat, logo, pg, desc, plat = p
    topic = (name.replace("|", "").replace("&", "and").replace("  ", " ") + " enquiry").replace(" ", "%20")
    tag = f'<a class="btn btn-outline btn-sm" href="{pg}">See the product</a>' if pg else f'<a class="btn btn-outline btn-sm" href="contact.html?topic={topic}#form">Ask about it</a>'
    return f'''<article class="pcard" id="{slug}" data-cat="{cat}"><img class="plogo" src="assets/{logo}" alt="{name} logo" width="72" height="72" loading="lazy">
<div class="pbody"><span class="pcat">{cat}</span><h3>{name}</h3><p>{desc}</p><div class="pfoot"><span class="pplat">{plat}</span>{tag}</div></div></article>'''

def logo_strip():
    return "".join(f'<a class="lm" tabindex="-1" href="{p[4] or "products.html#" + p[0]}"><img src="assets/{p[3]}" alt="" width="64" height="64" loading="lazy"><span>{p[1]}</span></a>' for p in PRODUCTS)

def prod_tiles():
    return "".join(f'<a class="ptile" href="{p[4] or "products.html#" + p[0]}"><img src="assets/{p[3]}" alt="" width="56" height="56" loading="lazy"><span>{p[1]}</span></a>' for p in PRODUCTS)


DEPTS = [
 ("education-training", "users", "Education and Training", "Programmes and support for teachers, school leaders and learners.",
  "We design and deliver learning that fits real classrooms. Our education team works with schools, training providers and education projects to build teaching capacity and improve learning results.",
  ["Course and curriculum design", "Teacher and school leader training", "Tutoring and learning resources", "Training on using Smart School App in class", "Assessment design and learner progress tracking"],
  ["Schools that want practical, hands on teacher training", "Training providers that need course materials and learner records", "Projects that need to prepare teachers to use new tools"]),
 ("inclusive-education", "heart", "Inclusive and Special Needs Education", "Support so that every learner can take part and progress.",
  "Learners differ in how they see, hear, move and learn. We help schools plan support that fits each learner, and we build accessibility into the tools we create.",
  ["Support planning for learners with special needs", "Adapting lessons and learning materials", "Accessible reading options: read aloud, larger text and colour themes", "Guidance for teachers and parents", "Awareness sessions for school communities"],
  ["Schools enrolling learners with different needs", "Parents looking for practical guidance", "Organisations running inclusion programmes"]),
 ("research-consulting", "search", "Research and Consulting", "Evidence for decisions, from study design to the final report.",
  "Good decisions start with good information. We plan studies, collect and analyse data, and present findings in plain language that decision makers can act on.",
  ["Research design, sampling and instruments", "Field data collection and supervision", "Quantitative and qualitative analysis", "Baseline, monitoring and evaluation studies", "Clear reports, summaries and presentations"],
  ["Education projects and NGOs", "Schools and local government offices", "Businesses that need market or user information"]),
 ("elearning", "device", "E-Learning and Digital Learning", "Learning platforms that work where connectivity is limited.",
  "Digital learning should not depend on a fast connection. We build and deploy learning tools that work offline first and can sync online when a connection is available.",
  ["Offline and online course delivery", "Assessments, quizzes and certificates", "Learner records and reports", "Deployment of Smart School App in schools", "Smart School Cloud for online access and device sync"],
  ["Schools moving to digital learning", "Training providers offering online courses", "Programmes that need to reach remote schools"]),
 ("software-development", "code", "Web and Software Development", "Websites, portals and systems built around how you work.",
  "We build the software an organisation actually needs, from a clear website to a custom system with accounts, records and reports. Smart School App and Smart School Cloud are examples of our own work.",
  ["Organisation and institution websites", "Application, registration and results portals", "Custom web, desktop and Android applications", "Integration with existing records and spreadsheets", "Maintenance, updates and support"],
  ["Schools and colleges needing portals", "Companies needing internal tools", "Projects that need a simple, reliable website"]),
 ("data-information", "database", "Data and Information Services", "Clean, well organised information you can rely on.",
  "Reliable data saves time and prevents mistakes. We digitise, clean and organise records, and we carry out information searches on a fee basis.",
  ["Data entry and digitisation of paper records", "Data processing, cleaning and validation", "Information search and compilation", "Reports, tables and dashboards", "Quality checks on every delivery"],
  ["Schools digitising learner records", "Offices with large paper archives", "Researchers who need data prepared"]),
 ("ict-support", "shield", "ICT and Computer Systems Support", "Practical help keeping systems and data facilities running.",
  "Technology only helps when it works. We help organisations set up, manage and look after computer systems and data processing facilities, and we train staff to use them well.",
  ["Onsite management of computer systems", "Setup of school computer labs and devices", "Backup and data safety routines", "Workflow digitisation and technology advice", "Staff orientation and follow up support"],
  ["Schools with computer labs", "Small offices without an IT team", "Projects rolling out new devices"]),
 ("environmental-technical", "globe", "Environmental and Technical Consulting", "Technical advice on projects that affect people and places.",
  "Some projects need specialist technical and environmental input. We provide consulting support and coordinate with qualified partners where a project requires it.",
  ["Technical consulting for education and community projects", "Environmental awareness and education programmes", "Preparation of technical documents and reports", "Coordination with specialist partners", "Field surveys and data collection"],
  ["Community and school projects", "Organisations preparing project documents", "Programmes that include environmental education"]),
 ("admin-support", "file", "Administrative, Fundraising and Equipment Support", "Behind the scenes support that keeps a project moving.",
  "Many organisations need help with the practical side of their work. We support with administration, proposals for funding and the supply of equipment.",
  ["Administrative and secretarial support", "Proposal and funding application writing", "Supply of computers, printers and school equipment", "Event and workshop coordination", "Project reporting and documentation"],
  ["Small organisations and start ups", "Schools looking for funding or equipment", "Projects that need extra hands"]),
]

NAV_ACTIVE = {}

def win(src, alt, title="Smart School App", w=1440, h=900):
    return f'''<div class="win"><div class="win-bar"><img src="assets/ssa-logo-96.png" alt=""><span class="t">{title}</span>
<span class="c"><i><svg viewBox="0 0 10 10"><path d="M0 5h10"/></svg></i><i><svg viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9"/></svg></i><i><svg viewBox="0 0 10 10"><path d="M0 0l10 10M10 0L0 10"/></svg></i></span></div>
<img class="shot" src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy"></div>'''

def fig(src, title, text, alt=None):
    return f'<figure class="fig">{win(src, alt or title)}<figcaption><b>{title}</b>{text}</figcaption></figure>'

def phone(src, title, text):
    return f'<figure class="fig"><div class="phone"><img src="{src}" alt="{title} on Android" width="500" height="1000" loading="lazy"></div><figcaption style="text-align:center"><b>{title}</b>{text}</figcaption></figure>'

# ---------------------------------------------------------------- HOME
dept_cards = ""
for i, (slug, ic, title, short, *_r) in enumerate(DEPTS):
    c = "c%d" % (i % 3 + 1)
    dept_cards += f'<a class="card dept {c}" href="{slug}.html">{ico(ic)}<h3>{title}</h3><p>{short}</p><span class="more">Learn more &rarr;</span></a>'

home = f'''
<section class="hero"><div class="container hero-grid">
<div class="rv">
<div class="eyebrow"><i></i> Better Research | Stronger Education | Brighter Futures</div>
<h1>Education, research and digital solutions for <em class="rot" data-words="Rwanda|schools|organisations|communities">Rwanda</em>.</h1>
<p class="lead">EduSmart Consult LTD is a Kigali based company working in education and training, inclusive education, research, e-learning, software development, data services and ICT support. We help schools and organisations learn better, decide with evidence and work with reliable technology.</p>
<div class="actions"><a class="btn btn-primary" href="#departments">Explore our departments</a><a class="btn btn-sky" href="products.html">See our software</a></div>

</div>
<div class="hero-panel rv"><h3>What we do</h3>
{"".join(f'<a href="{d[0]}.html"><i></i>{d[2]}</a>' for d in DEPTS)}
</div>
</div>
<div class="container glance-row"><div class="glance">
<div class="gl"><span class="ico c2">{ico("translate")}</span><div><b>Languages we work in</b><span>English, French and Kinyarwanda</span></div></div>
<div class="gl"><span class="ico c3">{ico("wifi")}</span><div><b>Apps that work offline</b><span>No internet needed in the classroom</span></div></div>
<div class="gl"><span class="ico">{ico("lock")}</span><div><b>Private by design</b><span>School records stay on the school's own devices</span></div></div>
</div></div></section>

<section class="section"><div class="container">
<div class="stats stats-big">
<div class="tile navy rv"><b data-count="9">9</b><span>Departments under one company</span></div>
<div class="tile sky rv"><b data-count="{len(PRODUCTS)}">{len(PRODUCTS)}</b><span>Software products we build and maintain</span></div>
<div class="tile gold rv"><b>P1 to P6</b><span>Full primary curriculum in our Smart School App</span></div>
<div class="tile navy rv"><b data-count="2">2</b><span>Platforms for our school app: Windows and Android</span></div>
</div></div></section>

<section class="section sky" id="departments"><div class="container">
<div class="section-head"><div><div class="kicker">Our departments</div><h2>Nine areas of expertise</h2></div>
<p>Each department has its own focus but shares one standard: clear scope, honest reporting and results your team can keep using.</p></div>
<div class="grid g3">{dept_cards}</div>
</div></section>

<section class="section dark showcase" id="featured"><div class="container split">
<div class="rv"><div class="kicker">Featured product</div>
<div class="prod-head"><img src="assets/ssa-logo-96.png" alt="Smart School App logo" width="84" height="84"><div><span class="badge">Made by EduSmart Consult</span><h2 style="margin:.3rem 0 0;color:#fff">Smart School App</h2></div></div>
<p>An offline learning and school management suite for Primary 1 to 6. Learners read the curriculum, practise and sit past papers. Teachers plan lessons, mark, build timetables and print reports. It runs on Windows computers and Android phones, and can sync online when there is a connection.</p>
<ul class="checklist">
<li>Full REB pupil books for every class, with read aloud</li>
<li>62 P6 national exam papers with automatic marking</li>
<li>Lesson plans in English, French and Kinyarwanda</li>
<li>Whole school timetable generator</li>
<li>Gradebook, report cards and parent reports</li>
<li>Works with no internet, and online with Smart School Cloud</li>
</ul>
<div class="actions"><a class="btn btn-gold" href="smart-school-app.html">Explore Smart School App</a><a class="btn btn-ghost-light" href="smart-school-cloud.html">Online access and sync</a></div></div>
<div class="shots rv">{win("assets/app-overview.webp", "Smart School App teacher overview on Windows")}<div class="shot-phone">{phone("assets/phone-learner.webp", "Learner home", "")}</div></div>
</div></section>

<section class="section"><div class="container">
<div class="section-head"><div><div class="kicker">Who we serve</div><h2>Solutions for every kind of client</h2></div>
<p>Whether you run one school or a national programme, we start from what you need and build the smallest solution that works.</p></div>
<div class="grid g3">
<div class="card aud c1 rv">{ico("school")}<h3>Schools and teachers</h3><p>Curriculum tools, lesson planning, timetables, training and computer lab support that work in real classrooms.</p><a href="education-training.html">Education and training</a></div>
<div class="card aud c2 rv">{ico("users")}<h3>Education projects and NGOs</h3><p>Research, monitoring and evaluation, e-learning delivery and proposal writing for programmes that must show results.</p><a href="research-consulting.html">Research and consulting</a></div>
<div class="card aud c3 rv">{ico("globe")}<h3>Local government and public offices</h3><p>Data digitisation, information systems, reports and dashboards that turn paper records into decisions.</p><a href="data-information.html">Data and information</a></div>
<div class="card aud c2 rv">{ico("code")}<h3>Businesses and entrepreneurs</h3><p>Websites, custom apps, business finance tools and job or shift management software built around your workflow.</p><a href="software-development.html">Software development</a></div>
<div class="card aud c3 rv">{ico("heart")}<h3>Inclusive education providers</h3><p>Support planning, adapted materials and accessible learning tools for learners with different needs.</p><a href="inclusive-education.html">Inclusive education</a></div>
<div class="card aud c1 rv">{ico("book")}<h3>Families and learners</h3><p>Reading, maths, pre-primary and road code apps that work offline on a family phone.</p><a href="products.html">Browse our apps</a></div>
</div></div></section>

<section class="section soft"><div class="container">
<div class="section-head"><div><div class="kicker">Our products</div><h2>Software we build ourselves</h2></div>
<p>Our development team builds and maintains {len(PRODUCTS)} software products for schools, families, savings groups and businesses. Most work offline and are made for Rwanda.</p></div>
<div class="logo-marquee" aria-hidden="true"><div class="lm-track">{logo_strip()}{logo_strip()}</div></div>
<div class="ptiles">{prod_tiles()}</div>
<p style="margin-top:1.6rem"><a class="btn btn-primary" href="products.html">See all products</a> &nbsp; <a class="btn btn-sky" href="smart-school-app.html">Featured: Smart School App</a></p>
</div></section>

<section class="section sunny"><div class="container">
<div class="section-head"><div><div class="kicker">Why EduSmart Consult</div><h2>A partner that stays after delivery</h2></div>
<p>We are a small, focused team you can reach directly. We agree scope in writing, deliver in stages and train your people so the result keeps working.</p></div>
<div class="grid g3">
<div class="card rv">{ico("target")}<h3>Local and reachable</h3><p>Registered in Rwanda with an office in Kigali. Call, message on WhatsApp or visit.</p></div>
<div class="card rv">{ico("wifi")}<h3>Built for low connectivity</h3><p>Our tools work offline first and sync when a connection is available.</p></div>
<div class="card rv">{ico("globe")}<h3>Three languages</h3><p>Services and content in English, French and Kinyarwanda.</p></div>
<div class="card rv">{ico("shield")}<h3>Your data stays yours</h3><p>Records live on your devices. Online features are optional and explained plainly.</p></div>
<div class="card rv">{ico("users")}<h3>Training included</h3><p>Every project ends with handover, training and support for your team.</p></div>
<div class="card rv">{ico("file")}<h3>Clear scope and pricing</h3><p>You get written deliverables, a timeline and a cost before work begins.</p></div>
</div></div></section>

<section class="section"><div class="container">
<div class="section-head"><div><div class="kicker">How we work</div><h2>A simple, clear process</h2></div><p>Every engagement follows the same four steps, whichever department you work with.</p></div>
<div class="steps">
<div class="step rv"><h3>Listen</h3><p>We learn how your school or organisation works and what needs to change.</p></div>
<div class="step rv"><h3>Scope</h3><p>We agree deliverables, timeline and cost in writing before work starts.</p></div>
<div class="step rv"><h3>Deliver</h3><p>We build and deliver in stages so you can review progress as we go.</p></div>
<div class="step rv"><h3>Support</h3><p>We train your staff and stay available for questions and updates.</p></div>
</div></div></section>

<section class="section sky"><div class="container" style="max-width:860px">
<div class="kicker">Questions</div><h2>Frequently asked</h2>
<details><summary>What does EduSmart Consult do?</summary><p>We provide education and training, inclusive education support, research and consulting, e-learning, web and software development, data services, ICT support, environmental and technical consulting, and administrative, fundraising and equipment support.</p></details>
<details><summary>Do your apps need the internet?</summary><p>No. Smart School App and most of our other apps work fully offline. Smart School Cloud adds optional online access and syncing between devices.</p></details>
<details><summary>Can you build something for our organisation?</summary><p>Yes. Tell us what you need on the <a href="contact.html#form">contact page</a>. We reply within two working days with questions and, when ready, a written scope and quote.</p></details>
<details><summary>Where are you based?</summary><p>Itetero, Nyagatovu, Kimironko, Gasabo, Kigali, Rwanda. We work with clients across the country and remotely.</p></details>
<details><summary>How do I get Smart School App?</summary><p>See the <a href="smart-school-app.html#download">download section</a>. The app is licensed per school, and we can train your teachers.</p></details>
</div></section>

<section class="section tight"><div class="container">
<div class="reach rv"><div class="reach-text"><div class="kicker">Get in touch</div><h2>Let's talk about your school or project</h2><p>Tell us what you need. We reply within two working days.</p><p class="kg">{ico("clock")} <span>Kigali time now: <b data-kigali-time>--:--</b> (CAT)</span></p></div>
<div class="reach-actions">
<a class="ra wa" data-wa="Hello EduSmart Consult, I would like to know more." href="#" rel="noopener"><span class="rai">{ico("whatsapp")}</span><span><b>WhatsApp</b><small>Chat with us</small></span></a>
<a class="ra call" href="tel:+250782368555"><span class="rai">{ico("call")}</span><span><b>Call us</b><small data-phone>+250 782 368 555</small></span></a>
<a class="ra mail" href="contact.html#form"><span class="rai">{ico("mail")}</span><span><b>Send an enquiry</b><small>Use the contact form</small></span></a>
</div></div></div></section>
'''
page("index.html", "EduSmart Consult | Education, research and digital solutions in Rwanda",
     "EduSmart Consult LTD in Kigali: education and training, inclusive education, research, e-learning, software development, data services, ICT support, and the Smart School App product.",
     "index.html", home)

# ---------------------------------------------------------------- DEPARTMENT PAGES
for i, (slug, ic, title, short, intro, items, who) in enumerate(DEPTS):
    li = "".join(f"<li>{x}</li>" for x in items)
    wl = "".join(f'<span class="chip{" g" if j % 2 else ""}">{x}</span>' for j, x in enumerate(who))
    others = "".join(f'<a href="{d[0]}.html">{d[2]}</a>' for d in DEPTS if d[0] != slug)
    extra = ""
    if slug == "elearning":
        extra = f'''<section class="section sky"><div class="container"><div class="section-head"><div><div class="kicker">Our e-learning products</div><h2>Ready to use today</h2></div></div>
<div class="grid g2"><a class="card prod-card" href="smart-school-app.html" style="text-decoration:none"><img class="lg" src="assets/ssa-logo-96.png" alt="Smart School App logo" width="88" height="88"><div><h3>Smart School App</h3><p>Offline books, exams, marking and reports for Primary 1 to 6.</p></div></a>
<a class="card prod-card" href="smart-school-cloud.html" style="text-decoration:none">{ico("wifi")}<div><h3>Smart School Cloud</h3><p>Browser access and device sync for schools that want it.</p></div></a></div></div></section>'''
    if slug == "software-development":
        extra = f'''<section class="section sky"><div class="container"><div class="section-head"><div><div class="kicker">Our own software</div><h2>Built and maintained in house</h2></div></div>
<div class="grid g2"><a class="card prod-card" href="smart-school-app.html" style="text-decoration:none"><img class="lg" src="assets/ssa-logo-96.png" alt="Smart School App logo" width="88" height="88"><div><h3>Smart School App</h3><p>A Windows and Android education suite with the full primary curriculum.</p></div></a>
<a class="card prod-card" href="smart-school-cloud.html" style="text-decoration:none">{ico("wifi")}<div><h3>Smart School Cloud</h3><p>A cloud service for sync, a browser version and school administration.</p></div></a></div></div></section>'''
    body = hero_page("Departments / " + title, title, short) + f'''
<section class="section"><div class="container split" style="align-items:start">
<div><div class="kicker">What this department does</div><h2>{title}</h2><p>{intro}</p>
<h3 style="margin-top:1.4rem">Services</h3><ul class="checklist">{li}</ul>
<p style="margin-top:1.4rem"><a class="btn btn-primary" href="contact.html?service={title.replace(" ", "%20")}#form">Request this service</a></p></div>
<div><div class="card gold"><h3>Who we work with</h3><div class="chip-row" style="margin-top:.8rem">{wl}</div></div>
<div class="card" style="margin-top:1rem"><h3>How an engagement runs</h3><p>We start with a short call to understand the need, send a written scope and quote, deliver in stages with review points, and finish with handover, training and support.</p></div></div>
</div></section>
{extra}
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">More from EduSmart Consult</div><h2>Other departments</h2></div></div>
<div class="chip-row">{others}</div></div></section>'''.replace('<div class="chip-row">' + others, '<div class="chip-row dept-links">' + others)
    page(slug + ".html", f"{title} | EduSmart Consult", short + " " + intro[:110], "dept", body)

# ---------------------------------------------------------------- SMART SCHOOL APP
app = f'''
<section class="page-hero"><div class="container split" style="align-items:center">
<div><div class="crumbs"><a href="index.html">Home</a> / Products / Smart School App</div>
<div class="prod-head"><img src="assets/ssa-logo-96.png" alt="Smart School App logo" width="84" height="84"><div><span class="badge">A product of EduSmart Consult</span><h1 style="margin:.3rem 0 0">Smart School App</h1></div></div>
<p>An offline learning and school management suite for Primary 1 to Primary 6. Learners get the full curriculum library, practice and past papers. Teachers get lesson plans, timetables, marking and reports. It runs on Windows computers and Android phones with no internet connection.</p>
<div class="actions"><a class="btn btn-gold" href="#download">Download</a><a class="btn btn-sky" href="smart-school-cloud.html">Online access and sync</a></div>
<p style="font-size:.9rem;color:#cfe3ff;margin:0">Version <span data-version></span> &nbsp;|&nbsp; Windows 10 or 11 and Android 7 or newer</p></div>
<div>{win("assets/app-reader.webp", "Smart School App reading a lesson with the teaching guide beside the pupil book page", w=1600, h=903)}</div>
</div></section>

<section class="section"><div class="container">
<div class="stats">
<div class="tile navy"><b>P1 to P6</b><span>Complete primary cycle</span></div>
<div class="tile sky"><b>62</b><span>P6 national exam papers, 2010 to 2025</span></div>
<div class="tile gold"><b>3</b><span>Lesson plan languages</span></div>
<div class="tile navy"><b>2</b><span>Platforms: Windows and Android</span></div>
</div></div></section>

<section class="section sky" id="screens"><div class="container">
<div class="section-head"><div><div class="kicker">Screenshots</div><h2>See it on Windows</h2></div><p>Click any screen to enlarge it. These are real screens from the Windows version.</p></div>
<div class="gallery">
{fig("assets/app-overview.webp", "Teacher overview", "Classes, progress and quick actions in one place.")}
{fig("assets/app-learner.webp", "Learner home", "A simple start screen with subjects, practice and progress.")}
{fig("assets/app-subject.webp", "Subject library", "Every unit and lesson for a subject, ready to open.")}
{fig("assets/app-exam.webp", "National exam papers", "Past papers with the question pages, timer and review.")}
{fig("assets/app-lessonplan.webp", "Lesson plan generator", "The official REB template filled from the scheme of work.")}
{fig("assets/app-timetable.webp", "Timetable generator", "Conflict free timetables with double periods and preferences.")}
{fig("assets/app-gradebook.webp", "Gradebook", "Scores from quizzes, exams and homework in one grid.")}
{fig("assets/app-answerkeys.webp", "Answer keys", "Teachers review and confirm the model answers.")}
{fig("assets/app-parents.webp", "Parent reports", "Printable reports with an offline QR code.")}
</div></div></section>

<section class="section"><div class="container">
<div class="section-head"><div><div class="kicker">On Android</div><h2>The same app on every phone</h2></div><p>Same accounts, same content and the same tools. A learner can continue at home on the family phone.</p></div>
<div class="phones">
{phone("assets/phone-learner.webp", "Learner home", "Subjects and practice")}
{phone("assets/phone-subject.webp", "Subject library", "Units and lessons")}
{phone("assets/phone-teacher.webp", "Teacher home", "Classes and tools")}
{phone("assets/phone-gradebook.webp", "Gradebook", "Scores on the go")}
</div></div></section>

<section class="section soft" id="features"><div class="container">
<div class="section-head"><div><div class="kicker">Features</div><h2>Built for three kinds of user</h2></div>
<p>Each person signs in to their own profile and sees only the tools that fit their role. Access can be limited by class and subject.</p></div>
<div data-tabs>
<div class="tabs" role="tablist">
<button class="tab" role="tab" aria-selected="true" aria-controls="p-learn">Learners</button>
<button class="tab" role="tab" aria-selected="false" aria-controls="p-teach">Teachers</button>
<button class="tab" role="tab" aria-selected="false" aria-controls="p-mgr">School managers</button>
</div>
<div class="panel" id="p-learn"><div class="grid g3">
<div class="card">{ico("book")}<h3>Pupil books</h3><p>Every class and subject, page by page, with read aloud, zoom and three text sizes.</p></div>
<div class="card">{ico("target")}<h3>Practice that adapts</h3><p>Smart Practice focuses on the topics a learner keeps missing and brings old questions back at the right time.</p></div>
<div class="card">{ico("edit")}<h3>Quizzes and mock tests</h3><p>Timed tests, subject quizzes and learning games with instant feedback.</p></div>
<div class="card">{ico("file")}<h3>P6 national exam papers</h3><p>Sixty two past papers from 2010 to 2025 with a timer and a review of every answer.</p></div>
<div class="card">{ico("heart")}<h3>Made for every learner</h3><p>Colour themes, larger text, read aloud and keyboard friendly layouts.</p></div>
<div class="card">{ico("device")}<h3>Works at home</h3><p>The same app runs on Android, with the same account and progress.</p></div>
</div></div>
<div class="panel" id="p-teach" hidden><div class="grid g3">
<div class="card">{ico("edit")}<h3>Lesson plan generator</h3><p>The official REB template from the real scheme of work, in English, French and Kinyarwanda.</p></div>
<div class="card">{ico("file")}<h3>Marking queue</h3><p>Written answers wait for marking with the model answer beside them and optional voice comments.</p></div>
<div class="card">{ico("chart")}<h3>Gradebook and homework</h3><p>Set homework from any unit or quiz and follow who has finished.</p></div>
<div class="card">{ico("print")}<h3>Worksheets and class tests</h3><p>Print a worksheet for any lesson or build a class test from the question bank.</p></div>
<div class="card">{ico("users")}<h3>Learner enrolment</h3><p>Paste a class list to enrol everyone at once and print login cards.</p></div>
<div class="card">{ico("calendar")}<h3>Pacing calendar</h3><p>Plan the term against the official calendar and print a substitute packet.</p></div>
</div></div>
<div class="panel" id="p-mgr" hidden><div class="grid g3">
<div class="card">{ico("calendar")}<h3>Whole school timetable</h3><p>A conflict free timetable for all classes. No teacher is in two places at once.</p></div>
<div class="card">{ico("chart")}<h3>Insights dashboard</h3><p>Progress, hardest questions and weak topics across the school, with a printable impact report.</p></div>
<div class="card">{ico("file")}<h3>Reports and certificates</h3><p>Report cards, result slips, certificates and parent reports with QR codes.</p></div>
<div class="card">{ico("users")}<h3>Staff roles and access</h3><p>Four profiles, with each teacher limited to their own classes and subjects.</p></div>
<div class="card">{ico("shield")}<h3>Backup and recovery</h3><p>Automatic copies, scheduled USB backups and a status panel for stale backups.</p></div>
<div class="card">{ico("wifi")}<h3>Device sync</h3><p>Combine records from several devices over school Wi-Fi, or online with Smart School Cloud.</p></div>
</div></div>
</div></div></section>

<section class="section"><div class="container split">
<div><div class="kicker">Timetable generator</div><h2>Timetables that respect how a school really runs</h2>
<p>The generator places every lesson for every class in one pass, then lets you adjust by hand. Lessons you lock stay in place when you regenerate.</p>
<ul class="checklist">
<li>Teachers are never double booked across classes</li>
<li>Days off and a daily lesson limit for each teacher</li>
<li>Morning or afternoon preference for each teacher</li>
<li>Double periods for PE, Art or science practicals</li>
<li>Drag and drop editing, undo, print by class or teacher, export to Excel</li>
</ul></div>
<div>{win("assets/app-timetable.webp", "Timetable generator screen")}</div>
</div></section>

<section class="section sunny"><div class="container">
<div class="section-head"><div><div class="kicker">Exams and answer keys</div><h2>Automatic marking, with teacher control</h2></div>
<p>Written answers on past papers are marked against an answer key. Teachers stay in charge of what the key says.</p></div>
<div class="grid g2">
<div class="card"><h3>How it works</h3><p>Each question has a model answer and a marking style: exact match, key words or teacher only. Learners see their mark, the model answer and half marks where earned.</p></div>
<div class="card"><h3>Answer keys are drafts until confirmed</h3><p>The answers shipped with the app were prepared as drafts. A teacher reviews each one on the Answer keys screen, edits it if needed and confirms it. Please review keys before relying on them for grades.</p></div>
</div></div></section>

<section class="section soft" id="download"><div class="container">
<div class="section-head"><div><div class="kicker">Download</div><h2>Get Smart School App</h2></div>
<p>The full library is bundled inside the app, so files are large (about 2 GB each). Download once, then copy to other devices with a flash drive.</p></div>
<div class="grid g3">
<div class="card dl">{ico("device")}<h3>Windows</h3><div class="meta">Version <span data-version></span> | Installer | about 2 GB</div><p>Windows 10 and 11, 64 bit. Best for the teacher's computer and the school lab.</p>
<a class="btn btn-primary" data-download="windows" href="#"><span data-label>Download for Windows</span></a></div>
<div class="card dl">{ico("phone")}<h3>Android</h3><div class="meta">Version <span data-version></span> | APK | about 2 GB</div><p>Android 7.0 or newer. Copy the file to the phone and open it. Allow installs if asked.</p>
<a class="btn btn-primary" data-download="android" href="#"><span data-label>Download for Android</span></a></div>
<div class="card dl">{ico("globe")}<h3>Online</h3><div class="meta">Browser version</div><p>Nothing to install. Open the app in a browser through Smart School Cloud.</p>
<a class="btn btn-sky" data-download="webApp" href="#"><span data-label>Open online version</span></a></div>
</div>
<div class="notice" style="margin-top:1.4rem"><strong>Licences.</strong> Smart School App is licensed per school. After installing, the school enters an activation code that we issue. <a href="contact.html?topic=Smart%20School%20App%20licence#form">Request a licence or a quote</a>.</div>
<div class="scroll-x" style="margin-top:2rem"><table class="cmp">
<tr><th>Requirement</th><th>Windows</th><th>Android</th></tr>
<tr><td>System</td><td>Windows 10 or 11, 64 bit</td><td>Android 7.0 or newer</td></tr>
<tr><td>Free storage</td><td>At least 4 GB</td><td>At least 4 GB</td></tr>
<tr><td>Internet</td><td>Not needed after installation</td><td>Not needed after installation</td></tr></table></div>
</div></section>

<section class="section" id="faq"><div class="container" style="max-width:820px">
<div class="kicker">Questions</div><h2>Frequently asked questions</h2>
<details><summary>Does it need the internet?</summary><p>No. After installation everything works offline. The internet is only used for updates or if the school chooses online sync.</p></details>
<details><summary>Where is learner data stored?</summary><p>On the school's own devices. Nothing is sent online unless the school turns on Internet sync. Backups can go to a USB drive or folder.</p></details>
<details><summary>Can several teachers and computers share records?</summary><p>Yes, on the same Wi-Fi or hotspot, or online through Smart School Cloud. The merge keeps work from every device.</p></details>
<details><summary>Which classes and subjects are included?</summary><p>Primary 1 to Primary 6 with Mathematics, English, Kinyarwanda, French, Social Studies, Science and Elementary Technology, and Creative Arts where the curriculum includes them.</p></details>
<details><summary>Are the exam answers official?</summary><p>No. The answer keys are prepared drafts. Teachers review and confirm them, and every answer can be edited.</p></details>
<details><summary>Can you train our teachers?</summary><p>Yes. <a href="contact.html?topic=Smart%20School%20App%20training#form">Ask about training</a>.</p></details>
</div></section>
'''
page("smart-school-app.html", "Smart School App | Offline Primary 1 to 6 learning suite by EduSmart Consult",
     "Smart School App: REB pupil books, practice, P6 exams, lesson plans, timetables, marking and reports on Windows and Android, made by EduSmart Consult.",
     "products", app, og="assets/og-image.png")

# ---------------------------------------------------------------- SMART SCHOOL CLOUD
cloud = f'''
<section class="page-hero"><div class="container split" style="align-items:center">
<div><div class="crumbs"><a href="index.html">Home</a> / Products / Smart School Cloud</div>
<div class="prod-head"><img src="assets/ssa-logo-96.png" alt="Smart School App logo" width="84" height="84"><div><span class="badge">Online companion</span><h1 style="margin:.3rem 0 0">Smart School Cloud</h1></div></div>
<p>The online side of Smart School App. Open the app in any browser, and keep records in step across Windows computers and Android phones whenever there is a connection. Offline use never stops working.</p>
<div class="actions"><a class="btn btn-gold" data-cloud="app" href="#">Open the online app</a><a class="btn btn-sky" href="#connect">Connect my devices</a></div></div>
<div>{win("assets/app-cloudsync.webp", "Internet sync settings in Smart School App")}</div>
</div></section>

<section class="section"><div class="container">
<div class="section-head"><div><div class="kicker">What it does</div><h2>Three things, one school account</h2></div><p>The cloud is optional. A school can use the apps fully offline and add the cloud when it needs it.</p></div>
<div class="grid g3">
<div class="card dept c1">{ico("globe")}<h3>Use it online</h3><p>Sign in from a browser on any computer or phone, with no installation. Teachers and learners see the content their role allows.</p></div>
<div class="card dept c2">{ico("wifi")}<h3>Sync every device</h3><p>Records from Windows and Android merge into one school record. Work done on any device is kept, and nothing is overwritten by mistake.</p></div>
<div class="card dept c3">{ico("target")}<h3>Send work to classes</h3><p>Publish assignments online and have them appear in every connected device of the school.</p></div>
</div></div></section>


<section class="section" id="online"><div class="container">
<div class="section-head"><div><div class="kicker">Online app</div><h2>Smart School App, inside your browser</h2></div><p>This is how Smart School App looks online. Press the button to open the real app in its own tab and sign in with your school code.</p></div>
<div class="win embed"><div class="win-bar"><img src="assets/ssa-logo-96.png" alt=""><span class="t">Smart School App | Online</span>
<span class="c"><i><svg viewBox="0 0 10 10"><path d="M0 5h10"/></svg></i><i><svg viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9"/></svg></i><i><svg viewBox="0 0 10 10"><path d="M0 0l10 10M10 0L0 10"/></svg></i></span></div>
<div class="embed-body"><iframe data-cloud-frame title="Smart School App online" loading="lazy" hidden></iframe>
<div class="embed-fallback" data-cloud-fallback><img class="shot" src="assets/app-overview.webp" alt="Smart School App online preview" width="1440" height="900" loading="lazy">
<div class="embed-note" data-cloud-note><b>Online access opens soon for your school.</b> <a href="contact.html?topic=Smart%20School%20Cloud%20access#form">Request access</a></div></div></div></div>
<p style="margin-top:1rem"><a class="btn btn-gold" data-cloud="app" href="#">Open the online app</a></p>
</div></section>

<section class="section sky" id="connect"><div class="container">
<div class="section-head"><div><div class="kicker">Connect your devices</div><h2>Four steps</h2></div><p>The Settings screen in both apps has an Internet sync section for this.</p></div>
<div class="steps">
<div class="step"><h3>Get an account</h3><p>We create a school account and send the school API key. <a href="contact.html?topic=Smart%20School%20Cloud%20access#form">Request access</a>.</p></div>
<div class="step"><h3>Open Settings</h3><p>In Smart School App on each device, open Settings and find Internet sync (optional).</p></div>
<div class="step"><h3>Enter the details</h3><p>Type the server address and the school API key, then save.</p></div>
<div class="step"><h3>Sync</h3><p>Press Sync now. Do this on every computer and phone that should share records.</p></div>
</div>
<div style="margin-top:2rem">{win("assets/app-devicesync.webp", "Device sync screen in Smart School App")}</div>
</div></section>

<section class="section"><div class="container split">
<div><div class="kicker">Data and safety</div><h2>Your school stays in control</h2>
<ul class="checklist">
<li>Sync is optional and off until a manager turns it on</li>
<li>Each school has its own key, and only that school's records are reachable with it</li>
<li>Roles limit what teachers and learners can see online</li>
<li>Local backups keep working with or without the cloud</li>
<li>Data is merged, not replaced, so an old device cannot erase newer work</li>
</ul></div>
<div class="card gold"><h3>Rollout status</h3><p>Smart School Cloud is being rolled out school by school. To use it, request access and we will set up your school account, confirm the server address and help you connect your first devices.</p>
<p style="margin-top:1rem"><a class="btn btn-primary" href="contact.html?topic=Smart%20School%20Cloud%20access#form">Request access</a></p></div>
</div></section>

<section class="section soft"><div class="container" style="max-width:820px">
<div class="kicker">Questions</div><h2>About the cloud</h2>
<details><summary>Do we need the cloud to use Smart School App?</summary><p>No. Every feature works offline. The cloud only adds browser access and syncing between devices.</p></details>
<details><summary>What happens if the internet drops during sync?</summary><p>Nothing is lost. The device keeps its local records and syncs again next time.</p></details>
<details><summary>Can Windows and Android share the same records?</summary><p>Yes. Both apps use the same sync, so a teacher can mark on a phone and see it on the school computer.</p></details>
<details><summary>Who can see our learners' data?</summary><p>Only people signed in to your school with a role that allows it. See the <a href="privacy.html">privacy page</a>.</p></details>
</div></section>
'''
page("smart-school-cloud.html", "Smart School Cloud | Online access and device sync",
     "Use Smart School App in a browser and sync records between Windows and Android devices with Smart School Cloud from EduSmart Consult.",
     "products", cloud)

# ---------------------------------------------------------------- PRODUCTS PAGE
chips = '<button class="chip on" data-filter="all">All products</button>' + "".join(f'<button class="chip" data-filter="{c}">{c}</button>' for c in CATS)
featured = f'''<section class="section sky"><div class="container"><div class="section-head"><div><div class="kicker">Featured</div><h2>Smart School App and Smart School Cloud</h2></div><p>Our flagship education products have their own pages with screenshots and downloads.</p></div>
<div class="pgrid">{prod_card(PRODUCTS[0])}{prod_card(PRODUCTS[1])}</div></div></section>'''
products = hero_page("Products", "Our products", "Software built by EduSmart Consult for schools, families, savings groups and businesses. Most work fully offline.") + featured + f'''
<section class="section" id="all"><div class="container"><div class="chip-row filters" role="group" aria-label="Filter products">{chips}</div>
<div class="pgrid">{"".join(prod_card(p) for p in PRODUCTS[2:])}</div>
<div class="notice" style="margin-top:2rem">Interested in one of these products, a licence, or a version customised for your organisation? <a href="contact.html#form">Contact us</a> and we will reply within two working days.</div></div></section>'''
page("products.html", "Products | EduSmart Consult", "All software built by EduSmart Consult: Smart School App, Smart School Cloud, learning apps, savings, budgeting, jobs, road code and more.", "products", products)

# ---------------------------------------------------------------- ABOUT
about = hero_page("About", "About EduSmart Consult", "A Rwandan company working where education, research and technology meet.") + f'''
<section class="section"><div class="container split">
<div><div class="kicker">Who we are</div><h2>Our purpose</h2>
<p>EduSmart Consult LTD is a private company limited by shares, registered in Rwanda. Our main activity is education, supported by consulting, research, data and computer systems services.</p>
<p>Our tagline says what we work toward: Better Research, Stronger Education, Brighter Futures.</p>
<p>Smart School App is one of the products that came out of this work. It answers a simple question: what would a Rwandan primary school need if it had no reliable internet?</p></div>
<div class="card"><h3>Company details</h3>
<table class="cmp">
<tr><td>Company</td><td>EduSmart Consult LTD</td></tr>
<tr><td>Type</td><td>Private company limited by shares</td></tr>
<tr><td>Managing Director</td><td>Alexis HAGENIMANA</td></tr>
<tr><td>Registered office</td><td>Itetero, Nyagatovu, Kimironko, Gasabo, Kigali, Rwanda</td></tr>
<tr><td>Phone</td><td><a data-phone href="#">+250 782 368 555</a></td></tr>
<tr><td>Email</td><td><a data-email href="#">email</a></td></tr></table></div>
</div></section>
<section class="section sky"><div class="container">
<div class="section-head"><div><div class="kicker">What guides us</div><h2>Principles we work by</h2></div><p>These shape every product and project.</p></div>
<div class="grid g3">
<div class="card dept c1">{ico("shield")}<h3>Data belongs to the client</h3><p>Records stay with the school or organisation. Online features are optional and explained plainly.</p></div>
<div class="card dept c2">{ico("wifi")}<h3>Design for low connectivity</h3><p>If it needs the internet to teach a lesson, it is not finished. Our tools work offline first.</p></div>
<div class="card dept c3">{ico("users")}<h3>People stay in control</h3><p>Software should save time, not replace judgement. Every automatic result can be reviewed and changed.</p></div>
</div></div></section>'''
page("about.html", "About | EduSmart Consult LTD",
     "EduSmart Consult LTD is a Rwandan company providing education, research, e-learning, software and ICT services, and the maker of Smart School App.",
     "about.html", about)

# ---------------------------------------------------------------- CONTACT
svc_opts = "".join(f"<option>{d[2]}</option>" for d in DEPTS)
contact = hero_page("Contact", "Contact us", "Ask about any of our services, request a Smart School App demo or a licence, or discuss a project. We reply within two working days.") + f'''
<section class="section" id="form"><div class="container split" style="align-items:start">
<form class="form" id="contactForm" novalidate>
<div class="row"><label>Full name<input name="name" required autocomplete="name"></label><label>Organisation or school<input name="org" autocomplete="organization"></label></div>
<div class="row"><label>Email<input type="email" name="email" required autocomplete="email"></label><label>Phone or WhatsApp<input name="phone" autocomplete="tel" placeholder="+250"></label></div>
<div class="row"><label>Service<select name="service"><option>Smart School App</option><option>Smart School Cloud</option>{svc_opts}<option>Other</option></select></label>
<label>Subject<input name="subject" placeholder="For example: demo request"></label></div>
<label>Message<textarea name="message" rows="6" required placeholder="Tell us about your school or project, and what you need."></textarea></label>
<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<div><button class="btn btn-primary" type="submit">Send message</button></div>
<div class="msg" id="formMsg" role="status"></div>
<p class="form-note">We use your details only to reply to this enquiry.</p>
</form>
<div class="cinfo">
<div class="cbox c1"><span class="ico">{ico("call")}</span><div><h3>Phone and WhatsApp</h3><p><span data-phone>+250 782 368 555</span></p>
<div class="cact"><a class="btn btn-primary btn-sm" href="tel:+250782368555">Call now</a><a class="btn btn-wa btn-sm" data-wa="Hello EduSmart Consult" href="#" rel="noopener">WhatsApp</a></div></div></div>
<div class="cbox c2"><span class="ico c2">{ico("mail")}</span><div><h3>Email</h3><p><span data-email>email</span></p>
<div class="cact"><a class="btn btn-sky btn-sm" data-email-link href="#">Write an email</a></div></div></div>
<div class="cbox c3"><span class="ico c3">{ico("pin")}</span><div><h3>Office</h3><p>Itetero, Nyagatovu, Kimironko<br>Gasabo, Kigali, Rwanda</p>
<div class="cact"><a class="btn btn-outline btn-sm" href="https://www.google.com/maps/search/?api=1&query=Itetero+Nyagatovu+Kimironko+Gasabo+Kigali+Rwanda" target="_blank" rel="noopener">Open in Maps</a></div></div></div>
<div class="cnote">{ico("clock")}<span>We reply to every enquiry within two working days.</span></div>
</div></div></section>'''
page("contact.html", "Contact | EduSmart Consult",
     "Contact EduSmart Consult in Kigali about education, research, e-learning, software, data and ICT services or Smart School App.",
     "contact.html", contact)

privacy = hero_page("Privacy", "Privacy", "How this website and our products handle your information.") + '''
<section class="section"><div class="container" style="max-width:780px">
<h3>Information you send us</h3><p>When you use the contact form we receive the details you type: name, organisation, email, phone and message. We use them only to reply and follow up on a project you ask about. We do not sell or share them.</p>
<h3>Cookies and tracking</h3><p>This website does not use advertising cookies. If analytics are added later, this page will be updated.</p>
<h3>Smart School App</h3><p>The application stores learner and school records on the devices where it is installed. Nothing is uploaded unless a school chooses to use an online feature.</p>
<h3>Smart School Cloud</h3><p>If a school turns on Internet sync, its records are sent to the school's own account on the cloud server, protected by the school's key. Only signed in users of that school with a suitable role can see them. A school can stop syncing at any time and ask us to delete its cloud records.</p>
<h3>Contact</h3><p>For any question about privacy, write to <a data-email href="#">email</a>.</p>
</div></section>'''
page("privacy.html", "Privacy | EduSmart Consult", "Privacy information for the EduSmart Consult website, Smart School App and Smart School Cloud.", "", privacy)

nf = hero_page("Page not found", "Page not found", "The page you asked for is not here.") + '<section class="section"><div class="container"><a class="btn btn-primary" href="index.html">Go to the home page</a></div></section>'
page("404.html", "Page not found | EduSmart Consult", "Page not found.", "", nf)

exec(open(os.path.join(ROOT, "build2.py"), encoding="utf-8").read())
exec(open(os.path.join(ROOT, "build3.py"), encoding="utf-8").read())
pages = ["", "products.html", "smart-school-app.html", "smart-school-cloud.html", "about.html", "contact.html", "privacy.html"] + [d[0] + ".html" for d in DEPTS] + EXTRA_PAGES
with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            "".join(f"<url><loc>{SITE_URL}/{p}</loc><lastmod>{TODAY}</lastmod></url>\n" for p in pages) + "</urlset>\n")
with open(os.path.join(ROOT, "robots.txt"), "w") as f:
    f.write(f"User-agent: *\nAllow: /\nDisallow: /editor.html\nSitemap: {SITE_URL}/sitemap.xml\n")
MANIFEST = {"name": "EduSmart Consult", "short_name": "EduSmart", "description": "Education, research and digital solutions in Rwanda", "start_url": "./index.html", "scope": "./", "display": "standalone",
            "background_color": "#ffffff", "theme_color": "#06307a", "lang": "en",
            "icons": [{"src": "assets/emblem-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "assets/emblem-512.png", "sizes": "512x512", "type": "image/png"}, {"src": "assets/emblem-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}],
            "shortcuts": [{"name": "Request a demo", "url": "request.html"}, {"name": "Smart School App", "url": "smart-school-app.html"}, {"name": "Products", "url": "products.html"}]}
with open(os.path.join(ROOT, "site.webmanifest"), "w") as f:
    json.dump(MANIFEST, f, indent=1)
print("built", len(pages) + 1, "pages")
