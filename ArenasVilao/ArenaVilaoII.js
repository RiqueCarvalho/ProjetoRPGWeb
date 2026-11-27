document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // CONFIGURAÇÕES DA ARENA II
  // =========================================

  const CURA_POCAO = 30;
  const RECOMPENSA = 150;

  const MULTIPLICADOR_VIDA_HEROI = 1.3;
  const MULTIPLICADOR_ATAQUE_HEROI = 1.25;
  const MULTIPLICADOR_DEFESA_HEROI = 1.2;

  let batalhaEmAndamento = false;
  let turnoJogador = true;
  let batalhaFinalizada = false;

  // =========================================
  // ELEMENTOS HTML
  // =========================================

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

  const ladoVilao = document.getElementById("ladoVilao");
  const ladoHeroi = document.getElementById("ladoHeroi");

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

  const musicaArena = document.getElementById("musicaArena");

  const obrigatorios = [
    nomeVilao,
    imagemVilao,
    nomeHeroi,
    imagemHeroi,
    vidaVilaoTexto,
    vidaVilaoBarra,
    vidaHeroiTexto,
    vidaHeroiBarra,
    ataqueVilao,
    defesaVilao,
    ataqueHeroi,
    defesaHeroi,
    btnAtacar,
    btnCurar,
    quantidadePocao,
    registroBatalha,
    resultadoBatalha,
    tituloResultado,
    textoResultado,
    btnProxima,
    btnReiniciar,
    ladoVilao,
    ladoHeroi,
    mensagemCombate,
  ];

  if (obrigatorios.some((el) => !el)) {
    console.error("Arena Vilão II: elementos HTML não encontrados.");
    return;
  }

  // =========================================
  // NOME DO JOGADOR
  // =========================================

  function obterNomeJogador() {
    const chaves = [
      "nomeJogador",
      "apelidoJogador",
      "nomeUsuario",
      "jogadorNome",
    ];

    for (const chave of chaves) {
      const valor = localStorage.getItem(chave);

      if (valor && valor.trim()) return valor;
    }

    return "Aventureiro";
  }

  if (nomeUsuario) {
    nomeUsuario.textContent = obterNomeJogador();
  }

  // =========================================
  // ESTADO DO JOGO
  // =========================================

  function obterEstado() {
    try {
      const salvo = localStorage.getItem("rpg_estado_v1");
      return salvo ? JSON.parse(salvo) : null;
    } catch (erro) {
      console.warn("Erro ao carregar estado:", erro);
      return null;
    }
  }

  function salvarEstado(estado) {
    try {
      localStorage.setItem("rpg_estado_v1", JSON.stringify(estado));
    } catch (erro) {
      console.warn("Erro ao salvar estado:", erro);
    }
  }

  // =========================================
  // MOEDAS
  // =========================================

  function obterMoedas() {
    const estado = obterEstado();

    if (estado && typeof estado.moedas === "number") {
      return estado.moedas;
    }

    return Number(localStorage.getItem("saldo")) || 0;
  }

  function atualizarMoedas() {
    if (moedasElemento) {
      moedasElemento.textContent = obterMoedas().toLocaleString("pt-BR");
    }
  }

  function adicionarMoedas(valor) {
    const estado = obterEstado();

    if (estado) {
      estado.moedas = (Number(estado.moedas) || 0) + valor;

      salvarEstado(estado);
    } else {
      localStorage.setItem("saldo", String(obterMoedas() + valor));
    }

    atualizarMoedas();
  }

  atualizarMoedas();

  // =========================================
  // CATÁLOGO DE VILÕES
  // =========================================

  const catalogoViloes = {
    ferrado: {
      id: "ferrado",
      nome: "Cavaleiro Espectral",
      imagem: "./vilao1.png",
      vida: 250,
      ataque: 35,
      defesa: 15,
    },

    klatos: {
      id: "klatos",
      nome: "Bárbaro do Norte",
      imagem: "./vilao2.png",
      vida: 300,
      ataque: 40,
      defesa: 20,
    },

    eocao1: {
      id: "eocao1",
      nome: "Lorde Infernal",
      imagem: "./vilao3.png",
      vida: 350,
      ataque: 45,
      defesa: 25,
    },

    ragnar: {
      id: "ragnar",
      nome: "Ragnar, o Carniceiro",
      imagem: "../Imagens/Elementos_gráficos/Barbaro.jpeg",
      vida: 250,
      ataque: 120,
      defesa: 150,
    },
  };

  // =========================================
  // NORMALIZAR TEXTO
  // =========================================

  function normalizarTexto(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // =========================================
  // VILÃO ESCOLHIDO PELO JOGADOR
  // =========================================

  function obterVilaoSelecionado() {
    let id = localStorage.getItem("personagemSelecionadoId");

    if (!id) {
      const alternativas = [
        "vilaoSelecionado",
        "personagemVilaoSelecionado",
        "vilaoEscolhido",
        "vilaoAtual",
        "personagemSelecionado",
      ];

      for (const chave of alternativas) {
        const valor = localStorage.getItem(chave);

        if (valor) {
          id = valor;
          break;
        }
      }
    }

    if (!id) {
      alert("Selecione um vilão antes de entrar na arena!");
      location.href = "../TelaViloes.html";
      return null;
    }

    const normalizado = normalizarTexto(id);

    for (const chave in catalogoViloes) {
      const vilao = catalogoViloes[chave];

      if (
        normalizado === normalizarTexto(vilao.id) ||
        normalizado === normalizarTexto(chave) ||
        normalizado === normalizarTexto(vilao.nome)
      ) {
        return { ...vilao };
      }
    }

    alert("Vilão não encontrado. Selecione novamente!");
    location.href = "../TelaViloes.html";

    return null;
  }

  // =========================================
  // CATÁLOGO DE HERÓIS
  // =========================================

  const catalogoHerois = [
    {
      id: "arqueiro",
      nome: "Arqueiro",
      imagem: "../Imagens/Personagens/Arqueiro.png",
      vida: 120,
      ataque: 15,
      defesa: 10,
    },

    {
      id: "gigante-guerreiro",
      nome: "O Gigante Guerreiro",
      imagem: "../Imagens/Personagens/Gigante_Cavaleiro.png",
      vida: 150,
      ataque: 20,
      defesa: 15,
    },

    {
      id: "cavaleiro",
      nome: "Cavaleiro",
      imagem: "../Imagens/Personagens/Cavaleiro_Sombrio.png",
      vida: 130,
      ataque: 17,
      defesa: 15,
    },

    {
      id: "alquimista",
      nome: "A Alquimista",
      imagem: "../Imagens/Personagens/Alquimista.png",
      vida: 110,
      ataque: 18,
      defesa: 10,
    },
  ];

  // =========================================
  // SORTEAR HERÓI MAIS FORTE
  // =========================================

  function sortearHeroi() {
    const indice = Math.floor(Math.random() * catalogoHerois.length);

    const sorteado = {
      ...catalogoHerois[indice],
    };

    // AUMENTO DE DIFICULDADE DA ARENA II
    sorteado.vida = Math.round(sorteado.vida * MULTIPLICADOR_VIDA_HEROI);

    sorteado.ataque = Math.round(sorteado.ataque * MULTIPLICADOR_ATAQUE_HEROI);

    sorteado.defesa = Math.round(sorteado.defesa * MULTIPLICADOR_DEFESA_HEROI);

    return sorteado;
  }

  // =========================================
  // PERSONAGENS DA BATALHA
  // =========================================

  let vilao = obterVilaoSelecionado();

  if (!vilao) return;

  let heroi = sortearHeroi();

  vilao.vidaAtual = vilao.vida;
  heroi.vidaAtual = heroi.vida;

  // =========================================
  // CARREGAR IMAGENS
  // =========================================

  function carregarImagem(elemento, caminho, nome) {
    const url = new URL(caminho, document.baseURI).href;

    elemento.onerror = () => {
      console.error("Imagem não encontrada:", url);
      elemento.onerror = null;
      elemento.alt = `Imagem de ${nome} não encontrada`;
    };

    elemento.onload = () => {
      console.log("Imagem carregada:", nome);
    };

    elemento.src = url;
    elemento.alt = nome;
  }

  // =========================================
  // MOSTRAR PERSONAGENS
  // =========================================

  function carregarPersonagens() {
    nomeVilao.textContent = vilao.nome;
    carregarImagem(imagemVilao, vilao.imagem, vilao.nome);

    nomeHeroi.textContent = heroi.nome;
    carregarImagem(imagemHeroi, heroi.imagem, heroi.nome);

    ataqueVilao.textContent = vilao.ataque;
    defesaVilao.textContent = vilao.defesa;

    ataqueHeroi.textContent = heroi.ataque;
    defesaHeroi.textContent = heroi.defesa;

    atualizarVida();
  }

  // =========================================
  // ATUALIZAR VIDA
  // =========================================

  function atualizarVida() {
    vidaVilaoTexto.textContent = `${vilao.vidaAtual} / ${vilao.vida}`;

    vidaHeroiTexto.textContent = `${heroi.vidaAtual} / ${heroi.vida}`;

    vidaVilaoBarra.style.width = `${Math.max(0, (vilao.vidaAtual / vilao.vida) * 100)}%`;

    vidaHeroiBarra.style.width = `${Math.max(0, (heroi.vidaAtual / heroi.vida) * 100)}%`;
  }

  carregarPersonagens();

  // =========================================
  // REGISTRO DE BATALHA
  // =========================================

  function registrarMensagem(mensagem) {
    const p = document.createElement("p");
    p.textContent = mensagem;

    registroBatalha.appendChild(p);
    registroBatalha.scrollTop = registroBatalha.scrollHeight;
  }

  function mostrarMensagem(mensagem) {
    mensagemCombate.textContent = mensagem;
  }

  // =========================================
  // ANIMAÇÕES
  // =========================================

  function animarAtaque(elemento) {
    elemento.classList.remove("atacando");
    void elemento.offsetWidth;
    elemento.classList.add("atacando");

    setTimeout(() => {
      elemento.classList.remove("atacando");
    }, 500);
  }

  function animarDano(elemento) {
    elemento.classList.remove("recebendo-dano");
    void elemento.offsetWidth;
    elemento.classList.add("recebendo-dano");

    setTimeout(() => {
      elemento.classList.remove("recebendo-dano");
    }, 400);
  }

  function mostrarDano(elemento, valor, cura = false) {
    const dano = document.createElement("div");

    dano.className = "dano-animado";

    if (cura) {
      dano.classList.add("dano-cura");
      dano.textContent = `+${valor}`;
    } else {
      dano.textContent = `-${valor}`;
    }

    elemento.appendChild(dano);

    setTimeout(() => dano.remove(), 1200);
  }

  // =========================================
  // CALCULAR DANO
  // =========================================

  function calcularDano(atacante, defensor) {
    return Math.max(1, atacante.ataque - defensor.defesa);
  }

  // =========================================
  // POÇÕES
  // =========================================

  function obterQuantidadePocoes() {
    const estado = obterEstado();

    if (estado && estado.inventario) {
      const inventario = estado.inventario;
      const pocao = inventario.pocao_cura;

      if (typeof pocao === "number") {
        return Math.max(0, pocao);
      }

      if (pocao && typeof pocao === "object") {
        return Math.max(0, Number(pocao.quantidade) || 0);
      }

      for (const chave in inventario) {
        const item = inventario[chave];

        if (
          item &&
          typeof item === "object" &&
          item.nome &&
          item.nome.toLowerCase().includes("cura")
        ) {
          return Math.max(0, Number(item.quantidade) || 0);
        }
      }
    }

    try {
      const itens = JSON.parse(localStorage.getItem("inventarioItens") || "[]");

      const pocao = itens.find(
        (item) => item.nome && item.nome.toLowerCase().includes("cura"),
      );

      return pocao ? Math.max(0, Number(pocao.quantidade) || 0) : 0;
    } catch (erro) {
      console.warn("Erro ao ler poções:", erro);
    }

    return 0;
  }

  function atualizarPocoes() {
    quantidadePocao.textContent = obterQuantidadePocoes();

    btnCurar.disabled =
      obterQuantidadePocoes() <= 0 ||
      batalhaFinalizada ||
      batalhaEmAndamento ||
      !turnoJogador;
  }

  function consumirPocao() {
    const estado = obterEstado();

    if (estado && estado.inventario) {
      const inventario = estado.inventario;
      const pocao = inventario.pocao_cura;

      if (typeof pocao === "number" && pocao > 0) {
        inventario.pocao_cura--;
        salvarEstado(estado);
        return true;
      }

      if (pocao && typeof pocao === "object" && Number(pocao.quantidade) > 0) {
        pocao.quantidade--;
        salvarEstado(estado);
        return true;
      }

      for (const chave in inventario) {
        const item = inventario[chave];

        if (
          item &&
          typeof item === "object" &&
          item.nome &&
          item.nome.toLowerCase().includes("cura") &&
          Number(item.quantidade) > 0
        ) {
          item.quantidade--;
          salvarEstado(estado);
          return true;
        }
      }
    }

    try {
      const itens = JSON.parse(localStorage.getItem("inventarioItens") || "[]");

      const pocao = itens.find(
        (item) =>
          item.nome &&
          item.nome.toLowerCase().includes("cura") &&
          Number(item.quantidade) > 0,
      );

      if (pocao) {
        pocao.quantidade--;

        localStorage.setItem("inventarioItens", JSON.stringify(itens));

        return true;
      }
    } catch (erro) {
      console.warn("Erro ao consumir poção:", erro);
    }

    return false;
  }

  // =========================================
  // BOTÕES
  // =========================================

  function atualizarBotoes() {
    const bloqueado = batalhaFinalizada || batalhaEmAndamento || !turnoJogador;

    btnAtacar.disabled = bloqueado;

    atualizarPocoes();
  }

  // =========================================
  // ATAQUE DO JOGADOR: VILÃO
  // =========================================

  function atacar() {
    if (batalhaFinalizada || batalhaEmAndamento || !turnoJogador) return;

    batalhaEmAndamento = true;
    atualizarBotoes();

    animarAtaque(ladoVilao);

    const dano = calcularDano(vilao, heroi);

    heroi.vidaAtual = Math.max(0, heroi.vidaAtual - dano);

    animarDano(ladoHeroi);
    mostrarDano(ladoHeroi, dano);

    atualizarVida();

    mostrarMensagem(
      `${vilao.nome} atacou ${heroi.nome} e causou ${dano} de dano!`,
    );

    registrarMensagem(`${vilao.nome} causou ${dano} de dano em ${heroi.nome}.`);

    if (heroi.vidaAtual <= 0) {
      finalizarBatalha(true);
      return;
    }

    turnoJogador = false;
    atualizarBotoes();

    setTimeout(turnoHeroi, 900);
  }

  // =========================================
  // CONTRA-ATAQUE DO HERÓI
  // =========================================

  function turnoHeroi() {
    if (batalhaFinalizada) return;

    animarAtaque(ladoHeroi);

    const dano = calcularDano(heroi, vilao);

    vilao.vidaAtual = Math.max(0, vilao.vidaAtual - dano);

    animarDano(ladoVilao);
    mostrarDano(ladoVilao, dano);

    atualizarVida();

    mostrarMensagem(
      `${heroi.nome} contra-atacou e causou ${dano} de dano em ${vilao.nome}!`,
    );

    registrarMensagem(`${heroi.nome} causou ${dano} de dano em ${vilao.nome}.`);

    if (vilao.vidaAtual <= 0) {
      finalizarBatalha(false);
      return;
    }

    turnoJogador = true;
    batalhaEmAndamento = false;

    atualizarBotoes();
  }

  // =========================================
  // CURAR O VILÃO
  // =========================================

  function curar() {
    if (batalhaFinalizada || batalhaEmAndamento || !turnoJogador) return;

    if (vilao.vidaAtual >= vilao.vida) {
      mostrarMensagem("Sua vida já está cheia!");
      return;
    }

    if (obterQuantidadePocoes() <= 0) {
      mostrarMensagem("Você não possui poções de cura!");
      return;
    }

    if (!consumirPocao()) {
      mostrarMensagem("Não foi possível utilizar a poção.");
      atualizarPocoes();
      return;
    }

    batalhaEmAndamento = true;
    atualizarBotoes();

    const vidaAntes = vilao.vidaAtual;

    vilao.vidaAtual = Math.min(vilao.vida, vilao.vidaAtual + CURA_POCAO);

    const recuperada = vilao.vidaAtual - vidaAntes;

    mostrarDano(ladoVilao, recuperada, true);

    atualizarVida();
    atualizarPocoes();

    mostrarMensagem(`${vilao.nome} recuperou ${recuperada} pontos de vida!`);

    registrarMensagem(
      `${vilao.nome} utilizou uma poção e recuperou ${recuperada} de vida.`,
    );

    turnoJogador = false;
    atualizarBotoes();

    setTimeout(turnoHeroi, 900);
  }

  // =========================================
  // FINALIZAR BATALHA
  // =========================================

  function finalizarBatalha(vitoria) {
    batalhaFinalizada = true;
    batalhaEmAndamento = false;

    atualizarBotoes();

    resultadoBatalha.classList.add("ativo");

    if (vitoria) {
      resultadoBatalha.classList.remove("derrota");
      resultadoBatalha.classList.add("vitoria");

      tituloResultado.textContent = "VITÓRIA!";

      textoResultado.textContent = `Você derrotou ${heroi.nome} com ${vilao.nome}! Recebeu ${RECOMPENSA} moedas.`;

      adicionarMoedas(RECOMPENSA);

      registrarMensagem(`VITÓRIA! Você recebeu ${RECOMPENSA} moedas.`);

      btnProxima.style.display = "block";
      btnReiniciar.style.display = "none";

      localStorage.setItem("arenaVilaoIIConcluida", "true");
    } else {
      resultadoBatalha.classList.remove("vitoria");
      resultadoBatalha.classList.add("derrota");

      tituloResultado.textContent = "DERROTA!";

      textoResultado.textContent = `${vilao.nome} foi derrotado por ${heroi.nome}. Tente novamente!`;

      registrarMensagem("Você foi derrotado!");

      btnProxima.style.display = "none";
      btnReiniciar.style.display = "block";
    }
  }

  // =========================================
  // REINICIAR
  // =========================================

  function reiniciarBatalha() {
    location.reload();
  }

  // =========================================
  // NAVEGAÇÃO
  // =========================================

  function voltarViloes() {
    window.location.href = "../TelaViloes.html";
  }

  function irParaArenaIII() {
    window.location.href = "ArenaVilaoIII.html";
  }

  // =========================================
  // MÚSICA
  // =========================================

  if (musicaArena) {
    musicaArena.volume = 0.3;

    const configuracoes = localStorage.getItem("lastKingdomSettings");

    let musicaAtivada = true;

    if (configuracoes) {
      try {
        const dados = JSON.parse(configuracoes);

        if (dados.musica !== undefined) {
          musicaAtivada = dados.musica;
        }

        if (dados.musicaHabilitada !== undefined) {
          musicaAtivada = dados.musicaHabilitada;
        }
      } catch (erro) {
        console.warn("Configurações de música inválidas.");
      }
    }

    if (musicaAtivada) {
      musicaArena.play().catch(() => {
        console.log("A reprodução aguarda interação.");
      });
    }

    document.addEventListener(
      "click",
      () => {
        if (musicaAtivada && musicaArena.paused) {
          musicaArena.play().catch(() => {});
        }
      },
      { once: true },
    );
  }

  // =========================================
  // EVENTOS
  // =========================================

  btnAtacar.addEventListener("click", atacar);
  btnCurar.addEventListener("click", curar);

  btnReiniciar.addEventListener("click", reiniciarBatalha);

  btnProxima.addEventListener("click", irParaArenaIII);

  if (btnVoltarViloes) {
    btnVoltarViloes.addEventListener("click", voltarViloes);
  }

  if (btnVoltar) {
    btnVoltar.addEventListener("click", voltarViloes);
  }

  // =========================================
  // INÍCIO DA ARENA II
  // =========================================

  registrarMensagem(`Você entrou na segunda arena controlando ${vilao.nome}!`);

  registrarMensagem(`${heroi.nome} foi sorteado como seu adversário.`);

  registrarMensagem(
    "ATENÇÃO: este herói está mais forte do que os adversários da primeira arena!",
  );

  mostrarMensagem(
    `${vilao.nome}, prepare-se! ${heroi.nome} será um adversário mais difícil!`,
  );

  atualizarBotoes();
});
