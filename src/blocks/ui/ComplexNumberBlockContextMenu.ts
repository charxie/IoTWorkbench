/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ComplexNumberBlock} from "../ComplexNumberBlock";

export class ComplexNumberBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "complex-number-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Real Part:</td>
                  <td><input type="text" id="complex-number-block-real-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Imaginary Part:</td>
                  <td><input type="text" id="complex-number-block-imaginary-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="complex-number-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="complex-number-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ComplexNumberBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let realInputElement = document.getElementById("complex-number-block-real-field") as HTMLInputElement;
      realInputElement.value = block.getReal().toString();
      let imaginaryInputElement = document.getElementById("complex-number-block-imaginary-field") as HTMLInputElement;
      imaginaryInputElement.value = block.getImaginary().toString();
      let widthInputElement = document.getElementById("complex-number-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("complex-number-block-height-field") as HTMLInputElement;
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
        // set real
        let real = parseFloat(realInputElement.value);
        if (isNumber(real)) {
          block.setReal(real);
        } else {
          success = false;
          message = realInputElement.value + " is not a valid number for real.";
        }
        // set imaginary
        let imaginary = parseFloat(imaginaryInputElement.value);
        if (isNumber(imaginary)) {
          block.setImaginary(imaginary);
        } else {
          success = false;
          message = imaginaryInputElement.value + " is not a valid number for imaginary.";
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
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      realInputElement.addEventListener("keyup", enterKeyUp);
      imaginaryInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 320,
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
