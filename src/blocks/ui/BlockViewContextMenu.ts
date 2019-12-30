/*
 * @author Charles Xie
 */

import $ from "jquery";
import {MyContextMenu} from "../../MyContextMenu";
import {closeAllContextMenus, flowchart} from "../../Main";

export class BlockViewContextMenu extends MyContextMenu {

  constructor() {
    super();
    this.id = "block-view-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-folder-open"></i><span class="menu-text">Open</span></button>
              </li>
              <li class="menu-item disabled">
                <button type="button" class="menu-btn"><i class="fas fa-download"></i><span class="menu-text">Save</span></button>
              </li>
              <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
              <li class="menu-item submenu">
                <button type="button" class="menu-btn"><i class="fas fa-file-import"></i><span class="menu-text">Import</span></button>

                <menu class="menu" style="width: 160px;">
                  <li class="menu-item">
                    <button type="button" class="menu-btn"><span class="menu-text">Breadboard</span></button>
                  </li>

                  <li class="menu-item submenu">
                    <button type="button" class="menu-btn"><span class="menu-text">Actuators</span></button>
                    <menu class="menu" style="width: 180px;">
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">Buzzer</span></button>
                      </li>
                    </menu>
                  </li>

                </menu>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>X:</td>
                  <td>Y</td>
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
