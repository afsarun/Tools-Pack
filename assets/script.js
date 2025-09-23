// faq.js - Centralized FAQ functionality
// class FAQManager {
//   constructor(options = {}) {
//     this.options = {
//       openFirst: false,
//       allowMultiple: false,
//       animationSpeed: 300,
//       ...options,
//     };

//     this.init();
//   }

//   init() {
//     this.faqSections = document.querySelectorAll(
//       ".faq-container, .faq-section, [data-faq]"
//     );

//     if (this.faqSections.length === 0) {
//       console.warn("No FAQ sections found on this page");
//       return;
//     }

//     this.faqSections.forEach((section) => {
//       this.setupSection(section);
//     });

//     // Open first FAQ if enabled
//     if (this.options.openFirst && this.faqSections.length > 0) {
//       const firstFaq = this.faqSections[0].querySelector(".faq-item");
//       if (firstFaq) this.toggleFaq(firstFaq, true);
//     }
//   }

//   setupSection(section) {
//     const faqItems = section.querySelectorAll(".faq-item");

//     faqItems.forEach((item) => {
//       const question = item.querySelector(".faq-question");
//       const answer = item.querySelector(".faq-answer");

//       if (!question || !answer) return;

//       // Add ARIA attributes for accessibility
//       question.setAttribute("role", "button");
//       question.setAttribute("aria-expanded", "false");
//       question.setAttribute("aria-controls", answer.id || this.generateId());

//       if (!answer.id) {
//         answer.id = this.generateId();
//       }

//       // Add click event
//       question.addEventListener("click", () => this.handleFaqClick(item));

//       // Add keyboard support
//       question.addEventListener("keydown", (e) => {
//         if (e.key === "Enter" || e.key === " ") {
//           e.preventDefault();
//           this.handleFaqClick(item);
//         }
//       });
//     });
//   }

//   handleFaqClick(clickedItem) {
//     const section = clickedItem.closest(
//       ".faq-container, .faq-section, [data-faq]"
//     );
//     const allItems = section.querySelectorAll(".faq-item");

//     if (this.options.allowMultiple) {
//       // Toggle only the clicked item
//       this.toggleFaq(clickedItem);
//     } else {
//       // Close all others, toggle clicked
//       allItems.forEach((item) => {
//         if (item === clickedItem) {
//           this.toggleFaq(item);
//         } else {
//           this.closeFaq(item);
//         }
//       });
//     }
//   }

//   toggleFaq(item, forceOpen = false) {
//     const isOpening = forceOpen || !item.classList.contains("active");
//     const question = item.querySelector(".faq-question");
//     const answer = item.querySelector(".faq-answer");

//     if (isOpening) {
//       this.openFaq(item, question, answer);
//     } else {
//       this.closeFaq(item, question, answer);
//     }
//   }

//   openFaq(item, question, answer) {
//     item.classList.add("active");
//     question.setAttribute("aria-expanded", "true");

//     // Animate height
//     answer.style.display = "block";
//     const height = answer.scrollHeight;
//     answer.style.height = "0px";

//     requestAnimationFrame(() => {
//       answer.style.height = height + "px";

//       setTimeout(() => {
//         answer.style.height = "";
//       }, this.options.animationSpeed);
//     });
//   }

//   closeFaq(item, question, answer) {
//     item.classList.remove("active");
//     if (question) question.setAttribute("aria-expanded", "false");

//     if (answer) {
//       const height = answer.scrollHeight;
//       answer.style.height = height + "px";

//       requestAnimationFrame(() => {
//         answer.style.height = "0px";

//         setTimeout(() => {
//           answer.style.height = "";
//           answer.style.display = "none";
//         }, this.options.animationSpeed);
//       });
//     }
//   }

//   generateId() {
//     return "faq-" + Math.random().toString(36).substr(2, 9);
//   }

//   // Public methods
//   openAll() {
//     this.faqSections.forEach((section) => {
//       section.querySelectorAll(".faq-item").forEach((item) => {
//         this.toggleFaq(item, true);
//       });
//     });
//   }

//   closeAll() {
//     this.faqSections.forEach((section) => {
//       section.querySelectorAll(".faq-item").forEach((item) => {
//         this.closeFaq(item);
//       });
//     });
//   }
// }

// // Auto-initialize when DOM is ready
// document.addEventListener("DOMContentLoaded", function () {
//   window.faqManager = new FAQManager({
//     openFirst: false, // Change to true if you want first FAQ open by default
//     allowMultiple: false, // Change to true if multiple FAQs can be open
//   });
// });
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
