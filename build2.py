# Second part of the site generator: lead form, downloads, news, tour, pricing, team, partners, stories, search, editor.
# Executed by build.py (shares its names). Edit copy here, content in the content/ folder, then run: python build.py
import html as _H
esc = _H.escape
EXTRA_PAGES = []

def add(fname, title, desc, active, body, noindex=False, **kw):
    page(fname, title, desc, active, body, noindex=noindex, **kw)
    if not noindex:
        EXTRA_PAGES.append(fname)

def ld_json(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + '</script>'

def ld_bc(items):
    return ld_json({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE_URL + "/" + u} for i, (n, u) in enumerate(items)]})

def fmt_date(d):
    y, m, dd = d.split("-")
    return f"{int(dd)} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][int(m)-1]} {y}"

# ============================================================ REQUEST A DEMO OR QUOTE
SERVICES = [("demo", "Smart School App demo or trial"), ("cloud", "Smart School Cloud access"), ("training", "Training for teachers or staff"),
            ("education", "Education and training programmes"), ("inclusive", "Inclusive education support"), ("research", "Research and consulting"),
            ("elearning", "E-learning"), ("software", "Web or software development"), ("data", "Data and information services"),
            ("ict", "ICT and computer systems support"), ("other", "Something else")]
ROLES = ["School leader", "Teacher", "Education project or NGO", "Government or local office", "Business", "Parent or learner", "Other"]

def chips(name, items, kind="checkbox"):
    return "".join(f'<label class="choice"><input type="{kind}" name="{name}" value="{esc(v if isinstance(v, str) else v[1])}"><span>{esc(v if isinstance(v, str) else v[1])}</span></label>' for v in items)

request_body = hero_page("Request a demo or quote", "Request a demo or quote", "Answer a few short questions so we can prepare the right answer. It takes about two minutes and we reply within two working days.") + f'''
<section class="section"><div class="container lead-wrap">
<form class="lead" id="leadForm" data-lead novalidate>
<div class="lead-steps" aria-hidden="true"><span class="on">1 About you</span><span>2 What you need</span><span>3 Your school</span><span>4 Send</span></div>
<fieldset><legend><b>1</b> About you</legend>
<div class="row"><label>Your name<input name="name" required autocomplete="name"></label><label>Organisation or school<input name="organisation" required autocomplete="organization"></label></div>
<div class="row"><label>Email<input type="email" name="email" required autocomplete="email"></label><label>Phone or WhatsApp<input name="phone" autocomplete="tel" placeholder="+250"></label></div>
<p class="lbl">I am a</p><div class="choices">{chips("role", ROLES, "radio")}</div></fieldset>
<fieldset><legend><b>2</b> What you need</legend><p class="lbl">Choose everything that applies</p><div class="choices">{chips("needs", SERVICES)}</div></fieldset>
<fieldset><legend><b>3</b> Your school <small>(skip if it does not apply)</small></legend>
<div class="row"><label>Number of learners<select name="learners"><option value="">Not sure</option><option>Under 100</option><option>100 to 300</option><option>300 to 600</option><option>600 to 1000</option><option>More than 1000</option></select></label>
<label>When do you need it<select name="timeline"><option value="">Not sure</option><option>As soon as possible</option><option>This term</option><option>Next term</option><option>Just exploring</option></select></label></div>
<p class="lbl">Classes that would use it</p><div class="choices">{chips("classes", ["P1", "P2", "P3", "P4", "P5", "P6"])}</div>
<p class="lbl">Devices you have</p><div class="choices">{chips("devices", ["Windows computers", "Android phones or tablets", "No devices yet"])}</div></fieldset>
<fieldset><legend><b>4</b> Anything else</legend><label>Tell us more<textarea name="message" rows="5" placeholder="What would you like to achieve? Any questions?"></textarea></label>
<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
<label class="check"><input type="checkbox" name="consent" required> <span>I agree that EduSmart Consult may use these details to reply to my request. <a href="privacy.html">Privacy</a></span></label>
<div class="lead-actions"><button class="btn btn-primary" type="submit">Send my request</button><span class="form-note">We reply within two working days.</span></div>
<div class="msg" id="leadMsg" role="status"></div></fieldset>
</form>
<aside class="lead-side">
<div class="card gold"><h3>What happens next</h3><ol class="next"><li>We read your request the same day.</li><li>We reply within two working days with questions or a suggestion.</li><li>For Smart School App we arrange a short demo, online or at your school.</li><li>If you want to go ahead, you get a written quote.</li></ol></div>
<div class="card"><h3>Prefer to talk?</h3><p>Call <a data-phone href="#">+250 782 368 555</a> or message us on WhatsApp.</p><p><a class="btn btn-wa btn-sm" data-wa="Hello EduSmart Consult, I would like a demo." href="#" rel="noopener">WhatsApp us</a></p></div>
<div class="card"><h3>Nothing to install</h3><p>To see Smart School App first, take the <a href="tour.html">screen by screen tour</a>.</p></div>
</aside>
<div class="lead-done hidden" id="leadDone"><div class="ok-ring">{ico("mail")}</div><h2>Thank you</h2><p>Your request is on its way to our team. We will reply within two working days.</p><p><a class="btn btn-primary" href="index.html">Back to home</a> <a class="btn btn-outline" href="tour.html">Take the tour</a></p></div>
</div></section>'''
add("request.html", "Request a demo or quote | EduSmart Consult", "Tell us what you need and we will prepare a demo or a written quote for your school or organisation within two working days.", "request.html", request_body,
    ld=ld_bc([("Home", ""), ("Request a demo or quote", "request.html")]))

