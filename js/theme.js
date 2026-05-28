const THEME_KEY = 'zetaTechTheme';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

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

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
};

window.toggleTheme = toggleTheme;

document.addEventListener('DOMContentLoaded', initTheme);
