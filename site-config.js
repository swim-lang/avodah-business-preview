"use strict";

const SITE = {
  name: "Avodah Business",
  productionUrl: "https://www.earleybusinesslegal.com",
  previewUrl: "https://avodah-business.vercel.app",
  phoneDisplay: "(804) 234-3183",
  phoneE164: "+18042343183",
  ogImage: "/assets/photos/color-team-wide.jpg",
};

const ROUTES = {
  "index.html": "/",
  "about-us.html": "/about-us/",
  "our-team.html": "/our-team/",
  "justin-earley.html": "/our-team/justin/",
  "team-andrew-hemby.html": "/teams/andrew/",
  "team-chris-rohde.html": "/teams/chris/",
  "team-blair-brake.html": "/teams/blair/",
  "business-formation.html": "/virginia-business-formation-lawyer/",
  "llc-formation.html": "/virginia-business-formation-lawyer/limited-liability-company/",
  "registering-an-llc.html": "/virginia-business-formation-lawyer/limited-liability-company-formation/process-of-registering/",
  "operating-agreement-benefits.html": "/virginia-business-formation-lawyer/operating-agreement/benefits/",
  "creating-an-operating-agreement.html": "/virginia-business-formation-lawyer/operating-agreement/creating/",
  "partnership-agreement.html": "/virginia-business-formation-lawyer/partnership-agreement/",
  "creating-a-partnership-agreement.html": "/virginia-business-formation-lawyer/partnership-agreement/creating/",
  "richmond-business-formation.html": "/richmond-business/formation-lawyer/",
  "mergers-acquisitions.html": "/virginia-business-merger-and-acquisitions-lawyer/",
  "small-pe-funds.html": "/virginia-business-merger-and-acquisitions-lawyer/small-pe-funds-and-deal-counsel/",
  "sell-your-growth-business.html": "/virginia-business-merger-and-acquisitions-lawyer/sell-your-growth-business-legal-guide-for-founders/",
  "legacy-owner-business-sale.html": "/virginia-business-merger-and-acquisitions-lawyer/business-sale-legacy-owner-legal-guide/",
  "eta-buying-your-first-business.html": "/virginia-business-merger-and-acquisitions-lawyer/eta-buying-your-first-business/",
  "strategic-acquisition-guide.html": "/virginia-business-merger-and-acquisitions-lawyer/strategic-acquisition-guide/",
  "commercial-contracts.html": "/virginia-commercial-contracts-lawyer/",
  "handshake-legal.html": "/handshake-legal/",
  "handshake-beneficial-ownership-information.html": "/handshake-legal/beneficial-ownership-information/",
  "handshake-confidentiality-agreement-assignment-of-ip.html": "/handshake-legal/confidentiality-agreement-assignment-of-ip/",
  "handshake-convertible-note.html": "/handshake-legal/convertible-note/",
  "handshake-copyright-filing.html": "/handshake-legal/copyright-filing/",
  "handshake-form-1099-independent-contractor-agreement.html": "/handshake-legal/form-1099-independent-contractor-agreement/",
  "handshake-form-nda.html": "/handshake-legal/form-nda/",
  "handshake-form-waiver.html": "/handshake-legal/form-waiver/",
  "handshake-letter-of-intent.html": "/handshake-legal/letter-of-intent/",
  "handshake-llc-organization.html": "/handshake-legal/llc-organization/",
  "handshake-master-services-agreement-sow.html": "/handshake-legal/master-services-agreement-sow/",
  "handshake-offer-letter.html": "/handshake-legal/offer-letter/",
  "handshake-operating-partnership-agreement.html": "/handshake-legal/operating-partnership-agreement/",
  "handshake-privacy-policy.html": "/handshake-legal/privacy-policy/",
  "handshake-safe-agreement.html": "/handshake-legal/safe-agreement/",
  "handshake-terms-of-use.html": "/handshake-legal/terms-of-use/",
  "handshake-trademark-filing.html": "/handshake-legal/trademark-filing/",
  "engagement-letter.html": "/engagement-letter/",
  "testimonials.html": "/testimonials/",
  "testimonial-archive.html": "/testimonial/",
  "testimonial-high-growth-tech-company.html": "/testimonial/high-growth-tech-company/",
  "testimonial-owner-of-software-company-in-25m-sale.html": "/testimonial/owner-of-software-company-in-25m-sale/",
  "testimonial-serial-entrepreneur.html": "/testimonial/serial-entrepreneur/",
  "testimonial-serial-entrepreneur-2.html": "/testimonial/serial-entrepreneur-2/",
  "testimonial-series-a-tech-company.html": "/testimonial/series-a-tech-company/",
  "offices.html": "/nap/",
  "office-richmond.html": "/nap/earley-business-legal/",
  "office-northern-va.html": "/nap/northern-va/",
  "contact.html": "/contact/",
};

// Source templates kept for reference but intentionally excluded from public builds.
const INTERNAL_FILES = new Set(["static-page.html"]);

const NOINDEX_FILES = new Set([
  "testimonial-archive.html",
  "testimonial-high-growth-tech-company.html",
  "testimonial-owner-of-software-company-in-25m-sale.html",
  "testimonial-serial-entrepreneur.html",
  "testimonial-serial-entrepreneur-2.html",
  "testimonial-series-a-tech-company.html",
]);

const CANONICAL_OVERRIDES = {
  "testimonial-archive.html": "/testimonials/",
  "testimonial-high-growth-tech-company.html": "/testimonials/",
  "testimonial-owner-of-software-company-in-25m-sale.html": "/testimonials/",
  "testimonial-serial-entrepreneur.html": "/testimonials/",
  "testimonial-serial-entrepreneur-2.html": "/testimonials/",
  "testimonial-series-a-tech-company.html": "/testimonials/",
};

const REDIRECT_ROUTES = {
  "/teams/": "/our-team/",
  "/privacy-policy/": "/handshake-legal/privacy-policy/",
  "/terms/": "/handshake-legal/terms-of-use/",
  "/testimonial/": "/testimonials/",
  "/testimonial/high-growth-tech-company/": "/testimonials/",
  "/testimonial/owner-of-software-company-in-25m-sale/": "/testimonials/",
  "/testimonial/serial-entrepreneur/": "/testimonials/",
  "/testimonial/serial-entrepreneur-2/": "/testimonials/",
  "/testimonial/series-a-tech-company/": "/testimonials/",
};

const routeForFile = (file) => ROUTES[file] || `/${file}`;

module.exports = {
  SITE,
  ROUTES,
  NOINDEX_FILES,
  CANONICAL_OVERRIDES,
  REDIRECT_ROUTES,
  INTERNAL_FILES,
  routeForFile,
};
