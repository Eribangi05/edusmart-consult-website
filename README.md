# EduSmart Consult website

A fast static website (no server code, no database). It works on any web host.

## Pages
- index.html: home
- smart-school-app.html: product page, features, downloads, licences, FAQ
- services.html, about.html, contact.html, privacy.html, 404.html

## Before publishing (three settings, all in `assets/config.js`)
1. **Downloads.** The Windows installer and Android APK are about 2 GB each, too big for normal web hosting.
   Upload them to GitHub Releases (repos `smart-school-app` and `smart-school-app-android`),
   Google Drive or OneDrive, then paste the direct links into `windowsUrl` and `androidUrl`.
   While a link is empty, the button says "Request the download" and opens the contact form.
2. **Contact form.** Create a free form endpoint at formspree.io (or similar), paste it into `formEndpoint`.
   While empty, the form opens the visitor's email app with the message ready to send.
3. **Domain.** In `build.py` change `SITE_URL` if the domain is not www.edusmartconsult.com, then run `python build.py`.

## Editing text
All page copy is in `build.py`. Edit it, then run:

    python build.py

This regenerates every page with the same header and footer. Styles are in `assets/styles.css`.

## Publishing
Upload the whole folder (except `build.py` and `README.md` if you wish) to any host:
Netlify or Cloudflare Pages (drag and drop the folder), GitHub Pages, or cPanel hosting (public_html).
Point edusmartconsult.com to the host, and enable HTTPS.

## Local preview

    python -m http.server 8793

Then open http://localhost:8793

## Later: integrating the online school platform
The Smart School App cloud sync server (repo "Cloud Sync Server") and a browser version can be linked from the
"Web" card on the product page by filling `webAppUrl` in `config.js`.

## Icons
Duotone icons in assets/icons are from Phosphor Icons (https://phosphoricons.com), MIT licence, copyright 2023 Phosphor Icons.

## Content you can change without code
* **Announcements bar** (top of every page): edit `content/announcements.json`. It updates for visitors without a rebuild. The page `editor.html` prepares the file for you.
* **News articles**: edit `content/news.json` (or use `editor.html`), then run `python build.py` and upload.
* **Team, partners, testimonials**: `content/team.json`, `content/partners.json`, `content/testimonials.json`. Empty lists show friendly "coming soon" messages. Only add real, agreed content.
* **Prices**: `pricing` in `assets/config.js`.
* **Statistics**: `analytics` in `assets/config.js` (Plausible, off by default, visitors must opt in).
* **Domain and Google**: see DOMAIN-SETUP.md and SEO-SETUP.md.

## Amategeko y'Umuhanda web app (/amategeko/)

The browser version of the road code app is generated from the Windows app, not written by hand.

```
python tools/amategeko/build.py
python build.py
```

- Reads `RwandaTheoryApp/AmategekoWindows` (override with the `AMG_SRC` environment variable) and writes `amategeko/`. Run it again after the app or its content changes.
- The public site holds only a free sample (40 questions, 36 signs, 15 terms, 2 lessons). The full content is written to `Cloud Sync Server/content-theory/` and is handed out by the server only for an unlock code. Create codes in the Support Console under **Road code codes**.
- `tools/amategeko/web-shim.js` replaces the Electron bridge (storage, files, unlock). `web.css` adds the phone layout. The Windows app is never modified.
- The landing page is `road-code.html` (not `amategeko.html`, which would clash with the folder under clean URLs).
- Deploy order: push the cloud server first (so unlock works), then deploy the site.
