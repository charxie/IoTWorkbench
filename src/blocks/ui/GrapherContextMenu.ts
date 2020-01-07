/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Sticker} from "../Sticker";
import {Util} from "../../Util";
import {Grapher} from "../Grapher";

export class GrapherContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "grapher-context-menu";
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
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="grapher-name-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td><input type="radio" name="scale" id="grapher-auto-scale-radio-button" checked> Auto
                      <input type="radio" name="scale" id="grapher-fixed-scale-radio-button"> Fixed</td>
                </tr>
                <tr>
                  <td>Minimum Value:</td>
                  <td><input type="text" id="grapher-minimum-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Maximum Value:</td>
                  <td><input type="text" id="grapher-maximum-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Symbol:</td>
                  <td>
                    <select id="grapher-symbol-selector" style="width: 120px">
                      <option value="None">None</option>
                      <option value="Circle" selected>Circle</option>
                    </select>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td><input type="text" id="grapher-x-axis-label-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td><input type="text" id="grapher-y-axis-label-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="text" id="grapher-window-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="grapher-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="grapher-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      const grapher = <Grapher>this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("grapher-name-field") as HTMLInputElement;
      nameInputElement.value = grapher.getName();
      let symbolSelectElement = document.getElementById("grapher-symbol-selector") as HTMLSelectElement;
      symbolSelectElement.value = grapher.getGraphSymbol();
      let autoScaleRadioButton = document.getElementById("grapher-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = grapher.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("grapher-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !grapher.getAutoScale();
      let minimumValueInputElement = document.getElementById("grapher-minimum-value-field") as HTMLInputElement;
      minimumValueInputElement.value = grapher.getMinimumValue().toString();
      let maximumValueInputElement = document.getElementById("grapher-maximum-value-field") as HTMLInputElement;
      maximumValueInputElement.value = grapher.getMaximumValue().toString();
      let xAxisLableInputElement = document.getElementById("grapher-x-axis-label-field") as HTMLInputElement;
      xAxisLableInputElement.value = grapher.getXAxisLabel();
      let yAxisLableInputElement = document.getElementById("grapher-y-axis-label-field") as HTMLInputElement;
      yAxisLableInputElement.value = grapher.getYAxisLabel();
      let windowColorInputElement = document.getElementById("grapher-window-color-field") as HTMLInputElement;
      windowColorInputElement.value = grapher.getGraphWindowColor();
      let widthInputElement = document.getElementById("grapher-width-field") as HTMLInputElement;
      widthInputElement.value = grapher.getWidth().toString();
      let heightInputElement = document.getElementById("grapher-height-field") as HTMLInputElement;
      heightInputElement.value = grapher.getHeight().toString();
      const okFunction = function () {
        grapher.setName(nameInputElement.value);
        grapher.setGraphSymbol(symbolSelectElement.value);
        grapher.setXAxisLabel(xAxisLableInputElement.value);
        grapher.setYAxisLabel(yAxisLableInputElement.value);
        grapher.setGraphWindowColor(windowColorInputElement.value);
        grapher.setAutoScale(autoScaleRadioButton.checked);
        let success = true;
        let message;
        // set minimum value
        let minimumValue = parseInt(minimumValueInputElement.value);
        if (isNumber(minimumValue)) {
          grapher.setMinimumValue(minimumValue);
        } else {
          success = false;
          message = minimumValueInputElement.value + " is not a valid value for minimum.";
        }
        // set maximum value
        let maximumValue = parseInt(maximumValueInputElement.value);
        if (isNumber(maximumValue)) {
          grapher.setMaximumValue(maximumValue);
        } else {
          success = false;
          message = maximumValueInputElement.value + " is not a valid value for maximum.";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          grapher.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          grapher.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          grapher.refreshView();
          flowchart.storeBlockStates();
          flowchart.draw();
          d.dialog('close');
        } else {
          Util.showErrorMessage(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.keyCode == 13) {
          okFunction();
        }
      };
      nameInputElement.addEventListener("keyup", enterKeyUp);
      minimumValueInputElement.addEventListener("keyup", enterKeyUp);
      maximumValueInputElement.addEventListener("keyup", enterKeyUp);
      xAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      yAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      windowColorInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: grapher.getUid(),
        height: 550,
        width: 320,
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
