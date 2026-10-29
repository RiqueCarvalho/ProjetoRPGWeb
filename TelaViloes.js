$(document).ready(function () {
  let currentIndex = 1; // Começa centralizado no segundo personagem (Bárbaro)
  const $cards = $(".character-card");
  const totalCards = $cards.length;

  function updateCarousel() {
    $cards.removeClass("active");
    const $activeCard = $cards.eq(currentIndex);
    $activeCard.addClass("active");

    const cardWidth = $cards.outerWidth(true);
    const containerWidth = $(".carousel-wrapper").width();

    // Alinha e centraliza o personagem ativo na tela
    const offset =
      -(currentIndex * cardWidth) + containerWidth / 2 - cardWidth / 2;

    $("#carouselTrack").css("transform", `translateX(${offset}px)`);
  }

  // Navegação pelas setas
  $("#btnNext").on("click", function () {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  });

  $("#btnPrev").on("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalCards - 1;
    }
    updateCarousel();
  });

  // Selecionar ao clicar no card lateral
  $cards.on("click", function () {
    currentIndex = $(this).index();
    updateCarousel();
  });

  // Ação ao clicar no botão Selecionar
  $(".btn-select").on("click", function (e) {
    e.stopPropagation();
    const characterName = $(this).closest(".character-card").data("name");
    console.log(`Personagem escolhido: ${characterName}`);
  });

  updateCarousel();

  $(window).on("resize", function () {
    updateCarousel();
  });
});
