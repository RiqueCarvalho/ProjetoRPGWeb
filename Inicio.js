const telaInicial = document.getElementById("telaInicial");
const secaoPressStart = document.getElementById("secaoPressStart");
const secaoNome = document.getElementById("secaoNome");
const inputNome = document.getElementById("inputNome");
const btnConfirmarNome = document.getElementById("btnConfirmarNome");
const containerParticulas = document.getElementById("particulas");

let transicaoAtiva = false;

// ==========================================
// REINICIAR A JORNADA
// ==========================================

function reiniciarJogo() {
  // Remove o estado central: moedas, vida, inventário e equipamentos
  localStorage.removeItem("rpg_estado_v1");

  // Remove o saldo do sistema antigo, se existir
  localStorage.removeItem("saldo");

  // Remove o personagem escolhido anteriormente
  localStorage.removeItem("personagemSelecionado");

  // Remove registros de vitória e progresso de arenas/capítulos
  const chavesParaRemover = [];

  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);

    if (/^(arena|capitulo|progresso)/i.test(chave)) {
      chavesParaRemover.push(chave);
    }
  }

  chavesParaRemover.forEach((chave) => {
    localStorage.removeItem(chave);
  });
}

// ==========================================
// MOSTRAR TELA DE IDENTIFICAÇÃO
// ==========================================

function mostrarTelaNome(evento) {
  if (transicaoAtiva) return;

  if (evento.target.closest("#secaoNome")) return;

  transicaoAtiva = true;

  secaoPressStart.style.opacity = "0";

  setTimeout(() => {
    secaoPressStart.classList.add("oculto");
    secaoNome.classList.remove("oculto");
    secaoNome.style.opacity = "1";

    inputNome.focus();
  }, 400);

  document.removeEventListener("keydown", lidarComTecla);
  telaInicial.removeEventListener("click", mostrarTelaNome);
}

function lidarComTecla(evento) {
  if (evento.key === "F5" || evento.key === "F12") return;

  mostrarTelaNome(evento);
}

// ==========================================
// SALVAR NOME E COMEÇAR NOVA JORNADA
// ==========================================

function salvarEAvancar() {
  let nomeJogador = inputNome.value.trim();

  if (nomeJogador === "") {
    nomeJogador = "Guerreiro Anônimo";
  }

  // Reinicia os dados da jornada anterior
  reiniciarJogo();

  // Salva o novo jogador
  localStorage.setItem("jogadorNome", nomeJogador);

  // Transição para a próxima tela
  telaInicial.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "BoasVindas.html";
  }, 800);
}

// ==========================================
// EVENTOS
// ==========================================

document.addEventListener("keydown", lidarComTecla);
telaInicial.addEventListener("click", mostrarTelaNome);

btnConfirmarNome.addEventListener("click", (e) => {
  e.stopPropagation();
  salvarEAvancar();
});

inputNome.addEventListener("keydown", (e) => {
  e.stopPropagation();

  if (e.key === "Enter") {
    salvarEAvancar();
  }
});

// ==========================================
// PARTÍCULAS
// ==========================================

function criarParticulas() {
  for (let i = 0; i < 25; i++) {
    const particula = document.createElement("div");

    particula.classList.add("brilho");
    particula.style.left = `${Math.random() * 100}vw`;
    particula.style.animationDuration = `${4 + Math.random() * 6}s`;
    particula.style.animationDelay = `${Math.random() * 5}s`;

    containerParticulas.appendChild(particula);
  }
}

criarParticulas();
