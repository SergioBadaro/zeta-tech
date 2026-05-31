document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // TOGGLE SENHAS
  // =============================
  function setupPasswordToggle(toggleBtnId, inputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);

    if (!toggleBtn || !input) return;

    toggleBtn.addEventListener("click", (event) => {
      event.preventDefault();

      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";

      toggleBtn.innerHTML = isVisible
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  }

  setupPasswordToggle("togglePassword", "password");
  setupPasswordToggle("toggleConfirmPassword", "confirmPassword");
  setupPasswordToggle("toggleNewPassword", "newPassword");
  setupPasswordToggle("toggleConfirmPasswordForgot", "confirmPasswordForgot");

  // =============================
  // MODAL ALERTA
  // =============================
  function showAuthModal(title, message, type = "error") {
    const modal = document.getElementById("authModal");
    if (!modal) return alert(message);

    const titleEl = document.getElementById("authModalTitle");
    const messageEl = document.getElementById("authModalMessage");
    const iconEl = document.getElementById("authModalIcon");

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    if (iconEl) {
      iconEl.textContent = type === "success" ? "✓" : "!";
      iconEl.classList.toggle("success", type === "success");
    }

    modal.classList.add("auth-modal--show");
    modal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      modal.classList.remove("auth-modal--show");
      modal.setAttribute("aria-hidden", "true");
    }, 2000);
  }

  // =============================
  // LOGIN
  // =============================
  const loginForm = document.getElementById("loginForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      showAuthModal("Atenção", "Preencha email e senha.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthModal("Falha no login", data.message || "Erro ao entrar");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      window.location.href = "/assets/index.html";
    } catch (error) {
      showAuthModal("Erro de conexão", "Servidor indisponível.");
    }
  });

  // =============================
  // CADASTRO
  // =============================
  const registerForm = document.getElementById("registerForm");

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = {
      nome: document.getElementById("name")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      telefone: document.getElementById("phone")?.value.trim(),
      senha: document.getElementById("password")?.value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {}

      if (!response.ok) {
        showAuthModal(
          "Erro ao cadastrar",
          data.message || "Não foi possível criar a conta",
          "error",
        );
        return;
      }

      showAuthModal(
        "Conta criada com sucesso",
        "Você será redirecionado para o login",
        "success",
      );

      setTimeout(() => {
        window.location.href = "/assets/Login/login-de-usuario.html";
      }, 1500);
    } catch (error) {
      showAuthModal(
        "Erro de conexão",
        "Não foi possível conectar ao servidor",
        "error",
      );
    }
  });

  // =============================
  // MODAL RECUPERAR SENHA
  // =============================
  const openForgot = document.getElementById("openForgot");
  const forgotModal = document.getElementById("forgotModal");
  const closeModal = document.getElementById("closeModal");

  openForgot?.addEventListener("click", (e) => {
    e.preventDefault();
    forgotModal?.classList.remove("hidden");
  });

  closeModal?.addEventListener("click", () => {
    forgotModal?.classList.add("hidden");
  });
});
