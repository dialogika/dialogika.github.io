const slider = document.querySelector('.sliders-gallery-ipsum');

if (slider) {
  const AUTOPLAY_DELAY = 3200;
  let autoplayTimer;

  function moveNext() {
    const items = slider.querySelectorAll('.item-gallery-sliders');
    if (!items.length) {
      return;
    }
    slider.append(items[0]);
  }

  function movePrev() {
    const items = slider.querySelectorAll('.item-gallery-sliders');
    if (!items.length) {
      return;
    }
    slider.prepend(items[items.length - 1]);
  }

  function startAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(moveNext, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
  }

  function activate(e) {
    if (e.target.closest('.next-gallery')) {
      moveNext();
      startAutoplay();
    }

    if (e.target.closest('.prev-gallery')) {
      movePrev();
      startAutoplay();
    }
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  document.addEventListener('click', activate, false);
  startAutoplay();
}