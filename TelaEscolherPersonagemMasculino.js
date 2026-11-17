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
            ? "◆ Selecionado ◆"
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

    // Atualiza o fundo desfocado
    blurredBackground.style.backgroundImage =
        `url("${imageURL}")`;

});


// =====================================
// BOTÃO DE VOLTAR
// =====================================

backButton.addEventListener("click", () => {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        // Altere para o nome da sua tela anterior
        window.location.href = "menu.html";

    }

});