#!/usr/bin/env node
/* =========================================================
   La Esmeralda — SEO build step
   Run after editing js/menu-data.js, the hours, or the domain:

       node scripts/build.mjs

   It updates files in place (no dist folder):
     • menu.html   – pre-rendered menu + Menu / Breadcrumb structured data
     • index.html  – Restaurant / WebSite structured data
     • sitemap.xml – page list with today's date
     • robots.txt, every page's canonical/og tags – switched to SITE_URL
   ========================================================= */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

/* ---------- Business facts: edit here ---------- */
const SITE_URL = "https://laesmeraldalevelland.com"; // no trailing slash

const BUSINESS = {
  name: "La Esmeralda Restaurante y Tortillería",
  alternateName: ["La Esmeralda", "Tortilleria La Esmeralda"],
  description:
    "Family-owned Mexican restaurant and tortillería in Levelland, Texas serving breakfast burritos, guisados, weekend menudo and homemade flour and corn tortillas.",
  telephone: "+1-806-897-1240",
  priceRange: "$",
  address: {
    streetAddress: "301 West Ave",
    addressLocality: "Levelland",
    addressRegion: "TX",
    postalCode: "79336",
    addressCountry: "US",
  },
  geo: { latitude: 33.590244, longitude: -102.3867133 },
  // Matches Google Business Profile (Nov 2026). Sunday is closed.
  hours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "06:00", closes: "14:00" }],
  googleMaps: "https://maps.google.com/?cid=2342102564549496735",
  facebook: "https://www.facebook.com/LaEsmeralda301/",
  doordash: "https://www.doordash.com/store/tortilleria-la-esmeralda-levelland-35293631/",
};

/* ---------- Helpers ---------- */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(root, f), "utf8");
const write = (f, s) => writeFileSync(join(root, f), s);
const abs = (path) => `${SITE_URL}/${path.replace(/^\//, "")}`;

// swap the content between <!-- build:NAME --> and <!-- /build:NAME -->, keeping indentation
const inject = (html, name, content) => {
  const re = new RegExp(`([ \\t]*)<!-- build:${name} -->[\\s\\S]*?<!-- /build:${name} -->`);
  if (!re.test(html)) throw new Error(`marker build:${name} not found`);
  return html.replace(re, (_, pad) => {
    const body = content
      .split("\n")
      .map((line) => (line ? pad + line : line))
      .join("\n");
    return `${pad}<!-- build:${name} -->\n${body}\n${pad}<!-- /build:${name} -->`;
  });
};

const jsonLd = (data) => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;

// "from $6.00" / "$2.75 ea" → "6.00"
const parsePrice = (label) => label?.match(/\$\s*(\d+(?:\.\d{1,2})?)/)?.[1];

/* ---------- Load the menu data + templates the browser uses ---------- */
const sandbox = { window: {}, document: { getElementById: () => null } };
vm.createContext(sandbox);
vm.runInContext(read("js/menu-data.js"), sandbox);
vm.runInContext(read("js/menu.js"), sandbox);
const MENU = sandbox.window.MENU;
const menuHtml = sandbox.window.renderMenu(MENU);

