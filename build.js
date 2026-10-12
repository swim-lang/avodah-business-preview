/* Avodah Business — tiny static build.
   Assembles src/partials + src/pages/*.html into flat, ready-to-serve
   pages at the project root (same output shape as Traffic + Employment).

   Each page starts with a meta comment:
     <!--meta {"title": "...", "description": "...", "loader": true} -->
   Run:  node build.js
*/
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const VERSION = "20261012j"; // cache-buster for css/js

const partial = (name) => fs.readFileSync(path.join(SRC, "partials", name + ".html"), "utf8");

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

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

pages.forEach((file) => {
  const raw = fs.readFileSync(path.join(SRC, "pages", file), "utf8");
  const match = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!match) throw new Error(`${file}: missing <!--meta {...} --> header`);
  const meta = JSON.parse(match[1]);
  const body = expandGuides(raw.slice(match[0].length));

  const html = partial("head")
    .replace(/{{title}}/g, escapeAttr(meta.title))
    .replace(/{{description}}/g, escapeAttr(meta.description))
    .replace(/{{bodyClass}}/g, meta.loader ? "is-loading" : "")
    .replace(/{{v}}/g, VERSION) +
    (meta.loader ? partial("loader") : "") +
    partial("header") +
    (meta.nav ? `  <main data-nav="${meta.nav}">\n` : "  <main>\n") + body + "  </main>\n\n" +
    partial("footer").replace(/{{v}}/g, VERSION);

  fs.writeFileSync(path.join(ROOT, file), html);
  console.log("built", file);
});
