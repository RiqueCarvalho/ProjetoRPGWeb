const textoBoasVindas = document.getElementById("textoBoasVindas");
const progresso = document.getElementById("progresso");
const mago = document.getElementById("mago");
const areaBarra = document.getElementById("areaBarra");
const barra = document.querySelector(".barra");
const textoCarregamento = document.getElementById("texto");
const containerParticulas = document.getElementById("particulas");

// 1. Recupera o nome salvo na tela anterior
const nomeJogador = localStorage.getItem("jogadorNome") || "Guerreiro";

// Insere a frase personalizada com o nome digitado
textoBoasVindas.innerHTML = `Seja bem-vindo, <span class="nome-destaque">${nomeJogador}</span>!`;

// 2. Configuração da animação da barra e do mago (duração de 6 segundos)
const duracao = 6000;
let inicio = null;
let concluido = false;

function animarCarregamento(tempo) {
    if (!progresso || !mago || !areaBarra || !barra || !textoCarregamento) return;

    if (inicio === null) {
        inicio = tempo;
    }

    const porcentagem = Math.min((tempo - inicio) / duracao, 1);

    // Atualiza a largura da barra de progresso
    progresso.style.width = `${porcentagem * 100}%`;

    // Calcula a posição exata do mago acompanhando a barra
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

    // Finaliza o carregamento
    if (porcentagem < 1) {
        requestAnimationFrame(animarCarregamento);
    } else if (!concluido) {
        concluido = true;

        // Altera o mago para sorrindo (caso tenha a imagem) e atualiza o texto
        mago.src = "./Imagens/Elementos_gráficos/mago-sorrindo.png";
        mago.alt = "Professor mago sorrindo";
        textoCarregamento.textContent = "O reino está pronto. Entrando...";

        // Redireciona automaticamente para a TelaInicial.html após 1 segundo
        setTimeout(() => {
            document.body.style.transition = "opacity 0.8s ease";
            document.body.style.opacity = "0";

            setTimeout(() => {
                window.location.href = "TelaInicial.html";
            }, 800);
        }, 1000);
    }
}

// Inicia a animação da barra
requestAnimationFrame(animarCarregamento);

// Cria partículas místicas flutuantes no fundo
function criarParticulas() {
    for (let i = 0; i < 30; i++) {
        const particula = document.createElement("div");
        particula.classList.add("brilho");
        particula.style.left = `${Math.random() * 100}vw`;
        particula.style.animationDuration = `${5 + Math.random() * 5}s`;
        particula.style.animationDelay = `${Math.random() * 5}s`;
        containerParticulas.appendChild(particula);
    }
}

criarParticulas();