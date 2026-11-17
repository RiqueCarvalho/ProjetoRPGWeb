const defaults = {
    sfx: false,
    music: false,
    brightness: "Claro",
    fullscreen: false
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

const toggleButtons = document.querySelectorAll(".toggle");
const brightnessButton = document.getElementById("brightnessButton");
const fullscreenCheckbox = document.getElementById("fullscreen");
const darkOverlay = document.querySelector(".dark-overlay");
const message = document.getElementById("message");

let messageTimeout;

function renderSettings() {
    // Atualiza os botões de ligar/desligar (SFX e Música)
    toggleButtons.forEach(button => {
        const key = button.dataset.setting;
        button.textContent = settings[key] ? "Ligado" : "Desligado";
        button.setAttribute("aria-pressed", settings[key]);
    });

    // Atualiza o texto do botão de brilho
    if (brightnessButton) {
        brightnessButton.textContent = settings.brightness;
    }

    // Sincroniza o switch de tela cheia
    if (fullscreenCheckbox) {
        fullscreenCheckbox.checked = Boolean(document.fullscreenElement);
    }

    // Aplica a opacidade de brilho no overlay escuro
    const brightness = {
        Claro: 0.15,
        Normal: 0.40,
        Escuro: 0.65
    };

    if (darkOverlay) {
        darkOverlay.style.background = `rgba(5, 6, 13, ${brightness[settings.brightness] ?? 0.15})`;
    }
}

// SFX e Música: alterna entre ligado e desligado.
toggleButtons.forEach(button => {
    button.addEventListener("click", () => {
        const key = button.dataset.setting;
        settings[key] = !settings[key];
        renderSettings();
    });
});

// Alterna o brilho (Claro -> Normal -> Escuro).
if (brightnessButton) {
    brightnessButton.addEventListener("click", () => {
        const levels = ["Claro", "Normal", "Escuro"];
        const index = levels.indexOf(settings.brightness);

        settings.brightness = levels[(index + 1) % levels.length];

        renderSettings();
    });
}

// Tela cheia via switch.
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

// Sistema de mensagens flutuantes de feedback.
function showMessage(text) {
    if (!message) return;
    message.textContent = text;
    message.classList.remove("hidden");

    clearTimeout(messageTimeout);

    messageTimeout = setTimeout(() => {
        message.classList.add("hidden");
    }, 2200);
}

// Salvar configurações no localStorage.
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

// Cancelar alterações e restaurar o último estado salvo.
const cancelButton = document.getElementById("cancelButton");
if (cancelButton) {
    cancelButton.addEventListener("click", async () => {
        settings = { ...originalSettings };

        try {
            if (settings.fullscreen && !document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else if (!settings.fullscreen && document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.warn("Não foi possível restaurar a tela cheia.");
        }

        renderSettings();
        showMessage("Alterações descartadas.");
    });
}

// Inicialização da tela ao carregar
renderSettings();