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
      let nameField = document.getElementById("global-object-name-field") as HTMLInputElement;
      nameField.value = block.getSymbol();
      let keysField = document.getElementById("global-object-keys-field") as HTMLInputElement;
      keysField.value = JSON.stringify(block.getKeys());
      let valuesField = document.getElementById("global-object-values-field") as HTMLInputElement;
      valuesField.value = JSON.stringify(block.getValues());
      let initialValuesField = document.getElementById("global-object-initial-values-field") as HTMLInputElement;
      initialValuesField.value = block.getInitialValues() == undefined ? "" : JSON.stringify(block.getInitialValues());
      let insetMarginField = document.getElementById("global-object-inset-margin-field") as HTMLInputElement;
      insetMarginField.value = block.getMarginX().toString();
      let widthField = document.getElementById("global-object-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("global-object-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set inset margin
        let margin = parseInt(insetMarginField.value);
        if (isNumber(margin)) {
          block.setMarginX(Math.max(15, margin));
        } else {
          success = false;
          message = insetMarginField.value + " is not a valid margin";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          block.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          block.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // parse keys
        let keys;
        try {
          keys = JSON.parse(keysField.value);
        } catch (e) {
          console.log(e.stack);
          success = false;
          message = keysField.value + " is not valid: " + e.message;
        }
        if (success && !Array.isArray(keys)) {
          success = false;
          message = "Keys must be an array. Cannot accept " + keysField.value;
        }
        // parse values
        let values;
        try {
          values = JSON.parse(valuesField.value);
        } catch (e) {
          console.log(e.stack);
          success = false;
          message = valuesField.value + " is not valid: " + e.message;
        }
        if (success && !Array.isArray(values)) {
          success = false;
          message = "Values must be an array. Cannot accept " + valuesField.value;
        }
        // parse initial values
        let initialValues;
        try {
          initialValues = JSON.parse(initialValuesField.value);
        } catch (e) {
          console.log(e.stack);
          success = false;
          message = initialValuesField.value + " is not valid: " + e.message;
        }
        if (success && !Array.isArray(initialValues)) {
          success = false;
          message = "Initial values must be an array. Cannot accept " + initialValuesField.value;
        }
        // finish
        if (success) {
          block.setSymbol(nameField.value);
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
      const enterKeyUp = (e) => {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      nameField.addEventListener("keyup", enterKeyUp);
      keysField.addEventListener("keyup", enterKeyUp);
      valuesField.addEventListener("keyup", enterKeyUp);
      initialValuesField.addEventListener("keyup", enterKeyUp);
      insetMarginField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 450,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
