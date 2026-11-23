/* Compatibilidade para páginas antigas: inventário e compras delegam ao Jogo. */
(() => {
  if (!window.Jogo) throw new Error("Carregue estado.js antes de inventario.js.");

  function localizar(produto, categoria) {
    if (produto && produto.id && window.Jogo.getItem(produto.id)) {
      return window.Jogo.getItem(produto.id);
    }
    return Object.values(window.Jogo.catalogo).find((item) =>
      item.nome === (produto && produto.nome) &&
      (!categoria || item.categoria === categoria),
    ) || null;
  }

  function listar() {
    return Object.entries(window.Jogo.getInventario()).map(([id, quantidade]) => {
      const item = window.Jogo.getItem(id);
      return {
        id,
        nome: item.nome,
        categoria: item.categoria,
        imagem: window.Jogo.getIcone(id),
        preco: item.preco,
        quantidade,
      };
    });
  }

  function registrarCompra(produto, categoria) {
    const item = localizar(produto, categoria);
    if (!item) return { sucesso: false, motivo: "Item inválido.", saldo: window.Jogo.getMoedas() };
    const resultado = window.Jogo.comprar(item.id, 1);
    return {
      sucesso: resultado.ok,
      motivo: resultado.motivo,
      saldo: window.Jogo.getMoedas(),
    };
  }

  function vender(id, quantidade = 1) {
    const item = window.Jogo.getItem(id) ||
      Object.values(window.Jogo.catalogo).find((candidato) => `${candidato.categoria}:${candidato.nome}` === id);
    if (!item) {
      return { sucesso: false, motivo: "Item inválido.", saldo: window.Jogo.getMoedas() };
    }
    const resultado = window.Jogo.vender(item.id, quantidade);
    return {
      sucesso: resultado.ok,
      motivo: resultado.motivo,
      valor: resultado.valor || 0,
      saldo: window.Jogo.getMoedas(),
    };
  }

  window.InventarioLoja = Object.freeze({
    CHAVE: window.Jogo.CHAVE,
    calcularValorRevenda(preco) {
      const valor = Number(preco);
      if (!Number.isFinite(valor) || valor < 0) throw new TypeError("O preço do item é inválido para revenda.");
      return Math.floor(valor * window.Jogo.PRECO_REVENDA);
    },
    listar,
    registrarCompra,
    vender,
  });
})();
