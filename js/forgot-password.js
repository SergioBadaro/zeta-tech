document.addEventListener("DOMContentLoaded", () => {
  const forgotModal = document.getElementById("forgotModal");
  const openForgot = document.getElementById("openForgot");
  const closeModal = document.getElementById("closeModal");

  const resetBtn = document.getElementById("resetBtn");
  const message = document.getElementById("forgotMessage");

  const email = document.getElementById("forgotEmail");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  // OPEN MODAL
  openForgot.addEventListener("click", (e) => {
    e.preventDefault();
    forgotModal.classList.remove("hidden");
  });

  // CLOSE MODAL
  function closeForgotModal() {
    forgotModal.classList.add("hidden");
    message.innerText = "";
    email.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  }

  closeModal.addEventListener("click", closeForgotModal);

  // FECHAR CLICANDO FORA
  forgotModal.addEventListener("click", (e) => {
    if (e.target === forgotModal) {
      closeForgotModal();
    }
  });

  // RESET PASSWORD
  resetBtn.addEventListener("click", async () => {
    message.style.color = "red";

    if (!email.value || !newPassword.value || !confirmPassword.value) {
      message.innerText = "Preencha todos os campos.";
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      message.innerText = "As senhas não conferem.";
      return;
    }

    if (newPassword.value.length < 6) {
      message.innerText = "A senha deve ter no mínimo 6 caracteres.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          newPassword: newPassword.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        message.innerText = data.message || "Erro ao redefinir senha.";
        return;
      }

      // SUCESSO
      message.style.color = "green";
      message.innerText = "Senha alterada com sucesso! Redirecionando...";

      setTimeout(() => {
        closeForgotModal();
        window.location.href = "/login-de-usuario.html"; // ajuste se seu login tiver outro nome
      }, 2000);
    } catch (error) {
      console.error(error);
      message.innerText = "Erro de conexão com o servidor.";
    }
  });
});
