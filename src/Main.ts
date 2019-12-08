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
let board = new RainbowHat(10, 10, 481, 321, "rainbow-hat");
export let linechart = new LineChart("linechart", "Temperature", board.temperature, 15, 20);

window.onload = function () {

  let signinLabel = document.getElementById("sign-in-label") as HTMLElement;
  signinLabel.innerHTML = "Hello, " + user.fullName;
  let nameLabel = document.getElementById("name-label") as HTMLElement;
  nameLabel.innerHTML = Constants.Software.name;
  let versionLabel = document.getElementById("version-label") as HTMLElement;
  versionLabel.innerHTML = Constants.Software.version;
  let creditLabel = document.getElementById('credit') as HTMLElement;
  creditLabel.innerHTML = Constants.Software.name + " " + Constants.Software.version + ", " + user.fullName + " , &copy; " + new Date().getFullYear();

  board.canvas.width = window.innerWidth * 0.99;
  board.canvas.height = window.innerHeight * 0.75;
  board.draw();

  linechart.draw();

}
