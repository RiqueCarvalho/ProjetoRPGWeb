
const botaoVoltar = document.getElementById("voltar");
const botaoEscolher = document.getElementById("escolher");
const botoesHabilidades = document.querySelectorAll(".habilidade");

botaoVoltar.addEventListener("click", () => {
    window.history.back();
});

botoesHabilidades.forEach((botao) => {
    botao.addEventListener("click", () => {
        const habilidade = botao.dataset.info;
        alert(habilidade + " — em breve!");
    });
});

botaoEscolher.addEventListener("click", () => {
    alert("Personagem selecionada! Sua aventura está prestes a começar.");
});
