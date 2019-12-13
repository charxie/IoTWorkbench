/*
 * @author Charles Xie
 */

import * as Constants from "./Constants";
import "@fortawesome/fontawesome-free/css/all.css";
import {User} from "./User";
import {System} from "./System";
import {RainbowHatContextMenu} from "./RainbowHatContextMenu";
import {WorkbenchContextMenu} from "./WorkbenchContextMenu";
import {LineChartContextMenu} from "./LineChartContextMenu";
import {RaspberryPiContextMenu} from "./RaspberryPiContextMenu";
import {Movable} from "./Movable";
import {LineChart} from "./LineChart";

export let system = new System();
export let user = new User("Charles", null, "Xie");

window.onload = function () {

  let signinLabel = document.getElementById("sign-in-label") as HTMLElement;
  signinLabel.innerHTML = "Hello, " + user.fullName;
  let nameLabel = document.getElementById("name-label") as HTMLElement;
  nameLabel.innerHTML = Constants.Software.name;
  let versionLabel = document.getElementById("version-label") as HTMLElement;
  versionLabel.innerHTML = Constants.Software.version;
  let creditLabel = document.getElementById('credit') as HTMLElement;
  creditLabel.innerHTML = Constants.Software.name + " " + Constants.Software.version + ", " + user.fullName + " , &copy; " + new Date().getFullYear();

  let workbenchContextMenu = new WorkbenchContextMenu();
  workbenchContextMenu.render("workbench-context-menu-placeholder");
  let raspberryPiContextMenu = new RaspberryPiContextMenu();
  raspberryPiContextMenu.render("raspberry-pi-context-menu-placeholder");
  let rainbowHatContextMenu = new RainbowHatContextMenu();
  rainbowHatContextMenu.render("rainbow-hat-context-menu-placeholder");
  rainbowHatContextMenu.addListeners();
  let lineChartContextMenu = new LineChartContextMenu();
  lineChartContextMenu.render("linechart-context-menu-placeholder");

  // read locally stored properties
  restoreLocation(system.raspberryPi);
  restoreLocation(system.rainbowHat);
  restoreLocation(system.temperatureGraph);
  restoreLocation(system.pressureGraph);
  restoreVisibility(system.temperatureGraph);
  restoreVisibility(system.pressureGraph);

  draw();

};

function restoreVisibility(g: LineChart) {
  let x: string = localStorage.getItem("Visible: " + g.getUid());
  if (x != null) {
    g.setVisible("true" == x);
    g.draw();
  }
}

function restoreLocation(m: Movable) {
  let x: string = localStorage.getItem("X: " + m.getUid());
  if (x != null) {
    m.setX(parseInt(x));
  }
  let y: string = localStorage.getItem("Y: " + m.getUid());
  if (y != null) {
    m.setY(parseInt(y));
  }
}

window.onresize = function () {
  draw();
};

function draw() {
  let workbenchRect = system.workbench.canvas.getBoundingClientRect() as DOMRect;
  system.workbench.canvas.width = window.innerWidth - 2 * workbenchRect.left - 4;
  system.workbench.canvas.height = window.innerHeight - workbenchRect.top - 30;
  system.workbench.draw();
  system.raspberryPi.draw();
  system.rainbowHat.draw();
}
