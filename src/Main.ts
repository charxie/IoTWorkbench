/*
 * @author Charles Xie
 */

import * as Constants from "./Constants";
import "@fortawesome/fontawesome-free/css/all.css";
import {User} from "./User";
import {System} from "./System";
import {BoardContextMenu} from "./BoardContextMenu";
import {WorkbenchContextMenu} from "./WorkbenchContextMenu";
import {LineChartContextMenu} from "./LineChartContextMenu";

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

  new WorkbenchContextMenu().render("workbench-context-menu-placeholder");
  new BoardContextMenu().render("board-context-menu-placeholder");
  new LineChartContextMenu().render("linechart-context-menu-placeholder");

  draw();

};

window.onresize = function () {
  draw();
};

function draw() {
  system.workbench.canvas.width = window.innerWidth * 0.99;
  system.workbench.canvas.height = window.innerHeight - 120;
  system.workbench.draw();
  system.board.draw();
}
