function selecionarPersonagem(nomeHeroi) {
  console.log(`Personagem selecionado: ${nomeHeroi}`);

  // Salva o personagem na memória (útil para a tela de batalha depois)
  localStorage.setItem("heroiSelecionado", nomeHeroi);

  // Redireciona cada personagem para a sua própria tela
  if (nomeHeroi === "Alquimista") {
    window.location.href = "TelaDiscricaoF.html";
  } else if (nomeHeroi === "Bruxa") {
    window.location.href = "./Morgana/descricaoF3.html"; // <-- Troque pelo nome real do arquivo da Bruxa
  } else if (nomeHeroi === "Atiradora") {
    window.location.href = "./Pistoleira/descricaoF.html"; // <-- Troque pelo nome real do arquivo da Atiradora
  }
}

function voltar() {
  console.log("Voltando para o menu principal...");
  window.location.href = "TelaInicial3.html";
}
