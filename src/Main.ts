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
import {ColorPickerContextMenu} from "./ColorPickerContextMenu";
import {Movable} from "./Movable";
import {LineChart} from "./LineChart";
import {ComponentsPanel} from "./ComponentsPanel";
import {Code} from "./Code";

export let system = new System();
export let code = new Code();
export let user = new User("Charles", null, "Xie");

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);
  }

  interface String {
    startsWith(s);
  }
}

let social = `<span style="font-size: 2em; vertical-align: middle"><i class="fab fa-facebook-square"></i></span>
              <span style="font-size: 2em; vertical-align: middle"><i class="fab fa-weixin"></i></span>
              <span style="font-size: 2em; vertical-align: middle"><i class="fab fa-twitter"></i></span>
              <span style="font-size: 2em; vertical-align: middle"><i class="fab fa-weibo"></i></span>
              <span style="font-size: 2em; vertical-align: middle"><i class="fab fa-youtube"></i></span>`;

window.onload = function () {

  let signinLabel = document.getElementById("sign-in-label") as HTMLElement;
  signinLabel.innerHTML = "Hello, " + user.firstName;
  let nameLabel = document.getElementById("name-label") as HTMLElement;
  nameLabel.innerHTML = Constants.Software.name;
  let versionLabel = document.getElementById("version-label") as HTMLElement;
  versionLabel.innerHTML = Constants.Software.version;
  let creditLabel = document.getElementById('credit') as HTMLElement;
  creditLabel.innerHTML = social + "<div class='divider'></div>" + Constants.Software.name + " " + Constants.Software.version + ", " + user.fullName + " , &copy; " + new Date().getFullYear();

  let digitalTwinsTabButton = document.getElementById("digital-twins-tab-button") as HTMLButtonElement;
  digitalTwinsTabButton.addEventListener("click", function (event) {
    selectTab(digitalTwinsTabButton, "digital-twins-playground");
  });
  let diagramTabButton = document.getElementById("diagram-tab-button") as HTMLButtonElement;
  diagramTabButton.addEventListener("click", function (event) {
    selectTab(diagramTabButton, "diagram-playground");
  });
  let codeTabButton = document.getElementById("code-tab-button") as HTMLButtonElement;
  codeTabButton.addEventListener("click", function (event) {
    selectTab(codeTabButton, "code-playground");
  });

  let workbenchContextMenu = new WorkbenchContextMenu();
  workbenchContextMenu.render("workbench-context-menu-placeholder");
  let raspberryPiContextMenu = new RaspberryPiContextMenu();
  raspberryPiContextMenu.render("raspberry-pi-context-menu-placeholder");
  let rainbowHatContextMenu = new RainbowHatContextMenu();
  rainbowHatContextMenu.render("rainbow-hat-context-menu-placeholder");
  rainbowHatContextMenu.addListeners();
  let lineChartContextMenu = new LineChartContextMenu();
  lineChartContextMenu.render("linechart-context-menu-placeholder");
  let colorPickerContextMenu = new ColorPickerContextMenu();
  colorPickerContextMenu.render("colorpicker-context-menu-placeholder");
  let componentsPanel = new ComponentsPanel();
  componentsPanel.render("components-panel");

  // read locally stored properties
  restoreLocation(system.raspberryPi);
  restoreLocation(system.rainbowHat);
  restoreLocation(system.temperatureGraph);
  restoreLocation(system.pressureGraph);
  restoreVisibility(system.temperatureGraph);
  restoreVisibility(system.pressureGraph);
  let x: string = localStorage.getItem("Attached: " + system.rainbowHat.getUid());
  if (x != null) {
    let i = parseInt(x);
    if (i >= 0) {
      system.rainbowHat.attach(system.raspberryPi);
    }
  }

  resize();
  draw();

};

function selectTab(button: HTMLButtonElement, tabId: string) {
  // Get all elements with class="tabcontent" and hide them
  let tabcontent = document.getElementsByClassName("tabcontent") as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < tabcontent.length; i++) {
    (<HTMLElement>tabcontent[i]).style.display = "none";
  }
  // Get all elements with class="tablinks" and remove the class "active"
  let tablinks = document.getElementsByClassName("tablinks") as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabId).style.display = "block";
  button.className += " active";
}

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
  resize();
  draw();
};

function resize() {
  let workbenchRect = system.workbench.canvas.getBoundingClientRect() as DOMRect;
  system.workbench.canvas.width = window.innerWidth - 2 * workbenchRect.left - 4;
  system.workbench.canvas.height = window.innerHeight - workbenchRect.top - 50;
  let codespaceRect = code.codespace.canvas.getBoundingClientRect() as DOMRect;
  code.codespace.canvas.width = window.innerWidth - 2 * workbenchRect.left - 4;
  code.codespace.canvas.height = window.innerHeight - workbenchRect.top - 50;
}

function draw() {
  system.draw();
  code.draw();
}
