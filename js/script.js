// script.js

// Toggle de visibilidade de senha
function setupPasswordToggle(toggleBtnId, inputId) {
  const toggleBtn = document.getElementById(toggleBtnId);
  const passwordInput = document.getElementById(inputId);

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const isPasswordVisible = passwordInput.type === "text";
      passwordInput.type = isPasswordVisible ? "password" : "text";
      toggleBtn.innerHTML = isPasswordVisible
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  }
}

// Inicializar toggles
setupPasswordToggle("togglePassword", "password");
setupPasswordToggle("toggleConfirmPassword", "confirmPassword");

// Validação de senha em tempo real
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");

if (confirmPasswordInput && passwordError) {
  confirmPasswordInput.addEventListener("input", function () {
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.style.display = "block";
    } else {
      passwordError.style.display = "none";
    }
  });
}

// Submissão do formulário
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar se as senhas conferem
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.style.display = "block";
      alert("As senhas não conferem. Verifique e tente novamente.");
      return;
    }

    // Validar força mínima da senha
    if (passwordInput.value.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    alert("Conta criada com sucesso!");
  });
