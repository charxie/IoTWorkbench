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
                      <option value="Poisson">Poisson (global var: lamba, default 4)</option>
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
      let nameField = document.getElementById("random-number-generator-block-name-field") as HTMLInputElement;
      nameField.value = block.getName();
      let numberOfOutputsField = document.getElementById("random-number-generator-block-number-of-outputs-field") as HTMLInputElement;
      numberOfOutputsField.value = block.getNumberOfOutputs().toString();
      let typeSelector = document.getElementById("random-number-generator-block-type-selector") as HTMLSelectElement;
      typeSelector.value = block.getType();
      let widthField = document.getElementById("random-number-generator-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("random-number-generator-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set number of outputs
        let n = parseInt(numberOfOutputsField.value);
        if (isNumber(n)) {
          block.setNumberOfOutputs(Math.max(1, n));
        } else {
          success = false;
          message = numberOfOutputsField.value + " is not a valid number of outputs";
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
        // finish
        if (success) {
          block.setName(nameField.value);
          block.setType(typeSelector.value);
          block.refreshView();
          flowchart.blockView.requestDraw();
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
      numberOfOutputsField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 340,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
