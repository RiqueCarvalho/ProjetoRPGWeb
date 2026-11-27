
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // MÚSICA MEDIEVAL - CRÉDITOS
  // ==========================================

  const musica = document.getElementById("musicaMedieval");
  const CHAVE_TEMPO_MUSICA = "lastKingdomMusicTime";

  if (!musica) return;

  musica.volume = 0.35;

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

  function iniciarMusica() {

    if (!musicaHabilitada()) return;

    musica.play().catch(() => {
      // Aguarda interação do usuário se o navegador bloquear o autoplay
    });

  }

  // Recupera a posição da música anterior
  musica.addEventListener("loadedmetadata", () => {

    const tempoSalvo =
      Number(sessionStorage.getItem(CHAVE_TEMPO_MUSICA)) || 0;

    if (
      tempoSalvo > 0 &&
      Number.isFinite(musica.duration) &&
      tempoSalvo < musica.duration
    ) {
      musica.currentTime = tempoSalvo;
    }

    iniciarMusica();

  });

  // Tenta tocar ao abrir a tela
  window.addEventListener("load", iniciarMusica);

  // Tenta iniciar após interação caso o navegador bloqueie
  document.addEventListener("click", () => {
    if (musica.paused) {
      iniciarMusica();
    }
  }, { once: true });

  document.addEventListener("keydown", () => {
    if (musica.paused) {
      iniciarMusica();
    }
  }, { once: true });

  // Salva o tempo periodicamente
  setInterval(() => {

    if (!musica.paused && !Number.isNaN(musica.currentTime)) {

      sessionStorage.setItem(
        CHAVE_TEMPO_MUSICA,
        String(musica.currentTime)
      );

    }

  }, 250);

  // Salva antes de sair da tela
  window.addEventListener("beforeunload", () => {

    if (!Number.isNaN(musica.currentTime)) {

      sessionStorage.setItem(
        CHAVE_TEMPO_MUSICA,
        String(musica.currentTime)
      );

    }

  });

});
