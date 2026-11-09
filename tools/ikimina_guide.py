"""Builds assets/brochures/Ikimina-guide.pdf (A4) from tools/ikimina_guide_content.py, using headless Chromium (Playwright for Node).

Run from the website folder:   python tools/ikimina_guide.py
Needs: node with the 'playwright' package. Screenshots are in assets/ikimina-guide/."""
import importlib.util, os, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
spec = importlib.util.spec_from_file_location("brochures", os.path.join(HERE, "brochures.py")); B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
B.A = "file://" + ROOT + "/assets/"
from ikimina_guide_content import SECTIONS, GI
IMG = "file://" + ROOT + "/" + GI
esc = B.esc


def block(b):
    t = b[0]
    if t == "shots":
        items = b[1]; ds = [x for x in items if x[0] == "d"]
        if len(ds) == len(items):
            n = len(items)
            wd = {1: "100%", 2: "58%", 3: "48%"}.get(n, "48%")
            cells = "".join('<div style="width:%s;margin:0 %s 3mm;min-width:0">%s<p class="cap"><b>%s.</b> %s</p></div>' % (wd, "auto" if n < 3 else "0", B.win(IMG + f + ".jpg", ttl), esc(ttl), esc(cap)) for _, f, ttl, cap in items)
            return '<div style="margin:3mm 0;%s">%s</div>' % ("display:flex;flex-wrap:wrap;justify-content:space-between" if n >= 3 else "", cells)
        w = {1: 68, 2: 58, 3: 54, 4: 43}.get(len(items), 43)
        cells = "".join('<div style="flex:1;text-align:center">%s<p class="cap"><b>%s.</b> %s</p></div>' % (B.phone(IMG + f + ".jpg", "width:%dmm" % w), esc(ttl), esc(cap)) for _, f, ttl, cap in items)
        return '<div class="row" style="margin:3mm 0;justify-content:space-around">%s</div>' % cells
    if t == "steps": return '<div style="margin:3mm 0">%s</div>' % B.steps(b[1])
    if t == "bullets": return B.ck(b[1])
    if t == "call": return '<div class="call%s" style="margin:3mm 0">%s</div>' % (" blue" if b[1] == "blue" else "", esc(b[2]))
    if t == "table":
        return '<table class="tb" style="margin:2mm 0 3mm"><tr>%s</tr>%s</table>' % ("".join("<th>%s</th>" % esc(h) for h in b[1]), "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % esc(c) for c in r) for r in b[2]))
    if t == "text": return "<p class='sm'>%s</p>" % esc(b[1])
    raise ValueError(t)


d = B.Doc("Ikimina-guide", "Ikimina user guide")
d.cover(B.cover_block("<em>Ikimina</em><br>User guide", "Everything your savings group needs to know: for members, the Accountant, the Secretary, the President and the EduSmart support team.",
                      ["Web", "Android", "Kinyarwanda", "English", "Français"], [("6", "roles"), ("18", "guide sections"), ("3", "languages")],
                      '<div style="position:absolute;left:14mm;right:14mm;top:0"><div style="width:156mm">' + B.win(IMG + "g-d-dashboard.jpg", "Ikimina") + '</div>' +
                      '<div style="position:absolute;right:0;top:18mm">' + B.phone(IMG + "g-m-home.jpg", "width:46mm") + '</div></div>', "ikimina-192.png", 128))
# contents page
toc = "".join('<tr><td>%d</td><td>%s</td><td>%s</td></tr>' % (i + 2, esc(s["title"]), esc(s["kick"])) for i, s in enumerate(SECTIONS))
d.page(B.head("Contents", "What is in this guide", "Use the section for your role. Members start at Getting started; officers read the sections for their own job.") +
       '<table class="tb"><tr><th style="width:14mm">Page</th><th>Section</th><th>For</th></tr>%s</table>' % toc.replace("<td>%d</td>" % 2, "<td>3</td>", 0))
for i, s in enumerate(SECTIONS):
    d.page(B.head(s["kick"], s["title"], s["lead"]) + "".join(block(b) for b in s["blocks"]))
d.page(B.head("Ready to start", "Set up your group with EduSmart Consult", "Open the demo, look at every screen, then ask us to set up your own group. We create the group, you choose who holds each role.") +
       '<div class="row" style="margin-top:4mm"><div style="flex:1">' + B.fc("globe-hemisphere-east", "c6", "Try it", "Open the web app at ikimina.edusmartconsult.rw. The demo has sample data only.", True) + '</div><div style="flex:1">' +
       B.fc("device-mobile", "c4", "On Android", "Download the test app from ikimina-apk.edusmartconsult.rw and allow installs from your browser.", True) + '</div></div>' +
       B.cta("Talk to us", "We set up your group, train your officers and support you."))
html = '<!doctype html><meta charset="utf-8"><title>Ikimina user guide</title><style>%s</style>%s' % (B.CSS, "".join(d.pages))
tmp = tempfile.mkdtemp(); src = os.path.join(tmp, "guide.html"); open(src, "w", encoding="utf-8").write(html)
out = os.path.join(ROOT, "assets", "brochures", "Ikimina-guide.pdf"); os.makedirs(os.path.dirname(out), exist_ok=True)
js = "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://%s');await p.waitForTimeout(1500);await p.pdf({path:'%s',format:'A4',printBackground:true,margin:{top:0,right:0,bottom:0,left:0},preferCSSPageSize:true});await b.close()})()" % (src, out)
open(os.path.join(tmp, "r.cjs"), "w").write(js)
subprocess.run(["node", os.path.join(tmp, "r.cjs")], check=True, env=dict(os.environ, NODE_PATH=subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()))
print("%s  %.1f MB  %d pages" % (out, os.path.getsize(out) / 1048576, len(d.pages)))
