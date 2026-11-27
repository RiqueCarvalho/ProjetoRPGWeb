
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // CONFIGURAÇÕES PADRÃO
  // ==========================================

  const defaults = {
    sfx: false,
    music: false,
    brightness: "Claro",
    fullscreen: false,
  };

  let settings = { ...defaults };

  try {

    const saved = localStorage.getItem("lastKingdomSettings");

    if (saved) {
      settings = { ...defaults, ...JSON.parse(saved) };
    }

  } catch (error) {

    console.warn("Erro ao carregar configurações.", error);

  }

  let originalSettings = { ...settings };

  // ==========================================
  // ELEMENTOS
  // ==========================================

  const toggleButtons = document.querySelectorAll(".toggle");
  const brightnessButton = document.getElementById("brightnessButton");
  const fullscreenCheckbox = document.getElementById("fullscreen");
  const darkOverlay = document.querySelector(".dark-overlay");
  const message = document.getElementById("message");

  const musica = document.getElementById("musicaMedieval");

  const CHAVE_TEMPO_MUSICA = "lastKingdomMusicTime";

  if (musica) {
    musica.volume = 0.35;
  }

  let messageTimeout;

  // ==========================================
  // CONTROLE DA MÚSICA
  // ==========================================

  function iniciarMusica() {

    if (!musica || !settings.music) return;

    musica.play().catch(() => {
      // Aguarda interação do usuário para iniciar o áudio
    });

  }

  function pausarMusica() {

    if (!musica) return;

    musica.pause();

  }

  function syncMusic() {

    if (!musica) return;

    if (settings.music) {
      iniciarMusica();
    } else {
      pausarMusica();
    }

  }

  // Recupera o tempo salvo da música anterior
  if (musica) {

    musica.addEventListener("loadedmetadata", () => {

      const tempoSalvo =
        Number(sessionStorage.getItem(CHAVE_TEMPO_MUSICA)) || 0;

      if (
        tempoSalvo > 0 &&
        Number.isFinite(musica.duration) &&
        tempoSalvo < musica.duration
      ) {

        musica.currentTime = tempoSalvo;

      }

      iniciarMusica();

    });

    // Salva a posição enquanto a música toca
    setInterval(() => {

      if (
        !musica.paused &&
        !Number.isNaN(musica.currentTime)
      ) {

        sessionStorage.setItem(
          CHAVE_TEMPO_MUSICA,
          String(musica.currentTime)
        );

      }

    }, 250);

    // Salva antes de sair da página
    window.addEventListener("beforeunload", () => {

      if (!Number.isNaN(musica.currentTime)) {

        sessionStorage.setItem(
          CHAVE_TEMPO_MUSICA,
          String(musica.currentTime)
        );

      }

    });

  }

  // ==========================================
  // ATUALIZAÇÃO VISUAL DAS CONFIGURAÇÕES
  // ==========================================

  function renderSettings() {

    // Atualiza botões SFX e Música
    toggleButtons.forEach((button) => {

      const key = button.dataset.setting;

      button.textContent = settings[key] ? "Ligado" : "Desligado";

      button.setAttribute(
        "aria-pressed",
        settings[key]
      );

    });

    // Atualiza brilho
    if (brightnessButton) {
      brightnessButton.textContent = settings.brightness;
    }

    // Atualiza tela cheia
    if (fullscreenCheckbox) {
      fullscreenCheckbox.checked = Boolean(document.fullscreenElement);
    }

    // Aplica opacidade do brilho
    const brightness = {
      Claro: 0.15,
      Normal: 0.4,
      Escuro: 0.65,
    };

    if (darkOverlay) {

      darkOverlay.style.background =
        `rgba(5, 6, 13, ${brightness[settings.brightness] ?? 0.15})`;

    }

    // Sincroniza música
    syncMusic();

  }

  // ==========================================
  // BOTÕES SFX E MÚSICA
  // ==========================================

  toggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const key = button.dataset.setting;

      settings[key] = !settings[key];

      renderSettings();

    });

  });

  // Tenta iniciar música após interação
  document.addEventListener("click", () => {

    if (settings.music && musica && musica.paused) {
      iniciarMusica();
    }

  }, { once: true });

  document.addEventListener("keydown", () => {

    if (settings.music && musica && musica.paused) {
      iniciarMusica();
    }

  }, { once: true });

  // ==========================================
  // BRILHO
  // ==========================================

  if (brightnessButton) {

    brightnessButton.addEventListener("click", () => {

      const levels = ["Claro", "Normal", "Escuro"];

      const index = levels.indexOf(settings.brightness);

      settings.brightness = levels[(index + 1) % levels.length];

      renderSettings();

    });

  }

  // ==========================================
  // TELA CHEIA
  // ==========================================

  if (fullscreenCheckbox) {

    fullscreenCheckbox.addEventListener("change", async () => {

      try {

        if (fullscreenCheckbox.checked) {

          await document.documentElement.requestFullscreen();

        } else if (document.fullscreenElement) {

          await document.exitFullscreen();

        }

      } catch (error) {

        showMessage("Tela cheia indisponível neste navegador.");

      }

      renderSettings();

    });

  }

  document.addEventListener("fullscreenchange", () => {

    settings.fullscreen = Boolean(document.fullscreenElement);

    if (fullscreenCheckbox) {
      fullscreenCheckbox.checked = settings.fullscreen;
    }

    renderSettings();

  });

  // ==========================================
  // MENSAGENS FLUTUANTES
  // ==========================================

  function showMessage(text) {

    if (!message) return;

    message.textContent = text;

    message.classList.remove("hidden");

    clearTimeout(messageTimeout);

    messageTimeout = setTimeout(() => {

      message.classList.add("hidden");

    }, 2200);

  }

  // ==========================================
  // SALVAR CONFIGURAÇÕES
  // ==========================================

  const saveButton = document.getElementById("saveButton");

  if (saveButton) {

    saveButton.addEventListener("click", () => {

      try {

        localStorage.setItem(
          "lastKingdomSettings",
          JSON.stringify(settings)
        );

        originalSettings = { ...settings };

        showMessage("Configurações salvas com sucesso!");

      } catch (error) {

        showMessage("Erro ao salvar configurações.");

      }

    });

  }

  // ==========================================
  // CANCELAR ALTERAÇÕES
  // ==========================================

  const cancelButton = document.getElementById("cancelButton");

  if (cancelButton) {

    cancelButton.addEventListener("click", async () => {

      settings = { ...originalSettings };

      try {

        if (
          settings.fullscreen &&
          !document.fullscreenElement
        ) {

          await document.documentElement.requestFullscreen();

        } else if (
          !settings.fullscreen &&
          document.fullscreenElement
        ) {

          await document.exitFullscreen();

        }

      } catch (error) {

        console.warn("Não foi possível restaurar a tela cheia.");

      }

      renderSettings();

      showMessage("Alterações descartadas.");

    });

  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================

  renderSettings();

});
