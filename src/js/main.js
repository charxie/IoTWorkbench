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
      //redLedState = childData.redLed;
      //greenLedState = childData.greenLed;
      //blueLedState = childData.blueLed;
      temperature.push(childData.temperature);
      draw();
    });
  });

  linechart = new LineChart("linechart", "Temperature", temperature, 36, 39);

  canvas = document.getElementById("board");
  canvas.addEventListener("click", click, false);
  //resizeCanvas();

  redLedLight = new LedLight(canvas, "Red LED", 100, 258, 18, 8);
  greenLedLight = new LedLight(canvas, "Green LED", 100, 258, 18, 8);
  blueLedLight = new LedLight(canvas, "Blue LED", 100, 258, 18, 8);

  draw();

  window.addEventListener('resize', resize, false); // resize the canvas to fill browser window dynamically

  document.title = SOFTWARE.name + ' (' + SOFTWARE.abbreviation + ')' + ' - ' + SOFTWARE.version;
  document.getElementById('name-label').innerHTML = SOFTWARE.name;
  document.getElementById('version-label').innerHTML = SOFTWARE.version;
  document.getElementById('credit').innerHTML = SOFTWARE.name + ' ' + SOFTWARE.version + ', The Engineering Computation Laboratory, Concord Consortium, &copy; ' + new Date().getFullYear();

}

function click(e) {

  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.x;
  let y = e.clientY - rect.y;

  if (redLedLight.isPressed(x - 10, y - 10)) {
    draw();
    database.ref('rainbow_hat').update({redLed: true});
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

  let rpi = new Image();
  rpi.src = 'img/rainbow-hat.png';
  rpi.onload = function () {
    ctx.drawImage(rpi, 10, 10);
  };

  linechart.draw();

}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.8;
}
