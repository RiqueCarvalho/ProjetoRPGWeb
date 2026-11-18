// =====================================
// ELEMENTOS DA TELA
// =====================================

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


// =====================================
// ROTAS DOS PERSONAGENS
// =====================================

const characterRoutes = [
    "./Arqueiro/Arqueiro.html",
    "./Cavaleiro/Cavaleiro.html",
    "./GiganteGuerreiro/GiganteGuerreiro.html"
];


// =====================================
// SELEÇÃO DE PERSONAGENS
// =====================================

function selectCharacter(index) {

    // Atualiza todos os botões
    selectButtons.forEach((button, i) => {

        const selected = i === index;

        button.classList.toggle(
            "is-selected",
            selected
        );

        button.textContent = selected
            ? "◆ Selecionar ◆"
            : "Selecionar";

        button.setAttribute(
            "aria-pressed",
            selected
        );
    });


    // Atualiza o brilho dos pedestais
    pedestalGlows.forEach((glow, i) => {

        glow.classList.toggle(
            "is-active",
            i === index
        );

    });

}


// Adiciona o evento aos três personagens
selectButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        selectCharacter(index);

        const destination = characterRoutes[index];

        if (destination) {
            // Aguarda 350ms para mostrar o brilho no pedestal antes de abrir a tela
            setTimeout(() => {
                window.location.href = destination;
            }, 350);
        }

    });

});


// Começa com o primeiro personagem selecionado
selectCharacter(0);


// =====================================
// ESCOLHER IMAGEM DO COMPUTADOR
// =====================================

backgroundInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // Verifica se o arquivo é uma imagem
    if (!file.type.startsWith("image/")) {

        alert("Escolha um arquivo de imagem válido.");

        return;
    }

    // Cria um endereço temporário para a imagem
    const imageURL = URL.createObjectURL(file);

    // Atualiza o cenário principal
    sceneImage.src = imageURL;

    // Atualiza o fundo desfocado (caso exista no HTML)
    if (blurredBackground) {
        blurredBackground.style.backgroundImage =
            `url("${imageURL}")`;
    }

});


// =====================================
// BOTÃO DE VOLTAR
// =====================================

backButton.addEventListener("click", () => {
    window.location.href = "TelaInicial3.html";
});
