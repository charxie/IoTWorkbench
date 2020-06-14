/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {WorkerBlock} from "../WorkerBlock";

export class WorkerBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "worker-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="worker-block-name-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Output:</td>
                  <td>
                    <select id="worker-output-type-selector" style="width: 120px">
                      <option value="Natural Number" selected>Natural Number</option>
                      <option value="Random Number">Random Number</option>
                      <option value="Alternating Bit">Alternating Bit</option>
                    </select>
                </tr>
                <tr>
                  <td>Interval (millisecond):</td>
                  <td><input type="text" id="worker-block-interval-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Repeat Times:</td>
                  <td><input type="text" id="worker-block-repeat-times-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="worker-block-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="worker-block-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof WorkerBlock) {
      const worker = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("worker-block-name-field") as HTMLInputElement;
      nameField.value = worker.getName();
      let outputTypeSelector = document.getElementById("worker-output-type-selector") as HTMLSelectElement;
      outputTypeSelector.value = worker.getOutputType();
      let intervalField = document.getElementById("worker-block-interval-field") as HTMLInputElement;
      intervalField.value = worker.getInterval().toString();
      let repeatTimesField = document.getElementById("worker-block-repeat-times-field") as HTMLInputElement;
      repeatTimesField.value = worker.getRepeatTimes().toString();
      let widthField = document.getElementById("worker-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(worker.getWidth()).toString();
      let heightField = document.getElementById("worker-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(worker.getHeight()).toString();
      const okFunction = () => {
        worker.setName(nameField.value);
        worker.setOutputType(outputTypeSelector.value);
        let success = true;
        let message;
        // set interval
        let interval = parseInt(intervalField.value);
        if (isNumber(interval)) {
          worker.setInterval(Math.max(50, interval)); // set a mininum interval to avoid slowing down the UI
        } else {
          success = false;
          message = intervalField.value + " is not a valid interval";
        }
        // set repeat times
        let repeatTimes = parseInt(repeatTimesField.value);
        if (isNumber(repeatTimes)) {
          worker.setRepeatTimes(Math.max(1, repeatTimes)); // must execute at least once
        } else {
          success = false;
          message = repeatTimesField.value + " is not a valid value for repeat times";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          worker.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          worker.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish
        if (success) {
          worker.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(worker);
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
      nameField.addEventListener("keyup", enterKeyUp);
      intervalField.addEventListener("keyup", enterKeyUp);
      repeatTimesField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: worker.getUid(),
        height: 400,
        width: 350,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
