const botaoEscolher = document.getElementById("botaoEscolher");
const botaoVoltar = document.getElementById("botaoVoltar");

const botoesOpcoes = document.querySelectorAll(".opcao");
const mensagem = document.getElementById("mensagem");

let personagemSelecionado = false;
let temporizadorMensagem;


// =====================================
// EXIBIR MENSAGENS
// =====================================

function mostrarMensagem(texto) {

    mensagem.textContent = texto;

    mensagem.classList.add("visivel");

    clearTimeout(temporizadorMensagem);

    temporizadorMensagem = setTimeout(() => {

        mensagem.classList.remove("visivel");

    }, 2500);

}


// =====================================
// ESCOLHER PERSONAGEM
// =====================================

botaoEscolher.addEventListener("click", () => {

    personagemSelecionado = !personagemSelecionado;

    if (personagemSelecionado) {

        botaoEscolher.textContent = "Selecionado!";

        botaoEscolher.classList.add("selecionado");

        mostrarMensagem("Ragnar selecionado!");

    } else {

        botaoEscolher.textContent = "Escolher";

        botaoEscolher.classList.remove("selecionado");

        mostrarMensagem("Seleção cancelada.");

    }

    window.dispatchEvent(

        new CustomEvent("ragnar:selection", {

            detail: {
                personagem: "ragnar",
                selecionado: personagemSelecionado
            }

        })

    );

});


// =====================================
// OPÇÕES DO PERSONAGEM
// =====================================

botoesOpcoes.forEach((botao) => {

    botao.addEventListener("click", () => {

        const menu = botao.dataset.menu;

        const nomes = {

            habilidades: "Árvore de habilidades",

            armas: "Troca de arma",

            estilos: "Troca de estilo"

        };

        mostrarMensagem(nomes[menu]);

        window.dispatchEvent(

            new CustomEvent("ragnar:open-menu", {

                detail: {

                    personagem: "ragnar",

                    menu: menu

                }

            })

        );

    });

});


// =====================================
// BOTÃO VOLTAR
// =====================================

botaoVoltar.addEventListener("click", () => {

    window.dispatchEvent(

        new CustomEvent("ragnar:back")

    );

    mostrarMensagem("Voltando à seleção de personagens...");

});