/* ---------- Structured data ---------- */
const RESTAURANT_ID = `${SITE_URL}/#restaurant`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const restaurant = {
  "@type": "Restaurant",
  "@id": RESTAURANT_ID,
  name: BUSINESS.name,
  alternateName: BUSINESS.alternateName,
  description: BUSINESS.description,
  url: `${SITE_URL}/`,
  logo: abs("images/brand/logo.png"),
  image: [abs("images/social/og-image.jpg"), abs("images/home/hero.jpg"), abs("images/home/tortillas-stack.jpg")],
  telephone: BUSINESS.telephone,
  priceRange: BUSINESS.priceRange,
  servesCuisine: ["Mexican", "Tex-Mex", "Breakfast"],
  acceptsReservations: false,
  hasMenu: abs("menu.html"),
  address: { "@type": "PostalAddress", ...BUSINESS.address },
  geo: { "@type": "GeoCoordinates", ...BUSINESS.geo },
  hasMap: BUSINESS.googleMaps,
  areaServed: [
    { "@type": "City", name: "Levelland, TX" },
    { "@type": "AdministrativeArea", name: "Hockley County, TX" },
  ],
  openingHoursSpecification: BUSINESS.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  amenityFeature: ["Dine-in", "Drive-thru", "Takeout", "Delivery", "High chairs"].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  potentialAction: {
    "@type": "OrderAction",
    target: { "@type": "EntryPoint", urlTemplate: BUSINESS.doordash, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
  },
  sameAs: [BUSINESS.facebook, BUSINESS.googleMaps, BUSINESS.doordash],
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: "La Esmeralda",
  alternateName: BUSINESS.name,
  inLanguage: "en-US",
  publisher: { "@id": RESTAURANT_ID },
};

const menuItem = (item, i) => {
  const out = {
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    image: abs(item.image),
  };
  if (item.prices?.length) {
    out.offers = item.prices
      .filter((p) => parsePrice(p.price))
      .map((p) => ({ "@type": "Offer", name: p.name, price: parsePrice(p.price), priceCurrency: "USD" }));
  } else if (parsePrice(item.price)) {
    out.offers = { "@type": "Offer", price: parsePrice(item.price), priceCurrency: "USD" };
  }
  return out;
};

const menu = {
  "@type": "Menu",
  "@id": `${SITE_URL}/menu.html#menu`,
  name: "La Esmeralda Menu",
  url: abs("menu.html"),
  inLanguage: "en-US",
  hasMenuSection: MENU.map((section) => ({
    "@type": "MenuSection",
    name: section.title,
    alternateName: section.kicker,
    ...(section.note ? { description: section.note } : {}),
    hasMenuItem: section.items.map(menuItem),
  })),
};

const breadcrumbs = {
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Menu", item: abs("menu.html") },
  ],
};

/* ---------- Write pages ---------- */
const PAGES = ["index.html", "menu.html", "404.html"];

// switch every absolute link from whatever domain the canonical tag currently uses
const currentOrigin = read("index.html").match(/<link rel="canonical" href="(https?:\/\/[^/"]+)/)?.[1];
const retarget = (s) => (currentOrigin && currentOrigin !== SITE_URL ? s.split(currentOrigin).join(SITE_URL) : s);

let index = retarget(read("index.html"));
index = inject(index, "site-jsonld", jsonLd({ "@context": "https://schema.org", "@graph": [restaurant, website] }));
write("index.html", index);

let menuPage = retarget(read("menu.html"));
menuPage = inject(
  menuPage,
  "menu-jsonld",
  jsonLd({ "@context": "https://schema.org", "@graph": [{ ...menu, mainEntityOfPage: abs("menu.html"), provider: { "@id": RESTAURANT_ID } }, breadcrumbs] })
);
menuPage = inject(menuPage, "menu", menuHtml.trim().replace(/\n\s*/g, "\n"));
write("menu.html", menuPage);

write("404.html", retarget(read("404.html")));

/* ---------- robots.txt + sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10);
write(
  "robots.txt",
  `User-agent: *
Allow: /
Disallow: /scripts/

Sitemap: ${SITE_URL}/sitemap.xml
`
);

const urls = [
  { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "monthly", images: ["images/social/og-image.jpg", "images/home/hero.jpg", "images/home/tortilla-hands.jpg", "images/home/tortillas-stack.jpg"] },
  { loc: abs("menu.html"), priority: "0.9", changefreq: "monthly", images: [...new Set(MENU.flatMap((s) => s.items.map((i) => i.image)))] },
];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${u.images.map((img) => `    <image:image><image:loc>${abs(img)}</image:loc></image:image>`).join("\n")}
  </url>`
  )
  .join("\n")}
</urlset>
`
);

console.log(`Built for ${SITE_URL}: ${MENU.reduce((n, s) => n + s.items.length, 0)} menu items, ${PAGES.length} pages, sitemap dated ${today}.`);
