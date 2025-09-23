document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      item.classList.toggle("active");
    });
  });

  // Optional: Open first FAQ by default
  // faqItems[0].classList.add('active');
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
