document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cardsContainer");
  const sidebar = document.getElementById("sidebar");
  const openBtn = document.getElementById("open_btn");
  const openBtnIcon = document.getElementById("open_btn_icon");

  // Função para carregar os chamados do localStorage
  function loadCalls() {
    const calls = JSON.parse(localStorage.getItem("calls") || "[]");

    // Limpa o container antes de carregar os novos cards
    cardsContainer.innerHTML = "";

    calls.forEach((call, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      if (call.completed) {
        card.classList.add("completed");
      }

      card.innerHTML = `
        <p><strong>Nome:</strong> ${call.name}</p>
        <p><strong>Telefone:</strong> ${call.phone}</p>
        <p><strong>Email:</strong> ${call.email}</p>
        <p><strong>Problema:</strong> ${call.problem}</p>
        <p class="sla-timer">SLA: ${new Date(call.slaDate).toLocaleString()}</p>
      `;

      // Cria a div que vai conter os botões
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("card-buttons");

      // Botão de concluir
      const completeButton = document.createElement("button");
      completeButton.textContent = "Concluir";
      completeButton.classList.add("complete-btn");
      completeButton.addEventListener("click", () => completeCall(index, card));

      // Botão de deletar
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Deletar";
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => deleteCall(index));

      // Adiciona os botões ao container
      buttonContainer.appendChild(completeButton);
      buttonContainer.appendChild(deleteButton);

      // Adiciona o container de botões ao card
      card.appendChild(buttonContainer);

      // Adiciona o card ao container de cards
      cardsContainer.appendChild(card);
    });
  }

  // Função para concluir um chamado
  function completeCall(index, cardElement) {
    const calls = JSON.parse(localStorage.getItem("calls") || "[]");
    calls[index].completed = true;
    localStorage.setItem("calls", JSON.stringify(calls));

    // Atualiza a aparência do card
    cardElement.classList.add("completed");
  }

  // Função para deletar um chamado
  function deleteCall(index) {
    const calls = JSON.parse(localStorage.getItem("calls") || "[]");
    calls.splice(index, 1);
    localStorage.setItem("calls", JSON.stringify(calls));
    loadCalls();
  }

  // Função para alternar o menu lateral
  openBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open-sidebar");

    if (openBtnIcon.classList.contains("fa-chevron-left")) {
      openBtnIcon.classList.replace("fa-chevron-left", "fa-chevron-right");
    } else {
      openBtnIcon.classList.replace("fa-chevron-right", "fa-chevron-left");
    }
  });

  // Carregar chamados ao iniciar
  loadCalls();
});
