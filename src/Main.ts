/*
 * @author Charles Xie
 */

import $ from "jquery";
// @ts-ignore
window.jQuery = $;
import "jquery-ui-bundle/jquery-ui.min.css";
import "jquery-ui-bundle/jquery-ui";
import "@fortawesome/fontawesome-free/css/all.css";
import {create, all} from "mathjs";
import html2canvas from "html2canvas";
import UndoManager from "undo-manager";
// @ts-ignore
import clickSound from "./sound/stapler.mp3";

import * as Constants from "./Constants";
import {Sound} from "./Sound";
import {User} from "./User";
import {State} from "./State";
import {StateIO} from "./StateIO";
import {Examples} from "./Examples";
import {PngSaver} from "./tools/PngSaver";

import {System} from "./components/System";
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
import {BlockViewContextMenu} from "./blocks/ui/BlockViewContextMenu";
import {BlockElementsPanel} from "./blocks/ui/BlockElementsPanel";
import {TurnoutSwitchContextMenu} from "./blocks/ui/TurnoutSwitchContextMenu";
import {NotBlockContextMenu} from "./blocks/ui/NotBlockContextMenu";
import {LogicBlockContextMenu} from "./blocks/ui/LogicBlockContextMenu";
import {ArithmeticBlockContextMenu} from "./blocks/ui/ArithmeticBlockContextMenu";
import {UnaryFunctionBlockContextMenu} from "./blocks/ui/UnaryFunctionBlockContextMenu";
import {BinaryFunctionBlockContextMenu} from "./blocks/ui/BinaryFunctionBlockContextMenu";
import {RainbowHatBlockContextMenu} from "./blocks/ui/RainbowHatBlockContextMenu";
import {ToggleSwitchContextMenu} from "./blocks/ui/ToggleSwitchContextMenu";
import {SliderContextMenu} from "./blocks/ui/SliderContextMenu";
import {SeriesBlockContextMenu} from "./blocks/ui/SeriesBlockContextMenu";
import {ItemSelectorContextMenu} from "./blocks/ui/ItemSelectorContextMenu";
import {StickerContextMenu} from "./blocks/ui/StickerContextMenu";
import {GrapherContextMenu} from "./blocks/ui/GrapherContextMenu";
import {WorkerBlockContextMenu} from "./blocks/ui/WorkerBlockContextMenu";
import {ParametricEquationBlockContextMenu} from "./blocks/ui/ParametricEquationBlockContextMenu";
import {Space2DContextMenu} from "./blocks/ui/Space2DContextMenu";
import {GlobalVariableBlockContextMenu} from "./blocks/ui/GlobalVariableBlockContextMenu";
import {MomentarySwitchContextMenu} from "./blocks/ui/MomentarySwitchContextMenu";
import {BeeperContextMenu} from "./blocks/ui/BeeperContextMenu";
import {SwitchStatementBlockContextMenu} from "./blocks/ui/SwitchStatementBlockContextMenu";
import {MultivariableFunctionBlockContextMenu} from "./blocks/ui/MultivariableFunctionBlockContextMenu";
import {GlobalObjectBlockContextMenu} from "./blocks/ui/GlobalObjectBlockContextMenu";
import {RgbaColorBlockContextMenu} from "./blocks/ui/RgbaColorBlockContextMenu";
import {ComplexNumberBlockContextMenu} from "./blocks/ui/ComplexNumberBlockContextMenu";
import {ActionBlockContextMenu} from "./blocks/ui/ActionBlockContextMenu";
import {BundledFunctionsBlockContextMenu} from "./blocks/ui/BundledFunctionsBlockContextMenu";
import {BitwiseOperatorBlockContextMenu} from "./blocks/ui/BitwiseOperatorBlockContextMenu";
import {FunctionDeclarationBlockContextMenu} from "./blocks/ui/FunctionDeclarationBlockContextMenu";
import {VectorBlockContextMenu} from "./blocks/ui/VectorBlockContextMenu";
import {NormalizationBlockContextMenu} from "./blocks/ui/NormalizationBlockContextMenu";

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

    replaceFromTo(start, end, replacement);
  }

  interface Math {
    hypot(x, y);

    sinh(x);

    cosh(x);
  }
}

export const system = new System();
export const flowchart = new Flowchart();
export const user = new User("Charles", null, "Xie");
export const contextMenus: any = {};
export const sound = new Sound();
export const math = create(all, {});
export const undoManager = new UndoManager();

export function closeAllContextMenus() {
  Object.keys(contextMenus).forEach(key => {
    let menu = document.getElementById(contextMenus[key].id) as HTMLMenuElement;
    menu.classList.remove("show-menu");
  });
}

