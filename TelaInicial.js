// Sincroniza o nome do jogador
const spanNome = document.getElementById("nomeJogadorExibido");
const nomeSalvo = localStorage.getItem("jogadorNome") || "Aventureiro";
spanNome.textContent = nomeSalvo;

// Controle da música medieval
const musica = document.getElementById("musicaMedieval");
const btnMusica = document.getElementById("btnMusica");

musica.volume = 0.35; // Volume ambiente agradável (de 0.0 a 1.0)
let tocando = false;

function iniciarMusica() {
  musica
    .play()
    .then(() => {
      tocando = true;
      btnMusica.textContent = "🔊 Música";
    })
    .catch(() => {
      // Aguarda interação do usuário se o navegador bloquear autoplay
    });
}

function pausarMusica() {
  musica.pause();
  tocando = false;
  btnMusica.textContent = "🔇 Música";
}

// Alterna ao clicar no botão de música
btnMusica.addEventListener("click", (e) => {
  e.stopPropagation(); // Evita conflito com o clique geral da página
  if (tocando) {
    pausarMusica();
  } else {
    iniciarMusica();
  }
});

// Tenta tocar assim que a página carregar; se bloquear, inicia no primeiro clique na tela
window.addEventListener("load", iniciarMusica);

document.addEventListener(
  "click",
  () => {
    if (!tocando) {
      iniciarMusica();
    }
  },
  { once: true },
);

const CHAVE_TEMPO_MUSICA = "lastKingdomMusicTime";

// Salva o tempo da música periodicamente e ao navegar para outra tela
setInterval(() => {
  if (musica && !musica.paused && !Number.isNaN(musica.currentTime)) {
    sessionStorage.setItem(CHAVE_TEMPO_MUSICA, String(musica.currentTime));
  }
}, 250);

const btnNovoJogo = document.getElementById("novoJogo");
if (btnNovoJogo) {
  btnNovoJogo.addEventListener("click", () => {
    if (musica && !Number.isNaN(musica.currentTime)) {
      sessionStorage.setItem(CHAVE_TEMPO_MUSICA, String(musica.currentTime));
    }
  });
}

window.addEventListener("beforeunload", () => {
  if (musica && !Number.isNaN(musica.currentTime)) {
    sessionStorage.setItem(CHAVE_TEMPO_MUSICA, String(musica.currentTime));
  }
});
