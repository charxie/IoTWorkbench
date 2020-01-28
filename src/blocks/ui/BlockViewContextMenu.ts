/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {StateIO} from "../../StateIO";
import {MyContextMenu} from "../../MyContextMenu";
import {BlockView} from "../BlockView";
import {PngSaver} from "../../tools/PngSaver";
import {State} from "../../State";

export class BlockViewContextMenu extends MyContextMenu {

  view: BlockView;

  constructor() {
    super();
    this.id = "block-view-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 170px; z-index: 10000">
              <li class="menu-item disabled" id="${this.id}-paste-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-paste-button"><i class="fas fa-paste"></i><span class="menu-text">Paste</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-clear-button"><i class="fas fa-eraser"></i><span class="menu-text">Clear</span></button>
              </li>
              <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-open-button"><i class="fas fa-folder-open"></i><span class="menu-text">Open</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-button"><i class="fas fa-download"></i><span class="menu-text">Save</span></button>
              </li>
              <li class="menu-separator"></li>
              <li class="menu-item disabled">
                <button type="button" class="menu-btn" id="${this.id}-copy-image-button"><i class="fas fa-copy"></i><span class="menu-text">Copy Image</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-screenshot-button"><i class="fas fa-camera"></i><span class="menu-text">Save Screenshot</span></button>
              </li>
              <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let pasteButton = document.getElementById(this.id + "-paste-button");
    pasteButton.addEventListener("click", this.pasteButtonClick.bind(this), false);
    let openButton = document.getElementById(this.id + "-open-button");
    openButton.addEventListener("click", this.openButtonClick.bind(this), false);
    let saveButton = document.getElementById(this.id + "-save-button");
    saveButton.addEventListener("click", this.saveButtonClick.bind(this), false);
    let copyImageButton = document.getElementById(this.id + "-copy-image-button");
    copyImageButton.addEventListener("click", this.copyImageButtonClick.bind(this), false);
    let screenshotButton = document.getElementById(this.id + "-save-screenshot-button");
    screenshotButton.addEventListener("click", this.screenshotButtonClick.bind(this), false);
    let clearButton = document.getElementById(this.id + "-clear-button");
    clearButton.addEventListener("click", this.clearButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private pasteButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    flowchart.blockView.paste();
  }

  private clearButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (flowchart.blocks.length > 0 || flowchart.connectors.length > 0) {
      let message = "<div style='font-size: 90%;'>Are you sure you want to clear the flow scene?</div>";
      $("#modal-dialog").html(message).dialog({
        resizable: false,
        modal: true,
        title: "Clear",
        height: 150,
        width: 300,
        buttons: {
          'OK': function () {
            flowchart.clear();
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

  private openButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    StateIO.open();
  }

  private saveButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    StateIO.saveAs(JSON.stringify(new State()));
  }

  private copyImageButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    //this.view.canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]));
  }

  private screenshotButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs(this.view.canvas);
  }

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Background Color:</td>
                  <td><input type="text" id="block-view-background-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Block Style:</td>
                  <td>
                    <select id="block-view-block-style-selector" style="width: 120px">
                      <option value="Plain">Plain</option>
                      <option value="Shade" selected>Shade</option>
                    </select>
                </tr>
                <tr>
                  <td>Canvas Width:</td>
                  <td><input type="text" id="block-view-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Canvas Height:</td>
                  <td><input type="text" id="block-view-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  private settingsButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    let view = this.view;
    let d = $("#modal-dialog").html(this.getSettingsUI());
    let backgroundColorInputElement = document.getElementById("block-view-background-color-field") as HTMLInputElement;
    backgroundColorInputElement.value = view.getBackgroundColor();
    let blockStyleSelectElement = document.getElementById("block-view-block-style-selector") as HTMLSelectElement;
    blockStyleSelectElement.value = view.getBlockStyle();
    let widthInputElement = document.getElementById("block-view-width-field") as HTMLInputElement;
    widthInputElement.value = view.canvas.width.toString();
    let heightInputElement = document.getElementById("block-view-height-field") as HTMLInputElement;
    heightInputElement.value = view.canvas.height.toString();
    const okFunction = function () {
      view.setBackgroundColor(backgroundColorInputElement.value);
      view.setBlockStyle(blockStyleSelectElement.value);
      view.flowchart.storeViewState();
      view.flowchart.blockView.requestDraw();
      d.dialog('close');
    };
    const enterKeyUp = function (e) {
      if (e.key == "Enter") {
        okFunction();
      }
    };
    backgroundColorInputElement.addEventListener("keyup", enterKeyUp);
    d.dialog({
      resizable: false,
      modal: true,
      title: "Flow View Settings",
      height: 300,
      width: 320,
      buttons: {
        'OK': okFunction,
        'Cancel': function () {
          d.dialog('close');
        }
      }
    });
  }

}