export function isNumber(x: any) {
  return !isNaN(parseFloat(x)) && isFinite(x);
}

function showUnderConstructionMessage() {
  $("#modal-dialog").html("<div style='font-size: 90%;'>Under construction...</div>").dialog({
    resizable: false,
    modal: true,
    title: "Sorry",
    height: 150,
    width: 200,
    buttons: {
      'OK': function () {
        $(this).dialog('close');
      }
    }
  });
}

let social = `<span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="Facebook"><i class="fab fa-facebook-square"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="WeChat"><i class="fab fa-weixin"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="Twitter"><i class="fab fa-twitter"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="Weibo"><i class="fab fa-weibo"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="YouTube"><i class="fab fa-youtube"></i></span>`;

window.onload = function () {

  document.getElementById("sign-in-label").innerHTML = "Hello, " + user.firstName;
  document.getElementById("name-label").innerHTML = Constants.Software.name;
  document.getElementById("tagline-label").innerHTML = Constants.Software.tagline;
  document.getElementById("version-label").innerHTML = Constants.Software.version;
  document.getElementById('credit').innerHTML = social + "<div class='horizontal-divider'></div>"
    + Constants.Software.name + " " + Constants.Software.version
    + ", created by <a href='https://charxie.github.io/' style='text-decoration: none;'>Dr. Charles Xie</a>, " + new Date().getFullYear();

  let examples = new Examples();

  document.getElementById("main-page-new-file-button").onclick = function () {
    flowchart.askToClear();
  };
  document.getElementById("main-page-undo-button").onclick = function () {
    if (undoManager.hasUndo()) {
      undoManager.undo();
    }
  };
  document.getElementById("main-page-redo-button").onclick = function () {
    if (undoManager.hasRedo()) {
      undoManager.redo();
    }
  };
  document.getElementById("main-page-home-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-camera-button").onclick = function () {
    html2canvas(document.body).then(function (canvas) {
      PngSaver.saveAs(canvas);
    });
  };
  document.getElementById("main-page-share-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-open-file-button").onclick = function () {
    StateIO.open();
  };
  document.getElementById("main-page-download-button").onclick = function () {
    StateIO.saveAs(JSON.stringify(new State()));
  };
  document.getElementById("main-page-settings-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-help-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-signout-button").onclick = showUnderConstructionMessage;

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
    flowchart.addModelBlockIfMissing();
    flowchart.blockView.requestDraw();
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
  StateIO.restoreMcus(localStorage.getItem("MCU States"));
  StateIO.restoreHats(localStorage.getItem("HAT States"));
  StateIO.restoreAttachments(localStorage.getItem("Attachments"));
  StateIO.restoreBlockView(localStorage.getItem("Block View State"));
  StateIO.restoreBlocks(localStorage.getItem("Block States"));
  StateIO.restoreFunctionDeclarations();
  StateIO.restoreGlobalVariables();
  StateIO.restoreWorkbench(localStorage.getItem("Workbench State"));
  StateIO.restoreConnectors(localStorage.getItem("Connector States")); // connectors must be restored after loading HATs
  flowchart.updateResultsExcludingWorkerBlocks();
  // flowchart.reset(); // FIXME: why did I call this?

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
          flowchart.blockView.requestDraw();
          break;
        case "code-playground":
          selectTab(codeTabButton, startTab);
          break;
      }
    } else {
      selectTab(blockTabButton, "block-playground");
      flowchart.blockView.requestDraw();
    }
    resize();
    draw();
  }, 1000);

  sound.setSource(clickSound);

};

