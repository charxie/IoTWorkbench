/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ActionBlock} from "../ActionBlock";

export class ActionBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "action-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Type:</td>
                  <td>
                    <select id="action-type-selector" style="width: 100%">
                      <option value="Reset" selected>Reset</option>
                      <option value="Stop">Stop</option>
                      <option value="Repaint">Repaint</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="action-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="action-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ActionBlock) {
      const act = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let typeSelectElement = document.getElementById("action-type-selector") as HTMLSelectElement;
      typeSelectElement.value = act.getType();
      let widthInputElement = document.getElementById("action-block-width-field") as HTMLInputElement;
      widthInputElement.value = act.getWidth().toString();
      let heightInputElement = document.getElementById("action-block-height-field") as HTMLInputElement;
      heightInputElement.value = act.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          act.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          act.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
        }
        // finish
        if (success) {
          act.setType(typeSelectElement.value);
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(act);
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
        title: act.getUid(),
        height: 300,
        width: 350,
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
