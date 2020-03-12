/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {RgbaColorBlock} from "../RgbaColorBlock";

export class RgbaColorBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "rgba-color-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Red [0, 255]:</td>
                  <td><input type="text" id="rgba-color-block-red-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Green [0, 255]:</td>
                  <td><input type="text" id="rgba-color-block-green-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Blue [0, 255]:</td>
                  <td><input type="text" id="rgba-color-block-blue-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Alpha (Opacity [0, 1]):</td>
                  <td><input type="text" id="rgba-color-block-alpha-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="rgba-color-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="rgba-color-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof RgbaColorBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let redInputElement = document.getElementById("rgba-color-block-red-field") as HTMLInputElement;
      redInputElement.value = block.getRed().toString();
      let greenInputElement = document.getElementById("rgba-color-block-green-field") as HTMLInputElement;
      greenInputElement.value = block.getGreen().toString();
      let blueInputElement = document.getElementById("rgba-color-block-blue-field") as HTMLInputElement;
      blueInputElement.value = block.getBlue().toString();
      let alphaInputElement = document.getElementById("rgba-color-block-alpha-field") as HTMLInputElement;
      alphaInputElement.value = block.getAlpha().toString();
      let widthInputElement = document.getElementById("rgba-color-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("rgba-color-block-height-field") as HTMLInputElement;
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
        // set red
        let red = parseFloat(redInputElement.value);
        if (isNumber(red)) {
          block.setRed(red);
        } else {
          success = false;
          message = redInputElement.value + " is not a valid number for red";
        }
        // set green
        let green = parseFloat(greenInputElement.value);
        if (isNumber(green)) {
          block.setGreen(green);
        } else {
          success = false;
          message = greenInputElement.value + " is not a valid number for green";
        }
        // set blue
        let blue = parseInt(blueInputElement.value);
        if (isNumber(blue)) {
          block.setBlue(blue);
        } else {
          success = false;
          message = blueInputElement.value + " is not a valid number for blue";
        }
        // set alpha
        let alpha = parseInt(alphaInputElement.value);
        if (isNumber(alpha)) {
          block.setAlpha(alpha);
        } else {
          success = false;
          message = alphaInputElement.value + " is not a valid number for alpha";
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
      redInputElement.addEventListener("keyup", enterKeyUp);
      greenInputElement.addEventListener("keyup", enterKeyUp);
      blueInputElement.addEventListener("keyup", enterKeyUp);
      alphaInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 400,
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
