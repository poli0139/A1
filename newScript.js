//IMPORTS
import { Easings } from "https://unpkg.com/ixfx/dist/modulation.js";
import { interpolate } from "https://unpkg.com/ixfx/dist/data.js";
import { integer } from "https://unpkg.com/ixfx/dist/random.js";

//SETTINGS - define parameters that don't change

const settings = {
  element: document.querySelector("#sample-output"),
  easingType: "expoInOut",
};

//STATE - define parameters that change

let state = {
  hover: false,
  ballPosition: {
    direction: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  },

  easing: Easings.tick(settings.easingType, 100),
  translate: {
    x: 0,
    y: 0,
  },
};

//LOOP - transforms state data into visual output. run once every time the animation should be updated

function loop() {
  const { hover, ballPosition, speed, easing, translate } = state;
  const { element } = settings;
  let ease = easing.compute();

  //THIRD METHOD
  if (hover) {
    // generateDirection();
    let ease = easing.compute();
    // let x = interpolate(ease, ballPosition.direction.x, ballPosition.current.x);
    // let y = interpolate(ease, ballPosition.direction.y, ballPosition.current.y);
    translate.x = ballPosition.direction.x - ballPosition.current.x;
    translate.y = ballPosition.direction.y - ballPosition.current.y;
    // console.log("TRANSLATE", ballPosition.direction.x - ballPosition.current.x);
    // console.log("CURRENT", ballPosition.current.x);
    // console.log("DIRECTION", ballPosition.direction.x);
    // console.log(ballPosition.direction.x - ballPosition.current.x);
    element.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
    // console.log("TRANSLATE", translate.x, translate.y);
    // console.log(ballPosition.direction);
  }
  window.requestAnimationFrame(loop);
}

//OTHER FUNCTIONS

function generateDirection() {
  //   console.log("CURRENT", current.x);
  const { ballPosition, translate } = state;
  //   const { element } = settings;

  //define a wall
  let firstWall = integer({ max: 4, min: 0 });
  if (firstWall === 0) {
    ballPosition.direction.x = integer({ max: window.innerWidth, min: 0 });
    ballPosition.direction.y === 0;
  } else if (firstWall === 1) {
    ballPosition.direction.x = window.innerWidth;
    ballPosition.direction.y = integer({ max: window.innerHeight, min: 0 });
  } else if (firstWall === 2) {
    ballPosition.direction.x = integer({ max: window.innerWidth, min: 0 });
    ballPosition.direction.y === window.innerHeight;
  } else if (firstWall === 3) {
    ballPosition.direction.x === 0;
    ballPosition.direction.y = integer({ max: window.innerHeight, min: 0 });
  }
  //   console.log("TRANSLATE", ballPosition.direction.x - current.x);
  //   console.log("DIRECTION IS", ballPosition.direction);
  return ballPosition.direction;
}

//SETUP - run once a the beginning of the program. initialises event handlers, sets initial CSS/ HTML properties from code, and starts the loop

function setup() {
  const { element, easingType } = settings;
  //   const { hover, ballPosition, easing } = state;
  //   state.ballPosition.current = state.ballPosition.direction;

  element.addEventListener("pointerover", function (pointerEvent) {
    state.hover = true;
    // state.ballPosition.current = state.ballPosition.direction;
    state.ballPosition.direction = generateDirection();
    state.ballPosition.current = pointerEvent;
    state.easing = Easings.tick(easingType, 100);
    console.log(
      "CURRENT",
      state.ballPosition.current.x,
      state.ballPosition.current.y
    );
    console.log("DIRECTION", state.ballPosition.direction);
  });
  element.addEventListener("pointerout", function (pointerEvent) {
    state.hover = false;
    // state.ballPosition.current = state.ballPosition.direction;
  });

  //   state.easing = Easings.tick(easingType, 100);

  loop();
}

setup();
