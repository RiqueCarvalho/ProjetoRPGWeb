const botoes = document.querySelectorAll(".select-button");

const brilhos = [
    document.querySelector(".glow-one"),
    document.querySelector(".glow-two"),
    document.querySelector(".glow-three")
];

const mensagem = document.querySelector(".selection-message");

const nomes = [
    "Arqueiro",
    "Cavaleiro",
    "Guerreiro"
];

// SELEÇÃO DOS PERSONAGENS

botoes.forEach((botao, indice) => {

    botao.addEventListener("click", () => {

        // Limpa a seleção anterior
        botoes.forEach(item => {
            item.classList.remove("active");

            item.querySelector(".button-label").textContent =
                "Selecionar";
        });

        // Remove os brilhos anteriores
        brilhos.forEach(brilho => {
            brilho.classList.remove("active");
        });

        // Ativa o botão escolhido
        botao.classList.add("active");

        botao.querySelector(".button-label").textContent =
            "Selecionado";

        // Acende o brilho correspondente
        brilhos[indice].classList.add("active");

        // Atualiza a mensagem
        mensagem.textContent =
            nomes[indice] + " selecionado!";

        console.log("Personagem escolhido:", nomes[indice]);

    });

});


// BOTÃO VOLTAR

function goBack() {

    if (window.history.length > 1) {
        window.history.back();
    } else {
        mensagem.textContent = "Você está na tela de personagens.";
    }

}