(function () {
  const musicaJornada = document.getElementById("musicaJornada");
  const CHAVE_TEMPO_JORNADA = "lastKingdomJornadaMusicTime";

  if (!musicaJornada) return;

  musicaJornada.volume = 0.35;

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
    if (!Number.isNaN(musicaJornada.currentTime)) {
      sessionStorage.setItem(
        CHAVE_TEMPO_JORNADA,
        String(musicaJornada.currentTime),
      );
    }
  }

  function aplicarTempoETocar() {
    if (!musicaHabilitada()) return;

    const tempoSalvo = parseFloat(sessionStorage.getItem(CHAVE_TEMPO_JORNADA));

    if (!Number.isNaN(tempoSalvo) && tempoSalvo > 0) {
      if (!musicaJornada.duration || tempoSalvo < musicaJornada.duration) {
        musicaJornada.currentTime = tempoSalvo;
      }
    }

    musicaJornada.play().catch(() => {
      // Aguarda interação do usuário caso o navegador bloqueie o autoplay
    });
  }

  function iniciarOuRetomarMusica() {
    if (!musicaHabilitada()) return;

    if (musicaJornada.readyState >= 1) {
      aplicarTempoETocar();
    } else {
      musicaJornada.addEventListener("loadedmetadata", aplicarTempoETocar, {
        once: true,
      });
    }
  }

  window.addEventListener("load", iniciarOuRetomarMusica);

  // Garante continuidade também quando o navegador restaura a página do cache (botão voltar/avançar)
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      iniciarOuRetomarMusica();
    }
  });

  document.addEventListener(
    "pointerdown",
    () => {
      if (musicaJornada.paused && musicaHabilitada()) {
        aplicarTempoETocar();
      }
    },
    { once: true },
  );

  // Salva o tempo antes de qualquer clique que navegue para outra tela
  document.addEventListener("click", salvarTempoJornada, true);

  // Atualiza continuamente o tempo enquanto toca
  setInterval(() => {
    if (!musicaJornada.paused) {
      salvarTempoJornada();
    }
  }, 200);

  window.addEventListener("beforeunload", salvarTempoJornada);
  window.addEventListener("pagehide", salvarTempoJornada);
})();
