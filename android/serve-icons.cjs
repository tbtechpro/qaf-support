// Serves web/public on :8901 so Bubblewrap can fetch icons (no consent wall).
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..", "web", "public");
const types = { ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/manifest+json" };
http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" });
    res.end(d);
  });
}).listen(8901, () => console.log("icons on :8901"));
