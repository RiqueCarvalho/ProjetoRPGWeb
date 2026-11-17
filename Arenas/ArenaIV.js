// ===== Estado do jogo =====
const jogo = {
    heroi: { vida: 120, vidaMax: 120, ataque: 15 },
    inimigo: { vida: 120, vidaMax: 120, ataque: 10 },
    moedas: 0,
    pocoes: 3,
    arena: 1,
    turnoDoJogador: true,
    acabou: false,
};

const $ = (id) => document.getElementById(id);
const arena = $("arena");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const sorteio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ===== Ajudantes de animação =====
// Toca uma classe de animação e remove quando termina, para poder repetir.
function animar(elemento, classe, duracao) {
    elemento.classList.remove(classe);
    void elemento.offsetWidth; // reinicia a animação
    elemento.classList.add(classe);
    return espera(duracao).then(() => elemento.classList.remove(classe));
}

function numeroFlutuante(texto, cor, alvo) {
    const caixa = arena.getBoundingClientRect();
    const r = alvo.getBoundingClientRect();
    const n = document.createElement("div");
    n.className = "flutuante";
    n.textContent = texto;
    n.style.color = cor;
    n.style.left = r.left - caixa.left + r.width / 2 - 20 + "px";
    n.style.top = r.top - caixa.top + 60 + "px";
    arena.appendChild(n);
    setTimeout(() => n.remove(), 1000);
}

function mensagem(texto, tempo = 1500) {
    const m = $("mensagem");
    m.textContent = texto;
    m.classList.add("mostrar");
    setTimeout(() => m.classList.remove("mostrar"), tempo);
}

function atualizarBarras() {
    for (const [quem, id] of [["heroi", "heroi"], ["inimigo", "inimigo"]]) {
        const p = jogo[quem];
        $("barra-" + id).style.width = (p.vida / p.vidaMax) * 100 + "%";
        $("txt-" + id).textContent = `${p.vida}/${p.vidaMax} HP`;
    }
    $("num-moedas").textContent = jogo.moedas;
    $("ataque").textContent = jogo.heroi.ataque;
}

function travarBotoes(travar) {
    $("btn-atacar").disabled = travar;
    $("btn-pocao").disabled = travar || jogo.pocoes === 0;
}

// ===== Ações =====
async function golpe(quem) {
    // quem = "heroi" ou "inimigo"
    const atacante = $(quem);
    const alvoId = quem === "heroi" ? "inimigo" : "heroi";
    const alvo = $(alvoId);

    await animar(atacante, quem === "heroi" ? "ataca-direita" : "ataca-esquerda", 500).catch(() => { });
}

async function atacar() {
    if (!jogo.turnoDoJogador || jogo.acabou) return;
    jogo.turnoDoJogador = false;
    travarBotoes(true);

    // o herói avança; o dano aparece no meio do golpe
    const avanco = golpe("heroi");
    await espera(220);
    const dano = jogo.heroi.ataque + sorteio(-3, 5);
    jogo.inimigo.vida = Math.max(0, jogo.inimigo.vida - dano);
    numeroFlutuante("-" + dano, "#ff5050", $("inimigo"));
    animar($("inimigo"), "tremer", 450);
    atualizarBarras();
    await avanco;

    if (jogo.inimigo.vida === 0) return vitoria();

    await espera(500);
    await turnoDoInimigo();
}

async function turnoDoInimigo() {
    const avanco = golpe("inimigo");
    await espera(220);
    const dano = jogo.inimigo.ataque + sorteio(-2, 4);
    jogo.heroi.vida = Math.max(0, jogo.heroi.vida - dano);
    numeroFlutuante("-" + dano, "#ff5050", $("heroi"));
    animar($("heroi"), "tremer", 450);
    atualizarBarras();
    await avanco;

    if (jogo.heroi.vida === 0) return derrota();

    jogo.turnoDoJogador = true;
    travarBotoes(false);
}

async function usarPocao() {
    if (!jogo.turnoDoJogador || jogo.acabou || jogo.pocoes === 0) return;
    jogo.turnoDoJogador = false;
    travarBotoes(true);

    jogo.pocoes--;
    const cura = Math.min(40, jogo.heroi.vidaMax - jogo.heroi.vida);
    jogo.heroi.vida += cura;
    numeroFlutuante("+" + cura, "#5dff8a", $("heroi"));
    animar($("heroi"), "cura", 900);
    atualizarBarras();
    $("btn-pocao").textContent = `Usar Poção (${jogo.pocoes})`;

    await espera(900);
    await turnoDoInimigo();
}

async function vitoria() {
    jogo.acabou = true;
    const premio = sorteio(10, 25) + jogo.arena * 5;
    jogo.moedas += premio;
    $("moedas").classList.add("pulo");
    setTimeout(() => $("moedas").classList.remove("pulo"), 400);
    animar($("inimigo"), "morrer", 1000);
    await espera(300);
    mensagem(`Vitória! +${premio} moedas`, 2500);
    atualizarBarras();
    $("btn-proxima").style.display = "block";
    travarBotoes(true);
}

async function derrota() {
    jogo.acabou = true;
    $("heroi").classList.remove("respirando");
    animar($("heroi"), "morrer", 1000);
    mensagem("Você caiu em batalha...", 3000);
    travarBotoes(true);
}

async function proximaArena() {
    jogo.arena++;
    jogo.acabou = false;
    jogo.turnoDoJogador = true;
    jogo.inimigo.vidaMax = 120 + (jogo.arena - 1) * 20;
    jogo.inimigo.vida = jogo.inimigo.vidaMax;
    jogo.inimigo.ataque = 10 + (jogo.arena - 1) * 3;
    jogo.heroi.vida = Math.min(jogo.heroi.vidaMax, jogo.heroi.vida + 30);

    $("btn-proxima").style.display = "none";
    const inimigo = $("inimigo");
    inimigo.classList.remove("morrer");
    atualizarBarras();
    await animar(inimigo, "entrar", 800);
    mensagem(`Arena ${jogo.arena}`, 1500);
    travarBotoes(false);
}

function mudarArma() {
    // exemplo simples: cada troca sorteia um novo valor de ataque
    const novo = sorteio(12, 22);
    jogo.heroi.ataque = novo;
    atualizarBarras();
    mensagem(`Nova arma! Ataque ${novo}`, 1500);
}

function fugir() {
    if (confirm("Deseja mesmo fugir da batalha?")) location.reload();
}

// ===== Ligações dos botões =====
$("btn-atacar").addEventListener("click", atacar);
$("btn-pocao").addEventListener("click", usarPocao);
$("btn-proxima").addEventListener("click", proximaArena);
$("btn-arma").addEventListener("click", mudarArma);
$("btn-fugir").addEventListener("click", fugir);

atualizarBarras();
$("btn-pocao").textContent = `Usar Poção (${jogo.pocoes})`;
animar($("inimigo"), "entrar", 800);
mensagem("Prepare-se!", 1200);