/*
 * @author Charles Xie
 */

import $ from "jquery";
// @ts-ignore
window.jQuery = $;
import "jquery-ui-bundle/jquery-ui.min.css";
import "jquery-ui-bundle/jquery-ui";
import "@fortawesome/fontawesome-free/css/all.css";

import * as Constants from "./Constants";
import {User} from "./User";
import {System} from "./components/System";
import {Movable} from "./Movable";
import {RainbowHat} from "./components/RainbowHat";
import {Sensor} from "./components/Sensor";
import {Flowchart} from "./block/Flowchart";
import {ComponentsPanel} from "./components/ui/ComponentsPanel";
import {RainbowHatContextMenu} from "./components/ui/RainbowHatContextMenu";
import {WorkbenchContextMenu} from "./components/ui/WorkbenchContextMenu";
import {LineChartContextMenu} from "./components/ui/LineChartContextMenu";
import {RaspberryPiContextMenu} from "./components/ui/RaspberryPiContextMenu";
import {ColorPickerContextMenu} from "./components/ui/ColorPickerContextMenu";
import {SenseHatContextMenu} from "./components/ui/SenseHatContextMenu";
import {CapacitiveTouchHatContextMenu} from "./components/ui/CapacitiveTouchHatContextMenu";
import {UnicornHatContextMenu} from "./components/ui/UnicornHatContextMenu";
import {CrickitHatContextMenu} from "./components/ui/CrickitHatContextMenu";
import {PanTiltHatContextMenu} from "./components/ui/PanTiltHatContextMenu";
import {BlockViewContextMenu} from "./block/ui/BlockViewContextMenu";
import {BlockElementsPanel} from "./block/ui/BlockElementsPanel";
import {BlockContextMenu} from "./block/ui/BlockContextMenu";

import {Sound} from "./Sound";
// @ts-ignore
import clickSound from "./sound/stapler.mp3";

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

export let system = new System();
export let flowchart = new Flowchart();
export let user = new User("Charles", null, "Xie");
export let contextMenus: any = {};
export let sound = new Sound();

export function closeAllContextMenus() {
  Object.keys(contextMenus).forEach(key => {
    let menu = document.getElementById(contextMenus[key].id) as HTMLMenuElement;
    menu.classList.remove("show-menu");
  });
}

let social = `<span style="font-size: 2em; vertical-align: middle; cursor: pointer;"><i class="fab fa-facebook-square"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;"><i class="fab fa-weixin"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;"><i class="fab fa-twitter"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;"><i class="fab fa-weibo"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;"><i class="fab fa-youtube"></i></span>`;

window.onload = function () {

  let signinLabel = document.getElementById("sign-in-label") as HTMLElement;
  signinLabel.innerHTML = "Hello, " + user.firstName;
  let nameLabel = document.getElementById("name-label") as HTMLElement;
  nameLabel.innerHTML = Constants.Software.name;
  let versionLabel = document.getElementById("version-label") as HTMLElement;
  versionLabel.innerHTML = Constants.Software.version;
  let creditLabel = document.getElementById('credit') as HTMLElement;
  creditLabel.innerHTML = social + "<div class='horizontal-divider'></div>" + Constants.Software.name + " " + Constants.Software.version + ", " + user.fullName + " , &copy; " + new Date().getFullYear();

  let modelTabButton = document.getElementById("model-tab-button") as HTMLButtonElement;
  modelTabButton.addEventListener("click", function () {
    selectTab(modelTabButton, "model-playground");
    system.draw();
  });
  let blockTabButton = document.getElementById("block-tab-button") as HTMLButtonElement;
  blockTabButton.addEventListener("click", function () {
    selectTab(blockTabButton, "block-playground");
    flowchart.draw();
  });
  let codeTabButton = document.getElementById("code-tab-button") as HTMLButtonElement;
  codeTabButton.addEventListener("click", function () {
    selectTab(codeTabButton, "code-playground");
  });

  setupContextMenuForModel();
  setupContextMenuForBlock();

  let lineChartContextMenu = new LineChartContextMenu();
  lineChartContextMenu.render("linechart-context-menu-placeholder");
  contextMenus.lineChart = lineChartContextMenu;

  let colorPickerContextMenu = new ColorPickerContextMenu();
  colorPickerContextMenu.render("colorpicker-context-menu-placeholder");
  contextMenus.colorPicker = colorPickerContextMenu;

  let componentsPanel = new ComponentsPanel();
  componentsPanel.render("model-playground-components-panel");

  let elementsPanel = new BlockElementsPanel();
  elementsPanel.render("block-elements-panel");

  // read locally stored properties
  restoreBlocks();
  restoreWorkbench();
  restoreMcus();
  restoreHats();
  restoreConnectors();

  setTimeout(function () { // call this to refresh after inserting canvases
    resize();
    draw();
  }, 1000);

  sound.setSource(clickSound);

};

