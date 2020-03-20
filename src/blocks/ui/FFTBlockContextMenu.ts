/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {FFTBlock} from "../FFTBlock";

export class FFTBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "fft-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Separate Real & Imaginary:</td>
                  <td>
                    <input type="radio" name="ports" id="fft-block-separate-radio-button" checked> Yes
                    <input type="radio" name="ports" id="fft-block-not-separate-radio-button"> No
                  </td>
                </tr>
                <tr>
                  <td>Direction of Transform:</td>
                  <td>
                    <input type="radio" name="direction" id="fft-block-forward-radio-button" checked> Forward
                    <input type="radio" name="direction" id="fft-block-inverse-radio-button"> Inverse
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="fft-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="fft-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof FFTBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let separateRadioButton = document.getElementById("fft-block-separate-radio-button") as HTMLInputElement;
      separateRadioButton.checked = block.isSeparate();
      let notSeparateRadioButton = document.getElementById("fft-block-not-separate-radio-button") as HTMLInputElement;
      notSeparateRadioButton.checked = !block.isSeparate();
      let forwardRadioButton = document.getElementById("fft-block-forward-radio-button") as HTMLInputElement;
      forwardRadioButton.checked = !block.isInverse();
      let inverseRadioButton = document.getElementById("fft-block-inverse-radio-button") as HTMLInputElement;
      inverseRadioButton.checked = block.isInverse();
      let widthField = document.getElementById("fft-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("fft-block-height-field") as HTMLInputElement;
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
        // finish
        if (success) {
          let changed = block.isSeparate() !== separateRadioButton.checked || block.isInverse() !== inverseRadioButton.checked;
          block.setSeparate(separateRadioButton.checked);
          block.setInverse(inverseRadioButton.checked);
          if (changed) {
            block.setupPorts();
          }
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
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
