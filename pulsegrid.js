"use strict";

// ===== HAMBURGER MENU =====
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// ===== FAQ =====
const accordionTriggers = document.querySelectorAll(".accordion-trigger");

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    // 1. Flip aria-expanded
    trigger.setAttribute("aria-expanded", !isOpen);

    // 2. Expand or collapse the panel
    if (!isOpen) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      panel.style.maxHeight = null;
    }
  });
});

// ===== PRICING / MONTHLY-YEARLY TABS =====
const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Find the single active button and reset its visual + ARIA state
    const currentActive = document.querySelector(".tab-btn.active");
    if (currentActive) {
      currentActive.classList.remove("active");
      currentActive.setAttribute("aria-selected", "false");
    }

    // Set visual + ARIA state for the newly clicked button
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
  });
});

// ===== TRIAL MODAL =====
const modal = document.getElementById("trial-modal");
const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButton = document.getElementById("modal-close");

// 1. Define clean, single-responsibility actions
function openModal() {
  modal.removeAttribute("hidden");
}

function closeModal() {
  modal.setAttribute("hidden", "");
}

// 2. Attach clean, readable event listeners
openButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
    closeModal();
  }
});

// ===== LOGO SLIDER =====
const logos = document.querySelectorAll("#logo-track li");
let currentIndex = 0;

setInterval(() => {
  // 1. remove 'visible' from the current logo
  logos[currentIndex].classList.remove("visible");

  // 2. advance currentIndex, wrapping back to 0 at the end
  currentIndex = (currentIndex + 1) % logos.length;

  // 3. add 'visible' to the new current logo
  logos[currentIndex].classList.add("visible");
}, 3000);

// ===== ANIMATED STAT COUNTERS =====
function animateCount(element) {
  const target = parseFloat(element.dataset.countTo);
  const decimals = Number(element.dataset.decimals || 0);
  const duration = 1500;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    element.textContent = (progress * target).toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll(".stat-number");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Start the counter
      animateCount(entry.target);

      // Stop watching this one — it only needs to fire once
      observer.unobserve(entry.target);
    }
  });
});

statNumbers.forEach((stat) => observer.observe(stat));

// ===== BACK TO THE TOP BUTTON =====
const backToTop = document.getElementById("back-to-top");

let scrollTimeout = null;

window.addEventListener("scroll", () => {
  // A check is already scheduled, so skip this scroll event
  if (scrollTimeout !== null) return;

  scrollTimeout = setTimeout(() => {
    // Show the button after scrolling more than 400px
    if (window.scrollY > 400) {
      backToTop.hidden = false;
    } else {
      backToTop.hidden = true;
    }

    // Clear the lock so the next scroll can schedule another check
    scrollTimeout = null;
  }, 200);
});

// Smoothly scroll back to the top

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ===== TOAST NOTIFICATION SYSTEM =====
const toastContainer = document.getElementById("toast-container");

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // 1. attach it to the container so it actually appears
  toastContainer.appendChild(toast);

  // 2. schedule its removal after ~3.5 seconds
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Then, the form handler:

const trialForm = document.getElementById("trial-form");

trialForm.addEventListener("submit", (event) => {
  // 1. stop the page from actually reloading
  event.preventDefault();

  // 2. close the modal (using your existing closeModal function)
  closeModal();

  // 3. show a toast confirming the trial started
  showToast("Free trial started! Check your email for next steps.");

  // 4. reset the form so the email field is empty next time it opens
  trialForm.reset();
});

// ===== SEARCH FEATURE =====
const searchInput = document.getElementById("integration-search");
const integrationCards = document.querySelectorAll(".integration-card");

// ===== CATEGORY FILTERING =====
const categorySelect = document.getElementById("integration-category");

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  integrationCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const matchesSearch = name.includes(query);
    const matchesCategory =
      selectedCategory === "all" || card.dataset.category === selectedCategory;

    card.classList.toggle("hidden", !(matchesSearch && matchesCategory));
  });
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
