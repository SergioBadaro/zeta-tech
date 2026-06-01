const THEME_KEY = 'zetaTechTheme';
const PROFILE_PHOTO_KEY = 'profilePhoto';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const applyProfilePhoto = (imageData) => {
  if (!imageData) {
    return;
  }

  document.querySelectorAll('#logo_img').forEach((img) => {
    img.src = imageData;
  });

  const profilePicture = document.getElementById('profilePicture');
  const profilePicturePreview = document.getElementById('profilePicturePreview');

  if (profilePicture) {
    profilePicture.src = imageData;
  }

  if (profilePicturePreview) {
    profilePicturePreview.src = imageData;
  }
};

const syncProfilePhoto = () => {
  const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);

  if (savedPhoto) {
    applyProfilePhoto(savedPhoto);
  }
};

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;

  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
  }

  localStorage.setItem(THEME_KEY, theme);
};

const toggleTheme = () => {
  const currentTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
};

const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);
  syncProfilePhoto();

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
};

window.applyProfilePhoto = applyProfilePhoto;
window.toggleTheme = toggleTheme;

window.addEventListener('storage', (event) => {
  if (event.key === PROFILE_PHOTO_KEY && event.newValue) {
    applyProfilePhoto(event.newValue);
  }
});

document.addEventListener('DOMContentLoaded', initTheme);
