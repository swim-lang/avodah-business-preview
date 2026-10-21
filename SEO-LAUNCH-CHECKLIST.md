# Avodah Business SEO launch checklist

## Current state

- The rebuild preserves the known Earley Business Legal page paths so the domain can move without discarding established URL equity.
- Every rendered page has a unique title, description, canonical URL, Open Graph metadata, Twitter metadata, breadcrumb data, and organization/page structured data.
- Attorney and staff profile pages include Person structured data. No ratings, review totals, pricing claims, or other unsupported facts were added.
- Internal links and static assets use root-relative paths, so pages work at their established nested URLs.
- Raster images include descriptive or intentionally empty alt text, intrinsic dimensions, asynchronous decoding, and appropriate lazy loading. Important hero photography is not lazy-loaded.
- Duplicate testimonial URLs consolidate to `/testimonials/`; HTML-file URLs redirect to their clean legacy paths.
- The normal site no longer shows the desktop/mobile review switch. `viewer.html` remains a private QA aid only.
- The current Vercel preview is blocked by page-level `noindex`, an `X-Robots-Tag` header, and a disallow-all `robots.txt`.
- The existing page copy was not substantively rewritten during this pass.

## Required before domain cutover

1. Confirm that `www.earleybusinesslegal.com` remains the final canonical host and that both the apex and `www` host will resolve to the same Vercel project.
2. Export the current Search Console landing-page report and top linked pages. The public WordPress sitemap was captured on October 21, 2026 and compared with `site-config.js`; add any additional Search Console URLs before DNS changes.
3. Confirm access to the existing Google Search Console property. Prefer retaining that property instead of creating a competing duplicate. Add a Domain property only if it does not already exist.
4. Create or confirm the dedicated GA4 web data stream, then add its `G-` measurement ID to the Vercel Production environment as `GA_MEASUREMENT_ID`.
5. Set these Vercel Production environment variables only when the real domain is ready:
   - `SITE_URL=https://www.earleybusinesslegal.com`
   - `SEO_INDEX=true`
   - `GA_MEASUREMENT_ID=G-XXXXXXXXXX`
   - `GOOGLE_SITE_VERIFICATION=...` only if HTML-tag verification is used; DNS verification is preferred for a Domain property.
6. Replace the non-transmitting preview form with the approved secure form endpoint. Confirm recipients, reply handling, spam protection, retention, consent language, and a tested success state. Emit a GA4 lead event only after the backend confirms a successful submission.
7. Confirm that the existing `/privacy-policy/` and `/terms/` redirects may continue pointing to the two Handshake pages. Those are the current live-site destinations, but Avodah should confirm they are suitable as sitewide legal notices.
8. Confirm the Richmond and Leesburg office presentation, phone routing, staff roster, Handshake prices, and all attorney credentials.
9. Run attorney review and receive written publication approval.

## Cutover sequence

1. Lower DNS TTL in advance if the current provider permits it.
2. Add and verify the apex and `www` domains in Vercel before changing DNS.
3. Confirm one canonical host and redirect the alternate host to it.
4. Add the Production environment variables above and deploy.
5. Verify representative legacy URLs, nested assets, redirects, canonical tags, structured data, the contact flow, phone links, and analytics in the production deployment.
6. Change DNS only after those checks pass.
7. Confirm the production response no longer includes `noindex` in HTML or the `X-Robots-Tag` header and that `robots.txt` allows crawling.
8. Submit `https://www.earleybusinesslegal.com/sitemap.xml` in the existing Search Console property and request inspection of the homepage plus the principal Formation, M&A, Contracts, Handshake, Team, and Contact URLs.
9. Monitor 404s, redirect chains, indexing, Core Web Vitals, conversions, and ranking/traffic changes daily for the first week, then weekly for the first month.

## Measurement events prepared in code

- `phone_click`
- `contact_cta_click`
- `handshake_start`

The live form integration should add a separate event only after a message is successfully accepted. Mark qualified lead events as key events in GA4 after production testing rather than counting every page view as a conversion.

## Commands

Preview-safe build:

```sh
npm run build
npm test
```

Production-mode release candidate, for a controlled launch review only:

```sh
SEO_INDEX=true \
SITE_URL=https://www.earleybusinesslegal.com \
GA_MEASUREMENT_ID=G-XXXXXXXXXX \
npm run build
npm test
```

Do not commit or deploy a production-indexing build before the domain, analytics, form, legal pages, attorney review, and launch approval are complete.
