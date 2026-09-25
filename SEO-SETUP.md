# Google Search visibility

The site already has titles, descriptions, canonical links, a sitemap (`sitemap.xml`), `robots.txt`, social preview images
for every page (`assets/og/`), and structured data (organisation, breadcrumbs, articles, software application, site search).

## What you do once
1. Go to https://search.google.com/search-console and sign in with a Google account you control.
2. Add a property. Choose **URL prefix** and enter your final address, for example `https://www.edusmartconsult.com/`.
3. Choose the **HTML tag** verification method. Copy only the token from `content="..."` in the tag shown.
4. Open `build.py`, paste the token between the quotes on the line `GOOGLE_VERIFICATION = ""`, run `python build.py`, and upload the site.
5. Back in Search Console press **Verify**, then open **Sitemaps** and submit `sitemap.xml`.
6. Repeat for Bing at https://www.bing.com/webmasters if you like (it can import from Google).

## Keeping it healthy
* Publish a news article or two each month (see the Site editor page, `editor.html`).
* Every page should have one clear title and description. Edit them in `build.py`.
* Share links on WhatsApp or LinkedIn to see the preview image and text.
