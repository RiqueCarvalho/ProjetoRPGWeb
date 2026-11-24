const musica = document.getElementById("musicaMedieval");

if (musica) {
  musica.volume = 0.35;
}

// Verifica se a música está habilitada nas configurações salvas
function musicaHabilitada() {
  try {
    const saved = localStorage.getItem("lastKingdomSettings");
    if (!saved) return true; // Se nunca salvou configurações, toca por padrão
    const parsed = JSON.parse(saved);
    return parsed.music !== false;
  } catch (error) {
    return true;
  }
}

function iniciarMusica() {
  if (!musica || !musicaHabilitada()) return;

  musica.play().catch(() => {
    // Aguarda interação do usuário se o navegador bloquear o autoplay
  });
}

// Tenta tocar ao abrir a tela de créditos
window.addEventListener("load", iniciarMusica);

// Garante que comece no primeiro clique caso o navegador bloqueie o load
document.addEventListener(
  "click",
  () => {
    if (musica && musica.paused) {
      iniciarMusica();
    }
  },
  { once: true },
);
