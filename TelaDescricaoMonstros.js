const monstros = [
  {
    id: "goblin",
    nome: "Goblin das Sombras",
    local: "OS PORTÕES ESQUECIDOS",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqyz7QhjqiBzedk_SgaXslIbt_VWaXW_zninbEbhRVqA&s=10",
    historia:
      "Os Goblins das Sombras vivem nas ruínas dos antigos portões do reino. Astutos e velozes, dominam passagens secretas e armadilhas. Após tentarem roubar uma relíquia real, foram expulsos de suas terras. Agora, protegem tesouros escondidos e atacam quem invade seu território.",
    atk: 80,
    def: 60,
    vida: 120,
    habilidades: [
      {
        nome: "Ataque furtivo",
        descricao: "Ataca os inimigos de surpresa.",
        atk: 10,
        def: 0,
        vida: 0,
      },
      {
        nome: "Armadilha sombria",
        descricao: "Prepara armadilhas para se proteger.",
        atk: 0,
        def: 15,
        vida: 0,
      },
      {
        nome: "Agilidade",
        descricao: "Move-se rapidamente para evitar ataques.",
        atk: 0,
        def: 0,
        vida: 20,
      },
    ],
    armas: [
      { nome: "Adagas sombrias", atk: 10, def: 0 },
      { nome: "Arco antigo", atk: 20, def: -5 },
      { nome: "Lâminas encantadas", atk: 30, def: -10 },
    ],
    estilos: [
      { nome: "Assassino", atk: 15, def: -10, vida: 0 },
      { nome: "Guardião", atk: -5, def: 15, vida: 20 },
      { nome: "Ágil", atk: 10, def: 0, vida: 10 },
    ],
  },
  {
    id: "demonio",
    nome: "Demônio da Névoa",
    local: "A FLORESTA PROIBIDA",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFEt9OLSe7cP9a58pBwhb1AVIWS6hTn2WEKCpYvb1e6w&s=10",
    historia:
      "Nascido de uma antiga maldição, o Demônio da Névoa habita uma floresta onde a luz quase nunca chega. Antigamente, protegia um santuário mágico. Após a destruição do local, sua energia foi corrompida. Agora, confunde viajantes e guarda os segredos de uma magia esquecida.",
    atk: 120,
    def: 100,
    vida: 250,
    habilidades: [
      {
        nome: "Névoa arcana",
        descricao: "Libera uma névoa mágica que confunde os inimigos.",
        atk: 15,
        def: 0,
        vida: 0,
      },
      {
        nome: "Barreira espectral",
        descricao: "Cria uma barreira de energia sobrenatural.",
        atk: 0,
        def: 20,
        vida: 0,
      },
      {
        nome: "Drenagem mágica",
        descricao: "Absorve energia mágica para recuperar forças.",
        atk: 0,
        def: 0,
        vida: 30,
      },
    ],
    armas: [
      { nome: "Cajado da névoa", atk: 10, def: 5 },
      { nome: "Foice espectral", atk: 25, def: -5 },
      { nome: "Orbe sombrio", atk: 35, def: -10 },
    ],
    estilos: [
      { nome: "Feiticeiro", atk: 20, def: -5, vida: 0 },
      { nome: "Protetor arcano", atk: 0, def: 20, vida: 30 },
      { nome: "Espectro", atk: 10, def: 5, vida: 15 },
    ],
  },
  {
    id: "dragao",
    nome: "Dragão da Noite",
    local: "A FORTALEZA DAS CINZAS",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5-QcgUAUbtr3x8J5rn6PwRRLHT52cNT2cRANQh1OM4Q&s=10",
    historia:
      "O Dragão da Noite é uma das criaturas mais antigas do reino. Após uma guerra que destruiu a primeira dinastia, escolheu uma fortaleza em ruínas como morada. Suas escamas negras guardam uma energia violeta, e sua missão é proteger o último fragmento da coroa real. Poucos guerreiros conhecem sua verdadeira origem.",
    atk: 120,
    def: 150,
    vida: 2500,
    habilidades: [
      {
        nome: "Chamas do abismo",
        descricao: "Libera chamas violeta com enorme poder destrutivo.",
        atk: 30,
        def: 0,
        vida: 0,
      },
      {
        nome: "Escamas ancestrais",
        descricao: "Suas escamas endurecem e resistem aos ataques.",
        atk: 0,
        def: 25,
        vida: 0,
      },
      {
        nome: "Coração do dragão",
        descricao: "A energia ancestral fortalece sua vitalidade.",
        atk: 0,
        def: 0,
        vida: 300,
      },
    ],
    armas: [
      { nome: "Garras ancestrais", atk: 10, def: 0 },
      { nome: "Lâmina infernal", atk: 30, def: -10 },
      { nome: "Chamas violeta", atk: 50, def: -15 },
    ],
    estilos: [
      { nome: "Destruidor", atk: 30, def: -15, vida: 0 },
      { nome: "Dragão guardião", atk: 0, def: 25, vida: 300 },
      { nome: "Caçador real", atk: 15, def: 5, vida: 100 },
    ],
  },
];

