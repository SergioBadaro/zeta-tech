const header = document.getElementById("header");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const navLinks = document.querySelectorAll("#menu li a");
const typewriterText = document.getElementById("typewriter-text");
const contactForm = document.getElementById("contact-form");
const successMessage = document.querySelector(".success-message");

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  },
  { passive: true },
);

// Menu toggle com aria-expanded e aria-hidden
if (hamburger && menu) {
  hamburger.addEventListener("click", (e) => {
    const open = menu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    e.stopPropagation();
  });

  // fechar ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      !menu.contains(e.target) &&
      !hamburger.contains(e.target) &&
      menu.classList.contains("active")
    ) {
      menu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
  });

  // fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("active")) {
      menu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (menu.classList.contains("active")) {
      menu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
  });
});

const phrases = [
  "Transforme seu suporte com a Zeta Tech",
  "Controle completo dos seus chamados",
  "Atendimento rápido e seguro para sua empresa",
];
let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function writeTypewriter() {
  const currentPhrase = phrases[phraseIndex];
  const displayedText = currentPhrase.substring(0, characterIndex);

  if (typewriterText) {
    typewriterText.textContent = displayedText;
  }

  if (!isDeleting && characterIndex < currentPhrase.length) {
    characterIndex++;
    setTimeout(writeTypewriter, 90);
  } else if (isDeleting && characterIndex > 0) {
    characterIndex--;
    setTimeout(writeTypewriter, 40);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(writeTypewriter, 1800);
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(writeTypewriter, 200);
    }
  }
}

if (typewriterText) {
  writeTypewriter();
}

// Substitui revealOnScroll por IntersectionObserver (mais performático)
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".fade-in")
  .forEach((el) => revealObserver.observe(el));

// FAQ: event delegation + aria
const faqGrid = document.querySelector(".faq-grid");
if (faqGrid) {
  faqGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq-question");
    if (!btn) return;
    const faqItem = btn.closest(".faq-item");
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
      const a = item.querySelector(".faq-answer");
      if (a) {
        a.classList.remove("open");
        a.style.maxHeight = null;
      }
      const q = item.querySelector(".faq-question");
      if (q) q.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      faqItem.classList.add("active");
      answer.classList.add("open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      btn.setAttribute("aria-expanded", "true");
    }
  });

  // inicializar estado
  document
    .querySelectorAll(".faq-question")
    .forEach((b) => b.setAttribute("aria-expanded", "false"));
  document
    .querySelectorAll(".faq-answer")
    .forEach((a) => (a.style.maxHeight = null));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    if (successMessage) {
      successMessage.classList.add("visible");
      setTimeout(() => {
        successMessage.classList.remove("visible");
      }, 4500);
    }
  });
}
