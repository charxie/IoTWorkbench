/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {GlobalVariableBlock} from "../GlobalVariableBlock";

export class GlobalVariableBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "global-variable-block-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="global-variable-key-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Value:</td>
                  <td><input type="text" id="global-variable-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="global-variable-block-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="global-variable-block-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof GlobalVariableBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let keyInputElement = document.getElementById("global-variable-key-field") as HTMLInputElement;
      keyInputElement.value = block.getKey();
      let valueInputElement = document.getElementById("global-variable-value-field") as HTMLInputElement;
      valueInputElement.value = block.getValue() ? block.getValue().toString() : 0;
      let widthInputElement = document.getElementById("global-variable-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("global-variable-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          block.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          block.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          if (keyInputElement.value !== block.getKey()) {
            block.setKey(keyInputElement.value);
          }
          block.setValue(valueInputElement.value);
          flowchart.updateGlobalVariable(block.getKey(), block.getValue());
          block.refreshView();
          flowchart.blockView.requestDraw();
           flowchart.updateResults(); // global variable must update the results globally
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
          d.dialog('close');
        } else {
          Util.showErrorMessage(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      keyInputElement.addEventListener("keyup", enterKeyUp);
      valueInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 300,
        buttons: {
          'OK': okFunction,
          'Cancel': function () {
            d.dialog('close');
          }
        }
      });
    }
  }

}
