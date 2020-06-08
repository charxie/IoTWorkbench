/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {QuantumStationaryState1DBlock} from "../QuantumStationaryState1DBlock";

export class QuantumStationaryState1DBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "quantum-stationary-state-1d-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Steps:</td>
                  <td colspan="2"><input type="text" id="quantum-stationary-state-1d-block-steps-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Highest State:</td>
                  <td colspan="2"><input type="text" id="quantum-stationary-state-1d-block-highest-state-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="quantum-stationary-state-1d-block-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="quantum-stationary-state-1d-block-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="quantum-stationary-state-1d-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="quantum-stationary-state-1d-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof QuantumStationaryState1DBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let stepsField = document.getElementById("quantum-stationary-state-1d-block-steps-field") as HTMLInputElement;
      stepsField.value = Math.round(block.getSteps()).toString();
      let highestStateField = document.getElementById("quantum-stationary-state-1d-block-highest-state-field") as HTMLInputElement;
      highestStateField.value = Math.round(block.getMaxState()).toString();
      let windowColorField = document.getElementById("quantum-stationary-state-1d-block-window-color-field") as HTMLInputElement;
      windowColorField.value = block.getViewWindowColor();
      let windowColorChooser = document.getElementById("quantum-stationary-state-1d-block-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, block.getViewWindowColor());
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      let widthField = document.getElementById("quantum-stationary-state-1d-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("quantum-stationary-state-1d-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set steps
        let steps = parseInt(stepsField.value);
        if (isNumber(steps)) {
          block.setSteps(Math.max(50, steps));
        } else {
          success = false;
          message = stepsField.value + " is not a valid number for steps";
        }
        // set highest state
        let maxState = parseInt(highestStateField.value);
        if (isNumber(maxState)) {
          block.setMaxState(Math.max(10, maxState));
        } else {
          success = false;
          message = highestStateField.value + " is not a valid number for highest state";
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
        // finish up
        if (success) {
          block.setViewWindowColor(windowColorField.value);
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
      stepsField.addEventListener("keyup", enterKeyUp);
      highestStateField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 400,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
