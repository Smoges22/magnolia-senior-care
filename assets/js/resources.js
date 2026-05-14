(function () {
  const data = window.MagnoliaResources;
  const site = window.AFHSite;
  if (!data || !site) return;

  function pathPrefix() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/resources/articles/")) return "../../../";
    if (path.includes("/resources/") && !path.endsWith("/resources/") && !path.endsWith("/resources/index.html")) return "../../";
    if (path.endsWith("/resources")) return "../";
    if (path.includes("/resources/")) return "../";
    if (path.includes("/blog/")) return "../";
    return "";
  }

  function href(path) {
    if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
    return `${pathPrefix()}${path}`;
  }

  function categoryBySlug(slug) {
    return data.categories.find((item) => item.slug === slug);
  }

  function articleBySlug(slug) {
    return data.articles[slug];
  }

  function articlesByCategory(slug) {
    return Object.values(data.articles).filter((article) => article.category === slug);
  }

  function icon(name) {
    const icons = {
      home: '<path d="M5.5 12.4 12 7l6.5 5.4"/><path d="M7.5 11.2v7.1h9v-7.1"/><path d="M10 18.3v-4.4h4v4.4"/>',
      memory: '<path d="M8.3 17.5c-2-1.2-3.1-3-3.1-5.2 0-3.4 2.8-6.1 6.4-6.1 3.9 0 7.2 3 7.2 6.8 0 2.7-1.5 4.8-3.9 5.8"/><path d="M9.2 10.6c.7-.8 1.6-1.2 2.8-1.2 1.6 0 2.8 1 2.8 2.4 0 1.3-.8 2.1-2 2.5v1.3"/><path d="M12.8 18.7h.1"/>',
      finance: '<path d="M6.5 5.5h11v13h-11z"/><path d="M9 9h6"/><path d="M9 12h6"/><path d="M9 15h3"/>',
      transition: '<path d="M5 17.9c2.6-5.7 6.7-8.8 12.5-9.3"/><path d="M14.8 5.8 17.8 8.6l-2.7 3"/><path d="M5.5 18.2h13"/>',
      shield: '<path d="M12 3.5 5.5 6v5.4c0 4.2 2.7 7.6 6.5 9.1 3.8-1.5 6.5-4.9 6.5-9.1V6L12 3.5Z"/><path d="m9.2 12.1 2 2 3.8-4.1"/>',
      family: '<path d="M7.1 11.4c-1.2-1.3-1.2-3.3 0-4.5a3 3 0 0 1 4.3 0l.6.6.6-.6a3 3 0 0 1 4.3 0c1.2 1.2 1.2 3.2 0 4.5L12 16.2l-4.9-4.8Z"/><path d="M5 18.5h14"/>',
      comfort: '<path d="M6 17.4c2.7-1.2 4.7-3.5 5.9-6.9 1.2 3.4 3.2 5.7 6.1 6.9"/><path d="M12 5.5v5"/><path d="M7.5 19h9"/>'
    };
    return `<span class="resource-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[name] || icons.home}</svg></span>`;
  }

  function articleUrl(article) {
    return href(`resources/articles/${article.slug}/index.html`);
  }

  function categoryUrl(category) {
    return href(`resources/${category.slug}/index.html`);
  }

  function articleCard(article) {
    const category = categoryBySlug(article.category);
    return `
      <article class="card resource-article-card">
        <div class="eyebrow">${category?.title || "Magnolia guide"}</div>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <div class="resource-card-meta">
          <span>${article.readTime}</span>
          <span>Reviewed by RN</span>
        </div>
        <a class="text-action-link resource-card-action" href="${articleUrl(article)}">Read guide</a>
      </article>
    `;
  }

  function renderAssistant() {
    if (document.querySelector(".care-guide-float")) return;
    const node = document.createElement("aside");
    node.className = "care-guide-float";
    node.setAttribute("aria-label", "Magnolia Care Guide assistant placeholder");
    node.innerHTML = `
      <div>
        <strong>Magnolia Care Guide</strong>
        <span>Ask about pricing, room availability, tours, Medicaid/private pay, services, or common questions.</span>
      </div>
      <button type="button" aria-label="Ask Magnolia Care Guide a question">Ask a question</button>
    `;
    document.body.appendChild(node);
  }

  function renderResourceCenter() {
    const mount = document.querySelector("[data-resource-center]");
    if (!mount) return;
    const featured = Object.values(data.articles).filter((article) => article.featured);
    mount.innerHTML = `
      <section class="page-hero interior-hero resource-center-hero">
        <div class="container">
          <div class="breadcrumb"><a href="${href("index.html")}">Home</a> / Resources</div>
          <div class="eyebrow">Magnolia Resource Center</div>
          <h1>Guidance for Families Navigating Senior Care</h1>
          <p class="page-lede">RN-led educational resources for Adult Family Homes, dementia care, Medicaid planning, hospital transitions, safety, and end-of-life support in Washington.</p>
          <label class="resource-search-label" for="resource-search">Search resources</label>
          <input id="resource-search" class="resource-search" type="search" placeholder="Search senior care topics..." autocomplete="off">
          <div class="hero-proof-row resource-trust-row" aria-label="Resource Center trust signals">
            <span>RN-led guidance</span>
            <span>Washington-specific</span>
            <span>Family-friendly education</span>
            <span>Adult Family Home expertise</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head center">
            <div class="eyebrow">Browse by topic</div>
            <h2>Senior care education, organized around real family questions.</h2>
          </div>
          <div class="resource-category-grid" data-resource-filter-list>
            ${data.categories.map((category) => `
              <article class="card resource-category-card" data-resource-search-item>
                ${icon(category.icon)}
                <div class="eyebrow">${category.articleCount} articles</div>
                <h3>${category.title}</h3>
                <p>${category.description}</p>
                <a class="text-action-link resource-card-action" href="${categoryUrl(category)}">Explore articles</a>
              </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="section soft">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Start here</div>
            <h2>Not sure where to begin?</h2>
          </div>
          <div class="resource-pathway-grid">
            ${data.pathways.map((item) => {
              const article = articleBySlug(item.article);
              return `
                <article class="card resource-pathway-card">
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                  <a class="text-action-link resource-card-action" href="${articleUrl(article)}">${article.title}</a>
                </article>
              `;
            }).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head center">
            <div class="eyebrow">Featured guides</div>
            <h2>Clear, practical guides for confident care decisions.</h2>
          </div>
          <div class="resource-article-grid" data-resource-filter-list>
            ${featured.map(articleCard).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderCategoryPage() {
    const mount = document.querySelector("[data-resource-category]");
    if (!mount) return;
    const category = categoryBySlug(mount.dataset.resourceCategory);
    if (!category) return;
    const articles = articlesByCategory(category.slug);
    const fallbackArticles = Object.values(data.articles).filter((article) => article.featured).slice(0, 4);
    const displayArticles = articles.length ? articles : fallbackArticles;
    const related = data.categories.filter((item) => item.slug !== category.slug).slice(0, 3);
    mount.innerHTML = `
      <section class="page-hero interior-hero resources-hero">
        <div class="container interior-hero-grid">
          <div class="interior-hero-copy">
            <div class="breadcrumb"><a href="${href("index.html")}">Home</a> / <a href="${href("resources/index.html")}">Resources</a> / ${category.title}</div>
            <div class="eyebrow">Resource category</div>
            <h1>${category.title}</h1>
            <p class="page-lede">${category.description}</p>
          </div>
          <aside class="interior-hero-card">
            <div class="proof-card-label">${category.articleCount} guides</div>
            <div class="interior-proof-row"><strong>Start with clarity</strong><span>Plain-language education for families, POAs, and care partners.</span></div>
            <div class="interior-proof-row"><strong>RN-led lens</strong><span>Guidance shaped around safety, dignity, routines, and communication.</span></div>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Start with these guides</div>
            <h2>${articles.length ? `Helpful articles in ${category.title}` : "Start with these Magnolia guides"}</h2>
            ${articles.length ? "" : "<p>More topic-specific guides can be added here over time. These foundational resources are a helpful place to begin.</p>"}
          </div>
          <div class="resource-article-grid">
            ${displayArticles.map(articleCard).join("")}
          </div>
        </div>
      </section>

      <section class="section soft">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Related topics</div>
            <h2>Continue learning</h2>
          </div>
          <div class="resource-category-grid compact">
            ${related.map((item) => `
              <article class="card resource-category-card">
                ${icon(item.icon)}
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a class="text-action-link resource-card-action" href="${categoryUrl(item)}">Explore articles</a>
              </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container cta-band">
          <div class="grid-2">
            <div><div class="eyebrow">Ask Magnolia</div><h2>Have questions about care options?</h2></div>
            <div>
              <p>Magnolia can help you understand care fit, availability, location options, and what to ask next.</p>
              <div class="hero-actions">
                <a class="button" href="${href("contact.html")}">Schedule a Tour</a>
                <a class="button secondary" href="${site.brand.phoneHref}">Call Magnolia</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderArticlePage() {
    const mount = document.querySelector("[data-resource-article]");
    if (!mount) return;
    const article = articleBySlug(mount.dataset.resourceArticle);
    if (!article) return;
    const category = categoryBySlug(article.category);
    const related = article.relatedArticles.map(articleBySlug).filter(Boolean);
    mount.innerHTML = `
      <section class="page-hero interior-hero resources-hero">
        <div class="container">
          <div class="breadcrumb"><a href="${href("index.html")}">Home</a> / <a href="${href("resources/index.html")}">Resources</a> / <a href="${categoryUrl(category)}">${category.title}</a></div>
          <div class="eyebrow">${category.title}</div>
          <h1>${article.title}</h1>
          <p class="page-lede">${article.excerpt}</p>
          <p class="response-pill">${article.readTime} / Last updated ${article.lastUpdated}</p>
        </div>
      </section>

      <section class="section">
        <div class="container article-layout resource-article-layout">
          <article class="article-body resource-article">
            <div class="key-takeaways">
              <div class="eyebrow">Key takeaways</div>
              <ul>${article.keyTakeaways.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
            <nav class="toc-card" aria-label="Table of contents">
              <strong>In this guide</strong>
              ${article.sections.map(([heading], index) => `<a href="#section-${index + 1}">${heading}</a>`).join("")}
              <a href="#faq">FAQ</a>
            </nav>
            ${article.sections.map(([heading, body], index) => `
              <section id="section-${index + 1}">
                <h2>${heading}</h2>
                <p>${body}</p>
              </section>
            `).join("")}
            <aside class="magnolia-insight">
              <div class="eyebrow">Magnolia insight</div>
              <p>${article.insight}</p>
            </aside>
            <aside class="reviewed-block">
              <strong>Reviewed by ${article.reviewedBy}</strong>
              <span>RN-led educational review for family-friendly care planning.</span>
            </aside>
            <aside class="article-disclaimer">
              This article is for general education only and does not replace medical, legal, or financial advice. Families should consult appropriate professionals for personal guidance.
            </aside>
            <section id="faq" class="faq-section">
              <h2>Frequently asked questions</h2>
              ${article.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
            </section>
          </article>
          <aside class="sidebar card info-card resource-sidebar">
            <div class="eyebrow">Related articles</div>
            <h3>Keep learning</h3>
            <p>Helpful next reads based on this topic.</p>
            <div class="sidebar-link-list">
              ${related.map((item) => `<a href="${articleUrl(item)}">${item.title}<span>${item.readTime}</span></a>`).join("")}
            </div>
            <a class="button" href="${href("contact.html")}">Schedule a Tour</a>
            <a class="button secondary" href="${site.brand.phoneHref}">Call Magnolia</a>
          </aside>
        </div>
      </section>

      <section class="section soft">
        <div class="container cta-band">
          <div class="grid-2">
            <div><div class="eyebrow">Talk with Magnolia</div><h2>Have questions about care options?</h2></div>
            <div>
              <p>Speak with Magnolia about care needs, room availability, tours, private pay, Medicaid questions to ask, and next steps.</p>
              <div class="hero-actions">
                <a class="button" href="${href("contact.html")}">Schedule a Tour</a>
                <a class="button secondary" href="${site.brand.phoneHref}">Call Magnolia</a>
                <a class="text-action-link" href="${href("contact.html")}">Contact Our Care Team</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderHomepageResources() {
    const mount = document.querySelector("[data-home-resources]");
    if (!mount) return;
    const featured = Object.values(data.articles).filter((article) => article.featured).slice(0, 4);
    mount.innerHTML = `
      <div class="container">
        <div class="section-head center">
          <div class="eyebrow">Resource Center</div>
          <h2>Explore Our Senior Care Resource Center</h2>
          <p>Helpful, RN-led guidance for families comparing care options, planning transitions, and making confident decisions.</p>
        </div>
        <div class="resource-article-grid compact">
          ${featured.map(articleCard).join("")}
        </div>
        <div class="section-actions center-actions">
          <a class="button" href="${href("resources/index.html")}">Visit Resource Center</a>
        </div>
      </div>
    `;
  }

  function initResourceSearch() {
    const input = document.querySelector("#resource-search");
    if (!input) return;
    const items = Array.from(document.querySelectorAll("[data-resource-search-item], .resource-article-card"));
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      items.forEach((item) => {
        item.hidden = query && !item.textContent.toLowerCase().includes(query);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderResourceCenter();
    renderCategoryPage();
    renderArticlePage();
    renderHomepageResources();
    initResourceSearch();
    renderAssistant();
  });
})();
