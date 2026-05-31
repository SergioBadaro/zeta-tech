// =============================
// MOSTRAR / OCULTAR SENHA
// =============================

function setupPasswordToggle(toggleBtnId, inputId) {
  const toggleBtn = document.getElementById(toggleBtnId);
  const input = document.getElementById(inputId);

  if (!toggleBtn || !input) return;

  toggleBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const visible = input.type === "text";

    input.type = visible ? "password" : "text";

    toggleBtn.innerHTML = visible
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
  });
}

setupPasswordToggle("togglePassword", "password");
setupPasswordToggle("toggleConfirmPassword", "confirmPassword");

function showAuthModal(title, message, type = "error") {
  const modal = document.getElementById("authModal");
  if (!modal) {
    alert(message);
    return;
  }

  const titleEl = document.getElementById("authModalTitle");
  const messageEl = document.getElementById("authModalMessage");
  const iconEl = document.getElementById("authModalIcon");
  const buttonEl = document.getElementById("authModalButton");

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  if (iconEl) {
    iconEl.textContent = type === "success" ? "✓" : "!";
    iconEl.classList.toggle("success", type === "success");
  }

  modal.classList.add("auth-modal--show");
  modal.setAttribute("aria-hidden", "false");

  if (buttonEl) {
    buttonEl.focus();
  }
}

function hideAuthModal() {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  modal.classList.remove("auth-modal--show");
  modal.setAttribute("aria-hidden", "true");
}

const authModalClose = document.getElementById("authModalClose");
const authModalButton = document.getElementById("authModalButton");
const authModalOverlay = document.getElementById("authModalOverlay");

if (authModalClose) {
  authModalClose.addEventListener("click", hideAuthModal);
}

if (authModalButton) {
  authModalButton.addEventListener("click", hideAuthModal);
}

if (authModalOverlay) {
  authModalOverlay.addEventListener("click", hideAuthModal);
}

// =============================
// ELEMENTOS DO FORMULÁRIO
// =============================

const registerForm = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");

// =============================
// VALIDAÇÃO DE SENHAS EM TEMPO REAL
// =============================

if (confirmPasswordInput && passwordError) {
  confirmPasswordInput.addEventListener("input", function () {
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.style.display = "block";
    } else {
      passwordError.style.display = "none";
    }
  });
}

// =============================
// CADASTRO DE USUÁRIO
// =============================

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Validar senhas
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.style.display = "block";
      showAuthModal(
        "Senhas diferentes",
        "As senhas não conferem. Verifique e tente novamente.",
      );
      return;
    }

    // Validar tamanho mínimo
    if (passwordInput.value.length < 6) {
      showAuthModal("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    const usuario = {
      nome: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("phone").value.trim(),
      senha: passwordInput.value,
    };

    try {
      console.log("Enviando cadastro...", usuario);

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      console.log("Resposta do servidor:", data);

      if (response.ok) {
        showAuthModal(
          "Cadastro realizado",
          "Conta criada com sucesso! Redirecionando para login...",
          "success",
        );

        setTimeout(() => {
          window.location.href = "/assets/Login/login-de-usuario.html";
        }, 1600);
        return;
      } else {
        showAuthModal(data.message || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro:", error);

      showAuthModal(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
      );
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showAuthModal(
        "Dados incompletos",
        "Preencha o email e a senha para acessar.",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthModal(
          "Falha no login",
          data.message || "Email ou senha inválidos. Faça cadastro.",
        );
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.user.email,
          nome: data.user.nome,
          token: data.token,
          loggedAt: new Date().toISOString(),
        }),
      );

      window.location.href = "/assets/index.html";
    } catch (error) {
      console.error("Erro de login:", error);
      showAuthModal(
        "Erro de autenticação",
        "Não foi possível conectar ao servidor de autenticação.",
      );
    }
  });
}
