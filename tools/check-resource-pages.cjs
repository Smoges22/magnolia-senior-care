const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const resourceRoot = path.join(root, "resources");
const htmlFiles = [];
const issues = [];
const titles = new Map();
const descriptions = new Map();

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(filePath);
    } else if (entry.name.endsWith(".html")) {
      htmlFiles.push(filePath);
    }
  }
}

walk(resourceRoot);

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, "utf8");
  const relative = path.relative(root, filePath);
  for (const token of ["<title>", '<meta name="description"', 'rel="canonical"', "application/ld+json"]) {
    if (!html.includes(token)) issues.push(`${relative}: missing ${token}`);
  }
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (title) {
    if (titles.has(title)) issues.push(`${relative}: duplicate title with ${titles.get(title)}`);
    titles.set(title, relative);
  }
  if (description) {
    if (descriptions.has(description)) issues.push(`${relative}: duplicate meta description with ${descriptions.get(description)}`);
    descriptions.set(description, relative);
  }
  if (relative.includes(`${path.sep}articles${path.sep}`)) {
    if (!html.includes('"@type": "Article"')) issues.push(`${relative}: missing Article schema`);
    if (!html.includes('"@type": "FAQPage"')) issues.push(`${relative}: missing FAQPage schema`);
  }
  const refs = Array.from(html.matchAll(/(?:href|src)="([^"]+)"/g))
    .map((match) => match[1])
    .filter((ref) => !/^(https?:|mailto:|tel:|#)/.test(ref));
  for (const ref of refs) {
    const clean = ref.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(filePath), clean);
    if (!fs.existsSync(target)) issues.push(`${relative}: missing ${ref}`);
  }
}

console.log(JSON.stringify({ resourcePages: htmlFiles.length, issues }, null, 2));
if (issues.length) process.exit(1);
