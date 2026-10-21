/* Avodah Business — tiny static build.
   Assembles src/partials + src/pages/*.html into flat, ready-to-serve
   pages at the project root (same output shape as Traffic + Employment).

   Each page starts with a meta comment:
     <!--meta {"title": "...", "description": "...", "loader": true} -->
   Run:  node build.js
*/
const fs = require("fs");
const path = require("path");
const {
  SITE,
  ROUTES,
  NOINDEX_FILES,
  CANONICAL_OVERRIDES,
  REDIRECT_ROUTES,
  routeForFile,
} = require("./site-config");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const VERSION = "20261021a"; // cache-buster for css/js
const INDEX_SITE = process.env.SEO_INDEX === "true";
const SITE_URL = (process.env.SITE_URL || SITE.productionUrl).replace(/\/$/, "");
const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || "";
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || "";

if (GA_MEASUREMENT_ID && !/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) {
  throw new Error("GA_MEASUREMENT_ID must be a valid GA4 web measurement ID (G-XXXXXXXXXX)");
}

const partial = (name) => fs.readFileSync(path.join(SRC, "partials", name + ".html"), "utf8");

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const PHOTO_DIMENSIONS = {
  "color-andrew.jpg": [750, 1000],
  "color-blair.jpg": [933, 1400],
  "color-chris.jpg": [933, 1400],
  "color-justin-conference.jpg": [1000, 1300],
  "color-justin-kitchen.jpg": [927, 1300],
  "color-justin.jpg": [708, 1000],
  "color-office.jpg": [1800, 1200],
  "color-team-kitchen.jpg": [1067, 1600],
  "color-team-table.jpg": [1044, 1200],
  "color-team-wide.jpg": [2000, 1059],
};

const IMAGE_DIMENSIONS = {
  ...PHOTO_DIMENSIONS,
  "wordmark-eggplant.svg": [3000, 461],
  "wordmark-ivory.svg": [3000, 461],
  "crest-eggplant.svg": [3000, 2732],
  "crest-ivory.svg": [3000, 2746],
};

const PRIORITY_PHOTO_PAGES = new Set([
  "about-us.html",
  "business-formation.html",
  "team-andrew-hemby.html",
  "team-blair-brake.html",
  "team-chris-rohde.html",
]);

const PERSON_PAGES = {
  "justin-earley.html": { name: "Justin Whitmel Earley", jobTitle: "Owner" },
  "team-andrew-hemby.html": { name: "Andrew Hemby", jobTitle: "Associate" },
  "team-chris-rohde.html": { name: "Chris Rohde", jobTitle: "Associate" },
  "team-blair-brake.html": { name: "Blair Brake", jobTitle: "Executive Assistant" },
};

const absoluteUrl = (pathname) => `${SITE_URL}${pathname === "/" ? "" : pathname}`;