# ============================================================ DOWNLOADS
notes = [
 ("2.23.0", "Current version", [
  "Join your school's cloud with a short code instead of typing a server address and a long key",
  "Each device gets its own access, and a school manager can remove a device at any time",
  "Wrong clocks are corrected automatically, so a phone with the wrong date cannot overwrite newer work",
  "Deleted staff profiles now stay deleted on every device",
  "A clear sync status with plain language errors, automatic retry and licence or update notices",
  "Open source licences are listed under What's new"]),
 ("2.22.0", "Previous version", [
  "Answer keys for every past exam question, with a Teacher screen to review, edit and confirm each answer",
  "Written answers on past papers are marked automatically against the answer key",
  "Timetable generator: double periods and morning or afternoon preferences for teachers",
  "Lesson plan generator: whole unit generation and minutes for each stage",
  "Drawing tasks now come with a teacher rubric and printable drawing boxes",
  "Android now has the same Answer keys screen and exam marking as Windows"])]
downloads_body = hero_page("Downloads", "Download Smart School App", "Get the app for Windows or Android, or use it online in a browser. The full library is inside the app, so the files are large. Download once, then copy to other devices.") + f'''
<section class="section"><div class="container">
<div class="grid g3">
<div class="card dl">{ico("device")}<h3>Windows</h3><div class="meta">Version <span data-version></span> | Installer | about 2 GB</div><p>Windows 10 or 11, 64 bit. Best for the head teacher, the school office and the computer lab.</p><a class="btn btn-primary" data-download="windows" href="#"><span data-label>Download for Windows</span></a></div>
<div class="card dl">{ico("phone")}<h3>Android</h3><div class="meta">Version <span data-version></span> | APK | about 2 GB</div><p>Android 7.0 or newer. Best for teachers on the move and learners at home.</p><a class="btn btn-primary" data-download="android" href="#"><span data-label>Download for Android</span></a></div>
<div class="card dl">{ico("cloud")}<h3>Online</h3><div class="meta">Browser | nothing to install</div><p>Open the app in any browser through Smart School Cloud with your school code.</p><a class="btn btn-sky" data-download="webApp" href="#"><span data-label>Open online version</span></a></div>
</div>
<div class="notice" style="margin-top:1.2rem"><strong>Brochures.</strong> Guides you can share with your school board or partners: <a href="assets/brochures/Smart-School-App-guide.pdf" download>Smart School App guide</a>, <a href="assets/brochures/Smart-School-Cloud-guide.pdf" download>Smart School Cloud guide</a>, <a href="assets/brochures/Amategeko-Umuhanda-guide.pdf" download>Amategeko y'Umuhanda guide</a> and the <a href="assets/brochures/EduSmart-Consult-brochure.pdf" download>EduSmart Consult brochure</a> (all PDF).</div>
<div class="notice" style="margin-top:1.2rem"><strong>Licences.</strong> Smart School App is licensed per school. After installing, the school enters an activation code that we issue. <a href="request.html">Request a licence or a quote</a>.</div></div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">Install</div><h2>Three simple steps</h2></div><p>Follow the steps for your device. If a step does not work, call us or message us on WhatsApp.</p></div>
<div class="grid g2"><div class="card"><h3>On Windows</h3><ol class="next"><li>Download the installer from this page and open it.</li><li>If Windows shows a blue "protected your PC" box, choose <b>More info</b>, then <b>Run anyway</b>. This happens with new software. Only do this for a file you downloaded from this page.</li><li>Follow the installer, open Smart School App and enter your school's activation code.</li></ol></div>
<div class="card"><h3>On Android</h3><ol class="next"><li>Download the APK on the phone, or copy it from a computer with a flash drive or cable.</li><li>Open the file. If asked, allow installing from this source in Settings.</li><li>Open Smart School App and enter your school's activation code.</li></ol></div></div></div></section>
<section class="section"><div class="container split">
<div><div class="kicker">Release notes</div><h2>What is new</h2>{"".join(f'<div class="card" style="margin-top:.8rem"><h3>Version {v} <span class="pill-tag">{t}</span></h3><ul class="checklist">' + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul></div>" for v, t, items in notes)}</div>
<div><div class="kicker">Requirements</div><h2>What you need</h2><div class="scroll-x"><table class="cmp"><tr><th></th><th>Windows</th><th>Android</th></tr><tr><td>System</td><td>Windows 10 or 11, 64 bit</td><td>Android 7.0 or newer</td></tr><tr><td>Free storage</td><td>At least 4 GB</td><td>At least 4 GB</td></tr><tr><td>Internet</td><td>Not needed after install</td><td>Not needed after install</td></tr><tr><td>Languages</td><td>English, French, Kinyarwanda</td><td>English, French, Kinyarwanda</td></tr></table></div>
<div class="callout-box" data-sha hidden><b>Verify your download.</b> Checksum (SHA-256): <code data-sha-win></code></div></div>
</div></section>'''
add("downloads.html", "Downloads | Smart School App for Windows and Android", "Download Smart School App for Windows or Android, or use it online. Install steps, requirements and release notes.", "products", downloads_body,
    ld=ld_bc([("Home", ""), ("Downloads", "downloads.html")]))

# ============================================================ NEWS
NEWS = sorted(load_json("news.json", []), key=lambda p: p["date"], reverse=True)

