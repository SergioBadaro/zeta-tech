window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  const logo = document.querySelector(".logo img");

  // Detecta a posição da rolagem
  if (window.scrollY > 100) {
    header.classList.add("scrolled"); // Aplica a classe para estilo reduzido
    logo.classList.add("hidden"); // Esconde a logo
  } else {
    header.classList.remove("scrolled");
    logo.classList.remove("hidden"); // Mostra a logo novamente
  }
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;

    // Toggle visibility
    answer.style.display = answer.style.display === "block" ? "none" : "block";

    // Collapse other answers
    document.querySelectorAll(".faq-answer").forEach((otherAnswer) => {
      if (otherAnswer !== answer) {
        otherAnswer.style.display = "none";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const typewriter = document.getElementById("typewriter-text");
  const text = "Bem-vindo à Zeta Tech"; // Texto a ser digitado
  let index = 0;

  // Remove o texto inicial do h1 antes de iniciar o efeito
  typewriter.textContent = "";

  function typeWriterEffect() {
    if (index < text.length) {
      typewriter.textContent += text.charAt(index); // Adiciona o próximo caractere
      index++;
      setTimeout(typeWriterEffect, 150); // Velocidade da digitação
    } else {
      // Após completar o texto, reinicia o efeito
      setTimeout(() => {
        typewriter.textContent = ""; // Limpa o texto
        index = 0; // Reinicia o índice
        typeWriterEffect(); // Chama novamente o efeito
      }, 2000); // Pausa antes de reiniciar (2 segundos no exemplo)
    }
  }

  // Inicia o efeito
  typeWriterEffect();
});

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".fade-in");

  function handleScroll() {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Verifica se o elemento está visível
      if (rect.top < windowHeight && rect.bottom > 0) {
        element.classList.add("visible");
      }
    });
  }

  // Executa no carregamento e ao rolar
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Executa imediatamente para elementos já visíveis
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
});
