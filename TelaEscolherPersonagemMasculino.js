
const sceneImage = document.getElementById("sceneImage");

const blurredBackground = document.querySelector(
    ".blur-background"
);

const backgroundInput = document.getElementById(
    "backgroundInput"
);

const selectButtons = document.querySelectorAll(
    ".select-button"
);

const pedestalGlows = document.querySelectorAll(
    ".pedestal-glow"
);

const backButton = document.getElementById("backButton");

// Cadastro dos personagens masculinos
const personagens = [
    {
        id: "arqueiro",
        nome: "Arqueiro",
        destino: "./Arqueiro/Arqueiro.html"
    },

    {
        id: "cavaleiro",
        nome: "Cavaleiro",
        destino: "./Cavaleiro/Cavaleiro.html"
    },

    {
        id: "gigante-guerreiro",
        nome: "O Gigante Guerreiro",
        destino: "./GiganteGuerreiro/GiganteGuerreiro.html"
    }
];

// Seleção visual
function selectCharacter(index) {

    selectButtons.forEach((button, i) => {

        const selected = i === index;

        button.classList.toggle("is-selected", selected);

        button.textContent = selected
            ? "◆ Selecionar ◆"
            : "Selecionar";

        button.setAttribute("aria-pressed", selected);
    });

    pedestalGlows.forEach((glow, i) => {

        glow.classList.toggle(
            "is-active",
            i === index
        );

    });
}

// Eventos dos botões
selectButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        const personagem = personagens[index];

        if (!personagem) return;

        selectCharacter(index);

        // Salva a identificação do herói
        localStorage.setItem(
            "personagemSelecionadoId",
            personagem.id
        );

        localStorage.setItem(
            "personagemSelecionadoNome",
            personagem.nome
        );

        // Mantém compatibilidade com o sistema antigo
        localStorage.setItem(
            "heroiSelecionado",
            personagem.nome
        );

        setTimeout(() => {
            window.location.href = personagem.destino;
        }, 350);

    });

});

// Estado visual inicial
selectCharacter(0);

// Escolher imagem de fundo
backgroundInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Escolha um arquivo de imagem válido.");
        return;
    }

    const imageURL = URL.createObjectURL(file);

    sceneImage.src = imageURL;

    if (blurredBackground) {
        blurredBackground.style.backgroundImage =
            `url("${imageURL}")`;
    }

});

// Botão voltar
backButton.addEventListener("click", () => {
    window.location.href = "TelaInicial3.html";
});
