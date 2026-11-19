document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".character-card");
  const backButton = document.getElementById("backButton");

  cards.forEach((card) => {
    const btn = card.querySelector(".select-button");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      cards.forEach((c) => {
        c.classList.remove("selected");
        const otherBtn = c.querySelector(".select-button");
        const otherSpan = otherBtn ? otherBtn.querySelector("span") : null;
        if (otherBtn) otherBtn.setAttribute("aria-pressed", "false");
        if (otherSpan) otherSpan.textContent = "Selecionar";
      });

      card.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");
      const span = btn.querySelector("span");
      if (span) span.textContent = "Selecionado ✓";

      const id = card.dataset.characterId;
      const nome = card.dataset.characterName;

      localStorage.setItem("personagemSelecionadoId", id);
      localStorage.setItem("personagemSelecionadoNome", nome);

      console.log(`Vilão selecionado: ${nome} (${id})`);
    });
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "./TelaInicial2.html";
    });
  }
});