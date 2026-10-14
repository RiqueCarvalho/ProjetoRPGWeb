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

const modal = document.getElementById("infoModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const message = document.getElementById("message");

let messageTimeout;

function renderSettings() {
    toggleButtons.forEach(button => {
        const key = button.dataset.setting;
        button.textContent = settings[key] ? "Ligado" : "Desligado";
        button.setAttribute("aria-pressed", settings[key]);
    });

    brightnessButton.textContent = settings.brightness;

    fullscreenCheckbox.checked =
        Boolean(document.fullscreenElement);

    const brightness = {
        Claro: 0.28,
        Normal: 0.48,
        Escuro: 0.68
    };

    darkOverlay.style.background =
        `rgba(0, 0, 0, ${brightness[settings.brightness] ?? 0.28})`;
}

// SFX e música: alterna entre ligado e desligado.
toggleButtons.forEach(button => {
    button.addEventListener("click", () => {
        const key = button.dataset.setting;
        settings[key] = !settings[key];
        renderSettings();
    });
});

// Alterna o brilho.
brightnessButton.addEventListener("click", () => {
    const levels = ["Claro", "Normal", "Escuro"];
    const index = levels.indexOf(settings.brightness);

    settings.brightness = levels[(index + 1) % levels.length];

    renderSettings();
});

// Tela cheia.
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

document.addEventListener("fullscreenchange", () => {
    settings.fullscreen = Boolean(document.fullscreenElement);
    renderSettings();
});

// Janelas Sobre e Créditos.
function openModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.remove("hidden");
}

document.getElementById("aboutButton").addEventListener("click", () => {
    openModal(
        "Sobre",
        "The Last Kingdom\n\nConfigurações do jogo."
    );
});

document.getElementById("creditsButton").addEventListener("click", () => {
    openModal(
        "Créditos",
        "Desenvolvimento: Time terceiro DS\nArte: De algum canto ai\nObrigado por jogar!"
    );
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

// Mensagens.
function showMessage(text) {
    message.textContent = text;
    message.classList.remove("hidden");

    clearTimeout(messageTimeout);

    messageTimeout = setTimeout(() => {
        message.classList.add("hidden");
    }, 2200);
}

// Salvar configurações.
document.getElementById("saveButton").addEventListener("click", () => {
    try {
        localStorage.setItem(
            "lastKingdomSettings",
            JSON.stringify(settings)
        );

        originalSettings = { ...settings };
        showMessage("Configurações salvas!");
    } catch (error) {
        showMessage("Erro ao salvar configurações.");
    }
});

// Cancelar alterações e voltar ao último estado salvo.
document.getElementById("cancelButton").addEventListener("click", async () => {
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
});

// Inicialização.
renderSettings();