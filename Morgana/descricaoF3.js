
const botaoVoltar = document.getElementById("voltar");
const botaoEscolher = document.getElementById("escolher");

// Botão voltar
botaoVoltar.addEventListener("click", () => {
    window.history.back();
});

// Botão escolher
setTimeout(() => {
    window.location.href = "Carregamento.html";
}, 800);
