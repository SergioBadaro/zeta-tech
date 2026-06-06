// principal.js
document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});

// chamado.js
const form = document.getElementById("callForm");
const modal = document.getElementById("modal");
const dateInput = document.getElementById("date");

function setCurrentDate() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  dateInput.value = formattedDate;
}

setCurrentDate();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const calls = JSON.parse(localStorage.getItem("calls") || "[]");
  const createdAt = new Date().toISOString();
  const slaDate = calculateSLA(dateInput.value);

  const newCall = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    subject: document.getElementById("subject").value,
    problem: document.getElementById("problem").value,
    date: slaDate,
    slaDate: slaDate,
    createdAt: createdAt,
    status: "pendente",
    completed: false,
  };

  calls.push(newCall);

  localStorage.setItem("calls", JSON.stringify(calls));
  window.dispatchEvent(
    new CustomEvent("callsUpdated", {
      detail: {
        action: "created",
        call: newCall,
      },
    })
  );
  modal.style.display = "flex";
  form.reset();
  setCurrentDate();
});

function calculateSLA(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 3);
  return date.toISOString().split("T")[0];
}