def render_body(blocks):
    out = []
    for b in blocks:
        k = b[0]
        if k == "p": out.append(f"<p>{esc(b[1])}</p>")
        elif k == "h": out.append(f"<h2>{esc(b[1])}</h2>")
        elif k == "ul": out.append("<ul class=\"checklist\">" + "".join(f"<li>{esc(x)}</li>" for x in b[1]) + "</ul>")
        elif k == "ol": out.append("<ol class=\"next\">" + "".join(f"<li>{esc(x)}</li>" for x in b[1]) + "</ol>")
    return "\n".join(out)

def news_card(p):
    return f'''<article class="ncard" data-cat="{esc(p["category"])}" data-text="{esc((p["title"] + " " + p["summary"]).lower())}"><a href="news-{p["slug"]}.html"><span class="ncat">{esc(p["category"])}</span><h3>{esc(p["title"])}</h3><p>{esc(p["summary"])}</p><span class="nmeta">{fmt_date(p["date"])} | Read more</span></a></article>'''

cats = []
for p in NEWS:
    if p["category"] not in cats: cats.append(p["category"])
news_body = hero_page("News and tips", "News and teaching tips", "Product updates, guides for schools and ideas that help teachers and learners.") + f'''
<section class="section"><div class="container">
<div class="toolbar-f"><input id="newsQ" type="search" placeholder="Search articles" aria-label="Search articles"><div class="chip-row" id="newsCats"><button class="chip on" data-ncat="all">All</button>{"".join(f'<button class="chip" data-ncat="{esc(c)}">{esc(c)}</button>' for c in cats)}</div></div>
<div class="ngrid">{"".join(news_card(p) for p in NEWS)}</div><p class="empty-note hidden" id="newsEmpty">No articles match. Try a different word.</p>
<p style="margin-top:1.4rem"><a class="btn btn-outline btn-sm" href="feed.xml">RSS feed</a></p></div></section>'''
add("news.html", "News and teaching tips | EduSmart Consult", "Product updates, guides for schools and teaching tips from EduSmart Consult.", "resources", news_body,
    ld=ld_bc([("Home", ""), ("News and tips", "news.html")]))

for i, p in enumerate(NEWS):
    url = f"{SITE_URL}/news-{p['slug']}.html"
    others = [q for q in NEWS if q["slug"] != p["slug"]][:3]
    body = hero_page(f'<a href="news.html">News and tips</a> / Article', esc(p["title"]), f'{esc(p["category"])} | {fmt_date(p["date"])}') + f'''
<section class="section"><div class="container article">
<div class="prose">{render_body(p["body"])}
<div class="share"><b>Share</b><a class="btn btn-wa btn-sm" data-share="wa" href="#" data-title="{esc(p["title"])}" data-url="{url}" rel="noopener">WhatsApp</a><a class="btn btn-outline btn-sm" data-share="mail" href="#" data-title="{esc(p["title"])}" data-url="{url}">Email</a><button class="btn btn-outline btn-sm" type="button" data-share="copy" data-url="{url}">Copy link</button></div></div>
<aside><div class="card gold"><h3>Want this for your school?</h3><p>We can show you Smart School App and answer your questions.</p><p><a class="btn btn-primary btn-sm" href="request.html">Request a demo</a></p></div>
<div class="card"><h3>More to read</h3><ul class="plain">{"".join(f'<li><a href="news-{q["slug"]}.html">{esc(q["title"])}</a><small>{fmt_date(q["date"])}</small></li>' for q in others)}</ul></div></aside>
</div></section>'''
    art = ld_json({"@context": "https://schema.org", "@type": "Article", "headline": p["title"], "description": p["summary"], "datePublished": p["date"], "dateModified": p["date"],
                   "author": {"@type": "Organization", "name": "EduSmart Consult LTD"}, "publisher": {"@type": "Organization", "name": "EduSmart Consult LTD", "logo": {"@type": "ImageObject", "url": SITE_URL + "/assets/emblem-512.png"}},
                   "mainEntityOfPage": url, "image": SITE_URL + "/assets/og/news-" + p["slug"] + ".png"})
    add(f"news-{p['slug']}.html", p["title"] + " | EduSmart Consult", p["summary"], "resources", body, ld=art + ld_bc([("Home", ""), ("News and tips", "news.html"), (p["title"], f"news-{p['slug']}.html")]))

# RSS feed
def rfc822(d):
    return datetime.datetime.strptime(d, "%Y-%m-%d").strftime("%a, %d %b %Y 08:00:00 +0200")
with open(os.path.join(ROOT, "feed.xml"), "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>EduSmart Consult news</title>' + f"<link>{SITE_URL}/news.html</link><description>Updates and teaching tips from EduSmart Consult</description><language>en</language>"
            + "".join(f"<item><title>{esc(p['title'])}</title><link>{SITE_URL}/news-{p['slug']}.html</link><guid>{SITE_URL}/news-{p['slug']}.html</guid><pubDate>{rfc822(p['date'])}</pubDate><description>{esc(p['summary'])}</description></item>" for p in NEWS)
            + "</channel></rss>\n")

