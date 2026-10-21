# Earley Business Legal legacy URL inventory

Captured from the public Yoast sitemap index on October 21, 2026:

- `https://www.earleybusinesslegal.com/sitemap_index.xml`
- `post-sitemap.xml`
- `page-sitemap.xml`
- `nap-sitemap.xml`
- `team-sitemap.xml`
- `testimonial-sitemap.xml`
- `category-sitemap.xml`
- `author-sitemap.xml`

## Covered by the rebuild

All substantive service, Handshake, Formation, M&A, Contracts, About, Team, Testimonial, Contact, and NAP routes in the public sitemaps are represented in `site-config.js` as a rendered route or a deliberate consolidation redirect.

The current live redirects are also preserved:

- `/privacy-policy/` to `/handshake-legal/privacy-policy/`
- `/terms/` to `/handshake-legal/terms-of-use/`
- `/teams/` to `/our-team/`

Individual testimonial URLs consolidate to `/testimonials/` to avoid indexing several very thin pages containing the same quotes already shown on the main testimonials page.

## Intentionally retired at launch

The current WordPress sitemap exposes seven placeholder/archive URLs that are not part of the substantive site:

- `/blog/`
- `/lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit/`
- `/lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-2/`
- `/lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-3/`
- `/category/lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit/`
- `/author/earleybusinstg/`
- `/static-page/`

Avodah confirmed that these placeholder pages may be retired. Their source templates remain parked for internal reference, but they are excluded from the deployment artifact and sitemap. The listed public routes intentionally return 404. `/blog/` should only be introduced later if Avodah approves a real editorial program and substantive articles.

Do not redirect all placeholder URLs to the homepage. That produces irrelevant soft redirects and makes the migration harder to audit.

## Final migration evidence still needed

The XML sitemap is not a complete record of historical traffic or backlinks. Before DNS cutover, export the existing Search Console landing-page report and any available backlink/top-page report. Any valuable URL missing from this inventory needs a relevant one-to-one redirect or preserved page.
