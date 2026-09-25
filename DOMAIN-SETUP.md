# Connect edusmartconsult.com (custom domain with HTTPS)

You need to own the domain first. If you do not, buy it from a registrar (for example Namecheap, Porkbun or GoDaddy).
A .com costs roughly 10 to 15 USD a year. A Rwandan .rw domain is registered through a Rwanda registrar.

## With Cloudflare Pages (recommended)
1. Cloudflare dashboard, Workers & Pages, your project `edusmart-consult`, tab **Custom domains**, **Set up a custom domain**.
2. Enter `www.edusmartconsult.com`. If the domain is not on Cloudflare yet, Cloudflare offers to add it for free.
   Follow the steps to change the domain's **nameservers** at your registrar to the two Cloudflare nameservers shown.
3. Wait until the domain shows **Active** (minutes to a few hours). HTTPS is created automatically.
4. Add `edusmartconsult.com` (without www) as a second custom domain and set it to redirect to www.
5. Tell Claude the final address, or edit `SITE_URL` in `build.py` and run `python build.py`, then upload again. This updates
   canonical links, the sitemap, social previews and search data.

## After the domain works
* Submit `https://www.edusmartconsult.com/sitemap.xml` in Google Search Console (see SEO-SETUP.md).
* Update the Smart School App "Internet sync" address only if you also move the cloud server to a new domain.
