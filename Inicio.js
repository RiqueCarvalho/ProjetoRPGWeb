const telaInicial = document.getElementById("telaInicial");
const secaoPressStart = document.getElementById("secaoPressStart");
const secaoNome = document.getElementById("secaoNome");
const inputNome = document.getElementById("inputNome");
const btnConfirmarNome = document.getElementById("btnConfirmarNome");
const containerParticulas = document.getElementById("particulas");

let transicaoAtiva = false;

// Função chamada quando o usuário pressiona qualquer tecla ou clica na tela inicial
function mostrarTelaNome(evento) {
  if (transicaoAtiva) return;

  // Evita conflito se clicar dentro do formulário de nome antes da hora
  if (evento.target.closest('#secaoNome')) return;

  transicaoAtiva = true;

  // Transição suave ocultando o "Press Start" e mostrando o campo de nome
  secaoPressStart.style.opacity = "0";
  setTimeout(() => {
    secaoPressStart.classList.add("oculto");
    secaoNome.classList.remove("oculto");
    secaoNome.style.opacity = "1";

    // Foca automaticamente no campo de texto para digitar
    inputNome.focus();
  }, 400);

  // Remove os ouvintes antigos da tela inicial
  document.removeEventListener("keydown", lidarComTecla);
  telaInicial.removeEventListener("click", mostrarTelaNome);
}

function lidarComTecla(evento) {
  if (evento.key === "F5" || evento.key === "F12") return;
  mostrarTelaNome(evento);
}

// Função para salvar o apelido e ir para a tela de Boas-Vindas
function salvarEAvancar() {
  let nomeJogador = inputNome.value.trim();

  if (nomeJogador === "") {
    nomeJogador = "Guerreiro Anônimo";
  }

  // Salva o nome na memória do navegador
  localStorage.setItem("jogadorNome", nomeJogador);

  // Efeito visual de saída e redirecionamento para a tela de Boas-Vindas
  telaInicial.style.opacity = "0";
  setTimeout(() => {
    window.location.href = "BoasVindas.html";
  }, 800);
}

// Eventos de clique/tecla iniciais
document.addEventListener("keydown", lidarComTecla);
telaInicial.addEventListener("click", mostrarTelaNome);

// Evento ao clicar no botão de confirmar nome
btnConfirmarNome.addEventListener("click", (e) => {
  e.stopPropagation();
  salvarEAvancar();
});

// Evento ao apertar "Enter" dentro do campo de texto
inputNome.addEventListener("keydown", (e) => {
  e.stopPropagation();
  if (e.key === "Enter") {
    salvarEAvancar();
  }
});

// Geração de partículas flutuantes douradas no fundo
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