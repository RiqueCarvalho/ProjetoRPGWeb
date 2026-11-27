document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
       CONFIGURAÇÕES DA ARENA III
    ========================================= */

  const VIDA_HEROI = 180;
  const CURA_POCAO = 30;
  const RECOMPENSA = 150;

  const MULTIPLICADOR_ATAQUE = 1.25;
  const MULTIPLICADOR_DEFESA = 1.2;

  let batalhaFinalizada = false;
  let executandoAcao = false;

  /* =========================================
       ELEMENTOS HTML
    ========================================= */

  const nomeUsuario = document.getElementById("nomeUsuario");
  const moedasElemento = document.getElementById("moedas");

  const nomeVilao = document.getElementById("nomeVilao");
  const imagemVilao = document.getElementById("imagemVilao");

  const vidaVilaoTexto = document.getElementById("vidaVilaoTexto");
  const vidaVilaoBarra = document.getElementById("vidaVilaoBarra");

  const ataqueVilao = document.getElementById("ataqueVilao");
  const defesaVilao = document.getElementById("defesaVilao");

  const nomeHeroi = document.getElementById("nomeHeroi");
  const imagemHeroi = document.getElementById("imagemHeroi");

  const vidaHeroiTexto = document.getElementById("vidaHeroiTexto");
  const vidaHeroiBarra = document.getElementById("vidaHeroiBarra");

  const ataqueHeroi = document.getElementById("ataqueHeroi");
  const defesaHeroi = document.getElementById("defesaHeroi");

  const mensagemCombate = document.getElementById("mensagemCombate");

  const btnAtacar = document.getElementById("btnAtacar");
  const btnCurar = document.getElementById("btnCurar");

  const quantidadePocao = document.getElementById("quantidadePocao");

  const registroBatalha = document.getElementById("registroBatalha");

  const resultadoBatalha = document.getElementById("resultadoBatalha");
  const tituloResultado = document.getElementById("tituloResultado");
  const textoResultado = document.getElementById("textoResultado");

  const btnProxima = document.getElementById("btnProxima");
  const btnReiniciar = document.getElementById("btnReiniciar");
  const btnVoltarViloes = document.getElementById("btnVoltarViloes");
  const btnVoltar = document.getElementById("btnVoltar");

  const ladoVilao = document.getElementById("ladoVilao");
  const ladoHeroi = document.getElementById("ladoHeroi");

  const efeitosCombate = document.getElementById("efeitosCombate");

  const musica = document.getElementById("musicaArena");

  /* =========================================
       MÚSICA
    ========================================= */

  if (musica) {
    musica.volume = 0.3;

    try {
      const configuracoes = JSON.parse(
        localStorage.getItem("lastKingdomSettings"),
      );

      if (!configuracoes || configuracoes.musica !== false) {
        musica.play().catch(() => {});
      }
    } catch {
      musica.play().catch(() => {});
    }
  }

  /* =========================================
       NOME DO JOGADOR
    ========================================= */

  const jogador =
    localStorage.getItem("nomeJogador") ||
    localStorage.getItem("apelidoJogador") ||
    localStorage.getItem("nomeUsuario") ||
    localStorage.getItem("jogadorNome") ||
    "Aventureiro";

  nomeUsuario.textContent = jogador;

  /* =========================================
       CATÁLOGO DE VILÕES
    ========================================= */

  const catalogoViloes = {
    ferrado: {
      nome: "Ferrado",
      imagem: "./vilao1.png",
      vida: 180,
      ataque: 25,
      defesa: 18,
    },

    klatos: {
      nome: "Klatos",
      imagem: "./vilao2.png",
      vida: 200,
      ataque: 23,
      defesa: 20,
    },

    eocao1: {
      nome: "Eocao",
      imagem: "./vilao3.png",
      vida: 190,
      ataque: 27,
      defesa: 16,
    },
  };

  /* =========================================
       RECUPERAR VILÃO SELECIONADO
    ========================================= */

  const idSalvo =
    localStorage.getItem("personagemSelecionadoId") ||
    localStorage.getItem("personagemSelecionado");

  const nomeSalvo = localStorage.getItem("personagemSelecionadoNome");

  const idNormalizado = String(idSalvo || "")
    .trim()
    .toLowerCase();

  const dadosVilao = catalogoViloes[idNormalizado];

  if (!dadosVilao) {
    alert("Não foi possível identificar o vilão selecionado.");

    window.location.href = "../TelaViloes.html";

    return;
  }

  /* =========================================
       PERSONAGEM CONTROLADO PELO JOGADOR
    ========================================= */

  const vilao = {
    nome: nomeSalvo || dadosVilao.nome,

    imagem: dadosVilao.imagem,

    vidaMaxima: dadosVilao.vida,
    vida: dadosVilao.vida,

    ataque: dadosVilao.ataque,
    defesa: dadosVilao.defesa,
  };

  /* =========================================
       CATÁLOGO DE HERÓIS
    ========================================= */

  const catalogoHerois = [
    {
      nome: "Arqueiro",
      imagem: "../Imagens/Personagens/Arqueiro.png",
      vida: 120,
      ataque: 15,
      defesa: 10,
    },

    {
      nome: "O Gigante Guerreiro",
      imagem: "../Imagens/Personagens/Gigante_Cavaleiro.png",
      vida: 150,
      ataque: 20,
      defesa: 15,
    },

    {
      nome: "Cavaleiro",
      imagem: "../Imagens/Personagens/Cavaleiro_Sombrio.png",
      vida: 130,
      ataque: 17,
      defesa: 15,
    },

    {
      nome: "A Alquimista",
      imagem: "../Imagens/Personagens/Alquimista.png",
      vida: 110,
      ataque: 18,
      defesa: 10,
    },
  ];

  /* =========================================
       SORTEAR HERÓI ADVERSÁRIO
       VIDA FIXA DE 180 HP
    ========================================= */

  function sortearHeroi() {
    const indice = Math.floor(Math.random() * catalogoHerois.length);

    const sorteado = catalogoHerois[indice];

    return {
      nome: sorteado.nome,

      imagem: sorteado.imagem,

      vidaMaxima: VIDA_HEROI,
      vida: VIDA_HEROI,

      ataque: Math.ceil(sorteado.ataque * MULTIPLICADOR_ATAQUE),

      defesa: Math.ceil(sorteado.defesa * MULTIPLICADOR_DEFESA),
    };
  }

  const heroi = sortearHeroi();

  /* =========================================
       ESTADO DO JOGO
    ========================================= */

  function obterEstado() {
    try {
      return JSON.parse(localStorage.getItem("rpg_estado_v1")) || {};
    } catch {
      return {};
    }
  }

  /* =========================================
       INVENTÁRIO
    ========================================= */

  function obterQuantidadePocoes() {
    const estado = obterEstado();

    const quantidadeEstado = estado.inventario?.pocao_cura;

    if (typeof quantidadeEstado === "number") {
      return quantidadeEstado;
    }

    if (quantidadeEstado && typeof quantidadeEstado === "object") {
      return Number(quantidadeEstado.quantidade || 0);
    }

    try {
      const inventarioAntigo =
        JSON.parse(localStorage.getItem("inventarioItens")) || [];

      const pocao = inventarioAntigo.find(
        (item) =>
          item.categoria === "Poções" &&
          String(item.nome).toLowerCase().includes("cura"),
      );

      return Number(pocao?.quantidade || 0);
    } catch {
      return 0;
    }
  }

  function atualizarQuantidadePocoes(novaQuantidade) {
    const estado = obterEstado();

    if (!estado.inventario) {
      estado.inventario = {};
    }

    const atual = estado.inventario.pocao_cura;

    if (typeof atual === "object" && atual !== null) {
      estado.inventario.pocao_cura.quantidade = novaQuantidade;
    } else {
      estado.inventario.pocao_cura = novaQuantidade;
    }

    localStorage.setItem("rpg_estado_v1", JSON.stringify(estado));

    try {
      const inventarioAntigo =
        JSON.parse(localStorage.getItem("inventarioItens")) || [];

      const pocao = inventarioAntigo.find(
        (item) =>
          item.categoria === "Poções" &&
          String(item.nome).toLowerCase().includes("cura"),
      );

      if (pocao) {
        pocao.quantidade = novaQuantidade;

        localStorage.setItem(
          "inventarioItens",
          JSON.stringify(inventarioAntigo),
        );
      }
    } catch {}

    atualizarHUD();
  }

  /* =========================================
       MOEDAS
    ========================================= */

  function obterMoedas() {
    const estado = obterEstado();

    if (typeof estado.moedas === "number") {
      return estado.moedas;
    }

    return Number(localStorage.getItem("saldo") || 0);
  }

  function adicionarMoedas(valor) {
    const estado = obterEstado();

    estado.moedas = obterMoedas() + valor;

    localStorage.setItem("rpg_estado_v1", JSON.stringify(estado));

    localStorage.setItem("saldo", estado.moedas);

    atualizarHUD();
  }

  /* =========================================
       ATUALIZAR HUD
    ========================================= */

  function atualizarHUD() {
    moedasElemento.textContent = obterMoedas();

    quantidadePocao.textContent = obterQuantidadePocoes();
  }

  /* =========================================
       ATUALIZAR PERSONAGENS
    ========================================= */

  function atualizarPersonagens() {
    nomeVilao.textContent = vilao.nome;
    imagemVilao.src = vilao.imagem;

    nomeHeroi.textContent = heroi.nome;
    imagemHeroi.src = heroi.imagem;

    ataqueVilao.textContent = vilao.ataque;
    defesaVilao.textContent = vilao.defesa;

    ataqueHeroi.textContent = heroi.ataque;
    defesaHeroi.textContent = heroi.defesa;

    atualizarVida();
  }

  /* =========================================
       ATUALIZAR BARRAS DE VIDA
    ========================================= */

  function atualizarVida() {
    vidaVilaoTexto.textContent = `${vilao.vida} / ${vilao.vidaMaxima}`;

    vidaHeroiTexto.textContent = `${heroi.vida} / ${heroi.vidaMaxima}`;

    const porcentagemVilao = (vilao.vida / vilao.vidaMaxima) * 100;

    const porcentagemHeroi = (heroi.vida / heroi.vidaMaxima) * 100;

    vidaVilaoBarra.style.width = `${Math.max(0, porcentagemVilao)}%`;

    vidaHeroiBarra.style.width = `${Math.max(0, porcentagemHeroi)}%`;
  }

  /* =========================================
       REGISTRO DA BATALHA
    ========================================= */

  function registrarMensagem(mensagem) {
    const paragrafo = document.createElement("p");

    paragrafo.textContent = mensagem;

    registroBatalha.appendChild(paragrafo);

    registroBatalha.scrollTop = registroBatalha.scrollHeight;
  }

  /* =========================================
       CÁLCULO DE DANO
    ========================================= */

  function calcularDano(atacante, defensor) {
    return Math.max(1, atacante.ataque - defensor.defesa);
  }

  /* =========================================
       ANIMAÇÕES
    ========================================= */

  function animarAtaque(elemento) {
    elemento.classList.remove("animacao-ataque");

    void elemento.offsetWidth;

    elemento.classList.add("animacao-ataque");

    setTimeout(() => {
      elemento.classList.remove("animacao-ataque");
    }, 500);
  }

  function animarDano(elemento) {
    elemento.classList.remove("recebendo-dano");

    void elemento.offsetWidth;

    elemento.classList.add("recebendo-dano");

    setTimeout(() => {
      elemento.classList.remove("recebendo-dano");
    }, 500);
  }

  function mostrarDano(valor, lado) {
    const numero = document.createElement("span");

    numero.className = "numero-dano";
    numero.textContent = `-${valor}`;

    numero.style.left = lado === "heroi" ? "70%" : "25%";

    numero.style.top = "45%";

    efeitosCombate.appendChild(numero);

    setTimeout(() => {
      numero.remove();
    }, 1200);
  }

  /* =========================================
       MENSAGEM DE COMBATE
    ========================================= */

  function mostrarMensagem(mensagem) {
    mensagemCombate.textContent = mensagem;
  }

  /* =========================================
       ATAQUE DO JOGADOR
       O JOGADOR CONTROLA O VILÃO
    ========================================= */

  function atacar() {
    if (batalhaFinalizada || executandoAcao) {
      return;
    }

    executandoAcao = true;

    animarAtaque(ladoVilao);

    const dano = calcularDano(vilao, heroi);

    heroi.vida = Math.max(0, heroi.vida - dano);

    mostrarMensagem(`${vilao.nome} atacou ${heroi.nome}!`);

    registrarMensagem(`${vilao.nome} causou ${dano} de dano em ${heroi.nome}.`);

    mostrarDano(dano, "heroi");

    animarDano(ladoHeroi);

    atualizarVida();

    setTimeout(() => {
      if (heroi.vida <= 0) {
        finalizarBatalha(true);

        executandoAcao = false;

        return;
      }

      turnoHeroi();
    }, 700);
  }

  /* =========================================
       CONTRA-ATAQUE DO HERÓI
    ========================================= */

  function turnoHeroi() {
    if (batalhaFinalizada) {
      executandoAcao = false;

      return;
    }

    animarAtaque(ladoHeroi);

    const dano = calcularDano(heroi, vilao);

    vilao.vida = Math.max(0, vilao.vida - dano);

    mostrarMensagem(`${heroi.nome} contra-atacou!`);

    registrarMensagem(`${heroi.nome} causou ${dano} de dano em ${vilao.nome}.`);

    mostrarDano(dano, "vilao");

    animarDano(ladoVilao);

    atualizarVida();

    setTimeout(() => {
      if (vilao.vida <= 0) {
        finalizarBatalha(false);
      }

      executandoAcao = false;
    }, 700);
  }

  /* =========================================
       CURAR VILÃO
    ========================================= */

  function curar() {
    if (batalhaFinalizada || executandoAcao) {
      return;
    }

    const pocoes = obterQuantidadePocoes();

    if (pocoes <= 0) {
      mostrarMensagem("Você não possui poções de cura!");

      registrarMensagem(
        "Você tentou utilizar uma poção, mas não possui nenhuma.",
      );

      return;
    }

    if (vilao.vida >= vilao.vidaMaxima) {
      mostrarMensagem("Sua vida já está completa!");

      return;
    }

    executandoAcao = true;

    const vidaAnterior = vilao.vida;

    vilao.vida = Math.min(vilao.vidaMaxima, vilao.vida + CURA_POCAO);

    const vidaRecuperada = vilao.vida - vidaAnterior;

    atualizarQuantidadePocoes(pocoes - 1);

    atualizarVida();

    mostrarMensagem(
      `${vilao.nome} recuperou ${vidaRecuperada} pontos de vida!`,
    );

    registrarMensagem(
      `${vilao.nome} utilizou uma poção e recuperou ${vidaRecuperada} de vida.`,
    );

    setTimeout(() => {
      turnoHeroi();
    }, 700);
  }

  /* =========================================
       FINALIZAR BATALHA
    ========================================= */

  function finalizarBatalha(vitoria) {
    if (batalhaFinalizada) {
      return;
    }

    batalhaFinalizada = true;

    btnAtacar.disabled = true;
    btnCurar.disabled = true;

    resultadoBatalha.classList.add("ativo");

    if (vitoria) {
      tituloResultado.textContent = "VITÓRIA FINAL!";

      textoResultado.textContent = `Você derrotou ${heroi.nome} e conquistou a Arena III! Recebeu ${RECOMPENSA} moedas.`;

      mostrarMensagem("O campeão foi derrotado! Você venceu as três arenas!");

      registrarMensagem(`VITÓRIA FINAL! ${vilao.nome} derrotou ${heroi.nome}.`);

      adicionarMoedas(RECOMPENSA);

      localStorage.setItem("arenaVilaoIIIConcluida", "true");

      btnProxima.textContent = "FINALIZAR JORNADA";

      btnProxima.style.display = "inline-block";
      btnReiniciar.style.display = "none";
    } else {
      tituloResultado.textContent = "DERROTA!";

      textoResultado.textContent = `${vilao.nome} foi derrotado por ${heroi.nome}. Tente novamente!`;

      mostrarMensagem("O vilão foi derrotado!");

      registrarMensagem(`DERROTA! ${heroi.nome} derrotou ${vilao.nome}.`);

      btnProxima.style.display = "none";
      btnReiniciar.style.display = "inline-block";
    }
  }

  /* =========================================
       REINICIAR
    ========================================= */

  function reiniciarBatalha() {
    window.location.reload();
  }

  /* =========================================
       NAVEGAÇÃO
    ========================================= */

  function voltarParaViloes() {
    window.location.href = "../TelaViloes.html";
  }

  function finalizarJornada() {
    if (!batalhaFinalizada || heroi.vida > 0) {
      return;
    }

    window.location.href = "../TelaViloes.html";
  }

  /* =========================================
       EVENTOS
    ========================================= */

  btnAtacar.addEventListener("click", atacar);

  btnCurar.addEventListener("click", curar);

  btnReiniciar.addEventListener("click", reiniciarBatalha);

  btnProxima.addEventListener("click", finalizarJornada);

  btnVoltar.addEventListener("click", voltarParaViloes);

  btnVoltarViloes.addEventListener("click", voltarParaViloes);

  /* =========================================
       INICIALIZAÇÃO
    ========================================= */

  btnProxima.style.display = "none";
  btnReiniciar.style.display = "none";

  atualizarPersonagens();
  atualizarHUD();

  registrarMensagem(`${vilao.nome} entrou na Arena III.`);

  registrarMensagem(`${heroi.nome} foi sorteado como o adversário final.`);

  registrarMensagem(
    `ATENÇÃO: o adversário possui ${VIDA_HEROI} pontos de vida!`,
  );

  mostrarMensagem("O confronto final começou!");
});
