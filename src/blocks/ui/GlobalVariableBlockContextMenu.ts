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

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="global-variable-key-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Current Value:</td>
                  <td><input type="text" id="global-variable-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Initial Value:</td>
                  <td><input type="text" id="global-variable-initial-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Show Value:</td>
                  <td>
                    <input type="radio" name="show-value" id="global-variable-show-value-no-radio-button" checked> No
                    <input type="radio" name="show-value" id="global-variable-show-value-yes-radio-button"> Yes
                  </td>
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

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof GlobalVariableBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let keyInputElement = document.getElementById("global-variable-key-field") as HTMLInputElement;
      keyInputElement.value = block.getKey();
      let valueInputElement = document.getElementById("global-variable-value-field") as HTMLInputElement;
      valueInputElement.value = block.getValue() ? block.getValue().toString() : 0;
      let initialValueInputElement = document.getElementById("global-variable-initial-value-field") as HTMLInputElement;
      initialValueInputElement.value = block.getInitialValue() ? block.getInitialValue().toString() : undefined;
      let showValueNoRadioButton = document.getElementById("global-variable-show-value-no-radio-button") as HTMLInputElement;
      showValueNoRadioButton.checked = !block.getShowValue();
      let showValueYesRadioButton = document.getElementById("global-variable-show-value-yes-radio-button") as HTMLInputElement;
      showValueYesRadioButton.checked = block.getShowValue();
      let widthInputElement = document.getElementById("global-variable-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("global-variable-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        block.setShowValue(showValueYesRadioButton.checked);
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
          block.setInitialValue(initialValueInputElement.value);
          flowchart.updateGlobalVariable(block.getKey(), block.getValue());
          block.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.updateResults(); // global variable must update the results globally
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
          d.dialog('close');
        } else {
          Util.showInputError(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      keyInputElement.addEventListener("keyup", enterKeyUp);
      valueInputElement.addEventListener("keyup", enterKeyUp);
      initialValueInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 360,
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
