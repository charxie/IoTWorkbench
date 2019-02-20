/*
 * @author Charles Xie
 *
 */

'use strict';

let canvas;
let gridSize = 50;
let redLedState;
let greenLedState;
let blueLedState;
let redLedImage;
let greenLedImage;
let blueLedImage;
let database;

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
  console.log(database);
  database.ref().on("value", function (snapshot) {
    snapshot.forEach(function (child) {
      let childData = child.val();
      blueLedState = childData.blueLed;
      console.log("Firebase: " + blueLedState);
      draw();
    });
  });

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
  let blueLedClicked = e.x > 310 && e.x < 310 + blueLedImage.width && e.y > 500 && e.y < 500 + blueLedImage.height;
  if (blueLedClicked) {
    blueLedState = !blueLedState;
    draw();
    console.log("clicked: " + e.x + "," + e.y + ", " + blueLedImage.src);
    database.ref('rainbow_hat').update({ blueLed: blueLedState });
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

  let buzzer = new Image();
  buzzer.src = 'img/buzzer_off.png';
  buzzer.onload = function () {
    ctx.drawImage(buzzer, 10, 500);
  };

  redLedImage = new Image();
  redLedImage.src = 'img/red_led_light_off.png';
  redLedImage.onload = function () {
    ctx.drawImage(redLedImage, 110, 500);
  };

  greenLedImage = new Image();
  greenLedImage.src = 'img/green_led_light_off.png';
  greenLedImage.onload = function () {
    ctx.drawImage(greenLedImage, 210, 500);
  };

  blueLedImage = document.getElementById(blueLedState ? 'blue_led_light_on' : 'blue_led_light_off');
  ctx.drawImage(blueLedImage, 310, 500);
  console.log("img src = " + blueLedImage.src);

}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.8;
}
