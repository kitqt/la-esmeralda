# La Esmeralda — website

Static site for La Esmeralda Restaurante y Tortillería, 301 West Ave, Levelland, TX. No framework, no install step.

## Editing

- **Menu, prices, photos:** `js/menu-data.js`
- **Hours, phone, address, domain:** the `BUSINESS` / `SITE_URL` block at the top of `scripts/build.mjs`, plus the visible text in the Visit section and footer of `index.html` and `menu.html`

After any of those edits, run:

```bash
node scripts/build.mjs
```

It refreshes the pre-rendered menu in `menu.html` (so Google can read every dish and price), the structured data (Restaurant, Menu, Breadcrumb), `sitemap.xml`, `robots.txt`, and every canonical/social link. Running it twice changes nothing.

## Before going live

1. **Domain.** Pages are set up for `https://laesmeraldalevelland.com`. If you use a different domain, change `SITE_URL` in `scripts/build.mjs` and run the build. Every absolute link switches over.
2. **Google Business Profile.** The listing has no website yet. Add the domain there. It's the biggest local-search win.
3. **Google Search Console.** Verify the domain and submit `https://<domain>/sitemap.xml`. Bing Webmaster Tools can import it from Search Console.
4. **Rich results check.** Paste the live URL into https://search.google.com/test/rich-results to confirm the Restaurant and Menu data.

## What's included

| File | Purpose |
| --- | --- |
| `robots.txt`, `sitemap.xml` | Crawl rules and page and image list for search engines |
| `404.html` | Branded "page not found" page (Netlify, Cloudflare Pages and GitHub Pages pick it up automatically) |
| `site.webmanifest`, `images/icons/` | Home-screen icons for phones, favicon sizes |
| `images/social/og-image.jpg` | 1200×630 preview for links shared on Facebook, iMessage and X |
| `_headers` | Security and caching headers on Netlify or Cloudflare Pages |
