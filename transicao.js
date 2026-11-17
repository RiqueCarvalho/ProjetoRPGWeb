const overlay = document.createElement("div");
overlay.className = "transicao-bau";
document.body.appendChild(overlay);

const DURACAO = 400;

function entrar() {
  sessionStorage.removeItem("transicaoAbrindo");
  overlay.classList.add("sem-transicao", "ativo");
  void overlay.offsetWidth;
  overlay.classList.remove("sem-transicao");
  requestAnimationFrame(() => overlay.classList.remove("ativo"));
}

function sair(acao) {
  if (overlay.classList.contains("ativo")) return; // evita clique duplo
  overlay.classList.add("ativo");
  sessionStorage.setItem("transicaoAbrindo", "1");
  setTimeout(acao, DURACAO + 100);
}

window.transicaoNavegar = (url) =>
  sair(() => {
    location.href = url;
  });
window.transicaoVoltar = () => sair(() => history.back());

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", entrar, { once: true });
} else {
  entrar();
}

// Ao voltar com o botão "voltar" do navegador (página vem do cache)
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    sessionStorage.removeItem("transicaoAbrindo");
    overlay.classList.remove("ativo");
  }
});
