// Animate in
window.onload = showSlider;

function showSlider() {
  TweenMax.from('.slider__body', 2, {
    y: '150%',
    rotationX: 100,
    scaleX: 1.3,
    ease: Expo.easeOut
  });

  TweenMax.staggerFrom('.slider-ui', 0.8, {
    opacity: 0,
    delay: 0.6,
    rotationX: 30,
    y: 20
  });
}

// Detect scroll direction
function detectMouseWheelDirection(e) {
  var delta = null,
    direction = false;
  if (!e) {
    // if the event is not provided, we get it from the window object
    e = window.event;
  }
  if (e.wheelDelta) {
    // will work in most cases
    delta = e.wheelDelta / 60;
  } else if (e.detail) {
    // fallback for Firefox
    delta = -e.detail / 2;
  }
  if (delta !== null) {
    direction = delta > 0 ? 'up' : 'down';
  }

  return direction;
}

var scrollCounter = 0;

function handleMouseWheelDirection(direction) {
  if (scrollCounter % 50 == 0) {
    if (direction == 'down') {
      showNextSlide();
    } else if (direction == 'up') {
      showPrevSlide();
    } else {
      // this means the direction of the mouse wheel could not be determined
    }
  }

  scrollCounter++;
}

document.onmousewheel = function (e) {
  handleMouseWheelDirection(detectMouseWheelDirection(e));
};
if (window.addEventListener) {
  document.addEventListener('DOMMouseScroll', function (e) {
    handleMouseWheelDirection(detectMouseWheelDirection(e));
  });
}

// Set DOM
const SLIDER_DOM = {
  images: document.querySelectorAll('.slider__img'),
  titles: document.querySelectorAll('.slider__title'),
  displayTitle: document.querySelector('.slider-display-title'),
  desc: document.querySelectorAll('.slider__desc')
};

// Set vars
let activeSlideCount = 0;
let nextSlide = activeSlideCount + 1;
let activeSlide = SLIDER_DOM.images[activeSlideCount];
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz#%&^+=-';

// Fns
const hideImages = () => SLIDER_DOM.images.forEach(i => {
  (
    TweenMax.to(i, 0, {
      opacity: 0,
      y: 0,
      rotationX: 0,
      scale: 1
    })
  )
});

function showCurrentImage() {
  TweenMax.to(SLIDER_DOM.images[activeSlideCount], .2, {
    y: 30,
    opacity: 1,
    rotationX: 100,
    scale: 1.1
  })
}

function showCurrentDesc() {
  TweenMax.to(SLIDER_DOM.desc[activeSlideCount], .6, {
    x: 0,
    opacity: 1,
    rotationY: 0
  })
}

const hideCurrentDesc = () => SLIDER_DOM.desc.forEach(i => {
  (
    TweenMax.to(i, 0, {
      x: -100,
      opacity: 0,
    })
  )
});

function checkIfSlidesEnded() {
  if (SLIDER_DOM.images.length == activeSlideCount) activeSlideCount = 0;
}

function checkIfSlidesPreceeded() {
  if (activeSlideCount === -1) activeSlideCount = SLIDER_DOM.images.length - 1;
}

function showCurrentTitle() {
  var currentTitle = SLIDER_DOM.displayTitle;
  var nextTitle = SLIDER_DOM.titles[activeSlideCount].innerText;

  // var r = Math.floor(Math.random() * CHARACTERS.length);
  // var randomChar = CHARACTERS[r];
  currentTitle.innerText = nextTitle;
}

// Init
hideImages();
showCurrentImage();
showCurrentDesc();
hideCurrentDesc();

// Control slides
function showNextSlide() {
  activeSlideCount++;
  checkIfSlidesEnded();

  hideImages();
  showCurrentImage();
  showCurrentDesc()
  showCurrentTitle();
  hideCurrentDesc();

  clearInterval(slideTimer);
  slideTimer = setInterval(showNextSlide, 7000);
}

function showPrevSlide() {
  activeSlideCount--;
  checkIfSlidesPreceeded();
  hideImages();
  showCurrentDesc();
  showCurrentImage();
  showCurrentTitle();
  hideCurrentDesc();
}

// Autoplay
let slideTimer = setInterval(showNextSlide, 7000);