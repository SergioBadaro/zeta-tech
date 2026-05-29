document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});

const NOTIFICATION_KEY = "dashboardNotifications";

function formatDate(dateString) {
  if (!dateString) return "Sem data";
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

function saveNotifications(items) {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(items.slice(0, 10)));
}

function createToast(title, message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "warning" ? "warning" : ""}`;
  toast.innerHTML = `
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  `;

  toastContainer.prepend(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function recordNotification(notification) {
  const notifications = loadNotifications();
  notifications.unshift({
    ...notification,
    timestamp: notification.timestamp || new Date().toISOString(),
  });

  saveNotifications(notifications);
  renderNotifications();
  createToast(notification.title, notification.message, notification.type);
}

function renderNotifications() {
  const container = document.getElementById("notificationList");
  if (!container) return;

  const notifications = loadNotifications();
  container.innerHTML = "";

  if (notifications.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "Nenhuma atualização recente. Acompanhe novos chamados aqui.";
    container.appendChild(emptyState);
    return;
  }

  notifications.forEach((item) => {
    const notification = document.createElement("div");
    notification.className = "notification-item";
    const dotClass = item.type === "warning" ? "#f59e0b" : item.type === "deleted" ? "#ef4444" : "#22c55e";

    notification.innerHTML = `
      <div class="notification-dot" style="background:${dotClass};"></div>
      <div class="notification-content">
        <strong>${item.title}</strong>
        <p>${item.message}</p>
        <span class="notification-time">${formatDate(item.timestamp)}</span>
      </div>
    `;

    container.appendChild(notification);
  });
}

function renderSummary(calls) {
  const summaryGrid = document.getElementById("summaryGrid");
  if (!summaryGrid) return;

  summaryGrid.innerHTML = "";

  const totalCalls = calls.length;
  const pendingCalls = calls.filter((call) => call.status === "pendente").length;
  const completedCalls = calls.filter((call) => call.status === "concluído").length;
  const overdueCalls = calls.filter((call) => call.status === "pendente" && call.slaDate && new Date(call.slaDate) < new Date()).length;
  const callsToday = calls.filter((call) => new Date(call.createdAt).toDateString() === new Date().toDateString()).length;
  const closeRate = totalCalls === 0 ? 0 : Math.round((completedCalls / totalCalls) * 100);

  const cards = [
    {
      label: "Chamados totais",
      value: totalCalls,
      accent: "#4f46e5",
      icon: "fa-layer-group",
      footnote: `${callsToday} abertas hoje`,
    },
    {
      label: "Pendentes",
      value: pendingCalls,
      accent: "#f59e0b",
      icon: "fa-hourglass-half",
      footnote: `${overdueCalls} em atraso`,
    },
    {
      label: "Concluídos",
      value: completedCalls,
      accent: "#22c55e",
      icon: "fa-check-circle",
      footnote: `${closeRate}% taxa de encerramento`,
    },
    {
      label: "Urgência",
      value: overdueCalls,
      accent: "#ef4444",
      icon: "fa-exclamation-triangle",
      footnote: "Ações prioritárias",
    },
  ];

  cards.forEach((card) => {
    const item = document.createElement("article");
    item.className = "summary-card";
    item.innerHTML = `
      <div class="summary-card-header">
        <div>
          <div class="summary-card-label">${card.label}</div>
          <div class="summary-card-value">${card.value}</div>
        </div>
        <div class="summary-card-icon" style="background: linear-gradient(180deg, ${card.accent}, ${card.accent});">
          <i class="fas ${card.icon}"></i>
        </div>
      </div>
      <div class="summary-card-footer">
        <span class="summary-card-footnote">${card.footnote}</span>
        <span class="summary-card-dot" style="background:${card.accent};"></span>
      </div>
    `;

    summaryGrid.appendChild(item);
  });

  const completionValue = document.getElementById("completionValue");
  if (completionValue) {
    completionValue.textContent = `${closeRate}%`;
  }

  const overviewList = document.getElementById("overviewList");
  if (overviewList) {
    overviewList.innerHTML = "";

    const overviewItems = [
      { label: "Chamados em aberto", value: pendingCalls, className: "active", accent: "#4f46e5" },
      { label: "Chamados concluídos", value: completedCalls, className: "success", accent: "#22c55e" },
      { label: "Chamados com SLA crítico", value: overdueCalls, className: "warning", accent: "#f59e0b" },
    ];

    overviewItems.forEach((item) => {
      const entry = document.createElement("div");
      entry.className = "overview-item";
      entry.innerHTML = `
        <div class="overview-item-label">
          <strong>${item.label}</strong>
          <span>Monitoramento operacional</span>
        </div>
        <div class="overview-item-value ${item.className}" style="background:${item.accent}20;color:${item.accent};">${item.value}</div>
      `;
      overviewList.appendChild(entry);
    });
  }
}

function renderTrend(calls) {
  const trendBars = document.getElementById("trendBars");
  if (!trendBars) return;

  trendBars.innerHTML = "";

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      label: date.toLocaleDateString("pt-BR", { weekday: "short" }),
      count: calls.filter((call) => new Date(call.createdAt).toDateString() === date.toDateString()).length,
    };
  });

  lastSevenDays.forEach((day) => {
    const column = document.createElement("div");
    column.className = "bar-column";
    const maxValue = Math.max(...lastSevenDays.map((item) => item.count), 1);
    const height = Math.max(14, Math.round((day.count / maxValue) * 100));
    column.innerHTML = `
      <div class="bar-track"><div class="bar-fill" style="height:${height}%;"></div></div>
      <span class="bar-label">${day.label}</span>
    `;
    trendBars.appendChild(column);
  });
}

function renderStatusBars(calls) {
  const statusBars = document.getElementById("statusBars");
  if (!statusBars) return;

  statusBars.innerHTML = "";

  const openCount = calls.filter((call) => call.status === "pendente").length;
  const completedCount = calls.filter((call) => call.status === "concluído").length;
  const total = calls.length || 1;

  [
    { label: "Pendentes", value: openCount, color: "#4f46e5" },
    { label: "Concluídos", value: completedCount, color: "#22c55e" },
  ].forEach((item) => {
    const row = document.createElement("div");
    row.className = "status-bar-row";
    const percentage = Math.round((item.value / total) * 100);
    row.innerHTML = `
      <div class="status-bar-label">${item.label}</div>
      <div class="status-bar-wrapper"><div class="status-bar-fill" style="width:${percentage}%; background:${item.color};"></div></div>
      <div class="status-bar-value">${item.value}</div>
    `;
    statusBars.appendChild(row);
  });
}

function renderRecentCalls(calls) {
  const recentCalls = document.getElementById("recentCalls");
  if (!recentCalls) return;

  recentCalls.innerHTML = "";

  const sorted = [...calls].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  if (sorted.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "Nenhum chamado registrado ainda. Cadastre um novo ticket para visualizar aqui.";
    recentCalls.appendChild(emptyState);
    return;
  }

  sorted.forEach((call) => {
    const item = document.createElement("article");
    item.className = "recent-item";

    const icon = call.status === "concluído" ? "fa-check" : "fa-phone";
    const iconColor = call.status === "concluído" ? "#22c55e" : "#4f46e5";
    const statusClass = call.status === "concluído" ? "completed" : "pending";

    item.innerHTML = `
      <div class="recent-item-main">
        <div class="recent-icon" style="background: linear-gradient(180deg, ${iconColor}, ${iconColor});">
          <i class="fas ${icon}"></i>
        </div>
        <div class="recent-details">
          <strong>${call.name || "Cliente sem nome"}</strong>
          <span>${call.problem || "Sem descrição registrada"}</span>
        </div>
      </div>
      <div class="recent-meta">
        <span class="status-pill ${statusClass}">${call.status === "concluído" ? "Concluído" : "Pendente"}</span>
        <span class="recent-time">${formatDate(call.createdAt)}</span>
      </div>
    `;

    recentCalls.appendChild(item);
  });
}

function refreshDashboard() {
  const storedCalls = JSON.parse(localStorage.getItem("calls") || "[]");
  const calls = storedCalls.map((call) => ({
    ...call,
    createdAt: call.createdAt || call.date || new Date().toISOString(),
    completed: Boolean(call.completed),
    status: call.status || (Boolean(call.completed) ? "concluído" : "pendente"),
    slaDate: call.slaDate || call.date || null,
  }));

  localStorage.setItem("calls", JSON.stringify(calls));

  renderSummary(calls);
  renderTrend(calls);
  renderStatusBars(calls);
  renderRecentCalls(calls);
  renderNotifications();
}

function clearNotifications() {
  localStorage.removeItem(NOTIFICATION_KEY);
  renderNotifications();
}

document.addEventListener("DOMContentLoaded", () => {
  refreshDashboard();

  const logoutButton = document.getElementById("logout_btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/assets/Login/login-de-usuario.html";
    });
  }

  const clearButton = document.getElementById("clearNotifications");
  if (clearButton) {
    clearButton.addEventListener("click", clearNotifications);
  }

  window.addEventListener("callsUpdated", (event) => {
    const detail = event.detail || {};
    const call = detail.call || {};

    if (detail.action === "created") {
      recordNotification({
        type: "success",
        title: "Novo chamado aberto",
        message: `${call.name || "Um cliente"} abriu um chamado e foi registrado no sistema.`,
      });
    }

    if (detail.action === "completed") {
      recordNotification({
        type: "success",
        title: "Chamado concluído",
        message: `${call.name || "O cliente"} foi marcado como concluído com sucesso.`,
      });
    }

    if (detail.action === "deleted") {
      recordNotification({
        type: "warning",
        title: "Chamado removido",
        message: `${call.name || "Um chamado"} foi removido da lista.`,
      });
    }

    refreshDashboard();
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "calls" || event.key === NOTIFICATION_KEY) {
      refreshDashboard();
    }
  });
});
