/* Avodah Business — interactions (same system as Avodah Traffic + Employment)
   1. Loader (homepage only): knot rope ties itself on a Cypress field.
   2. Reveal-on-scroll for sections (staggered fade-up via --d, applied in JS
      so hover transitions stay instant).
   3. Overlay menu for tablet / mobile.
   4. Current-page marker in the primary nav.
   Interior pages reuse 2–4 and reveal their hero on DOMContentLoaded.
*/

(function () {
  "use strict";

  /* Dev flag: ?flat=1 disables scroll choreography for full-page captures */
  if (new URLSearchParams(location.search).has("flat")) {
    document.documentElement.classList.add("flat");
  }

  /* ---------- current page in nav ---------- */

  var normalizePath = function (value) {
    try {
      var pathname = new URL(value, location.origin).pathname;
      return pathname === "/" ? "/" : pathname.replace(/\/?$/, "/");
    } catch (e) {
      return value;
    }
  };
  // guide pages light up their parent practice (<main data-nav="...">)
  var navMain = document.querySelector("main[data-nav]");
  var navKey = navMain ? navMain.getAttribute("data-nav") : location.pathname;
  document.querySelectorAll(".primary-nav a").forEach(function (a) {
    if (normalizePath(a.href) === normalizePath(navKey)) {
      a.classList.add("is-current");
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---------- reveals ---------- */

  function staggeredReveal(el) {
    var d = parseFloat(el.style.getPropertyValue("--d")) || 0;
    setTimeout(function () {
      el.classList.add("is-in");
    }, d * 1000);
  }

  function revealHero() {
    document.querySelectorAll(".reveal-load").forEach(staggeredReveal);
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          staggeredReveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    io.observe(el);
  });

  /* ---------- loader (homepage only) ---------- */

  var loader = document.getElementById("loader");
  var ropeFill = document.getElementById("ropeFill");

  if (loader && ropeFill) {
    var progress = 0;
    var loaderStart = Date.now();
    var MIN_LOADER_TIME = 1200; // long enough for the rope to read, short enough not to stall

    var finishLoading = function () {
      ropeFill.style.width = "100%";
      setTimeout(function () {
        loader.classList.add("is-done");
        document.body.classList.remove("is-loading");
        revealHero();
      }, 350);
    };

    var trickle = setInterval(function () {
      progress = Math.min(progress + 4 + Math.random() * 8, 90);
      ropeFill.style.width = progress + "%";
    }, 120);

    window.addEventListener("load", function () {
      var remaining = Math.max(MIN_LOADER_TIME - (Date.now() - loaderStart), 0);
      setTimeout(function () {
        clearInterval(trickle);
        finishLoading();
      }, remaining + 100);
    });

    // Safety: never trap the user on the loader
    setTimeout(function () {
      if (!loader.classList.contains("is-done")) {
        clearInterval(trickle);
        finishLoading();
      }
    }, 4000);
  } else {
    // Interior pages: reveal the hero as soon as the DOM is ready.
    if (document.readyState !== "loading") revealHero();
    else document.addEventListener("DOMContentLoaded", revealHero);
  }

  /* ---------- overlay menu (tablet / mobile) ---------- */

  var menuBtn = document.querySelector(".menu-btn");
  var navLinks = document.querySelectorAll(".primary-nav a");

  if (menuBtn && navLinks.length) {
    var overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var top = document.createElement("div");
    top.className = "menu-overlay__top";
    top.innerHTML =
      '<img src="/assets/wordmark-ivory.svg" alt="Avodah" width="3000" height="461" />' +
      '<button class="menu-overlay__close" aria-label="Close menu">✕</button>';
    overlay.appendChild(top);

    var linksWrap = document.createElement("nav");
    linksWrap.className = "menu-overlay__links";
    navLinks.forEach(function (a, i) {
      var link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent;
      link.style.transitionDelay = 0.06 + i * 0.05 + "s";
      linksWrap.appendChild(link);
    });
    var contact = document.createElement("a");
    contact.href = "/contact/";
    contact.textContent = "Book a Consultation";
    contact.style.transitionDelay = 0.06 + navLinks.length * 0.05 + "s";
    linksWrap.appendChild(contact);
    overlay.appendChild(linksWrap);

    var meta = document.createElement("div");
    meta.className = "menu-overlay__meta";
    meta.textContent = "Est. 2026 · Richmond + Leesburg";
    overlay.appendChild(meta);

    document.body.appendChild(overlay);

    var openMenu = function () {
      document.body.classList.add("menu-open");
      overlay.setAttribute("aria-hidden", "false");
    };
    var closeMenu = function () {
      document.body.classList.remove("menu-open");
      overlay.setAttribute("aria-hidden", "true");
    };
    menuBtn.addEventListener("click", openMenu);
    overlay.querySelector(".menu-overlay__close").addEventListener("click", closeMenu);
    linksWrap.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- contact form (static preview: nothing is sent) ----------
     On WordPress this form is replaced by Contact Form 7 #282 with the same
     field names. Here we only validate and confirm, so reviewers can test it. */

  var previewForm = document.querySelector("[data-preview-form]");
  if (previewForm) {
    previewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = previewForm.querySelector(".form__status");
      if (status) status.textContent = "Thank you — this is the design preview, so nothing was sent. On the live site this goes to the Avodah Business team.";
    });
  }

  /* ---------- analytics hooks ----------
     These become active only after a GA4 measurement ID is supplied at build
     time. A successful form-lead event should be emitted by the future live
     form handler, not by this non-transmitting preview form. */

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link || typeof window.gtag !== "function") return;
    var href = link.getAttribute("href") || "";
    var eventName = "";
    if (href.indexOf("tel:") === 0) eventName = "phone_click";
    else if (href.indexOf("typeform.com") !== -1) eventName = "handshake_start";
    else if (normalizePath(href) === "/contact/") eventName = "contact_cta_click";
    if (eventName) {
      window.gtag("event", eventName, {
        link_url: link.href,
        page_path: location.pathname,
      });
    }
  });

})();
