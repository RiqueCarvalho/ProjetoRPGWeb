(() => {
  const CHAVE = "saldo";
  const SALDO_INICIAL = 5000;

  function ler() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === null || salvo === "") {
      localStorage.setItem(CHAVE, String(SALDO_INICIAL));
      return SALDO_INICIAL;
    }

    const valor = Number(salvo);
    return Number.isFinite(valor) && valor >= 0 ? valor : SALDO_INICIAL;
  }

  function salvar(valor) {
    const novoSaldo = Math.max(0, Math.floor(Number(valor) || 0));
    localStorage.setItem(CHAVE, String(novoSaldo));
    window.dispatchEvent(
      new CustomEvent("saldoAtualizado", { detail: novoSaldo }),
    );
    return novoSaldo;
  }

  window.SaldoLoja = { CHAVE, ler, salvar };

  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVE) {
      window.dispatchEvent(
        new CustomEvent("saldoAtualizado", { detail: ler() }),
      );
    }
  });
})();
