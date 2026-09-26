# Creates a 1200x630 social preview image for every page (used by Facebook, WhatsApp, LinkedIn and Google).
# Run automatically by build.py. Delete assets/og/*.png to regenerate them.
import os, json
try:
    from PIL import Image, ImageDraw, ImageFont
except Exception:      # Pillow missing: the site falls back to the default image
    Image = None

OG_PAGES = [
 ("index", "Education, research and digital solutions in Rwanda", "EduSmart Consult LTD | Kigali"),
 ("products", "Software we build for Rwanda", "23 apps for schools, families, savings groups and businesses"),
 ("smart-school-app", "Smart School App", "Offline learning and school management for Primary 1 to 6"),
 ("smart-school-cloud", "Smart School Cloud", "Use the app in a browser and sync every device"),
 ("about", "About EduSmart Consult", "Better Research | Stronger Education | Brighter Futures"),
 ("contact", "Contact us", "Kigali, Rwanda | +250 782 368 555"),
 ("privacy", "Privacy", "How we handle your information"),
 ("request", "Request a demo or quote", "Tell us what you need. We reply within two working days"),
 ("downloads", "Downloads", "Smart School App for Windows, Android and online"),
 ("news", "News and teaching tips", "Updates, guides and ideas from EduSmart Consult"),
 ("tour", "Take the tour", "Smart School App, screen by screen"),
 ("try", "Try Smart School App live", "Open the demo school in your browser, no sign up"),
 ("pricing", "Pricing and licences", "Licensed per school, with training included"),
 ("team", "Our team", "The people behind EduSmart Consult"),
 ("partners", "Partners and careers", "Work and grow with us"),
 ("stories", "Success stories", "What schools and partners say"),
 ("search", "Search the site", "Find pages, products and guides"),
 ("education-training", "Education and Training", "Programmes for teachers, leaders and learners"),
 ("inclusive-education", "Inclusive and Special Needs Education", "So every learner can take part and progress"),
 ("research-consulting", "Research and Consulting", "Evidence for decisions"),
 ("elearning", "E-Learning and Digital Learning", "Platforms that work where connectivity is limited"),
 ("software-development", "Web and Software Development", "Websites, portals and systems built around how you work"),
 ("data-information", "Data and Information Services", "Clean, well organised information you can rely on"),
 ("ict-support", "ICT and Computer Systems Support", "Keeping systems and data facilities running"),
 ("environmental-technical", "Environmental and Technical Consulting", "Technical advice for people and places"),
 ("admin-support", "Administrative, Fundraising and Equipment Support", "Behind the scenes support that keeps a project moving"),
 ("road-code", "Amategeko y'Umuhanda", "Road code theory practice, free in your browser"),
 ("try", "Try Smart School App live", "Open the demo school in your browser, no sign up"),
 ("terms", "Terms of use", "The terms for using this website and our products"),
 ("licence-agreement", "Licence agreement", "What a school licence for Smart School App includes"),
 ("security", "Security", "How Smart School Cloud protects school records"),
 ("child-safety", "Child safety", "How our products protect the children who use them"),
 ("help", "Help centre", "Answers to common questions about our apps"),
 ("status", "Service status", "Live status of Smart School Cloud"),
]
try:
    _news = json.load(open(os.path.join(ROOT, "content", "news.json"), encoding="utf-8"))
except Exception:
    _news = []
for _p in _news:
    OG_PAGES.append(("news-" + _p["slug"], _p["title"], _p.get("category", "News") + " | EduSmart Consult"))

def _font(name, size):
    for base in ("C:/Windows/Fonts/", "/usr/share/fonts/truetype/dejavu/"):
        for n in (name, "DejaVuSans-Bold.ttf"):
            p = os.path.join(base, n)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def _wrap(draw, text, font, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def make_og(slug, title, sub):
    out = os.path.join(ROOT, "assets", "og", slug + ".png")
    if os.path.exists(out): return
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), "#041f52")
    d = ImageDraw.Draw(im)
    for y in range(H):                      # vertical navy gradient
        t = y / H; c = (int(4 + 6 * t), int(31 + 30 * t), int(82 + 60 * t)); d.line([(0, y), (W, y)], fill=c)
    d.rectangle([0, H - 14, W // 3, H], fill="#06307a"); d.rectangle([W // 3, H - 14, 2 * W // 3, H], fill="#0aa0f0"); d.rectangle([2 * W // 3, H - 14, W, H], fill="#fdb813")
    logo = Image.open(os.path.join(ROOT, "assets", "logo-stacked.png")).convert("RGBA")
    bg = Image.new("RGBA", (300, 300), (255, 255, 255, 255)); logo.thumbnail((260, 260)); bg.paste(logo, ((300 - logo.width) // 2, (300 - logo.height) // 2), logo)
    mask = Image.new("L", (300, 300), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, 299, 299], 36, fill=255)
    im.paste(bg.convert("RGB"), (W - 360, 70), mask)
    f1, f2, f3 = _font("segoeuib.ttf", 64), _font("segoeui.ttf", 32), _font("segoeuib.ttf", 26)
    d.text((70, 70), "EDUSMART CONSULT", font=f3, fill="#fdb813")
    lines = _wrap(d, title, f1, 700)[:4]
    y = 140
    for ln in lines:
        d.text((70, y), ln, font=f1, fill="#ffffff"); y += 78
    for ln in _wrap(d, sub, f2, 700)[:2]:
        d.text((70, y + 14), ln, font=f2, fill="#cfe0ff"); y += 42
    d.text((70, H - 70), "www.edusmartconsult.com", font=_font("segoeui.ttf", 26), fill="#8fb1ee")
    im.save(out, optimize=True)

if Image:
    os.makedirs(os.path.join(ROOT, "assets", "og"), exist_ok=True)
    for _s, _t, _u in OG_PAGES:
        make_og(_s, _t, _u)
