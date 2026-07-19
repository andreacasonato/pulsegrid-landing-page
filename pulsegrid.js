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
