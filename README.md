# Avodah Business — earleybusinesslegal.com refresh

Static design build of the seven approved pages plus the formation guides, M&A guides, Handshake Portal and every substantive page on the live sitemap (51 public pages; placeholder pages are retired), built on the same system as
`../avodah-traffic-site` and `../avodah-employment-site` (shared tokens, Serrif +
Jost, knot rule, crest, giant AVODAH footer, loader, reveal-on-scroll, overlay menu).

## Run it

```
npm run build        # render pages and prepare the deployment-safe dist/ directory
npm start            # http://localhost:4190  (PORT env var to change)
```

`viewer.html#page.html` shows any page in a 375px phone frame.
Add `?flat=1` to any URL to skip the loader and scroll reveals (for full-page captures).

## Structure

- `src/partials/` — head, loader (homepage only), header, footer
- `src/pages/` — one body file per page, with a `<!--meta {...} -->` header
- `css/styles.css` — shared chrome (from Traffic, Cypress loader, Signal "Business" label)
- `css/pages.css` — every page section, hero archetypes and closing bands
- `js/site.js` — loader, staggered reveals, overlay menu, server-gated inquiry form
- `api/intake.js` — Business inquiry endpoint, disabled until approved Resend configuration is present
- `assets/photos/` — retained headshots and approved main-site Richmond cityscape; provenance in `PHOTO-SOURCES.md`
- `site-config.js` — canonical host, legacy URL map, consolidation rules and crawl exclusions
- `SEO-LAUNCH-CHECKLIST.md` — production gates, cutover sequence and measurement setup
- `CONTENT-PARITY-NOTES.md` — record of what was preserved and what still needs client confirmation
- `tests/seo.test.js` — route, metadata, image, schema, form-safety and crawl-control checks
- `dist/` — generated hosting output containing only approved public pages and assets

## Motion (matches Traffic + Employment)

- Loader on the homepage only: crest + wordmark + "Business" on Cypress, knot rope
  "ties itself" as progress, minimum 3s, safety release at 7s.
- `.reveal-load` = hero elements, staggered by `--d` on page load.
- `.reveal` = everything else, fades up as it enters the viewport.
- Respects `prefers-reduced-motion`.

## Brand rules applied

- Each practice leads with its own color: Business = Aubergine heroes.
- On Aubergine / Cypress / Signal fields, only Travertine sits on top — never a
  second brand color. Signal is an accent on Travertine only.
- Photos of people are in color.

## WordPress URL mapping (keep live URLs)

| Static file | Live URL |
| --- | --- |
| index.html | / |
| about-us.html | /about-us/ |
| our-team.html | /our-team/ |
| justin-earley.html | /our-team/justin/ |
| business-formation.html | /virginia-business-formation-lawyer/ |
| mergers-acquisitions.html | /virginia-business-merger-and-acquisitions-lawyer/ |
| contact.html | /contact/ |
| llc-formation.html | /virginia-business-formation-lawyer/limited-liability-company/ |
| registering-an-llc.html | /virginia-business-formation-lawyer/limited-liability-company-formation/process-of-registering/ |
| operating-agreement-benefits.html | /virginia-business-formation-lawyer/operating-agreement/benefits/ |
| creating-an-operating-agreement.html | /virginia-business-formation-lawyer/operating-agreement/creating/ |
| partnership-agreement.html | /virginia-business-formation-lawyer/partnership-agreement/ |
| creating-a-partnership-agreement.html | /virginia-business-formation-lawyer/partnership-agreement/creating/ |
| richmond-business-formation.html | /richmond-business/formation-lawyer/ |
| handshake-legal.html | /handshake-legal/ |
| handshake-{product}.html (16) | /handshake-legal/{product}/ (privacy-policy also answers /privacy-policy/) |
| commercial-contracts.html | /virginia-commercial-contracts-lawyer/ |
| testimonials.html | /testimonials/ |
| testimonial-{slug}.html (5) | /testimonial/{slug}/ (recommend 301 → /testimonials/) |
| testimonial-archive.html | /testimonial/ |
| team-andrew-hemby.html, team-chris-rohde.html, team-blair-brake.html | /teams/andrew/, /teams/chris/, /teams/blair/ (/teams/ 301 → /our-team/) |
| engagement-letter.html | /engagement-letter/ |
| offices.html, office-richmond.html, office-northern-va.html | /nap/, /nap/earley-business-legal/, /nap/northern-va/ |
| (retired) blog, Lorem posts, author + category archives | Source remains parked in `src/unpublished/`; these routes intentionally return 404 until real editorial content is approved. |
| (internal) static-page.html | Source-only reference template; not included in `dist/` and `/static-page/` intentionally returns 404. |
| small-pe-funds.html | /virginia-business-merger-and-acquisitions-lawyer/small-pe-funds-and-deal-counsel/ |
| sell-your-growth-business.html | /virginia-business-merger-and-acquisitions-lawyer/sell-your-growth-business-legal-guide-for-founders/ |
| legacy-owner-business-sale.html | /virginia-business-merger-and-acquisitions-lawyer/business-sale-legacy-owner-legal-guide/ |
| eta-buying-your-first-business.html | /virginia-business-merger-and-acquisitions-lawyer/eta-buying-your-first-business/ |
| strategic-acquisition-guide.html | /virginia-business-merger-and-acquisitions-lawyer/strategic-acquisition-guide/ |

Formation and M&A guides share one template (M&A uses the Aubergine hero +
Cypress closing variants). `build.js` fills three placeholders from `GUIDE_SETS`:
`<!--guide-cards [ma] N-->` (sidebar cards, N = current guide, 0 = none),
`<!--handshake llc|oa|loi-->` (fixed-fee card) and `<!--guide-pager [ma] N-->` (prev/next).
`<main data-nav="...">` keeps the parent practice lit in the nav.
Verbatim live copy for the guides is in `content/`.

Links outside the site (
team profiles, Commercial Contracts) already point at their live URLs.

## SEO build modes

`npm run build` is preview-safe by default. It emits page-level `noindex`, a
disallow-all `robots.txt`, and a Vercel `X-Robots-Tag` header while still using
the production URLs as canonicals.

Production indexing is opt-in and must only be enabled at approved cutover:

```
SEO_INDEX=true \
SITE_URL=https://www.earleybusinesslegal.com \
GA_MEASUREMENT_ID=G-XXXXXXXXXX \
npm run build
```

Vercel runs `npm run build` and serves only `dist/`, so `SEO_INDEX` and analytics should be scoped to
the Production environment. Preview deployments remain blocked.

## Still to wire / confirm

- Contact form: Resend endpoint prepared for Vercel. See `FORM-SETUP.md` for activation and delivery verification. The form stays disabled unless the server confirms complete configuration.
- Sitewide Privacy and Terms links are intentionally omitted. The fixed-fee Handshake Privacy Policy and Terms and Conditions legal products remain available in the Handshake Portal.
- Avodah Traffic / Employment links on About Us point to their confirmed domain destinations; verify both after DNS launch.
- Avodah Legal main-site link is confirmed and prominently linked in the top utility bar, mobile menu and footer.
- The Operating / Partnership Agreement price is confirmed at $3,500.
- Indexing remains deliberately gated through `SEO_INDEX=true`; do not enable it before the domain, forms, analytics, attorney review and launch approval are complete.
