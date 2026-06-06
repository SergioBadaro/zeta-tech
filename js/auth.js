document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    window.location.href = "/assets/Login/login-de-usuario.html";
    return;
  }

  const logoutButton = document.getElementById("logout_btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/assets/Login/login-de-usuario.html";
    });
  }
});
