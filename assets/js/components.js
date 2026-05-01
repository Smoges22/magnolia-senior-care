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
          <span>RN-owned Adult Family Homes in Burien and Des Moines</span>
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
            <span class="brand-name"><span class="brand-kicker">Adult Family Homes</span>${site.brand.name}</span>
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

  function serviceIcon(name) {
    const icons = {
      medical: `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M6 3v4a6 6 0 0 0 12 0V3" />
          <path d="M8 3H5" />
          <path d="M19 3h-3" />
          <path d="M12 13v3a4 4 0 0 0 8 0v-1" />
          <circle cx="20" cy="12" r="2" />
        </svg>`,
      support: `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M7 11.5V7a2 2 0 0 1 4 0v6" />
          <path d="M11 12V6a2 2 0 0 1 4 0v7" />
          <path d="M15 13V8a2 2 0 0 1 4 0v5.5" />
          <path d="M7 12.5 5.4 11a2 2 0 0 0-2.8 2.8l5.7 5.7A5 5 0 0 0 11.8 21H15a5 5 0 0 0 5-5v-3" />
        </svg>`,
      pill: `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M10.5 20.5 20.5 10.5a5 5 0 0 0-7-7L3.5 13.5a5 5 0 0 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>`,
      brain: `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M9 4.5A3.5 3.5 0 0 0 5.5 8c0 .5.1 1 .3 1.4A4.2 4.2 0 0 0 4 13a4 4 0 0 0 4 4h1" />
          <path d="M15 4.5A3.5 3.5 0 0 1 18.5 8c0 .5-.1 1-.3 1.4A4.2 4.2 0 0 1 20 13a4 4 0 0 1-4 4h-1" />
          <path d="M12 4v16" />
          <path d="M9 9h3" />
          <path d="M12 12h4" />
          <path d="M8 15h4" />
        </svg>`,
      home: `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10.5V20h13v-9.5" />
          <path d="M9.5 20v-5h5v5" />
        </svg>`,
      message: `
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
          <path d="M8 10h8" />
          <path d="M8 13h5" />
        </svg>`
    };

    return icons[name] || icons.home;
  }

  function renderCards() {
    document.querySelectorAll("[data-service-cards]").forEach((mount) => {
      mount.classList.add("service-grid");
      mount.innerHTML = site.services.map((item) => `
        <article class="card service-card">
          <div class="service-card-top">
            <span class="service-icon" aria-hidden="true">${serviceIcon(item.icon)}</span>
          </div>
          <div class="service-card-content">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
        </article>
      `).join("");
    });

    document.querySelectorAll("[data-testimonial-cards]").forEach((mount) => {
      mount.innerHTML = site.testimonials.map((item) => `
        <figure class="card testimonial-card">
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
              <a class="button" href="${localHref(location.page)}">View Location</a>
              <a class="button secondary" href="${site.brand.phoneHref}">Call Now</a>
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

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderCards();
    renderLocationCards();
    hydrateBrandText();
  });
})();
