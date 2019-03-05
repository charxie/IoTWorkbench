/*
 * @author Charles Xie
 *
 */

'use strict';

let database;

let canvas;
let gridSize = 50;
let linechart;
let temperature = [];

let board;
let redLedLight;
let greenLedLight;
let blueLedLight;
let buttonA;
let buttonB;
let buttonC;
let temperatureSensor;
let barometricPressureSensor;
let mouseMoveObject;
let stateId = 'rainbow_hat_default';

function init() {

  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyAT_mdZ9yMGg6BWkB1NWPIqAjXtP4cBwcA",
    authDomain: "raspberry-pi-java.firebaseapp.com",
    databaseURL: "https://raspberry-pi-java.firebaseio.com",
    projectId: "raspberry-pi-java",
    storageBucket: "raspberry-pi-java.appspot.com",
    messagingSenderId: "498912746820"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  database = firebase.database();
  database.ref().on("value", function (snapshot) {
    snapshot.forEach(function (child) {
      let childData = child.val();
      redLedLight.on = childData.redLed;
      greenLedLight.on = childData.greenLed;
      blueLedLight.on = childData.blueLed;
      temperature.push(childData.temperature);
      draw();
    });
  });


  canvas = document.getElementById("board");
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  resizeCanvas();

  board = new Board("rainbow_hat", 10, 10, 481, 321);
  redLedLight = new LedLight(board, 'red', 100, 258, 18, 8);
  greenLedLight = new LedLight(board, 'green', 182, 258, 18, 8);
  blueLedLight = new LedLight(board, 'blue', 264, 258, 18, 8);
  buttonA = new Button(board, 72, 270, 72, 22);
  buttonB = new Button(board, 155, 270, 72, 22);
  buttonC = new Button(board, 238, 270, 72, 22);
  temperatureSensor = new Sensor(board, 186, 133, 10, 10);
  barometricPressureSensor = new Sensor(board, 228, 141, 8, 8);

  linechart = new LineChart("linechart", "Temperature", temperature, 36, 39);

  draw();

  window.addEventListener('resize', resize, false); // resize the canvas to fill browser window dynamically

  document.title = SOFTWARE.name + ' (' + SOFTWARE.abbreviation + ')' + ' - ' + SOFTWARE.version;
  document.getElementById('name-label').innerHTML = SOFTWARE.name;
  document.getElementById('version-label').innerHTML = SOFTWARE.version;
  document.getElementById('credit').innerHTML = SOFTWARE.name + ' ' + SOFTWARE.version + ', The Engineering Computation Laboratory, Concord Consortium, &copy; ' + new Date().getFullYear();

}

function mouseDown(e) {

  e.preventDefault();

  let ctx = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (redLedLight.toggle(x - board.x, y - board.y)) {
    redLedLight.draw(ctx);
    database.ref(stateId).update({redLed: redLedLight.on});
    return;
  }

  if (greenLedLight.toggle(x - board.x, y - board.y)) {
    greenLedLight.draw(ctx);
    database.ref(stateId).update({greenLed: greenLedLight.on});
    return;
  }

  if (blueLedLight.toggle(x - board.x, y - board.y)) {
    blueLedLight.draw(ctx);
    database.ref(stateId).update({blueLed: blueLedLight.on});
    return;
  }

  if (buttonA.inside(x - board.x, y - board.y)) {
    buttonA.on = true;
    buttonA.draw(ctx);
    redLedLight.on = true;
    redLedLight.draw(ctx);
    database.ref(stateId).update({redLed: true});
    return;
  }

  if (buttonB.inside(x - board.x, y - board.y)) {
    buttonB.on = true;
    buttonB.draw(ctx);
    greenLedLight.on = true;
    greenLedLight.draw(ctx);
    database.ref(stateId).update({greenLed: true});
    return;
  }

  if (buttonC.inside(x - board.x, y - board.y)) {
    buttonC.on = true;
    buttonC.draw(ctx);
    blueLedLight.on = true;
    blueLedLight.draw(ctx);
    database.ref(stateId).update({blueLed: true});
    return;
  }

}

