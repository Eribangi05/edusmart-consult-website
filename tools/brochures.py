"""Builds the brochure PDFs (A4) with headless Edge.

Run from the website folder:   python tools/brochures.py [app|cloud|amategeko|company]
Output: assets/brochures/*.pdf

  Smart-School-App-guide.pdf       product guide, 8 pages
  Smart-School-Cloud-guide.pdf     product guide, 6 pages
  Amategeko-Umuhanda-guide.pdf     product guide, 4 pages
  EduSmart-Consult-brochure.pdf    company and marketing brochure, 4 pages

Screenshots come from assets/app-*.webp and tools/brochure-img (captured with tools/amategeko/shots.js and the console
screenshot script). Icons are the site's own Phosphor set, recoloured inline."""
import os, re, subprocess, tempfile, time, html, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT = os.path.join(ROOT, "assets", "brochures")
os.makedirs(OUT, exist_ok=True)
U = "file:///" + ROOT.replace("\\", "/")
A = U + "/assets/"
IMG = U + "/tools/brochure-img/"
esc = html.escape

CSS = r"""
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Segoe UI',Arial,sans-serif;color:#14213d;font-size:9.6pt;line-height:1.45}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:#fff}
.pg:last-child{page-break-after:auto}
.stripe{height:5mm;background:linear-gradient(90deg,#00a1de 0 34%,#fad201 34% 67%,#20603d 67%)}
.top{display:flex;justify-content:space-between;align-items:center;padding:6mm 14mm 0}
.top img{height:8mm}.top span{font-size:8pt;color:#5a6785;letter-spacing:.06em;text-transform:uppercase}
.foot{position:absolute;left:0;right:0;bottom:0;height:11mm;background:#06307a;color:#cfe0ff;font-size:7.6pt;display:flex;align-items:center;justify-content:space-between;padding:0 14mm}
.foot b{color:#fad201}.foot .n{background:#fad201;color:#06307a;font-weight:800;border-radius:50%;width:6.2mm;height:6.2mm;display:grid;place-items:center;font-size:8pt}
.body{padding:5mm 14mm 0}
.kick{font-size:8pt;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#00a1de;display:flex;align-items:center;gap:2.5mm}
.kick:before{content:"";width:9mm;height:.9mm;background:#fad201;border-radius:1mm}
h1.t{font-size:23pt;line-height:1.08;color:#06307a;font-weight:800;margin:1.6mm 0 2.5mm}
h2.s{font-size:12.5pt;color:#06307a;font-weight:800;margin:0 0 1.5mm}
p.lead{font-size:10.6pt;color:#33415c;max-width:170mm;margin-bottom:3mm}
p.sm{font-size:8.6pt;color:#5a6785}
.cover{background:linear-gradient(155deg,#041f4d 0%,#06307a 45%,#0a5ab0 100%);color:#fff}
.cover .orb{position:absolute;border-radius:50%;opacity:.16}
.cover .in{position:relative;padding:14mm 16mm 0}
.cover .logo{height:15mm;background:#fff;border-radius:3.5mm;padding:2mm 3mm}
.cover .plogo{position:absolute;right:14mm;top:22mm;width:50mm;filter:drop-shadow(0 2mm 4mm rgba(0,0,0,.4))}
.cover h1{font-size:40pt;line-height:1.02;font-weight:800;margin:14mm 0 4mm;letter-spacing:-.01em}
.cover h1 em{font-style:normal;color:#fad201}
.cover p.tag{font-size:13.5pt;color:#d6e5ff;max-width:150mm;line-height:1.4}
.chips{display:flex;gap:2.5mm;flex-wrap:wrap;margin-top:6mm}
.chips span{border:.3mm solid rgba(255,255,255,.4);border-radius:99mm;padding:1.4mm 4mm;font-size:8.6pt;color:#fff;background:rgba(255,255,255,.08)}
.cover .band{position:absolute;left:0;right:0;bottom:0;background:#fad201;color:#06307a;display:flex;justify-content:space-around;padding:5mm 10mm}
.cover .band div{text-align:center}.cover .band b{display:block;font-size:17pt;line-height:1}.cover .band span{font-size:7.8pt;font-weight:600}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3.5mm}.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}
.fc{border:.3mm solid #d9e3f5;border-radius:3mm;padding:3.2mm 3.6mm;background:#fff;position:relative}
.fc.soft{background:#f2f7ff}
.fc h3{font-size:9.8pt;color:#06307a;margin:1.6mm 0 .8mm;font-weight:800}.fc p{font-size:8.7pt;color:#41506c;line-height:1.4}
.ic{width:9.5mm;height:9.5mm;border-radius:2.6mm;display:grid;place-items:center;color:#fff;box-shadow:0 .8mm 2mm rgba(6,48,122,.28)}
.ic svg{width:5.4mm;height:5.4mm}
.c1{background:linear-gradient(135deg,#3a86ff,#1c4fd6)}.c2{background:linear-gradient(135deg,#8b6cff,#5a35d6)}.c3{background:linear-gradient(135deg,#ff8a5c,#e5484d)}
.c4{background:linear-gradient(135deg,#22d3a0,#0f8a5f)}.c5{background:linear-gradient(135deg,#ffc046,#f08a00)}.c6{background:linear-gradient(135deg,#22c6e8,#0077b6)}
.c7{background:linear-gradient(135deg,#f472b6,#be185d)}.c8{background:linear-gradient(135deg,#5eead4,#0f766e)}.c9{background:linear-gradient(135deg,#94a3b8,#475569)}
.row{display:flex;gap:3mm;align-items:flex-start}
ul.ck{list-style:none;margin:1mm 0 0}ul.ck li{position:relative;padding-left:5mm;margin:.9mm 0;font-size:8.8pt;color:#33415c}
ul.ck li:before{content:"";position:absolute;left:0;top:1.2mm;width:3mm;height:3mm;border-radius:50%;background:#20603d;box-shadow:inset 0 0 0 .7mm #fff,0 0 0 .5mm #20603d}
.hero-band ul.ck li{color:#d6e5ff}
.big{font-size:20pt;font-weight:800;color:#06307a;line-height:1}
.stat{background:#f2f7ff;border-radius:3mm;padding:3mm;text-align:center}.stat span{display:block;font-size:7.8pt;color:#41506c;margin-top:1mm}
.win{border-radius:2.4mm;overflow:hidden;background:#fff;box-shadow:0 1.6mm 5mm rgba(6,48,122,.30);border:.3mm solid #c9d6ee;position:relative}
.win .bar{height:4.6mm;background:#e9eef8;display:flex;align-items:center;gap:1.2mm;padding:0 2.4mm}
.win .bar i{width:1.7mm;height:1.7mm;border-radius:50%;background:#c3cde2}.win .bar i:first-child{background:#ff6b6b}.win .bar i:nth-child(2){background:#ffc046}.win .bar i:nth-child(3){background:#3ecf8e}
.win .bar b{font-size:6.4pt;color:#66738f;font-weight:600;margin-left:2mm}
.win .sc{position:relative;line-height:0}.win img{width:100%;display:block}
.phone{width:33mm;border-radius:5.2mm;background:#0d1b3e;padding:1.5mm;box-shadow:0 1.6mm 5mm rgba(6,48,122,.38);position:relative;display:inline-block}
.phone .sc{border-radius:4mm;overflow:hidden;position:relative;line-height:0}.phone img{width:100%;display:block}
.pin{position:absolute;width:5.2mm;height:5.2mm;margin:-2.6mm 0 0 -2.6mm;border-radius:50%;background:#fad201;color:#06307a;font:800 7.6pt/5.2mm 'Segoe UI',Arial,sans-serif;text-align:center;box-shadow:0 0 0 .7mm #06307a,0 .8mm 2mm rgba(0,0,0,.35)}
.cap{font-size:7.8pt;color:#5a6785;margin-top:1.4mm}
ol.lg{list-style:none;counter-reset:l;margin-top:1mm}
ol.lg li{counter-increment:l;position:relative;padding-left:7mm;margin:1.4mm 0;font-size:8.7pt;color:#33415c;line-height:1.38}
ol.lg li:before{content:counter(l);position:absolute;left:0;top:-.2mm;width:5mm;height:5mm;border-radius:50%;background:#fad201;color:#06307a;font:800 7.4pt/5mm 'Segoe UI',Arial,sans-serif;text-align:center;box-shadow:0 0 0 .5mm #06307a}
ol.lg li b{color:#06307a}
.steps{display:grid;grid-auto-flow:column;gap:3mm}
.st{background:#f2f7ff;border-radius:3mm;padding:3.4mm;position:relative}
.st .no{width:7.4mm;height:7.4mm;border-radius:50%;background:#06307a;color:#fad201;font-weight:800;font-size:10pt;display:grid;place-items:center;margin-bottom:1.6mm}
.st h3{font-size:9.6pt;color:#06307a;margin-bottom:.8mm}.st p{font-size:8.5pt;color:#41506c;line-height:1.38}
.call{border-left:1.2mm solid #fad201;background:#fff9dc;border-radius:0 2.4mm 2.4mm 0;padding:2.6mm 3.6mm;font-size:8.8pt;color:#4a3f00}
.call.blue{border-color:#00a1de;background:#eaf7fd;color:#0b4a66}
table.tb{width:100%;border-collapse:collapse;font-size:8.6pt}
table.tb th{background:#06307a;color:#fff;text-align:left;padding:1.8mm 2.6mm;font-weight:700}
table.tb td{padding:1.7mm 2.6mm;border-bottom:.25mm solid #dbe4f5}table.tb tr:nth-child(even) td{background:#f5f8ff}
table.tb td:first-child{font-weight:700;color:#06307a}
.hero-band{background:linear-gradient(120deg,#06307a,#0a5ab0);color:#fff;border-radius:3.6mm;padding:5mm 6mm;position:relative;overflow:hidden}
.hero-band h2{color:#fff;font-size:15pt}.hero-band p{color:#d6e5ff;font-size:9.4pt}
.hero-band.mk{background:linear-gradient(120deg,#fad201,#f6b800)}.hero-band.mk h2{color:#06307a}.hero-band.mk p{color:#3d3300}
.contact{text-align:right;color:#06307a;font-weight:700;font-size:10pt;line-height:1.5}
"""

