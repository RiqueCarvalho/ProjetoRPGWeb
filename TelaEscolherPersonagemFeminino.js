
function selecionarPersonagem(nomeHeroi) {

  const personagens = {
    "Alquimista": {
      id: "alquimista",
      nome: "Alquimista",
      destino: "TelaDiscricaoF.html"
    },

    "Bruxa": {
      id: "bruxa",
      nome: "Bruxa",
      destino: "./Morgana/descricaoF3.html"
    },

    "Atiradora": {
      id: "atiradora",
      nome: "Atiradora",
      destino: "./Pistoleira/descricaoF.html"
    }
  };

  const personagem = personagens[nomeHeroi];

  if (!personagem) {
    console.error("Personagem não encontrado:", nomeHeroi);
    return;
  }

  // Salva a escolha do jogador
  localStorage.setItem(
    "personagemSelecionadoId",
    personagem.id
  );

  localStorage.setItem(
    "personagemSelecionadoNome",
    personagem.nome
  );

  // Mantém compatibilidade com o sistema anterior
  localStorage.setItem(
    "heroiSelecionado",
    personagem.nome
  );

  window.location.href = personagem.destino;
}

function voltar() {
  window.location.href = "TelaInicial3.html";
}