const lista = document.getElementById("personagens");
const modal = document.getElementById("modal");
const detalhe = document.getElementById("detalhe");

let atual = null;
let armaAtual = 0;
let estiloAtual = 0;
let habilidadesAtivas = [];

function criarPersonagens() {
  monstros.forEach((monstro) => {
    const cartao = document.createElement("article");
    cartao.className = "personagem";

    const area = document.createElement("div");
    area.className = "area-imagem";

    const img = document.createElement("img");
    img.src = monstro.imagem;
    img.alt = monstro.nome;

    img.onerror = () => {
      img.alt = "Não foi possível carregar a imagem de " + monstro.nome;
      img.style.display = "none";

      const aviso = document.createElement("p");
      aviso.textContent = "Imagem indisponível";
      aviso.style.color = "#f2d79a";
      area.appendChild(aviso);
    };

    area.appendChild(img);

    const nome = document.createElement("h2");
    nome.className = "nome";
    nome.textContent = monstro.nome;

    const botao = document.createElement("button");
    botao.className = "botao";
    botao.textContent = "Selecionar";
    botao.type = "button";
    botao.addEventListener("click", () => abrirVilao(monstro));

    cartao.append(area, nome, botao);
    lista.appendChild(cartao);
  });
}

function abrirVilao(monstro) {
  atual = monstro;
  armaAtual = 0;
  estiloAtual = 0;
  habilidadesAtivas = [];

  document.getElementById("nomeVilao").textContent = monstro.nome;
  document.getElementById("localVilao").textContent = monstro.local;
  document.getElementById("historiaVilao").textContent = monstro.historia;

  document.querySelectorAll(".opcao[data-tipo]").forEach((botao) => {
    botao.classList.remove("ativo");
  });

  detalhe.innerHTML =
    "<h3>Informações do vilão</h3><p>Escolha uma opção acima para descobrir os poderes do personagem.</p>";

  atualizarAtributos();
  modal.classList.add("aberto");
}

function atualizarAtributos() {
  if (!atual) return;

  const arma = atual.armas[armaAtual];
  const estilo = atual.estilos[estiloAtual];

  let atk = atual.atk + arma.atk + estilo.atk;
  let def = atual.def + arma.def + estilo.def;
  let vida = atual.vida + estilo.vida;

  habilidadesAtivas.forEach((indice) => {
    const habilidade = atual.habilidades[indice];
    atk += habilidade.atk;
    def += habilidade.def;
    vida += habilidade.vida;
  });

  document.getElementById("atk").textContent = Math.max(0, atk);
  document.getElementById("def").textContent = Math.max(0, def);
  document.getElementById("vida").textContent = Math.max(0, vida);
}