_ICON_CACHE = {}


def icon(name, cls="c1"):
    """a gradient tile holding one of the site's Phosphor icons"""
    if name not in _ICON_CACHE:
        s = open(os.path.join(ROOT, "assets", "icons", "ph-" + name + ".svg"), encoding="utf-8").read()
        _ICON_CACHE[name] = re.sub(r"<svg ", '<svg aria-hidden="true" ', s, count=1)
    return '<div class="ic %s">%s</div>' % (cls, _ICON_CACHE[name])


def fc(ic, cls, title, text, soft=False):
    return '<div class="fc%s">%s<h3>%s</h3><p>%s</p></div>' % (" soft" if soft else "", icon(ic, cls), esc(title), esc(text))


def ck(items):
    return '<ul class="ck">' + "".join("<li>%s</li>" % esc(i) for i in items) + "</ul>"


def win(src, title, pins=()):
    p = "".join('<i class="pin" style="left:%s%%;top:%s%%">%d</i>' % (x, y, n) for n, (x, y) in enumerate(pins, 1))
    return '<div class="win"><div class="bar"><i></i><i></i><i></i><b>%s</b></div><div class="sc"><img src="%s">%s</div></div>' % (esc(title), src, p)


def phone(src, style=""):
    return '<div class="phone" style="%s"><div class="sc"><img src="%s"></div></div>' % (style, src)


def legend(items):
    return '<ol class="lg">' + "".join("<li><b>%s</b> %s</li>" % (esc(t), esc(d)) for t, d in items) + "</ol>"


def steps(items):
    return '<div class="steps" style="grid-template-columns:repeat(%d,1fr)">' % len(items) + "".join(
        '<div class="st"><div class="no">%d</div><h3>%s</h3><p>%s</p></div>' % (i, esc(t), esc(d)) for i, (t, d) in enumerate(items, 1)) + "</div>"


def head(kick, title, lead=""):
    return '<div class="kick">%s</div><h1 class="t">%s</h1>%s' % (esc(kick), esc(title), ('<p class="lead">%s</p>' % esc(lead)) if lead else "")


def cta(title, sub, extra=""):
    return ('<div class="hero-band mk" style="margin-top:5mm"><div class="row"><div style="flex:1"><h2>%s</h2><p>%s</p></div>'
            '<div class="contact">+250 782 368 555<br>hagenalexis2000@gmail.com<br>Kimironko, Gasabo, Kigali%s</div></div></div>' % (esc(title), esc(sub), extra))


