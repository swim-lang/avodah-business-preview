/* Minimal static dev server for the Avodah Business site.
   Respects PORT from the environment (defaults to 4190). */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { ROUTES, REDIRECT_ROUTES } = require("./site-config");

const ROOT = fs.existsSync(path.join(__dirname, "dist")) ? path.join(__dirname, "dist") : __dirname;
const PORT = process.env.PORT || 4190;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/api/intake") {
      require("./api/intake")(req, res).catch(() => {
        if (!res.headersSent) res.writeHead(500, {"Content-Type":"application/json"});
        res.end(JSON.stringify({ok:false, message:"Inquiry unavailable."}));
      });
      return;
    }
    if (REDIRECT_ROUTES[urlPath]) {
      res.writeHead(308, { Location: REDIRECT_ROUTES[urlPath] }).end();
      return;
    }
    const matchedRoute = Object.entries(ROUTES).find(([, route]) => route === urlPath);
    if (matchedRoute) urlPath = `/${matchedRoute[0]}`;
    else if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(ROOT, path.normalize(urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`Avodah Business dev server on http://localhost:${PORT}`));
