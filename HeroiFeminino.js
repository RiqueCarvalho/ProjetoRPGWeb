function selecionarPersonagem(nomeHeroi) {
  console.log(`Personagem selecionado: ${nomeHeroi}`);
  localStorage.setItem("heroiSelecionado", nomeHeroi);
  alert(`Você escolheu a ${nomeHeroi}!`);
}

function voltar() {
  console.log("Voltando para o menu principal...");
  window.location.href = "index.html";
}