function setupContextMenuForBlock() {
  let blockViewContextMenu = new BlockViewContextMenu();
  blockViewContextMenu.render("block-view-context-menu-placeholder");
  blockViewContextMenu.addListeners();
  contextMenus.blockView = blockViewContextMenu;

  let functionDeclarationBlockContextMenu = new FunctionDeclarationBlockContextMenu();
  functionDeclarationBlockContextMenu.render("function-declaration-block-context-menu-placeholder");
  functionDeclarationBlockContextMenu.addListeners();
  contextMenus.functionDeclarationBlock = functionDeclarationBlockContextMenu;

  let bitwiseOperatorBlockContextMenu = new BitwiseOperatorBlockContextMenu();
  bitwiseOperatorBlockContextMenu.render("bitwise-operator-block-context-menu-placeholder");
  bitwiseOperatorBlockContextMenu.addListeners();
  contextMenus.bitwiseOperatorBlock = bitwiseOperatorBlockContextMenu;

  let arithmeticBlockContextMenu = new ArithmeticBlockContextMenu();
  arithmeticBlockContextMenu.render("arithmetic-block-context-menu-placeholder");
  arithmeticBlockContextMenu.addListeners();
  contextMenus.arithmeticBlock = arithmeticBlockContextMenu;

  let globalVariableBlockContextMenu = new GlobalVariableBlockContextMenu();
  globalVariableBlockContextMenu.render("global-variable-block-context-menu-placeholder");
  globalVariableBlockContextMenu.addListeners();
  contextMenus.globalVariableBlock = globalVariableBlockContextMenu;

  let globalObjectBlockContextMenu = new GlobalObjectBlockContextMenu();
  globalObjectBlockContextMenu.render("global-object-block-context-menu-placeholder");
  globalObjectBlockContextMenu.addListeners();
  contextMenus.globalObjectBlock = globalObjectBlockContextMenu;

  let seriesBlockContextMenu = new SeriesBlockContextMenu();
  seriesBlockContextMenu.render("series-block-context-menu-placeholder");
  seriesBlockContextMenu.addListeners();
  contextMenus.seriesBlock = seriesBlockContextMenu;

  let rgbaColorBlockContextMenu = new RgbaColorBlockContextMenu();
  rgbaColorBlockContextMenu.render("rgba-color-block-context-menu-placeholder");
  rgbaColorBlockContextMenu.addListeners();
  contextMenus.rgbaColorBlock = rgbaColorBlockContextMenu;

  let complexNumberBlockContextMenu = new ComplexNumberBlockContextMenu();
  complexNumberBlockContextMenu.render("complex-number-block-context-menu-placeholder");
  complexNumberBlockContextMenu.addListeners();
  contextMenus.complexNumberBlock = complexNumberBlockContextMenu;

  let vectorBlockContextMenu = new VectorBlockContextMenu();
  vectorBlockContextMenu.render("vector-block-context-menu-placeholder");
  vectorBlockContextMenu.addListeners();
  contextMenus.vectorBlock = vectorBlockContextMenu;

  let normalizationBlockContextMenu = new NormalizationBlockContextMenu();
  normalizationBlockContextMenu.render("normalization-block-context-menu-placeholder");
  normalizationBlockContextMenu.addListeners();
  contextMenus.normalizationBlock = normalizationBlockContextMenu;

  let workerBlockContextMenu = new WorkerBlockContextMenu();
  workerBlockContextMenu.render("worker-block-context-menu-placeholder");
  workerBlockContextMenu.addListeners();
  contextMenus.workerBlock = workerBlockContextMenu;

  let actionBlockContextMenu = new ActionBlockContextMenu();
  actionBlockContextMenu.render("action-block-context-menu-placeholder");
  actionBlockContextMenu.addListeners();
  contextMenus.actionBlock = actionBlockContextMenu;

  let turnoutSwitchContextMenu = new TurnoutSwitchContextMenu();
  turnoutSwitchContextMenu.render("turnout-switch-context-menu-placeholder");
  turnoutSwitchContextMenu.addListeners();
  contextMenus.turnoutSwitch = turnoutSwitchContextMenu;

  let switchStatementBlockContextMenu = new SwitchStatementBlockContextMenu();
  switchStatementBlockContextMenu.render("switch-statement-block-context-menu-placeholder");
  switchStatementBlockContextMenu.addListeners();
  contextMenus.switchStatementBlock = switchStatementBlockContextMenu;

  let notBlockContextMenu = new NotBlockContextMenu();
  notBlockContextMenu.render("not-block-context-menu-placeholder");
  notBlockContextMenu.addListeners();
  contextMenus.notBlock = notBlockContextMenu;

  let logicBlockContextMenu = new LogicBlockContextMenu();
  logicBlockContextMenu.render("logic-block-context-menu-placeholder");
  logicBlockContextMenu.addListeners();
  contextMenus.logicBlock = logicBlockContextMenu;

  let unaryFunctionBlockContextMenu = new UnaryFunctionBlockContextMenu();
  unaryFunctionBlockContextMenu.render("unary-function-block-context-menu-placeholder");
  unaryFunctionBlockContextMenu.addListeners();
  contextMenus.unaryFunctionBlock = unaryFunctionBlockContextMenu;

  let binaryFunctionBlockContextMenu = new BinaryFunctionBlockContextMenu();
  binaryFunctionBlockContextMenu.render("binary-function-block-context-menu-placeholder");
  binaryFunctionBlockContextMenu.addListeners();
  contextMenus.binaryFunctionBlock = binaryFunctionBlockContextMenu;

  let multivariableFunctionBlockContextMenu = new MultivariableFunctionBlockContextMenu();
  multivariableFunctionBlockContextMenu.render("multivariable-function-block-context-menu-placeholder");
  multivariableFunctionBlockContextMenu.addListeners();
  contextMenus.multivariableFunctionBlock = multivariableFunctionBlockContextMenu;

  let parametricEquationBlockContextMenu = new ParametricEquationBlockContextMenu();
  parametricEquationBlockContextMenu.render("parametric-equation-block-context-menu-placeholder");
  parametricEquationBlockContextMenu.addListeners();
  contextMenus.parametricEquationBlock = parametricEquationBlockContextMenu;

  let bundledFunctionsBlockContextMenu = new BundledFunctionsBlockContextMenu();
  bundledFunctionsBlockContextMenu.render("bundled-functions-block-context-menu-placeholder");
  bundledFunctionsBlockContextMenu.addListeners();
  contextMenus.bundledFunctionsBlock = bundledFunctionsBlockContextMenu;

  let toggleSwitchContextMenu = new ToggleSwitchContextMenu();
  toggleSwitchContextMenu.render("toggle-switch-context-menu-placeholder");
  toggleSwitchContextMenu.addListeners();
  contextMenus.toggleSwitch = toggleSwitchContextMenu;

  let momentarySwitchContextMenu = new MomentarySwitchContextMenu();
  momentarySwitchContextMenu.render("momentary-switch-context-menu-placeholder");
  momentarySwitchContextMenu.addListeners();
  contextMenus.momentarySwitch = momentarySwitchContextMenu;

  let sliderContextMenu = new SliderContextMenu();
  sliderContextMenu.render("slider-context-menu-placeholder");
  sliderContextMenu.addListeners();
  contextMenus.slider = sliderContextMenu;

  let itemSelectorContextMenu = new ItemSelectorContextMenu();
  itemSelectorContextMenu.render("item-selector-context-menu-placeholder");
  itemSelectorContextMenu.addListeners();
  contextMenus.itemSelector = itemSelectorContextMenu;

  let stickerContextMenu = new StickerContextMenu();
  stickerContextMenu.render("sticker-context-menu-placeholder");
  stickerContextMenu.addListeners();
  contextMenus.sticker = stickerContextMenu;

  let beeperContextMenu = new BeeperContextMenu();
  beeperContextMenu.render("beeper-context-menu-placeholder");
  beeperContextMenu.addListeners();
  contextMenus.beeper = beeperContextMenu;

  let grapherContextMenu = new GrapherContextMenu();
  grapherContextMenu.render("grapher-context-menu-placeholder");
  grapherContextMenu.addListeners();
  contextMenus.grapher = grapherContextMenu;

  let space2dContextMenu = new Space2DContextMenu();
  space2dContextMenu.render("space2d-context-menu-placeholder");
  space2dContextMenu.addListeners();
  contextMenus.space2d = space2dContextMenu;

  let rainbowHatBlockContextMenu = new RainbowHatBlockContextMenu();
  rainbowHatBlockContextMenu.render("rainbow-hat-block-context-menu-placeholder");
  rainbowHatBlockContextMenu.addListeners();
  contextMenus.rainbowHatBlock = rainbowHatBlockContextMenu;

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

window.onresize = function () {
  resize();
  draw();
};

function resize() {
  if (document.getElementById("model-playground").style.display == "block") {
    let componentsPanelRect = document.getElementById("model-playground-components-panel").getBoundingClientRect() as DOMRect;
    let workbenchRect = system.workbench.canvas.getBoundingClientRect() as DOMRect;
    system.workbench.canvas.width = window.innerWidth - componentsPanelRect.right - 16;
    system.workbench.canvas.height = window.innerHeight - workbenchRect.top - 50;
    let componentsScroller = document.getElementById("components-scroller") as HTMLDivElement;
    componentsScroller.style.height = system.workbench.canvas.height * 0.85 + "px";
  }
  if (document.getElementById("block-playground").style.display == "block") {
    let blockViewWrapper = document.getElementById("block-view-wrapper");
    let blockElementsPanelRect = document.getElementById("block-elements-panel").getBoundingClientRect() as DOMRect;
    let blockViewWrapperRect = blockViewWrapper.getBoundingClientRect() as DOMRect;
    let w = window.innerWidth - blockElementsPanelRect.right - 15;
    let h = window.innerHeight - blockViewWrapperRect.top - 45;
    blockViewWrapper.style.width = w + "px";
    blockViewWrapper.style.height = h + "px";
    let elementsScroller = document.getElementById("elements-scroller") as HTMLDivElement;
    elementsScroller.style.height = h * 0.85 + "px";
  }
}

function draw() {
  system.draw();
  flowchart.blockView.requestDraw();
}
