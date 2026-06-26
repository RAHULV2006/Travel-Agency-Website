// ===============================
// Hero Image Slider
// ===============================

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

function nextSlide() {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

// Change slide every 4 seconds
if (slides.length > 0) {
    setInterval(nextSlide, 4000);
}

// ===============================
// Contact Form Success Message
// ===============================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        alert(
            "Thank you for contacting CineVista Travels! We will get back to you soon."
        );

        contactForm.reset();
    });
}

// ===============================
// Mobile Menu Toggle
// ===============================

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector("nav ul");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        if (navMenu.style.display === "flex") {
            navMenu.style.display = "none";
        } else {
            navMenu.style.display = "flex";
            navMenu.style.flexDirection = "column";
            navMenu.style.position = "absolute";
            navMenu.style.top = "70px";
            navMenu.style.right = "20px";
            navMenu.style.background = "#ffffff";
            navMenu.style.padding = "15px";
            navMenu.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.2)";
            navMenu.style.borderRadius = "10px";
        }

    });

}

// ===============================
// Package Booking Button Alert
// ===============================

const packageButtons =
    document.querySelectorAll(".package-card button");

packageButtons.forEach((button) => {

    button.addEventListener("click", () => {

        alert(
            "Booking request received! Our travel team will contact you shortly."
        );

    });

});

// ===============================
// Smooth Scroll Effect
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target =
            document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

// ===============================
// Welcome Message
// ===============================

window.addEventListener("load", () => {

    console.log(
        "Welcome to CineVista Travels Website"
    );

});

// ===============================
// Card Hover Animation
// ===============================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px)";
        card.style.transition = "0.3s";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0)";

    });

});

// ===============================
// Scroll Reveal Animation
// ===============================

window.addEventListener("scroll", () => {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {

        const position =
            section.getBoundingClientRect().top;

        const screenPosition =
            window.innerHeight / 1.2;

        if (position < screenPosition) {

            section.style.opacity = "1";
            section.style.transform =
                "translateY(0px)";

        }

    });

});

function searchContent() {

    let input = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    let destinations = {

        "kodaikanal": "kodaikanal.html",
        "ooty": "ooty.html",
        "rameswaram": "rameswaram.html",
        "rameshwaram": "rameswaram.html",
        "kanyakumari": "kanyakumari.html",
        "madurai": "madurai.html",
        "munnar": "munnar.html",
        "cochin": "cochin.html",
        "kochi": "cochin.html",
        "coorg": "coorg.html",
        "mysore": "mysuru.html",
        "mysuru": "mysuru.html",
        "goa": "goa.html",
        "varkala": "varkala.html",
        "alleppey": "alleppey.html",
        "courtallam": "courtallam.html",
        "papanasam": "papanasam.html",
        "tenkasi": "tenkasi.html",
        "srilanka": "srilanka.html",
        "sri lanka": "srilanka.html"

    };

    if (destinations[input]) {

        window.location.href = destinations[input];

    } else {
        alert("Sorry! This destination is not currently available in CineVista Travels.");

    }
}
document.getElementById("searchInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        searchContent();
    }

});
function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("show");
}


