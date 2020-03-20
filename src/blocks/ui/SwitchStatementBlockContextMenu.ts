/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {SwitchStatementBlock} from "../SwitchStatementBlock";

export class SwitchStatementBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "switch-statement-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Cases:<div style="font-size: 70%">(e.g., [1, 2, 3]<br>or ["a", "b", "c"])</div></td>
                  <td><textarea id="switch-statement-block-cases-field" rows="5" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="switch-statement-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="switch-statement-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof SwitchStatementBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let casesField = document.getElementById("switch-statement-block-cases-field") as HTMLTextAreaElement;
      casesField.value = JSON.stringify(block.getCases()).replaceAll('",', '",\n');
      let widthField = document.getElementById("switch-statement-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("switch-statement-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set cases
        if (JSON.stringify(block.getCases()) != casesField.value) {
          try {
            block.setCases(JSON.parse(casesField.value));
          } catch (err) {
            console.log(err.stack);
            success = false;
            message = casesField.value + " is not a valid array";
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
        height: 350,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
