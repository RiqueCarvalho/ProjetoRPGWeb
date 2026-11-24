
document.addEventListener("DOMContentLoaded", () => {

    const botaoEscolher = document.getElementById("escolher");

    // Botão escolher personagem
    if (botaoEscolher) {

        botaoEscolher.addEventListener("click", () => {

            // Salva a personagem escolhida
            localStorage.setItem("personagemSelecionado", "A Alquimista");
            localStorage.setItem("personagemSelecionadoId", "alquimista");
            localStorage.setItem("personagemSelecionadoNome", "Alquimista");
            localStorage.setItem("heroiSelecionado", "Alquimista");

            // Efeito de transição
            document.body.style.transition = "opacity 0.8s ease";
            document.body.style.opacity = "0";

            // Redireciona para o carregamento 7
            setTimeout(() => {
                window.location.href = "Carregamento7.html";
            }, 800);

        });

    } else {
        console.error("Botão ESCOLHER não encontrado!");
    }

});
