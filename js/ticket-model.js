(function () {
  const STATUSES = {
    aberto: {
      id: "aberto",
      label: "Aberto",
      icon: "🟢",
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.16)",
      isOpen: true,
    },
    "em-analise": {
      id: "em-analise",
      label: "Em análise",
      icon: "🟡",
      color: "#eab308",
      bg: "rgba(234, 179, 8, 0.16)",
      isOpen: true,
    },
    "em-atendimento": {
      id: "em-atendimento",
      label: "Em atendimento",
      icon: "🔵",
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.16)",
      isOpen: true,
    },
    "aguardando-cliente": {
      id: "aguardando-cliente",
      label: "Aguardando cliente",
      icon: "🟠",
      color: "#f97316",
      bg: "rgba(249, 115, 22, 0.16)",
      isOpen: true,
    },
    resolvido: {
      id: "resolvido",
      label: "Resolvido",
      icon: "✅",
      color: "#16a34a",
      bg: "rgba(22, 163, 74, 0.16)",
      isOpen: false,
    },
    fechado: {
      id: "fechado",
      label: "Fechado",
      icon: "⚫",
      color: "#6b7280",
      bg: "rgba(107, 114, 128, 0.16)",
      isOpen: false,
    },
  };

  const PRIORITIES = {
    Baixa: { label: "Baixa", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.18)" },
    Média: { label: "Média", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.16)" },
    Alta: { label: "Alta", color: "#f97316", bg: "rgba(249, 115, 22, 0.16)" },
    Crítica: { label: "Crítica", color: "#ef4444", bg: "rgba(239, 68, 68, 0.16)" },
  };

  const LEGACY_STATUS_MAP = {
    pendente: "aberto",
    concluído: "fechado",
    concluido: "fechado",
  };

  function getCurrentUserName() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.nome || user.name || user.email || "Sistema";
    } catch {
      return "Sistema";
    }
  }

  function migrateStatus(status, completed) {
    if (status && STATUSES[status]) return status;
    if (status && LEGACY_STATUS_MAP[status]) return LEGACY_STATUS_MAP[status];
    if (completed) return "fechado";
    return "aberto";
  }

  function generateTicketNumber() {
    const year = new Date().getFullYear();
    const counter = Number(localStorage.getItem("ticketCounter") || "0") + 1;
    localStorage.setItem("ticketCounter", String(counter));
    return `ZT-${year}-${String(counter).padStart(4, "0")}`;
  }

  function generateId() {
    return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function createTimelineEvent(action, message, by) {
    return {
      at: new Date().toISOString(),
      action,
      message,
      by: by || getCurrentUserName(),
    };
  }

  function normalizeCall(call, index) {
    const status = migrateStatus(call.status, call.completed);
    const priority = PRIORITIES[call.priority] ? call.priority : "Média";
    const ticketNumber =
      call.ticketNumber ||
      `#${String(index + 1).padStart(4, "0")}`;

    const timeline = Array.isArray(call.timeline) ? [...call.timeline] : [];
    if (timeline.length === 0) {
      timeline.push(
        createTimelineEvent(
          "created",
          "Chamado criado",
          call.name || "Cliente",
        ),
      );
      if (status !== "aberto") {
        timeline.push(
          createTimelineEvent(
            "status_changed",
            `Status definido como "${STATUSES[status].label}"`,
          ),
        );
      }
    }

    return {
      ...call,
      id: call.id || generateId(),
      ticketNumber,
      status,
      priority,
      completed: status === "resolvido" || status === "fechado",
      assignedTo: call.assignedTo || null,
      createdAt: call.createdAt || call.date || new Date().toISOString(),
      updatedAt: call.updatedAt || call.createdAt || new Date().toISOString(),
      slaDate: call.slaDate || call.date || null,
      timeline,
    };
  }

  function syncTicketCounter(calls) {
    let max = Number(localStorage.getItem("ticketCounter") || "0");
    calls.forEach((call) => {
      const match = call.ticketNumber?.match(/^ZT-\d{4}-(\d+)$/);
      if (match) max = Math.max(max, Number(match[1]));
    });
    localStorage.setItem("ticketCounter", String(max));
  }

  function normalizeCalls(calls) {
    const normalized = calls.map((call, index) => normalizeCall(call, index));
    syncTicketCounter(normalized);
    return normalized;
  }

  function getStatusConfig(status) {
    return STATUSES[status] || STATUSES.aberto;
  }

  function getPriorityConfig(priority) {
    return PRIORITIES[priority] || PRIORITIES.Média;
  }

  function isOpenStatus(status) {
    return Boolean(STATUSES[status]?.isOpen);
  }

  function formatTimelineTime(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  }

  function appendTimeline(call, action, message, by) {
    const event = createTimelineEvent(action, message, by);
    call.timeline = call.timeline || [];
    call.timeline.push(event);
    call.updatedAt = event.at;
    return event;
  }

  function updateCallStatus(call, newStatus, by) {
    const oldStatus = call.status;
    if (oldStatus === newStatus) return call;

    const oldLabel = getStatusConfig(oldStatus).label;
    const newLabel = getStatusConfig(newStatus).label;

    call.status = newStatus;
    call.completed = newStatus === "resolvido" || newStatus === "fechado";
    appendTimeline(
      call,
      "status_changed",
      `Status alterado de "${oldLabel}" para "${newLabel}"`,
      by,
    );
    return call;
  }

  function assignCall(call, technicianName) {
    call.assignedTo = technicianName || getCurrentUserName();
    appendTimeline(
      call,
      "assigned",
      `Técnico ${call.assignedTo} assumiu o chamado`,
      call.assignedTo,
    );
    if (call.status === "aberto" || call.status === "em-analise") {
      updateCallStatus(call, "em-atendimento", call.assignedTo);
    }
    return call;
  }

  function createTicket(formData) {
    const createdAt = new Date().toISOString();
    const ticketNumber = generateTicketNumber();

    const ticket = {
      id: generateId(),
      ticketNumber,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      priority: formData.priority || "Média",
      subject: formData.subject,
      problem: formData.problem,
      date: formData.slaDate,
      slaDate: formData.slaDate,
      createdAt,
      updatedAt: createdAt,
      status: "aberto",
      completed: false,
      assignedTo: null,
      timeline: [
        createTimelineEvent("created", "Chamado criado", formData.name),
      ],
    };

    return ticket;
  }

  window.TicketModel = {
    STATUSES,
    PRIORITIES,
    STATUS_ORDER: Object.keys(STATUSES),
    PRIORITY_ORDER: Object.keys(PRIORITIES),
    getCurrentUserName,
    normalizeCall,
    normalizeCalls,
    getStatusConfig,
    getPriorityConfig,
    isOpenStatus,
    formatTimelineTime,
    appendTimeline,
    updateCallStatus,
    assignCall,
    createTicket,
    createTimelineEvent,
  };
})();
