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

let redLedState;
let redLedImage;
let redLedImageX = 10;
let redLedImageY = 500;

let greenLedState;
let greenLedImage;
let greenLedImageX = 210;
let greenLedImageY = 500;

let blueLedState;
let blueLedImage;
let blueLedImageX = 420;
let blueLedImageY = 500;

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
      redLedState = childData.redLed;
      greenLedState = childData.greenLed;
      blueLedState = childData.blueLed;
      temperature.push(childData.temperature);
      draw();
    });
  });

  linechart = new LineChart("linechart", "Temperature", temperature, 35, 40);

  canvas = document.getElementById("board");
  canvas.addEventListener("click", click, false);
  resizeCanvas();
  draw();

  window.addEventListener('resize', resize, false); // resize the canvas to fill browser window dynamically

  document.title = SOFTWARE.name + ' (' + SOFTWARE.abbreviation + ')' + ' - ' + SOFTWARE.version;
  document.getElementById('name-label').innerHTML = SOFTWARE.name;
  document.getElementById('version-label').innerHTML = SOFTWARE.version;
  document.getElementById('credit').innerHTML = SOFTWARE.name + ' ' + SOFTWARE.version + ', The Engineering Computation Laboratory, Concord Consortium, &copy; ' + new Date().getFullYear();

}

function click(e) {

  let x = e.x - canvas.offsetLeft;
  let y = e.y - canvas.offsetTop;

  let redLedClicked = x > redLedImageX && x < redLedImageX + redLedImage.width && y > redLedImageY && y < redLedImageY + redLedImage.height;
  if (redLedClicked) {
    redLedState = !redLedState;
    draw();
    database.ref('rainbow_hat').update({redLed: redLedState});
    return;
  }

  let greenLedClicked = x > greenLedImageX && x < greenLedImageX + greenLedImage.width && y > greenLedImageY && y < greenLedImageY + greenLedImage.height;
  if (greenLedClicked) {
    greenLedState = !greenLedState;
    draw();
    database.ref('rainbow_hat').update({greenLed: greenLedState});
    return;
  }

  let blueLedClicked = x > blueLedImageX && x < blueLedImageX + blueLedImage.width && y > blueLedImageY && y < blueLedImageY + blueLedImage.height;
  if (blueLedClicked) {
    blueLedState = !blueLedState;
    draw();
    console.log("clicked: " + x + "," + y + ", " + blueLedImage.src);
    database.ref('rainbow_hat').update({blueLed: blueLedState});
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
  rpi.src = 'img/raspberry_pi_3.png';
  rpi.onload = function () {
    ctx.drawImage(rpi, 10, 10);
  };

  redLedImage = document.getElementById(redLedState ? 'red_led_light_on' : 'red_led_light_off');
  ctx.drawImage(redLedImage, redLedImageX, redLedImageY);

  greenLedImage = document.getElementById(greenLedState ? 'green_led_light_on' : 'green_led_light_off');
  ctx.drawImage(greenLedImage, greenLedImageX, greenLedImageY);

  blueLedImage = document.getElementById(blueLedState ? 'blue_led_light_on' : 'blue_led_light_off');
  ctx.drawImage(blueLedImage, blueLedImageX, blueLedImageY);

  linechart.draw();

}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.8;
}
