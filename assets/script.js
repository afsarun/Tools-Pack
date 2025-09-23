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

  // Live search (Bangla/English উভয় টেক্সটে কাজ করবে)
  if (searchInput && toolGrid) {
    searchInput.addEventListener("input", function (e) {
      const term = e.target.value.toLowerCase().trim();

      if (term.length > 0) {
        toolGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      cards.forEach((card) => {
        const title = (
          card.querySelector("h2")?.textContent || ""
        ).toLowerCase();
        const desc = (
          card.querySelector(".muted")?.textContent || ""
        ).toLowerCase();
        card.style.display =
          title.includes(term) || desc.includes(term) ? "" : "none";
      });
    });
  }

  // Category filter
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // allow in-page anchor jump if you have sections with these IDs
      // but also perform filtering
      e.preventDefault();

      const hash = this.getAttribute("href") || "";
      const category = hash.startsWith("#") ? hash.slice(1) : hash;

      // optional: smooth scroll to grid
      toolGrid?.scrollIntoView({ behavior: "smooth", block: "start" });

      // clear search term
      if (searchInput) searchInput.value = "";

      // filter by category
      cards.forEach((card) => {
        const c = card.getAttribute("data-category");
        card.style.display = category === "all" || c === category ? "" : "none";
      });

      // active state for nav (optional)
      navLinks.forEach((a) => a.classList.remove("active"));
      this.classList.add("active");
    });
  });
})();
