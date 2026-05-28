// principal.js
document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});

// chamado.js
const form = document.getElementById("callForm");
const modal = document.getElementById("modal");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const calls = JSON.parse(localStorage.getItem("calls") || "[]");
  const createdAt = new Date().toISOString();
  const slaDate = calculateSLA(document.getElementById("date").value);

  calls.push({
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    problem: document.getElementById("problem").value,
    date: slaDate,
    slaDate: slaDate,
    createdAt: createdAt,
    status: "pendente",
    completed: false,
  });

  localStorage.setItem("calls", JSON.stringify(calls));
  modal.style.display = "flex";
  form.reset();
});

function calculateSLA(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 3);
  return date.toISOString().split("T")[0];
}
