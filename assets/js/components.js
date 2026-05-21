(function () {
  const site = window.AFHSite;

  function currentPage() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/about/clinical-leadership/")) return "clinical-leadership";
    if (path.includes("/privacy-policy/")) return "privacy-policy";
    if (path.includes("/terms-of-use/")) return "terms-of-use";
    if (path.includes("/disclaimer/")) return "disclaimer";
    if (path.includes("/accessibility/")) return "accessibility";
    const name = path.split("/").pop() || "index.html";
    return name;
  }

  function pathPrefix() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/resources/articles/")) return "../../../";
    if (path.includes("/resources/") && !path.endsWith("/resources/") && !path.endsWith("/resources/index.html")) return "../../";
    if (path.endsWith("/resources")) return "../";
    if (path.includes("/resources/")) return "../";
    if (path.includes("/about/clinical-leadership/")) return "../../";
    if (path.includes("/privacy-policy/") || path.includes("/terms-of-use/") || path.includes("/disclaimer/") || path.includes("/accessibility/")) return "../";
    if (path.includes("/blog/")) return "../";
    return "";
  }

  function localHref(href) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
    return `${pathPrefix()}${href}`;
  }

  function mapHref(address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  function breadcrumbTrail() {
    const active = currentPage();
    const path = window.location.pathname.replace(/\\/g, "/");
    const pageMap = {
      "about.html": [["Home", "index.html"], ["About"]],
      "clinical-leadership": [["Home", "index.html"], ["About", "about.html"], ["Clinical Leadership"]],
      "services.html": [["Home", "index.html"], ["Services"]],
      "rooms-photos.html": [["Home", "index.html"], ["Gallery"]],
      "referral-agents.html": [["Home", "index.html"], ["Referrals"]],
      "contact.html": [["Home", "index.html"], ["Contact"]],
      "privacy-policy": [["Home", "index.html"], ["Privacy Policy"]],
      "terms-of-use": [["Home", "index.html"], ["Terms of Use"]],
      "disclaimer": [["Home", "index.html"], ["Educational Disclaimer"]],
      "accessibility": [["Home", "index.html"], ["Accessibility"]],
      "burien-adult-family-home.html": [["Home", "index.html"], ["Locations", "index.html#locations"], ["Burien"]],
      "des-moines-adult-family-home.html": [["Home", "index.html"], ["Locations", "index.html#locations"], ["Des Moines"]],
      "afh-education-template.html": [["Home", "index.html"], ["Resource Center"]]
    };
    if (path.includes("/resources/") || path.endsWith("/resources")) {
      const resources = window.MagnoliaResources;
      const articleSlug = document.body?.dataset?.article;
      const categorySlug = document.body?.dataset?.category;
      if (articleSlug && resources?.articles?.[articleSlug]) {
        const article = resources.articles[articleSlug];
        const category = resources.categories.find((item) => item.slug === article.category);
        return [["Home", "index.html"], ["Resource Center", "resources/index.html"], [category?.title || "Article", `resources/${article.category}/index.html`], [article.title]];
      }
      if (categorySlug && resources?.categories) {
        const category = resources.categories.find((item) => item.slug === categorySlug);
        return [["Home", "index.html"], ["Resource Center", "resources/index.html"], [category?.title || "Category"]];
      }
      return [["Home", "index.html"], ["Resource Center"]];
    }
    return pageMap[active] || [];
  }

  function fallbackImageSrc() {
    return localHref("assets/images/magnolia-photo-fallback.svg");
  }

  function socialIcon(label) {
    const icon = label.toLowerCase();
    const icons = {
      facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v2H6v4h3v5h4v-5h3.2l.8-4h-4V9c0-.7.3-1 1-1Z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r="1"/></svg>',
      youtube: '<svg class="youtube-brand-icon" viewBox="0 0 24 24" aria-hidden="true"><path class="youtube-mark" d="M21.58 7.18a2.72 2.72 0 0 0-1.92-1.92C17.97 4.8 12 4.8 12 4.8s-5.97 0-7.66.46a2.72 2.72 0 0 0-1.92 1.92C1.96 8.88 1.96 12 1.96 12s0 3.12.46 4.82a2.72 2.72 0 0 0 1.92 1.92c1.69.46 7.66.46 7.66.46s5.97 0 7.66-.46a2.72 2.72 0 0 0 1.92-1.92c.46-1.7.46-4.82.46-4.82s0-3.12-.46-4.82Z"/><path class="youtube-play-mark" d="M9.95 15.33V8.67L15.72 12l-5.77 3.33Z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 9.2H3V21h3.2V9.2ZM4.6 3C3.6 3 2.8 3.8 2.8 4.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8S5.6 3 4.6 3ZM21 21h-3.2v-6.1c0-1.6-.7-2.5-2-2.5-1.1 0-1.8.7-2.1 1.4-.1.2-.1.6-.1.9V21h-3.2V9.2h3.2v1.6c.6-1 1.8-1.9 3.6-1.9 2.6 0 3.8 1.8 3.8 5V21Z"/></svg>'
    };
    return icons[icon] || '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5h3v3h-3a1.5 1.5 0 0 0 0 3h3v3h-3A4.5 4.5 0 0 1 7.5 12Zm1.5 1.5h6v-3H9v3Zm0 3H6a4.5 4.5 0 0 1 0-9h3v3H6a1.5 1.5 0 0 0 0 3h3v3Z"/></svg>';
  }

  function careIcon(title = "") {
    const key = title.toLowerCase();
    if (key.includes("rn")) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 5.5 6v5.4c0 4.2 2.7 7.6 6.5 9.1 3.8-1.5 6.5-4.9 6.5-9.1V6L12 3.5Z"/><path d="m9.2 12.1 2 2 3.8-4.1"/></svg>';
    }
    if (key.includes("personal")) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 12.4c-1.2-1.3-1.2-3.3 0-4.5a3 3 0 0 1 4.3 0l.5.5.5-.5a3 3 0 0 1 4.3 0c1.2 1.2 1.2 3.2 0 4.5L12 17.1l-4.8-4.7Z"/><path d="M4.8 19.2h14.4"/></svg>';
    }
    if (key.includes("medication")) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 4.8h7.6v14.4H8.2z"/><path d="M10.4 8.8h3.2"/><path d="M12 7.2v3.2"/><path d="M10.5 15.3h3"/></svg>';
    }
    if (key.includes("dementia") || key.includes("memory")) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 17.5c-2-1.2-3.1-3-3.1-5.2 0-3.4 2.8-6.1 6.4-6.1 3.9 0 7.2 3 7.2 6.8 0 2.7-1.5 4.8-3.9 5.8"/><path d="M9.2 10.6c.7-.8 1.6-1.2 2.8-1.2 1.6 0 2.8 1 2.8 2.4 0 1.3-.8 2.1-2 2.5v1.3"/><path d="M12.8 18.7h.1"/></svg>';
    }
    if (key.includes("setting") || key.includes("home")) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.4 12 7l6.5 5.4"/><path d="M7.5 11.2v7.1h9v-7.1"/><path d="M10 18.3v-4.4h4v4.4"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.7h9.2v6.2H8.1L5 15.6V6.7Z"/><path d="M10.1 14.8h5.8l3.1 2.5V8.5h-2.6"/><path d="M7.4 9.6h4.4"/></svg>';
  }

  function resourceMenuItems() {
    return [
      {
        label: "Start Here",
        href: "resources/index.html",
        description: "Guided paths for families"
      },
      {
        label: "Understanding Adult Family Homes",
        href: "resources/understanding-adult-family-homes/index.html",
        slug: "understanding-adult-family-homes"
      },
      {
        label: "Dementia & Memory Care",
        href: "resources/dementia-memory-care/index.html",
        slug: "dementia-memory-care"
      },
      {
        label: "Medicaid & Financial Guidance",
        href: "resources/medicaid-financial-guidance/index.html",
        slug: "medicaid-financial-guidance"
      },
      {
        label: "Hospital Discharge & Transitions",
        href: "resources/hospital-discharge-transitions/index.html",
        slug: "hospital-discharge-transitions"
      },
      {
        label: "Safety & Wellness",
        href: "resources/safety-wellness/index.html",
        slug: "safety-wellness"
      },
      {
        label: "Family Support",
        href: "resources/family-support/index.html",
        slug: "family-support"
      },
      {
        label: "Hospice & End-of-Life Support",
        href: "resources/hospice-end-of-life/index.html",
        slug: "hospice-end-of-life"
      }
    ];
  }

  function resourceActiveSlug() {
    const path = window.location.pathname.replace(/\\/g, "/");
    const resources = window.MagnoliaResources;
    if (!(path.includes("/resources/") || path.endsWith("/resources"))) return "";
    const bodyCategory = document.body?.dataset?.category;
    if (bodyCategory) return bodyCategory;
    const articleSlug = document.body?.dataset?.article;
    if (articleSlug && resources?.articles?.[articleSlug]) return resources.articles[articleSlug].category;
    const menuItem = resourceMenuItems().find((item) => item.slug && path.includes(`/resources/${item.slug}/`));
    return menuItem?.slug || "start";
  }

  function resourceDropdownMarkup(isResourcePage) {
    const activeSlug = resourceActiveSlug();
    const menuId = "resource-center-menu";
    const active = isResourcePage ? ' aria-current="page"' : "";
    const items = resourceMenuItems().map((item) => {
      const isActive = activeSlug === (item.slug || "start");
      return `
        <a href="${localHref(item.href)}"${isActive ? ' aria-current="page"' : ""}>
          <span>${item.label}</span>
          ${item.description ? `<small>${item.description}</small>` : ""}
        </a>
      `;
    }).join("");

    return `
      <div class="nav-dropdown${isResourcePage ? " active" : ""}" data-resource-dropdown>
        <button class="nav-dropdown-trigger" type="button" aria-expanded="false" aria-controls="${menuId}"${active}>
          <span>Resource Center</span>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.8 7.6 4.2 4.2 4.2-4.2"/></svg>
        </button>
        <div class="resource-submenu" id="${menuId}">
          ${items}
        </div>
      </div>
    `;
  }

  function renderHeader() {
    const mount = document.querySelector("[data-component='site-header']");
    if (!mount) return;

    const active = currentPage();
    const links = site.nav.map(([label, href]) => {
      const isLocationPage = ["burien-adult-family-home.html", "des-moines-adult-family-home.html"].includes(active);
      const resourcePath = window.location.pathname.replace(/\\/g, "/");
      const isResourcePage = resourcePath.includes("/resources/") || resourcePath.endsWith("/resources");
      const isAboutSubpage = active === "clinical-leadership" && href === "about.html";
      if (href === "resources/index.html") return resourceDropdownMarkup(isResourcePage);
      const aria = href === active || isAboutSubpage || (isLocationPage && href === "index.html#locations") || (isResourcePage && href === "resources/index.html") ? " aria-current=\"page\"" : "";
      return `<a href="${localHref(href)}"${aria}>${label}</a>`;
    }).join("");
    const breadcrumbs = breadcrumbTrail();
    const breadcrumbMarkup = breadcrumbs.length ? `
      <div class="header-breadcrumb-bar" aria-label="Breadcrumb">
        <div class="container header-breadcrumb">
          ${breadcrumbs.map(([label, href], index) => href
            ? `<a href="${localHref(href)}">${label}</a>${index < breadcrumbs.length - 1 ? "<span>/</span>" : ""}`
            : `<strong>${label}</strong>`
          ).join("")}
        </div>
      </div>
    ` : "";

    mount.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="site-header-shell">
        <header class="site-header">
          <div class="container nav-wrap">
            <a class="brand" href="${localHref("index.html")}" aria-label="${site.brand.name} home">
              <img class="brand-logo" src="${localHref("assets/images/logo/magnolia-logo-header-transparent.png")}" alt="${site.brand.name}">
            </a>
            <nav class="nav-links" id="site-nav" aria-label="Main navigation">${links}</nav>
            <div class="nav-actions">
              <a class="button secondary" href="${site.brand.phoneHref}">Speak With Us First</a>
              <a class="button" href="${localHref("contact.html")}">Schedule a Private Tour</a>
              <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">Menu</button>
            </div>
          </div>
        </header>
        ${breadcrumbMarkup}
      </div>
      <div class="mobile-quickbar" aria-label="Quick contact actions">
        <a class="quickbar-secondary" href="${site.brand.phoneHref}">Call Now</a>
        <a class="quickbar-primary" href="${localHref("contact.html")}" aria-label="Schedule a Tour">
          <span class="quickbar-title">Schedule a Tour</span>
          <span class="quickbar-subtitle">Private visit</span>
        </a>
        <a class="quickbar-link" href="${localHref("referral-agents.html")}">Referrals</a>
      </div>
    `;

    const toggle = mount.querySelector(".menu-toggle");
    const nav = mount.querySelector("#site-nav");
    const dropdown = mount.querySelector("[data-resource-dropdown]");
    const dropdownTrigger = dropdown?.querySelector(".nav-dropdown-trigger");
    let dropdownWasOpenOnPointerDown = false;

    const setDropdownOpen = (isOpen) => {
      if (!dropdown || !dropdownTrigger) return;
      dropdown.classList.toggle("is-open", isOpen);
      dropdownTrigger.setAttribute("aria-expanded", String(isOpen));
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) setDropdownOpen(false);
    });

    dropdownTrigger?.addEventListener("pointerdown", () => {
      dropdownWasOpenOnPointerDown = dropdown?.classList.contains("is-open") || false;
    });

    dropdownTrigger?.addEventListener("click", (event) => {
      const openedBeforeClick = event.detail ? dropdownWasOpenOnPointerDown : dropdown?.classList.contains("is-open");
      setDropdownOpen(!openedBeforeClick);
    });

    dropdown?.addEventListener("mouseenter", () => setDropdownOpen(true));
    dropdown?.addEventListener("mouseleave", () => setDropdownOpen(false));
    dropdown?.addEventListener("focusin", () => setDropdownOpen(true));
    dropdown?.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!dropdown.contains(document.activeElement)) setDropdownOpen(false);
      }, 0);
    });
    dropdown?.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      setDropdownOpen(false);
      dropdownTrigger?.focus();
    });
  }

  function renderFooter() {
    const mount = document.querySelector("[data-component='site-footer']");
    if (!mount) return;
    const youtubeUrl = site.brand.youtubeUrl || "#";
    const facebookUrl = site.brand.facebookUrl || site.brand.socialLinks.find((profile) => profile.label === "Facebook")?.href || "#";

    mount.innerHTML = `
      <section class="youtube-section" aria-label="Magnolia Senior Care YouTube">
        <div class="container">
          <div class="youtube-card">
            <div class="section-head center">
              <div class="eyebrow">Magnolia on YouTube</div>
              <h2>See life at Magnolia</h2>
              <p>Visit our video channel for updates, tours, and a closer look at the home environment.</p>
            </div>
            <a class="youtube-video-link" href="${youtubeUrl}" target="_blank" rel="noopener" aria-label="Watch Magnolia Senior Care video on YouTube">
              <div class="youtube-play youtube-play-red" aria-hidden="true">${socialIcon("YouTube")}</div>
              <div>
                <h3>Watch the Magnolia video</h3>
                <p>Open YouTube for a closer look at the home environment, updates, and family education.</p>
              </div>
            </a>
            <div class="section-actions center-actions">
              <a class="button" href="${youtubeUrl}" target="_blank" rel="noopener">Visit YouTube Channel</a>
              <a class="text-action-link" href="${facebookUrl}" target="_blank" rel="noopener">Follow on Facebook</a>
            </div>
          </div>
        </div>
      </section>
      <footer class="site-footer" id="site-footer">
        <div class="container">
          <div class="footer-cta">
            <div>
              <div class="eyebrow">Start with a conversation</div>
              <h2>Find the right Magnolia home for your loved one.</h2>
              <p>Pricing depends on care needs, room availability, assessment level, and service requirements. Please contact Magnolia directly for current private-pay rates and availability.</p>
              <p class="cta-microcopy">No pressure. Just clear answers for your family.</p>
            </div>
            <div class="footer-cta-actions">
              <a class="button" href="${localHref("contact.html")}">Schedule a Private Tour</a>
              <a class="button secondary" href="${site.brand.phoneHref}">Speak With Us First</a>
            </div>
          </div>
          <div class="footer-grid">
            <div class="footer-brand">
              <img class="footer-logo" src="${localHref("assets/images/logo/magnolia-logo-footer-transparent.png")}" alt="${site.brand.name}">
              <p>${site.brand.tagline}</p>
              <div class="footer-proof">
                <span>RN-led</span>
                <span>Licensed AFH</span>
                <span>South King County</span>
              </div>
              <div class="social-icons" aria-label="Magnolia social media">
                ${site.brand.socialLinks.map((profile) => `<a class="social-icon social-${profile.label.toLowerCase()}" href="${profile.href}" target="${profile.href === "#" ? "_self" : "_blank"}" rel="noopener" aria-label="${profile.label}">${socialIcon(profile.label)}</a>`).join("")}
              </div>
            </div>
            <div class="footer-panel">
              <h3>Explore</h3>
              <div class="footer-links">
                ${site.nav.map(([label, href]) => `<a href="${localHref(href)}">${label}</a>`).join("")}
              </div>
            </div>
            <div class="footer-panel">
              <h3>Website Trust</h3>
              <div class="footer-links">
                <a href="${localHref("privacy-policy/")}">Privacy Policy</a>
                <a href="${localHref("terms-of-use/")}">Terms of Use</a>
                <a href="${localHref("disclaimer/")}">Disclaimer</a>
                <a href="${localHref("accessibility/")}">Accessibility</a>
              </div>
            </div>
            <div class="footer-panel">
              <h3>Local Care</h3>
              <div class="footer-links">
                <a href="${localHref("burien-adult-family-home.html")}">${site.locations.burien.displayName}</a>
                <a href="${localHref("des-moines-adult-family-home.html")}">${site.locations.highline.displayName}</a>
                <a href="${localHref("resources/index.html")}">Resource Center</a>
              </div>
            </div>
            <div class="footer-panel footer-contact-panel">
              <h3>Contact</h3>
              <div class="footer-links">
                <a href="${site.brand.phoneHref}">${site.brand.phone}</a>
                <a href="${site.brand.secondaryPhoneHref}">${site.brand.secondaryPhone}</a>
                <a href="${site.brand.emailHref}">${site.brand.email}</a>
                <a href="${mapHref(site.locations.burien.address)}" target="_blank" rel="noopener">${site.locations.burien.address}</a>
                <a href="${mapHref(site.locations.highline.address)}" target="_blank" rel="noopener">${site.locations.highline.address}</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            &copy; <span data-year></span> ${site.brand.legalName}. Information on this website is not medical advice. Current rates, availability, and services should be confirmed directly.
            <span class="footer-credit"><a href="https://www.afhdesignsbysam.com/" target="_blank" rel="noopener">Web Designs By Sam</a></span>
          </div>
        </div>
      </footer>
    `;
  }

  function renderCards() {
    document.querySelectorAll("[data-service-cards]").forEach((mount) => {
      mount.classList.add("service-grid");
      mount.innerHTML = site.services.map((item) => `
        <article class="card service-card location-choice-card">
          <span class="service-icon" aria-hidden="true">${careIcon(item.title)}</span>
          <div class="eyebrow">${item.label || "Magnolia care"}</div>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          ${item.bestFor?.length ? `
            <div class="best-for-label">Best for</div>
            <ul class="feature-list">
              ${item.bestFor.map((point) => `<li>${point}</li>`).join("")}
            </ul>
          ` : ""}
        </article>
      `).join("");
    });

    document.querySelectorAll("[data-testimonial-cards]").forEach((mount) => {
      mount.innerHTML = site.testimonials.map((item) => `
        <figure class="card testimonial-card">
          <div class="eyebrow">Perspective</div>
          <blockquote>
            <p>&ldquo;${item.quote}&rdquo;</p>
          </blockquote>
          <figcaption><strong>${item.name}</strong></figcaption>
        </figure>
      `).join("");
    });
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll(".section, .page-hero, .card, .process-step, .gallery-item, .comfort-image-panel, .image-panel, .interior-hero-card, .interior-hero-visual");
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targets.forEach((node) => node.classList.add("reveal-on-scroll"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach((node) => observer.observe(node));
  }

  function renderLocationCards() {
    document.querySelectorAll("[data-location-cards]").forEach((mount) => {
      mount.innerHTML = Object.values(site.locations).map((location) => `
        <article class="card location-card">
          <img src="${location.image}" alt="${location.displayName} in ${location.city}, Washington">
          <div class="card-body">
            <div class="eyebrow">${location.city}, ${location.state}</div>
            <h3>${location.displayName}</h3>
            <p>${location.position}</p>
            <div class="tag-row">
              ${location.fit.map((item) => `<span>${item}</span>`).join("")}
            </div>
            <ul class="feature-list">
              <li><a href="${mapHref(location.address)}" target="_blank" rel="noopener">${location.address}</a></li>
              <li>${location.neighborhoods.slice(0, 4).join(", ")}</li>
              <li>${location.seoDescription}</li>
            </ul>
            <div class="section-actions">
              <a class="button" href="${localHref("contact.html")}">Schedule a Tour at This Home</a>
              <a class="text-action-link" href="${localHref(location.page)}">View Location Details</a>
            </div>
          </div>
        </article>
      `).join("");
    });
  }

  function renderReviewCarousels() {
    document.querySelectorAll("[data-review-carousel]").forEach((mount) => {
      const reviews = site.googleReviews;
      if (!reviews?.items?.length) return;

      const trackId = `review-track-${Math.random().toString(36).slice(2)}`;
      mount.innerHTML = `
        <div class="review-carousel-shell">
          <div class="review-score-card">
            <div class="eyebrow">${reviews.sourceName}</div>
            <div class="review-score">
              <strong>${reviews.rating}</strong>
              <span aria-label="${reviews.rating} out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            </div>
            <p>${reviews.reviewCount} public Google reviews for ${reviews.profileName}.</p>
            <a class="review-link" href="${reviews.sourceUrl}" target="_blank" rel="noopener">View or leave a Google review</a>
          </div>
          <div class="review-carousel">
            <div class="review-track" id="${trackId}" tabindex="0" aria-label="Google review highlights">
              ${reviews.items.map((review) => `
                <article class="card review-card">
                  <div class="review-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <blockquote>
                    <p>&ldquo;${review.quote}&rdquo;</p>
                  </blockquote>
                  <p>${review.summary}</p>
                  <footer>
                    <strong>${review.name}</strong>
                    <span>${review.detail}</span>
                  </footer>
                </article>
              `).join("")}
            </div>
            <div class="review-controls" aria-label="Review carousel controls">
              <button class="review-control" type="button" data-review-prev aria-controls="${trackId}" aria-label="Previous review">&#8249;</button>
              <button class="review-control" type="button" data-review-next aria-controls="${trackId}" aria-label="Next review">&#8250;</button>
            </div>
            <div class="review-dots" aria-label="Review slide selector">
              ${reviews.items.map((_, index) => `<button class="review-dot" type="button" data-review-dot="${index}" aria-label="Show review ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("")}
            </div>
            <p class="review-source-note">${reviews.updatedNote}</p>
          </div>
        </div>
      `;

      const track = mount.querySelector(".review-track");
      const dots = Array.from(mount.querySelectorAll("[data-review-dot]"));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let autoplayTimer;
      let resumeTimer;
      let scrollTimer;
      let activeIndex = 0;

      const cards = Array.from(track.querySelectorAll(".review-card"));

      const cardLeft = (index) => {
        if (!cards.length) return 0;
        const firstLeft = cards[0].offsetLeft;
        return Math.max(0, (cards[index]?.offsetLeft || firstLeft) - firstLeft);
      };

      const setActiveDot = (index) => {
        activeIndex = Math.max(0, Math.min(reviews.items.length - 1, index));
        dots.forEach((dot, dotIndex) => {
          dot.setAttribute("aria-current", String(dotIndex === activeIndex));
        });
      };

      const goToReview = (index) => {
        const nextIndex = Math.max(0, Math.min(reviews.items.length - 1, index));
        track.scrollTo({ left: cardLeft(nextIndex), behavior: "smooth" });
        setActiveDot(nextIndex);
      };

      const scrollByCard = (direction) => {
        const nextIndex = activeIndex + direction;
        if (nextIndex < 0) {
          goToReview(reviews.items.length - 1);
        } else if (nextIndex >= reviews.items.length) {
          goToReview(0);
        } else {
          goToReview(nextIndex);
        }
      };

      const stopAutoplay = () => {
        window.clearInterval(autoplayTimer);
        autoplayTimer = undefined;
      };

      const startAutoplay = () => {
        if (prefersReducedMotion || autoplayTimer || reviews.items.length < 2) return;
        autoplayTimer = window.setInterval(() => {
          scrollByCard(1);
        }, 5600);
      };

      const resumeAutoplaySoon = () => {
        if (prefersReducedMotion) return;
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(startAutoplay, 9000);
      };

      mount.querySelector("[data-review-prev]")?.addEventListener("click", () => {
        stopAutoplay();
        scrollByCard(-1);
        resumeAutoplaySoon();
      });
      mount.querySelector("[data-review-next]")?.addEventListener("click", () => {
        stopAutoplay();
        scrollByCard(1);
        resumeAutoplaySoon();
      });
      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          stopAutoplay();
          goToReview(Number(dot.dataset.reviewDot));
          resumeAutoplaySoon();
        });
      });

      track.addEventListener("scroll", () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          const nearest = cards.reduce((bestIndex, card, index) => {
            const currentDistance = Math.abs(track.scrollLeft - cardLeft(index));
            const bestDistance = Math.abs(track.scrollLeft - cardLeft(bestIndex));
            return currentDistance < bestDistance ? index : bestIndex;
          }, 0);
          setActiveDot(nearest);
        }, 80);
      });

      mount.addEventListener("mouseenter", stopAutoplay);
      mount.addEventListener("mouseleave", resumeAutoplaySoon);
      mount.addEventListener("focusin", stopAutoplay);
      mount.addEventListener("focusout", resumeAutoplaySoon);
      mount.addEventListener("touchstart", stopAutoplay, { passive: true });
      mount.addEventListener("touchend", resumeAutoplaySoon, { passive: true });

      startAutoplay();
    });
  }

  function hydrateBrandText() {
    document.querySelectorAll("[data-brand]").forEach((node) => {
      const key = node.getAttribute("data-brand");
      if (site.brand[key]) node.textContent = site.brand[key];
    });
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
    document.querySelectorAll("[data-photo]").forEach((node) => {
      const key = node.getAttribute("data-photo");
      if (site.photos[key]) node.setAttribute("src", localHref(site.photos[key]));
    });
  }

  function applyImageFallbacks() {
    document.querySelectorAll("img").forEach((img) => {
      img.loading = img.loading || "lazy";
      if (img.closest(".hero-cinematic")) {
        img.loading = "eager";
        img.fetchPriority = "high";
      }

      const useFallback = () => {
        if (img.dataset.fallbackApplied === "true") return;
        img.dataset.fallbackApplied = "true";
        img.classList.add("image-fallback");
        img.src = fallbackImageSrc();
      };

      img.addEventListener("error", useFallback);

      if (img.complete && img.naturalWidth === 0) {
        useFallback();
      }
    });
  }

  function initLightbox() {
    const triggers = document.querySelectorAll(".gallery-button");
    if (!triggers.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Expanded gallery photo");
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close photo">&times;</button>
      <div class="lightbox-panel">
        <img alt="">
        <p></p>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("p");
    const closeButton = lightbox.querySelector(".lightbox-close");

    const close = () => {
      lightbox.classList.remove("open");
      document.body.classList.remove("lightbox-open");
    };

    const open = (button) => {
      const image = button.querySelector("img");
      const caption = button.closest("figure")?.querySelector("figcaption")?.textContent || image.alt;
      lightboxImg.src = image.currentSrc || image.src || fallbackImageSrc();
      lightboxImg.alt = image.alt;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    };

    triggers.forEach((button) => {
      button.addEventListener("click", () => open(button));
    });

    closeButton.addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) close();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderCards();
    renderLocationCards();
    renderReviewCarousels();
    hydrateBrandText();
    applyImageFallbacks();
    initLightbox();
    initScrollReveal();
  });
})();
