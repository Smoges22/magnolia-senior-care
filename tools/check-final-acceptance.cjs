const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { chromium, webkit } = require("playwright");
const sharp = require("sharp");

// Local, non-submitting acceptance evidence. No production writes or hidden overlays.
const root = path.resolve(__dirname, "..");
const output = process.env.MAGNOLIA_FINAL_QA_DIR || path.join(root, "qa", "final-acceptance");
const base = process.env.MAGNOLIA_BASE_URL || "http://127.0.0.1:3017";
const domain = "https://www.magnoliaseniorcarewa.com";
const portrait = "assets/images/team/sosena-mekuria-rn.webp";
const socialImage = "assets/images/team/sosena-mekuria-rn-og.jpg";
const report = { checks: [], resourceContent: [], portraits: [], screenshots: [], errors: [] };
const record = (name, ok, detail) => report.checks.push({ name, status: ok ? "PASS" : "FAIL", detail });
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
const files = execFileSync("rg", ["--files", "-g", "*.html", "-g", "!docs/**"], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/);

async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") report.errors.push(m.text()); });
  page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  await context.route("**/*", async (route) => {
    if (route.request().method() !== "GET") throw new Error("Acceptance checks must never submit data");
    await route.continue();
  });
  const go = async (route) => { await page.goto(base + route); await page.evaluate(() => document.fonts.ready); };
  const capture = async (name) => {
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(output, `${name}.png`) });
    report.screenshots.push(path.relative(root, path.join(output, `${name}.png`)).replaceAll("\\", "/"));
  };
  const position = async (selector) => page.locator(selector).evaluate((el) => {
    const header = document.querySelector(".site-header-shell").getBoundingClientRect().bottom;
    window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - header - 20, behavior: "instant" });
  });
  const open = async () => {
    await page.locator(".menu-toggle").click();
    await page.waitForFunction(() => document.querySelector("#mobile-menu").open && new DOMMatrixReadOnly(getComputedStyle(document.querySelector("#mobile-menu")).transform).m41 === 0);
  };
  try {
    await go("/");
    const parsed = await page.evaluate((entries) => entries.map(([file, html]) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return {
        file,
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        robots: doc.querySelector('meta[name="robots"]')?.content || "",
        schema: [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)),
        references: [...doc.querySelectorAll("[src], link[href], a[href]")].map((n) => n.getAttribute("src") || n.getAttribute("href")),
        icons: [...doc.querySelectorAll('link[rel*="icon"],link[rel="manifest"]')].map((n) => n.getAttribute("href"))
      };
    }), files.map((file) => [file.replaceAll("\\", "/"), fs.readFileSync(path.join(root, file), "utf8")]));
    record("HTML JSON-LD syntax", true, `${parsed.length} HTML files parsed using DOMParser and JSON.parse`);
    const badRefs = [];
    function exactFile(relative) {
      let current = root;
      for (const name of relative.split("/")) {
        if (!fs.existsSync(current) || !fs.readdirSync(current).includes(name)) return false;
        current = path.join(current, name);
      }
      return fs.statSync(current).isFile();
    }
    for (const entry of parsed) {
      for (const ref of entry.references) {
        const url = new URL(ref, `${domain}/${entry.file}`);
        if (url.origin !== domain || !url.pathname || url.pathname === "/") continue;
        const local = decodeURIComponent(url.pathname).slice(1);
        if (![local, `${local}.html`, `${local.replace(/\/$/, "")}/index.html`].some(exactFile)) badRefs.push(`${entry.file}: ${ref}`);
      }
    }
    record("Local HTML references including exact case", badRefs.length === 0, badRefs);
    record("Production canonicals and robots", parsed.every((e) => e.canonical?.startsWith(domain) && !/noindex/i.test(e.robots)), parsed.map(({ file, canonical }) => ({ file, canonical })));
    report.schema = parsed.filter((e) => ["index.html", "burien-adult-family-home.html", "des-moines-adult-family-home.html", "about.html", "about/clinical-leadership/index.html"].includes(e.file)).map(({ file, schema }) => ({ file, schema }));
    record("Shared favicon/manifest sources", parsed.every((e) => e.icons.length === 3 && e.icons.filter((i) => i.endsWith("assets/brand/favicon/magnolia-logo-icon.png")).length === 2 && e.icons.some((i) => i.endsWith("assets/brand/favicon/site.webmanifest"))), `${parsed.length} pages`);
    const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
    report.sitemap = await page.evaluate((xml) => {
      const d = new DOMParser().parseFromString(xml, "text/xml");
      return { urls: [...d.querySelectorAll("loc")].map((n) => n.textContent), lastmod: [...d.querySelectorAll("lastmod")].map((n) => n.textContent), errors: d.querySelectorAll("parsererror").length };
    }, sitemap);
    const publicPages = parsed.filter((e) => e.file !== "blog/afh-education-template.html");
    record("Sitemap matches all intended canonical pages", !report.sitemap.errors && publicPages.every((e) => report.sitemap.urls.includes(e.canonical)) && new Set(report.sitemap.urls).size === report.sitemap.urls.length, { pages: publicPages.length, urls: report.sitemap.urls.length, lastmod: report.sitemap.lastmod, excluded: "Existing unpublished blog template" });

    const generated = [];
    const fakeFs = { ...fs, mkdirSync() {}, writeFileSync(file, content) {
      const relative = path.relative(root, file).replaceAll("\\", "/");
      const normalize = (s) => s.replace(/\r\n/g, "\n");
      generated.push({ file: relative, matches: fs.existsSync(file) && normalize(fs.readFileSync(file, "utf8")) === normalize(content) });
    } };
    vm.runInNewContext(fs.readFileSync(path.join(root, "tools/generate-resource-pages.cjs"), "utf8"), {
      require: (name) => name === "fs" ? fakeFs : require(name), __dirname, console: { log() {} }, process
    });
    record("Generator output complete and current (read-only simulation)", generated.length > 0 && generated.every((g) => g.matches), generated);
    for (const route of ["/resources/", "/resources/dementia-memory-care/", "/resources/articles/when-is-it-time-for-memory-care/", "/resources/referral-center/"]) {
      const raw = await (await page.request.get(base + route)).text();
      const initial = await page.evaluate((html) => {
        const d = new DOMParser().parseFromString(html, "text/html");
        const main = d.querySelector("main");
        return { headings: [...main.querySelectorAll("h1")].map((h) => h.textContent), intro: main.querySelector("p")?.textContent, textLength: main.textContent.trim().length, headingsBelowH1: main.querySelectorAll("h2,h3").length, mainLinks: main.querySelectorAll("a[href]").length, fallbackLinks: d.querySelectorAll("noscript a[href]").length };
      }, raw);
      await go(route);
      const rendered = await page.locator("main").evaluate((main) => ({ headings: [...main.querySelectorAll("h1")].map((h) => h.textContent.trim()), textLength: main.textContent.trim().length, headingsBelowH1: main.querySelectorAll("h2,h3").length, links: main.querySelectorAll("a[href]").length }));
      report.resourceContent.push({ route, initial, rendered });
      record(`Single rendered heading: ${route}`, rendered.headings.length === 1, rendered.headings);
    }

    const bytes = fs.readFileSync(path.join(root, portrait));
    report.portraitAsset = { path: portrait, sha256: createHash("sha256").update(bytes).digest("hex").toUpperCase(), bytes: bytes.length, metadata: await sharp(bytes).metadata() };
    record("Approved Magnolia portrait matches supplied file", report.portraitAsset.sha256 === "B081E3DB517685F42633CB00F3C6152C669A8E9EA4443A4A7788641E48302025", report.portraitAsset.sha256);
    for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
      await page.setViewportSize({ width, height });
      await go("/");
      await capture(`home-${width}`);
      report.checks.push({ name: `Header geometry ${width}`, status: "INFO", detail: await page.evaluate(() => ({ header: document.querySelector(".site-header-shell").getBoundingClientRect().height, bodyPadding: getComputedStyle(document.body).paddingTop })) });
      if (width <= 980) { await open(); await capture(`menu-${width}`); await page.keyboard.press("Escape"); await page.waitForFunction(() => !document.querySelector("#mobile-menu").open); }
      await position(".site-footer");
      await capture(`footer-start-${width}`);
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
      await capture(`footer-end-${width}`);
      for (const [route, label] of [["/about", "about"], ["/about/clinical-leadership/", "clinical"], ["/resources/", "resources"]]) {
        await go(route);
        await position(".sosena-portrait");
        await page.locator(".sosena-portrait").evaluate((img) => img.decode());
        const details = await page.locator(".sosena-portrait").evaluate((img) => ({ src: img.getAttribute("src"), alt: img.alt, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, width: img.clientWidth, height: img.clientHeight, fit: getComputedStyle(img).objectFit, filter: getComputedStyle(img).filter, ratio: img.getAttribute("width") / img.getAttribute("height") }));
        report.portraits.push({ route, width, ...details });
        record(`Portrait ${label} at ${width}`, details.src.endsWith(portrait) && details.naturalWidth === 1200 && details.naturalHeight === 962 && details.alt.includes("Sosena Mekuria, RN") && details.fit === "contain" && details.filter === "none" && details.width * 2 <= 1402, details);
        await capture(`${label}-portrait-${width}`);
      }
      await go("/contact?subject=Referral%20Inquiry#tour-request");
      record(`Referral form preselection ${width}`, await page.locator("#inquiry-type").inputValue() === "Referral Inquiry", await page.locator("#interest").inputValue());
      await position('.form-field:has(#name)');
      await capture(`contact-form-${width}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await go("/contact.html#tour-request");
    record("Dialog accessible name", await page.getByRole("dialog", { name: "Magnolia navigation", includeHidden: true }).count() === 1, "Native dialog with aria-label");
    for (let i = 0; i < 10; i++) {
      await open();
      assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("#mobile-menu").open);
      assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    }
    record("Repeated open-close state", true, "10 cycles, Escape, aria-expanded true/false");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await open();
    await page.locator(".mobile-menu-contact .button").click();
    await page.waitForURL(/free-senior-care-consultation\/index\.html$/);
    record("Mobile menu CTA opens the free consultation page", true, page.url());
    await go("/contact.html#tour-request");
    await page.waitForTimeout(700);
    record("Tour anchor sits below the fixed header",(await page.locator("#tour-request").boundingBox()).y >= 100 && (await page.locator("#tour-request").boundingBox()).y < 300, await page.locator("#tour-request").boundingBox());
    await page.locator("#name").focus();
    const focused = [];
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(700);
      focused.push(await page.evaluate(() => {
        const el = document.activeElement, b = el.getBoundingClientRect();
        const top = document.querySelector(".site-header-shell").getBoundingClientRect().bottom;
        const bottom = document.querySelector(".mobile-quickbar").getBoundingClientRect().top;
        return { id: el.id || el.textContent.trim(), top: b.top, bottom: b.bottom, visible: b.top >= top && b.bottom <= bottom };
      }));
      if (i === 8) await capture("contact-message-focused-390");
      await page.keyboard.press("Tab");
    }
    record("Keyboard-focused contact controls clear fixed overlays", focused.every((f) => f.visible), focused);

    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await go("/contact.html");
      await page.evaluate(() => {
        const nodes = [...document.querySelectorAll(".mobile-menu a, .mobile-menu summary, .mobile-menu p, .mobile-quickbar a, .mobile-quickbar span, .footer-links a, .footer-tour, .contact-row, .contact-row span, .contact-row strong")];
        const sizes = nodes.map((n) => parseFloat(getComputedStyle(n).fontSize));
        nodes.forEach((n, i) => n.style.fontSize = `${sizes[i] * 2}px`);
      });
      await open();
      const overflow = await page.locator(".mobile-menu a, .mobile-menu summary, .mobile-menu-contact, .mobile-quickbar, .footer-links a, .contact-row").evaluateAll((nodes) => nodes.filter((n) => n.checkVisibility() && n.scrollWidth > n.clientWidth + 2).map((n) => ({ text: n.textContent.trim(), client: n.clientWidth, scroll: n.scrollWidth })));
      record(`200% navigation/contact text at ${width}`, overflow.length === 0, overflow);
      await capture(`menu-text-200-${width}`);
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("#mobile-menu").open);
      await position('.contact-link-list[aria-label="Magnolia direct contact options"]');
      await capture(`contact-text-200-${width}`);
    }

    await go("/about/clinical-leadership/");
    report.social = await page.locator('meta[property^="og:image"],meta[name^="twitter:image"]').evaluateAll((nodes) => nodes.map((n) => ({ property: n.getAttribute("property") || n.name, content: n.content })));
    record("Clinical social image declarations", report.social.filter((m) => ["og:image", "og:image:secure_url", "twitter:image"].includes(m.property)).every((m) => m.content === `${domain}/${socialImage}`), report.social);
    await go("/resources/referral-center/");
    const referralLink = page.getByRole("link", { name: "Submit Referral Inquiry", exact: true }).first();
    record("Referral CTA uses contact form, not mail", await referralLink.getAttribute("href") === "/contact?subject=Referral%20Inquiry#tour-request", await referralLink.getAttribute("href"));
    await referralLink.click();
    await page.waitForURL(/contact\?subject=Referral%20Inquiry#tour-request$/);
    record("Referral CTA resolves locally with context", await page.locator("#inquiry-type").inputValue() === "Referral Inquiry", "Clicked link only; no form submission");
    record("Preserved direct contact destinations", await page.locator('.footer-contact-panel a[href="tel:+14252466220"]').count() === 1 && await page.locator('.footer-contact-panel a[href="tel:+12064535082"]').count() === 1 && await page.locator('.footer-contact-panel a[href="mailto:sosena.mekuria@gmail.com"]').count() === 1, "Inspected href values, no call or email opened");
    await position(".footer-contact-panel");
    await page.locator(".footer-tour").focus();
    await page.keyboard.press("Tab");
    await capture("footer-focus-390");
    const colors = await page.evaluate(() => ({
      background: getComputedStyle(document.querySelector(".site-footer")).backgroundColor,
      text: getComputedStyle(document.querySelector(".footer-brand p")).color,
      body: getComputedStyle(document.querySelector(".footer-bottom p")).color,
      focus: getComputedStyle(document.activeElement).outlineColor,
      outline: getComputedStyle(document.activeElement).outlineWidth
    }));
    const rgb = (s) => s.match(/[\d.]+/g).map(Number);
    const background = rgb(colors.background);
    const luminance = (components) => components.map((n) => n / 255).map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (color) => {
      const values = rgb(color), alpha = values[3] ?? 1;
      const a = luminance(values.slice(0, 3).map((v, i) => v * alpha + background[i] * (1 - alpha))), b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const contrast = { ...colors, brandRatio: ratio(colors.text), textRatio: ratio(colors.body), focusRatio: ratio(colors.focus) };
    record("Footer text and gold focus contrast", contrast.brandRatio >= 4.5 && contrast.textRatio >= 4.5 && contrast.focusRatio >= 3 && parseFloat(colors.outline) >= 2, contrast);
    report.payloads = ["assets/css/styles.css", "assets/js/components.js", "assets/js/resources.js", portrait].map((file) => ({ file, bytes: fs.statSync(path.join(root, file)).size, headBytes: file === portrait ? null : Buffer.byteLength(git("show", `HEAD:${file}`)) }));
    record("No console/runtime/local request errors", report.errors.length === 0, report.errors);
    try {
      const wk = await webkit.launch({ headless: true });
      try {
        const wp = await wk.newPage({ viewport: { width: 390, height: 844 } });
        await wp.goto(base + "/contact.html#tour-request");
        await wp.locator(".menu-toggle").click();
        await wp.waitForFunction(() => document.querySelector("#mobile-menu").open);
        await wp.keyboard.press("Escape");
        await wp.waitForFunction(() => !document.querySelector("#mobile-menu").open);
        record("WebKit emulation smoke", true, "390x844 menu open/Escape/contact anchor; not a physical device");
      } finally { await wk.close(); }
    } catch (e) { report.checks.push({ name: "WebKit emulation smoke", status: "NOT TESTED", detail: e.message.split("\n")[0] }); }
    record("Git index is unstaged", git("diff", "--cached", "--name-only").trim() === "", "No staged paths");
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(report, null, 2) + "\n");
  }
  for (const { name, status, detail } of report.checks) console.log(`${status}: ${name}${status === "FAIL" ? ` ${JSON.stringify(detail)}` : ""}`);
  process.exitCode = report.checks.some((c) => c.status === "FAIL") ? 1 : 0;
}

run().catch((e) => { console.error(e); process.exitCode = 1; });
