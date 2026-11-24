
const btnEscolher = document.getElementById("btnEscolher");

btnEscolher.addEventListener("click", () => {

    // Salva o personagem escolhido
    localStorage.setItem("personagemSelecionado", "Cavaleiro");
    localStorage.setItem("personagemSelecionadoId", "cavaleiro");
    localStorage.setItem("personagemSelecionadoNome", "Cavaleiro");
    localStorage.setItem("heroiSelecionado", "Cavaleiro");

    // Efeito visual de saída
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    // Vai para a tela de carregamento
    setTimeout(() => {
        window.location.href = "Carregamento3.html";
    }, 800);

});
