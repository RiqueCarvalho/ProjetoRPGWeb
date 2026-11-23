
const btnEscolher = document.getElementById("btnEscolher");

btnEscolher.addEventListener("click", () => {

    // Salva o personagem escolhido
    localStorage.setItem("personagemSelecionado", "Arqueiro");

    // Efeito visual de saída
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    // Redireciona para o carregamento
    setTimeout(() => {
        window.location.href = "Carregamento2.html";
    }, 800);

});
