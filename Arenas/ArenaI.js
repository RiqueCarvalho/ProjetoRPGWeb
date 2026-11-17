const p1 = document.getElementById("personagem1");
const p2 = document.getElementById("personagem2");

const vida1 = document.getElementById("vida1");
const vida2 = document.getElementById("vida2");

const textoVida1 = document.getElementById("textoVida1");
const textoVida2 = document.getElementById("textoVida2");
const mensagem = document.getElementById("mensagem");

const botaoAtacar = document.getElementById("atacar");
const botaoEsquivar = document.getElementById("esquivar");
const botaoReiniciar = document.getElementById("reiniciar");

let hp1 = 100;
let hp2 = 100;
let esquiva1 = false;
let esquiva2 = false;
let ocupado = false;

function atualizarVida() {
    vida1.style.width = hp1 + "%";
    vida2.style.width = hp2 + "%";

    textoVida1.textContent = hp1 + " HP";
    textoVida2.textContent = hp2 + " HP";

    vida1.style.background = hp1 <= 30 ? "#ff4545" : "#39dc72";
    vida2.style.background = hp2 <= 30 ? "#ff4545" : "#39dc72";
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function atacar(atacante, defensor, numero) {
    if (ocupado || hp1 <= 0 || hp2 <= 0) return;

    ocupado = true;
    botaoAtacar.disabled = true;
    botaoEsquivar.disabled = true;

    const nomeAtacante = numero === 1 ? "Herói" : "Monstro";
    const nomeDefensor = numero === 1 ? "Monstro" : "Herói";
    const classeAtaque = numero === 1 ? "atacando1" : "atacando2";
    const classeDano = "dano";

    mensagem.textContent = nomeAtacante + " atacou!";

    atacante.classList.add(classeAtaque);

    await esperar(250);

    const defensorEsquivou = numero === 1 ? esquiva2 : esquiva1;

    if (defensorEsquivou) {
        mensagem.textContent = nomeDefensor + " esquivou do golpe!";
    } else {
        const dano = Math.floor(Math.random() * 16) + 10;

        if (numero === 1) {
            hp2 = Math.max(0, hp2 - dano);
        } else {
            hp1 = Math.max(0, hp1 - dano);
        }

        defensor.classList.add(classeDano);
        atualizarVida();

        mensagem.textContent =
            nomeAtacante + " acertou " + nomeDefensor +
            " e causou " + dano + " de dano!";

        await esperar(300);
        defensor.classList.remove(classeDano);
    }

    atacante.classList.remove(classeAtaque);

    esquiva1 = false;
    esquiva2 = false;

    if (hp1 <= 0 || hp2 <= 0) {
        mensagem.textContent = hp1 <= 0
            ? "O Monstro venceu a batalha!"
            : "O Herói venceu a batalha!";

        ocupado = true;
        return;
    }

    ocupado = false;
    botaoAtacar.disabled = false;
    botaoEsquivar.disabled = false;

    // O monstro também toma decisões e ataca sozinho.
    await esperar(500);

    if (!ocupado && hp1 > 0 && hp2 > 0) {
        await atacar(p2, p1, 2);
    }
}

botaoAtacar.addEventListener("click", () => {
    atacar(p1, p2, 1);
});

botaoEsquivar.addEventListener("click", async () => {
    if (ocupado || hp1 <= 0 || hp2 <= 0) return;

    ocupado = true;
    esquiva1 = true;

    p1.classList.add("esquivando1");
    mensagem.textContent = "Você tentou esquivar!";

    botaoAtacar.disabled = true;
    botaoEsquivar.disabled = true;

    await esperar(500);

    p1.classList.remove("esquivando1");
    ocupado = false;

    // O monstro tenta atacar depois da esquiva.
    await atacar(p2, p1, 2);
});

botaoReiniciar.addEventListener("click", () => {
    hp1 = 100;
    hp2 = 100;
    esquiva1 = false;
    esquiva2 = false;
    ocupado = false;

    p1.className = "personagem";
    p2.className = "personagem";

    botaoAtacar.disabled = false;
    botaoEsquivar.disabled = false;

    mensagem.textContent = "A batalha vai começar!";
    atualizarVida();
});

atualizarVida();