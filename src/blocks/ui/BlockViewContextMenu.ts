/*
 * @author Charles Xie
 */

import $ from "jquery";
import {MyContextMenu} from "../../MyContextMenu";
import {closeAllContextMenus} from "../../Main";
import {BlockView} from "../BlockView";
import {Util} from "../../Util";
import {Flowchart} from "../Flowchart";

export class BlockViewContextMenu extends MyContextMenu {

  view: BlockView;

  constructor() {
    super();
    this.id = "block-view-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-open-button"><i class="fas fa-folder-open"></i><span class="menu-text">Open</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-save-button"><i class="fas fa-download"></i><span class="menu-text">Save</span></button>
              </li>
              <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let saveButton = document.getElementById(this.id + "-save-button");
    saveButton.addEventListener("click", this.saveButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  saveButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    Util.saveText(JSON.stringify(new Flowchart.State(this.view.flowchart)), "block.json");
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

  settingsButtonClick(e: MouseEvent): void {
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
