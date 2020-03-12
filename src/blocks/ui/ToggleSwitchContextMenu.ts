/*
 * @author Charles Xie
 */

import $ from "jquery";
import {ToggleSwitch} from "../ToggleSwitch";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";

export class ToggleSwitchContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "toggle-switch-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="toggle-switch-name-field"></td>
                </tr>
                <tr>
                  <td>Value:</td>
                  <td><input type="text" id="toggle-switch-value-field"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="toggle-switch-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="toggle-switch-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ToggleSwitch) {
      const toggle = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("toggle-switch-name-field") as HTMLInputElement;
      nameInputElement.value = toggle.getName();
      let valueInputElement = document.getElementById("toggle-switch-value-field") as HTMLInputElement;
      valueInputElement.value = toggle.isChecked() ? "true" : "false";
      let widthInputElement = document.getElementById("toggle-switch-width-field") as HTMLInputElement;
      widthInputElement.value = toggle.getWidth().toString();
      let heightInputElement = document.getElementById("toggle-switch-height-field") as HTMLInputElement;
      heightInputElement.value = toggle.getHeight().toString();
      const okFunction = function () {
        toggle.setName(nameInputElement.value);
        toggle.setChecked(valueInputElement.value == "true");
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          toggle.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          toggle.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
        }
        if (success) {
          toggle.refreshView();
          flowchart.storeBlockStates();
          flowchart.blockView.requestDraw();
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
      valueInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: toggle.getUid(),
        height: 320,
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
