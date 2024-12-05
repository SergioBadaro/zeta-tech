document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});

document.addEventListener("DOMContentLoaded", () => {
  const dashboardContainer = document.getElementById("dashboardContainer");

  // Função para carregar dados dos chamados
  function loadCalls() {
    const calls = JSON.parse(localStorage.getItem("calls") || "[]");

    // Contadores
    const totalCalls = calls.length;
    const pendingCalls = calls.filter(
      (call) => call.status === "pendente"
    ).length;
    const resolvedCalls = calls.filter(
      (call) => call.status === "concluído"
    ).length;

    // Funções para calcular chamados no dia, semana e mês
    const callsToday = calls.filter((call) =>
      isToday(new Date(call.createdAt))
    );
    const callsThisWeek = calls.filter((call) =>
      isThisWeek(new Date(call.createdAt))
    );
    const callsThisMonth = calls.filter((call) =>
      isThisMonth(new Date(call.createdAt))
    );

    // Criação dos cards no Dashboard
    createCard("Chamados no Dia", callsToday.length);
    createCard("Chamados na Semana", callsThisWeek.length);
    createCard("Chamados no Mês", callsThisMonth.length);
    createCard("Total de Chamados", totalCalls);
    createCard("Chamados Abertos", pendingCalls);
    createCard("Chamados Resolvidos", resolvedCalls);
  }

  // Função para criar os cards
  function createCard(title, value) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${title}</h3>
      <p>${value}</p>
    `;
    dashboardContainer.appendChild(card);
  }

  // Função para verificar se a data é de hoje
  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Função para verificar se a data está na mesma semana
  function isThisWeek(date) {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    return date >= startOfWeek && date <= endOfWeek;
  }

  // Função para verificar se a data está no mesmo mês
  function isThisMonth(date) {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Carregar chamados e gerar os cards ao iniciar
  loadCalls();
});

// codigo para realizar o Logout do usuário

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout_btn");

  // Função para fazer o logout
  function logout() {
    // Remover dados de login armazenados no localStorage (ou sessionStorage)
    localStorage.removeItem("user"); // Aqui você remove os dados de login

    // Opcional: Redirecionar o usuário para a página de login ou página pública
    window.location.href = "/assets/login-de-usuario.html"; // Ou a URL da sua página de login
  }

  // Adiciona o evento de clique no botão de logout
  logoutButton.addEventListener("click", logout);
});
