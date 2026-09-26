"""Builds the two brochure PDFs (A4, two pages each) with headless Edge.
Run from the website folder:  python tools/brochures.py
Output: assets/brochures/*.pdf   (sources are written to a temp folder and not published)"""
import os, subprocess, tempfile, html, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT = os.path.join(ROOT, "assets", "brochures")
os.makedirs(OUT, exist_ok=True)
A = ROOT.replace("\\", "/") + "/assets/"
esc = html.escape

CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box}body{margin:0;font-family:'Segoe UI',Arial,sans-serif;color:#14213d;font-size:10pt;line-height:1.4}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;padding:0}
.pg:last-child{page-break-after:auto}
.stripe{height:7mm;background:linear-gradient(90deg,#00a1de 0 33%,#fad201 33% 66%,#20603d 66%)}
.hero{background:#06307a;color:#fff;padding:8mm 16mm 7mm}
.hero img.logo{height:15mm;background:#fff;border-radius:3mm;padding:2mm}
.hero h1{font-size:26pt;margin:5mm 0 2mm;line-height:1.1}.hero p{font-size:12.5pt;margin:0;max-width:150mm;color:#dbe6ff}
.body{padding:4mm 16mm}
h2{font-size:15pt;color:#06307a;margin:6mm 0 2mm;border-left:2mm solid #fad201;padding-left:3mm}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm 6mm}
.card{border:0.3mm solid #d5deee;border-radius:3mm;padding:2.5mm 4mm;background:#f6f9ff}
.card b{display:block;color:#06307a;margin-bottom:1mm}
ul{margin:1mm 0 0;padding-left:5mm}li{margin:0.8mm 0}
.shots{display:flex;gap:5mm;align-items:flex-start;margin-top:4mm}
.shots img{border:0.3mm solid #cfd8ea;border-radius:2mm;box-shadow:0 1mm 3mm rgba(0,0,0,.15)}
.foot{position:absolute;left:0;right:0;bottom:0;background:#06307a;color:#fff;padding:5mm 16mm;font-size:10pt;display:flex;justify-content:space-between}
.foot b{color:#fad201}
.note{font-size:9pt;color:#5a6785;margin-top:3mm}
"""

def contact():
    return ('<div class="foot"><div><b>EduSmart Consult LTD</b><br>Itetero, Nyagatovu, Kimironko, Gasabo, Kigali, Rwanda</div>'
            '<div style="text-align:right"><b>+250 782 368 555</b><br>hagenalexis2000@gmail.com</div></div>')

def lst(items):
    return "<ul>" + "".join("<li>%s</li>" % esc(i) for i in items) + "</ul>"

def cards(pairs):
    return '<div class="grid">' + "".join('<div class="card"><b>%s</b>%s</div>' % (esc(t), lst(i) if isinstance(i, list) else esc(i)) for t, i in pairs) + "</div>"

def doc(title, tagline, p1, p2):
    hero = ('<div class="stripe"></div><div class="hero"><img class="logo" src="file:///%slogo-horizontal.png"><h1>%s</h1><p>%s</p></div>' % (A, esc(title), esc(tagline)))
    return ('<!doctype html><meta charset="utf-8"><title>%s</title><style>%s</style>'
            '<div class="pg">%s<div class="body">%s</div>%s</div><div class="pg"><div class="stripe"></div><div class="body">%s</div>%s</div>' % (esc(title), CSS, hero, p1, contact(), p2, contact()))

def shot(name, w):
    return '<img src="file:///%s%s" style="width:%smm">' % (A, name, w)

APP1 = ('<h2>What it is</h2><p>An offline learning and school management suite for Primary 1 to Primary 6. Learners get the full curriculum library, practice and past papers. '
        'Teachers get lesson plans, timetables, marking and reports. It runs on Windows computers and Android phones with no internet connection.</p>'
        + cards([("For learners", ["Every class and subject, page by page", "Read aloud, zoom and three text sizes", "Smart Practice on the topics they miss", "P6 national exam papers, 2010 to 2025"]),
                 ("For teachers", ["REB lesson plans filled from the scheme of work", "Conflict free timetables", "Marking with model answers beside the work", "Gradebook, homework and printable reports"]),
                 ("For school managers", ["Staff profiles with class and subject access", "Insights on learning and teacher use", "Backups and whole school export", "Parent reports with an offline QR code"]),
                 ("Works everywhere", ["No internet needed to teach", "Windows 10 or 11 and Android 7 or newer", "Same account and content on every device", "English, French and Kinyarwanda lesson plans"])])
        + '<div class="shots">' + shot("app-overview.webp", 108) + shot("phone-learner.webp", 30) + '</div><div class="note">Real screens from Smart School App.</div>')
APP2 = ('<h2>Built for real classrooms</h2>' + cards([("Reports and evidence", ["Learner and class reports", "Progress by topic and gender", "Impact report for partners"]),
        ("Accessibility", ["Colour themes and larger text", "Keyboard friendly layouts", "Read aloud"]),
        ("Data stays with the school", ["Records live on school devices", "Sync is optional", "No advertising and no tracking"]),
        ("Support", ["Training and set up help", "Updates and teaching guides", "Support desk for licensed schools"])])
        + '<div class="shots">' + shot("app-lessonplan.webp", 90) + shot("app-gradebook.webp", 90) + '</div>'
        + '<h2>Getting started</h2><ol><li>Request a demo or quote from EduSmart Consult.</li><li>Install the app on Windows and Android devices.</li><li>Set up staff profiles and classes.</li><li>Teach, mark and report, offline or online.</li></ol>'
        + '<p class="note">Licensed per school. The app works offline. Books, exams and curriculum content belong to their owners.</p>')

CLOUD1 = ('<h2>What it is</h2><p>The online side of Smart School App. Open the app in any browser, and keep records in step across Windows computers and Android phones whenever there is a connection. Offline use never stops working.</p>'
          + cards([("Web app", ["Sign in from any browser", "No installation", "Roles limit what people see"]), ("Device sync", ["Windows and Android share one school record", "Work from any device is merged, not overwritten", "Works again after a lost connection"]),
                   ("Easy joining", ["Join a device with a one time code", "Codes expire and can be limited", "A manager can remove a device at any time"]), ("Clock safe", ["Devices with a wrong clock cannot overwrite newer work", "Sync status is shown in plain words", "Automatic retry"])])
          + '<div class="shots">' + shot("app-cloudsync.webp", 108) + shot("phone-teacher.webp", 30) + '</div>')
CLOUD2 = ('<h2>Your school stays in control</h2>' + cards([("Privacy and safety", ["Sync is optional and off until a manager turns it on", "Each device holds its own key", "Learner data is never sold"]),
          ("Licences and support", ["Clear licence dates and a grace period", "Apps keep working offline if a licence ends", "Support desk with a full audit trail"]),
          ("For partners", ["Read only dashboards for district officers and funders", "School groups and programmes", "No access to individual learner records"]),
          ("Reliability", ["Live status page", "Automatic error reports that hide personal details", "Backups by the hosting provider"])])
          + '<h2>How to start</h2><ol><li>Request access and we create your school account.</li><li>A manager makes a join code in the app.</li><li>Type the code on each device and press Sync now.</li></ol>'
          + '<p class="note">Smart School Cloud is optional and is rolled out school by school.</p>')

JOBS = [("Smart-School-App-brochure", doc("Smart School App", "Offline learning and school management for Primary 1 to 6, on Windows and Android.", APP1, APP2)),
        ("Smart-School-Cloud-brochure", doc("Smart School Cloud", "Browser access and safe sync for every device in your school.", CLOUD1, CLOUD2))]

tmp = os.environ.get("BRO_TMP") or tempfile.mkdtemp()
os.makedirs(tmp, exist_ok=True)
for name, h in JOBS:
    src = os.path.join(tmp, name + ".html")
    open(src, "w", encoding="utf-8").write(h)
    pdf = os.path.join(OUT, name + ".pdf")
    if os.path.exists(pdf):
        os.remove(pdf)
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--user-data-dir=" + os.path.join(tmp, "prof" + name),
                    "--print-to-pdf=" + pdf, "file:///" + src.replace("\\", "/")], check=False, timeout=120)
    import time
    for _ in range(40):
        if os.path.exists(pdf): break
        time.sleep(1)
    print(name, os.path.getsize(pdf) if os.path.exists(pdf) else "FAILED")