# ============================================================ TAKE THE TOUR
TOUR = [
 ("app-overview", "Teacher overview", "A quiet start screen for the class: learners, lessons done, exercises solved and exams taken, with shortcuts to the tools teachers use most.", ["Class totals at a glance", "One tap to gradebook and marking", "Each learner's progress on one line"]),
 ("app-learner", "Learner home", "Learners see their subjects, practice and progress in a simple, friendly layout.", ["Subjects and lessons continue where they stopped", "Daily goals and streaks", "Read aloud and text size settings"]),
 ("app-subject", "Subject library", "Every unit and lesson for a subject, ready to open, with the teaching guide alongside.", ["Units in the official order", "Pupil book pages and teacher guide", "Lessons can be marked complete"]),
 ("app-reader", "Reading a lesson", "The pupil book page and the teaching guide sit side by side, with read aloud and zoom.", ["Read aloud with adjustable speed", "Zoom for small print", "Guide for how to teach the page"]),
 ("app-exam", "National exam papers", "Past papers with the question pages, a timer and a review of every answer.", ["62 P6 papers, 2010 to 2025", "Timed or untimed", "Automatic marking of written answers"]),
 ("app-answerkeys", "Answer keys", "Teachers review each model answer, edit it and confirm it. Learners are told when an answer is still a draft.", ["Exact, key word or teacher only marking", "Half marks where earned", "Every answer can be changed"]),
 ("app-lessonplan", "Lesson plan generator", "The official REB template filled from the real scheme of work, in English, French or Kinyarwanda.", ["One lesson or a whole unit", "Minutes for each stage", "Ready to print"]),
 ("app-timetable", "Timetable generator", "A conflict free timetable for every class, with days off, double periods and morning or afternoon preferences.", ["Teachers never double booked", "Drag and drop editing", "Print by class or teacher"]),
 ("app-gradebook", "Gradebook", "Scores from quizzes, exams and homework in one grid, with report cards for every learner.", ["Class and subject views", "Homework tracking", "Export to Excel"]),
 ("app-parents", "Parent reports", "Printable reports with a QR code that works offline, so parents see progress without internet.", ["One page per learner", "Attendance included", "QR code opens the summary"]),
 ("app-devicesync", "Device sync", "Combine records from several computers and phones over the school Wi-Fi or a phone hotspot.", ["No internet needed", "Merges work from every device", "Protected by a pairing code"]),
 ("app-cloudsync", "Online sync", "With Smart School Cloud, devices also keep in step over the internet, and people can sign in from a browser.", ["Optional and off by default", "School key and web code", "Works with Windows and Android"]),
]
slides = "".join(f'''<div class="slide" data-i="{i}" data-title="{esc(t)}"><div class="slide-shot">{win("assets/" + img + ".webp", t)}</div><div class="slide-text"><span class="step-no">Step {i + 1} of {len(TOUR)}</span><h3>{esc(t)}</h3><p>{esc(d)}</p><ul class="checklist">{"".join(f"<li>{esc(x)}</li>" for x in pts)}</ul></div></div>''' for i, (img, t, d, pts) in enumerate(TOUR))
thumbs = "".join(f'<button class="tthumb" data-go="{i}"><span>{i + 1}</span>{esc(t)}</button>' for i, (img, t, d, pts) in enumerate(TOUR))
tour_body = hero_page("Take the tour", "Take the tour", "See Smart School App screen by screen, the way teachers and learners use it. No sign up needed.") + f'''
<section class="section"><div class="container tour" data-tour>
<div class="tour-bar"><div class="tour-progress"><i></i></div><div class="tour-ctrl"><button class="btn btn-outline btn-sm" data-prev>&larr; Back</button><button class="btn btn-primary btn-sm" data-next>Next &rarr;</button><button class="btn btn-outline btn-sm" data-play aria-pressed="false">Play</button></div></div>
<div class="tour-stage">{slides}</div>
<div class="tour-thumbs">{thumbs}</div>
<p class="tiny-note">Tip: use the left and right arrow keys. Click any screenshot to enlarge it.</p>
</div></section>
<section class="section sky"><div class="container"><div class="section-head"><div><div class="kicker">Also on Android</div><h2>The same app on the phone</h2></div><p>Learners continue at home on the family phone with the same account and progress.</p></div>
<div class="phones">{phone("assets/phone-learner.webp", "Learner home", "Subjects and practice")}{phone("assets/phone-subject.webp", "Subject library", "Units and lessons")}{phone("assets/phone-teacher.webp", "Teacher home", "Classes and tools")}{phone("assets/phone-gradebook.webp", "Gradebook", "Scores on the go")}</div>
<p style="margin-top:1.4rem;text-align:center"><a class="btn btn-gold" href="request.html">Request a live demo</a> <a class="btn btn-primary" href="downloads.html">Download</a></p></div></section>'''
add("tour.html", "Take the tour | Smart School App screen by screen", "A screen by screen walkthrough of Smart School App: books, exams, lesson plans, timetables, marking, reports and sync.", "products", tour_body,
    ld=ld_bc([("Home", ""), ("Smart School App", "smart-school-app.html"), ("Take the tour", "tour.html")]))

