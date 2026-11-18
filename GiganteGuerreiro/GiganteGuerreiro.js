const btnEscolher = document.getElementById("btnEscolher");

btnEscolher.addEventListener("click", () => {
    // Salva a escolha do personagem no navegador se necessário
    localStorage.setItem("personagemSelecionado", "Arqueiro");

    // Efeito visual de saída e redirecionamento para o carregamento do jogo
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "../Carregamento4.html";
    }, 800);
});