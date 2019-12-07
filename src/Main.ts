/*
 * @author Charles Xie
 */

import {User} from "./User";
import {Board} from "./Board"
import * as Constants from "./Constants";
import {LedLight} from "./LedLight";
import {Button} from "./Button";
import {Sensor} from "./Sensor";
import {LineChart} from "./LineChart";

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);
  }
}

declare var firebase;
let database;
let stateId = 'iot_workbench_default';

let user = new User("Charles", null, "Xie");
let canvas = document.getElementById("board") as HTMLCanvasElement;
let context = canvas.getContext("2d");
let gridSize: number = 50;
let board = new Board("rainbow-hat", 10, 10, 481, 321);
let redLedLight = new LedLight(board, 'red', 100, 258, 18, 8);
let greenLedLight = new LedLight(board, 'green', 182, 258, 18, 8);
let blueLedLight = new LedLight(board, 'blue', 264, 258, 18, 8);
let buttonA = new Button(board, 72, 270, 72, 22);
let buttonB = new Button(board, 155, 270, 72, 22);
let buttonC = new Button(board, 238, 270, 72, 22);
let temperatureSensor = new Sensor(board, 186, 133, 10, 10);
let barometricPressureSensor = new Sensor(board, 228, 141, 8, 8);
let mouseMoveObject;

let temperature: number[] = [];
let linechart = new LineChart("linechart", "Temperature", temperature, 15, 20);

window.onload = function () {

  let signinLabel = document.getElementById("sign-in-label") as HTMLElement;
  signinLabel.innerHTML = "Hello, " + user.fullName;
  let nameLabel = document.getElementById("name-label") as HTMLElement;
  nameLabel.innerHTML = Constants.Software.name;
  let versionLabel = document.getElementById("version-label") as HTMLElement;
  versionLabel.innerHTML = Constants.Software.version;
  let creditLabel = document.getElementById('credit') as HTMLElement;
  creditLabel.innerHTML = Constants.Software.name + " " + Constants.Software.version + ", " + user.fullName + " , &copy; " + new Date().getFullYear();

  initFirebase();

  canvas.addEventListener("mousedown", mouseDown, false);

  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  resizeCanvas();

  draw();

}

function initFirebase() {

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
      temperature.push(<number>childData.temperature);
      draw();
    });
  });

}

function mouseDown(e) {

  e.preventDefault();

  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (redLedLight.toggle(x - board.x, y - board.y)) {
    redLedLight.draw(context);
    database.ref(stateId).update({redLed: redLedLight.on});
    return;
  }

  if (greenLedLight.toggle(x - board.x, y - board.y)) {
    greenLedLight.draw(context);
    database.ref(stateId).update({greenLed: greenLedLight.on});
    return;
  }

  if (blueLedLight.toggle(x - board.x, y - board.y)) {
    blueLedLight.draw(context);
    database.ref(stateId).update({blueLed: blueLedLight.on});
    return;
  }

  if (buttonA.inside(x - board.x, y - board.y)) {
    buttonA.on = true;
    buttonA.draw(context);
    redLedLight.on = true;
    redLedLight.draw(context);
    database.ref(stateId).update({redLed: true});
    return;
  }

  if (buttonB.inside(x - board.x, y - board.y)) {
    buttonB.on = true;
    buttonB.draw(context);
    greenLedLight.on = true;
    greenLedLight.draw(context);
    database.ref(stateId).update({greenLed: true});
    return;
  }

  if (buttonC.inside(x - board.x, y - board.y)) {
    buttonC.on = true;
    buttonC.draw(context);
    blueLedLight.on = true;
    blueLedLight.draw(context);
    database.ref(stateId).update({blueLed: true});
    return;
  }

}

function mouseUp(e) {

  e.preventDefault();

  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (buttonA.inside(x - board.x, y - board.y)) {
    buttonA.on = false;
    buttonA.draw(context);
    redLedLight.on = false;
    redLedLight.draw(context);
    database.ref(stateId).update({redLed: false});
    return;
  }

  if (buttonB.inside(x - board.x, y - board.y)) {
    buttonB.on = false;
    buttonB.draw(context);
    greenLedLight.on = false;
    greenLedLight.draw(context);
    database.ref(stateId).update({greenLed: false});
    return;
  }

  if (buttonC.inside(x - board.x, y - board.y)) {
    buttonC.on = false;
    buttonC.draw(context);
    blueLedLight.on = false;
    blueLedLight.draw(context);
    database.ref(stateId).update({blueLed: false});
    return;
  }

}

function mouseMove(e) {

  e.preventDefault();

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

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.strokeStyle = "LightSkyBlue";
  for (let i = 1; i <= canvas.height / gridSize; i++) {
    context.moveTo(0, i * gridSize);
    context.lineTo(canvas.width, i * gridSize);
  }
  for (let i = 1; i <= canvas.width / gridSize; i++) {
    context.moveTo(i * gridSize, 0);
    context.lineTo(i * gridSize, canvas.height);
  }
  context.stroke();
  context.closePath();
  context.restore();

  board.draw(context);
  redLedLight.draw(context);
  greenLedLight.draw(context);
  blueLedLight.draw(context);
  buttonA.draw(context);
  buttonB.draw(context);
  buttonC.draw(context);
  drawToolTips();

  linechart.draw();

}

function drawToolTips() {
  let x = board.x;
  let y = board.y - 25;
  if (mouseMoveObject == redLedLight) {
    x += redLedLight.x + redLedLight.width / 2;
    y += redLedLight.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Red LED light', true);
  } else if (mouseMoveObject == greenLedLight) {
    x += greenLedLight.x + greenLedLight.width / 2;
    y += greenLedLight.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Green LED light', true);
  } else if (mouseMoveObject == blueLedLight) {
    x += blueLedLight.x + blueLedLight.width / 2;
    y += blueLedLight.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Blue LED light', true);
  } else if (mouseMoveObject == buttonA) {
    x += buttonA.x + buttonA.width / 2;
    y += buttonA.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Button A', true);
  } else if (mouseMoveObject == buttonB) {
    x += buttonB.x + buttonB.width / 2;
    y += buttonB.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Button B', true);
  } else if (mouseMoveObject == buttonC) {
    x += buttonC.x + buttonC.width / 2;
    y += buttonC.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Button C', true);
  } else if (mouseMoveObject == temperatureSensor) {
    x += temperatureSensor.x + temperatureSensor.width / 2;
    y += temperatureSensor.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Temperature Sensor', true);
  } else if (mouseMoveObject == barometricPressureSensor) {
    x += barometricPressureSensor.x + barometricPressureSensor.width / 2;
    y += barometricPressureSensor.y;
    context.drawTooltip(x, y, 20, 8, 10, 'Barometric Pressure Sensor', true);
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