class Doc:
    def __init__(self, name, title):
        self.name, self.title, self.pages = name, title, []

    def cover(self, inner):
        self.pages.append('<div class="pg cover">%s</div>' % inner)

    def page(self, inner):
        n = len(self.pages) + 1
        self.pages.append(
            '<div class="pg"><div class="stripe"></div><div class="top"><img src="%slogo-horizontal.png"><span>%s</span></div><div class="body">%s</div>'
            '<div class="foot"><span><b>EduSmart Consult LTD</b> &nbsp; Kigali, Rwanda &nbsp; +250 782 368 555 &nbsp; hagenalexis2000@gmail.com</span><span class="n">%d</span></div></div>' % (A, esc(self.title), inner, n))

    def build(self):
        tmp = os.environ.get("BRO_KEEP") or tempfile.mkdtemp()
        os.makedirs(tmp, exist_ok=True)
        src = os.path.join(tmp, self.name + ".html")
        open(src, "w", encoding="utf-8").write('<!doctype html><meta charset="utf-8"><title>%s</title><style>%s</style>%s' % (esc(self.title), CSS, "".join(self.pages)))
        pdf = os.path.join(OUT, self.name + ".pdf")
        if os.path.exists(pdf):
            os.remove(pdf)
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--user-data-dir=" + os.path.join(tmp, "prof_" + self.name),
                        "--print-to-pdf=" + pdf, "file:///" + src.replace("\\", "/")], check=False, timeout=240)
        for _ in range(90):
            if os.path.exists(pdf) and os.path.getsize(pdf) > 1000:
                break
            time.sleep(1)
        n = len(re.findall(rb"/Type\s*/Page[^s]", open(pdf, "rb").read())) if os.path.exists(pdf) else 0
        print("%-32s %5.1f MB  %d pages (expected %d)" % (self.name, os.path.getsize(pdf) / 1048576 if os.path.exists(pdf) else 0, n, len(self.pages)))


def cover_block(title_html, tagline, chips, band, shots_html, plogo=None, top=112):
    """top: where the screenshots start (mm). Covers with a product logo wrap the title so the two never collide."""
    narrow = ' style="max-width:126mm"' if plogo else ""
    tag_w = ' style="max-width:120mm"' if plogo else ""
    return ('<div class="stripe"></div><div class="orb" style="width:120mm;height:120mm;right:-40mm;top:40mm;background:#00a1de"></div>'
            '<div class="orb" style="width:80mm;height:80mm;left:-30mm;bottom:35mm;background:#fad201"></div>'
            '<div class="in"><img class="logo" src="%slogo-horizontal.png">%s<h1%s>%s</h1><p class="tag"%s>%s</p><div class="chips">%s</div></div>'
            '<div style="position:absolute;left:0;right:0;top:%dmm">%s</div>'
            '<div class="band">%s</div>' % (A, ('<img class="plogo" src="%s%s">' % (A, plogo)) if plogo else "", narrow, title_html, tag_w, esc(tagline),
                                             "".join("<span>%s</span>" % esc(c) for c in chips), top, shots_html,
                                             "".join("<div><b>%s</b><span>%s</span></div>" % (esc(a), esc(b)) for a, b in band)))


