/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ArithmeticBlock} from "../ArithmeticBlock";

export class ArithmeticBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "arithmetic-block-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Operator:</td>
                  <td>
                    R<div class='horizontal-divider'></div>=<div class='horizontal-divider'></div>A<div class='horizontal-divider'></div>
                    <select id="arithmetic-block-operator">
                      <option value="Add Block">+</option>
                      <option value="Subtract Block">−</option>
                      <option value="Multiply Block">×</option>
                      <option value="Divide Block">÷</option>
                      <option value="Modulus Block">%</option>
                      <option value="Exponentiation Block">^</option>
                      <option value="Dot Product Block">•</option>
                    </select>
                    <div class='horizontal-divider'></div>B
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="arithmetic-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="arithmetic-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ArithmeticBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let operatorSelector = document.getElementById("arithmetic-block-operator") as HTMLSelectElement;
      operatorSelector.value = block.getName();
      let widthField = document.getElementById("arithmetic-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("arithmetic-block-height-field") as HTMLInputElement;
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
          let name = operatorSelector.options[operatorSelector.selectedIndex].value;
          if (name !== block.getName()) {
            block.setName(name);
            block.setSymbol(operatorSelector.options[operatorSelector.selectedIndex].text);
            block.setUid(block.getName() + " #" + Date.now().toString(16));
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
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 300,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
