const form = document.getElementById("profileForm");
const successMessage = document.getElementById("successMessage");
const photoUpload = document.getElementById("photoUpload");
const profilePicture = document.getElementById("profilePicture");

function carregarFotoSalva() {
  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto) {
    profilePicture.src = savedPhoto;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
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
      localStorage.setItem("profilePhoto", imageData);
      photoUpload.value = "";
    };

    reader.readAsDataURL(file);
  });
}

function alterarFoto() {
  photoUpload.click();
}

carregarFotoSalva();

// principal.js
document.getElementById("open_btn").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("open-sidebar");
});
