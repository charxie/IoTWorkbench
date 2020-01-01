/*
 * @author Charles Xie
 */

import $ from "jquery";
import {ToggleSwitch} from "../ToggleSwitch";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart} from "../../Main";

export class ToggleSwitchContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "toggle-switch-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="toggle-switch-name-field"></td>
                </tr>
                <tr>
                  <td>Value:</td>
                  <td><input type="text" id="toggle-switch-value-field"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="toggle-switch-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="toggle-switch-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let toggleSwitch = <ToggleSwitch>this.block;
      $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("toggle-switch-name-field") as HTMLInputElement;
      nameInputElement.value = toggleSwitch.getName();
      let valueInputElement = document.getElementById("toggle-switch-value-field") as HTMLInputElement;
      valueInputElement.value = toggleSwitch.isSelected() ? "true" : "false";
      let widthInputElement = document.getElementById("toggle-switch-width-field") as HTMLInputElement;
      widthInputElement.value = toggleSwitch.getWidth().toString();
      let heightInputElement = document.getElementById("toggle-switch-height-field") as HTMLInputElement;
      heightInputElement.value = toggleSwitch.getHeight().toString();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: toggleSwitch.getUid(),
        height: 450,
        width: 300,
        buttons: {
          'OK': function () {
            toggleSwitch.setName(nameInputElement.value);
            toggleSwitch.setSelected(valueInputElement.value == "true");
            toggleSwitch.setWidth(parseInt(widthInputElement.value));
            toggleSwitch.setHeight(parseInt(heightInputElement.value));
            toggleSwitch.refreshView();
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
