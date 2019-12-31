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
import {LineChart} from "./tools/LineChart";

import {System} from "./components/System";
import {RainbowHat} from "./components/RainbowHat";
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

import {Flowchart} from "./blocks/Flowchart";
import {Slider} from "./blocks/Slider";
import {BlockViewContextMenu} from "./blocks/ui/BlockViewContextMenu";
import {BlockElementsPanel} from "./blocks/ui/BlockElementsPanel";
import {LogicBlockContextMenu} from "./blocks/ui/LogicBlockContextMenu";
import {MathBlockContextMenu} from "./blocks/ui/MathBlockContextMenu";
import {FunctionBlockContextMenu} from "./blocks/ui/FunctionBlockContextMenu";
import {HatBlockContextMenu} from "./blocks/ui/HatBlockContextMenu";
import {SliderContextMenu} from "./blocks/ui/SliderContextMenu";

import {Sound} from "./Sound";
// @ts-ignore
import clickSound from "./sound/stapler.mp3";

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);

    drawHalfRoundedRect(x, y, w, h, r, side);

    fillHalfRoundedRect(x, y, w, h, r, side);
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
    resize();
    system.draw();
  });
  let blockTabButton = document.getElementById("block-tab-button") as HTMLButtonElement;
  blockTabButton.addEventListener("click", function () {
    selectTab(blockTabButton, "block-playground");
    resize();
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
    let startTab = localStorage.getItem("Start Tab");
    if (startTab) {
      switch (startTab) {
        case "model-playground":
          selectTab(modelTabButton, startTab);
          system.draw();
          break;
        case "block-playground":
          selectTab(blockTabButton, startTab);
          flowchart.draw();
          break;
        case "code-playground":
          selectTab(codeTabButton, startTab);
          break;
      }
      resize();
      draw();
    }
  }, 1000);

  sound.setSource(clickSound);

};

function setupContextMenuForBlock() {
  let blockViewContextMenu = new BlockViewContextMenu();
  blockViewContextMenu.render("block-view-context-menu-placeholder");
  blockViewContextMenu.addListeners();
  contextMenus.blockView = blockViewContextMenu;

  let mathBlockContextMenu = new MathBlockContextMenu();
  mathBlockContextMenu.render("math-block-context-menu-placeholder");
  mathBlockContextMenu.addListeners();
  contextMenus.mathBlock = mathBlockContextMenu;

  let logicBlockContextMenu = new LogicBlockContextMenu();
  logicBlockContextMenu.render("logic-block-context-menu-placeholder");
  logicBlockContextMenu.addListeners();
  contextMenus.logicBlock = logicBlockContextMenu;

  let functionBlockContextMenu = new FunctionBlockContextMenu();
  functionBlockContextMenu.render("function-block-context-menu-placeholder");
  functionBlockContextMenu.addListeners();
  contextMenus.functionBlock = functionBlockContextMenu;

  let hatBlockContextMenu = new HatBlockContextMenu();
  hatBlockContextMenu.render("hat-block-context-menu-placeholder");
  hatBlockContextMenu.addListeners();
  contextMenus.hatBlock = hatBlockContextMenu;

  let sliderContextMenu = new SliderContextMenu();
  sliderContextMenu.render("slider-context-menu-placeholder");
  sliderContextMenu.addListeners();
  contextMenus.slider = sliderContextMenu;
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
  localStorage.setItem("Start Tab", tabId);
}

function restoreWorkbench() {
  let s = localStorage.getItem("Workbench State");
  if (s != null) {
    let state = JSON.parse(s);
    system.workbench.showGrid = state.showGrid;
  }
}

function restoreMcus() {
  system.mcus = [];
  let s: string = localStorage.getItem("MCU States");
  if (s != null) {
    let states = JSON.parse(s);
    for (let state of states) {
      if (state.uid.startsWith("Raspberry Pi")) {
        system.addRaspberryPi(state.uid, state.x, state.y, false);
      }
    }
  }
}