# ================================================================== SMART SCHOOL APP
def app_guide():
    d = Doc("Smart-School-App-guide", "Smart School App product guide")
    d.cover(cover_block("Smart School <em>App</em>", "The complete offline learning and school management suite for Primary 1 to Primary 6.",
                        ["Windows", "Android", "Works without internet", "English, French, Kinyarwanda"],
                        [("62", "national exam papers, 2010 to 2025"), ("3", "kinds of user, one app"), ("0", "internet needed to teach")],
                        '<div style="position:absolute;left:14mm;right:14mm;top:0"><div style="width:160mm">' + win(A + "app-overview.webp", "Smart School App") + '</div>' +
                        '<div style="position:absolute;right:0;top:26mm">' + phone(A + "phone-learner.webp", "width:46mm") + '</div></div>', "ssa-logo-512.png", 122))

    d.page(head("At a glance", "One app for the whole school", "Learners study and practise. Teachers plan, mark and report. Managers see how the school is doing. Everything runs on the school's own devices, with or without a connection.") +
           '<div class="g3" style="margin-top:2mm">' + fc("graduation-cap", "c2", "Learners", "The full curriculum library, practice, quizzes, games and past papers, with read aloud and larger text.") +
           fc("chalkboard-teacher", "c3", "Teachers", "Lesson plans, timetables, marking, homework, a gradebook and printable reports for parents.") +
           fc("buildings", "c1", "School managers", "Staff profiles, class and subject access, insights, backups and sync between devices.") + '</div>' +
           '<div class="hero-band" style="margin-top:5mm"><div class="row"><div style="flex:1"><h2>Built for schools with unreliable internet</h2><p>If it needs the internet to teach a lesson, it is not finished. Records stay on the school\'s computers and phones. Online features are optional and switched on by the school.</p></div>'
           '<div style="width:40mm;text-align:center"><div class="big" style="color:#fad201;font-size:30pt">100%</div><p style="font-size:8.4pt">of lessons work offline</p></div></div></div>' +
           '<div class="kick" style="margin-top:6mm">How it fits together</div><div class="g4" style="margin-top:2.4mm">' +
           fc("desktop", "c1", "Windows", "Computers for the office, the lab and the head teacher.", True) + fc("device-mobile", "c4", "Android", "Phones and tablets for teachers and learners at home.", True) +
           fc("wifi-high", "c6", "School sync", "Devices share records over the school Wi-Fi or a phone hotspot.", True) + fc("cloud", "c8", "Cloud, optional", "Browser access and sync between distant devices.", True) + '</div>' +
           '<div class="g3" style="margin-top:5mm"><div class="stat"><div class="big">P1 to P6</div><span>every class and subject</span></div><div class="stat"><div class="big">3</div><span>languages for lesson plans</span></div><div class="stat"><div class="big">2 GB</div><span>library included, no downloads later</span></div></div>' +
           '<h2 class="s" style="margin-top:6mm">A typical day with Smart School App</h2>' +
           steps([("Morning", "The teacher opens today's lesson plan and the teaching guide beside the book page."), ("In class", "Learners read, practise and answer on the school's devices. No signal needed."), ("After class", "Answers are marked with the model answer beside them, and homework is set.")]) +
           '<div class="call blue" style="margin-top:4mm"><b>Every result can be changed.</b> Timetables, plans and marks are suggestions the teacher can review and edit. The software saves time; it does not replace judgement.</div>')

    d.page(head("For learners", "Learn at their own pace, on any device", "A learner signs in to a personal profile and sees only what fits their class. Every screen is designed for children and works with large text.") +
           '<div class="row" style="margin-top:2mm"><div style="flex:1.75">' + win(A + "app-learner.webp", "Learner home", [(50, 19), (50, 46), (46, 70), (37, 93)]) + '<p class="cap">The learner home. Real screen from the Windows version.</p></div>' +
           '<div style="flex:1">' + legend([("Daily welcome.", "Progress, streak and a clear next step."), ("Your numbers.", "Lessons done, exercises solved, day streak, exam form."), ("Learning journey.", "How far the learner is through the year."), ("Exam countdown.", "Days left and a practice button.")]) + '</div></div>' +
           '<div class="row" style="margin-top:4mm"><div style="flex:1">' + win(A + "app-subject.webp", "Subject page", [(55, 17), (48, 33), (50, 68)]) + '<p class="cap">A subject page: units, lessons and practice in one place.</p></div>' +
           '<div style="flex:1.05">' + legend([("Progress at the top.", "Units and lessons completed for the subject."), ("Practice and national exams.", "One tap to exercises or past papers for that subject."), ("Units and lessons.", "Open any lesson, tick it off when done.")]) +
           '<div class="g2" style="margin-top:3mm">' + fc("book-open", "c2", "Pupil books", "Every class and subject, page by page.") + fc("target", "c3", "Smart Practice", "Brings back the topics a learner keeps missing.") + '</div></div></div>' +
           '<div class="g4" style="margin-top:4mm">' + fc("translate", "c6", "Read aloud", "Listen to any page.", True) + fc("magnifying-glass", "c5", "Three text sizes", "Larger text and zoom.", True) + fc("lightbulb", "c4", "Games and quizzes", "Timed tests with instant feedback.", True) + fc("heart", "c7", "Accessible themes", "Colours and layouts for easier reading.", True) + '</div>')

    d.page(head("Learn and practise", "Past papers and national exams, the way exams really look", "Sixty two past papers from 2010 to 2025 with the question pages, a timer and a review of every answer.") +
           win(A + "app-exam.webp", "Past paper, timed", [(27, 52), (74, 33), (78, 82), (94, 9)]) + '<p class="cap">A timed national exam paper. The learner reads the paper on the left and writes the answer on the right.</p>' +
           '<div class="row" style="margin-top:3mm"><div style="flex:1">' + legend([("Question paper.", "The real question pages, with zoom and page turning."), ("Your answer.", "Written answers are saved as the learner types."), ("Question navigator.", "Jump to any question and see which are answered."), ("Timer.", "Shows the time left, as in the real exam.")]) + '</div>' +
           '<div style="flex:1.1"><div class="g2">' + fc("clock", "c3", "Timed and untimed", "Practice calmly, or simulate the exam.") + fc("shield-check", "c4", "Marked against answer keys", "Written answers are compared with the confirmed answer key.") +
           fc("chart-bar", "c1", "Review every answer", "See what was right, what was wrong and why.") + fc("file-text", "c5", "Worksheets and class tests", "Teachers print or set them from the same questions.") + '</div></div></div>')

    d.page(head("Read and learn", "Pupil books with a teaching guide beside every lesson", "The learner reads the real book page. The teacher sees a step by step guide for the same lesson.") +
           win(A + "app-reader.webp", "Reading a lesson", [(35, 55), (59, 27), (79, 45), (35, 93)]) + '<p class="cap">Reader with the teacher\'s guide open on the right.</p>' +
           '<div class="row" style="margin-top:3mm"><div style="flex:1.1">' + legend([("The book page.", "Clear, large, in the learner's own language."), ("Zoom.", "Fill the screen for a class or a small phone."), ("How to teach this lesson.", "Introduction, development, conclusion and check."), ("Page turning.", "Swipe, tap the arrows or use the keyboard.")]) + '</div>' +
           '<div style="flex:1"><div class="call blue"><b>For teachers.</b> The guide beside each lesson suggests how to open it, what to demonstrate, and how to check understanding. It saves planning time and supports newer teachers.</div>' +
           '<div class="g2" style="margin-top:3mm">' + fc("books", "c2", "Whole library", "Books and exams for every class, offline.") + fc("pencil-simple-line", "c5", "Notes and marking", "Learners keep their own work.") + '</div></div></div>' +
           '<div class="hero-band" style="margin-top:4mm"><h2>Every class and subject is included</h2><p>The full library ships inside the app, so there is nothing to download later and no data cost for learners.</p></div>')

    d.page(head("For teachers", "Plan, timetable and grade in minutes", "The tools teachers spend evenings on, done for them and always open to review and change.") +
           '<div class="row"><div style="flex:1.15">' + win(A + "app-lessonplan.webp", "Lesson plan", [(50, 50), (94, 9)]) + '<p class="cap">REB lesson plan, filled from the scheme of work.</p></div>' +
           '<div style="flex:1"><h2 class="s">Lesson plans</h2>' + ck(["Uses the official REB template", "Filled from the real scheme of work", "English, French or Kinyarwanda", "Whole unit at once, with minutes per stage", "Print or save as PDF"]) +
           '<h2 class="s" style="margin-top:3mm">Homework and worksheets</h2>' + ck(["Set homework from any unit or quiz", "Follow who has finished", "Printable worksheets and class tests"]) + '</div></div>' +
           '<div class="row" style="margin-top:4mm"><div style="flex:1">' + win(A + "app-timetable.webp", "School timetable", [(30, 17)]) + '<p class="cap">Conflict free timetable, one click.</p></div>' +
           '<div style="flex:1">' + win(A + "app-gradebook.webp", "Gradebook", [(58, 25), (68, 60)]) + '<p class="cap">Mastery heatmap for a whole class.</p></div></div>' +
           '<div class="g3" style="margin-top:3mm">' + fc("calendar-check", "c6", "Timetable generator", "Double periods, morning or afternoon preferences, no clashes.", True) + fc("chart-bar", "c4", "Gradebook", "Quizzes, exams and homework in one grid.", True) + fc("users-three", "c7", "Teacher coaching", "Prompts that show which topics need re-teaching.", True) + '</div>')

    d.page(head("Marking and families", "Mark with the answer beside the work, and keep parents informed", "Teachers review answers quickly, and parents receive a clear report, even without internet.") +
           '<div class="row"><div style="flex:1.35">' + win(A + "app-answerkeys.webp", "Answer keys", [(35, 17), (50, 58)]) + '<p class="cap">Answer keys for the past papers. The teacher reviews, edits and confirms.</p></div>' +
           '<div style="flex:1">' + legend([("Filters.", "Show only unconfirmed answers, or all of them."), ("Model answers.", "Confirm each one once and marking becomes automatic.")]) +
           '<h2 class="s" style="margin-top:2mm">Marking</h2>' + ck(["Written answers appear with the model answer beside them", "Optional voice comments for the learner", "Written exam answers are compared with the confirmed key"]) + '</div></div>' +
           '<div class="row" style="margin-top:5mm"><div style="flex:1">' + legend([("Learner and class.", "Pick the child and see progress at a glance."), ("Numbers parents understand.", "Lessons, practice, exam form and attendance."), ("QR code.", "A parent scans it with any phone camera and reads the summary, offline.")]) +
           '<h2 class="s" style="margin-top:2mm">Reports</h2>' + ck(["Printable learner reports", "Attendance log for the school day", "Insights and an impact report for partners"]) + '</div>' +
           '<div style="flex:1.35">' + win(A + "app-parents.webp", "Parent reports", [(30, 20), (50, 38), (78, 75)]) + '<p class="cap">Parent report with attendance and an offline QR code.</p></div></div>' +
           '<div class="call" style="margin-top:4mm"><b>No internet for parents either.</b> The QR code holds the summary itself, so a parent can read it on any phone without a connection or an account.</div>')

    d.page(head("For school managers", "See the whole school, control who sees what", "Four roles keep things simple. Each profile sees only the classes and subjects it should.") +
           '<div class="row"><div style="flex:1.25">' + win(A + "app-overview.webp", "Class overview", [(8, 45), (75, 4), (45, 47), (50, 78)]) + '<p class="cap">Class overview for a teacher or manager.</p></div>' +
           '<div style="flex:1">' + legend([("Menu by role.", "Only the tools each person needs."), ("Class selector.", "Switch between P1 and P6 at any time."), ("At a glance.", "Learners, lessons done, exams taken."), ("Learners.", "Open any learner to see their progress.")]) + '</div></div>' +
           '<h2 class="s" style="margin-top:4mm">Four roles</h2><table class="tb"><tr><th>Role</th><th>Sees</th><th>Can do</th></tr>' +
           '<tr><td>Learner</td><td>Their own class and work</td><td>Study, practise, take exams</td></tr><tr><td>Subject teacher</td><td>Their subjects and classes</td><td>Plan, set homework, mark</td></tr>' +
           '<tr><td>Class teacher</td><td>Their whole class</td><td>Reports, attendance, parents</td></tr><tr><td>School manager</td><td>The whole school</td><td>Staff, timetable, insights, backups</td></tr></table>' +
           '<div class="g3" style="margin-top:4mm">' + fc("database", "c9", "Backups", "USB auto backup and whole school export, so nothing is lost.", True) + fc("wifi-high", "c6", "Sync on the school network", "Devices share records over the school Wi-Fi or a hotspot.", True) + fc("lock-key", "c2", "Private by design", "Records stay on school devices. Cloud is optional.", True) + '</div>' +
           '<div class="hero-band" style="margin-top:5mm"><div class="row"><div style="flex:1"><h2>Evidence, not guesses</h2><p>Insights show which topics are hardest, how learners are progressing and whether teachers are using the tools. An impact report turns it into pages a partner or district officer can read.</p></div>' +
           '<div style="width:48mm">' + ck(["Hardest questions", "Weak topics by class", "Progress by gender", "Impact report"]) + '</div></div></div>')

    d.page(head("Get started", "Installed and teaching in an afternoon", "We help with the first set up, then your teachers take it from there.") +
           steps([("Request a demo", "We show the app with your class and subjects."), ("Install", "Windows installer or Android app. No internet needed."), ("Set up staff", "Create profiles, classes and subjects."), ("Teach", "Plan, practise, mark and report.")]) +
           '<div class="row" style="margin-top:5mm"><div style="flex:1"><h2 class="s">Requirements</h2><table class="tb"><tr><th></th><th>Windows</th><th>Android</th></tr><tr><td>System</td><td>Windows 10 or 11, 64 bit</td><td>Android 7.0 or newer</td></tr><tr><td>Storage</td><td>About 2 GB</td><td>About 2 GB</td></tr><tr><td>Internet</td><td>Not needed</td><td>Not needed</td></tr><tr><td>Sync</td><td>School network, optional cloud</td><td>School network, optional cloud</td></tr></table></div>' +
           '<div style="flex:1"><h2 class="s">Licences and support</h2>' + ck(["Licensed per school, with clear dates", "The apps keep working offline if a licence ends", "Training for teachers and school leaders", "A support desk for licensed schools", "Updates and teaching guides"]) + '</div></div>' +
           "<h2 class=\"s\" style=\"margin-top:5mm\">Questions we hear often</h2>" +
           '<div class="g2"><div class="fc soft"><h3>Do we need internet at school?</h3><p>No. Every lesson, exercise and exam works offline. The internet is only used if you choose the optional cloud.</p></div>' +
           '<div class="fc soft"><h3>Can teachers change the plans?</h3><p>Yes. Lesson plans, timetables and marks are suggestions. Everything can be reviewed and edited.</p></div>' +
           '<div class="fc soft"><h3>What if a computer is lost?</h3><p>Records are backed up to USB and can be restored. With sync on, other devices hold the same records.</p></div>' +
           '<div class="fc soft"><h3>Who sees learner data?</h3><p>Only people signed in with a role that allows it. Records stay on the school\'s devices.</p></div></div>' +
           cta("Ready to see it in your school?", "Ask for a demo, a quote or a trial. We reply within two working days.") +
           '<p class="sm" style="margin-top:4mm">Smart School App uses Rwanda Basic Education Board (REB) curriculum materials. EduSmart Consult is an independent company and this guide is not an official REB publication.</p>')
    d.build()


