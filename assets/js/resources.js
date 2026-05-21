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

  function contactCard(title = "Contact Magnolia for Current Pricing & Availability") {
    return `
      <article class="card resource-action-card">
        <div class="eyebrow">Human support</div>
        <h3>${title}</h3>
        <p>Pricing depends on care needs, room availability, assessment level, and service requirements. Please contact Magnolia directly for current private-pay rates and availability.</p>
        <a class="button" href="${href("contact.html#tour-request")}">Contact Magnolia</a>
      </article>
    `;
  }

  function scheduleTourCard() {
    return `
      <article class="card resource-action-card">
        <div class="eyebrow">Next step</div>
        <h3>Schedule a Tour</h3>
        <p>Touring helps Magnolia understand care needs, room fit, timing, and the service requirements that affect current pricing and availability.</p>
        <a class="button" href="${href("contact.html#tour-request")}">Schedule a Tour</a>
      </article>
    `;
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

  function priorityArticleCard(article, modifier = "") {
    const category = categoryBySlug(article.category);
    return `
      <article class="card resource-priority-card${modifier ? ` ${modifier}` : ""}">
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

  const categorySummaries = {
    "understanding-adult-family-homes": "Learn how Adult Family Homes work and what to compare before choosing care.",
    "dementia-memory-care": "Plan calmer routines, supervision, and safer support for memory changes.",
    "medicaid-financial-guidance": "Understand private pay, Medicaid basics, and how to confirm current pricing.",
    "hospital-discharge-transitions": "Prepare for safer next steps after hospital or rehab discharge.",
    "safety-wellness": "Review fall risk, medication, nutrition, and wellness guidance.",
    "family-support": "Support family decisions, caregiver stress, and difficult conversations.",
    "hospice-end-of-life": "Learn gentle guidance for comfort, dignity, hospice, and family support."
  };

  const mostHelpfulSlugs = [
    "what-is-an-adult-family-home-washington",
    "early-signs-of-dementia-families-miss",
    "how-to-know-when-24-7-care-is-time",
    "does-medicaid-pay-for-adult-family-homes-washington",
    "hospital-discharge-checklist-for-families"
  ];

  const guidedReadingPaths = [
    {
      title: "Dementia Care Path",
      text: "Start with signs, then compare memory care timing, small-home routines, and 24/7 support.",
      steps: [
        ["Early Signs of Dementia", "early-signs-of-dementia-families-miss"],
        ["When Is It Time for Memory Care?", "when-is-it-time-for-memory-care"],
        ["How Small-Home Care Benefits People With Dementia", "how-small-home-care-benefits-people-with-dementia"],
        ["How to Know When It's Time for 24/7 Care", "how-to-know-when-24-7-care-is-time"]
      ]
    },
    {
      title: "Hospital Transition Path",
      text: "Move from discharge instructions to safer supervision, placement questions, and fall-risk planning.",
      steps: [
        ["Hospital Discharge Checklist", "hospital-discharge-checklist-for-families"],
        ["When the Hospital Says Your Parent Can't Go Home", "what-to-do-hospital-says-parent-cant-go-home"],
        ["Questions to Ask Before Discharge", "questions-to-ask-hospital-before-discharge"],
        ["How AFHs Reduce Fall Risk", "how-afhs-reduce-fall-risk-compared-to-living-alone"]
      ]
    },
    {
      title: "Cost & Medicaid Path",
      text: "Learn the Medicaid basics, then confirm current Magnolia pricing and availability directly.",
      steps: [
        ["Does Medicaid Pay for Adult Family Homes?", "does-medicaid-pay-for-adult-family-homes-washington"],
        ["Medicaid & Financial Guidance", "medicaid-financial-guidance", "category"],
        ["Contact Magnolia for Current Pricing & Availability", "contact.html#tour-request", "page"]
      ]
    }
  ];

  function renderReadingPath(path) {
    return `
      <article class="card reading-path-card">
        <div class="eyebrow">Guided path</div>
        <h3>${path.title}</h3>
        <p>${path.text}</p>
        <ol>
          ${path.steps.map(([label, target, type]) => {
            const url = type === "category"
              ? categoryUrl(categoryBySlug(target))
              : type === "page"
                ? href(target)
                : articleUrl(articleBySlug(target));
            return `<li><a href="${url}">${label}</a></li>`;
          }).join("")}
        </ol>
      </article>
    `;
  }

  function articleNextStep(article) {
    const fallback = {
      title: "What to do next",
      body: "Use this guide to write down your family's questions, then talk with Magnolia when you are ready to compare care fit, availability, and next steps.",
      links: [
        ["Schedule a Tour", "contact.html#tour-request", "page"],
        ["Call Magnolia", site.brand.phoneHref, "page"]
      ]
    };
    const byCategory = {
      "dementia-memory-care": {
        title: "What to do next",
        body: "Write down recent memory, safety, sleep, eating, wandering, or medication changes. If supervision is becoming hard to manage, compare dementia support and 24/7 care options before a crisis.",
        links: [
          ["Read about 24/7 care", "how-to-know-when-24-7-care-is-time", "article"],
          ["Contact Magnolia", "contact.html#tour-request", "page"]
        ]
      },
      "medicaid-financial-guidance": {
        title: "What to do next",
        body: "Use this as education only. Medicaid eligibility, authorization, and private-pay planning should be confirmed with qualified sources. Contact Magnolia directly for current private-pay rates and room availability.",
        links: [
          ["Contact Magnolia for pricing", "contact.html#tour-request", "page"],
          ["Explore financial guidance", "medicaid-financial-guidance", "category"]
        ]
      },
      "hospital-discharge-transitions": {
        title: "What to do next",
        body: "Ask the hospital for written care needs, medication lists, mobility instructions, equipment needs, and follow-up appointments before comparing discharge destinations.",
        links: [
          ["Use the discharge checklist", "hospital-discharge-checklist-for-families", "article"],
          ["Talk with Magnolia", "contact.html", "page"]
        ]
      },
      "family-support": {
        title: "What to do next",
        body: "Name the decision, write down safety concerns, and decide who needs to be involved. Families often feel calmer when the next conversation has a clear purpose.",
        links: [
          ["Review 24/7 care signs", "how-to-know-when-24-7-care-is-time", "article"],
          ["Contact Our Care Team", "contact.html", "page"]
        ]
      },
      "safety-wellness": {
        title: "What to do next",
        body: "Track the pattern: falls, medication changes, appetite, hydration, sleep, confusion, or mobility. Share concerns with healthcare professionals and compare whether more supervision is needed.",
        links: [
          ["Read about fall risk", "how-afhs-reduce-fall-risk-compared-to-living-alone", "article"],
          ["Schedule a Tour", "contact.html#tour-request", "page"]
        ]
      }
    };
    const content = byCategory[article.category] || fallback;
    return `
      <aside class="article-next-step">
        <div class="eyebrow">${content.title}</div>
        <p>${content.body}</p>
        <div>
          ${content.links.map(([label, target, type]) => {
            const url = type === "article"
              ? articleUrl(articleBySlug(target))
              : type === "category"
                ? categoryUrl(categoryBySlug(target))
                : href(target);
            return `<a class="text-action-link" href="${url}">${label}</a>`;
          }).join("")}
        </div>
      </aside>
    `;
  }

  function topicNav(currentSlug = "") {
    return data.categories.map((category) => `
      <a href="${categoryUrl(category)}"${category.slug === currentSlug ? ' aria-current="page"' : ""}>
        ${category.title}
      </a>
    `).join("");
  }

  function renderParagraphs(content) {
    const paragraphs = Array.isArray(content) ? content : [content];
    return paragraphs.filter(Boolean).map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  function textFromArticle(article) {
    const category = categoryBySlug(article.category);
    const sectionText = article.sections.map((section) => {
      const body = Array.isArray(section.body) ? section.body.join(" ") : section.body;
      const subsections = (section.subsections || []).map((item) => `${item.heading} ${item.body}`).join(" ");
      return `${section.heading} ${body || ""} ${subsections}`;
    }).join(" ");
    const faqText = article.faq.map(([question, answer]) => `${question} ${answer}`).join(" ");
    return [
      article.title,
      article.excerpt,
      article.metaTitle,
      article.metaDescription,
      category?.title,
      category?.description,
      article.keyTakeaways.join(" "),
      sectionText,
      article.insight,
      faqText
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function sectionHeading(section) {
    return Array.isArray(section) ? section[0] : section.heading;
  }

  function renderArticleSection(section, index) {
    if (Array.isArray(section)) {
      return `
        <section id="section-${index + 1}">
          <h2>${section[0]}</h2>
          ${renderParagraphs(section[1])}
        </section>
      `;
    }
    return `
      <section id="section-${index + 1}">
        <h2>${section.heading}</h2>
        ${renderParagraphs(section.body)}
        ${(section.subsections || []).map((item) => `
          <div class="article-subsection">
            <h3>${item.heading}</h3>
            ${renderParagraphs(item.body)}
          </div>
        `).join("")}
      </section>
    `;
  }

  function renderResourceCenter() {
    const mount = document.querySelector("[data-resource-center]");
    if (!mount) return;
    const mostHelpful = mostHelpfulSlugs.map(articleBySlug).filter(Boolean);
    const featured = Object.values(data.articles)
      .filter((article) => !mostHelpfulSlugs.includes(article.slug))
      .slice(0, 6);
    mount.innerHTML = `
      <section class="page-hero interior-hero resource-center-hero">
        <div class="container resource-hero-grid">
          <div>
            <div class="breadcrumb"><a href="${href("index.html")}">Home</a> / Resource Center</div>
            <div class="eyebrow">Magnolia Senior Care education hub</div>
            <h1>Resource Center</h1>
            <p class="page-lede">Clear, RN-led guidance for Washington families who are trying to understand Adult Family Homes, dementia care, hospital discharge, safety, Medicaid questions, and what to do next.</p>
            <div class="hero-proof-row resource-trust-row" aria-label="Resource Center trust signals">
              <span>Reviewed by RN</span>
              <span>Washington-specific</span>
              <span>Family decision support</span>
              <span>Small-home care expertise</span>
            </div>
            <form class="resource-search-form" role="search" aria-label="Search Magnolia Resource Center">
              <label class="resource-search-label" for="resource-search">Search resources</label>
              <input id="resource-search" class="resource-search" type="search" placeholder="Optional: search a topic or question" autocomplete="off">
              <button class="resource-search-button" type="submit">Search</button>
            </form>
            <p class="resource-search-hint">Most families start with the guided cards below. Search is here if you already know what you need.</p>
          </div>
          <aside class="resource-hero-panel" aria-label="Magnolia Resource Center guidance">
            <div><strong>A calm home setting</strong><span>Education shaped around dignity, safety, and daily routines.</span></div>
            <div><strong>RN-led guidance</strong><span>Reviewed with a clinical eye for family-friendly planning.</span></div>
            <div><strong>Family-centered care</strong><span>Built for adult children, spouses, POAs, and care partners.</span></div>
          </aside>
        </div>
      </section>

      <section class="section resource-search-results-section" data-resource-search-results hidden>
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Search results</div>
            <h2>Guides that match your question</h2>
            <p id="resource-search-summary" aria-live="polite">Type a topic above to find related Magnolia guides.</p>
          </div>
          <div class="resource-article-grid" id="resource-search-results-list"></div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <h2>Start Here</h2>
            <p>Choose the situation that best matches what your family is facing.</p>
          </div>
          <div class="resource-pathway-grid">
            ${data.pathways.map((item, index) => {
              const article = articleBySlug(item.article);
              return `
                <article class="card resource-pathway-card">
                  <span class="resource-pathway-number" aria-hidden="true">${index + 1}</span>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                  <a class="text-action-link resource-card-action" href="${articleUrl(article)}">Start here</a>
                </article>
              `;
            }).join("")}
          </div>
        </div>
      </section>

      <section class="section soft resource-most-helpful-section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Most Helpful for Families</div>
            <h2>Start with the guides families use most.</h2>
            <p>These are the clearest starting points for understanding care options, safety, dementia concerns, cost questions, and discharge planning.</p>
          </div>
          <div class="resource-priority-grid">
            ${mostHelpful.map((article, index) => priorityArticleCard(article, index === 0 ? "featured" : "")).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head center compact-head">
            <div class="eyebrow">Featured Guides</div>
            <h2>Supporting guides for the next question.</h2>
            <p>Use these when you are ready to go one layer deeper.</p>
          </div>
          <div class="resource-article-grid supporting-guides-grid" data-resource-filter-list>
            ${featured.map(articleCard).join("")}
          </div>
        </div>
      </section>

      <section class="section soft">
        <div class="container">
          <div class="section-head center">
            <div class="eyebrow">Browse by Topic</div>
            <h2>Explore senior care topics</h2>
            <p>Browse education by care need, planning stage, or family concern.</p>
          </div>
          <div class="resource-category-grid" data-resource-filter-list>
            ${data.categories.map((category) => {
              const count = articlesByCategory(category.slug).length;
              const countLabel = count ? `${count} guide${count === 1 ? "" : "s"}` : "Guides coming soon";
              return `
                <article class="card resource-category-card" data-resource-search-item>
                  ${icon(category.icon)}
                  <div class="eyebrow">${countLabel}</div>
                  <h3>${category.title}</h3>
                  <p>${categorySummaries[category.slug] || category.description}</p>
                  <a class="text-action-link resource-card-action" href="${categoryUrl(category)}">Explore guides</a>
                </article>
              `;
            }).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Guided Reading Paths</div>
            <h2>Follow a simple path when the decision feels big.</h2>
            <p>These short journeys connect the guides families usually need in order.</p>
          </div>
          <div class="reading-path-grid">
            ${guidedReadingPaths.map(renderReadingPath).join("")}
          </div>
        </div>
      </section>

      <section class="section soft">
        <div class="container">
          <div class="resource-mission-card">
            <div>
              <div class="eyebrow">Why Magnolia created this Resource Center</div>
              <h2>Calm guidance for decisions that rarely feel simple.</h2>
              <p>Families often arrive here during a stressful turning point. Magnolia created this Resource Center to make senior care decisions feel more understandable, grounded, and human, with an RN-led perspective shaped by Adult Family Home care, dementia support, safety, and hospital transitions in Washington.</p>
              <p>This content is educational and does not replace medical, legal, or financial advice. Families should consult appropriate professionals for personal guidance.</p>
            </div>
            <ul class="resource-trust-list">
              <li>RN-led perspective from Sosena Mekuria, RN</li>
              <li>Washington-specific Adult Family Home education</li>
              <li>Dementia, safety, and hospital-transition guidance</li>
              <li>Support for family decision-makers and POAs</li>
              <li>Warm, educational guidance without pressure</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container cta-band resource-support-cta">
          <div class="grid-2">
            <div><div class="eyebrow">Still have questions?</div><h2>Talk with Magnolia before you decide.</h2></div>
            <div>
              <p>Pricing depends on care needs, room availability, assessment level, and service requirements. Please contact Magnolia directly for current private-pay rates and availability.</p>
              <div class="hero-actions">
                <a class="button" href="${href("contact.html#tour-request")}">Schedule a Tour</a>
                <a class="button secondary" href="${site.brand.phoneHref}">Call Magnolia</a>
                <a class="text-action-link" href="${href("contact.html")}">Contact Our Care Team</a>
              </div>
            </div>
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
    const countLabel = articles.length ? `${articles.length} guide${articles.length === 1 ? "" : "s"}` : "Guides coming soon";
    mount.innerHTML = `
      <section class="page-hero interior-hero resources-hero">
        <div class="container interior-hero-grid">
          <div class="interior-hero-copy">
            <div class="breadcrumb"><a href="${href("index.html")}">Home</a> / <a href="${href("resources/index.html")}">Resource Center</a> / ${category.title}</div>
            <div class="eyebrow">Resource category</div>
            <h1>${category.title}</h1>
            <p class="page-lede">${category.description}</p>
          </div>
          <aside class="interior-hero-card">
            <div class="proof-card-label">${countLabel}</div>
            <div class="interior-proof-row"><strong>Start with clarity</strong><span>Plain-language education for families, POAs, and care partners.</span></div>
            <div class="interior-proof-row"><strong>RN-led lens</strong><span>Guidance shaped around safety, dignity, routines, and communication.</span></div>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Start with these guides</div>
            <h2>${articles.length ? `Helpful guides in ${category.title}` : "Start with these Magnolia guides"}</h2>
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
                <a class="text-action-link resource-card-action" href="${categoryUrl(item)}">Explore guides</a>
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
          <div class="breadcrumb"><a href="${href("index.html")}">Home</a> / <a href="${href("resources/index.html")}">Resource Center</a> / <a href="${categoryUrl(category)}">${category.title}</a></div>
          <div class="eyebrow">${category.title}</div>
          <h1>${article.title}</h1>
          <p class="page-lede">${article.excerpt}</p>
          <div class="article-meta-row" aria-label="Article details">
            <span><strong>Category</strong>${category.title}</span>
            <span><strong>Read time</strong>${article.readTime}</span>
            <span><strong>Last updated</strong>${article.lastUpdated}</span>
            <span><strong>Reviewed by</strong>${article.reviewedBy}</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container article-layout resource-article-layout">
          <article class="article-body resource-article">
            <nav class="article-topic-nav" aria-label="Explore related topics">
              <strong>Explore related topics</strong>
              <div>${topicNav(article.category)}</div>
            </nav>
            <div class="key-takeaways">
              <div class="eyebrow">Key takeaways</div>
              <ul>${article.keyTakeaways.map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
            ${articleNextStep(article)}
            <nav class="toc-card" aria-label="Table of contents">
              <strong>In this guide</strong>
              ${article.sections.map((section, index) => `<a href="#section-${index + 1}">${sectionHeading(section)}</a>`).join("")}
              <a href="#faq">FAQ</a>
            </nav>
            ${article.sections.map(renderArticleSection).join("")}
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
            <div class="eyebrow">Continue learning</div>
            <h3>Helpful next reads</h3>
            <p>These guides connect naturally to the next decision families usually face.</p>
            <div class="sidebar-link-list">
              ${related.map((item) => {
                const itemCategory = categoryBySlug(item.category);
                return `<a href="${articleUrl(item)}">${item.title}<span>${itemCategory?.title || "Magnolia guide"} / ${item.readTime}</span></a>`;
              }).join("")}
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
              <p>If your family is trying to understand care fit, timing, availability, or next steps, Magnolia can talk through the situation calmly. Pricing depends on care needs, room availability, assessment level, and service requirements.</p>
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
    const form = document.querySelector(".resource-search-form");
    const section = document.querySelector("[data-resource-search-results]");
    const list = document.querySelector("#resource-search-results-list");
    const summary = document.querySelector("#resource-search-summary");
    const allArticles = Object.values(data.articles);
    const allCategories = data.categories;
    const defaultPathwaySlugs = [
      "early-signs-of-dementia-families-miss",
      "does-medicaid-pay-for-adult-family-homes-washington",
      "hospital-discharge-checklist-for-families",
      "what-is-an-adult-family-home-washington"
    ];
    const aliasGroups = [
      {
        id: "pricing",
        terms: ["price", "prices", "pricing", "cost", "costs", "rate", "rates", "private pay", "room availability", "availability"],
        articles: ["does-medicaid-pay-for-adult-family-homes-washington"],
        categories: ["medicaid-financial-guidance"],
        includeContact: true,
        includeTour: true
      },
      {
        id: "financial",
        terms: ["pay", "spenddown", "spend-down", "medicaid", "financial"],
        articles: ["does-medicaid-pay-for-adult-family-homes-washington"],
        categories: ["medicaid-financial-guidance"]
      },
      {
        id: "afh",
        terms: ["afh", "adult family home", "choose", "choosing", "tour", "license", "licensing", "services", "staffing"],
        articles: ["how-to-choose-the-right-adult-family-home", "what-services-do-adult-family-homes-provide", "what-is-an-adult-family-home-washington"],
        categories: ["understanding-adult-family-homes"]
      },
      {
        id: "dementia",
        terms: ["dementia", "memory", "alzheimer", "alzheimers", "alzheimer's", "anxiety", "wandering", "routine", "routines"],
        articles: ["can-people-with-dementia-live-in-an-afh", "memory-care-routines-that-reduce-anxiety", "early-signs-of-dementia-families-miss", "how-small-home-care-benefits-people-with-dementia"],
        categories: ["dementia-memory-care"]
      },
      {
        id: "hospital",
        terms: ["hospital", "discharge", "rehab", "transition", "transitions", "diagnosis", "equipment"],
        articles: ["questions-to-ask-hospital-before-discharge", "hospital-discharge-checklist-for-families", "what-to-do-hospital-says-parent-cant-go-home"],
        categories: ["hospital-discharge-transitions"]
      },
      {
        id: "safety",
        terms: ["fall", "falls", "safety", "safe", "medication", "nutrition", "meals", "hydration", "swallowing", "protein"],
        articles: ["senior-nutrition-what-older-adults-really-need", "how-afhs-reduce-fall-risk-compared-to-living-alone", "medication-management-in-adult-family-home"],
        categories: ["safety-wellness"]
      },
      {
        id: "hospice",
        terms: ["hospice", "end of life", "end-of-life", "palliative", "comfort"],
        articles: [],
        categories: ["hospice-end-of-life"]
      },
      {
        id: "tour",
        terms: ["room", "rooms", "available", "tour", "visit", "openings"],
        articles: ["how-to-choose-the-right-adult-family-home", "what-is-an-adult-family-home-washington"],
        categories: ["understanding-adult-family-homes"],
        includeContact: true
      }
    ];

    function categoryResultCard(category) {
      const count = articlesByCategory(category.slug).length;
      return `
        <article class="card resource-category-card">
          ${icon(category.icon)}
          <div class="eyebrow">${count ? `${count} guide${count === 1 ? "" : "s"}` : "Topic"}</div>
          <h3>${category.title}</h3>
          <p>${category.description}</p>
          <a class="text-action-link resource-card-action" href="${categoryUrl(category)}">Explore guides</a>
        </article>
      `;
    }

    function compactArticleCard(article) {
      return article ? articleCard(article) : "";
    }

    function normalize(value) {
      return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
    }

    function editDistance(a, b) {
      if (!a || !b) return Math.max(a.length, b.length);
      const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
      for (let i = 0; i < a.length; i += 1) {
        const current = [i + 1];
        for (let j = 0; j < b.length; j += 1) {
          current[j + 1] = a[i] === b[j]
            ? previous[j]
            : Math.min(previous[j] + 1, current[j] + 1, previous[j + 1] + 1);
        }
        previous.splice(0, previous.length, ...current);
      }
      return previous[b.length];
    }

    function queryMatchesTerm(query, term) {
      const normalizedTerm = normalize(term);
      if (!normalizedTerm) return false;
      if (query.includes(normalizedTerm) || normalizedTerm.includes(query)) return true;
      return query.split(" ").some((word) => (
        word.length > 3 && normalizedTerm.length > 3 && editDistance(word, normalizedTerm) <= 2
      ));
    }

    function aliasMatches(query) {
      return aliasGroups.filter((group) => group.terms.some((term) => queryMatchesTerm(query, term)));
    }

    function cardsFromSuggestions(groups, fallbackSlugs = defaultPathwaySlugs) {
      const articleSlugs = [];
      const categorySlugs = [];
      let includeContact = false;
      let includeTour = false;

      groups.forEach((group) => {
        articleSlugs.push(...group.articles);
        categorySlugs.push(...group.categories);
        includeContact = includeContact || group.includeContact;
        includeTour = includeTour || group.includeTour;
      });

      const uniqueArticleSlugs = [...new Set(articleSlugs.length ? articleSlugs : fallbackSlugs)];
      const uniqueCategorySlugs = [...new Set(categorySlugs)];
      const articleCards = uniqueArticleSlugs.map((slug) => compactArticleCard(articleBySlug(slug))).filter(Boolean);
      const categoryCards = uniqueCategorySlugs
        .map((slug) => categoryBySlug(slug))
        .filter(Boolean)
        .map(categoryResultCard);
      const supportCard = includeContact ? [contactCard()] : [];
      const tourCard = includeTour ? [scheduleTourCard()] : [];
      return [...supportCard, ...categoryCards, ...articleCards, ...tourCard].slice(0, 4).join("");
    }

    function pricingSuggestionCards() {
      const medicaidCategory = categoryBySlug("medicaid-financial-guidance");
      return [
        contactCard(),
        medicaidCategory ? categoryResultCard(medicaidCategory) : "",
        compactArticleCard(articleBySlug("does-medicaid-pay-for-adult-family-homes-washington")),
        scheduleTourCard()
      ].filter(Boolean).join("");
    }

    function runSearch({ shouldScroll = false } = {}) {
      const rawQuery = input.value.trim();
      const query = normalize(rawQuery);
      if (!query) {
        section.hidden = true;
        list.innerHTML = "";
        summary.textContent = "Type a topic above to find related Magnolia guides.";
        return;
      }

      const aliases = aliasMatches(query);
      const matchingCategories = allCategories.filter((category) => (
        normalize(`${category.title} ${category.description}`).includes(query)
      ));
      const articleSearchScore = (article) => {
        if (normalize(article.title).includes(query)) return 0;
        if (normalize(`${article.excerpt} ${article.metaTitle} ${article.metaDescription}`).includes(query)) return 1;
        return 2;
      };
      const matchingArticles = allArticles
        .filter((article) => textFromArticle(article).includes(query))
        .sort((a, b) => articleSearchScore(a) - articleSearchScore(b));
      const total = matchingCategories.length + matchingArticles.length;
      section.hidden = false;

      if (aliases.some((group) => group.id === "pricing")) {
        summary.textContent = `Current pricing and availability should be confirmed directly with Magnolia for "${rawQuery}".`;
        list.innerHTML = pricingSuggestionCards();
      } else if (total) {
        summary.textContent = `${total} result${total === 1 ? "" : "s"} for "${rawQuery}".`;
        list.innerHTML = `${matchingCategories.map(categoryResultCard).join("")}${matchingArticles.map(articleCard).join("")}`;
      } else {
        summary.innerHTML = "No exact match found &mdash; try one of these guided topics below.";
        list.innerHTML = cardsFromSuggestions(aliases);
      }

      if (shouldScroll) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    input.addEventListener("input", () => runSearch());
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch({ shouldScroll: true });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderResourceCenter();
    renderCategoryPage();
    renderArticlePage();
    renderHomepageResources();
    initResourceSearch();
  });
})();
