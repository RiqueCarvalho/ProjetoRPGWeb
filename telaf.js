function selecionarPersonagem(nomeHeroi) {
    console.log(`Personagem selecionado: ${nomeHeroi}`);
    localStorage.setItem('heroiSelecionado', nomeHeroi);
    alert(`Você escolheu a ${nomeHeroi}!`);
}

function voltar() {
    console.log("Voltando para o menu principal...");
    window.location.href = "index.html"; 
}

function selecionarPersonagem(nomeHeroi) {
    // 1. Salva a personagem escolhida na memória do navegador para a outra tela conseguir ler
    localStorage.setItem('heroiSelecionado', nomeHeroi);
    
    console.log(`Personagem selecionada: ${nomeHeroi}`);

    // 2. REDIRECIONAMENTO PARA A TELA DE DESCRIÇÃO
    // Substitua 'descricao.html' pelo nome exato do arquivo HTML que o seu colega está criando
    window.location.href = "descricao.html"; 
}

function voltar() {
    console.log("Voltando para o menu principal...");
    
    // Substitua 'index.html' pelo arquivo da tela anterior (ex: menu ou login)
    window.location.href = "index.html"; 
}