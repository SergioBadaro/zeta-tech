const NOTIFICATION_KEY = "dashboardNotifications";

function formatDate(dateString) {
  if (!dateString) return "Agora";
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadNotifications() {
  try {
    const stored = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function renderNotifications() {
  const container = document.getElementById("notificationList");
  const totalCount = document.getElementById("totalCount");
  const lastUpdate = document.getElementById("lastUpdate");
  const statusSummary = document.getElementById("statusSummary");
  const panelBadge = document.getElementById("panelBadge");

  if (!container) return;

  const notifications = loadNotifications();
  container.innerHTML = "";

  if (totalCount) totalCount.textContent = notifications.length;
  if (panelBadge) panelBadge.textContent = `${notifications.length} item${notifications.length === 1 ? "" : "s"}`;

  if (notifications.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "Nenhuma notificação registrada ainda. Novos chamados e conclusões aparecerão aqui.";
    container.appendChild(emptyState);
    if (lastUpdate) lastUpdate.textContent = "Agora";
    if (statusSummary) statusSummary.textContent = "Em dia";
    return;
  }

  const latestTimestamp = notifications[0]?.timestamp || new Date().toISOString();
  if (lastUpdate) lastUpdate.textContent = formatDate(latestTimestamp);

  const warningCount = notifications.filter((item) => item.type === "warning").length;
  if (statusSummary) {
    statusSummary.textContent = warningCount > 0 ? "Atenção" : "Em dia";
  }

  notifications.forEach((item) => {
    const card = document.createElement("article");
    card.className = "notification-card";

    const dotColor = item.type === "warning" ? "#f59e0b" : item.type === "deleted" ? "#ef4444" : "#22c55e";
    const pillClass = item.type === "warning" ? "warning" : "success";
    const pillLabel = item.type === "warning" ? "Atenção" : "Sucesso";

    card.innerHTML = `
      <div class="notification-dot" style="background:${dotColor};"></div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.message}</p>
        <div class="notification-meta">
          <span class="notification-pill ${pillClass}">${pillLabel}</span>
          <span class="notification-time">${formatDate(item.timestamp)}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function clearAllNotifications() {
  localStorage.removeItem(NOTIFICATION_KEY);
  renderNotifications();
}

document.addEventListener("DOMContentLoaded", () => {
  renderNotifications();

  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open_btn");
  const openBtnIcon = document.getElementById("open_btn_icon");
  const logoutButton = document.getElementById("logout_btn");

  if (sidebar && openBtn && openBtnIcon) {
    openBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open-sidebar");
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/assets/Login/login-de-usuario.html";
    });
  }

  const clearButton = document.getElementById("clearAllButton");
  if (clearButton) {
    clearButton.addEventListener("click", clearAllNotifications);
  }

  window.addEventListener("storage", (event) => {
    if (event.key === NOTIFICATION_KEY) {
      renderNotifications();
    }
  });
});
