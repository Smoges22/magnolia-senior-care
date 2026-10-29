const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

// Run against tools/static-server.cjs with Playwright available on NODE_PATH.
const base = process.env.MAGNOLIA_BASE_URL || "http://127.0.0.1:3017";
const screenshots = process.env.MAGNOLIA_QA_DIR;
const viewports = [
  [320, 568], [360, 780], [375, 812], [390, 844], [414, 896],
  [430, 932], [768, 1024], [844, 390]
];

async function run() {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge", headless: true });
  const page = await browser.newPage();
  const errors = [];
  const checkedLinks = new Set();
  page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.stack}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  if (screenshots) fs.mkdirSync(screenshots, { recursive: true });

  const capture = async (name, locator) => {
    if (screenshots) await (locator || page).screenshot({
      path: path.join(screenshots, `${name}.png`),
      style: name.startsWith("footer") ? "[data-component='site-header'] { visibility: hidden !important; }" : ""
    });
  };
  const openMenu = async () => {
    await page.locator(".menu-toggle").click();
    await page.waitForFunction(() => {
      const menu = document.querySelector("#mobile-menu");
      return menu.open && new DOMMatrixReadOnly(getComputedStyle(menu).transform).m41 === 0;
    });
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    assert.equal(await page.evaluate(() => document.activeElement.className), "menu-close");
  };
  const expectClosed = async () => {
    await page.waitForFunction(() => !document.querySelector("#mobile-menu").open);
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    assert.equal(await page.evaluate(() => document.body.classList.contains("mobile-menu-open")), false);
  };
  const checkBounds = async (selector, label) => {
    const problems = await page.locator(selector).evaluateAll((nodes) => nodes.flatMap((node) => {
      if (!node.checkVisibility()) return [];
      const bounds = node.getBoundingClientRect();
      const containedScroller = ["auto", "scroll"].includes(getComputedStyle(node).overflowX);
      return bounds.left < -1 || bounds.right > innerWidth + 1 || (!containedScroller && node.scrollWidth > node.clientWidth + 1)
        ? [{ element: node.className, left: bounds.left, right: bounds.right, client: node.clientWidth, scroll: node.scrollWidth }]
        : [];
    }));
    assert.deepEqual(problems, [], label);
  };
  try {
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto(base);
      await checkBounds(".nav-wrap, .brand, .nav-actions, .site-footer, .footer-grid, .footer-panel, .footer-brand", `Layout at ${width}`);
      const target = await page.locator(".menu-toggle").boundingBox();
      assert(target.width >= 44 && target.height >= 44);
      assert(target.x + target.width <= width);
      const logo = await page.locator(".brand-logo").boundingBox();
      assert(logo.x + logo.width < target.x, `Logo/menu overlap at ${width}`);
      assert(await page.locator(".brand-logo").evaluate((image) => image.complete && image.naturalWidth > 0));
      await page.evaluate(() => window.scrollTo({ top: 480, behavior: "instant" }));
      const before = await page.evaluate(() => window.scrollY);
      await openMenu();
      if ([320, 390, 768, 844].includes(width)) await capture(`menu-default-${width}`);
      await checkBounds(".mobile-menu, .mobile-menu-header, .mobile-menu-links, .mobile-menu-contact", `Drawer at ${width}`);
      const tour = await page.locator(".mobile-menu-contact .button").boundingBox();
      assert(tour.y >= 0 && tour.y + tour.height <= height, `Tour CTA offscreen at ${width}`);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), "fixed");
      const lockedTop = await page.locator("main").evaluate((node) => node.getBoundingClientRect().top);
      await page.mouse.wheel(0, 300);
      assert.equal(await page.locator("main").evaluate((node) => node.getBoundingClientRect().top), lockedTop);
      await page.locator(".mobile-menu-header a").focus();
      await page.keyboard.press("Shift+Tab");
      assert.equal(await page.evaluate(() => document.activeElement.className), "mobile-menu-phone");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.closest(".mobile-menu-header") !== null), true);
      await page.locator(".mobile-nav-group summary").first().focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.locator(".mobile-nav-group").first().getAttribute("open"), "");
      await page.locator(".mobile-nav-group summary").last().click();
      assert.equal(await page.locator(".mobile-nav-group").last().getAttribute("open"), "");
      await page.locator(".mobile-submenu a").last().focus();
      assert.equal(await page.evaluate(() => document.activeElement.textContent), "Hospice & End-of-Life Support");
      if ([320, 390, 768, 844].includes(width)) await capture(`menu-${width}`);
      await page.keyboard.press("Escape");
      await expectClosed();
      assert.equal(await page.evaluate(() => window.scrollY), before);
      assert.equal(await page.evaluate(() => document.activeElement.className), "menu-toggle");
      await openMenu();
      await page.locator(".menu-close").click();
      await expectClosed();
      if (width > 440) {
        await openMenu();
        await page.mouse.click(10, 120);
        await expectClosed();
      }
      await page.locator(".site-footer").scrollIntoViewIfNeeded();
      const disclosure = page.locator(".footer-resources");
      assert.equal(await disclosure.evaluate((node) => node.open), width > 720);
      if (width <= 720) {
        await disclosure.locator("summary").focus();
        await page.keyboard.press("Enter");
        assert.equal(await disclosure.evaluate((node) => node.open), true);
        await disclosure.locator("summary").click();
      }
      if ([320, 390, 768].includes(width)) await capture(`footer-${width}`, page.locator(".site-footer"));
      console.log(`PASS mobile ${width}x${height}: bounds, scroll lock, focus, disclosure, Escape, close, CTA`);
    }

    for (const width of [1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base);
      assert.equal(await page.locator(".menu-toggle").isVisible(), false);
      assert.equal(await page.locator("#site-nav").isVisible(), true);
      await checkBounds(".nav-wrap, .brand, #site-nav, .nav-actions, .footer-grid, .footer-panel", `Desktop ${width}`);
      await page.locator(".nav-dropdown-trigger").focus();
      assert.equal(await page.locator(".nav-dropdown-trigger").getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator(".nav-dropdown-trigger").getAttribute("aria-expanded"), "false");
      await capture(`header-${width}`, page.locator(".site-header-shell"));
      if (width === 1440) await capture("footer-desktop", page.locator(".site-footer"));
      console.log(`PASS desktop ${width}: navigation, dropdown keyboard close, footer`);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${base}/contact?subject=Referral%20Inquiry#tour-request`);
    await openMenu();
    assert.equal(await page.locator(".mobile-menu-links [aria-current='page']").textContent(), "Contact");
    assert(parseFloat(await page.locator("#mobile-menu").evaluate((node) => getComputedStyle(node).transitionDuration)) < 0.001);
    await page.locator(".mobile-menu-contact .button").click();
    await page.waitForURL(/free-senior-care-consultation\/index\.html$/);
    await page.waitForFunction(() => document.querySelector(".menu-toggle")?.getAttribute("aria-expanded") === "false");
    await page.goto(`${base}/contact?subject=Referral%20Inquiry#tour-request`);
    const form = await page.locator("#tour-request").boundingBox();
    assert(form.y >= 0 && form.y < 844, "Tour anchor is visible on the contact page");
    await openMenu();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expectClosed();
    assert.equal(await page.locator(".footer-resources").evaluate((node) => node.open), true);
    console.log("PASS reduced motion, clean-URL active state, consultation CTA, tour anchor, resize cleanup");

    const routes = [
      "/", "/about", "/services", "/contact", "/burien-adult-family-home.html", "/des-moines-adult-family-home.html",
      "/resources/", "/resources/referral-center/", "/resources/dementia-memory-care/",
      "/resources/articles/when-is-it-time-for-memory-care/", "/privacy-policy/", "/about/clinical-leadership/"
    ];
    for (const route of routes) {
      await page.goto(`${base}${route}`);
      if (route === "/resources/") {
        assert(await page.locator(".reading-path-card").count() > 0, "Resource Center renders its guided paths");
        const referralPath = page.locator(".reading-path-card").filter({ hasText: "Professional Referral Center" });
        assert((await referralPath.locator(".reading-path-footer a").getAttribute("href")).includes("referral-center"));
      }
      const urls = await page.locator("[data-component='site-header'] a[href], .site-footer a[href]").evaluateAll((links) => links.map((link) => link.href));
      for (const href of urls) {
        const url = new URL(href);
        if (url.origin !== base || checkedLinks.has(url.pathname)) continue;
        checkedLinks.add(url.pathname);
        const response = await page.request.get(href);
        assert(response.ok(), `${route} links to broken ${href}: ${response.status()}`);
      }
      assert.equal(await page.locator(".footer-homes address").count(), 2);
      assert((await page.locator(".footer-homes").textContent()).includes("14613 12th Ave SW"));
      assert((await page.locator(".footer-homes").textContent()).includes("1206 S 244th St"));
      assert.equal(await page.locator(".footer-bottom [data-year]").textContent(), String(new Date().getFullYear()));
      await page.setViewportSize({ width: 320, height: 568 });
      await checkBounds(".nav-wrap, .header-breadcrumb, .footer-grid, .footer-panel", `Mobile shared layout on ${route}`);
      await openMenu();
      await checkBounds(".mobile-menu, .mobile-menu-header, .mobile-menu-links", `Mobile route drawer on ${route}`);
      await page.keyboard.press("Escape");
      await expectClosed();
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    assert.deepEqual(errors, [], "Browser errors");
    console.log(`PASS ${routes.length} routes, ${checkedLinks.size} shared link destinations, separate location addresses, current year, no browser errors`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
