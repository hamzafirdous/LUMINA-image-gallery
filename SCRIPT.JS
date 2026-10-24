
"use strict";

// Select gallery elements.
const cards = [...document.querySelectorAll(".gallery-card")];
const filters = [...document.querySelectorAll(".filter-btn")];

const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("large-image");
const largeTitle = document.getElementById("large-title");
const largeLocation = document.getElementById("large-location");
const largeCategory = document.getElementById("large-category");
const imageCounter = document.getElementById("image-counter");

const closeButton = document.getElementById("close");
const previousButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let visibleCards = [...cards];
let currentIndex = 0;
let previousFocus = null;

// Update the number of visible photographs.
function updateCount() {
    const total = visibleCards.length;
    document.getElementById("count").textContent =
        `Showing ${String(total).padStart(2, "0")} photographs`;
}

// Filter the gallery by category.
function filterGallery(category) {
    filters.forEach((button) => {
        const active = button.dataset.filter === category;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    visibleCards = cards.filter((card) => {
        const matches =
            category === "all" || card.dataset.category === category;

        card.hidden = !matches;
        return matches;
    });

    updateCount();
}

// Update the lightbox content.
function renderImage() {
    if (!visibleCards.length) return;

    const card = visibleCards[currentIndex];
    const image = card.querySelector("img");

    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt;
    largeTitle.textContent = card.dataset.title;
    largeLocation.textContent = card.dataset.location;
    largeCategory.textContent = card.dataset.category.toUpperCase();

    imageCounter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ` +
        `${String(visibleCards.length).padStart(2, "0")}`;

    const disabled = visibleCards.length < 2;
    previousButton.disabled = disabled;
    nextButton.disabled = disabled;
}

// Open the image viewer.
function openLightbox(card) {
    visibleCards = cards.filter((item) => !item.hidden);
    currentIndex = visibleCards.indexOf(card);

    if (currentIndex < 0) return;

    previousFocus = document.activeElement;
    renderImage();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    closeButton.focus();
}

// Close the image viewer.
function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    largeImage.removeAttribute("src");
    largeImage.alt = "";

    if (previousFocus) previousFocus.focus();
}

// Move to the next or previous photograph.
function changeImage(direction) {
    if (visibleCards.length < 2) return;

    currentIndex =
        (currentIndex + direction + visibleCards.length) %
        visibleCards.length;

    renderImage();
}

// Filter buttons.
filters.forEach((button) => {
    button.addEventListener("click", () => {
        filterGallery(button.dataset.filter);
    });
});

// Gallery image clicks.
cards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
});

// Viewer controls.
closeButton.addEventListener("click", closeLightbox);

previousButton.addEventListener("click", () => changeImage(-1));
nextButton.addEventListener("click", () => changeImage(1));

// Close when the backdrop is clicked.
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});

// Keyboard support.
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") changeImage(-1);
    if (event.key === "ArrowRight") changeImage(1);
});

// Initialize the gallery.
filterGallery("all");

const themeToggle = document.getElementById("themeToggle");

// Save ki hui theme load karo
if (localStorage.getItem("lumina-theme") === "dark") {
    document.body.classList.add("dark-mode");
}

function updateThemeButton() {
    themeToggle.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

updateThemeButton();

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

    localStorage.setItem("lumina-theme", theme);
    updateThemeButton();
});

