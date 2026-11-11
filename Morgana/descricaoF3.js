
const botaoVoltar = document.getElementById("voltar");
const botaoEscolher = document.getElementById("escolher");

// Botão voltar
botaoVoltar.addEventListener("click", () => {
    window.history.back();
});

// Botão escolher
botaoEscolher.addEventListener("click", () => {
    alert("Morgana selecionada! Sua aventura está prestes a começar.");
});
