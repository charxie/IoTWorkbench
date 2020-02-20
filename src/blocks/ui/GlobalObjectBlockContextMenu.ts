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
                  <td>Current Values:</td>
                  <td><input type="text" id="global-object-values-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Initial Values:</td>
                  <td><input type="text" id="global-object-initial-values-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Inset Margin:</td>
                  <td><input type="text" id="global-object-inset-margin-field" style="width: 100%"></td>
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

  propertiesButtonClick(): void {
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
      let initialValuesInputElement = document.getElementById("global-object-initial-values-field") as HTMLInputElement;
      initialValuesInputElement.value = block.getInitialValues() == undefined ? "" : JSON.stringify(block.getInitialValues());
      let insetMarginInputElement = document.getElementById("global-object-inset-margin-field") as HTMLInputElement;
      insetMarginInputElement.value = block.getMargin().toString();
      let widthInputElement = document.getElementById("global-object-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("global-object-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set inset margin
        let margin = parseInt(insetMarginInputElement.value);
        if (isNumber(margin)) {
          block.setMargin(Math.max(15, margin));
        } else {
          success = false;
          message = insetMarginInputElement.value + " is not a valid margin.";
        }
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
        // parse keys
        let keys;
        try {
          keys = JSON.parse(keysInputElement.value);
        } catch (e) {
          console.log(e.stack);
          success = false;
          message = keysInputElement.value + " is not valid: " + e.message;
        }
        if (success && !Array.isArray(keys)) {
          success = false;
          message = "Keys must be an array. Cannot accept " + keysInputElement.value;
        }
        // parse values
        let values;
        try {
          values = JSON.parse(valuesInputElement.value);
        } catch (e) {
          console.log(e.stack);
          success = false;
          message = valuesInputElement.value + " is not valid: " + e.message;
        }
        if (success && !Array.isArray(values)) {
          success = false;
          message = "Values must be an array. Cannot accept " + valuesInputElement.value;
        }
        // parse initial values
        let initialValues;
        try {
          initialValues = JSON.parse(initialValuesInputElement.value);
        } catch (e) {
          console.log(e.stack);
          success = false;
          message = initialValuesInputElement.value + " is not valid: " + e.message;
        }
        if (success && !Array.isArray(initialValues)) {
          success = false;
          message = "Initial values must be an array. Cannot accept " + initialValuesInputElement.value;
        }
        // finish
        if (success) {
          block.setSymbol(nameInputElement.value);
          if (keys !== undefined && values !== undefined) {
            if (block.getKeys() !== keys) {
              block.setKeys(keys);
            }
            block.setValues(values);
            for (let i = 0; i < keys.length; i++) {
              flowchart.updateGlobalVariable(keys[i], values[i]);
            }
          }
          if (initialValues !== undefined) {
            block.setInitialValues(initialValues);
          }
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
      nameInputElement.addEventListener("keyup", enterKeyUp);
      keysInputElement.addEventListener("keyup", enterKeyUp);
      valuesInputElement.addEventListener("keyup", enterKeyUp);
      initialValuesInputElement.addEventListener("keyup", enterKeyUp);
      insetMarginInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 450,
        width: 400,
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
