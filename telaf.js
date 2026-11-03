function selecionarPersonagem(nomeHeroi) {
    console.log(`Personagem selecionado: ${nomeHeroi}`);
    localStorage.setItem('heroiSelecionado', nomeHeroi);
    alert(`Você escolheu a ${nomeHeroi}!`);
    // window.location.href = "batalha.html"; // Descomente quando criar a tela de batalha
}

function voltar() {
    console.log("Voltando para o menu principal...");
    // Coloque aqui o arquivo para onde a setinha deve voltar (ex: "index.html")
    window.location.href = "index.html"; 
}