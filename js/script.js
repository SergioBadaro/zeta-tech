// =============================
// INIT (SEGURANÇA DOM)
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // TOGGLE SENHAS (GLOBAL)
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

  // LOGIN
  setupPasswordToggle("togglePassword", "password");

  // CADASTRO
  setupPasswordToggle("toggleConfirmPassword", "confirmPassword");

  // RESET SENHA (MODAL)
  setupPasswordToggle("toggleNewPassword", "newPassword");
  setupPasswordToggle("toggleConfirmPasswordForgot", "confirmPasswordForgot");

  // =============================
  // MODAL AUTH
  // =============================
  function showAuthModal(title, message, type = "error") {
    const modal = document.getElementById("authModal");
    if (!modal) return alert(message);

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

    if (buttonEl) buttonEl.focus();
  }

  function hideAuthModal() {
    const modal = document.getElementById("authModal");
    if (!modal) return;

    modal.classList.remove("auth-modal--show");
    modal.setAttribute("aria-hidden", "true");
  }

  document
    .getElementById("authModalClose")
    ?.addEventListener("click", hideAuthModal);
  document
    .getElementById("authModalButton")
    ?.addEventListener("click", hideAuthModal);
  document
    .getElementById("authModalOverlay")
    ?.addEventListener("click", hideAuthModal);

  // =============================
  // LOGIN
  // =============================
  const loginForm = document.getElementById("loginForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      showAuthModal("Dados incompletos", "Preencha email e senha.");
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
        showAuthModal("Falha no login", data.message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/assets/index.html";
    } catch (error) {
      showAuthModal("Erro de conexão", "Servidor offline.");
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

  // =============================
  // RESET SENHA
  // =============================
  const resetBtn = document.getElementById("resetBtn");
  const forgotMessage = document.getElementById("forgotMessage");

  resetBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("forgotEmail")?.value.trim();
    const newPassword = document.getElementById("newPassword")?.value;
    const confirmPassword = document.getElementById(
      "confirmPasswordForgot",
    )?.value;

    if (!email || !newPassword || !confirmPassword) {
      forgotMessage.textContent = "Preencha todos os campos.";
      return;
    }

    if (newPassword !== confirmPassword) {
      forgotMessage.textContent = "As senhas não conferem.";
      return;
    }

    if (newPassword.length < 6) {
      forgotMessage.textContent = "Senha fraca (mínimo 6 caracteres).";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        forgotMessage.textContent = data.message || "Erro ao redefinir senha.";
        return;
      }

      forgotMessage.style.color = "green";
      forgotMessage.textContent = "Senha alterada com sucesso!";

      setTimeout(() => {
        forgotModal?.classList.add("hidden");
        window.location.href = "/assets/Login/login-de-usuario.html";
      }, 1500);
    } catch (error) {
      forgotMessage.textContent = "Erro de conexão com servidor.";
    }
  });
});
