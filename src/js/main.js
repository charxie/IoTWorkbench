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
      redLedLight.pressed = childData.redLed;
      greenLedLight.pressed = childData.greenLed;
      blueLedLight.pressed = childData.blueLed;
      temperature.push(childData.temperature);
      draw();
    });
  });


  canvas = document.getElementById("board");
  canvas.addEventListener("click", click, false);
  //resizeCanvas();

  board = new Board("rainbow_hat", 10, 10, 481, 321);
  redLedLight = new LedLight(board, 'red', 100, 258, 18, 8);
  greenLedLight = new LedLight(board, 'green', 182, 258, 18, 8);
  blueLedLight = new LedLight(board, 'blue', 264, 258, 18, 8);

  linechart = new LineChart("linechart", "Temperature", temperature, 36, 39);

  draw();

  window.addEventListener('resize', resize, false); // resize the canvas to fill browser window dynamically

  document.title = SOFTWARE.name + ' (' + SOFTWARE.abbreviation + ')' + ' - ' + SOFTWARE.version;
  document.getElementById('name-label').innerHTML = SOFTWARE.name;
  document.getElementById('version-label').innerHTML = SOFTWARE.version;
  document.getElementById('credit').innerHTML = SOFTWARE.name + ' ' + SOFTWARE.version + ', The Engineering Computation Laboratory, Concord Consortium, &copy; ' + new Date().getFullYear();

}

function click(e) {

  e.preventDefault();

  let ctx = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (redLedLight.isPressed(x - board.x, y - board.y)) {
    redLedLight.draw(ctx);
    database.ref('rainbow_hat').update({redLed: redLedLight.on});
    return;
  }

  if (greenLedLight.isPressed(x - board.x, y - board.y)) {
    greenLedLight.draw(ctx);
    database.ref('rainbow_hat').update({greenLed: greenLedLight.on});
    return;
  }

  if (blueLedLight.isPressed(x - board.x, y - board.y)) {
    blueLedLight.draw(ctx);
    database.ref('rainbow_hat').update({blueLed: blueLedLight.on});
    return;
  }

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
  linechart.draw();

}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.8;
}
