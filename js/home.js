const header = document.getElementById("header");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const navLinks = document.querySelectorAll("#menu li a");
const typewriterText = document.getElementById("typewriter-text");
const contactForm = document.getElementById("contact-form");
const successMessage = document.querySelector(".success-message");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
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

function revealOnScroll() {
  document.querySelectorAll(".fade-in").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < windowHeight - 100) {
      element.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function setupFaq() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const isOpen = answer.classList.contains("open");

      document.querySelectorAll(".faq-answer").forEach((item) => {
        item.classList.remove("open");
        item.style.maxHeight = null;
      });

      if (!isOpen) {
        answer.classList.add("open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

function initializeFaqAnswers() {
  document.querySelectorAll(".faq-answer").forEach((answer) => {
    answer.style.maxHeight = null;
  });
}

setupFaq();
initializeFaqAnswers();

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