const decodeText = (value) => value
  .replace(/<[^>]*>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&mdash;|&#8212;/g, "—")
  .replace(/&ndash;|&#8211;/g, "–")
  .replace(/&rsquo;|&#8217;/g, "’")
  .replace(/&ldquo;|&#8220;/g, "“")
  .replace(/&rdquo;|&#8221;/g, "”")
  .replace(/&nbsp;|&#160;/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const h1Text = (body, fallback) => {
  const match = body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? decodeText(match[1]) : fallback;
};

const breadcrumbsFor = (file, pageName) => {
  const crumbs = [{ name: "Home", path: "/" }];
  if (file === "index.html") return crumbs;

  if (file === "justin-earley.html" || file.startsWith("team-")) {
    crumbs.push({ name: "Our Team", path: ROUTES["our-team.html"] });
  } else if ([
    "llc-formation.html",
    "registering-an-llc.html",
    "operating-agreement-benefits.html",
    "creating-an-operating-agreement.html",
    "partnership-agreement.html",
    "creating-a-partnership-agreement.html",
  ].includes(file)) {
    crumbs.push({ name: "Business Formation", path: ROUTES["business-formation.html"] });
  } else if ([
    "small-pe-funds.html",
    "sell-your-growth-business.html",
    "legacy-owner-business-sale.html",
    "eta-buying-your-first-business.html",
    "strategic-acquisition-guide.html",
  ].includes(file)) {
    crumbs.push({ name: "Mergers & Acquisitions", path: ROUTES["mergers-acquisitions.html"] });
  } else if (file.startsWith("handshake-") && file !== "handshake-legal.html") {
    crumbs.push({ name: "Handshake Legal", path: ROUTES["handshake-legal.html"] });
  } else if (file.startsWith("testimonial-") && file !== "testimonials.html") {
    crumbs.push({ name: "Testimonials", path: ROUTES["testimonials.html"] });
  } else if (file.startsWith("office-") && file !== "offices.html") {
    crumbs.push({ name: "Offices", path: ROUTES["offices.html"] });
  }

  crumbs.push({ name: pageName, path: routeForFile(file) });
  return crumbs;
};

const schemaFor = (file, meta, body, canonical) => {
  const pageName = h1Text(body, meta.title.split("|")[0].trim());
  const breadcrumbs = breadcrumbsFor(file, pageName);
  const graph = [
    {
      "@type": "LegalService",
      "@id": `${SITE_URL}/#organization`,
      name: SITE.name,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/assets/wordmark-eggplant.svg`,
      image: `${SITE_URL}${SITE.ogImage}`,
      telephone: SITE.phoneE164,
      parentOrganization: {
        "@type": "LegalService",
        name: "Avodah Legal",
        url: "https://www.avodahlegal.com/",
      },
      founder: { "@id": `${SITE_URL}/our-team/justin/#person` },
      areaServed: { "@type": "State", name: "Virginia" },
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: "406 W Franklin Street",
          addressLocality: "Richmond",
          addressRegion: "VA",
          postalCode: "23220",
          addressCountry: "US",
        },
        {
          "@type": "PostalAddress",
          streetAddress: "107 E. Market Street",
          addressLocality: "Leesburg",
          addressRegion: "VA",
          postalCode: "20176",
          addressCountry: "US",
        },
      ],
      sameAs: ["https://www.avodahlegal.com/", "https://www.justinwhitmelearley.com/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE.name,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": file === "contact.html" ? "ContactPage" : "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: meta.title,
      description: meta.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${SITE.ogImage}` },
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    },
  ];

  if (PERSON_PAGES[file]) {
    graph.push({
      "@type": "Person",
      "@id": `${absoluteUrl(routeForFile(file))}#person`,
      name: PERSON_PAGES[file].name,
      jobTitle: PERSON_PAGES[file].jobTitle,
      description: meta.description,
      url: absoluteUrl(routeForFile(file)),
      worksFor: { "@id": `${SITE_URL}/#organization` },
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
};

const rewriteLocalUrls = (html) => html.replace(/\b(href|src)=(['"])([^'"]+)\2/g, (full, attr, quote, value) => {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(value)) return full;
  const match = value.match(/^([^?#]+)([?#].*)?$/);
  if (!match) return full;
  const pathname = match[1];
  const suffix = match[2] || "";
  if (ROUTES[pathname]) return `${attr}=${quote}${ROUTES[pathname]}${suffix}${quote}`;
  if (/^(?:assets|css|js)\//.test(pathname)) return `${attr}=${quote}/${pathname}${suffix}${quote}`;
  return full;
});

const optimizeImages = (html, file) => {
  let priorityPhotoUsed = false;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i);
    if (!src) return tag;
    const filename = src[1].split("/").pop();
    const dimensions = IMAGE_DIMENSIONS[filename];
    const isPhoto = Boolean(PHOTO_DIMENSIONS[filename]);
    let attrs = "";

    if (dimensions && !/\bwidth=/i.test(tag)) attrs += ` width="${dimensions[0]}" height="${dimensions[1]}"`;
    if (isPhoto && !/\bdecoding=/i.test(tag)) attrs += ' decoding="async"';

    const priority = isPhoto && PRIORITY_PHOTO_PAGES.has(file) && !priorityPhotoUsed;
    if (priority) {
      priorityPhotoUsed = true;
      if (!/\bfetchpriority=/i.test(tag)) attrs += ' fetchpriority="high"';
    } else if (isPhoto && !/\bloading=/i.test(tag)) {
      attrs += ' loading="lazy"';
    }

    return attrs ? tag.replace(/\s*\/>$/, `${attrs} />`) : tag;
  });
};

/* ---------- Guide sets (Formation + M&A): sidebar cards, Handshake card, pager ---------- */
const GUIDE_SETS = {
  formation: {
    label: "All formation guides", aria: "Formation guides",
    overview: { href: "business-formation.html", back: "Virginia Business Formation Lawyer", fwd: "Virginia Business Formation" },
    guides: [
      { file: "llc-formation.html", title: "Limited Liability Company (LLC)" },
      { file: "registering-an-llc.html", title: "Process of Registering an LLC" },
      { file: "operating-agreement-benefits.html", title: "Benefits of an Operating Agreement" },
      { file: "creating-an-operating-agreement.html", title: "Creating an Operating Agreement" },
      { file: "partnership-agreement.html", title: "Partnership Agreement" },
      { file: "creating-a-partnership-agreement.html", title: "Creating a Partnership Agreement" },
      { file: "richmond-business-formation.html", title: "Richmond Business Formation" },
    ],
  },
  ma: {
    label: "All M&amp;A guides", aria: "M&amp;A guides",
    overview: { href: "mergers-acquisitions.html", back: "Virginia Business Merger and Acquisitions Lawyer", fwd: "Virginia Business Merger and Acquisitions Lawyer" },
    guides: [
      { file: "small-pe-funds.html", title: "Small PE Funds and Deals" },
      { file: "sell-your-growth-business.html", title: "Selling Your Growth Business as a Founder" },
      { file: "legacy-owner-business-sale.html", title: "Selling Your Business as a Legacy Owner" },
      { file: "eta-buying-your-first-business.html", title: "ETA Lawyer for Buying Your First Business" },
      { file: "strategic-acquisition-guide.html", title: "Strategic Business Acquisition Guide" },
    ],
  },
};
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>';
const pad = (n) => String(n).padStart(2, "0");

const HANDSHAKE = {
  llc: {
    name: "LLC Organization", price: "$500",
    body: "Starting a new business? We\u2019ll get your LLC, EIN, and more in place.",
    href: "handshake-llc-organization.html",
  },
  oa: {
    name: "Operating / Partnership Agreement", price: "$3,500",
    body: "Have a company with multiple owners? Let us help you nail down your ownership rights.",
    href: "handshake-operating-partnership-agreement.html",
  },
  loi: {
    name: "Letter of Intent", price: "$2,000",
    body: "Lock in the price, structure and key terms up front, before the purchase agreement.",
    href: "handshake-letter-of-intent.html",
  },
};

// <!--guide-cards [ma] N--> : every guide in the set as a button card, N = current (0 = none)
const guideCards = (setKey, current) => {
  const set = GUIDE_SETS[setKey];
  return `<nav class="guide-cards" aria-label="${set.aria}">\n          <span class="side-list__label">${set.label}</span>\n` +
    set.guides.map((g, i) => {
      const on = i + 1 === current;
      return `          <a class="guide-card${on ? " is-current" : ""}" href="${g.file}"${on ? ' aria-current="page"' : ""}><span class="guide-card__title">${g.title}</span><span class="guide-card__chip">${ARROW}</span></a>`;
    }).join("\n") +
    `\n        </nav>`;
};

// <!--handshake llc|oa|loi--> : Cypress fixed-fee card
const handshakeCard = (key) => {
  const h = HANDSHAKE[key];
  return `<div class="handshake-card">
          <span class="handshake-card__label">Handshake Portal &middot; Fixed fee</span>
          <div class="handshake-card__head"><strong>${h.name}</strong><span>${h.price}</span></div>
          <p>${h.body}</p>
          <a class="handshake-card__btn" href="${h.href}">Get started ${ARROW}</a>
        </div>`;
};

// <!--guide-pager [ma] N--> : previous / next guide (the first goes back to the overview, the last forward to it)
const guidePager = (setKey, n) => {
  const { guides, overview } = GUIDE_SETS[setKey];
  const prev = n > 1 ? { label: `\u2190 Previous guide \u00b7 ${pad(n - 1)}`, title: guides[n - 2].title, href: guides[n - 2].file }
    : { label: "\u2190 Back to overview", title: overview.back, href: overview.href };
  const next = n < guides.length ? { label: `Next guide \u00b7 ${pad(n + 1)} \u2192`, title: guides[n].title, href: guides[n].file }
    : { label: "Back to the overview \u2192", title: overview.fwd, href: overview.href };
  return `<nav class="guide-pager" aria-label="More guides">
      <a class="guide-pager__link" href="${prev.href}"><small>${prev.label}</small><strong>${prev.title}</strong></a>
      <a class="guide-pager__link guide-pager__link--next" href="${next.href}"><small>${next.label}</small><strong>${next.title}</strong></a>
    </nav>`;
};

const expandGuides = (body) =>
  body
    .replace(/<!--guide-cards (?:(\w+) )?(\d+)-->/g, (_, set, n) => guideCards(set || "formation", +n))
    .replace(/<!--handshake (\w+)-->/g, (_, k) => handshakeCard(k))
    .replace(/<!--guide-pager (?:(\w+) )?(\d+)-->/g, (_, set, n) => guidePager(set || "formation", +n));

const pages = fs.readdirSync(path.join(SRC, "pages")).filter((f) => f.endsWith(".html"));

const pageMeta = {};

pages.forEach((file) => {
  const raw = fs.readFileSync(path.join(SRC, "pages", file), "utf8");
  const match = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!match) throw new Error(`${file}: missing <!--meta {...} --> header`);
  const meta = JSON.parse(match[1]);
  const body = expandGuides(raw.slice(match[0].length));
  const route = routeForFile(file);
  const canonicalPath = CANONICAL_OVERRIDES[file] || route;
  const canonical = absoluteUrl(canonicalPath);
  const indexable = INDEX_SITE && !NOINDEX_FILES.has(file);
  const robots = indexable ? "index, follow, max-image-preview:large" : (INDEX_SITE ? "noindex, follow" : "noindex, nofollow");
  const verification = GOOGLE_SITE_VERIFICATION
    ? `<meta name="google-site-verification" content="${escapeAttr(GOOGLE_SITE_VERIFICATION)}" />`
    : "";
  const analytics = GA_MEASUREMENT_ID
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_MEASUREMENT_ID}");</script>`
    : "";

  let html = partial("head")
    .replace(/{{title}}/g, escapeAttr(meta.title))
    .replace(/{{description}}/g, escapeAttr(meta.description))
    .replace(/{{robots}}/g, robots)
    .replace(/{{canonical}}/g, escapeAttr(canonical))
    .replace(/{{ogImage}}/g, escapeAttr(`${SITE_URL}${SITE.ogImage}`))
    .replace(/{{verification}}/g, verification)
    .replace(/{{analytics}}/g, analytics)
    .replace(/{{schema}}/g, schemaFor(file, meta, body, canonical))
    .replace(/{{bodyClass}}/g, meta.loader ? "is-loading" : "")
    .replace(/{{v}}/g, VERSION) +
    (meta.loader ? partial("loader") : "") +
    partial("header") +
    (meta.nav ? `  <main data-nav="${routeForFile(meta.nav)}">\n` : "  <main>\n") + body + "  </main>\n\n" +
    partial("footer").replace(/{{v}}/g, VERSION);

  html = rewriteLocalUrls(html);
  html = optimizeImages(html, file);

  fs.writeFileSync(path.join(ROOT, file), html);
  pageMeta[file] = { ...meta, route, canonical, indexable };
  console.log("built", file);
});

const sitemapRoutes = Object.entries(pageMeta)
  .filter(([, meta]) => meta.indexable)
  .map(([, meta]) => meta.canonical)
  .filter((value, index, values) => values.indexOf(value) === index)
  .sort();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map((url) => `  <url><loc>${url.replace(/&/g, "&amp;")}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

const robots = INDEX_SITE
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  : "User-agent: *\nDisallow: /\n";
fs.writeFileSync(path.join(ROOT, "robots.txt"), robots);

const routeRedirects = Object.entries(REDIRECT_ROUTES).map(([source, destination]) => ({
  source,
  destination,
  permanent: true,
}));
const htmlRedirects = Object.entries(ROUTES).map(([file, destination]) => ({
  source: `/${file}`,
  destination: CANONICAL_OVERRIDES[file] || destination,
  permanent: true,
}));
const rewrites = Object.entries(ROUTES).map(([file, source]) => ({ source, destination: `/${file}` }));
const headers = [
  {
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ...(!INDEX_SITE ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
    ],
  },
];

fs.writeFileSync(path.join(ROOT, "vercel.json"), `${JSON.stringify({
  $schema: "https://openapi.vercel.sh/vercel.json",
  framework: null,
  buildCommand: "node build.js",
  installCommand: "",
  outputDirectory: ".",
  cleanUrls: false,
  redirects: [...routeRedirects, ...htmlRedirects],
  rewrites,
  headers,
}, null, 2)}\n`);

console.log(`SEO mode: ${INDEX_SITE ? "production indexing" : "private preview"}`);
console.log(`Canonical base: ${SITE_URL}`);
