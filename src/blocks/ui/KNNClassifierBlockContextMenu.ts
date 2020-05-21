/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {KNNClassifierBlock} from "../KNNClassifierBlock";

export class KNNClassifierBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "knn-classifier-block-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Disance Type:</td>
                  <td>
                    <select id="knn-classifier-block-distance-type-selector" style="width: 100%">
                      <option value="Euclidean">Euclidean</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Inputs:</td>
                  <td><input type="text" id="knn-classifier-block-inputs-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>K:</td>
                  <td><input type="text" id="knn-classifier-block-k-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="knn-classifier-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="knn-classifier-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof KNNClassifierBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let distanceTypeSelector = document.getElementById("knn-classifier-block-distance-type-selector") as HTMLSelectElement;
      distanceTypeSelector.value = block.getDistanceType();
      let numberOfInputsField = document.getElementById("knn-classifier-block-inputs-field") as HTMLInputElement;
      numberOfInputsField.value = block.getNumberOfInputs().toString();
      let kField = document.getElementById("knn-classifier-block-k-field") as HTMLInputElement;
      kField.value = block.getK().toString();
      let widthField = document.getElementById("knn-classifier-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("knn-classifier-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set number of outputs
        let numberOfInputs = parseInt(numberOfInputsField.value);
        if (isNumber(numberOfInputs)) {
          block.setNumberOfInputs(Math.max(2, numberOfInputs));
        } else {
          success = false;
          message = numberOfInputsField.value + " is not a valid number of inputs";
        }
        // set k
        let k = parseInt(kField.value);
        if (isNumber(k)) {
          block.setK(Math.max(1, k));
        } else {
          success = false;
          message = kField.value + " is not a valid value for k";
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
          block.setDistanceType(distanceTypeSelector.value);
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
      numberOfInputsField.addEventListener("keyup", enterKeyUp);
      kField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 360,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
