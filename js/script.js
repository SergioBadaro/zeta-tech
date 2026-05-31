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

    const nome = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const telefone = document.getElementById("phone")?.value.trim();
    const senha = document.getElementById("password")?.value;
    const confirmarSenha = document.getElementById("confirmPassword")?.value;

    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      showAuthModal("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      showAuthModal("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      showAuthModal("Senhas diferentes", "A confirmação de senha não confere.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthModal("Erro ao cadastrar", data.message || "Erro inesperado");
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
      showAuthModal("Erro de conexão", "Servidor indisponível.");
    }
  });

  // =============================
  // MODAL RECUPERAR SENHA
  // =============================
  const openForgot = document.getElementById("openForgot");
  const forgotModal = document.getElementById("forgotModal");
  const closeModal = document.getElementById("closeModal");

  const resetBtn = document.getElementById("resetBtn");
  const forgotMessage = document.getElementById("forgotMessage");

  const forgotEmail = document.getElementById("forgotEmail");
  const newPassword = document.getElementById("newPassword");
  const confirmPasswordForgot = document.getElementById(
    "confirmPasswordForgot",
  );

  openForgot?.addEventListener("click", (e) => {
    e.preventDefault();
    forgotModal?.classList.remove("hidden");
  });

  closeModal?.addEventListener("click", () => {
    forgotModal?.classList.add("hidden");
  });

  // =============================
  // RESET PASSWORD (CORRIGIDO)
  // =============================
  resetBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = forgotEmail?.value.trim();
    const senha = newPassword?.value;
    const confirmar = confirmPasswordForgot?.value;

    forgotMessage.style.color = "red";

    if (!email || !senha || !confirmar) {
      forgotMessage.textContent = "Preencha todos os campos.";
      return;
    }

    if (senha !== confirmar) {
      forgotMessage.textContent = "As senhas não conferem.";
      return;
    }

    if (senha.length < 6) {
      forgotMessage.textContent = "A senha deve ter no mínimo 6 caracteres.";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword: senha }),
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