# ============================================================ PRICING
def tick(x): return f'<li>{esc(x)}</li>'
pricing_body = hero_page("Pricing", "Pricing and licences", "Smart School App is licensed per school, so every learner and teacher at the school can use it. Prices depend on the size of your school and the support you choose.") + f'''
<section class="section"><div class="container"><div class="grid g3 plans">
<div class="card plan"><span class="pill-tag">Core</span><h3>School licence</h3><div class="price" data-price="school">Quote on request</div><p class="muted">One licence for the whole school.</p>
<ul class="checklist">{"".join(tick(x) for x in ["Windows and Android apps", "Full P1 to P6 library and past papers", "Lesson plans, timetables, marking and reports", "Learner and staff accounts with roles", "Updates to the app and content", "Activation code for your school"])}</ul><a class="btn btn-primary block" href="request.html?service=demo">Request a quote</a></div>
<div class="card plan feat"><span class="pill-tag gold">Recommended for new schools</span><h3>School licence with training</h3><div class="price" data-price="training">Quote on request</div><p class="muted">Everything in the school licence, plus help getting started.</p>
<ul class="checklist">{"".join(tick(x) for x in ["Everything in the school licence", "Training for teachers and the school manager", "Help enrolling learners and staff", "Setup of device sync between computers and phones", "Optional Smart School Cloud setup"])}</ul><a class="btn btn-gold block" href="request.html?service=training">Request a quote</a></div>
<div class="card plan"><span class="pill-tag">Tailored</span><h3>Custom solutions</h3><div class="price">Scoped with you</div><p class="muted">For organisations with their own needs.</p>
<ul class="checklist">{"".join(tick(x) for x in ["Research, monitoring and evaluation", "Web and software development", "Data digitisation and reporting", "ICT and computer lab support", "Written scope and fixed deliverables"])}</ul><a class="btn btn-primary block" href="request.html">Talk to us</a></div>
</div></div></section>
<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">Compare</div><h2>What each way of using it offers</h2></div><p>Windows and Android work fully offline. The online version needs internet but nothing to install.</p></div>
<div class="scroll-x"><table class="cmp cmp-big"><tr><th>Feature</th><th>Windows</th><th>Android</th><th>Online (Cloud)</th></tr>
{"".join(f'<tr><td>{a}</td>' + "".join(f'<td>{"<span class=yes>Yes</span>" if v == 1 else "<span class=no>No</span>" if v == 0 else esc(v)}</td>' for v in vals) + '</tr>' for a, vals in [
 ("Works with no internet", (1, 1, 0)), ("Full curriculum library and past papers", (1, 1, 1)), ("Lesson plans, timetables, marking and reports", (1, 1, 1)),
 ("Device to device sync over school Wi-Fi", (1, 1, 0)), ("Backup to a USB drive or folder", (1, 1, 0)), ("Sync online across devices", ("Optional", "Optional", "Built in")),
 ("Use in a browser with nothing to install", (0, 0, 1)), ("Print reports and worksheets", (1, 1, 1))])}</table></div></div></section>
<section class="section"><div class="container" style="max-width:860px"><div class="kicker">Questions</div><h2>Licences and pricing</h2>
<details><summary>How is the school licensed?</summary><p>Per school. After installing, the school enters an activation code that we issue.</p></details>
<details><summary>Can we try it first?</summary><p>Yes. <a href="request.html?service=demo">Ask for a demo</a> or take the <a href="tour.html">screen by screen tour</a>.</p></details>
<details><summary>Do you offer training?</summary><p>Yes. Training for teachers and school managers is available with the licence or on its own. Ask us for a quote.</p></details>
<details><summary>Can prices be paid in installments or through a project?</summary><p>Tell us how your school or project pays for software and we will suggest a way that works.</p></details></div></section>'''
add("pricing.html", "Pricing and licences | Smart School App", "Smart School App is licensed per school. See what is included, compare Windows, Android and online use, and request a quote.", "products", pricing_body,
    ld=ld_bc([("Home", ""), ("Pricing", "pricing.html")]))

# ============================================================ TEAM
TEAM = load_json("team.json", [])
def initials(n): return "".join(w[0] for w in n.split()[:2]).upper()
team_body = hero_page("Our team", "Our team", "A small, focused team in Kigali that you can reach directly.") + f'''
<section class="section"><div class="container"><div class="tgrid">{"".join(f"""<article class="tcard">{f'<img src="{esc(m["photo"])}" alt="{esc(m["name"])}" width="120" height="120" loading="lazy">' if m.get("photo") else f'<span class="avatar">{esc(initials(m["name"]))}</span>'}<h3>{esc(m["name"])}</h3><span class="role">{esc(m["role"])}</span><p>{esc(m.get("bio", ""))}</p></article>""" for m in TEAM)}</div>
<div class="card gold" style="margin-top:1.4rem;max-width:760px"><h3>Work with us</h3><p>We are always glad to hear from teachers, developers, researchers and trainers who share our goals. See <a href="partners.html#careers">careers</a> or <a href="contact.html#form">write to us</a>.</p></div></div></section>'''
add("team.html", "Our team | EduSmart Consult", "Meet the people behind EduSmart Consult LTD in Kigali, Rwanda.", "about", team_body, ld=ld_bc([("Home", ""), ("Our team", "team.html")]))

# ============================================================ PARTNERS AND CAREERS
PARTNERS = load_json("partners.json", [])
if PARTNERS:
    plist = '<div class="pgrid2">' + "".join(f'<a class="partner" href="{esc(p.get("url", "#"))}" target="_blank" rel="noopener">' + (f'<img src="{esc(p["logo"])}" alt="" loading="lazy">' if p.get("logo") else "") + f'<b>{esc(p["name"])}</b><small>{esc(p.get("type", ""))}</small></a>' for p in PARTNERS) + "</div>"
else:
    plist = f'<div class="card"><div class="empty-block">{ico("handshake")}<h3>We are building our partner network</h3><p>Partners and clients will be listed here as we agree to share them. Would you like to work with us?</p><a class="btn btn-primary" href="request.html">Start a conversation</a></div></div>'
