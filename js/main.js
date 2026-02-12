/* ============================================================
   AI Development Portfolio - Main JavaScript
   ============================================================ */

(function () {
  "use strict";

  // --- Navigation scroll effect ---
  const nav = document.getElementById("nav");
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  // --- Mobile hamburger menu ---
  const hamburger = document.querySelector(".nav__hamburger");
  const navLinks = document.querySelector(".nav__links");
  const navOverlay = document.getElementById("navOverlay");

  function toggleMenu() {
    const isOpen = hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    navOverlay.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    navOverlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", toggleMenu);
  navOverlay.addEventListener("click", closeMenu);

  // Close menu on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  // --- Scroll animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll(".fade-in");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || "0", 10);
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // --- Skill bar animation ---
  const skillFills = document.querySelectorAll(".skill__fill");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));

  // --- Lazy loading images with native + fallback ---
  if ("loading" in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback: Intersection Observer
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      imgObserver.observe(img);
    });
  }
})();
