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
      let redField = document.getElementById("rgba-color-block-red-field") as HTMLInputElement;
      redField.value = block.getRed().toString();
      let greenField = document.getElementById("rgba-color-block-green-field") as HTMLInputElement;
      greenField.value = block.getGreen().toString();
      let blueField = document.getElementById("rgba-color-block-blue-field") as HTMLInputElement;
      blueField.value = block.getBlue().toString();
      let alphaField = document.getElementById("rgba-color-block-alpha-field") as HTMLInputElement;
      alphaField.value = block.getAlpha().toString();
      let widthField = document.getElementById("rgba-color-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("rgba-color-block-height-field") as HTMLInputElement;
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
        // set red
        let red = parseFloat(redField.value);
        if (isNumber(red)) {
          block.setRed(red);
        } else {
          success = false;
          message = redField.value + " is not a valid number for red";
        }
        // set green
        let green = parseFloat(greenField.value);
        if (isNumber(green)) {
          block.setGreen(green);
        } else {
          success = false;
          message = greenField.value + " is not a valid number for green";
        }
        // set blue
        let blue = parseInt(blueField.value);
        if (isNumber(blue)) {
          block.setBlue(blue);
        } else {
          success = false;
          message = blueField.value + " is not a valid number for blue";
        }
        // set alpha
        let alpha = parseInt(alphaField.value);
        if (isNumber(alpha)) {
          block.setAlpha(alpha);
        } else {
          success = false;
          message = alphaField.value + " is not a valid number for alpha";
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
      redField.addEventListener("keyup", enterKeyUp);
      greenField.addEventListener("keyup", enterKeyUp);
      blueField.addEventListener("keyup", enterKeyUp);
      alphaField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