partners_body = hero_page("Partners and careers", "Partners and careers", "Work with us or grow with us.") + f'''
<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Partners</div><h2>Our partners and clients</h2></div><p>We work with schools, training providers, projects and organisations across Rwanda.</p></div>{plist}
<div class="grid g3" style="margin-top:1.4rem">
<div class="card">{ico("school")}<h3>Schools</h3><p>Use Smart School App and our training with your teachers.</p></div>
<div class="card">{ico("handshake")}<h3>Projects and funders</h3><p>Research, evaluation, e-learning delivery and digital tools for your programme.</p></div>
<div class="card">{ico("code")}<h3>Technology partners</h3><p>Developers, trainers and content creators who want to build with us.</p></div></div></div></section>
<section class="section sky" id="careers"><div class="container split"><div><div class="kicker">Careers</div><h2>Join EduSmart Consult</h2><p>We hire when a project needs a skill we do not have yet. There are no open positions listed right now, but we read every application.</p>
<ul class="checklist"><li>Teachers and trainers</li><li>Researchers and data collectors</li><li>Web and mobile developers</li><li>Designers and content creators</li></ul></div>
<div class="card"><h3>Send your details</h3><p>Tell us who you are and what you do best. Include a short CV or a link to your work.</p><p><a class="btn btn-primary" data-email-link href="#" data-subject="Application to EduSmart Consult">Email your application</a></p><p class="tiny-note">Or use the <a href="contact.html?topic=Careers#form">contact form</a>.</p></div></div></section>'''
add("partners.html", "Partners and careers | EduSmart Consult", "Partner with EduSmart Consult or apply to work with us in Kigali, Rwanda.", "about", partners_body, ld=ld_bc([("Home", ""), ("Partners and careers", "partners.html")]))

# ============================================================ SUCCESS STORIES
STORIES = load_json("testimonials.json", [])
if STORIES:
    st = '<div class="sgrid">' + "".join(f'<figure class="story"><blockquote>{esc(t["quote"])}</blockquote><figcaption><b>{esc(t["name"])}</b><span>{esc(t.get("role", ""))}{", " if t.get("role") and t.get("organisation") else ""}{esc(t.get("organisation", ""))}</span></figcaption></figure>' for t in STORIES) + "</div>"
else:
    st = f'<div class="card"><div class="empty-block">{ico("heart")}<h3>Stories are on the way</h3><p>We are collecting experiences from schools and partners who use our tools. We only publish words that our clients have agreed to share.</p><p><a class="btn btn-primary" data-email-link href="#" data-subject="My experience with EduSmart Consult">Share your experience</a></p></div></div>'
stories_body = hero_page("Success stories", "Success stories", "What schools and partners say about working with us.") + f'<section class="section"><div class="container">{st}</div></section>'
add("stories.html", "Success stories | EduSmart Consult", "What schools and partners say about working with EduSmart Consult.", "resources", stories_body, ld=ld_bc([("Home", ""), ("Success stories", "stories.html")]))

# ============================================================ SEARCH
search_body = hero_page("Search", "Search the site", "Find pages, products, guides and news.") + f'''
<section class="section"><div class="container" style="max-width:860px"><form class="sform" role="search" onsubmit="return false"><input id="siteQ" type="search" placeholder="Search for a product, service or guide" autocomplete="off" aria-label="Search the site" autofocus><button class="btn btn-primary" type="button" id="siteGo">Search</button></form>
<div id="siteResults" class="results" aria-live="polite"><p class="muted">Type at least two letters. Popular: <a href="search.html?q=lesson+plan">lesson plan</a>, <a href="search.html?q=timetable">timetable</a>, <a href="search.html?q=download">download</a>, <a href="search.html?q=pricing">pricing</a>.</p></div></div></section>'''
add("search.html", "Search | EduSmart Consult", "Search the EduSmart Consult website.", "resources", search_body)

# ============================================================ OFFLINE + EDITOR (not listed in the sitemap)
add("offline.html", "You are offline | EduSmart Consult", "You are offline.", "", hero_page("Offline", "You are offline", "This page is not saved on your device yet. Check your connection and try again.") + '<section class="section"><div class="container"><a class="btn btn-primary" href="index.html">Go to the home page</a></div></section>', noindex=True)

