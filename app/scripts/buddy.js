// Follow cursor
{
  let mouse = {
    x: 0,
    y: 0
  }; //Cursor position
  let pos = {
    x: 0,
    y: 0
  }; //Cursor position
  let ratio = .05; //delay follow cursor
  let active = false;
  let ball = document.getElementById("ball");

  TweenLite.set(ball, {
    xPercent: -50,
    yPercent: -50
  }); //scale from middle ball

  document.addEventListener("mousemove", mouseMove);

  function mouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  TweenLite.ticker.addEventListener("tick", updatePosition);

  function updatePosition() {
    if (!active) {
      pos.x += (mouse.x - pos.x) * ratio;
      pos.y += (mouse.y - pos.y) * ratio;

      TweenLite.set(ball, {
        x: pos.x,
        y: pos.y
      });
    }
  }
}

const CURSOR = document.querySelector('#ball');
const BODY = document.querySelector('body');

// Cursor growth over links
let noCursorList = [];
let LINKS = document.querySelectorAll('a');

LINKS.forEach(function (elem) {
  elem.addEventListener('mouseenter', cursorOverLink, false);
  elem.addEventListener('mouseleave', cursorAwayLink, false);
});

function cursorOverLink() {
  CURSOR.classList.add('cursor--link-hover')
}

function cursorAwayLink() {
  CURSOR.classList.remove('cursor--link-hover')
}


// Click feedback
BODY.addEventListener('click', cursorClick, false);

function cursorClick() {
  CURSOR.classList.remove("cursor--click");
  void CURSOR.offsetWidth;
  CURSOR.classList.add("cursor--click");
}


// Remove if cursor is out window
document.addEventListener('mouseenter', cursorInWindow, false);
document.addEventListener('mouseleave', cursorOutWindow, false);

function cursorOutWindow() {
  CURSOR.classList.add('cursor--out-window')
}

function cursorInWindow() {
  CURSOR.classList.remove('cursor--out-window')
}