const palco = document.querySelector(".palco");
const cena = document.querySelector(".cena");
const aviso = document.getElementById("aviso");
const botoes = document.querySelectorAll(".selecionar");

// Guarda a altura do palco para as brasas subirem até o topo
function ajustar() {
  palco.style.setProperty("--alt", palco.clientHeight + "px");
}
addEventListener("resize", ajustar);
ajustar();

// Brasas: verdes à esquerda, laranjas no meio e vermelhas à direita
const cores = ["#5ff3d6", "#ffa43a", "#ff4b2e"];
for (let i = 0; i < 32; i++) {
  const b = document.createElement("i");
  b.className = "brasa";
  const x = Math.random() * 100;
  b.style.left = x + "%";
  b.style.setProperty("--c", cores[x < 33 ? 0 : x < 66 ? 1 : 2]);
  b.style.setProperty("--s", 2 + Math.random() * 3 + "px");
  b.style.setProperty("--t", 6 + Math.random() * 8 + "s");
  b.style.setProperty("--a", -Math.random() * 12 + "s");
  b.style.setProperty("--x", Math.random() * 60 - 30 + "px");
  cena.appendChild(b);
}

botoes.forEach((botao) => {
  const id = botao.dataset.id;
  const destacar = () => (palco.dataset.foco = id);
  const apagar = () => delete palco.dataset.foco;
  botao.addEventListener("mouseenter", destacar);
  botao.addEventListener("focus", destacar);
  botao.addEventListener("mouseleave", apagar);
  botao.addEventListener("blur", apagar);

  botao.addEventListener("click", (e) => {
    // Onda saindo do ponto do clique
    const a = botao.getBoundingClientRect();
    const t = Math.max(a.width, a.height);
    const onda = document.createElement("span");
    onda.className = "onda";
    onda.style.cssText = `width:${t}px;height:${t}px;left:${e.clientX - a.left - t / 2}px;top:${e.clientY - a.top - t / 2}px`;
    botao.appendChild(onda);
    onda.addEventListener("animationend", () => onda.remove());

    botoes.forEach((o) => o.classList.remove("ativo"));
    botao.classList.add("ativo");
    palco.dataset.sel = id;
    aviso.textContent = "Você escolheu: " + botao.dataset.nome;
    // Aqui você pode guardar a escolha ou ir para a próxima tela
  });
});

document
  .querySelector(".voltar")
  .addEventListener("click", () => history.back());