editor_body = hero_page("Editor", "Site editor", "Change the moving announcements and write news articles without touching code. This page only prepares files; nothing is saved online until you upload them.") + '''
<section class="section"><div class="container" id="editorRoot" data-tabs>
<div class="tabs" role="tablist"><button class="tab" role="tab" aria-selected="true" aria-controls="ed-ann">Announcements</button><button class="tab" role="tab" aria-selected="false" aria-controls="ed-news">News article</button><button class="tab" role="tab" aria-selected="false" aria-controls="ed-other">Stories, team and partners</button></div>
<div class="panel" id="ed-ann"><p>These lines scroll in the bar at the top of every page. Edit them, then download the file and replace <code>content/announcements.json</code> on your hosting. The bar updates for visitors without a rebuild.</p><div id="annList"></div><p><button class="btn btn-outline btn-sm" type="button" id="annAdd">Add announcement</button> <button class="btn btn-primary btn-sm" type="button" id="annSave">Download announcements.json</button></p></div>
<div class="panel" id="ed-news" hidden><p>Write a new article. The file you download replaces <code>content/news.json</code>. Then ask your web person or Claude to rebuild the site so the article gets its own page.</p>
<div class="form"><div class="row"><label>Title<input id="nTitle"></label><label>Category<input id="nCat" value="News"></label></div><label>Short summary<textarea id="nSum" rows="2"></textarea></label><label>Article text (leave a blank line between paragraphs; start a line with "## " for a heading and "- " for bullet points)<textarea id="nBody" rows="10"></textarea></label><p><button class="btn btn-primary btn-sm" type="button" id="nSave">Download news.json with this article</button></p></div></div>
<div class="panel" id="ed-other" hidden><p>Testimonials, team members and partners live in <code>content/testimonials.json</code>, <code>content/team.json</code> and <code>content/partners.json</code>. Add an entry below and download the updated file.</p>
<div class="form"><div class="row"><label>File<select id="oFile"><option value="testimonials.json">Testimonials</option><option value="team.json">Team member</option><option value="partners.json">Partner</option></select></label><label>Name<input id="oName"></label></div>
<div class="row"><label>Role or type<input id="oRole"></label><label>Organisation (testimonials)<input id="oOrg"></label></div><label>Quote or short bio<textarea id="oText" rows="3"></textarea></label><label>Photo or logo path (optional, for example assets/team/name.jpg)<input id="oPic"></label>
<p><button class="btn btn-primary btn-sm" type="button" id="oSave">Download updated file</button></p></div></div>
</div></section>'''
add("editor.html", "Site editor | EduSmart Consult", "Private helper for updating site content.", "", editor_body, noindex=True)

# ============================================================ TRY IT LIVE (demo school on the cloud)
try_body = hero_page("Try it live", "Try Smart School App live", "Open a ready made demo school in your browser. No sign up, nothing to install. Everything you do is forgotten when you leave, so explore freely.") + f'''
<section class="section"><div class="container split" style="align-items:start">
<div><div class="kicker">Step by step</div><h2>Open the demo in three steps</h2>
<ol class="next"><li>Press <b>Open the live demo</b>. The demo opens in its own tab. The first time it can take up to a minute to wake up.</li><li>Type the school code <code>DEMO2026</code>.</li><li>Sign in as a learner, a teacher or the school manager with one of the logins on this page.</li></ol>
<p style="margin-top:1.2rem"><a class="btn btn-gold" data-cloud="app" href="#">Open the live demo</a> <a class="btn btn-outline" href="tour.html">Or take the tour</a></p>
<div class="callout-box">This is the online version, so some tools that need a real computer, such as USB backups and device to device sync, are not part of the demo. The installed apps for Windows and Android have them.</div></div>
<div class="grid" style="gap:1rem">
<div class="card"><h3>School code</h3><p><code class="big-code">DEMO2026</code></p></div>
<div class="card"><h3>Demo logins</h3><div class="scroll-x"><table class="cmp"><tr><th>Sign in as</th><th>ID</th><th>PIN</th></tr>
<tr><td>Learner (Primary 6)</td><td><code>P6-01</code></td><td><code>1234</code></td></tr>
<tr><td>Class teacher</td><td><code>STAFF-02</code></td><td><code>1111</code></td></tr>
<tr><td>School manager</td><td><code>STAFF-01</code></td><td><code>0000</code></td></tr></table></div></div>
</div></div></section>
<section class="section sky"><div class="container"><div class="section-head"><div><div class="kicker">What to try</div><h2>Five things worth a look</h2></div></div>
<div class="grid g3"><div class="card">{ico("book")}<h3>Read a lesson</h3><p>Open a subject as a learner and read a pupil book page with read aloud.</p></div>
<div class="card">{ico("target")}<h3>Take a quiz</h3><p>Try practice questions and see instant feedback.</p></div>
<div class="card">{ico("edit")}<h3>Make a lesson plan</h3><p>Sign in as the class teacher and generate a plan from the scheme of work.</p></div>
<div class="card">{ico("calendar")}<h3>Build a timetable</h3><p>As the school manager, generate a conflict free timetable in one click.</p></div>
<div class="card">{ico("chart")}<h3>See the reports</h3><p>Open the gradebook and the insights for the class.</p></div>
<div class="card">{ico("handshake")}<h3>Want it at your school?</h3><p><a href="request.html">Request a demo or a quote</a> and we will set it up with you.</p></div></div></div></section>'''
add("try.html", "Try Smart School App live | Demo school in your browser", "Open a ready made demo school of Smart School App in your browser, with logins for a learner, a teacher and a school manager. No sign up.", "products", try_body,
    ld=ld_bc([("Home", ""), ("Try it live", "try.html")]))

# ============================================================ POST-PROCESS EXISTING PAGES
def patch_file(name, fn):
    p = os.path.join(ROOT, name)
    t = open(p, encoding="utf-8").read()
    n = fn(t)
    if n != t:
        open(p, "w", encoding="utf-8", newline="\n").write(n)

latest = "".join(news_card(p) for p in NEWS[:3])
home_news = f'''<section class="section soft"><div class="container"><div class="section-head"><div><div class="kicker">News and tips</div><h2>Latest from EduSmart Consult</h2></div><p>Updates on our products and practical ideas for teachers and schools.</p></div><div class="ngrid n3">{latest}</div><p style="margin-top:1.2rem"><a class="btn btn-primary btn-sm" href="news.html">All news and tips</a></p></div></section>\n'''
home_stories = ""
if STORIES:
    home_stories = '<section class="section"><div class="container"><div class="section-head"><div><div class="kicker">Success stories</div><h2>What clients say</h2></div></div><div class="sgrid">' + "".join(f'<figure class="story"><blockquote>{esc(t["quote"])}</blockquote><figcaption><b>{esc(t["name"])}</b><span>{esc(t.get("organisation", ""))}</span></figcaption></figure>' for t in STORIES[:3]) + '</div></div></section>\n'

