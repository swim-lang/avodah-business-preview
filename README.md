# Avodah Business — earleybusinesslegal.com refresh

Static design build of the seven approved pages plus the formation guides, M&A guides, Handshake Portal and every other page on the live sitemap (52 pages; the 6 blog pages are designed but parked), built on the same system as
`../avodah-traffic-site` and `../avodah-employment-site` (shared tokens, Serrif +
Jost, knot rule, crest, giant AVODAH footer, loader, reveal-on-scroll, overlay menu).

## Run it

```
node build.js        # assemble src/ into the root .html files
node server.js       # http://localhost:4190  (PORT env var to change)
```

`viewer.html#page.html` shows any page in a 375px phone frame.
Add `?flat=1` to any URL to skip the loader and scroll reveals (for full-page captures).

## Structure

- `src/partials/` — head, loader (homepage only), header, footer
- `src/pages/` — one body file per page, with a `<!--meta {...} -->` header
- `css/styles.css` — shared chrome (from Traffic, Cypress loader, Signal "Business" label)
- `css/pages.css` — every page section, hero archetypes and closing bands
- `js/site.js` — loader, staggered reveals, overlay menu, preview form, device toggle
- `assets/photos/` — color photography from the 2024 shoot (originals are in the site's media library)
- `CONTENT-INVENTORY.md` — full backup of the live site's copy, meta, forms and links

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
| (parked) blog, post, author + category archives | `src/unpublished/` — move into `src/pages/` once real posts exist. Designs are in Paper (More Pages). |
| static-page.html | /static-page/ (template for a real Privacy Policy / Terms page) |
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

## Still to wire / confirm

- Contact form: field names mirror Contact Form 7 #282; swap the static form for the CF7 shortcode on WordPress.
- Privacy, Disclaimer, Terms links are placeholders (`#privacy`, `#terms`) — the pages don't exist yet.
- Avodah Traffic / Employment links on About Us are placeholders until their domains are confirmed.
- Avodah Legal main-site link uses `https://www.avodahlegal.com` (same as Traffic) — confirm.
- Operating Agreement price shows $3,500 (About Us on the live site says $2,500).
- `noindex, nofollow` is set for review; remove at launch.
