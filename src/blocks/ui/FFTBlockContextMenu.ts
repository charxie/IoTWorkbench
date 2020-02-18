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
                  <td>Name:</td>
                  <td><input type="text" id="fft-block-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Direction:</td>
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
      let forwardRadioButton = document.getElementById("fft-block-forward-radio-button") as HTMLInputElement;
      forwardRadioButton.checked = !block.isInverse();
      let inverseRadioButton = document.getElementById("fft-block-inverse-radio-button") as HTMLInputElement;
      inverseRadioButton.checked = block.isInverse();
      let nameInputElement = document.getElementById("fft-block-name-field") as HTMLInputElement;
      nameInputElement.value = block.getName();
      let widthInputElement = document.getElementById("fft-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("fft-block-height-field") as HTMLInputElement;
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
        // finish
        if (success) {
          block.setName(nameInputElement.value);
          block.setInverse(inverseRadioButton.checked);
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
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 310,
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
