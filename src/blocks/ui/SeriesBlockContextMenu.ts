/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {SeriesBlock} from "../SeriesBlock";
import {Util} from "../../Util";

export class SeriesBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "series-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Start:</td>
                  <td><input type="text" id="series-block-start-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Increment:</td>
                  <td><input type="text" id="series-block-increment-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Count:</td>
                  <td><input type="text" id="series-block-count-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="series-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="series-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof SeriesBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let startInputElement = document.getElementById("series-block-start-field") as HTMLInputElement;
      startInputElement.value = block.getStart().toString();
      let incrementInputElement = document.getElementById("series-block-increment-field") as HTMLInputElement;
      incrementInputElement.value = block.getIncrement().toString();
      let countInputElement = document.getElementById("series-block-count-field") as HTMLInputElement;
      countInputElement.value = block.getCount().toString();
      let widthInputElement = document.getElementById("series-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("series-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      const okFunction = function () {
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
        // set start
        let start = parseFloat(startInputElement.value);
        if (isNumber(start)) {
          block.setStart(start);
        } else {
          success = false;
          message = startInputElement.value + " is not a valid number for Start.";
        }
        // set increment
        let increment = parseFloat(incrementInputElement.value);
        if (isNumber(increment)) {
          block.setIncrement(increment);
        } else {
          success = false;
          message = incrementInputElement.value + " is not a valid number for Increment.";
        }
        // set count
        let count = parseInt(countInputElement.value);
        if (isNumber(count)) {
          block.setCount(count);
        } else {
          success = false;
          message = countInputElement.value + " is not a valid number for Count.";
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
      startInputElement.addEventListener("keyup", enterKeyUp);
      incrementInputElement.addEventListener("keyup", enterKeyUp);
      countInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 350,
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
