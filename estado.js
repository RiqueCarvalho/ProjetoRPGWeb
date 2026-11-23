/* Fonte única do estado persistente, compatível com páginas abertas via file://. */
(() => {
  const SCRIPT_URL = document.currentScript.src;
  const CHAVE = "rpg_estado_v1";
  const VERSAO = 1;
  const PRECO_REVENDA = 0.5;
  const USAR_ESTADO_DA_ABA = location.protocol === "file:";
  const PREFIXO_JANELA = "__PROJETO_RPG_ESTADO_V1__:";

  const catalogo = Object.freeze({
    pocao_cura: { id: "pocao_cura", nome: "Poção de Cura", categoria: "Poções", preco: 50, icone: "./Imagens/Elementos_gráficos/Poção de cura.png", efeito: "cura", efeitoTexto: "Restaura 50 pontos de vida.", descricao: "Uma poção simples feita com ervas medicinais. Cura ferimentos leves e recupera a vitalidade.", recupera: 50, consumivel: true },
    pocao_forca: { id: "pocao_forca", nome: "Poção de Força", categoria: "Poções", preco: 80, icone: "./Imagens/Elementos_gráficos/Poção de força.png", efeito: "dano", efeitoTexto: "Aumenta o dano em 20% por 60 segundos.", descricao: "Um elixir escuro que enche os músculos de poder. Os golpes ficam mais pesados por um tempo.", consumivel: true },
    pocao_agilidade: { id: "pocao_agilidade", nome: "Poção de Agilidade", categoria: "Poções", preco: 80, icone: "./Imagens/Elementos_gráficos/Poção de agilidade.png", efeito: "agilidade", efeitoTexto: "Aumenta a velocidade em 25% por 60 segundos.", descricao: "Líquido azul e leve que faz os pés parecerem não tocar o chão.", consumivel: true },
    pocao_defesa: { id: "pocao_defesa", nome: "Poção de Defesa", categoria: "Poções", preco: 90, icone: "./Imagens/Elementos_gráficos/Poção de defesa.png", efeito: "defesa", efeitoTexto: "Aumenta a defesa em 5 pontos por 60 segundos.", descricao: "Uma poção que aumenta a defesa do usuário por 60 segundos.", consumivel: true },
    cerveja: { id: "cerveja", nome: "Cerveja", categoria: "Poções", preco: 30, icone: "./Imagens/Elementos_gráficos/Cerveja.png", efeito: "cerveja", efeitoTexto: "Aumenta o ataque em 5 pontos, mas reduz 5 pontos de defesa.", descricao: "Gelada e refrescante. Diminui seus pontos de defesa, mas aumenta o dano de ataque.", consumivel: true },
    espada_fogo: { id: "espada_fogo", nome: "Espada de Fogo", categoria: "Espadas", preco: 22000, icone: "./Imagens/Elementos_gráficos/Espada de fogo.png", efeito: "dano", descricao: "Espada elemental de fogo.", slot: "espada", bonus: { ataque: 20 } },
    espada_gelo: { id: "espada_gelo", nome: "Espada de Gelo", categoria: "Espadas", preco: 15000, icone: "./Imagens/Elementos_gráficos/Espada de gelo.png", efeito: "dano", descricao: "Espada elemental de gelo.", slot: "espada", bonus: { ataque: 15 } },
    espada_selva: { id: "espada_selva", nome: "Espada da Selva", categoria: "Espadas", preco: 13500, icone: "./Imagens/Elementos_gráficos/Espada da selva.png", efeito: "dano", descricao: "Espada da selva.", slot: "espada", bonus: { ataque: 13 } },
    espada_sombria: { id: "espada_sombria", nome: "Espada Sombria", categoria: "Espadas", preco: 20000, icone: "./Imagens/Elementos_gráficos/Espada sombria.png", efeito: "dano", descricao: "Espada de poder sombrio.", slot: "espada", bonus: { ataque: 20 } },
    espada_real: { id: "espada_real", nome: "Espada Real", categoria: "Espadas", preco: 4000, icone: "./Imagens/Elementos_gráficos/Espada real.png", efeito: "dano", descricao: "Espada da realeza.", slot: "espada", bonus: { ataque: 4 } },
    espada_real_nivel_2: { id: "espada_real_nivel_2", nome: "Espada Real nivel 2", categoria: "Espadas", preco: 18000, icone: "./Imagens/Elementos_gráficos/Espada Real nivel 2.png", efeito: "dano", descricao: "Espada real aprimorada.", slot: "espada", bonus: { ataque: 18 } },
    escudo_sport: { id: "escudo_sport", nome: "Escudo do Sport", categoria: "Escudos", preco: 3500, icone: "./Imagens/Elementos_gráficos/Escudo do Sport.png", efeito: "defesa", descricao: "Escudo do Sport.", slot: "escudo", bonus: { defesa: 8 } },
    escudo_gelo: { id: "escudo_gelo", nome: "Escudo de gelo", categoria: "Escudos", preco: 2500, icone: "./Imagens/Elementos_gráficos/Escudo de gelo.png", efeito: "defesa", descricao: "Escudo elemental de gelo.", slot: "escudo", bonus: { defesa: 7 } },
    escudo_selva: { id: "escudo_selva", nome: "Escudo do selva", categoria: "Escudos", preco: 4500, icone: "./Imagens/Elementos_gráficos/Escudo da selva.png", efeito: "defesa", descricao: "Escudo da selva.", slot: "escudo", bonus: { defesa: 10 } },
    escudo_espinhos: { id: "escudo_espinhos", nome: "Escudo com espinhos", categoria: "Escudos", preco: 1200, icone: "./Imagens/Elementos_gráficos/Escudo com espinhos.png", efeito: "defesa", descricao: "Escudo com espinhos.", slot: "escudo", bonus: { defesa: 5 } },
    escudo_vermelho: { id: "escudo_vermelho", nome: "Escudo com detalhes em vermelho", categoria: "Escudos", preco: 1500, icone: "./Imagens/Elementos_gráficos/Escudo com bagulho vermelho.png", efeito: "defesa", descricao: "Escudo reforçado.", slot: "escudo", bonus: { defesa: 5 } },
    escudo_azul_amarelo: { id: "escudo_azul_amarelo", nome: "Escudo azul com detalhes em amarelo", categoria: "Escudos", preco: 2000, icone: "./Imagens/Elementos_gráficos/Escudo Azul com bagulho amarelo.png", efeito: "defesa", descricao: "Escudo reforçado.", slot: "escudo", bonus: { defesa: 6 } },
    armadura_fogo: { id: "armadura_fogo", nome: "Armadura de Fogo", categoria: "Armaduras", preco: 2000, icone: "./Imagens/Elementos_gráficos/Armadura de fogo.png", efeito: "defesa", descricao: "Armadura pesada de fogo.", slot: "armadura", bonus: { defesa: 10 } },
    armadura_mago: { id: "armadura_mago", nome: "Armadura de Mago", categoria: "Armaduras", preco: 1500, icone: "./Imagens/Elementos_gráficos/Armadura de mago.png", efeito: "defesa", descricao: "Armadura mágica.", slot: "armadura", bonus: { defesa: 7 } },
    armadura_caos: { id: "armadura_caos", nome: "Armadura do Caos", categoria: "Armaduras", preco: 2200, icone: "./Imagens/Elementos_gráficos/Armadura do caos.png", efeito: "defesa", descricao: "Armadura pesada do caos.", slot: "armadura", bonus: { defesa: 12 } },
    armadura_paladino: { id: "armadura_paladino", nome: "Armadura de Paladino", categoria: "Armaduras", preco: 1800, icone: "./Imagens/Elementos_gráficos/Armadura de paladino.png", efeito: "defesa", descricao: "Armadura pesada de paladino.", slot: "armadura", bonus: { defesa: 9 } },
    armadura_ouro: { id: "armadura_ouro", nome: "Armadura de Ouro", categoria: "Armaduras", preco: 3500, icone: "./Imagens/Elementos_gráficos/Armadura de ouro.png", efeito: "defesa", descricao: "Armadura dourada.", slot: "armadura", bonus: { defesa: 15 } },
    armadura_gelo: { id: "armadura_gelo", nome: "Armadura de Gelo", categoria: "Armaduras", preco: 2000, icone: "./Imagens/Elementos_gráficos/Armadura de gelo.png", efeito: "defesa", descricao: "Armadura mágica de gelo.", slot: "armadura", bonus: { defesa: 10 } },
    armadura_selva: { id: "armadura_selva", nome: "Armadura da Selva", categoria: "Armaduras", preco: 1700, icone: "./Imagens/Elementos_gráficos/Armadura da selva.png", efeito: "defesa", descricao: "Armadura pesada da selva.", slot: "armadura", bonus: { defesa: 8 } },
  });

  const aliases = Object.values(catalogo).reduce((mapa, item) => {
    mapa[`${item.categoria}:${item.nome}`] = item.id;
    mapa[item.nome] = item.id;
    return mapa;
  }, {});
  Object.values(catalogo).forEach((item) => {
    if (item.bonus) Object.freeze(item.bonus);
    Object.freeze(item);
  });
  const inicial = () => ({ moedas: 5000, vida: 100, inventario: {}, equipados: { espada: null, escudo: null, armadura: null }, versao: VERSAO });

  function lerEstadoDaAba() {
    if (!USAR_ESTADO_DA_ABA) return null;
    if (!window.name.startsWith(PREFIXO_JANELA)) {
      return { nomeOriginal: window.name, valores: {} };
    }

    try {
      const estado = JSON.parse(window.name.slice(PREFIXO_JANELA.length));
      if (
        !estado ||
        typeof estado.nomeOriginal !== "string" ||
        !estado.valores ||
        typeof estado.valores !== "object" ||
        Array.isArray(estado.valores) ||
        !Object.values(estado.valores).every((valor) => typeof valor === "string")
      ) {
        throw new Error("Os dados compartilhados desta aba estão inválidos.");
      }
      return estado;
    } catch (erro) {
      console.error("Não foi possível ler o estado compartilhado desta aba.", erro);
      return { nomeOriginal: "", valores: {} };
    }
  }

  function salvarEstadoDaAba(estado) {
    if (USAR_ESTADO_DA_ABA) {
      window.name = PREFIXO_JANELA + JSON.stringify(estado);
    }
  }

  function lerValor(chave) {
    const estadoAba = lerEstadoDaAba();
    if (estadoAba && Object.prototype.hasOwnProperty.call(estadoAba.valores, chave)) {
      return estadoAba.valores[chave];
    }
    if (
      estadoAba &&
      chave === CHAVE &&
      (Object.prototype.hasOwnProperty.call(estadoAba.valores, "saldo") ||
        Object.prototype.hasOwnProperty.call(estadoAba.valores, "inventario"))
    ) {
      return null;
    }
    try {
      const valor = localStorage.getItem(chave);
      if (valor !== null && estadoAba) {
        estadoAba.valores[chave] = valor;
        salvarEstadoDaAba(estadoAba);
      }
      return valor;
    } catch (erro) {
      if (USAR_ESTADO_DA_ABA) {
        console.warn("localStorage indisponível para file://; usando o estado desta aba.", erro);
        return null;
      }
      throw erro;
    }
  }

  function salvarValor(chave, valor) {
    const texto = String(valor);
    const estadoAba = lerEstadoDaAba();
    if (estadoAba) {
      estadoAba.valores[chave] = texto;
      salvarEstadoDaAba(estadoAba);
    }
    try {
      localStorage.setItem(chave, texto);
      return true;
    } catch (erro) {
      if (!USAR_ESTADO_DA_ABA) throw erro;
      console.warn("Não foi possível gravar em localStorage; estado salvo nesta aba.", erro);
      return true;
    }
  }

  function removerValor(chave) {
    const estadoAba = lerEstadoDaAba();
    if (estadoAba) {
      delete estadoAba.valores[chave];
      salvarEstadoDaAba(estadoAba);
    }
    try {
      localStorage.removeItem(chave);
    } catch (erro) {
      if (!USAR_ESTADO_DA_ABA) throw erro;
      console.warn("Não foi possível remover um valor antigo do localStorage.", erro);
    }
  }

  function validarEstado(valor) {
    return valor && Number.isSafeInteger(valor.moedas) && valor.moedas >= 0 &&
      Number.isSafeInteger(valor.vida) && valor.vida >= 0 && valor.vida <= 100 &&
      valor.inventario && typeof valor.inventario === "object" && !Array.isArray(valor.inventario) &&
      Object.entries(valor.inventario).every(([id, qtd]) =>
        !!catalogo[id] && Number.isSafeInteger(qtd) && qtd > 0,
      ) &&
      valor.equipados && ["espada", "escudo", "armadura"].every((slot) =>
        valor.equipados[slot] === null ||
        (typeof valor.equipados[slot] === "string" && catalogo[valor.equipados[slot]]?.slot === slot && Number.isInteger(valor.inventario[valor.equipados[slot]]) && valor.inventario[valor.equipados[slot]] > 0),
      ) && valor.versao === VERSAO;
  }

  function lerLegado() {
    try {
      const moedasSalvas = lerValor("saldo");
      const itensSalvos = lerValor("inventario");
      if (moedasSalvas === null && itensSalvos === null) return inicial();
      const novo = inicial();
      if (moedasSalvas !== null && Number.isSafeInteger(Number(moedasSalvas)) && Number(moedasSalvas) >= 0) novo.moedas = Number(moedasSalvas);
      if (itensSalvos) {
        const antigos = JSON.parse(itensSalvos);
        if (Array.isArray(antigos)) antigos.forEach((item) => {
          const id = aliases[item.id] || aliases[`${item.categoria}:${item.nome}`] || aliases[item.nome];
          if (id && Number.isInteger(item.quantidade) && item.quantidade > 0) novo.inventario[id] = (novo.inventario[id] || 0) + item.quantidade;
        });
      }
      return novo;
    } catch (erro) {
      console.error("Não foi possível migrar o estado antigo do jogo.", erro);
      return inicial();
    }
  }

  function salvar(estado) {
    try {
      salvarValor(CHAVE, JSON.stringify(estado));
      window.dispatchEvent(new CustomEvent("estado-mudou"));
      return true;
    } catch (erro) {
      console.error("Não foi possível salvar o estado do jogo.", erro);
      return false;
    }
  }

  function ler() {
    try {
      const salvo = lerValor(CHAVE);
      if (salvo === null) {
        const migrado = lerLegado();
        if (salvar(migrado)) {
          try {
            removerValor("saldo");
            removerValor("inventario");
          } catch (erro) {
            console.error("Não foi possível remover os dados antigos migrados.", erro);
          }
        }
        return migrado;
      }
      let valor;
      try {
        valor = JSON.parse(salvo);
      } catch (erro) {
        console.error("O estado salvo do jogo está corrompido; restaurando valores iniciais.", erro);
      }
      if (valor && validarEstado(valor)) return valor;
      const novo = inicial();
      salvar(novo);
      return novo;
    } catch (erro) {
      console.error("Não foi possível ler o estado do jogo; usando valores iniciais.", erro);
      return inicial();
    }
  }

  function quantidadeValida(qtd) {
    return Number.isSafeInteger(qtd) && qtd >= 1;
  }
  function resultadoFalha(motivo) {
    return { ok: false, motivo };
  }
  function getItem(id) {
    return Object.prototype.hasOwnProperty.call(catalogo, id) ? catalogo[id] : null;
  }
  function getIcone(id) {
    const item = getItem(id);
    return item ? new URL(item.icone, SCRIPT_URL).href : "";
  }
  function getMoedas() { return ler().moedas; }
  function definirMoedas(moedas) {
    if (!Number.isSafeInteger(moedas) || moedas < 0) return resultadoFalha("Valor de moedas inválido.");
    const estado = ler();
    estado.moedas = moedas;
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar as moedas.");
  }
  function getVida() { return ler().vida; }
  function definirVida(vida) {
    if (!Number.isSafeInteger(vida) || vida < 0 || vida > 100) return resultadoFalha("Valor de vida inválido.");
    const estado = ler();
    estado.vida = vida;
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar a vida.");
  }
  function adicionarMoedas(qtd) {
    if (!Number.isSafeInteger(qtd) || qtd < 1) return resultadoFalha("Quantidade de moedas inválida.");
    const estado = ler();
    if (!Number.isSafeInteger(estado.moedas + qtd)) return resultadoFalha("O saldo excede o limite seguro.");
    estado.moedas += qtd;
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar as moedas.");
  }
  function podeComprar(id, qtd = 1) {
    const item = getItem(id);
    return !!item && quantidadeValida(qtd) && getMoedas() >= item.preco * qtd;
  }
  function comprar(id, qtd = 1) {
    const item = getItem(id);
    if (!item) return resultadoFalha("Item inválido.");
    if (!quantidadeValida(qtd)) return resultadoFalha("Quantidade inválida.");
    const estado = ler();
    const total = item.preco * qtd;
    const quantidadeNova = (estado.inventario[id] || 0) + qtd;
    if (!Number.isSafeInteger(total) || !Number.isSafeInteger(quantidadeNova)) {
      return resultadoFalha("Quantidade fora do limite permitido.");
    }
    if (estado.moedas < total) return resultadoFalha("Moedas insuficientes.");
    estado.moedas -= total;
    estado.inventario[id] = quantidadeNova;
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar a compra.");
  }
  function vender(id, qtd = 1) {
    const item = getItem(id);
    if (!item) return resultadoFalha("Item inválido.");
    if (!quantidadeValida(qtd)) return resultadoFalha("Quantidade inválida.");
    const estado = ler();
    if ((estado.inventario[id] || 0) < qtd) return resultadoFalha("Quantidade insuficiente no inventário.");
    const valor = Math.floor(item.preco * PRECO_REVENDA) * qtd;
    if (!Number.isSafeInteger(valor) || !Number.isSafeInteger(estado.moedas + valor)) {
      return resultadoFalha("O valor da venda excede o limite seguro.");
    }
    estado.inventario[id] -= qtd;
    if (!estado.inventario[id]) delete estado.inventario[id];
    Object.keys(estado.equipados).forEach((slot) => {
      if (estado.equipados[slot] === id && !estado.inventario[id]) estado.equipados[slot] = null;
    });
    estado.moedas += valor;
    return salvar(estado) ? { ok: true, motivo: "", valor } : resultadoFalha("Não foi possível salvar a venda.");
  }
  function getQuantidade(id) { return ler().inventario[id] || 0; }
  function getInventario() { return { ...ler().inventario }; }
  function equipar(id) {
    const item = getItem(id);
    if (!item || !item.slot) return resultadoFalha("Este item não pode ser equipado.");
    const estado = ler();
    if ((estado.inventario[id] || 0) < 1) return resultadoFalha("Você não possui este item.");
    estado.equipados[item.slot] = id;
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar o equipamento.");
  }
  function desequipar(slot) {
    if (!["espada", "escudo", "armadura"].includes(slot)) return resultadoFalha("Slot inválido.");
    const estado = ler();
    if (!estado.equipados[slot]) return resultadoFalha("Este slot já está vazio.");
    estado.equipados[slot] = null;
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar o equipamento.");
  }
  function usarItem(id) {
    const item = getItem(id);
    if (!item || !item.consumivel) return resultadoFalha("Este item não é consumível.");
    const estado = ler();
    if ((estado.inventario[id] || 0) < 1) return resultadoFalha("Você não possui este item.");
    estado.inventario[id] -= 1;
    if (!estado.inventario[id]) delete estado.inventario[id];
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar o uso do item.");
  }
  function resetar() {
    return salvar(inicial()) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível resetar o estado.");
  }
  function importarEstado(moedas, itens) {
    if (!Number.isSafeInteger(moedas) || moedas < 0 || !Array.isArray(itens)) {
      return resultadoFalha("Os dados importados são inválidos.");
    }
    const estado = inicial();
    estado.moedas = moedas;
    for (const antigo of itens) {
      if (!antigo || typeof antigo !== "object") return resultadoFalha("O inventário importado contém um item inválido.");
      const id = aliases[antigo.id] || aliases[`${antigo.categoria}:${antigo.nome}`] || aliases[antigo.nome];
      if (!id || !Number.isSafeInteger(antigo.quantidade) || antigo.quantidade < 1) {
        return resultadoFalha("O inventário importado contém um item inválido.");
      }
      const quantidade = (estado.inventario[id] || 0) + antigo.quantidade;
      if (!Number.isSafeInteger(quantidade)) return resultadoFalha("A quantidade importada excede o limite.");
      estado.inventario[id] = quantidade;
    }
    return salvar(estado) ? { ok: true, motivo: "" } : resultadoFalha("Não foi possível salvar os dados importados.");
  }
  function getBonus() {
    const estado = ler();
    return Object.values(estado.equipados).reduce((bonus, id) => {
      const item = id && catalogo[id];
      if (item && item.bonus) Object.keys(item.bonus).forEach((chave) => { bonus[chave] = (bonus[chave] || 0) + item.bonus[chave]; });
      return bonus;
    }, { ataque: 0, defesa: 0 });
  }

  window.Jogo = Object.freeze({
    catalogo, CHAVE, PRECO_REVENDA, getItem, getIcone, getEstado: ler, getMoedas, definirMoedas, getVida, definirVida, adicionarMoedas, podeComprar,
    comprar, vender, getQuantidade, getInventario, equipar, desequipar, usarItem,
    resetar, importarEstado, getBonus,
  });

  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVE) {
      const estadoAba = lerEstadoDaAba();
      if (estadoAba) {
        if (evento.newValue === null) delete estadoAba.valores[CHAVE];
        else estadoAba.valores[CHAVE] = evento.newValue;
        salvarEstadoDaAba(estadoAba);
      }
      ler();
      window.dispatchEvent(new CustomEvent("estado-mudou"));
    }
  });
  function atualizarValoresVinculados() {
    const estado = ler();
    const saldo = estado.moedas.toLocaleString("pt-BR");
    ["saldoValor", "moedas"].forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.textContent = saldo;
    });
    document.querySelectorAll("[data-jogo-moedas]").forEach((elemento) => {
      elemento.textContent = saldo;
    });
    const bonus = Object.values(estado.equipados).reduce((total, id) => {
      const item = id && catalogo[id];
      if (item && item.bonus) {
        total.ataque += item.bonus.ataque || 0;
        total.defesa += item.bonus.defesa || 0;
      }
      return total;
    }, { ataque: 0, defesa: 0 });
    document.querySelectorAll(".atributos .atributo").forEach((linha) => {
      const spans = linha.querySelectorAll("span");
      const barra = linha.querySelector(".barra > div");
      if (spans.length < 2) return;
      const etiqueta = spans[0].textContent.toLowerCase();
      const valorEl = spans[spans.length - 1];
      if (linha.dataset.jogoBase === undefined) {
        linha.dataset.jogoBase = String(Number(valorEl.textContent.trim()) || 0);
      }
      let valor = Number(linha.dataset.jogoBase);
      if (etiqueta.includes("atk")) valor += bonus.ataque;
      else if (etiqueta.includes("def")) valor += bonus.defesa;
      else if (etiqueta.includes("vida")) valor = estado.vida;
      valorEl.textContent = String(valor);
      if (barra) barra.style.width = `${Math.max(0, Math.min(100, valor))}%`;
    });
  }
  window.addEventListener("estado-mudou", atualizarValoresVinculados);
  ler();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", atualizarValoresVinculados, { once: true });
  } else {
    atualizarValoresVinculados();
  }
})();
