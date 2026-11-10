# Business preview photography

Updated October 27, 2026 after Sean confirmed the client meant **avodahlegal.com**, not the old Earley Business Legal site.

- Richmond cityscape: https://www.avodahlegal.com/approach
- Original asset: https://framerusercontent.com/images/QtcihkAtrO0a58mybP6VKLuBSgU.jpg
- Local 2048 × 1536 version: `assets/photos/avodah-richmond-cityscape.jpg`
- Used for About, Business Formation, Justin's closing section, and social-preview metadata. Captions identify Richmond, not an office interior.
- Existing Justin, Chris, Andrew, and Blair headshots are retained as requested. Justin's existing headshot replaces the previous staged office scenes on the homepage and profile.
- Previous scene files remain in source for recoverability but are not referenced in public pages and are excluded from the deployment output.

Main Avodah navigation is now visible in the top utility strip on all screen sizes, in the mobile menu, and in the footer. Substantive service copy and legacy routes are unchanged.

## November 6, 2026 correction (local; release pending visual QA)

The October interpretation retained the old portraits. Blair's follow-up requested the current main-site pictures. Every Justin, Chris and Andrew portrait reference in public source pages now uses the matching current Avodah profile photo, downloaded from its existing CDN at a 1024-pixel maximum dimension. New filenames avoid reuse of cached old portraits.

| Person | Verified source page | Original CDN asset | Local file |
| --- | --- | --- | --- |
| Justin Earley | https://www.avodahlegal.com/our-firm/justin_earley | https://framerusercontent.com/images/Phb8FACQT7Sq08njDWpUKcQk.jpg | assets/photos/avodah-justin-earley-2026.jpg |
| Chris Rohde | https://www.avodahlegal.com/our-firm/chris-rohde | https://framerusercontent.com/images/JtWxB9EcMDZlAuF7UUAkXOYT3bQ.jpg | assets/photos/avodah-chris-rohde-2026.jpg |
| Andrew Hemby | https://www.avodahlegal.com/our-firm/andrew-hemby | https://framerusercontent.com/images/5TJdYI1JS4pnuNWPbCGqLtAU.jpg | assets/photos/avodah-andrew-hemby-2026.jpg |

Blair's current main-site profile contains no portrait. Her previously approved headshot is retained rather than substituting an unverified person or generated image. The Richmond cityscape remains on the main site's /approach page as a CSS background (not an img element), so the approved cityscape remains unchanged. Main-site alt text is not reused where it incorrectly describes portraits as buildings.

No service copy, page structure, navigation, or CSS was changed. On November 10, Sean approved releasing this correction to the existing Business preview. All 69 tests and the preview-safe build passed; desktop (1440px) and mobile (390px) portrait layouts were visually checked. Domain cutover remains outside this release.