def _home(t):
    marker = '<section class="section"><div class="container">\n<div class="section-head"><div><div class="kicker">How we work</div>'
    if marker in t and "Latest from EduSmart Consult" not in t:
        t = t.replace(marker, home_news + home_stories + marker, 1)
    t = t.replace('<a class="btn btn-sky" href="products.html">See our software</a>', '<a class="btn btn-sky" href="products.html">See our software</a><a class="btn btn-gold" href="request.html">Request a demo</a>', 1)
    site_ld = ld_json({"@context": "https://schema.org", "@type": "WebSite", "name": "EduSmart Consult", "url": SITE_URL + "/", "potentialAction": {"@type": "SearchAction", "target": SITE_URL + "/search.html?q={search_term_string}", "query-input": "required name=search_term_string"}})
    return t.replace("</head>", site_ld + "</head>", 1) if "SearchAction" not in t else t
patch_file("index.html", _home)

def _app(t):
    t = t.replace('<a class="btn btn-sky" href="smart-school-cloud.html">Online access and sync</a>', '<a class="btn btn-sky" href="tour.html">Take the tour</a><a class="btn btn-ghost-light" href="pricing.html">Pricing</a>', 1)
    sw = ld_json({"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Smart School App", "applicationCategory": "EducationalApplication", "operatingSystem": "Windows 10, Windows 11, Android 7",
                  "publisher": {"@type": "Organization", "name": "EduSmart Consult LTD"}, "description": "Offline learning and school management suite for Primary 1 to 6 in Rwanda.", "image": SITE_URL + "/assets/ssa-logo-512.png"})
    return t.replace("</head>", sw + "</head>", 1) if "SoftwareApplication" not in t else t
patch_file("smart-school-app.html", _app)

def _products(t):
    box = '<div class="toolbar-f"><input id="prodQ" type="search" placeholder="Search products, for example maths, savings, job" aria-label="Search products"><select id="prodPlat" aria-label="Platform"><option value="">Any platform</option><option value="Android">Android</option><option value="Windows">Windows</option><option value="Web">Web</option></select></div>\n'
    if 'id="prodQ"' not in t:
        t = t.replace('<div class="chip-row filters"', box + '<div class="chip-row filters"', 1)
        t = t.replace('<p class="empty-note', '<p class="empty-note', 1)
        t = t.replace('<div class="notice" style="margin-top:2rem">', '<p class="empty-note hidden" id="prodEmpty">No product matches. Try another word or platform.</p>\n<div class="notice" style="margin-top:2rem">', 1)
    return t
patch_file("products.html", _products)

# ============================================================ SEARCH INDEX
index = [{"u": p["url"], "t": p["title"], "d": p["desc"], "x": p["text"]} for p in PAGE_REG if p["url"] not in ("404.html",)]
with open(os.path.join(ROOT, "search-index.json"), "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, separators=(",", ":"))

# ============================================================ SERVICE WORKER (offline copy of the site)
core = ["index.html", "products.html", "smart-school-app.html", "smart-school-cloud.html", "tour.html", "downloads.html", "pricing.html", "request.html", "contact.html", "about.html", "news.html", "offline.html",
        "assets/styles.css", "assets/extra.css", "assets/site.js", "assets/extra.js", "assets/config.js", "assets/logo-horizontal.webp", "assets/emblem-192.png", "content/announcements.json", "search-index.json"]
open(os.path.join(ROOT, "sw.js"), "w", encoding="utf-8").write(f'''/* EduSmart Consult service worker: keeps the main pages available offline. Version {TODAY}. */
var V = "edusmart-{TODAY}-{__import__("time").strftime("%H%M")}", CORE = {json.dumps(core)};
self.addEventListener("install", function (e) {{ e.waitUntil(caches.open(V).then(function (c) {{ return Promise.all(CORE.map(function (u) {{ return c.add(u).catch(function () {{}}); }})); }}).then(function () {{ return self.skipWaiting(); }})); }});
self.addEventListener("activate", function (e) {{ e.waitUntil(caches.keys().then(function (ks) {{ return Promise.all(ks.filter(function (k) {{ return k !== V; }}).map(function (k) {{ return caches.delete(k); }})); }}).then(function () {{ return self.clients.claim(); }})); }});
self.addEventListener("fetch", function (e) {{
  var r = e.request; if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (new URL(r.url).pathname.indexOf("/amategeko/") === 0) return;   // the road code web app manages its own files
  var isPage = r.mode === "navigate" || (r.headers.get("accept") || "").indexOf("text/html") > -1;
  if (isPage) {{
    e.respondWith(fetch(r).then(function (res) {{ var cp = res.clone(); caches.open(V).then(function (c) {{ c.put(r, cp); }}); return res; }}).catch(function () {{ return caches.match(r).then(function (m) {{ return m || caches.match("offline.html"); }}); }}));
  }} else {{
    e.respondWith(caches.match(r).then(function (m) {{ return m || fetch(r).then(function (res) {{ if (res.ok) {{ var cp = res.clone(); caches.open(V).then(function (c) {{ c.put(r, cp); }}); }} return res; }}); }}));
  }}
}});
''')
