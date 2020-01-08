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

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="worker-block-name-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Interval (millisecond):</td>
                  <td><input type="text" id="worker-block-interval-field" style="width: 120px"></td>
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

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof WorkerBlock) {
      const worker = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("worker-block-name-field") as HTMLInputElement;
      nameInputElement.value = worker.getName();
      let intervalInputElement = document.getElementById("worker-block-interval-field") as HTMLInputElement;
      intervalInputElement.value = worker.getInterval().toString();
      let widthInputElement = document.getElementById("worker-block-width-field") as HTMLInputElement;
      widthInputElement.value = worker.getWidth().toString();
      let heightInputElement = document.getElementById("worker-block-height-field") as HTMLInputElement;
      heightInputElement.value = worker.getHeight().toString();
      const okFunction = function () {
        worker.setName(nameInputElement.value);
        let success = true;
        let message;
        // set interval
        let interval = parseInt(intervalInputElement.value);
        if (isNumber(interval)) {
          worker.setInterval(Math.max(1, interval));
        } else {
          success = false;
          message = intervalInputElement.value + " is not a valid interval.";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          worker.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          worker.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          worker.refreshView();
          flowchart.draw();
          flowchart.updateResults();
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
          d.dialog('close');
        } else {
          Util.showErrorMessage(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      nameInputElement.addEventListener("keyup", enterKeyUp);
      intervalInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: worker.getUid(),
        height: 350,
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
