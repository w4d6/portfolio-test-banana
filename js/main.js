/* ============================================================
   AI Development Portfolio - Main JavaScript
   ============================================================ */

(function () {
  "use strict";

  // --- Navigation scroll effect ---
  var nav = document.getElementById("nav");

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  // --- Mobile hamburger menu ---
  var hamburger = document.querySelector(".nav__hamburger");
  var navLinks = document.querySelector(".nav__links");
  var navOverlay = document.getElementById("navOverlay");

  function isMenuOpen() {
    return hamburger && hamburger.classList.contains("active");
  }

  function toggleMenu() {
    if (!hamburger || !navLinks || !navOverlay) return;
    var isOpen = hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    navOverlay.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    if (!hamburger || !navLinks || !navOverlay) return;
    if (!isMenuOpen()) return;
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    navOverlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "メニューを開く");
    document.body.style.overflow = "";
  }

  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  if (navOverlay) navOverlay.addEventListener("click", closeMenu);

  // Close menu on link click (event delegation)
  if (navLinks) {
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        closeMenu();
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.addEventListener("click", function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 0;
      var targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  });

  // --- Global keydown handler ---
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      // Close modal first if open, otherwise close menu
      if (modal && modal.classList.contains("active")) {
        closeModal();
      } else if (isMenuOpen()) {
        closeMenu();
        if (hamburger) hamburger.focus();
      }
    }
  });

  // --- Image modal ---
  var modal = document.getElementById("imageModal");
  var modalImage = modal ? modal.querySelector(".modal__image") : null;
  var modalClose = modal ? modal.querySelector(".modal__close") : null;
  var modalOverlay = modal ? modal.querySelector(".modal__overlay") : null;
  var lastFocusedElement = null;

  function openModal(imgSrc, imgAlt, triggerElement) {
    if (!modal || !modalImage) return;
    lastFocusedElement = triggerElement || document.activeElement;
    modalImage.src = imgSrc;
    modalImage.alt = imgAlt;
    modal.removeAttribute("hidden");
    // Force reflow before adding active class for CSS transition
    void modal.offsetHeight;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("active")) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";

    function onTransitionEnd() {
      modal.removeEventListener("transitionend", onTransitionEnd);
      if (!modal.classList.contains("active")) {
        modal.setAttribute("hidden", "");
        if (modalImage) modalImage.src = "";
      }
      // Restore focus to the element that triggered the modal
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }

    modal.addEventListener("transitionend", onTransitionEnd);
  }

  // Card image click/keyboard handlers (event delegation on document)
  document.addEventListener("click", function (e) {
    var cardImage = e.target.closest(".card__image[role='button']");
    if (!cardImage) return;
    var img = cardImage.querySelector("img");
    if (img) openModal(img.src, img.alt, cardImage);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var cardImage = e.target.closest(".card__image[role='button']");
    if (!cardImage) return;
    e.preventDefault();
    var img = cardImage.querySelector("img");
    if (img) openModal(img.src, img.alt, cardImage);
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  // --- Scroll animations (Intersection Observer) ---
  var fadeElements = document.querySelectorAll(".fade-in");

  if (fadeElements.length > 0) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.dataset.delay || "0", 10);
            if (delay > 0) {
              setTimeout(function () {
                entry.target.classList.add("visible");
              }, delay);
            } else {
              entry.target.classList.add("visible");
            }
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // --- Skill bar animation ---
  var skillFills = document.querySelectorAll(".skill__fill");

  if (skillFills.length > 0) {
    var skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillFills.forEach(function (fill) {
      skillObserver.observe(fill);
    });
  }

  // --- Lazy loading images with native + fallback ---
  if ("loading" in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (lazyImages.length > 0) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imgObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }
})();
