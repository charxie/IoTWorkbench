/*
 * @author Charles Xie
 */

import * as Constants from "./Constants";
import {User} from "./User";
import {LineChart} from "./LineChart";
import {RainbowHat} from "./RainbowHat";
import {System} from "./System";

let system = new System();
let user = new User("Charles", null, "Xie");
let gridSize: number = 50;
let board = new RainbowHat(10, 10, 481, 321);
let boardCanvas = document.getElementById("board") as HTMLCanvasElement;

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

  boardCanvas.addEventListener("mousedown", mouseDown, false);
  boardCanvas.addEventListener("mouseup", mouseUp, false);
  boardCanvas.addEventListener("mousemove", mouseMove, false);

  resizeCanvas();
  draw();

}

function mouseDown(e) {
  board.mouseDown(boardCanvas, e);
}

function mouseUp(e) {
  board.mouseUp(boardCanvas, e);
}

function mouseMove(e) {
  board.mouseMove(boardCanvas, e);
}

function draw() {

  let context = boardCanvas.getContext("2d");
  context.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

  context.beginPath();
  context.strokeStyle = "LightSkyBlue";
  for (let i = 1; i <= boardCanvas.height / gridSize; i++) {
    context.moveTo(0, i * gridSize);
    context.lineTo(boardCanvas.width, i * gridSize);
  }
  for (let i = 1; i <= boardCanvas.width / gridSize; i++) {
    context.moveTo(i * gridSize, 0);
    context.lineTo(i * gridSize, boardCanvas.height);
  }
  context.stroke();
  context.closePath();
  context.restore();

  board.draw(context);
  linechart.draw();

}

function resizeCanvas() {
  boardCanvas.width = window.innerWidth * 0.99;
  boardCanvas.height = window.innerHeight * 0.8;
}
