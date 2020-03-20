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
                  <td>Direction:</td>
                  <td>
                    <input type="radio" name="direction" id="complex-number-block-forward-radio-button" checked> Forward
                    <input type="radio" name="direction" id="complex-number-block-inverse-radio-button"> Inverse
                  </td>
                </tr>
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
      let forwardRadioButton = document.getElementById("complex-number-block-forward-radio-button") as HTMLInputElement;
      forwardRadioButton.checked = !block.isInverse();
      let inverseRadioButton = document.getElementById("complex-number-block-inverse-radio-button") as HTMLInputElement;
      inverseRadioButton.checked = block.isInverse();
      let realField = document.getElementById("complex-number-block-real-field") as HTMLInputElement;
      realField.value = block.getReal().toString();
      let imaginaryField = document.getElementById("complex-number-block-imaginary-field") as HTMLInputElement;
      imaginaryField.value = block.getImaginary().toString();
      let widthField = document.getElementById("complex-number-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("complex-number-block-height-field") as HTMLInputElement;
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
        // set real
        let real = parseFloat(realField.value);
        if (isNumber(real)) {
          block.setReal(real);
        } else {
          success = false;
          message = realField.value + " is not a valid number for the real part";
        }
        // set imaginary
        let imaginary = parseFloat(imaginaryField.value);
        if (isNumber(imaginary)) {
          block.setImaginary(imaginary);
        } else {
          success = false;
          message = imaginaryField.value + " is not a valid number for the imaginary part";
        }
        // finish
        if (success) {
          if (block.isInverse() !== inverseRadioButton.checked) {
            block.setInverse(inverseRadioButton.checked);
          }
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
      realField.addEventListener("keyup", enterKeyUp);
      imaginaryField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 360,
        width: 360,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
