
const btnEscolher = document.getElementById("escolher");

btnEscolher.addEventListener("click", () => {

    // Salva o personagem escolhido
    localStorage.setItem("personagemSelecionado", "Gigante Guerreiro");
    localStorage.setItem("personagemSelecionadoId", "gigante-guerreiro");
    localStorage.setItem("personagemSelecionadoNome", "Gigante Guerreiro");
    localStorage.setItem("heroiSelecionado", "Gigante Guerreiro");

    // Efeito de transição
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    // Vai para a tela de carregamento
    setTimeout(() => {
        window.location.href = "Carregamento4.html";
    }, 800);

});
