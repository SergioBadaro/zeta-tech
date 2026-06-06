document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cardsContainer");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("call-search");
  const statusFilter = document.getElementById("call-status-filter");
  const priorityFilter = document.getElementById("call-priority-filter");
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open_btn");
  const openBtnIcon = document.getElementById("open_btn_icon");

  function getCalls() {
    const storedCalls = JSON.parse(localStorage.getItem("calls") || "[]");
    const calls = TicketModel.normalizeCalls(storedCalls);
    localStorage.setItem("calls", JSON.stringify(calls));
    return calls;
  }

  function saveCalls(calls) {
    localStorage.setItem("calls", JSON.stringify(calls));
  }

  function findCallIndex(calls, id) {
    return calls.findIndex((call) => call.id === id);
  }

  function dispatchUpdate(action, call) {
    window.dispatchEvent(
      new CustomEvent("callsUpdated", {
        detail: { action, call },
      }),
    );
  }

  function renderStatusTag(status) {
    const config = TicketModel.getStatusConfig(status);
    return `<span class="status-tag status-${status}">${config.icon} ${config.label}</span>`;
  }

  function renderPriorityTag(priority) {
    const config = TicketModel.getPriorityConfig(priority);
    return `<span class="priority-tag priority-${priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}" style="background:${config.bg};color:${config.color};">${config.label}</span>`;
  }

  function renderTimeline(timeline) {
    if (!timeline || timeline.length === 0) {
      return '<p class="timeline-empty">Nenhum evento registrado.</p>';
    }

    return timeline
      .slice()
      .reverse()
      .map(
        (event) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-time">${TicketModel.formatTimelineTime(event.at)}</span>
            <span class="timeline-message">${event.message}</span>
            ${event.by ? `<span class="timeline-by">${event.by}</span>` : ""}
          </div>
        </div>
      `,
      )
      .join("");
  }

  function renderStatusSelect(call) {
    const options = TicketModel.STATUS_ORDER.map((statusId) => {
      const config = TicketModel.getStatusConfig(statusId);
      const selected = call.status === statusId ? "selected" : "";
      return `<option value="${statusId}" ${selected}>${config.icon} ${config.label}</option>`;
    }).join("");

    return `
      <label class="action-field">
        <span>Alterar status</span>
        <select class="status-select" data-call-id="${call.id}">
          ${options}
        </select>
      </label>
    `;
  }

  function loadCalls() {
    const calls = getCalls();
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    const filteredCalls = calls.filter((call) => {
      const searchableText = [
        call.ticketNumber,
        call.name,
        call.phone,
        call.email,
        call.subject,
        call.category,
        call.problem,
        call.status,
        call.priority,
        call.assignedTo,
        TicketModel.getStatusConfig(call.status).label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);

      let matchesStatus = true;
      if (selectedStatus === "open") {
        matchesStatus = TicketModel.isOpenStatus(call.status);
      } else if (selectedStatus === "closed") {
        matchesStatus = !TicketModel.isOpenStatus(call.status);
      } else if (selectedStatus !== "all") {
        matchesStatus = call.status === selectedStatus;
      }

      const matchesPriority =
        selectedPriority === "all" || call.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    cardsContainer.innerHTML = "";

    if (filteredCalls.length === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    filteredCalls.forEach((call) => {
      const card = document.createElement("article");
      card.classList.add("card", `card-status-${call.status}`);
      card.dataset.id = call.id;

      const slaDate = call.slaDate || call.date;
      const formattedSla = slaDate
        ? new Date(slaDate).toLocaleDateString("pt-BR")
        : "Não informado";
      const problemSummary = call.problem || "Sem descrição registrada";
      const subjectLine = call.subject
        ? `<p class="call-subject-line">${call.subject}</p>`
        : "";

      card.innerHTML = `
        <div class="card-header">
          <div class="card-summary-main">
            <div class="card-summary-top">
              <div class="card-badges">
                <span class="ticket-number">${call.ticketNumber}</span>
                ${renderStatusTag(call.status)}
                ${renderPriorityTag(call.priority)}
              </div>
              <span class="card-time">${call.createdAt ? new Date(call.createdAt).toLocaleString("pt-BR") : "Data não informada"}</span>
            </div>
            ${subjectLine}
            <p class="call-summary-line">${problemSummary}</p>
          </div>

          <button class="call-toggle" type="button" aria-expanded="false" aria-label="Expandir detalhes">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>

        <div class="card-details">
          <div class="card-form-grid">
            <div class="card-field">
              <span class="field-label">Nome</span>
              <div class="field-value">${call.name || "Cliente sem nome"}</div>
            </div>

            <div class="card-field">
              <span class="field-label">Telefone</span>
              <div class="field-value">${call.phone || "Telefone não informado"}</div>
            </div>

            <div class="card-field">
              <span class="field-label">E-mail</span>
              <div class="field-value">${call.email || "E-mail não informado"}</div>
            </div>

            <div class="card-field">
              <span class="field-label">Categoria</span>
              <div class="field-value">${call.category || "Não informada"}</div>
            </div>

            <div class="card-field">
              <span class="field-label">Técnico responsável</span>
              <div class="field-value">${call.assignedTo || "Não atribuído"}</div>
            </div>

            <div class="card-field">
              <span class="field-label">SLA</span>
              <div class="field-value">${formattedSla}</div>
            </div>

            <div class="card-field card-field-message">
              <span class="field-label">Mensagem registrada</span>
              <div class="field-value message-preview">${problemSummary}</div>
            </div>
          </div>

          <div class="timeline-section">
            <h4 class="timeline-title"><i class="fas fa-clock-rotate-left"></i> Histórico do chamado</h4>
            <div class="timeline-list">${renderTimeline(call.timeline)}</div>
          </div>

          <div class="card-actions">
            ${renderStatusSelect(call)}
          </div>

          <div class="card-footer">
            <p class="sla-timer">Prazo de atendimento: ${formattedSla}</p>
          </div>
        </div>
      `;

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("card-buttons");

      if (!call.assignedTo && TicketModel.isOpenStatus(call.status)) {
        const assignButton = document.createElement("button");
        assignButton.textContent = "👤 Assumir";
        assignButton.classList.add("assign-btn");
        assignButton.addEventListener("click", () => assignCall(call.id));
        buttonContainer.appendChild(assignButton);
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "✕ Remover";
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => deleteCall(call.id));
      buttonContainer.appendChild(deleteButton);

      card.querySelector(".card-details").appendChild(buttonContainer);

      const statusSelect = card.querySelector(".status-select");
      statusSelect.addEventListener("change", (event) => {
        changeStatus(call.id, event.target.value);
      });

      const toggleButton = card.querySelector(".call-toggle");
      const details = card.querySelector(".card-details");
      const cardHeader = card.querySelector(".card-header");

      const toggleDetails = () => {
        const isExpandedNow = !details.classList.contains("expanded");
        details.classList.toggle("expanded", isExpandedNow);
        toggleButton.classList.toggle("expanded", isExpandedNow);
        toggleButton.setAttribute("aria-expanded", String(isExpandedNow));
      };

      toggleButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDetails();
      });

      cardHeader.addEventListener("click", (event) => {
        if (event.target !== toggleButton && !toggleButton.contains(event.target)) {
          toggleDetails();
        }
      });

      cardsContainer.appendChild(card);
    });
  }

  function changeStatus(callId, newStatus) {
    const calls = getCalls();
    const index = findCallIndex(calls, callId);
    if (index === -1) return;

    TicketModel.updateCallStatus(calls[index], newStatus);
    saveCalls(calls);
    dispatchUpdate("status_changed", calls[index]);
    loadCalls();
  }

  function assignCall(callId) {
    const calls = getCalls();
    const index = findCallIndex(calls, callId);
    if (index === -1) return;

    TicketModel.assignCall(calls[index]);
    saveCalls(calls);
    dispatchUpdate("assigned", calls[index]);
    loadCalls();
  }

  function deleteCall(callId) {
    const calls = getCalls();
    const index = findCallIndex(calls, callId);
    if (index === -1) return;

    const removedCall = calls[index];
    calls.splice(index, 1);
    saveCalls(calls);
    dispatchUpdate("deleted", removedCall);
    loadCalls();
  }

  searchInput.addEventListener("input", loadCalls);
  statusFilter.addEventListener("change", loadCalls);
  priorityFilter.addEventListener("change", loadCalls);

  openBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open-sidebar");

    if (openBtnIcon.classList.contains("fa-chevron-left")) {
      openBtnIcon.classList.replace("fa-chevron-left", "fa-chevron-right");
    } else {
      openBtnIcon.classList.replace("fa-chevron-right", "fa-chevron-left");
    }
  });

  loadCalls();
});
