"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const warning = document.getElementById("assetWarning");

  const characterCards = [
    ...document.querySelectorAll(".character-card")
  ];

  const backButton = document.getElementById("backButton");


  // =====================================
  // VERIFICAÇÃO DAS IMAGENS
  // =====================================

  function reportImageError(image, description) {

    const source = image.getAttribute("src");

    console.error(
      `[Tela de Vilões] Não foi possível carregar ${description}: ${source}`
    );

    if (warning) {

      warning.hidden = false;

      warning.textContent =
        `Não foi possível carregar ${description}. ` +
        `Confira se o caminho e o nome do arquivo estão iguais aos da pasta Imagens.`;
    }
  }


  // Verifica o cenário

  const background = document.querySelector(".scene-background");

  background?.addEventListener("error", () => {

    reportImageError(
      background,
      "a imagem de fundo"
    );

  }, { once: true });


  // Verifica os personagens

  document.querySelectorAll(".character-image").forEach((image) => {

    image.addEventListener("error", () => {

      const characterCard = image.closest(".character-card");

      const characterName =
        characterCard?.dataset.characterName || "o personagem";

      const fallback = document.createElement("div");

      fallback.className = "image-fallback";

      fallback.textContent =
        `Imagem de ${characterName} não encontrada. Confira o caminho informado no HTML.`;

      image.replaceWith(fallback);

      reportImageError(
        image,
        `a imagem de ${characterName}`
      );

    }, { once: true });

  });


  // Verifica o botão voltar

  const backImage = document.querySelector(".back-button-image");

  backImage?.addEventListener("error", () => {

    reportImageError(
      backImage,
      "a imagem do botão voltar"
    );

  }, { once: true });


  // =====================================
  // SISTEMA DE SELEÇÃO
  // =====================================

  function applySelection(characterId) {

    characterCards.forEach((card) => {

      const isSelected =
        card.dataset.characterId === characterId;

      card.classList.toggle(
        "is-selected",
        isSelected
      );

      card.querySelector(".select-button")
        ?.setAttribute(
          "aria-pressed",
          String(isSelected)
        );

    });

  }


  // =====================================
  // INICIA SEM NENHUM PERSONAGEM SELECIONADO
  // =====================================

  applySelection(null);

  // Limpa uma seleção antiga ao entrar na tela
  try {

    localStorage.removeItem("personagemSelecionado");

  } catch (error) {

    console.warn(
      "Não foi possível limpar a seleção anterior.",
      error
    );

  }


  // =====================================
  // CLIQUE NOS BOTÕES
  // =====================================

  characterCards.forEach((card) => {

    const selectButton =
      card.querySelector(".select-button");

    selectButton?.addEventListener("click", () => {

      const character = {

        id: card.dataset.characterId,

        nome: card.dataset.characterName

      };


      // Atualiza o personagem selecionado

      applySelection(character.id);


      // Salva a escolha no navegador

      try {

        localStorage.setItem(
          "personagemSelecionado",
          JSON.stringify(character)
        );

      } catch (error) {

        console.warn(
          "Não foi possível salvar a seleção no armazenamento local.",
          error
        );

      }


      // Comunica a seleção para outras telas

      window.dispatchEvent(
        new CustomEvent("vilaoSelecionado", {
          detail: character
        })
      );

    });

  });


  // =====================================
  // BOTÃO VOLTAR
  // =====================================

  backButton?.addEventListener("click", () => {

    if (window.history.length > 1) {

      window.history.back();

    } else {

      console.warn(
        "Não há uma página anterior no histórico para voltar."
      );

    }

  });

});