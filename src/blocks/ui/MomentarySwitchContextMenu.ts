/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {MomentarySwitch} from "../MomentarySwitch";

export class MomentarySwitchContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "momentary-switch-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="momentary-switch-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Continuous:</td>
                  <td>
                    <input type="radio" name="continuous" id="momentary-switch-continuous-radio-button" checked> Yes
                    <input type="radio" name="continuous" id="momentary-switch-not-continuous-radio-button"> No
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="momentary-switch-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="momentary-switch-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof MomentarySwitch) {
      const s = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("momentary-switch-name-field") as HTMLInputElement;
      nameInputElement.value = s.getName();
      let continuousRadioButton = document.getElementById("momentary-switch-continuous-radio-button") as HTMLInputElement;
      continuousRadioButton.checked = !s.getFireOnlyAtMouseUp();
      let notContinuousRadioButton = document.getElementById("momentary-switch-not-continuous-radio-button") as HTMLInputElement;
      notContinuousRadioButton.checked = s.getFireOnlyAtMouseUp();
      let widthInputElement = document.getElementById("momentary-switch-width-field") as HTMLInputElement;
      widthInputElement.value = s.getWidth().toString();
      let heightInputElement = document.getElementById("momentary-switch-height-field") as HTMLInputElement;
      heightInputElement.value = s.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          s.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          s.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
        }
        if (success) {
          s.setName(nameInputElement.value);
          s.setFireOnlyAtMouseUp(notContinuousRadioButton.checked);
          s.refreshView();
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
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: s.getUid(),
        height: 300,
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
