// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {

    /* ---------- 1. Mobile menu ---------- */
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    function setMenu(open) {
        navMenu.classList.toggle("open", open);
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
    }

    menuToggle.addEventListener("click", () => {
        setMenu(!navMenu.classList.contains("open"));
    });

    // Close the menu after clicking a link
    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    /* ---------- 2. Typing effect in the hero ---------- */
    const typedEl = document.getElementById("typed");
    const roles = ["student", "future engineer", "web developer", "security enthusiast"];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const word = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typedEl.textContent = word.substring(0, charIndex);

        let delay = deleting ? 50 : 110;

        if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1400;           // pause on the full word
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }
        setTimeout(type, delay);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        typedEl.textContent = roles[1];
    } else {
        type();
    }

    /* ---------- 3. Highlight the active nav link while scrolling ---------- */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav a");

    function updateActiveLink() {
        let current = "home";
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) current = section.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    }

    /* ---------- 4. Back-to-top button ---------- */
    const toTop = document.getElementById("toTop");

    window.addEventListener("scroll", () => {
        updateActiveLink();
        toTop.classList.toggle("show", window.scrollY > 400);
    });
    updateActiveLink();

    toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- 5. Contact form validation ---------- */
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    const fields = {
        name: {
            input: document.getElementById("name"),
            error: document.getElementById("nameError"),
            check: v => v.length >= 2 ? "" : "Please enter your name (at least 2 characters)."
        },
        email: {
            input: document.getElementById("email"),
            error: document.getElementById("emailError"),
            check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address."
        },
        message: {
            input: document.getElementById("message"),
            error: document.getElementById("messageError"),
            check: v => v.length >= 10 ? "" : "Your message must be at least 10 characters long."
        }
    };

    function validateField(field) {
        const msg = field.check(field.input.value.trim());
        field.error.textContent = msg;
        field.input.classList.toggle("invalid", msg !== "");
        return msg === "";
    }

    // Live feedback once the user leaves a field
    Object.values(fields).forEach(field => {
        field.input.addEventListener("blur", () => validateField(field));
        field.input.addEventListener("input", () => {
            if (field.input.classList.contains("invalid")) validateField(field);
        });
    });

    form.addEventListener("submit", event => {
        event.preventDefault();               // stay on the page
        status.textContent = "";

        const allValid = Object.values(fields).map(validateField).every(Boolean);
        if (!allValid) return;

        const name = fields.name.input.value.trim();
        console.log("Form data:", {
            name,
            email: fields.email.input.value.trim(),
            message: fields.message.input.value.trim()
        });

        status.textContent = `Thank you, ${name}! Your message was sent.`;
        form.reset();
    });

    /* ---------- 6. Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});