/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {XYGraph} from "../XYGraph";
import {PngSaver} from "../../tools/PngSaver";

export class XYGraphContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "xygraph-context-menu";
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
                <button type="button" class="menu-btn" id="${this.id}-save-image-button"><i class="fas fa-camera"></i><span class="menu-text">Save Image</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
    let saveImageButton = document.getElementById(this.id + "-save-image-button");
    saveImageButton.addEventListener("click", this.saveImageButtonClick.bind(this), false);
  }

  private saveImageButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<XYGraph>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="xygraph-name-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td><input type="radio" name="scale" id="xygraph-auto-scale-radio-button" checked> Auto
                      <input type="radio" name="scale" id="xygraph-fixed-scale-radio-button"> Fixed</td>
                </tr>
                <tr>
                  <td>Minimum X Value:</td>
                  <td><input type="text" id="xygraph-minimum-x-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Maximum X Value:</td>
                  <td><input type="text" id="xygraph-maximum-x-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Minimum Y Value:</td>
                  <td><input type="text" id="xygraph-minimum-y-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Maximum Y Value:</td>
                  <td><input type="text" id="xygraph-maximum-y-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Symbol:</td>
                  <td>
                    <select id="xygraph-symbol-selector" style="width: 120px">
                      <option value="None">None</option>
                      <option value="Circle" selected>Circle</option>
                    </select>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td><input type="text" id="xygraph-x-axis-label-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td><input type="text" id="xygraph-y-axis-label-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="text" id="xygraph-window-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><input type="text" id="xygraph-line-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="xygraph-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="xygraph-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof XYGraph) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("xygraph-name-field") as HTMLInputElement;
      nameInputElement.value = g.getName();
      let symbolSelectElement = document.getElementById("xygraph-symbol-selector") as HTMLSelectElement;
      symbolSelectElement.value = g.getGraphSymbol();
      let autoScaleRadioButton = document.getElementById("xygraph-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("xygraph-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumXValueInputElement = document.getElementById("xygraph-minimum-x-value-field") as HTMLInputElement;
      minimumXValueInputElement.value = g.getMinimumXValue().toString();
      let maximumXValueInputElement = document.getElementById("xygraph-maximum-x-value-field") as HTMLInputElement;
      maximumXValueInputElement.value = g.getMaximumXValue().toString();
      let minimumYValueInputElement = document.getElementById("xygraph-minimum-y-value-field") as HTMLInputElement;
      minimumYValueInputElement.value = g.getMinimumYValue().toString();
      let maximumYValueInputElement = document.getElementById("xygraph-maximum-y-value-field") as HTMLInputElement;
      maximumYValueInputElement.value = g.getMaximumYValue().toString();
      let xAxisLableInputElement = document.getElementById("xygraph-x-axis-label-field") as HTMLInputElement;
      xAxisLableInputElement.value = g.getXAxisLabel();
      let yAxisLableInputElement = document.getElementById("xygraph-y-axis-label-field") as HTMLInputElement;
      yAxisLableInputElement.value = g.getYAxisLabel();
      let windowColorInputElement = document.getElementById("xygraph-window-color-field") as HTMLInputElement;
      windowColorInputElement.value = g.getGraphWindowColor();
      let lineColorInputElement = document.getElementById("xygraph-line-color-field") as HTMLInputElement;
      lineColorInputElement.value = g.getLineColor();
      let widthInputElement = document.getElementById("xygraph-width-field") as HTMLInputElement;
      widthInputElement.value = g.getWidth().toString();
      let heightInputElement = document.getElementById("xygraph-height-field") as HTMLInputElement;
      heightInputElement.value = g.getHeight().toString();
      const okFunction = function () {
        g.setName(nameInputElement.value);
        g.setGraphSymbol(symbolSelectElement.value);
        g.setXAxisLabel(xAxisLableInputElement.value);
        g.setYAxisLabel(yAxisLableInputElement.value);
        g.setGraphWindowColor(windowColorInputElement.value);
        g.setLineColor(lineColorInputElement.value);
        g.setAutoScale(autoScaleRadioButton.checked);
        let success = true;
        let message;
        // set minimum X value
        let minimumXValue = parseFloat(minimumXValueInputElement.value);
        if (isNumber(minimumXValue)) {
          g.setMinimumXValue(minimumXValue);
        } else {
          success = false;
          message = minimumXValueInputElement.value + " is not a valid value for minimum X.";
        }
        // set maximum X value
        let maximumXValue = parseFloat(maximumXValueInputElement.value);
        if (isNumber(maximumXValue)) {
          g.setMaximumXValue(maximumXValue);
        } else {
          success = false;
          message = maximumXValueInputElement.value + " is not a valid value for maximum X.";
        }
        // set minimum Y value
        let minimumYValue = parseFloat(minimumYValueInputElement.value);
        if (isNumber(minimumYValue)) {
          g.setMinimumYValue(minimumYValue);
        } else {
          success = false;
          message = minimumYValueInputElement.value + " is not a valid value for minimum Y.";
        }
        // set maximum Y value
        let maximumYValue = parseFloat(maximumYValueInputElement.value);
        if (isNumber(maximumYValue)) {
          g.setMaximumYValue(maximumYValue);
        } else {
          success = false;
          message = maximumYValueInputElement.value + " is not a valid value for maximum Y.";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          g.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          g.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          g.refreshView();
          flowchart.storeBlockStates();
          flowchart.draw();
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
      minimumXValueInputElement.addEventListener("keyup", enterKeyUp);
      maximumXValueInputElement.addEventListener("keyup", enterKeyUp);
      minimumYValueInputElement.addEventListener("keyup", enterKeyUp);
      maximumYValueInputElement.addEventListener("keyup", enterKeyUp);
      xAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      yAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      windowColorInputElement.addEventListener("keyup", enterKeyUp);
      lineColorInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 550,
        width: 340,
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
