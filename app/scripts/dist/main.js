function detectMouseWheelDirection(e) {
  var delta = null,
    direction = false;
  if (!e) { // if the event is not provided, we get it from the window object
    e = window.event;
  }
  if (e.wheelDelta) { // will work in most cases
    delta = e.wheelDelta / 60;
  } else if (e.detail) { // fallback for Firefox
    delta = -e.detail / 2;
  }
  if (delta !== null) {
    direction = delta > 0 ? 'up' : 'down';
  }

  return direction;
}

function handleMouseWheelDirection(direction) {
  console.log(direction); // see the direction in the console
  if (direction == 'down') {
    nextSlide()
  } else if (direction == 'up') {
    prevSlide();
  } else {
    // this means the direction of the mouse wheel could not be determined
  }
}
document.onmousewheel = function (e) {
  handleMouseWheelDirection(detectMouseWheelDirection(e));
};
if (window.addEventListener) {
  document.addEventListener('DOMMouseScroll', function (e) {
    handleMouseWheelDirection(detectMouseWheelDirection(e));
  });
}

function nextSlide() {
  let activeSlide = 0;

  const SLIDER_IMAGES = document.querySelectorAll('.slider__img');
  SLIDER_IMAGES[activeSlide].classList.remove('active');
  SLIDER_IMAGES[activeSlide + 1].classList.add('active');

  activeSlide++
  console.log(activeSlide);

  // if (activeSlide >= SLIDER_IMAGES.length) activeSlide = 0;

}

function prevSlide() {

  // const SLIDER_IMAGES = document.querySelectorAll('.slider__img');
  // SLIDER_IMAGES[1].classList.remove('active');
  // SLIDER_IMAGES[0].classList.add('active');

}