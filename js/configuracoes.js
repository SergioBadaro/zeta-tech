const SETTINGS_KEY = 'zetaTechSettings';

const controls = {
  slaAlerts: document.getElementById('slaAlerts'),
  dailySummary: document.getElementById('dailySummary'),
  whatsappBanner: document.getElementById('whatsappBanner'),
  persistPreferences: document.getElementById('persistPreferences'),
  showInsights: document.getElementById('showInsights'),
  responseSpeed: document.getElementById('responseSpeed'),
  contactChannel: document.getElementById('contactChannel'),
  teamMode: document.getElementById('teamMode')
};

const alertCount = document.getElementById('alertCount');
const channelValue = document.getElementById('channelValue');
const responseValue = document.getElementById('responseValue');
const privacyValue = document.getElementById('privacyValue');
const saveSettingsButton = document.getElementById('saveSettings');
const resetSettingsButton = document.getElementById('resetSettings');
const executivePanel = document.getElementById('executivePanel');
const executiveChannelValue = document.getElementById('executiveChannelValue');
const executiveResponseValue = document.getElementById('executiveResponseValue');
const executiveTeamValue = document.getElementById('executiveTeamValue');
const executivePriorityValue = document.getElementById('executivePriorityValue');
const executiveMomentumValue = document.getElementById('executiveMomentumValue');
const executiveRiskValue = document.getElementById('executiveRiskValue');

const defaultSettings = {
  slaAlerts: true,
  dailySummary: true,
  whatsappBanner: true,
  persistPreferences: true,
  showInsights: true,
  responseSpeed: 'padrao',
  contactChannel: 'Whatsapp',
  teamMode: 'operacao'
};

const formatResponse = (value) => {
  const labels = {
    rapido: 'Rápido',
    padrao: 'Padrão',
    equilibrado: 'Equilibrado'
  };

  return labels[value] || 'Padrão';
};

const formatMode = (value) => {
  const labels = {
    operacao: 'Operação ativa',
    atendimento: 'Atendimento humano',
    prioridade: 'Prioridade máxima'
  };

  return labels[value] || 'Operação ativa';
};

const updateExecutiveContext = (settings) => {
  const responseLabel = formatResponse(settings.responseSpeed);
  const channelLabel = settings.contactChannel;
  const modeLabel = formatMode(settings.teamMode);
  const activeAlerts = [settings.slaAlerts, settings.dailySummary, settings.whatsappBanner].filter(Boolean).length;

  executiveChannelValue.textContent = channelLabel;
  executiveResponseValue.textContent = responseLabel;
  executiveTeamValue.textContent = modeLabel;
  executivePriorityValue.textContent = modeLabel;
  executiveMomentumValue.textContent = responseLabel;
  executiveRiskValue.textContent = activeAlerts >= 2 ? 'Risco sensível' : 'Risco controlado';

  if (executivePanel) {
    executivePanel.style.display = settings.showInsights ? 'block' : 'none';
  }
};

const updateSummary = (settings) => {
  const activeAlerts = [settings.slaAlerts, settings.dailySummary, settings.whatsappBanner].filter(Boolean).length;
  alertCount.textContent = activeAlerts;
  channelValue.textContent = settings.contactChannel;
  responseValue.textContent = formatResponse(settings.responseSpeed);
  privacyValue.textContent = settings.persistPreferences ? 'Persistindo' : 'Local apenas';
  updateExecutiveContext(settings);
};

const applySettings = (settings) => {
  Object.entries(controls).forEach(([key, element]) => {
    if (element.type === 'checkbox') {
      element.checked = Boolean(settings[key]);
    } else if (element.tagName === 'SELECT') {
      element.value = settings[key];
    }
  });

  updateSummary(settings);
};

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      applySettings(defaultSettings);
      return;
    }

    const parsed = JSON.parse(stored);
    applySettings({ ...defaultSettings, ...parsed });
  } catch (error) {
    console.error('Erro ao carregar configurações', error);
    applySettings(defaultSettings);
  }
};

const saveSettings = () => {
  const currentSettings = Object.fromEntries(
    Object.entries(controls).map(([key, element]) => [
      key,
      element.type === 'checkbox' ? element.checked : element.value
    ])
  );

  if (currentSettings.persistPreferences) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
    updateSummary(currentSettings);
    saveSettingsButton.textContent = 'Preferências salvas';
    setTimeout(() => {
      saveSettingsButton.textContent = 'Salvar preferências';
    }, 2200);
    return;
  }

  localStorage.removeItem(SETTINGS_KEY);
  updateSummary(currentSettings);
  saveSettingsButton.textContent = 'Preferências temporárias';
  setTimeout(() => {
    saveSettingsButton.textContent = 'Salvar preferências';
  }, 2200);
};

const resetSettings = () => {
  applySettings(defaultSettings);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  resetSettingsButton.textContent = 'Padrão restaurado';
  setTimeout(() => {
    resetSettingsButton.textContent = 'Restaurar padrão';
  }, 2200);
};

saveSettingsButton.addEventListener('click', saveSettings);
resetSettingsButton.addEventListener('click', resetSettings);

document.getElementById('open_btn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open-sidebar');
});

loadSettings();
