const progresso = document.getElementById("progresso");
const mago = document.getElementById("mago");
const areaBarra = document.getElementById("areaBarra");
const barra = document.querySelector(".barra");
const texto = document.getElementById("texto");
const musica = document.getElementById("musicaMedieval");

const duracao = 8000; // 8 segundos de carregamento
const CHAVE_TEMPO_MUSICA = "lastKingdomMusicTime";

let inicio = null;
let concluido = false;

// Verifica se a música está habilitada nas configurações (se houver)
function musicaHabilitada() {
  try {
    const saved = localStorage.getItem("lastKingdomSettings");
    if (!saved) return true;
    const parsed = JSON.parse(saved);
    return parsed.music !== false;
  } catch (error) {
    return true;
  }
}

function retomarMusicaNaSequencia() {
  if (!musica || !musicaHabilitada()) return;

  musica.volume = 0.35;

  const tempoSalvo = parseFloat(sessionStorage.getItem(CHAVE_TEMPO_MUSICA));
  const aplicarTempoETocar = () => {
    if (!Number.isNaN(tempoSalvo) && tempoSalvo > 0) {
      // Garante que o tempo não ultrapasse a duração caso o arquivo seja curto
      if (musica.duration && tempoSalvo < musica.duration) {
        musica.currentTime = tempoSalvo;
      } else if (!musica.duration) {
        musica.currentTime = tempoSalvo;
      }
    }

    musica.play().catch(() => {
      // Se o navegador exigir novo gesto do usuário, toca no primeiro clique/tecla
    });
  };

  if (musica.readyState >= 1) {
    aplicarTempoETocar();
  } else {
    musica.addEventListener("loadedmetadata", aplicarTempoETocar, {
      once: true,
    });
  }
}

// Salva continuamente o tempo atual para a próxima tela (ex.: TelaInicial2.html)
setInterval(() => {
  if (musica && !musica.paused && !Number.isNaN(musica.currentTime)) {
    sessionStorage.setItem(CHAVE_TEMPO_MUSICA, String(musica.currentTime));
  }
}, 250);

window.addEventListener("beforeunload", () => {
  if (musica && !Number.isNaN(musica.currentTime)) {
    sessionStorage.setItem(CHAVE_TEMPO_MUSICA, String(musica.currentTime));
  }
});

// Caso o navegador bloqueie o autoplay na troca de página, retoma na primeira interação
document.addEventListener(
  "pointerdown",
  () => {
    if (musica && musica.paused && musicaHabilitada()) {
      musica.play().catch(() => {});
    }
  },
  { once: true },
);

retomarMusicaNaSequencia();

function animarCarregamento(tempo) {
  if (!progresso || !mago || !areaBarra || !barra || !texto) {
    console.error("Confira os elementos do Carregamento.html.");
    return;
  }

  if (inicio === null) {
    inicio = tempo;
  }

  const porcentagem = Math.min((tempo - inicio) / duracao, 1);

  // Atualiza o preenchimento da barra
  progresso.style.width = `${porcentagem * 100}%`;

  // Calcula a posição do mago
  const larguraBarra = barra.clientWidth;
  const larguraMago = mago.offsetWidth;
  const centro = larguraBarra * porcentagem;

  const posicao = Math.max(
    0,
    Math.min(centro - larguraMago / 2, larguraBarra - larguraMago),
  );

  mago.style.left = `${posicao}px`;

  // Finaliza o carregamento
  if (porcentagem < 1) {
    requestAnimationFrame(animarCarregamento);
  } else if (!concluido) {
    concluido = true;

    mago.src = "./Imagens/Elementos_gráficos/mago-sorrindo.png";
    mago.alt = "Professor mago sorrindo";

    texto.textContent = "A jornada começa agora...";

    // Redireciona automaticamente para a TelaInicial2.html após 1 segundo
    setTimeout(() => {
      if (musica && !Number.isNaN(musica.currentTime)) {
        sessionStorage.setItem(CHAVE_TEMPO_MUSICA, String(musica.currentTime));
      }
      window.location.href = "TelaInicial2.html";
    }, 1000);
  }
}

requestAnimationFrame(animarCarregamento);