function setupContextMenuForBlock() {
  let flowViewContextMenu = new BlockViewContextMenu();
  flowViewContextMenu.render("block-view-context-menu-placeholder");
  flowViewContextMenu.addListeners();
  contextMenus.flowView = flowViewContextMenu;

  let blockContextMenu = new BlockContextMenu();
  blockContextMenu.render("block-context-menu-placeholder");
  blockContextMenu.addListeners();
  contextMenus.block = blockContextMenu;
}

function setupContextMenuForModel() {
  let workbenchContextMenu = new WorkbenchContextMenu();
  workbenchContextMenu.render("workbench-context-menu-placeholder");
  workbenchContextMenu.addListeners();
  contextMenus.workbench = workbenchContextMenu;

  let raspberryPiContextMenu = new RaspberryPiContextMenu();
  raspberryPiContextMenu.render("raspberry-pi-context-menu-placeholder");
  raspberryPiContextMenu.addListeners();
  contextMenus.raspberryPi = raspberryPiContextMenu;

  let rainbowHatContextMenu = new RainbowHatContextMenu();
  rainbowHatContextMenu.render("rainbow-hat-context-menu-placeholder");
  rainbowHatContextMenu.addListeners();
  contextMenus.rainbowHat = rainbowHatContextMenu;

  let senseHatContextMenu = new SenseHatContextMenu();
  senseHatContextMenu.render("sense-hat-context-menu-placeholder");
  senseHatContextMenu.addListeners();
  contextMenus.senseHat = senseHatContextMenu;

  let unicornHatContextMenu = new UnicornHatContextMenu();
  unicornHatContextMenu.render("unicorn-hat-context-menu-placeholder");
  unicornHatContextMenu.addListeners();
  contextMenus.unicornHat = unicornHatContextMenu;

  let crickitHatContextMenu = new CrickitHatContextMenu();
  crickitHatContextMenu.render("crickit-hat-context-menu-placeholder");
  crickitHatContextMenu.addListeners();
  contextMenus.crickitHat = crickitHatContextMenu;

  let panTiltHatContextMenu = new PanTiltHatContextMenu();
  panTiltHatContextMenu.render("pan-tilt-hat-context-menu-placeholder");
  panTiltHatContextMenu.addListeners();
  contextMenus.panTiltHat = panTiltHatContextMenu;

  let capacitiveTouchHatContextMenu = new CapacitiveTouchHatContextMenu();
  capacitiveTouchHatContextMenu.render("capacitive-touch-hat-context-menu-placeholder");
  capacitiveTouchHatContextMenu.addListeners();
  contextMenus.capacitiveTouchHat = capacitiveTouchHatContextMenu;
}

function restoreWorkbench() {
  let x = localStorage.getItem("Workbench Show Grid");
  system.workbench.showGrid = (x == "true") || (x == null);
}

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