# ================================================================== SMART SCHOOL CLOUD
def cloud_guide():
    d = Doc("Smart-School-Cloud-guide", "Smart School Cloud product guide")
    d.cover(cover_block("Smart School<br><em>Cloud</em>", "Browser access and safe sync for every device in your school, with a Support Console that keeps it healthy.",
                        ["Web app", "Device sync", "Join with a code", "Optional and private"],
                        [("1", "code joins a device"), ("Web + Windows + Android", "one school record"), ("Offline", "always keeps working")],
                        '<div style="position:absolute;left:14mm;right:14mm;top:0"><div style="width:160mm">' + win(IMG + "con-schools.jpg", "Support Console") + '</div>' +
                        '<div style="position:absolute;right:0;top:34mm;width:66mm">' + win(IMG + "con-licences.jpg", "Licences") + '</div></div>', "ssa-logo-512.png", 128))

    d.page(head("What it is", "The online side of Smart School App", "Open the app in any browser, and keep records in step across Windows computers and Android phones whenever there is a connection. Offline use never stops working.") +
           '<div class="g3">' + fc("globe-hemisphere-east", "c6", "Web app", "Sign in from any browser. Nothing to install. Roles limit what each person sees.") + fc("wifi-high", "c4", "Device sync", "Records from every device merge into one school record. Nothing is overwritten by mistake.") + fc("lock-key", "c2", "Your school in control", "Sync is optional and off until a manager turns it on. Local backups keep working.") + '</div>' +
           '<div class="hero-band" style="margin-top:5mm"><h2>Merged, never replaced</h2><p>If two devices change the same record while offline, the cloud combines them by date. An old device can never erase newer work, and a device with the wrong clock is corrected automatically.</p></div>' +
           '<h2 class="s" style="margin-top:5mm">How records travel</h2>' + steps([("Work offline", "Teach, mark and practise as normal on any device."), ("Connect", "When there is internet, the device syncs on its own."), ("Merge", "The cloud combines changes from every device."), ("Everyone in step", "Each device receives what it was missing.")]) +
           '<div class="call blue" style="margin-top:5mm"><b>Optional by design.</b> A school can use the apps fully offline and add the cloud later, or never. Nothing about learners leaves the school unless a manager turns sync on.</div>')

    d.page(head("Join in one step", "A short code, not a server address and a long key", "A school manager makes a code in the app or asks us for one. Each device then holds its own access, which can be removed at any time.") +
           steps([("Make a code", "In the app or from the Support Console. Looks like ABCD-EFGH."), ("Type it in", "On the new device, choose Join with a code."), ("Device registered", "It appears in the school's device list."), ("Removed any time", "A lost phone loses access at once.")]) +
           '<div class="row" style="margin-top:5mm"><div style="flex:1.3">' + win(IMG + "con-school.jpg", "School page in the Support Console", [(14, 22), (48, 62), (72, 10)]) + '<p class="cap">A school\'s page: onboarding checklist, devices, licence and health. Sample data.</p></div>' +
           '<div style="flex:1">' + legend([("Onboarding checklist.", "Shows what is set up and what is next."), ("Devices and versions.", "See when each device last synced."), ("Join codes and licence.", "Tabs for codes, devices, people and settings.")]) + '</div></div>' +
           '<div class="g2" style="margin-top:4mm">' + fc("shield-check", "c4", "Codes are safe", "Codes expire, work on a limited number of devices and are stored only as a fingerprint.") + fc("phone-call", "c6", "Recovery", "If a manager forgets a PIN, support can set a temporary one with the school's permission.") + '</div>')

    d.page(head("Support Console", "Everything support needs, in one place", "For EduSmart Consult staff and, with limited views, partners. Every sensitive action is written to an audit trail.") +
           win(IMG + "con-overview.jpg", "Support Console overview", [(8, 45), (50, 30), (60, 60)]) + '<p class="cap">The console overview with sample data: schools, learners, sync activity and what needs attention.</p>' +
           '<div class="row" style="margin-top:3mm"><div style="flex:1">' + legend([("Menu.", "Schools, onboarding, devices, licences, groups and support."), ("Numbers.", "Schools active this week, learners, health scores."), ("Attention list.", "Schools that have not synced or whose licence is ending.")]) + '</div>' +
           '<div style="flex:1"><div class="g2">' + fc("briefcase", "c5", "Licences", "Dates, plans, grace periods and reminders.") + fc("users-three", "c7", "School groups", "Networks and programmes.") + fc("target", "c3", "Support desk", "Cases, notes and history.") + fc("chart-bar", "c1", "Reports", "Usage and health over time.") + '</div></div></div>' +
           '<div class="hero-band" style="margin-top:4mm"><div class="row"><div style="flex:1"><h2>Every sensitive action is recorded</h2><p>Resetting a PIN, making a code or changing a licence needs the right role and is written to an audit trail. PIN resets also need the school\'s permission.</p></div>' +
           '<div style="width:44mm">' + ck(["Roles: owner, support, viewer", "Two step sign in", "Full audit trail"]) + '</div></div></div>')

    d.page(head("For partners and funders", "Read only dashboards, scoped to the schools they support", "A district officer or partner sees the schools in their own province, district or programme group, and nothing else.") +
           '<div class="row"><div style="flex:1">' + win(IMG + "con-licences.jpg", "Licences", [(50, 22), (60, 62)]) + '<p class="cap">Licence register with expiry dates. Sample data.</p></div>' +
           '<div style="flex:1">' + legend([("Summary.", "Active, ending soon, in grace period, expired."), ("Every school.", "Plan, end date and learner limit at a glance.")]) + '<h2 class="s" style="margin-top:3mm">What a viewer account gets</h2>' + ck(["Overview and analytics for their schools only", "Licence and health lists", "No learner records and no settings", "No way to change anything"]) + '</div></div>' +
           '<div class="hero-band" style="margin-top:4mm"><h2>Clear licences, no surprises</h2><p>When a licence ends there is a grace period. After that, cloud sync pauses but the apps keep working offline, so lessons are never blocked.</p></div>' +
           '<div class="g3" style="margin-top:4mm">' + fc("clock", "c6", "Clock safety", "Wrong device dates cannot overwrite newer work.", True) + fc("wifi-high", "c4", "Live status page", "Anyone can check that the service is up.", True) + fc("shield-check", "c2", "Error reports", "Optional, with personal details removed.", True) + '</div>' +
           '<div class="row" style="margin-top:4mm"><div style="flex:1.3">' + win(IMG + "con-schools.jpg", "All schools", [(30, 40), (50, 74)]) + '<p class="cap">Every school with its health score and last sync. Sample data.</p></div>' +
           '<div style="flex:1">' + legend([("Health at a glance.", "A score shows which schools need attention first."), ("Last sync.", "See who has not connected for a while.")]) + '</div></div>')

    d.page(head("Get started", "Add the cloud when you are ready", "Cloud sync is rolled out school by school. We set up your school account and help you connect your first devices.") +
           steps([("Request access", "Tell us about your school."), ("We set up your account", "School record, licence and a first join code."), ("Connect devices", "Type the code on each computer and phone."), ("Press Sync now", "Records flow, and stay in step.")]) +
           '<div class="row" style="margin-top:5mm"><div style="flex:1"><h2 class="s">Good to know</h2>' + ck(["Every feature works offline; the cloud only adds browser access and sync", "Windows and Android share the same records", "Nothing is lost if the internet drops during sync", "Only signed in people with the right role see learner data"]) + '</div>' +
           '<div style="flex:1"><h2 class="s">Security in short</h2>' + ck(["Connections use HTTPS", "Passwords and keys stored as one way hashes", "Staff can use two step sign in", "Sensitive actions need school permission and are logged"]) + '</div></div>' +
           "<h2 class=\"s\" style=\"margin-top:5mm\">Questions we hear often</h2>" +
           '<div class="g2"><div class="fc soft"><h3>Do we need the cloud to use the app?</h3><p>No. Every feature works offline. The cloud only adds browser access and sync between devices.</p></div>' +
           '<div class="fc soft"><h3>What if the internet drops during sync?</h3><p>Nothing is lost. The device keeps its records and syncs again next time.</p></div>' +
           '<div class="fc soft"><h3>Can Windows and Android share records?</h3><p>Yes. A teacher can mark on a phone and see it on the school computer.</p></div>' +
           '<div class="fc soft"><h3>What happens when a licence ends?</h3><p>The apps keep working offline. Cloud sync pauses after a grace period until the licence is renewed.</p></div></div>' +
           cta("Talk to us about Smart School Cloud", "We reply within two working days."))
    d.build()