function mostrarHabilidades() {
  const titulo = document.createElement("h3");
  titulo.textContent = "🌳 Árvore de habilidades";

  const texto = document.createElement("p");
  texto.textContent = "Ative ou desative habilidades para mudar os atributos.";

  const grupo = document.createElement("div");
  grupo.className = "lista-habilidades";

  atual.habilidades.forEach((habilidade, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao";
    botao.style.textAlign = "left";

    const ativo = habilidadesAtivas.includes(indice);
    botao.classList.toggle("ativo", ativo);
    botao.textContent = (ativo ? "✓ " : "＋ ") + habilidade.nome;

    const descricao = document.createElement("p");
    descricao.textContent = habilidade.descricao;
    descricao.style.marginTop = "6px";
    descricao.style.fontSize = "13px";
    botao.appendChild(descricao);

    botao.addEventListener("click", () => {
      if (habilidadesAtivas.includes(indice)) {
        habilidadesAtivas = habilidadesAtivas.filter((n) => n !== indice);
      } else {
        habilidadesAtivas.push(indice);
      }

      mostrarHabilidades();
      atualizarAtributos();
    });

    grupo.appendChild(botao);
  });

  detalhe.replaceChildren(titulo, texto, grupo);
}

function mostrarArma() {
  const arma = atual.armas[armaAtual];

  detalhe.innerHTML = `
    <h3>⚔️ Arma: ${arma.nome}</h3>
    <p>Arma ${armaAtual + 1} de ${atual.armas.length}.</p>
    <p>Bônus de ataque: ${arma.atk >= 0 ? "+" : ""}${arma.atk}</p>
    <p>Bônus de defesa: ${arma.def >= 0 ? "+" : ""}${arma.def}</p>
  `;

  const trocar = document.createElement("button");
  trocar.type = "button";
  trocar.className = "opcao ativo";
  trocar.style.marginTop = "12px";
  trocar.textContent = "Próxima arma ➜";

  trocar.addEventListener("click", () => {
    armaAtual = (armaAtual + 1) % atual.armas.length;
    mostrarArma();
    atualizarAtributos();
  });

  detalhe.appendChild(trocar);
}

function mostrarEstilo() {
  const estilo = atual.estilos[estiloAtual];

  detalhe.innerHTML = `
    <h3>🛡️ Estilo: ${estilo.nome}</h3>
    <p>Estilo ${estiloAtual + 1} de ${atual.estilos.length}.</p>
    <p>Bônus de ataque: ${estilo.atk >= 0 ? "+" : ""}${estilo.atk}</p>
    <p>Bônus de defesa: ${estilo.def >= 0 ? "+" : ""}${estilo.def}</p>
    <p>Bônus de vida: ${estilo.vida >= 0 ? "+" : ""}${estilo.vida}</p>
  `;

  const trocar = document.createElement("button");
  trocar.type = "button";
  trocar.className = "opcao ativo";
  trocar.style.marginTop = "12px";
  trocar.textContent = "Próximo estilo ➜";

  trocar.addEventListener("click", () => {
    estiloAtual = (estiloAtual + 1) % atual.estilos.length;
    mostrarEstilo();
    atualizarAtributos();
  });

  detalhe.appendChild(trocar);
}

document.querySelectorAll(".opcao[data-tipo]").forEach((botao) => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".opcao[data-tipo]").forEach((item) => {
      item.classList.remove("ativo");
    });

    botao.classList.add("ativo");

    if (botao.dataset.tipo === "habilidade") mostrarHabilidades();
    if (botao.dataset.tipo === "arma") mostrarArma();
    if (botao.dataset.tipo === "estilo") mostrarEstilo();
  });
});

function fecharModal() {
  modal.classList.remove("aberto");
}

document.getElementById("fechar").addEventListener("click", fecharModal);

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) fecharModal();
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") fecharModal();
});

criarPersonagens();
