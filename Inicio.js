const telaInicial = document.getElementById("telaInicial");
const textoStart = document.getElementById("textoStart");
const containerParticulas = document.getElementById("particulas");

// Defina aqui para qual arquivo o jogo deve ir após pressionar a tecla
const proximaTela = "TelaInicial.html";

// Cria o elemento de áudio (substitua 'transforme.mp3' pelo nome exato do seu arquivo de som)
const somTransformacao = new Audio("Arrival to Earth (Film Version) - Transformers (The Expanded Score).mp3");
somTransformacao.volume = 0.7; // Volume de 0 a 1

let jogoIniciado = false;

function iniciarJogo() {
  if (jogoIniciado) return;
  jogoIniciado = true;

  // Feedback visual imediato
  textoStart.style.animation = "none";
  textoStart.textContent = "Entrando no reino...";
  textoStart.style.color = "#d4af37";

  // Toca o áudio dos Transformers no momento do clique/tecla
  somTransformacao.play().catch((error) => {
    console.log(
      "O navegador impediu o autoplay do som até haver interação, mas o clique liberou:",
      error,
    );
  });

  // Aplica o efeito de transição suave
  telaInicial.classList.add("iniciando");

  // Aguarda o som tocar um pouco e o fade-out terminar (800ms) antes de mudar de página
  setTimeout(() => {
    window.location.href = proximaTela;
  }, 800);
}

// Detecta qualquer tecla pressionada no teclado
document.addEventListener("keydown", (evento) => {
  if (evento.key === "F5" || evento.key === "F12") return;
  iniciarJogo();
});

// Detecta clique do mouse ou toque na tela
telaInicial.addEventListener("click", iniciarJogo);

// Gera partículas douradas flutuando no fundo
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