function mouseUp(e) {

  e.preventDefault();

  let ctx = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (buttonA.inside(x - board.x, y - board.y)) {
    buttonA.on = false;
    buttonA.draw(ctx);
    redLedLight.on = false;
    redLedLight.draw(ctx);
    database.ref(stateId).update({redLed: false});
    return;
  }

  if (buttonB.inside(x - board.x, y - board.y)) {
    buttonB.on = false;
    buttonB.draw(ctx);
    greenLedLight.on = false;
    greenLedLight.draw(ctx);
    database.ref(stateId).update({greenLed: false});
    return;
  }

  if (buttonC.inside(x - board.x, y - board.y)) {
    buttonC.on = false;
    buttonC.draw(ctx);
    blueLedLight.on = false;
    blueLedLight.draw(ctx);
    database.ref(stateId).update({blueLed: false});
    return;
  }

}

function mouseMove(e) {

  e.preventDefault();

  let ctx = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (redLedLight.inside(x - board.x, y - board.y)) {
    mouseMoveObject = redLedLight;
  } else if (greenLedLight.inside(x - board.x, y - board.y)) {
    mouseMoveObject = greenLedLight;
  } else if (blueLedLight.inside(x - board.x, y - board.y)) {
    mouseMoveObject = blueLedLight;
  } else if (buttonA.inside(x - board.x, y - board.y)) {
    mouseMoveObject = buttonA;
  } else if (buttonB.inside(x - board.x, y - board.y)) {
    mouseMoveObject = buttonB;
  } else if (buttonC.inside(x - board.x, y - board.y)) {
    mouseMoveObject = buttonC;
  } else if (temperatureSensor.inside(x - board.x, y - board.y)) {
    mouseMoveObject = temperatureSensor;
  } else if (barometricPressureSensor.inside(x - board.x, y - board.y)) {
    mouseMoveObject = barometricPressureSensor;
  } else {
    mouseMoveObject = null;
  }

  draw();

}

function resize() {

}

function draw() {

  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = "LightSkyBlue";
  for (let i = 1; i <= canvas.height / gridSize; i++) {
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
  }
  for (let i = 1; i <= canvas.width / gridSize; i++) {
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  board.draw(ctx);
  redLedLight.draw(ctx);
  greenLedLight.draw(ctx);
  blueLedLight.draw(ctx);
  buttonA.draw(ctx);
  buttonB.draw(ctx);
  buttonC.draw(ctx);
  drawToolTips(ctx);

  linechart.draw();

}

function drawToolTips(ctx) {
  let x = board.x;
  let y = board.y - 25;
  if (mouseMoveObject == redLedLight) {
    x += redLedLight.x + redLedLight.width / 2;
    y += redLedLight.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Red LED light', true);
  } else if (mouseMoveObject == greenLedLight) {
    x += greenLedLight.x + greenLedLight.width / 2;
    y += greenLedLight.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Green LED light', true);
  } else if (mouseMoveObject == blueLedLight) {
    x += blueLedLight.x + blueLedLight.width / 2;
    y += blueLedLight.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Blue LED light', true);
  } else if (mouseMoveObject == buttonA) {
    x += buttonA.x + buttonA.width / 2;
    y += buttonA.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Button A', true);
  } else if (mouseMoveObject == buttonB) {
    x += buttonB.x + buttonB.width / 2;
    y += buttonB.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Button B', true);
  } else if (mouseMoveObject == buttonC) {
    x += buttonC.x + buttonC.width / 2;
    y += buttonC.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Button C', true);
  } else if (mouseMoveObject == temperatureSensor) {
    x += temperatureSensor.x + temperatureSensor.width / 2;
    y += temperatureSensor.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Temperature Sensor', true);
  } else if (mouseMoveObject == barometricPressureSensor) {
    x += barometricPressureSensor.x + barometricPressureSensor.width / 2;
    y += barometricPressureSensor.y;
    ctx.drawTooltip(x, y, 20, 8, 10, 'Barometric Pressure Sensor', true);
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.8;
}

function blinkAllLeds(radio) {
  if (radio.checked) {
    database.ref(stateId).update({task: 'blink_all_leds'});
  }
}

function moveRainbow(radio) {
  if (radio.checked) {
    database.ref(stateId).update({task: 'move_rainbow'});
  }
}

function moveTrains(radio) {
  if (radio.checked) {
    database.ref(stateId).update({task: 'move_trains'});
  }
}

function randomColors(radio) {
  if (radio.checked) {
    database.ref(stateId).update({task: 'random_colors'});
  }
}

function bounceDot(radio) {
  if (radio.checked) {
    database.ref(stateId).update({task: 'bounce_dot'});
  }
}

function rippleEffect(radio) {
  if (radio.checked) {
    database.ref(stateId).update({task: 'ripple_effect'});
  }
}
