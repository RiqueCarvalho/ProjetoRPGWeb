
const novoJogo = document.getElementById("novoJogo");
const creditos = document.getElementById("creditos");
const configuracoes = document.getElementById("configuracoes");

novoJogo.addEventListener("click", () => {
    alert(
        "The Last Kingdom\n\n" +
        "Prepare-se para a aventura!\n" +
        "A tela de escolha de personagens será conectada em breve."
    );
});

creditos.addEventListener("click", () => {
    alert(
        "THE LAST KINGDOM\n\n" +
        "Desenvolvido pela equipe do projeto."
    );
});

configuracoes.addEventListener("click", () => {
    alert(
        "CONFIGURAÇÕES\n\n" +
        "As opções de personalização estarão disponíveis em breve."
    );
});
