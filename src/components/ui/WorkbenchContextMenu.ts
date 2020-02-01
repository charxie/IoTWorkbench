/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, system} from "../../Main";
import {MyContextMenu} from "../../MyContextMenu";
import {StateIO} from "../../StateIO";
import {State} from "../../State";
import {PngSaver} from "../../tools/PngSaver";
import html2canvas from "html2canvas";

export class WorkbenchContextMenu extends MyContextMenu {

  constructor() {
    super();
    this.id = "workbench-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 200px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-open-button"><i class="fas fa-folder-open"></i><span class="menu-text">Open</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-button"><i class="fas fa-download"></i><span class="menu-text">Save</span></button>
              </li>
               <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-screenshot-button"><i class="fas fa-camera"></i><span class="menu-text">Save Screenshot</span></button>
              </li>
             <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-clear-button"><i class="fas fa-eraser"></i><span class="menu-text">Clear</span></button>
              </li>
             <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let openButton = document.getElementById(this.id + "-open-button");
    openButton.addEventListener("click", this.openButtonClick.bind(this), false);
    let saveButton = document.getElementById(this.id + "-save-button");
    saveButton.addEventListener("click", this.saveButtonClick.bind(this), false);
    let screenshotButton = document.getElementById(this.id + "-save-screenshot-button");
    screenshotButton.addEventListener("click", this.screenshotButtonClick.bind(this), false);
    let clearButton = document.getElementById(this.id + "-clear-button");
    clearButton.addEventListener("click", this.clearButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private clearButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (system.mcus.length > 0 || system.hats.length > 0) {
      let message = "<div style='font-size: 90%;'>Are you sure you want to clear the model scene?</div>";
      $("#modal-dialog").html(message).dialog({
        resizable: false,
        modal: true,
        title: "Clear",
        height: 150,
        width: 350,
        buttons: {
          'OK': function () {
            system.clear();
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

  private screenshotButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    html2canvas(document.getElementById("workbench")).then(function (canvas) {
      PngSaver.saveAs(canvas);
    });
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

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Grid lines:</td>
                  <td><input type="checkbox" id="workbench-show-grid-checkbox">Show</td>
                </tr>
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    let d = $("#modal-dialog").html(this.getSettingsUI());
    let showGridCheckBox = document.getElementById("workbench-show-grid-checkbox") as HTMLInputElement;
    showGridCheckBox.checked = system.workbench.showGrid;
    d.dialog({
      resizable: false,
      modal: true,
      title: "Workbench Settings",
      height: 400,
      width: 400,
      buttons: {
        'OK': function () {
          system.workbench.showGrid = showGridCheckBox.checked;
          system.workbench.draw();
          system.workbench.storeState();
          $(this).dialog('close');
        },
        'Cancel': function () {
          $(this).dialog('close');
        }
      }
    });
  }

}
