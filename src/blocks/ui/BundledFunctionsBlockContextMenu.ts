/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {BundledFunctionsBlock} from "../BundledFunctionsBlock";

export class BundledFunctionsBlockContextMenu extends BlockContextMenu {

  private dialogWidth: number = 450;
  private dialogHeight: number = 440;

  constructor() {
    super();
    this.id = "bundled-functions-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Input Name (e.g., x):</td>
                  <td><input type="text" id="bundled-functions-block-input-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Expressions:<div style="font-size: 70%">(e.g., ["cos(x)", "sin(x)", "tan(x)"])</div></td>
                  <td><textarea id="bundled-functions-block-expressions-field" rows="7" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="bundled-functions-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="bundled-functions-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof BundledFunctionsBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let inputNameField = document.getElementById("bundled-functions-block-input-name-field") as HTMLInputElement;
      inputNameField.value = block.getInputName() ? block.getInputName().toString() : "t";
      let expressionsField = document.getElementById("bundled-functions-block-expressions-field") as HTMLTextAreaElement;
      expressionsField.value = JSON.stringify(block.getExpressions()).replaceAll(',', ',\n');
      let widthField = document.getElementById("bundled-functions-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("bundled-functions-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        block.setInputName(inputNameField.value);
        let success = true;
        let message;
        // set expressions
        if (JSON.stringify(block.getExpressions()) != expressionsField.value) {
          try {
            block.setExpressions(JSON.parse(expressionsField.value));
            block.useDeclaredFunctions();
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = expressionsField.value + " is not a valid array";
          }
          try {
            flowchart.updateResultsForBlock(block);
          } catch (err) {
            success = false;
            message = JSON.stringify(expressionsField.value) + " are not valid expressions";
          }
        }
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
      inputNameField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: true,
        modal: true,
        title: block.getUid(),
        height: this.dialogHeight,
        width: this.dialogWidth,
        resize: (e, ui) => {
          // @ts-ignore
          this.dialogWidth = ui.size.width;
          // @ts-ignore
          this.dialogHeight = ui.size.height;
        },
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
