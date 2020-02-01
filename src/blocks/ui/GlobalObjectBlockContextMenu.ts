/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {GlobalVariableBlock} from "../GlobalVariableBlock";
import {GlobalObjectBlock} from "../GlobalObjectBlock";

export class GlobalObjectBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "global-object-block-context-menu";
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
                  <td><input type="text" id="global-object-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Keys:</td>
                  <td><input type="text" id="global-object-keys-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Values:</td>
                  <td><input type="text" id="global-object-values-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="global-object-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="global-object-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof GlobalObjectBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("global-object-name-field") as HTMLInputElement;
      nameInputElement.value = block.getSymbol();
      let keysInputElement = document.getElementById("global-object-keys-field") as HTMLInputElement;
      keysInputElement.value = JSON.stringify(block.getKeys());
      let valuesInputElement = document.getElementById("global-object-values-field") as HTMLInputElement;
      valuesInputElement.value = JSON.stringify(block.getValues());
      let widthInputElement = document.getElementById("global-object-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("global-object-block-height-field") as HTMLInputElement;
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
          block.setSymbol(nameInputElement.value);
          let keys = JSON.parse(keysInputElement.value);
          if (block.getKeys() !== keys) {
            block.setKeys(keys);
          }
          block.setValues(JSON.parse(valuesInputElement.value));
          for (let i = 0; i < block.getKeys().length; i++) {
            flowchart.updateGlobalVariable(block.getKeys()[i], block.getValues()[i]);
          }
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
      nameInputElement.addEventListener("keyup", enterKeyUp);
      keysInputElement.addEventListener("keyup", enterKeyUp);
      valuesInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 320,
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
