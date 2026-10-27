"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { ROUTES } = require("./site-config");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const directory of ["assets", "css", "js"]) {
  fs.cpSync(path.join(ROOT, directory), path.join(DIST, directory), {
    recursive: true,
    filter: source => !/^color-(?:justin-conference|justin-kitchen|office|team-kitchen|team-table|team-wide)\.jpg$/.test(path.basename(source)),
  });
}

for (const file of [...Object.keys(ROUTES), "robots.txt", "sitemap.xml"]) {
  fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
}

console.log(`prepared ${Object.keys(ROUTES).length} public pages in dist/`);
