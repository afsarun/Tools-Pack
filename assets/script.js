// FAQ toggles
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentNode;
    item.classList.toggle("active");
  });
});
// Mobile Navigation Toggle
// document.getElementById("mobileToggle").addEventListener("click", function () {
//   document.getElementById("navLinks").classList.toggle("active");
// });
// Mobile dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  const dropdowns = document.querySelectorAll(".dropdown");

  // Mobile menu toggle
  mobileToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    // Close all dropdowns when closing mobile menu
    if (!navLinks.classList.contains("active")) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  // Handle dropdown toggle for both desktop and mobile
  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");

    link.addEventListener("click", function (e) {
      // For mobile screens, prevent default and toggle dropdown
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove("active");
          }
        });

        // Toggle current dropdown
        dropdown.classList.toggle("active");
      }
      // For desktop, allow normal hover behavior (no action needed)
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (window.innerWidth <= 768 && navLinks.classList.contains("active")) {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("active");
        });
      }
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      // Close mobile menu and reset dropdowns on desktop
      navLinks.classList.remove("active");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });
});
(function () {
  const searchInput = document.getElementById("toolSearch");
  const toolGrid = document.getElementById("toolGrid");
  const cards = Array.from(document.querySelectorAll(".tool-card"));
  const navLinks = document.querySelectorAll(".category-nav a");

  // --- helpers ---
  function debounce(fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function isInViewport(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Consider "in view" if top is within 0..vh (with a small buffer)
    return r.top > -40 && r.top < vh;
  }

  // Only scroll once per non-empty search sequence
  let hasScrolledForSearch = false;

  // Live search (Bangla/English উভয় টেক্সটে কাজ করবে)
  if (searchInput && toolGrid) {
    const runFilter = () => {
      const term = searchInput.value.toLowerCase().trim();

      // Scroll once when user starts typing (prevents repeated smooth-scroll jitter)
      if (term.length > 0 && !hasScrolledForSearch) {
        if (!isInViewport(toolGrid)) {
          toolGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        hasScrolledForSearch = true;
      }
      if (term.length === 0) {
        hasScrolledForSearch = false; // reset when cleared
      }

      cards.forEach((card) => {
        const title = (
          card.querySelector("h2")?.textContent || ""
        ).toLowerCase();
        const desc = (
          card.querySelector(".muted")?.textContent || ""
        ).toLowerCase();
        const match =
          term === "" || title.includes(term) || desc.includes(term);
        card.style.display = match ? "" : "none";
      });
    };

    // Debounce input to avoid rapid reflows & scroll thrash
    const debouncedFilter = debounce(runFilter, 120);
    searchInput.addEventListener("input", debouncedFilter);
  }

  // Category filter (prevent double scroll/jump)
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // we handle scroll/filter ourselves

      const hash = this.getAttribute("href") || "";
      const category = hash.startsWith("#") ? hash.slice(1) : hash;

      // Clear search and its scroll flag so category filter doesn't fight search scroll
      if (searchInput) {
        searchInput.value = "";
      }
      hasScrolledForSearch = false;

      // Smooth scroll to grid only if it's not already visible (avoids jitter)
      if (!isInViewport(toolGrid)) {
        toolGrid?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Filter by category
      cards.forEach((card) => {
        const c = card.getAttribute("data-category");
        card.style.display = category === "all" || c === category ? "" : "none";
      });

      // Active state for nav
      navLinks.forEach((a) => a.classList.remove("active"));
      this.classList.add("active");

      // Update URL hash without triggering native jump (prevents double scroll)
      if (history && typeof history.replaceState === "function") {
        history.replaceState(null, "", hash || "#");
      }
    });
  });
})();
