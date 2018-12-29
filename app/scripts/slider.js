// Set DOM
const SLIDER_DOM = {
  images: document.querySelectorAll('.slider__img'),
  titles: document.querySelectorAll('.slider__title'),
  displayTitle: document.querySelector('.slider-display-title'),
  desc: document.querySelectorAll('.slider__desc'),
  links: document.querySelectorAll('.slider__link'),
  navs: document.querySelectorAll('.project-nav__item'),
  introLink: document.querySelector('.intro__link'),
  slider: document.querySelector('.slider'),
  intro: document.querySelector('.intro')
};


// Animate in
var sliderActive = false
SLIDER_DOM.introLink.addEventListener('click', function () {

  showSlider();
  console.log('a');

}, false)


// TweenMax.set('.slider__body, .slider-ui', {
//   opacity: 1
// })

function hideSlider() {
  TweenMax.set('.slider__body', {
    y: '150%',
    rotationX: 100,
    scaleX: 1.3,
    opacity: 0
  });

  TweenMax.set('.slider-ui', {
    opacity: 0,
    delay: 0.6,
    rotationX: 30,
    y: 20
  });

  SLIDER_DOM.slider.style.display = 'none'
}

hideSlider();

function showSlider() {
  TweenMax.to('#fade', 2.5, {
    y: '-200%'
  })

  setTimeout(function () {
    SLIDER_DOM.slider.style.display = 'flex'

    TweenMax.to(SLIDER_DOM.intro, 3, {
      y: '150%',
      rotationX: 100,
      scaleX: 1.3,
      opacity: 0
    });


    TweenMax.to('.slider__body', 2, {
      y: '0%',
      rotationX: 0,
      scaleX: 1,
      ease: Expo.easeOut,
      opacity: 1
    });

    TweenMax.staggerTo('.slider-ui', 0.8, {
      opacity: 1,
      delay: 0.6,
      rotationX: 0,
      y: 0
    });
  }, 500)

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
  TweenMax.to(SLIDER_DOM.images[activeSlideCount], .5, {
    y: 30,
    opacity: 1,
    rotationX: 100,
    scale: 1.1,
    ease: Expo.easeIn
  })
}

function showCurrentDesc() {
  TweenMax.to(SLIDER_DOM.desc[activeSlideCount], 1, {
    x: 0,
    opacity: 1,
    rotationY: 0,
    delay: .5
  })
}

const hideCurrentDesc = () => SLIDER_DOM.desc.forEach(i => {
  (
    TweenMax.to(i, .5, {
      x: -100,
      opacity: 0,
    })
  )
});

const changeUrl = () => {
  SLIDER_DOM.links.forEach(i => i.style.display = 'none');
  SLIDER_DOM.links[activeSlideCount].style.display = 'block';
}

function showActiveNav() {
  SLIDER_DOM.navs.forEach(i => i.classList.remove('project-nav__item--active'));
  SLIDER_DOM.navs[activeSlideCount].classList.add('project-nav__item--active');
}

function checkIfSlidesEnded() {
  if (SLIDER_DOM.images.length == activeSlideCount) activeSlideCount = 0;
}

function checkIfSlidesPreceeded() {
  if (activeSlideCount === -1) activeSlideCount = SLIDER_DOM.images.length - 1;
}

function showCurrentTitle() {
  var currentTitle = SLIDER_DOM.displayTitle;
  var nextTitle = SLIDER_DOM.titles[activeSlideCount].innerText;


  const gen = () => currentTitle.innerText = getRandString(nextTitle);
  var genText = setInterval(gen, 100);
  setTimeout(function () {
    clearInterval(genText)
    currentTitle.innerText = nextTitle
  }, 1000)
}

const getRandString = str => {
  let temp = [];
  for (let i = 0; i < str.length; i++) {
    var r = Math.floor(Math.random() * CHARACTERS.length);
    var randomChar = CHARACTERS[r];
    temp.push(randomChar)
  }
  return temp.join('');
}

// Init
function init() {
  hideImages();
  showCurrentImage();
  showCurrentDesc();
  hideCurrentDesc();
  showCurrentTitle();
  changeUrl();
  showActiveNav();
  changeUrl();
}

init();

// Control slides
function showNextSlide() {
  activeSlideCount++;
  checkIfSlidesEnded();
  init();
  // Reset slide timer
  clearInterval(slideTimer);
  slideTimer = setInterval(showNextSlide, 7000);
}

function showPrevSlide() {
  activeSlideCount--;
  checkIfSlidesPreceeded();
  init();
  // Reset slide timer
  clearInterval(slideTimer);
  slideTimer = setInterval(showNextSlide, 7000);
}

// Control slides
function chooseSlide(e) {
  activeSlideCount = e.target.dataset.index
  init();
  // Reset slide timer
  clearInterval(slideTimer);
  slideTimer = setInterval(showNextSlide, 7000);
}

SLIDER_DOM.navs.forEach(i => i.addEventListener('click', chooseSlide))

// Autoplay
let slideTimer = setInterval(showNextSlide, 7000);


window.addEventListener('keydown', checkKey, false);

function checkKey(e) {
  if (e.keyCode === 38) showPrevSlide();
  if (e.keyCode === 40) showNextSlide();
}



// Intro
TweenMax.staggerFrom('.intro__text', 2, {
  opacity: 0,
  delay: .5,
  blur: 10
})

TweenMax.from('.intro__ghost-face', 2, {
  opacity: 0,
  delay: 1,
  blur: 10
})

TweenMax.from('.intro__body p', 1, {
  opacity: 0,
  blur: 10,
  delay: 2,
  y: 30
})

TweenMax.from('.intro__logo', 1, {
  opacity: 0,
  blur: 10,
  delay: 2.5,
  y: 30,
})

TweenMax.from('.intro__link', 1, {
  opacity: 0,
  blur: 10,
  delay: 3,
  y: 30,
})