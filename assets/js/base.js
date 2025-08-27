"use strict";

// Global helpers and shared behavior
(function () {
  // Query helpers
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Timing helpers
  const debounce = (fn, wait = 300) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  const throttle = (fn, limit = 200) => {
    let inThrottle = false;
    return function (...args) {
      if (inThrottle) return;
      inThrottle = true;
      fn.apply(this, args);
      setTimeout(() => (inThrottle = false), limit);
    };
  };

  // Mobile navbar toggle
  function initNavbarToggle() {
    const nav = qs(".navbar");
    const toggle = qs("[data-nav-toggle]");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", () => {
      nav.classList.toggle("navbar--open");
    });
  }

  // Footer year
  function setCurrentYear() {
    const el = qs("[data-current-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // Expose on a simple namespace (optional for page scripts)
  window.App = {
    qs,
    qsa,
    debounce,
    throttle,
  };

  // Init on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    initNavbarToggle();
    setCurrentYear();
  });
})();