# ================================================================== AMATEGEKO
def amategeko_guide():
    d = Doc("Amategeko-Umuhanda-guide", "Amategeko y'Umuhanda guide")
    d.cover(cover_block("Amategeko<br><em>y'Umuhanda</em>", "Practise for the Rwanda provisional driving licence theory test, in Kinyarwanda, English or French.",
                        ["Web", "Windows", "Android", "Try free in your browser"],
                        [("328", "practice questions"), ("126", "road signs"), ("20 in 20", "timed mock exam")],
                        '<div style="position:absolute;left:14mm;right:14mm;top:0"><div style="width:156mm">' + win(IMG + "amg-d-answered.jpg", "Amategeko y'Umuhanda") + '</div>' +
                        '<div style="position:absolute;right:0;top:16mm">' + phone(IMG + "amg-m-home.jpg", "width:46mm") + '</div></div>', "amategeko-logo.png", 130))

    d.page(head("What is inside", "Everything a candidate needs to practise", "Questions, road signs, markings, lessons and a timed mock exam, in one clean app that works on a phone.") +
           win(IMG + "amg-d-answered.jpg", "Practice", [(20, 30), (15, 75)]) + '<p class="cap">Practice with a sign question. The answer is marked and explained after each choice.</p>' +
           '<div class="row" style="margin-top:3mm"><div style="flex:1">' + legend([("Pick a topic.", "General, road signs, lights, markings, speed, and more."), ("Answer.", "Green is correct, red is wrong, with a short explanation.")]) + '</div>' +
           '<div style="flex:1.6"><div class="g3">' + fc("target", "c3", "Practice that finds gaps", "Missed questions come back first.") + fc("clock", "c6", "Timed mock exam", "20 questions in 20 minutes, marked out of 20.") + fc("map-pin", "c5", "Road signs", "By family, with search and meaning.") +
           fc("lightbulb", "c4", "Markings and lights", "Clear pictures of markings, lights and police signals.") + fc("book-open", "c2", "Glossary and flashcards", "Learn the words used in the road code.") + fc("chart-bar", "c1", "Your progress", "See readiness, weak topics and scores.") + '</div></div></div>')

    d.page(head("Signs and markings", "Learn every sign by sight", "126 road signs and a picture guide to road markings, traffic lights and police signals.") +
           '<div class="row"><div style="flex:1.2">' + win(IMG + "amg-d-signs.jpg", "Road signs", [(25, 12), (55, 40)]) + '<p class="cap">Road signs grouped by family, with search.</p></div>' +
           '<div style="flex:1.2">' + win(IMG + "amg-d-markings.jpg", "Markings and signals", [(25, 12), (55, 40)]) + '<p class="cap">Road markings shown as clear pictures.</p></div></div>' +
           '<div class="row" style="margin-top:3mm"><div style="flex:1">' + legend([("Filter by family.", "Warning, priority, prohibitory, mandatory, information, direction."), ("Tap a sign.", "See its code and what it means.")]) + '</div>' +
           '<div style="flex:1.2"><div class="g2">' + fc("translate", "c6", "Three languages", "Kinyarwanda first. English and French at any time.") + fc("device-mobile", "c4", "Made for phones", "Large answer buttons and a menu that stays out of the way.") + '</div></div></div>' +
           '<div class="row" style="margin-top:4mm"><div style="flex:1">' + phone(IMG + "amg-m-signs.jpg") + '</div><div style="flex:2;padding-top:2mm"><h2 class="s">On a phone too</h2><p class="lead" style="font-size:9.4pt">The web app has a phone layout with a slide out menu, large tap targets and sign pictures that stay sharp. Add it to your home screen and practise anywhere.</p>' + ck(["Works in any modern browser", "Progress is saved on your device", "No account with us is needed"]) + '</div></div>' +
           '<div class="g3" style="margin-top:4mm">' + fc("book-open", "c2", "Lessons", "Short lessons with the key points, before you practise.", True) + fc("file-text", "c5", "Revision sheets", "Print a sheet of the questions you find hardest.", True) + fc("graduation-cap", "c4", "Certificate of practice", "Earn a printable certificate by passing a mock exam.", True) + '</div>')

    d.page(head("Free and full", "Try free in your browser, unlock everything with a code", "Open the web app with no sign up. A code from your driving school or from EduSmart Consult unlocks the full content.") +
           '<table class="tb"><tr><th></th><th>Free sample</th><th>Full version</th></tr><tr><td>Practice questions</td><td>40</td><td>328</td></tr><tr><td>Road signs</td><td>36</td><td>126</td></tr><tr><td>Glossary terms</td><td>15</td><td>61</td></tr><tr><td>Lessons</td><td>2</td><td>8</td></tr><tr><td>Traffic law documents</td><td>Not included</td><td>Included</td></tr><tr><td>Timed mock exam</td><td>Yes</td><td>Yes</td></tr><tr><td>Progress and exam history</td><td>Yes</td><td>Yes</td></tr></table>' +
           '<h2 class="s" style="margin-top:5mm">Three steps</h2>' + steps([("Open the web app", "No download. Create a small profile with a name and a PIN."), ("Practise", "Questions, signs and a timed mock exam."), ("Unlock", "Press Unlock full version and type your code.")]) +
           '<div class="row" style="margin-top:5mm"><div style="flex:1"><div class="call blue"><b>For driving schools.</b> One code can serve many candidates. Each learner uses their own phone, and the school sees who is ready in the Windows or Android app.</div>' +
           '<div class="g2" style="margin-top:3mm">' + fc("desktop", "c1", "Windows program", "Fully offline, for shared computers.", True) + fc("device-mobile", "c4", "Android app", "Fully offline, on the candidate's phone.", True) + '</div></div>' +
           '<div style="flex:.7;text-align:center">' + phone(IMG + "amg-m-practice.jpg", "width:38mm") + '</div></div>')

    d.page(head("Good to know", "Honest answers before you start", "") +
           '<h2 class="s">Practise like it is the real test</h2><div class="g3">' +
           fc("clock", "c6", "Use the timer", "Take a full mock exam of 20 questions in 20 minutes, marked out of 20.", True) + fc("lightbulb", "c5", "Read every option", "Some questions offer 'none of the answers'. Read all options before you choose.", True) + fc("target", "c3", "Learn from mistakes", "After each answer read the explanation. Missed questions come back first.", True) + '</div>' +
           '<h2 class="s" style="margin-top:5mm">Common questions</h2>' +
           '<div class="g2"><div class="fc soft"><h3>Do I need the internet?</h3><p>You need a connection to open the web app and to unlock. After you unlock, the full content is kept in your browser.</p></div>' +
           '<div class="fc soft"><h3>Will I lose my progress?</h3><p>It is saved in your browser on your device. It stays unless you clear browser data. Use the backup option in Settings.</p></div>' +
           '<div class="fc soft"><h3>How many devices can use my code?</h3><p>Each code has a limit set when it was made, such as one phone for a learner or thirty for a driving school.</p></div>' +
           '<div class="fc soft"><h3>Is this the official exam?</h3><p>No. It is a practice tool by EduSmart Consult, not an official Rwanda National Police or government product. Always check current official texts too.</p></div></div>' +
           '<div class="hero-band" style="margin-top:6mm"><div class="row"><div style="flex:1"><h2>Start practising today</h2><p>Open the web app, or ask us for a code, a driving school licence or the Windows and Android apps.</p></div><div style="width:44mm;text-align:center"><div class="big" style="color:#fad201;font-size:24pt">Free</div><p style="font-size:8.4pt">sample in your browser</p></div></div></div>' +
           cta("Ask for a code or a driving school licence", "We reply within two working days."))
    d.build()


