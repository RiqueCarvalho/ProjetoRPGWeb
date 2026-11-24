
/* =========================================
   THE LAST KINGDOM
   CATÁLOGO CENTRAL DE PERSONAGENS
========================================= */

window.CatalogoJogo = {

    herois: {

        // PERSONAGENS MASCULINOS

        "arqueiro": {
            id: "arqueiro",
            nome: "Arqueiro",
            tipo: "masculino",
            imagem: "../Imagens/Personagens/Arqueiro.png",
            vida: 120,
            ataque: 15,
            defesa: 10
        },

        "cavaleiro": {
            id: "cavaleiro",
            nome: "Cavaleiro",
            tipo: "masculino",
            imagem: "../Imagens/Personagens/Cavaleiro_Sombrio.png",
            vida: 130,
            ataque: 17,
            defesa: 15
        },

        "gigante-guerreiro": {
            id: "gigante-guerreiro",
            nome: "O Gigante Guerreiro",
            tipo: "masculino",
            imagem: "../Imagens/Personagens/Gigante_Cavaleiro.png",
            vida: 150,
            ataque: 20,
            defesa: 15
        },

        // PERSONAGENS FEMININOS

        "alquimista": {
            id: "alquimista",
            nome: "A Alquimista",
            tipo: "feminino",
            imagem: "../Imagens/Personagens/Alquimista.png",
            vida: 120,
            ataque: 15,
            defesa: 12
        },

        "bruxa": {
            id: "bruxa",
            nome: "Morgana",
            tipo: "feminino",
            imagem: "../Imagens/Personagens/Bruxa.png",
            vida: 110,
            ataque: 20,
            defesa: 8
        },

        "atiradora": {
            id: "atiradora",
            nome: "Atiradora",
            tipo: "feminino",
            imagem: "../Imagens/Personagens/Atiradora.png",
            vida: 100,
            ataque: 22,
            defesa: 7
        }

    },

    // VILÕES

    viloes: [

        {
            id: "vilao1",
            nome: "Bárbaro das Trevas",
            imagem: "../Imagens/Personagens/Viloes/vilao1.png",
            vida: 120,
            ataque: 12,
            defesa: 5
        },

        {
            id: "vilao2",
            nome: "Guerreiro Sombrio",
            imagem: "../Imagens/Personagens/Viloes/vilao2.png",
            vida: 135,
            ataque: 14,
            defesa: 8
        },

        {
            id: "vilao3",
            nome: "Senhor das Sombras",
            imagem: "../Imagens/Personagens/Viloes/vilao3.png",
            vida: 110,
            ataque: 10,
            defesa: 4
        }

    ],

    // LOCALIZA O HERÓI ESCOLHIDO

    obterHeroi() {

        const escolhaId =
            localStorage.getItem("personagemSelecionadoId");

        const escolhaNome =
            localStorage.getItem("personagemSelecionadoNome") ||
            localStorage.getItem("personagemSelecionado") ||
            localStorage.getItem("heroiSelecionado");

        // Primeiro procura pelo identificador.
        if (escolhaId && this.herois[escolhaId]) {
            return this.herois[escolhaId];
        }

        // Caso não encontre, procura pelo nome.
        if (escolhaNome) {

            const normalizar = (texto) => {
                return texto
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/^a\s+/, "")
                    .trim();
            };

            const nomeNormalizado = normalizar(escolhaNome);

            const encontrado = Object.values(this.herois).find(personagem => {

                return normalizar(personagem.nome) === nomeNormalizado ||
                    normalizar(personagem.id) === nomeNormalizado ||
                    normalizar(personagem.nome.replace(/^O\s+/i, "")) === nomeNormalizado;

            });

            if (encontrado) {
                return encontrado;
            }
        }

        return null;
    },

    // SORTEIA UM VILÃO ALEATÓRIO

    sortearVilao() {

        const indice = Math.floor(
            Math.random() * this.viloes.length
        );

        return this.viloes[indice];
    }

};
