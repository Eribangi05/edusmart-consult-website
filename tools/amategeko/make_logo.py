"""Turns the supplied Amategeko y'Umuhanda logo (a badge on a white square) into transparent PNGs at the sizes each place needs.

Run from the website folder:   python tools/amategeko/make_logo.py
Reads:   the newest image in RwandaTheoryApp/New logo for this app (currently "Approved logo.png")
Writes:  website assets, the Windows app, the Android app (launcher icons) and a Play Store icon. Nothing is deleted except the
         old launcher vector files that the new PNG icons replace."""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
PROJ = os.environ.get("AMG_PROJ") or r"C:\Users\ingab\AndroidStudioProjects\RwandaTheoryApp"
def _latest_logo():
    """the approved logo is whichever image was saved last in the logo folder"""
    d = os.path.join(PROJ, "New logo for this app")
    files = [os.path.join(d, f) for f in os.listdir(d) if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))] if os.path.isdir(d) else []
    return max(files, key=os.path.getmtime) if files else os.path.join(d, "Approved logo.png")


SRC = _latest_logo()


def transparent_logo():
    im = Image.open(SRC).convert("RGB")
    w, h = im.size
    work = im.copy()
    MARK = (255, 0, 255)
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(work, seed, MARK, thresh=42)          # only the white that touches the corners, never the white inside the badge
    px = work.load()
    mask = Image.new("L", im.size, 255)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == MARK:
                mp[x, y] = 0
    mask = mask.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.1))   # pull the edge in a little to lose the white halo
    mask = mask.point(lambda v: 0 if v < 40 else (255 if v > 215 else int((v - 40) * 255 / 175)))
    rgba = im.convert("RGBA")
    rgba.putalpha(mask)
    return rgba.crop(rgba.getbbox())


def square(logo, size, pad=0.04, bg=None):
    """the logo, fitted into a square canvas with a little breathing room"""
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    inner = int(size * (1 - 2 * pad))
    l = logo.copy()
    l.thumbnail((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(l, ((size - l.width) // 2, (size - l.height) // 2))
    return canvas


def save(img, *parts):
    p = os.path.join(*parts)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    img.save(p, optimize=True)
    print("  wrote", os.path.relpath(p, os.path.dirname(SITE)) if p.startswith(os.path.dirname(SITE)) else p, img.size)


def main():
    if not os.path.exists(SRC):
        sys.exit("Logo not found: " + SRC)
    logo = transparent_logo()
    print("logo cropped to", logo.size)
    if os.environ.get("LOGO_PREVIEW"):
        prev = Image.new("RGBA", (logo.width, logo.height), (18, 30, 70, 255)); prev.alpha_composite(logo); prev.convert("RGB").save(os.environ["LOGO_PREVIEW"])
        return

    big = logo.copy(); big.thumbnail((1024, 1024), Image.LANCZOS)

    # ---- website
    save(big, SITE, "assets", "amategeko-logo.png")
    save(square(logo, 512), SITE, "assets", "products", "amategeko.png")
    save(square(logo, 192, 0.06), SITE, "assets", "amategeko-192.png")

    # ---- Windows app (also the source for the web app)
    win = os.path.join(PROJ, "AmategekoWindows", "assets", "icons")
    if os.path.isdir(win):
        save(square(logo, 512, 0.03), win, "appicon.png")
        save(big, win, "logo.png")

    # ---- Android app: legacy PNG launcher icons, an adaptive foreground, and a Play Store icon
    res = os.path.join(PROJ, "app", "src", "main", "res")
    if os.path.isdir(res):
        for d, px in [("mdpi", 48), ("hdpi", 72), ("xhdpi", 96), ("xxhdpi", 144), ("xxxhdpi", 192)]:
            ic = square(logo, px, 0.02)
            save(ic, res, "mipmap-" + d, "ic_launcher.png")
            round_ = Image.new("RGBA", (px, px), (0, 0, 0, 0))
            circle = Image.new("L", (px * 4, px * 4), 0)
            ImageDraw.Draw(circle).ellipse((0, 0, px * 4 - 1, px * 4 - 1), fill=255)
            circle = circle.resize((px, px), Image.LANCZOS)
            base = Image.new("RGBA", (px, px), (255, 255, 255, 255))
            fitted = square(logo, px, 0.10)
            base.alpha_composite(fitted)
            round_.paste(base, (0, 0), circle)
            save(round_, res, "mipmap-" + d, "ic_launcher_round.png")
        fg = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
        f = logo.copy(); f.thumbnail((262, 262), Image.LANCZOS)
        fg.alpha_composite(f, ((432 - f.width) // 2, (432 - f.height) // 2))
        save(fg, res, "drawable-nodpi", "ic_launcher_foreground.png")
        for old in [("drawable", "ic_launcher_foreground.xml"), ("mipmap", "ic_launcher.xml"), ("mipmap", "ic_launcher_round.xml")]:
            p = os.path.join(res, *old)
            if os.path.exists(p):
                os.remove(p); print("  removed old", "/".join(old))
        # adaptive icons: same foreground, white background, and no single colour "monochrome" layer (it would flatten a full colour logo)
        for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
            open(os.path.join(res, "mipmap-anydpi-v26", name), "w", encoding="utf-8").write(
                '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
                '    <background android:drawable="@color/ic_launcher_background" />\n    <foreground android:drawable="@drawable/ic_launcher_foreground" />\n</adaptive-icon>\n')
        open(os.path.join(res, "values", "ic_launcher_background.xml"), "w", encoding="utf-8").write(
            '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FFFFFF</color>\n</resources>\n')
        save(square(logo, 512, 0.03, (255, 255, 255, 255)).convert("RGB"), PROJ, "store-listing", "icon-512.png")


main()