# ================================================================== COMPANY / MARKETING
def company_brochure():
    d = Doc("EduSmart-Consult-brochure", "EduSmart Consult brochure")
    d.cover(cover_block("Better <em>Research</em><br>Stronger <em>Education</em><br>Brighter <em>Futures</em>", "EduSmart Consult LTD is a Rwandan company working where education, research and technology meet.",
                        ["Education", "Research", "Software", "Data", "ICT"],
                        [("9", "departments"), ("Kigali", "Rwanda"), ("Offline first", "tools built for real classrooms")],
                        '<div style="position:absolute;left:16mm;right:16mm;top:0"><div style="width:120mm">' + win(A + "app-learner.webp", "Smart School App") + '</div>' +
                        '<div style="position:absolute;right:0;top:-4mm">' + phone(A + "phone-teacher.webp", "width:40mm") + '</div>' +
                        '<div style="position:absolute;left:80mm;top:34mm;width:74mm">' + win(IMG + "amg-d-signs.jpg", "Amategeko y'Umuhanda") + '</div></div>', None, 128))

    d.page(head("Who we are", "Practical education and technology, made in Kigali", "We are a private company limited by shares, registered in Rwanda. Our main activity is education, supported by consulting, research, data and computer systems services.") +
           '<p class="lead" style="font-size:10pt">Smart School App came out of one question: what would a Rwandan primary school need if it had no reliable internet? The answer shaped everything we build.</p>' +
           '<div class="g3">' + fc("lock-key", "c2", "Private by design", "Records stay with the school or organisation. Online features are optional and explained plainly.") + fc("wifi-high", "c4", "Offline first", "If it needs the internet to teach a lesson, it is not finished. Our tools work offline first.") + fc("hand-heart", "c7", "People in control", "Software should save time, not replace judgement. Every automatic result can be reviewed and changed.") + '</div>' +
           '<h2 class="s" style="margin-top:6mm">What we do</h2><div class="g3">' +
           fc("graduation-cap", "c1", "Education and Training", "Teacher and school leader training, tutoring, learning resources and assessment design.") +
           fc("hand-heart", "c7", "Inclusive and Special Needs Education", "Support so every learner can take part.") +
           fc("magnifying-glass", "c6", "Research and Consulting", "Studies, evaluation and evidence for programmes.") +
           fc("desktop", "c2", "E-Learning and Digital Learning", "Digital courses and learning platforms.") +
           fc("code", "c3", "Web and Software Development", "Websites and apps built to your needs.") +
           fc("database", "c9", "Data and Information Services", "Collection, analysis and reporting.") +
           fc("shield-check", "c5", "ICT and Computer Systems Support", "Set up, repair and support for schools and offices.") +
           fc("globe-hemisphere-east", "c4", "Environmental and Technical Consulting", "Technical advice for projects.") +
           fc("briefcase", "c8", "Administrative, Fundraising and Equipment Support", "Help with proposals, procurement and administration.") + '</div>' +
           '<div class="hero-band mk" style="margin-top:5mm"><div class="row"><div style="flex:1"><h2>Based in Kigali, working across Rwanda</h2><p>Itetero, Nyagatovu, Kimironko, Gasabo, Kigali. Registered company, Rwanda.</p></div><div class="contact">+250 782 368 555<br>hagenalexis2000@gmail.com</div></div></div>')

    d.page(head("Our products", "Tools that work where the internet does not", "Built and tested with Rwandan schools in mind. Each one runs on ordinary computers and phones.") +
           '<div class="hero-band"><div class="row"><div style="flex:1.05"><h2>Smart School App</h2><p>The complete offline learning and school management suite for Primary 1 to Primary 6, on Windows and Android.</p>' + ck(["Full curriculum library and 62 national exam papers", "REB lesson plans, timetables, marking, gradebook", "Parent reports with an offline QR code"]) + '</div>' +
           '<div style="flex:1">' + win(A + "app-overview.webp", "Smart School App") + '</div></div></div>' +
           '<div class="row" style="margin-top:4mm"><div style="flex:1"><div class="fc soft"><h2 class="s">Smart School Cloud</h2><p style="margin-bottom:2mm">Browser access and safe sync between devices, with a Support Console. Optional and private.</p>' + win(IMG + "con-schools.jpg", "Support Console") + '</div></div>' +
           '<div style="flex:1"><div class="fc soft"><h2 class="s">Amategeko y\'Umuhanda</h2><p style="margin-bottom:2mm">Road code theory practice with 328 questions and 126 road signs. Try it free in a browser.</p>' + win(IMG + "amg-d-answered.jpg", "Amategeko y'Umuhanda") + '</div></div></div>' +
           '<div class="g3" style="margin-top:4mm"><div class="stat"><div class="big">P1 to P6</div><span>every class and subject</span></div><div class="stat"><div class="big">3</div><span>languages: Kinyarwanda, English, French</span></div><div class="stat"><div class="big" style="font-size:15pt">Windows, Android, Web</div><span>same account, same content</span></div></div>')

    d.page(head("Why schools choose us", "Simple, honest and easy to start", "We keep it practical: a short call, a written scope, staged delivery and support after handover.") +
           steps([("Talk to us", "A short call to understand the need."), ("Written scope", "A clear scope and quote."), ("Staged delivery", "Review points along the way."), ("Handover and support", "Training and help after we finish.")]) +
           '<div class="row" style="margin-top:5mm"><div style="flex:1"><h2 class="s">Who we work with</h2>' + ck(["Schools that want practical, hands on teacher training", "Training providers that need course materials and learner records", "Projects that need to prepare teachers to use new tools", "Organisations that need research, evaluation or digital tools"]) + '</div>' +
           '<div style="flex:1"><h2 class="s">What you can count on</h2>' + ck(["Plain language, no jargon", "Tools that keep working when the internet does not", "Training for the people who will use them", "Clear licences and clear prices"]) + '</div></div>' +
           '<div class="hero-band" style="margin-top:5mm"><div class="row"><div style="flex:1"><h2>Try before you decide</h2><p>Open the demo school of Smart School App or the free sample of Amategeko y\'Umuhanda in your browser. No sign up.</p></div><div style="width:46mm">' + phone(IMG + "amg-m-home.jpg", "width:36mm") + '</div></div></div>' +
           cta("Talk to us about your school or organisation", "We reply to every enquiry within two working days.", "<br>Itetero, Nyagatovu, Kimironko"))
    d.build()


if __name__ == "__main__":
    which = sys.argv[1:] or ["app", "cloud", "amategeko", "company"]
    for w in which:
        {"app": app_guide, "cloud": cloud_guide, "amategeko": amategeko_guide, "company": company_brochure}[w]()
