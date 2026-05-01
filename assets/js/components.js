(function () {
  const site = window.AFHSite;

  function currentPage() {
    const name = window.location.pathname.split("/").pop() || "index.html";
    return name;
  }

  function pathPrefix() {
    return window.location.pathname.includes("/blog/") ? "../" : "";
  }

  function localHref(href) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
    return `${pathPrefix()}${href}`;
  }

  function fallbackImageSrc() {
    return localHref("assets/images/magnolia-photo-fallback.svg");
  }

  function renderHeader() {
    const mount = document.querySelector("[data-component='site-header']");
    if (!mount) return;

    const active = currentPage();
    const links = site.nav.map(([label, href]) => {
      const aria = href === active ? " aria-current=\"page\"" : "";
      return `<a href="${localHref(href)}"${aria}>${label}</a>`;
    }).join("");

    mount.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="top-strip">
        <div class="container top-strip-inner">
          <span>RN-owned home-based care in Burien and Des Moines</span>
          <span class="top-strip-links">
            <a href="${site.brand.phoneHref}">${site.brand.phone}</a>
            <a href="${site.brand.secondaryPhoneHref}">${site.brand.secondaryPhone}</a>
            <a href="${site.brand.emailHref}">${site.brand.email}</a>
          </span>
        </div>
      </div>
      <header class="site-header">
        <div class="container nav-wrap">
          <a class="brand" href="${localHref("index.html")}" aria-label="${site.brand.name} home">
            <span class="brand-mark" aria-hidden="true">M</span>
            <span class="brand-name"><span class="brand-kicker">Home-Based Care</span>${site.brand.name}</span>
          </a>
          <nav class="nav-links" id="site-nav" aria-label="Main navigation">${links}</nav>
          <div class="nav-actions">
            <a class="button secondary" href="${site.brand.phoneHref}">Call Now</a>
            <a class="button" href="${localHref("contact.html")}">Schedule Tour</a>
            <button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">Menu</button>
          </div>
        </div>
      </header>
      <div class="mobile-quickbar" aria-label="Quick contact actions">
        <a class="quickbar-secondary" href="${site.brand.phoneHref}">Call Now</a>
        <a class="quickbar-primary" href="${localHref("contact.html")}" aria-label="Schedule Tour, book a private visit">
          <span class="quickbar-title">Schedule Tour</span>
          <span class="quickbar-subtitle">Book a private visit</span>
        </a>
        <a class="quickbar-link" href="${localHref("referral-agents.html")}">Referrals</a>
      </div>
    `;

    const toggle = mount.querySelector(".menu-toggle");
    const nav = mount.querySelector("#site-nav");
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function renderFooter() {
    const mount = document.querySelector("[data-component='site-footer']");
    if (!mount) return;

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <h2>${site.brand.name}</h2>
              <p>${site.brand.tagline}</p>
              <p>Licensed Adult Family Home provider in Washington State.</p>
              <p>Serving Burien, Des Moines, and South King County.</p>
            </div>
            <div>
              <h3>Explore</h3>
              <div class="footer-links">
                ${site.nav.map(([label, href]) => `<a href="${localHref(href)}">${label}</a>`).join("")}
              </div>
            </div>
            <div>
              <h3>Local Care</h3>
              <div class="footer-links">
                <a href="${localHref("burien-adult-family-home.html")}">${site.locations.burien.displayName}</a>
                <a href="${localHref("des-moines-adult-family-home.html")}">${site.locations.highline.displayName}</a>
                <a href="${localHref("blog/afh-education-template.html")}">AFH Education Blog</a>
              </div>
            </div>
            <div>
              <h3>Contact</h3>
              <div class="footer-links">
                <a href="${site.brand.phoneHref}">${site.brand.phone}</a>
                <a href="${site.brand.secondaryPhoneHref}">${site.brand.secondaryPhone}</a>
                <a href="${site.brand.emailHref}">${site.brand.email}</a>
                <span>${site.locations.burien.address}</span>
                <span>${site.locations.highline.address}</span>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            &copy; <span data-year></span> ${site.brand.legalName}. Information on this website is not medical advice. Availability and services should be confirmed directly.
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
              <li>${location.address}</li>
              <li>${location.neighborhoods.slice(0, 4).join(", ")}</li>
              <li>${location.seoDescription}</li>
            </ul>
            <div class="section-actions">
              <a class="button" href="${localHref("contact.html")}">Schedule Tour</a>
              <a class="button secondary" href="${localHref(location.page)}">View Location</a>
            </div>
          </div>
        </article>
      `).join("");
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
      if (site.photos[key]) node.setAttribute("src", site.photos[key]);
    });
  }

  function applyImageFallbacks() {
    document.querySelectorAll("img").forEach((img) => {
      img.loading = img.loading || "lazy";

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
    hydrateBrandText();
    applyImageFallbacks();
    initLightbox();
  });
})();
