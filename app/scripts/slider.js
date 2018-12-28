window.onload = showSlider

function showSlider() {
  TweenMax.from('.slider__body', 2, {
    y: '150%',
    ease: Expo.easeOut
  })

  TweenMax.staggerFrom('.slider-ui', 1, {
    opacity: 0,
    delay: .5,
    y: 20
  })
}


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

var scrollCounter = 0

function handleMouseWheelDirection(direction) {

  if (scrollCounter % 50 == 0) {
    if (direction == 'down') {
      showNextSlide()
    } else if (direction == 'up') {
      showPrevSlide()
    } else {
      // this means the direction of the mouse wheel could not be determined
    }
  }

  scrollCounter++
}

document.onmousewheel = function (e) {
  handleMouseWheelDirection(detectMouseWheelDirection(e));
};
if (window.addEventListener) {
  document.addEventListener('DOMMouseScroll', function (e) {
    handleMouseWheelDirection(detectMouseWheelDirection(e));
  });
}

let activeSlideCount = 0;
let nextSlide = activeSlideCount + 1;
const SLIDER_IMAGES = document.querySelectorAll('.slider__img');
const SLIDER_TITLES = document.querySelectorAll('.slider__title');
let SLIDER_TITLE = document.querySelector('.slider-display-title');
let activeSlide = SLIDER_IMAGES[activeSlideCount];

const hideImages = () => SLIDER_IMAGES.forEach(i => i.style.opacity = 0);
const showCurrentImage = () => SLIDER_IMAGES[activeSlideCount].style.opacity = 1;
const checkIfSlidesEnded = () => {
  if (SLIDER_IMAGES.length == activeSlideCount) activeSlideCount = 0
}
const checkIfSlidesPreceeded = () => {
  if (activeSlideCount === -1) activeSlideCount = SLIDER_IMAGES.length - 1
}

const showCurrentText = () => {
  SLIDER_TITLE.innerText = SLIDER_TITLES[activeSlideCount].innerText
}

hideImages();
showCurrentImage();

function showNextSlide() {
  activeSlideCount++
  checkIfSlidesEnded();

  hideImages();
  showCurrentImage();

  showCurrentText();
}

function showPrevSlide() {
  activeSlideCount--
  checkIfSlidesPreceeded();
  hideImages();
  showCurrentImage();
  showCurrentText();
}

setInterval(showNextSlide, 7000);