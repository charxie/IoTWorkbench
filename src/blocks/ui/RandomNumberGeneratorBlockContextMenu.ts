/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {RandomNumberGeneratorBlock} from "../RandomNumberGeneratorBlock";

export class RandomNumberGeneratorBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "random-number-generator-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="random-number-generator-block-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Number of Outputs:</td>
                  <td><input type="text" id="random-number-generator-block-number-of-outputs-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Type:</td>
                  <td>
                    <select id="random-number-generator-block-type-selector" style="width: 100%">
                      <option value="Uniform" selected>Uniform [0, 1]</option>
                      <option value="Gaussian">Gaussian (μ=0, σ=1)</option>
                    </select>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="random-number-generator-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="random-number-generator-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof RandomNumberGeneratorBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("random-number-generator-block-name-field") as HTMLInputElement;
      nameInputElement.value = block.getName();
      let numberOfOutputsInputElement = document.getElementById("random-number-generator-block-number-of-outputs-field") as HTMLInputElement;
      numberOfOutputsInputElement.value = block.getNumberOfOutputs().toString();
      let typeSelectElement = document.getElementById("random-number-generator-block-type-selector") as HTMLSelectElement;
      typeSelectElement.value = block.getType();
      let widthInputElement = document.getElementById("random-number-generator-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("random-number-generator-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set number of outputs
        let n = parseInt(numberOfOutputsInputElement.value);
        if (isNumber(n)) {
          block.setNumberOfOutputs(Math.max(1, n));
        } else {
          success = false;
          message = numberOfOutputsInputElement.value + " is not a valid number of outputs";
        }
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
        // finish
        if (success) {
          block.setName(nameInputElement.value);
          block.setType(typeSelectElement.value);
          block.refreshView();
          flowchart.blockView.requestDraw();
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
      numberOfOutputsInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 340,
        width: 450,
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
