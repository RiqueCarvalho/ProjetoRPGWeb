
const botaoVoltar = document.getElementById("voltar");
const botaoEscolher = document.getElementById("escolher");

// Botão voltar
botaoVoltar.addEventListener("click", () => {
    window.history.back();
});

// Botão escolher
botaoEscolher.addEventListener("click", () => {

    // Salva a personagem escolhida
    localStorage.setItem("personagemSelecionado", "Morgana");

    // Efeito de transição
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    // Redireciona para a tela de carregamento 5
    setTimeout(() => {
        window.location.href = "Carregamento6.html";
    }, 800);

});
