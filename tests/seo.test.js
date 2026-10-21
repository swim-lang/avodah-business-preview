"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  SITE,
  ROUTES,
  NOINDEX_FILES,
  CANONICAL_OVERRIDES,
} = require("../site-config");

const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const tagValue = (html, pattern) => {
  const match = html.match(pattern);
  return match ? match[1] : null;
};

test("every source page has an explicit preserved route", () => {
  const pages = fs.readdirSync(path.join(ROOT, "src/pages"))
    .filter((file) => file.endsWith(".html"))
    .sort();
  assert.deepEqual(Object.keys(ROUTES).sort(), pages);
  assert.equal(new Set(Object.values(ROUTES)).size, pages.length);
});

for (const [file, route] of Object.entries(ROUTES)) {
  test(`${file} has complete preview SEO metadata`, () => {
    const html = read(file);
    const canonicalPath = CANONICAL_OVERRIDES[file] || route;
    const expectedCanonical = `${SITE.productionUrl}${canonicalPath === "/" ? "" : canonicalPath}`;

    assert.match(html, /<html lang="en">/);
    assert.match(html, /<meta name="robots" content="noindex, nofollow" \/>/);
    assert.equal(tagValue(html, /<link rel="canonical" href="([^"]+)" \/>/), expectedCanonical);
    assert.equal(tagValue(html, /<meta property="og:url" content="([^"]+)" \/>/), expectedCanonical);
    assert.match(html, /<meta property="og:title" content="[^"]+" \/>/);
    assert.match(html, /<meta property="og:description" content="[^"]+" \/>/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
    assert.doesNotMatch(html, /\{\{[^}]+\}\}/);
    assert.doesNotMatch(html, /device-toggle/);

    const title = tagValue(html, /<title>([^<]+)<\/title>/);
    const description = tagValue(html, /<meta name="description" content="([^"]+)" \/>/);
    assert.ok(title && title.length >= 20, "title is missing or too short");
    if (NOINDEX_FILES.has(file)) assert.ok(description, "description is missing");
    else assert.ok(description && description.length >= 50, "description is missing or too short");

    const h1s = html.match(/<h1\b/gi) || [];
    assert.equal(h1s.length, 1, "page should have exactly one H1");

    const schemaText = tagValue(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const schema = JSON.parse(schemaText);
    assert.equal(schema["@context"], "https://schema.org");
    assert.ok(schema["@graph"].some((item) => item["@type"] === "LegalService"));

    const images = html.match(/<img\b[^>]*>/gi) || [];
    for (const image of images) {
      assert.match(image, /\balt="[^"]*"/, `missing alt: ${image}`);
      assert.match(image, /\bwidth="\d+"/, `missing width: ${image}`);
      assert.match(image, /\bheight="\d+"/, `missing height: ${image}`);
      const source = tagValue(image, /\bsrc="([^"]+)"/);
      assert.ok(source.startsWith("/assets/"), `image URL is not root-relative: ${source}`);
    }

    for (const link of html.matchAll(/\bhref="([^"]+)"/g)) {
      const href = link[1];
      if (/^(?:https?:|tel:|mailto:|#)/.test(href)) continue;
      assert.ok(href.startsWith("/"), `local URL is not root-relative: ${href}`);
      assert.doesNotMatch(href, /\.html(?:[?#]|$)/, `HTML link was not rewritten: ${href}`);
    }
  });
}

test("preview crawl controls and Vercel routes agree", () => {
  assert.equal(read("robots.txt"), "User-agent: *\nDisallow: /\n");
  const vercel = JSON.parse(read("vercel.json"));
  const rewrites = new Map(vercel.rewrites.map(({ source, destination }) => [source, destination]));
  for (const [file, route] of Object.entries(ROUTES)) {
    assert.equal(rewrites.get(route), `/${file}`);
  }
  const catchAll = vercel.headers.find(({ source }) => source === "/(.*)");
  assert.ok(catchAll.headers.some(({ key, value }) => key === "X-Robots-Tag" && value === "noindex, nofollow"));
});

test("production build configuration keeps duplicate pages out of the index", () => {
  assert.ok(NOINDEX_FILES.has("static-page.html"));
  for (const file of Object.keys(CANONICAL_OVERRIDES)) {
    assert.ok(NOINDEX_FILES.has(file));
    assert.equal(CANONICAL_OVERRIDES[file], "/testimonials/");
  }
});

test("preview form remains non-transmitting", () => {
  const contact = read("contact.html");
  assert.match(contact, /<form[^>]+action="#"[^>]+data-preview-form/);
  assert.match(read("js/site.js"), /e\.preventDefault\(\)/);
});
