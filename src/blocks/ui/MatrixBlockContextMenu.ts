/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {MatrixBlock} from "../MatrixBlock";

export class MatrixBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "matrix-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Values:<div style="font-size: 70%">(e.g.,<br>[[1, 0, 0],<br>[0, 1, 0],<br>[0, 0, 1]])</div></td>
                  <td><textarea id="matrix-block-values-area" rows="5" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Fraction Digits:</td>
                  <td><input type="text" id="matrix-block-fraction-digits-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="matrix-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="matrix-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof MatrixBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let valuesArea = document.getElementById("matrix-block-values-area") as HTMLTextAreaElement;
      valuesArea.value = JSON.stringify(block.getValues(), null, 2);
      let fractionDigitsField = document.getElementById("matrix-block-fraction-digits-field") as HTMLInputElement;
      fractionDigitsField.value = block.getFractionDigits().toString();
      let widthField = document.getElementById("matrix-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("matrix-block-height-field") as HTMLInputElement;
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
        // set values
        try {
          block.setValues(JSON.parse(valuesArea.value));
        } catch (err) {
          success = false;
          message = valuesArea.value + " is not a valid matrix";
        }
        // finish
        if (success) {
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
      fractionDigitsField.addEventListener("keyup", enterKeyUp);
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
