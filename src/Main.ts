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
import queryString from "query-string";
// @ts-ignore
import clickSound from "./sound/stapler.mp3";

import * as Constants from "./Constants";
import {Sound} from "./Sound";
import {User} from "./User";
import {State} from "./State";
import {StateIO} from "./StateIO";
import {Examples} from "./Examples";
import {PngSaver} from "./tools/PngSaver";

import {Util} from "./Util";
import {System} from "./components/System";
import {ComponentsPanel} from "./components/ui/ComponentsPanel";
import {LineChartContextMenu} from "./components/ui/LineChartContextMenu";
import {ColorPickerContextMenu} from "./components/ui/ColorPickerContextMenu";
import {Flowchart} from "./blocks/Flowchart";
import {BlockElementsPanel} from "./blocks/ui/BlockElementsPanel";
import {createContextMenusForBlocks} from "./BlockContextMenusMaker";
import {createContextMenusForModels} from "./ModelContextMenusMaker";

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);

    drawHalfRoundedRect(x, y, w, h, r, side);

    fillHalfRoundedRect(x, y, w, h, r, side);
  }

  interface Array<T> {
    insertAt(index, item);

    removeItem(item);

    fill(value);
  }

  interface String {
    removeAllSpaces();

    replaceAll(s, t);

    startsWith(s);

    endsWith(s);

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
export const examples = new Examples();
export const query = queryString.parse(location.search);

export function closeAllContextMenus() {
  Object.keys(contextMenus).forEach(key => {
    let menu = document.getElementById(contextMenus[key].id) as HTMLMenuElement;
    menu.classList.remove("show-menu");
  });
}

export function getInstanceString(s: string): string {
  if (query.instanceid) s += ":" + query.instanceid;
  return s;
}

export function isNumber(x: any) {
  return !isNaN(parseFloat(x)) && isFinite(x);
}

function showUnderConstructionMessage() {
  let d = $("#modal-dialog");
  d.html("<div style='font-size: 90%;'>Under construction...</div>").dialog({
    resizable: false,
    modal: true,
    title: "Sorry",
    height: 150,
    width: 200,
    buttons: {
      'OK': () => d.dialog('close')
    }
  });
}

let social = `<span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="Facebook"><i class="fab fa-facebook-square"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="WeChat"><i class="fab fa-weixin"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="Twitter"><i class="fab fa-twitter"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="Weibo"><i class="fab fa-weibo"></i></span>
              <span style="font-size: 2em; vertical-align: middle; cursor: pointer;" title="YouTube"><i class="fab fa-youtube"></i></span>`;

window.onload = function () {

  setupHeader();
  setupFooter();

  let modelTabButton = document.getElementById("model-tab-button") as HTMLButtonElement;
  modelTabButton.addEventListener("click", () => {
    selectTab(modelTabButton, "model-playground");
    resize();
    system.draw();
  });
  let blockTabButton = document.getElementById("block-tab-button") as HTMLButtonElement;
  blockTabButton.addEventListener("click", () => {
    selectTab(blockTabButton, "block-playground");
    resize();
    flowchart.addModelBlockIfMissing();
    flowchart.blockView.requestDraw();
  });
  let codeTabButton = document.getElementById("code-tab-button") as HTMLButtonElement;
  codeTabButton.addEventListener("click", () => {
    selectTab(codeTabButton, "code-playground");
  });
  document.getElementById("main-page-previous-tutorial-button").onclick = () => examples.loadPrevious();
  document.getElementById("main-page-next-tutorial-button").onclick = () => examples.loadNext();

  createContextMenusForModels();
  createContextMenusForBlocks();
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

  if (query.example !== undefined) {
    examples.loadByTitle(query.example.toString());
  } else {
    // read locally stored properties
    StateIO.restoreMcus(localStorage.getItem(getInstanceString("MCU States")));
    StateIO.restoreHats(localStorage.getItem(getInstanceString("HAT States")));
    StateIO.restoreAttachments(localStorage.getItem(getInstanceString("Attachments")));
    StateIO.restoreBlockView(localStorage.getItem(getInstanceString("Block View State")));
    StateIO.restoreBlocks(localStorage.getItem(getInstanceString("Block States")));
    StateIO.restoreFunctionDeclarations();
    StateIO.restoreGlobalVariables();
    StateIO.restoreWorkbench(localStorage.getItem(getInstanceString("Workbench State")));
    StateIO.restoreConnectors(localStorage.getItem(getInstanceString("Connector States"))); // connectors must be restored after loading HATs
    StateIO.finishLoading();
    flowchart.updateResultsExcludingAllWorkerBlocks();
    // flowchart.reset(); // FIXME: why did I call this?
  }

  if (query.tab === "flow") {
    document.getElementById("tabs").style.display = "none";
    let blockElementsPanel = document.getElementById("block-elements-panel");
    blockElementsPanel.style.top = "5px";
    blockElementsPanel.style.bottom = "5px";
  }

  setTimeout(() => { // call this to refresh after inserting canvases
    let startTab = localStorage.getItem(getInstanceString("Start Tab"));
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

function setupFooter() {
  let footer = document.getElementById('footer');
  footer.innerHTML = social + "<div class='horizontal-divider'></div>"
    + Constants.Software.name + " Version " + Constants.Software.version
    + ", created by <a href='https://charxie.github.io/' style='text-decoration: none;'>Dr. Charles Xie</a>, " + new Date().getFullYear();
  if (query.footer === "no") {
    footer.style.display = "none";
  }
}

function setupHeader() {
  document.getElementById("sign-in-label").innerHTML = "Hi, " + user.firstName;
  document.getElementById("name-label").innerHTML = Constants.Software.name;
  document.getElementById("tagline-label").innerHTML = Constants.Software.tagline;
  document.getElementById("main-page-new-file-button").onclick = () => flowchart.askToClear();
  document.getElementById("main-page-undo-button").onclick = () => {
    if (undoManager.hasUndo()) {
      undoManager.undo();
    }
  };
  document.getElementById("main-page-redo-button").onclick = () => {
    if (undoManager.hasRedo()) {
      undoManager.redo();
    }
  };
  document.getElementById("main-page-home-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-camera-button").onclick = () => {
    html2canvas(document.body).then(function (canvas) {
      PngSaver.saveAs(canvas);
    });
  };
  document.getElementById("main-page-share-button").onclick = () => {
    let url = document.location.href;
    let title = examples.getCurrentTitle();
    if (title) {
      let hasQuery = url.indexOf("?") > 0;
      if (hasQuery) {
        let index = url.indexOf("example=");
        if (index > 0) {
          let s = url.substring(index + 8);
          let nextIndex = s.indexOf("&");
          if (nextIndex >= 0) {
            s = s.substr(0, nextIndex);
          }
          url = url.replace(s, encodeURIComponent(title));
        } else {
          url += "&example=" + encodeURIComponent(title);
        }
      } else {
        url += "?example=" + encodeURIComponent(title);
      }
    }
    Util.copyStringToClipboard(url);
    let d = $("#modal-dialog");
    d.html("<div style='font-size: 90%;'>" + url + "<br>was copied to the clipboard.</div>").dialog({
      resizable: false,
      modal: true,
      title: "Share Link",
      height: 200,
      width: 400,
      buttons: {
        'OK': () => d.dialog('close')
      }
    });
  };
  document.getElementById("main-page-open-file-button").onclick = () => StateIO.open();
  document.getElementById("main-page-download-button").onclick = () => StateIO.saveAs(JSON.stringify(new State()));
  document.getElementById("main-page-settings-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-help-button").onclick = showUnderConstructionMessage;
  document.getElementById("main-page-signout-button").onclick = showUnderConstructionMessage;
  if (query.header === "no") {
    document.getElementById("header").style.display = "none";
  }
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
  localStorage.setItem(getInstanceString("Start Tab"), tabId);
}

window.onresize = () => {
  resize();
  draw();
};

function resize() {
  if (document.getElementById("model-playground").style.display == "block") {
    let componentsPanelRect = document.getElementById("model-playground-components-panel").getBoundingClientRect() as DOMRect;
    let workbenchRect = system.workbench.canvas.getBoundingClientRect() as DOMRect;
    system.workbench.canvas.width = window.innerWidth - componentsPanelRect.right - 16;
    system.workbench.canvas.height = window.innerHeight - workbenchRect.top - 30;
    let componentsScroller = document.getElementById("components-scroller") as HTMLDivElement;
    componentsScroller.style.height = system.workbench.canvas.height * 0.85 + "px";
  }
  if (document.getElementById("block-playground").style.display == "block") {
    let onlyFlowTab = query.tab === "flow";
    let blockViewWrapper = document.getElementById("block-view-wrapper");
    let blockElementsPanelRect = document.getElementById("block-elements-panel").getBoundingClientRect() as DOMRect;
    let blockViewWrapperRect = blockViewWrapper.getBoundingClientRect() as DOMRect;
    let w = window.innerWidth - blockElementsPanelRect.right - 15;
    let h = window.innerHeight - blockViewWrapperRect.top - (onlyFlowTab ? 5 : 25);
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
