
const botaoVoltar = document.getElementById("voltar");
const botaoEscolher = document.getElementById("escolher");

// Botão voltar
if (botaoVoltar) {
    botaoVoltar.addEventListener("click", () => {
        window.history.back();
    });
}

// Botão escolher
if (botaoEscolher) {

    botaoEscolher.addEventListener("click", () => {

        // Salva a personagem escolhida
        localStorage.setItem("personagemSelecionado", "Atiradora");
        localStorage.setItem("personagemSelecionadoId", "atiradora");
        localStorage.setItem("personagemSelecionadoNome", "Atiradora");
        localStorage.setItem("heroiSelecionado", "Atiradora");

        // Efeito de transição
        document.body.style.transition = "opacity 0.8s ease";
        document.body.style.opacity = "0";

        // Redireciona para a tela de carregamento 6
        setTimeout(() => {
            window.location.href = "Carregamento6.html";
        }, 800);

    });

}