function restoreHats() {
  let s: string = localStorage.getItem("HAT Sequence");
  if (s != null) {
    let t = s.split(",");
    if (t.length > 0) {
      system.hats = [];
    }
    for (let i of t) {
      i = i.trim();
      let name = i.substring(0, i.indexOf("#") - 1);
      system.addHat(name, 0, 0, i);
    }
  }
  restoreLocations(system.hats);
  for (let h of system.hats) {
    let id: string = localStorage.getItem("Attachment: " + h.getUid());
    if (id != null) {
      let pi = system.getRaspberryPiById(id);
      if (pi) {
        h.attach(pi);
      }
    }
    if (h instanceof RainbowHat) {
      let r: RainbowHat = <RainbowHat>h;
      r.temperatureGraph = addLineChart(r, r.temperatureSensor);
      r.pressureGraph = addLineChart(r, r.barometricPressureSensor);
      if (r.temperatureGraph) r.temperatureGraph.draw();
      if (r.pressureGraph) r.pressureGraph.draw();
    }
  }
}

function addLineChart(r: RainbowHat, s: Sensor) {
  let v = localStorage.getItem(s.name + " Graph Visibility @" + r.getUid());
  if (v == "true") {
    let x = localStorage.getItem(s.name + " Graph X @" + r.getUid());
    let y = localStorage.getItem(s.name + " Graph Y @" + r.getUid());
    return system.addLineChart(s, x ? parseInt(x) : r.getX(), y ? parseInt(y) : r.getY() + r.getHeight() / 2, s.name + " Line Chart " + Date.now().toString(16));
  }
  return null;
}

function restoreMcus() {
  let s: string = localStorage.getItem("MCU Sequence");
  if (s != null) {
    let t = s.split(",");
    if (t.length > 0) {
      system.mcus = [];
    }
    for (let i of t) {
      i = i.trim();
      if (i.startsWith("Raspberry Pi")) {
        system.addRaspberryPi(0, 0, i);
      }
    }
  }
  restoreLocations(system.mcus);
}

function restoreLocations(m: Movable[]) {
  for (let i of m) {
    restoreLocation(i);
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

function restoreBlocks() {
  let s: string = localStorage.getItem("Block Sequence");
  if (s != null) {
    let t = s.split(",");
    if (t.length > 0) {
      flowchart.blocks = [];
    }
    for (let i of t) {
      i = i.trim();
      let name = i.substring(0, i.indexOf("#") - 1);
      if (name.indexOf("HAT") == -1) { // Do not add HAT blocks. They are added by the model components.
        flowchart.addBlock(name, 0, 0, i);
      }
    }
  }
  restoreLocations(flowchart.blocks);
}

function restoreConnectors() {
  let s = localStorage.getItem("Port Connectors");
  if (s != null && s.trim().length > 0) {
    let t = s.split("|");
    for (let i of t) {
      let x = i.split(",");
      let blockId1 = x[0].substring(0, x[0].indexOf("@") - 1).trim();
      let portId1 = x[0].substring(x[0].indexOf("@") + 1).trim();
      let blockId2 = x[1].substring(0, x[1].indexOf("@") - 1).trim();
      let portId2 = x[1].substring(x[1].indexOf("@") + 1).trim();
      // console.log(blockId1 + ":" + portId1 + " --- " + blockId2 + ":" + portId2);
      let block1 = flowchart.getBlock(blockId1);
      let block2 = flowchart.getBlock(blockId2);
      if (block1 && block2) {
        flowchart.addPortConnector(block1.getPort(portId1), block2.getPort(portId2), "Port Connector #" + flowchart.connectors.length);
      }
    }
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
  let blockViewRect = flowchart.blockView.canvas.getBoundingClientRect() as DOMRect;
  flowchart.blockView.canvas.width = window.innerWidth - 2 * blockViewRect.left - 4;
  flowchart.blockView.canvas.height = window.innerHeight - blockViewRect.top - 50;
  let componentsScroller = document.getElementById("components-scroller") as HTMLDivElement;
  componentsScroller.style.height = system.workbench.canvas.height * 0.85 + "px";
  let elementsScroller = document.getElementById("elements-scroller") as HTMLDivElement;
  elementsScroller.style.height = flowchart.blockView.canvas.height * 0.85 + "px";
}

function draw() {
  system.draw();
  flowchart.draw();
}