function restoreHats() {
  system.hats = [];
  let s: string = localStorage.getItem("HAT States");
  if (s != null) {
    let hatStates = JSON.parse(s);
    for (let hatState of hatStates) {
      let name = hatState.uid.substring(0, hatState.uid.indexOf("#") - 1);
      let hat = system.addHat(name, hatState.x, hatState.y, hatState.uid, false);
      let blockName = name + " Block";
      let block = flowchart.addBlock(blockName, 10, 10, hat.uid.replace(name, blockName));
      let bs: string = localStorage.getItem("Block States");
      if (bs != null) {
        let blockStates = JSON.parse(bs);
        if (blockStates.length > 0) {
          for (let blockState of blockStates) {
            let i = hatState.uid.indexOf("#") - 1;
            let hatName = hatState.uid.substring(0, i);
            let hatId = hatState.uid.substring(i);
            i = blockState.uid.indexOf("#") - 1;
            let blockName = blockState.uid.substring(0, i);
            let blockId = blockState.uid.substring(i);
            if (blockName.startsWith(hatName) && blockId == hatId) { // find out the stored state of the HAT block
              // restore the HAT block state after adding it here
              block.setX(blockState.x);
              block.setY(blockState.y);
            }
          }
        }
      }
    }
  }
  s = localStorage.getItem("Attachments");
  if (s != null) {
    let states = JSON.parse(s);
    for (let state of states) {
      let pi = system.getRaspberryPiById(state.raspberryPiId);
      let hat = system.getHatById(state.hatId);
      if (hat != null && pi != null) {
        hat.attach(pi);
      }
    }
  }
  for (let h of system.hats) {
    if (h instanceof RainbowHat) {
      h.temperatureGraph = system.addLineChart(h.temperatureSensor, h.getX(), h.getY(), h.temperatureSensor.name + " @" + h.temperatureSensor.board.getUid());
      h.pressureGraph = system.addLineChart(h.barometricPressureSensor, h.getX(), h.getY(), h.barometricPressureSensor.name + " @" + h.barometricPressureSensor.board.getUid());
      h.temperatureGraph.setVisible(false);
      h.pressureGraph.setVisible(false);
      let lcs = localStorage.getItem("Line Chart States");
      if (lcs != null) {
        let lineChartStates = JSON.parse(lcs);
        for (let lineChartState of lineChartStates) {
          if (lineChartState.uid == h.temperatureGraph.uid) {
            setLineChartState(h.temperatureGraph, lineChartState);
          } else if (lineChartState.uid == h.pressureGraph.uid) {
            setLineChartState(h.pressureGraph, lineChartState);
          }
        }
      }
    }
  }
}

function setLineChartState(graph: LineChart, state: any) {
  graph.setVisible(state.visible);
  graph.setX(state.x);
  graph.setY(state.y);
  if (graph.isVisible()) {
    graph.draw();
  }
}

function restoreBlocks() {
  flowchart.blocks = [];
  let s: string = localStorage.getItem("Block States");
  if (s != null) {
    let states = JSON.parse(s);
    if (states.length > 0) {
      for (let state of states) {
        let type = state.uid.substring(0, state.uid.indexOf("#") - 1);
        if (type.indexOf("HAT") != -1) continue; // Do not add HAT blocks. They are added by the model components.
        let block = flowchart.addBlock(type, state.x, state.y, state.uid);
        if (block instanceof Slider) {
          block.setName(state.name);
          block.setMinimum(state.minimum);
          block.setMaximum(state.maximum);
          block.setSteps(state.steps);
          block.setValue(state.value);
          block.update();
        }
      }
    }
  }
}

function restoreConnectors() {
  let s = localStorage.getItem("Connector States");
  if (s != null) {
    let states = JSON.parse(s);
    if (states.length > 0) {
      for (let state of states) {
        let inputBlock = flowchart.getBlock(state.inputBlockId);
        let outputBlock = flowchart.getBlock(state.outputBlockId);
        if (inputBlock && outputBlock) {
          flowchart.addPortConnector(inputBlock.getPort(state.inputPortId), outputBlock.getPort(state.outputPortId), "Port Connector #" + flowchart.connectors.length);
        }
      }
    }
  }
}

window.onresize = function () {
  resize();
  draw();
};

function resize() {
  if (document.getElementById("model-playground").style.display == "block") {
    let workbenchRect = system.workbench.canvas.getBoundingClientRect() as DOMRect;
    system.workbench.canvas.width = window.innerWidth - 2 * workbenchRect.left - 4;
    system.workbench.canvas.height = window.innerHeight - workbenchRect.top - 50;
    let componentsScroller = document.getElementById("components-scroller") as HTMLDivElement;
    componentsScroller.style.height = system.workbench.canvas.height * 0.85 + "px";
  }
  if (document.getElementById("block-playground").style.display == "block") {
    let blockViewRect = flowchart.blockView.canvas.getBoundingClientRect() as DOMRect;
    flowchart.blockView.canvas.width = window.innerWidth - 2 * blockViewRect.left - 4;
    flowchart.blockView.canvas.height = window.innerHeight - blockViewRect.top - 50;
    let elementsScroller = document.getElementById("elements-scroller") as HTMLDivElement;
    elementsScroller.style.height = flowchart.blockView.canvas.height * 0.85 + "px";
  }
}

function draw() {
  system.draw();
  flowchart.draw();
}
