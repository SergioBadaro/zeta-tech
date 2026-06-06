document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // TOAST SYSTEM
  // =============================
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

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
  // LOGIN
  // =============================
  const loginForm = document.getElementById("loginForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      showToast("Preencha email e senha", "error");
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
        showToast(data.message || "Erro ao entrar", "error");
        return;
      }

      showToast("Login realizado com sucesso!", "success");

      localStorage.setItem("user", JSON.stringify(data));

      setTimeout(() => {
        window.location.href = "/assets/index.html";
      }, 1200);
    } catch (error) {
      showToast("Servidor indisponível", "error");
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
      showToast("Preencha todos os campos", "error");
      return;
    }

    if (senha.length < 6) {
      showToast("Senha muito fraca", "error");
      return;
    }

    if (senha !== confirmarSenha) {
      showToast("As senhas não conferem", "error");
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
        showToast(data.message || "Erro ao cadastrar", "error");
        return;
      }

      showToast("Conta criada com sucesso!", "success");

      setTimeout(() => {
        window.location.href = "/assets/Login/login-de-usuario.html";
      }, 1200);
    } catch (error) {
      showToast("Servidor indisponível", "error");
    }
  });

  // =============================
  // RESET PASSWORD
  // =============================
  const openForgot = document.getElementById("openForgot");
  const forgotModal = document.getElementById("forgotModal");
  const closeModal = document.getElementById("closeModal");

  const resetBtn = document.getElementById("resetBtn");
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

  resetBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = forgotEmail?.value.trim();
    const senha = newPassword?.value;
    const confirmar = confirmPasswordForgot?.value;

    if (!email || !senha || !confirmar) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    if (senha !== confirmar) {
      showToast("As senhas não conferem", "error");
      return;
    }

    if (senha.length < 6) {
      showToast("Senha muito fraca", "error");
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
        showToast(data.message || "Erro ao redefinir senha", "error");
        return;
      }

      showToast("Senha alterada com sucesso!", "success");

      setTimeout(() => {
        forgotModal?.classList.add("hidden");
        window.location.href = "/assets/Login/login-de-usuario.html";
      }, 1200);
    } catch (error) {
      showToast("Servidor indisponível", "error");
    }
  });
});
