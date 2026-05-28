document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cardsContainer");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("call-search");
  const statusFilter = document.getElementById("call-status-filter");
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open_btn");
  const openBtnIcon = document.getElementById("open_btn_icon");

  function normalizeCalls(calls) {
    return calls.map((call) => ({
      ...call,
      createdAt: call.createdAt || call.date || new Date().toISOString(),
      completed: Boolean(call.completed),
      status: call.status || (Boolean(call.completed) ? "concluído" : "pendente"),
      slaDate: call.slaDate || call.date || null,
    }));
  }

  function loadCalls() {
    const storedCalls = JSON.parse(localStorage.getItem("calls") || "[]");
    const calls = normalizeCalls(storedCalls);
    localStorage.setItem("calls", JSON.stringify(calls));

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredCalls = calls.filter((call) => {
      const searchableText = [
        call.name,
        call.phone,
        call.email,
        call.problem,
        call.status,
        call.slaDate,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "open" && call.status === "pendente") ||
        (selectedStatus === "completed" && call.status === "concluído");

      return matchesSearch && matchesStatus;
    });

    cardsContainer.innerHTML = "";

    if (filteredCalls.length === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    filteredCalls.forEach((call) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const originalIndex = calls.indexOf(call);
      card.dataset.index = originalIndex;

      const statusClass = call.completed ? "completed" : "pending";
      card.classList.add(statusClass);

      const statusLabel = call.completed ? "Concluído" : "Pendente";
      const slaDate = call.slaDate || call.date;
      const formattedSla = slaDate ? new Date(slaDate).toLocaleDateString("pt-BR") : "Não informado";

      card.innerHTML = `
        <div class="card-header">
          <div>
            <p class="card-client-name">${call.name || "Cliente sem nome"}</p>
            <p class="card-client-meta">${call.phone || "Telefone não informado"} • ${call.email || "E-mail não informado"}</p>
          </div>
          <span class="status-tag ${statusClass}">${statusLabel}</span>
        </div>

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
            <span class="field-label">SLA</span>
            <div class="field-value">${formattedSla}</div>
          </div>

          <div class="card-field card-field-message">
            <span class="field-label">Mensagem registrada</span>
            <div class="field-value message-preview">${call.problem || "Sem descrição registrada"}</div>
          </div>
        </div>

        <div class="card-footer">
          <p class="sla-timer">Prazo de atendimento: ${formattedSla}</p>
          <p class="card-time">${call.createdAt ? new Date(call.createdAt).toLocaleString("pt-BR") : "Data não informada"}</p>
        </div>
      `;

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("card-buttons");

      const completeButton = document.createElement("button");
      completeButton.textContent = "Concluir";
      completeButton.classList.add("complete-btn");
      completeButton.addEventListener("click", () => completeCall(Number(card.dataset.index), card));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Deletar";
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => deleteCall(Number(card.dataset.index)));

      buttonContainer.appendChild(completeButton);
      buttonContainer.appendChild(deleteButton);

      card.appendChild(buttonContainer);
      cardsContainer.appendChild(card);
    });
  }

  function completeCall(index, cardElement) {
    const calls = JSON.parse(localStorage.getItem("calls") || "[]");
    calls[index].completed = true;
    calls[index].status = "concluído";
    localStorage.setItem("calls", JSON.stringify(calls));
    window.dispatchEvent(
      new CustomEvent("callsUpdated", {
        detail: {
          action: "completed",
          call: calls[index],
        },
      })
    );

    cardElement.classList.remove("pending");
    cardElement.classList.add("completed");

    const statusTag = cardElement.querySelector(".status-tag");
    if (statusTag) {
      statusTag.textContent = "Concluído";
      statusTag.classList.remove("pending");
      statusTag.classList.add("completed");
    }
  }

  function deleteCall(index) {
    const calls = JSON.parse(localStorage.getItem("calls") || "[]");
    const removedCall = calls[index];
    calls.splice(index, 1);
    localStorage.setItem("calls", JSON.stringify(calls));
    window.dispatchEvent(
      new CustomEvent("callsUpdated", {
        detail: {
          action: "deleted",
          call: removedCall,
        },
      })
    );
    loadCalls();
  }

  searchInput.addEventListener("input", loadCalls);
  statusFilter.addEventListener("change", loadCalls);

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
