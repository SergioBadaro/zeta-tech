const form = document.getElementById("profileForm");
const successMessage = document.getElementById("successMessage");

const profilePicture = document.getElementById("profilePicture");
const profilePicturePreview = document.getElementById("profilePicturePreview");

const summaryNome = document.getElementById("summaryNome");
const summaryEmail = document.getElementById("summaryEmail");
const summaryPhone = document.getElementById("summaryPhone");
const summaryCargo = document.getElementById("summaryCargo");
const summaryEmpresa = document.getElementById("summaryEmpresa");

const photoUpload = document.getElementById("photoUpload");

const USER_KEY = "user";
const PHOTO_KEY = "profilePhoto";

// =============================
// PEGAR USUÁRIO LOGADO
// =============================
function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY)) || null;
}

// =============================
// PREENCHER PERFIL AUTOMATICAMENTE
// =============================
function loadProfile() {
  const user = getUser();
  if (!user) return;

  // inputs do formulário
  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const telefone = document.getElementById("telefone");
  const cargo = document.getElementById("cargo");
  const empresa = document.getElementById("empresa");

  if (nome) nome.value = user.nome || "";
  if (email) email.value = user.email || "";
  if (telefone) telefone.value = user.telefone || "";
  if (cargo) cargo.value = user.cargo || "";
  if (empresa) empresa.value = user.empresa || "";

  // resumo lateral
  if (summaryNome) summaryNome.textContent = user.nome || "-";
  if (summaryEmail) summaryEmail.textContent = user.email || "-";
  if (summaryPhone) summaryPhone.textContent = user.telefone || "-";
  if (summaryCargo) summaryCargo.textContent = user.cargo || "-";
  if (summaryEmpresa) summaryEmpresa.textContent = user.empresa || "-";
}

// =============================
// ATUALIZAR LOCALSTORAGE
// =============================
function updateUser(data) {
  const current = getUser() || {};
  const updated = { ...current, ...data };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
}

// =============================
// SALVAR PERFIL
// =============================
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const telefone = document.getElementById("telefone")?.value.trim();
  const cargo = document.getElementById("cargo")?.value.trim();
  const empresa = document.getElementById("empresa")?.value.trim();

  if (!nome || !email || !telefone) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  updateUser({ nome, email, telefone, cargo, empresa });

  if (summaryNome) summaryNome.textContent = nome;
  if (summaryEmail) summaryEmail.textContent = email;
  if (summaryPhone) summaryPhone.textContent = telefone;
  if (summaryCargo) summaryCargo.textContent = cargo || "-";
  if (summaryEmpresa) summaryEmpresa.textContent = empresa || "-";

  if (successMessage) {
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 2500);
  }
});

// =============================
// FOTO DE PERFIL
// =============================
function applyPhoto(image) {
  if (profilePicture) profilePicture.src = image;
  if (profilePicturePreview) profilePicturePreview.src = image;
}

photoUpload?.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Selecione uma imagem válida.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const img = e.target.result;

    localStorage.setItem(PHOTO_KEY, img);
    applyPhoto(img);
  };

  reader.readAsDataURL(file);
});

// =============================
// CARREGAR FOTO SALVA
// =============================
function loadPhoto() {
  const photo = localStorage.getItem(PHOTO_KEY);
  if (photo) applyPhoto(photo);
}

// =============================
// ALTERAR FOTO
// =============================
function alterarFoto() {
  photoUpload?.click();
}

// =============================
// INIT
// =============================
loadProfile();
loadPhoto();

// =============================
// SIDEBAR
// =============================
document.getElementById("open_btn")?.addEventListener("click", () => {
  document.getElementById("sidebar")?.classList.toggle("open-sidebar");
});
