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
                  <td><input type="text" id="arithmetic-block-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="arithmetic-block-height-field"></td>
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
      let selectElement = document.getElementById("arithmetic-block-operator") as HTMLSelectElement;
      selectElement.value = block.getName();
      let widthInputElement = document.getElementById("arithmetic-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("arithmetic-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
        block.setName(selectElement.options[selectElement.selectedIndex].value);
        block.setSymbol(selectElement.options[selectElement.selectedIndex].text);
        block.setUid(block.getName() + " #" + Date.now().toString(16));
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
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 300,
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
