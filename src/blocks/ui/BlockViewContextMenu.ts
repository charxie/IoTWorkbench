/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus} from "../../Main";
import {StateIO} from "../../StateIO";
import {MyContextMenu} from "../../MyContextMenu";
import {BlockView} from "../BlockView";
import {Flowchart} from "../Flowchart";
import {PngSaver} from "../../tools/PngSaver";

export class BlockViewContextMenu extends MyContextMenu {

  view: BlockView;

  constructor() {
    super();
    this.id = "block-view-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-open-button"><i class="fas fa-folder-open"></i><span class="menu-text">Open</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-button"><i class="fas fa-download"></i><span class="menu-text">Save</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-screenshot-button"><i class="fas fa-camera"></i><span class="menu-text">Screenshot</span></button>
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
    let screenshotButton = document.getElementById(this.id + "-screenshot-button");
    screenshotButton.addEventListener("click", this.screenshotButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private openButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    StateIO.open();
  }

  private saveButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    StateIO.saveAs(JSON.stringify(new Flowchart.State(this.view.flowchart)));
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
                  <td>${this.view.canvas.style.backgroundColor}</td>
                </tr>
              </table>
            </div>`;
  }

  private settingsButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    $("#modal-dialog").html(this.getSettingsUI());
    $("#modal-dialog").dialog({
      resizable: false,
      modal: true,
      title: "Block View Settings",
      height: 400,
      width: 400,
      buttons: {
        'OK': function () {
          $(this).dialog('close');
        },
        'Cancel': function () {
          $(this).dialog('close');
        }
      }
    });
  }

}
