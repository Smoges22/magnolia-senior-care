const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataCode = fs.readFileSync(path.join(root, "assets", "js", "resources-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(dataCode, sandbox);

const resources = sandbox.window.MagnoliaResources;
const domain = "https://www.magnoliaseniorcarewa.com";
const resourceSocialImage = `${domain}/assets/brand/social/magnolia-og-resource-center.jpg`;
const resourceSocialAlt = "Magnolia Senior Care Resource Center RN-reviewed family guidance";
const verificationMeta = `
  <meta name="google-site-verification" content="REPLACE_WITH_GOOGLE_VERIFICATION_CODE">
  <meta name="msvalidate.01" content="A4C93E344DC69C9B3DC87EA8DA78D6A1" />`;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function writeFile(relativePath, html) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html.trimStart(), "utf8");
}

function crawlFallback(prefix) {
  const categoryLinks = resources.categories
    .map((category) => `      <li><a href="${prefix}resources/${category.slug}/">${escapeHtml(category.title)}</a></li>`)
    .join("\n");
  const articleLinks = Object.values(resources.articles)
    .map((article) => `      <li><a href="${prefix}resources/articles/${article.slug}/">${escapeHtml(article.title)}</a></li>`)
    .join("\n");
  return `
  <noscript>
    <nav class="seo-crawl-links" aria-label="Resource Center crawl links">
      <h2>Magnolia Resource Center topics</h2>
      <ul>
        <li><a href="${prefix}resources/">Resource Center home</a></li>
${categoryLinks}
      </ul>
      <h2>Magnolia Resource Center articles</h2>
      <ul>
${articleLinks}
      </ul>
    </nav>
  </noscript>`;
}

function shell({ title, description, canonical, prefix, bodyAttrs = "", main, schema, schemas, ogType = "website" }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const schemaList = schemas || [schema];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
${verificationMeta}
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Magnolia Senior Care WA">
  <meta property="og:image" content="${resourceSocialImage}">
  <meta property="og:image:secure_url" content="${resourceSocialImage}">
  <meta property="og:image:alt" content="${resourceSocialAlt}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${resourceSocialImage}">
  <meta name="twitter:image:alt" content="${resourceSocialAlt}">
  <link rel="icon" href="${prefix}assets/brand/favicon/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="${prefix}assets/brand/favicon/apple-touch-icon.png">
  <link rel="manifest" href="${prefix}assets/brand/favicon/site.webmanifest">
  <link rel="stylesheet" href="${prefix}assets/css/styles.css">
${schemaList.map((item) => `
  <script type="application/ld+json">
${jsonLd(item)}
  </script>
`).join("")}
</head>
<body${bodyAttrs ? ` ${bodyAttrs}` : ""}>
  <div data-component="site-header"></div>
  ${main}
${crawlFallback(prefix)}
  <div data-component="site-footer"></div>
  <script src="${prefix}assets/js/site-data.js"></script>
  <script src="${prefix}assets/js/resources-data.js"></script>
  <script src="${prefix}assets/js/components.js"></script>
  <script src="${prefix}assets/js/resources.js"></script>
</body>
</html>
`;
}

function collectionSchema(name, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    publisher: {
      "@type": "Organization",
      name: "Magnolia Senior Care",
      url: domain
    }
  };
}

writeFile("resources/index.html", shell({
  title: "Senior Care Resource Center | Magnolia Senior Care WA",
  description: "RN-led resources for Washington Adult Family Homes, dementia care, Medicaid planning, hospital transitions, safety, family support, and hospice education.",
  canonical: `${domain}/resources/`,
  prefix: "../",
  main: '  <main id="main" data-resource-center></main>',
  schema: collectionSchema(
    "Magnolia Senior Care Resource Center",
    "RN-led educational resources for families navigating Adult Family Homes and senior care in Washington.",
    `${domain}/resources/`
  )
}));

resources.categories.forEach((category) => {
  writeFile(`resources/${category.slug}/index.html`, shell({
    title: `${category.title} | Magnolia Resource Center`,
    description: category.description,
    canonical: `${domain}/resources/${category.slug}/`,
    prefix: "../../",
    bodyAttrs: `data-category="${category.slug}"`,
    main: `  <main id="main" data-resource-category="${category.slug}"></main>`,
    schema: collectionSchema(
      `${category.title} | Magnolia Senior Care`,
      category.description,
      `${domain}/resources/${category.slug}/`
    )
  }));
});

Object.values(resources.articles).forEach((article) => {
  const category = resources.categories.find((item) => item.slug === article.category);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    dateModified: article.lastUpdated,
    articleSection: category?.title || "Senior care resources",
    author: {
      "@type": "Organization",
      name: "Magnolia Senior Care"
    },
    publisher: {
      "@type": "Organization",
      name: "Magnolia Senior Care",
      url: domain
    },
    reviewedBy: {
      "@type": "Person",
      name: "Sosena Mekuria",
      jobTitle: "RN and Adult Family Home Provider",
      url: `${domain}/about/clinical-leadership/`
    },
    mainEntityOfPage: `${domain}/resources/articles/${article.slug}/`
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: {
        "@type": "Answer",
        text
      }
    }))
  };

  writeFile(`resources/articles/${article.slug}/index.html`, shell({
    title: article.metaTitle,
    description: article.metaDescription,
    canonical: `${domain}/resources/articles/${article.slug}/`,
    prefix: "../../../",
    bodyAttrs: `data-article="${article.slug}"`,
    main: `  <main id="main" data-resource-article="${article.slug}"></main>`,
    schemas: [articleSchema, faqSchema],
    ogType: "article"
  }));
});

const sitemapUrls = [
  ["/", "1.0"],
  ["/about.html", "0.8"],
  ["/about/clinical-leadership/", "0.78"],
  ["/services.html", "0.9"],
  ["/rooms-photos.html", "0.8"],
  ["/referral-agents.html", "0.9"],
  ["/contact.html", "0.9"],
  ["/burien-adult-family-home.html", "0.95"],
  ["/des-moines-adult-family-home.html", "0.95"],
  ["/privacy-policy/", "0.35"],
  ["/terms-of-use/", "0.35"],
  ["/disclaimer/", "0.35"],
  ["/accessibility/", "0.35"],
  ["/resources/", "0.85"],
  ...resources.categories.map((category) => [`/resources/${category.slug}/`, "0.75"]),
  ...Object.values(resources.articles).map((article) => [`/resources/articles/${article.slug}/`, "0.72"])
];

writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(([url, priority]) => `  <url><loc>${domain}${url}</loc><priority>${priority}</priority></url>`).join("\n")}
</urlset>
`);

console.log("Generated Resource Center route shells.");
