const swiper = new Swiper('.swiper', {
    // Optional parameters
    slidesPerView: "auto",
    spaceBetween: 32,
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: "auto",
        spaceBetween: 16,
        centeredSlides: true,
      },
      // when window width is >= 800px
      800: {
        slidesPerView: "auto",
        spaceBetween: 20,
        centeredSlides: true,
      },
      // when window width is >= 640px
      1300: {
        slidesPerView: "auto",
        spaceBetween: 32,
      }
    }
});