/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";

export class SliderContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "slider-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>ID:</td>
                  <td>${this.block.getUid().substring(this.block.getUid().indexOf("#"))}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="slider-name-field"></td>
                </tr>
                <tr>
                  <td>Minimum:</td>
                  <td><input type="text" id="slider-minimum-field"></td>
                </tr>
                <tr>
                  <td>Maximum:</td>
                  <td><input type="text" id="slider-maximum-field"></td>
                </tr>
                <tr>
                  <td>Steps:</td>
                  <td><input type="text" id="slider-steps-field"></td>
                </tr>
                <tr>
                  <td>Current Value:</td>
                  <td><input type="text" id="slider-current-value-field"></td>
                </tr>
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let that = this;
      $("#modal-dialog").html(this.getSettingsUI());
      let e = document.getElementById("slider-name-field") as HTMLInputElement;
      e.value = this.block.getName();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Slider Settings",
        height: 400,
        width: 400,
        buttons: {
          'OK': function () {
            let nameField = document.getElementById("slider-name-field") as HTMLInputElement;
            that.block.setName(nameField.value);
            flowchart.storeBlockStates();
            flowchart.draw();
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

}
