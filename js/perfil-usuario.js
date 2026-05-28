const form = document.getElementById("profileForm");
const successMessage = document.getElementById("successMessage");
const photoUpload = document.getElementById("photoUpload");
const profilePicture = document.getElementById("profilePicture");
const profilePicturePreview = document.getElementById("profilePicturePreview");
const summaryEmail = document.getElementById("summaryEmail");
const summaryPhone = document.getElementById("summaryPhone");

const PROFILE_KEY = "profileData";

function carregarFotoSalva() {
  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto) {
    profilePicture.src = savedPhoto;
    profilePicturePreview.src = savedPhoto;
  }
}

function carregarDadosSalvos() {
  const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");

  Object.entries(savedProfile).forEach(([field, value]) => {
    const input = document.getElementById(field);
    if (input && value) {
      input.value = value;
    }
  });

  if (savedProfile.email) {
    summaryEmail.textContent = savedProfile.email;
  }

  if (savedProfile.telefone) {
    summaryPhone.textContent = savedProfile.telefone;
  }
}

function atualizarResumo() {
  const campos = {
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
  };

  if (campos.email) {
    summaryEmail.textContent = campos.email;
  }

  if (campos.telefone) {
    summaryPhone.textContent = campos.telefone;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const profileData = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    cargo: document.getElementById("cargo").value,
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
  atualizarResumo();

  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
});

if (photoUpload) {
  photoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      photoUpload.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const imageData = loadEvent.target.result;
      profilePicture.src = imageData;
      profilePicturePreview.src = imageData;
      localStorage.setItem("profilePhoto", imageData);
      photoUpload.value = "";
    };

    reader.readAsDataURL(file);
  });
}

function alterarFoto() {
  photoUpload.click();
}

["nome", "email", "telefone", "cargo"].forEach((field) => {
  const element = document.getElementById(field);
  if (element) {
    element.addEventListener("input", atualizarResumo);
  }
});

carregarFotoSalva();
carregarDadosSalvos();

// principal.js
document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});
