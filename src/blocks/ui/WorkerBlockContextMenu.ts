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
      let nameInputElement = document.getElementById("worker-block-name-field") as HTMLInputElement;
      nameInputElement.value = worker.getName();
      let outputTypeSelectElement = document.getElementById("worker-output-type-selector") as HTMLSelectElement;
      outputTypeSelectElement.value = worker.getOutputType();
      let intervalInputElement = document.getElementById("worker-block-interval-field") as HTMLInputElement;
      intervalInputElement.value = worker.getInterval().toString();
      let repeatTimesInputElement = document.getElementById("worker-block-repeat-times-field") as HTMLInputElement;
      repeatTimesInputElement.value = worker.getRepeatTimes().toString();
      let widthInputElement = document.getElementById("worker-block-width-field") as HTMLInputElement;
      widthInputElement.value = worker.getWidth().toString();
      let heightInputElement = document.getElementById("worker-block-height-field") as HTMLInputElement;
      heightInputElement.value = worker.getHeight().toString();
      const okFunction = function () {
        worker.setName(nameInputElement.value);
        worker.setOutputType(outputTypeSelectElement.value);
        let success = true;
        let message;
        // set interval
        let interval = parseInt(intervalInputElement.value);
        if (isNumber(interval)) {
          worker.setInterval(Math.max(50, interval)); // set the mininum interval to be 100 to avoid slowing down the UI
        } else {
          success = false;
          message = intervalInputElement.value + " is not a valid interval";
        }
        // set repeat times
        let repeatTimes = parseInt(repeatTimesInputElement.value);
        if (isNumber(repeatTimes)) {
          worker.setRepeatTimes(Math.max(1, repeatTimes)); // must execute at least once
        } else {
          success = false;
          message = repeatTimesInputElement.value + " is not a valid value for repeat times";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          worker.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          worker.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
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
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      nameInputElement.addEventListener("keyup", enterKeyUp);
      intervalInputElement.addEventListener("keyup", enterKeyUp);
      repeatTimesInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: worker.getUid(),
        height: 400,
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
