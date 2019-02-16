/*
 * @author Charles Xie
 *
 */

'use strict';

let canvas;
let gridSize = 50;

function init() {

  canvas = document.getElementById("board");
  resizeCanvas();
  draw();

  window.addEventListener('resize', resize, false); // resize the canvas to fill browser window dynamically

  document.title = SOFTWARE.name + ' (' + SOFTWARE.abbreviation + ')' + ' - ' + SOFTWARE.version;
  document.getElementById('name-label').innerHTML = SOFTWARE.name;
  document.getElementById('version-label').innerHTML = SOFTWARE.version;
  document.getElementById('credit').innerHTML = SOFTWARE.name + ' ' + SOFTWARE.version + ', The Engineering Computation Laboratory, Concord Consortium, &copy; ' + new Date().getFullYear();

}

function resize() {

}

function draw() {

  let ctx = canvas.getContext("2d");
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

  let redLed = new Image();
  redLed.src = 'img/red_led_light_off.png';
  redLed.onload = function () {
    ctx.drawImage(redLed, 110, 500);
  };

  let greenLed = new Image();
  greenLed.src = 'img/green_led_light_off.png';
  greenLed.onload = function () {
    ctx.drawImage(greenLed, 210, 500);
  };

  var blueLed = new Image();
  blueLed.src = 'img/blue_led_light_off.png';
  blueLed.onload = function () {
    ctx.drawImage(blueLed, 310, 500);
  };

}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.8;
}
