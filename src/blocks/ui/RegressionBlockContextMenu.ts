/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {RegressionBlock} from "../RegressionBlock";

export class RegressionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "regression-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Type:</td>
                  <td>
                    <select id="regression-block-type-selector" style="width: 100%">
                      <option value="Linear" selected>Linear</option>
                      <option value="Exponential">Exponential</option>
                      <option value="Logarithmic">Logarithmic</option>
                      <option value="Power">Power</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="regression-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="regression-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof RegressionBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let typeSelector = document.getElementById("regression-block-type-selector") as HTMLSelectElement;
      typeSelector.value = block.getType();
      let widthField = document.getElementById("regression-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("regression-block-height-field") as HTMLInputElement;
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
        // finish up
        if (success) {
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
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 310,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
