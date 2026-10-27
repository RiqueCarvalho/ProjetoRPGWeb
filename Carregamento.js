
const progresso = document.getElementById("progresso");
const mago = document.getElementById("mago");
const areaBarra = document.getElementById("areaBarra");
const barra = document.querySelector(".barra");
const texto = document.getElementById("texto");

const duracao = 8000;

let inicio = null;
let concluido = false;

function animarCarregamento(tempo) {
    if (!progresso || !mago || !areaBarra || !barra || !texto) {
        console.error("Confira os elementos do Carregamento.html.");
        return;
    }

    if (inicio === null) {
        inicio = tempo;
    }

    const porcentagem = Math.min(
        (tempo - inicio) / duracao,
        1
    );

    // Atualiza o preenchimento da barra.
    progresso.style.width = `${porcentagem * 100}%`;

    // Calcula a posição do mago dentro da área da barra.
    const larguraBarra = barra.clientWidth;
    const larguraMago = mago.offsetWidth;

    const centro = larguraBarra * porcentagem;

    const posicao = Math.max(
        0,
        Math.min(
            centro - larguraMago / 2,
            larguraBarra - larguraMago
        )
    );

    mago.style.left = `${posicao}px`;

    // Finaliza o carregamento.
    if (porcentagem < 1) {
        requestAnimationFrame(animarCarregamento);
    } else if (!concluido) {
        concluido = true;

        mago.src = "mago-sorrindo.png";
        mago.alt = "Professor mago sorrindo";

        texto.textContent = "A jornada começa agora...";
    }
}

requestAnimationFrame(animarCarregamento);
