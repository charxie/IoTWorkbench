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
      let nameInputElement = document.getElementById("integral-block-name-field") as HTMLInputElement;
      nameInputElement.value = block.getName();
      let methodSelectElement = document.getElementById("integral-block-method-selector") as HTMLSelectElement;
      methodSelectElement.value = block.getMethod();
      let fractionDigitsInputElement = document.getElementById("integral-block-fraction-digits-field") as HTMLInputElement;
      fractionDigitsInputElement.value = block.getFractionDigits().toString();
      let widthInputElement = document.getElementById("integral-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("integral-block-height-field") as HTMLInputElement;
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
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          block.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
        }
        // set fraction digits
        let fractionDigits = parseInt(fractionDigitsInputElement.value);
        if (isNumber(fractionDigits)) {
          block.setFractionDigits(Math.max(0, fractionDigits));
        } else {
          success = false;
          message = fractionDigitsInputElement.value + " is not valid for fraction digits";
        }
        // finish
        if (success) {
          block.setMethod(methodSelectElement.value);
          block.setName(nameInputElement.value);
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
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      nameInputElement.addEventListener("keyup", enterKeyUp);
      fractionDigitsInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 350,
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
