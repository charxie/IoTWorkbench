/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {IntegralBlock} from "../IntegralBlock";

export class IntegralBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "integral-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="integral-block-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Method:</td>
                  <td>
                    <select id="integral-block-method-selector" style="width: 100%">
                      <option value="Trapezoidal Rule" selected>Trapezoidal Rule</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Fraction Digits:</td>
                  <td><input type="text" id="integral-block-fraction-digits-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="integral-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="integral-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof IntegralBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("integral-block-name-field") as HTMLInputElement;
      nameField.value = block.getName();
      let methodSelector = document.getElementById("integral-block-method-selector") as HTMLSelectElement;
      methodSelector.value = block.getMethod();
      let fractionDigitsField = document.getElementById("integral-block-fraction-digits-field") as HTMLInputElement;
      fractionDigitsField.value = block.getFractionDigits().toString();
      let widthField = document.getElementById("integral-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("integral-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
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
        // set fraction digits
        let fractionDigits = parseInt(fractionDigitsField.value);
        if (isNumber(fractionDigits)) {
          block.setFractionDigits(Math.max(0, fractionDigits));
        } else {
          success = false;
          message = fractionDigitsField.value + " is not valid for fraction digits";
        }
        // finish
        if (success) {
          block.setMethod(methodSelector.value);
          block.setName(nameField.value);
          block.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(block);
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
      fractionDigitsField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 350,
        width: 360,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
