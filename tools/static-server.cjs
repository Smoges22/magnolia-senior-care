const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || 3017);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};
const faviconRedirects = new Set([
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/assets/brand/favicon/favicon.ico",
  "/assets/brand/favicon/apple-touch-icon.png",
  "/assets/brand/favicon/magnolia-icon-16.png",
  "/assets/brand/favicon/magnolia-icon-32.png",
  "/assets/brand/favicon/magnolia-icon-48.png",
  "/assets/brand/favicon/magnolia-icon-180.png",
  "/assets/brand/favicon/magnolia-icon-192.png",
  "/assets/brand/favicon/magnolia-icon-512.png"
]);

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (faviconRedirects.has(pathname)) {
    response.writeHead(301, { Location: "/assets/brand/favicon/magnolia-logo-icon.png" });
    response.end();
    return;
  }
  if (pathname.endsWith("/")) pathname += "index.html";
  let filePath = path.resolve(root, `.${pathname}`);
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, body) => {
    if (error && !path.extname(filePath)) {
      const htmlPath = `${filePath}.html`;
      if (!htmlPath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      fs.readFile(htmlPath, (htmlError, htmlBody) => {
        if (htmlError) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }
        response.writeHead(200, { "Content-Type": types[".html"] });
        response.end(htmlBody);
      });
      return;
    }
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    response.end(body);
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving Magnolia site at http://127.0.0.1:${port}/`);
});
