const musicaJornada = document.getElementById("musicaJornada");
const CHAVE_TEMPO_JORNADA = "lastKingdomJornadaMusicTime";

if (musicaJornada) {
  musicaJornada.volume = 0.35;
}

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

function salvarTempoJornada() {
  if (musicaJornada && !Number.isNaN(musicaJornada.currentTime)) {
    sessionStorage.setItem(
      CHAVE_TEMPO_JORNADA,
      String(musicaJornada.currentTime),
    );
  }
}

function tocarMusicaJornada() {
  if (!musicaJornada || !musicaHabilitada()) return;

  musicaJornada.play().catch(() => {
    // Aguarda interação caso o navegador bloqueie o autoplay
  });
}

window.addEventListener("load", tocarMusicaJornada);

document.addEventListener(
  "pointerdown",
  () => {
    if (musicaJornada && musicaJornada.paused && musicaHabilitada()) {
      tocarMusicaJornada();
    }
  },
  { once: true },
);

// Garante que o tempo mais recente fique salvo ao clicar em qualquer botão/link que mude de tela
document.querySelectorAll("button").forEach((botao) => {
  botao.addEventListener("click", salvarTempoJornada);
});

setInterval(() => {
  if (musicaJornada && !musicaJornada.paused) {
    salvarTempoJornada();
  }
}, 250);

window.addEventListener("beforeunload", salvarTempoJornada);
