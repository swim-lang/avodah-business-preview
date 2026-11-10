"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

test("public Business pages use approved current portraits, not legacy portraits", () => {
  for (const name of fs.readdirSync(path.join(root, "src/pages"))) {
    if (!name.endsWith(".html")) continue;
    const html = fs.readFileSync(path.join(root, "src/pages", name), "utf8");
    assert.doesNotMatch(html, /color-(justin|chris|andrew)\.jpg/, name);
  }
  for (const name of ["justin-earley", "chris-rohde", "andrew-hemby"]) {
    const file = path.join(root, "assets/photos", `avodah-${name}-2026.jpg`);
    const image = fs.readFileSync(file);
    assert.equal(image.readUInt16BE(0), 0xffd8);
    assert.ok(image.length < 500000, `${name} should use the CDN-sized asset`);
  }
  const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(home, /avodah-justin-earley-2026\.jpg/);
  assert.match(home, /noindex, nofollow/);
});
