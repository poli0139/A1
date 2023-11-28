import { scale } from "https://unpkg.com/ixfx/dist/data.js";
import { interpolate } from "https://unpkg.com/ixfx/dist/data.js";
import { Easings } from "https://unpkg.com/ixfx/dist/modulation.js";
import { integer } from "https://unpkg.com/ixfx/dist/random.js";

const settings = {
  element: document.querySelector("#sample-output"),
  easingType: "quadOut",
};

let state = {
  pointer: {
    current: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    generated: { x: 0, y: 0 },
    fromWall: 0,
    toWall: 0,
  },
  easingTime: 800,
  easing: Easings.time(settings.easingType, 800),
  isMoving: false,
};

function loop() {
  // Get variables
  let { pointer, easing, easingTime } = state;
  const { element, easingType } = settings;
  let ease = easing.compute();
  let x = interpolate(ease, pointer.last.x, pointer.current.x);
  let y = interpolate(ease, pointer.last.y, pointer.current.y);
  element.style.transform = `translate(${x}px, ${y}px)`;

  if (
    x <= 0 ||
    x >= window.innerWidth - element.offsetWidth ||
    y <= 0 ||
    y >= window.innerHeight - element.offsetHeight
  ) {
    // Reverse the direction

    pointer.last = element.getBoundingClientRect();
    state.pointer.current = generateDirection();
    state.pointer.fromWall = state.pointer.toWall;
    easingTime = slowDown(easingTime);
    console.log("EASETIME", easingTime);
    state.easing = Easings.time(easingType, easingTime);
    if (easingTime >= 3000) {
      state.pointer.current = state.pointer.last;
    }
  }
  window.requestAnimationFrame(loop);
}
function generateDirection() {
  let { pointer } = state;
  const { element } = settings;
  let ballWidth = element.offsetWidth;
  let ballHeight = element.offsetHeight;

  //define a wall
  // let firstWall = integer({ max: 4, min: 0 });
  pointer.toWall = generateWall(pointer.fromWall);
  if (pointer.toWall === 0) {
    pointer.generated.x = integer({
      max: window.innerWidth - ballWidth,
      min: 0,
    });
    pointer.generated.y = 0;
  } else if (pointer.toWall === 1) {
    pointer.generated.x = window.innerWidth - ballWidth;
    pointer.generated.y = integer({
      max: window.innerHeight - ballHeight,
      min: 0,
    });
  } else if (pointer.toWall === 2) {
    pointer.generated.x = integer({
      max: window.innerWidth - ballWidth,
      min: 0,
    });
    pointer.generated.y = window.innerHeight - ballHeight;
  } else if (pointer.toWall === 3) {
    pointer.generated.x = 0;
    pointer.generated.y = integer({
      max: window.innerHeight - ballHeight,
      min: 0,
    });
  }
  console.log(
    "GENERATED",
    pointer.generated.x,
    pointer.generated.y,
    "FROM THE WALL ",
    pointer.toWall
  );
  return pointer.generated;
}
function generateWall(currentWall) {
  let newWall = integer({ max: 4, min: 0 });
  if (newWall === currentWall) {
    console.log("SAME WALL");
    newWall++;
    if (newWall === 4) {
      console.log("WALL 5");
      integer({ max: 2, min: 0 });
    }
    return newWall;
  } else {
    return newWall;
  }
}
function slowDown(n) {
  state.easingTime = n + 200;
  return state.easingTime;
}

function setup() {
  // Get relevant variables
  const { easingType, element } = settings;

  // Set up event handlers
  element.addEventListener("pointerover", function (pointerEvent) {
    state.isMoving = true;
    state.pointer.last = element.getBoundingClientRect();
    state.pointer.current = generateDirection();
    state.pointer.fromWall = state.pointer.toWall;
    console.log("CURRENT", state.pointer.current);
    state.easingTime = 800;
    state.easing = Easings.time(easingType, state.easingTime);
    loop();
  });

  console.log("WINDOW", window.innerWidth, window.innerHeight);
  // Start loop

  // loop();
}

setup();
