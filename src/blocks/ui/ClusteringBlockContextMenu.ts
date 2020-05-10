/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ClusteringBlock} from "../ClusteringBlock";

export class ClusteringBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "clustering-block-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Method:</td>
                  <td>
                    <select id="clustering-block-method-selector" style="width: 100%">
                      <option value="K-Means">K-Means</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Outputs:</td>
                  <td><input type="text" id="clustering-block-outputs-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Iterations:</td>
                  <td><input type="text" id="clustering-block-iterations-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="clustering-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="clustering-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ClusteringBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let methodSelector = document.getElementById("clustering-block-method-selector") as HTMLSelectElement;
      methodSelector.value = block.getMethod();
      let numberOfOutputsField = document.getElementById("clustering-block-outputs-field") as HTMLInputElement;
      numberOfOutputsField.value = block.getNumberOfOutputs().toString();
      let numberOfIterationsField = document.getElementById("clustering-block-iterations-field") as HTMLInputElement;
      numberOfIterationsField.value = block.getNumberOfIterations().toString();
      let widthField = document.getElementById("clustering-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("clustering-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set number of outputs
        let numberOfOutputs = parseInt(numberOfOutputsField.value);
        if (isNumber(numberOfOutputs)) {
          block.setNumberOfOutputs(Math.max(2, numberOfOutputs));
        } else {
          success = false;
          message = numberOfOutputsField.value + " is not a valid number of outputs";
        }
        // set number of iterations
        let numberOfIterations = parseInt(numberOfIterationsField.value);
        if (isNumber(numberOfIterations)) {
          block.setNumberOfIterations(Math.max(1, numberOfIterations));
        } else {
          success = false;
          message = numberOfIterationsField.value + " is not a valid number of iterations";
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
          block.setMethod(methodSelector.value);
          block.refreshView();
          flowchart.updateResultsForBlock(block);
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
      numberOfOutputsField.addEventListener("keyup", enterKeyUp);
      numberOfIterationsField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 300,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
