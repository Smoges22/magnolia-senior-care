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

  function mapHref(address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  function breadcrumbTrail() {
    const active = currentPage();
    const pageMap = {
      "about.html": [["Home", "index.html"], ["About"]],
      "services.html": [["Home", "index.html"], ["Services"]],
      "rooms-photos.html": [["Home", "index.html"], ["Gallery"]],
      "referral-agents.html": [["Home", "index.html"], ["Referrals"]],
      "contact.html": [["Home", "index.html"], ["Contact"]],
      "burien-adult-family-home.html": [["Home", "index.html"], ["Locations", "index.html#locations"], ["Burien"]],
      "des-moines-adult-family-home.html": [["Home", "index.html"], ["Locations", "index.html#locations"], ["Des Moines"]],
      "afh-education-template.html": [["Home", "index.html"], ["AFH Education Blog"]]
    };
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

  function renderHeader() {
    const mount = document.querySelector("[data-component='site-header']");
    if (!mount) return;

    const active = currentPage();
    const links = site.nav.map(([label, href]) => {
      const isLocationPage = ["burien-adult-family-home.html", "des-moines-adult-family-home.html"].includes(active);
      const aria = href === active || (isLocationPage && href === "index.html#locations") ? " aria-current=\"page\"" : "";
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
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
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
              <p>Schedule a private tour or speak with us first so we can help you understand care fit, availability, and next steps.</p>
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
              <h3>Local Care</h3>
              <div class="footer-links">
                <a href="${localHref("burien-adult-family-home.html")}">${site.locations.burien.displayName}</a>
                <a href="${localHref("des-moines-adult-family-home.html")}">${site.locations.highline.displayName}</a>
                <a href="${localHref("blog/afh-education-template.html")}">AFH Education Blog</a>
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
            &copy; <span data-year></span> ${site.brand.legalName}. Information on this website is not medical advice. Availability and services should be confirmed directly.
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
    renderReviewCarousels();
    hydrateBrandText();
    applyImageFallbacks();
    initLightbox();
  });
})();
