/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {Space2D} from "../Space2D";
import {PngSaver} from "../../tools/PngSaver";

export class Space2DContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "space2d-context-menu";
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
    PngSaver.saveAs((<Space2D>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="space2d-name-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td><input type="radio" name="scale" id="space2d-auto-scale-radio-button" checked> Auto
                      <input type="radio" name="scale" id="space2d-fixed-scale-radio-button"> Fixed</td>
                </tr>
                <tr>
                  <td>Minimum X Value:</td>
                  <td><input type="text" id="space2d-minimum-x-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Maximum X Value:</td>
                  <td><input type="text" id="space2d-maximum-x-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Minimum Y Value:</td>
                  <td><input type="text" id="space2d-minimum-y-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Maximum Y Value:</td>
                  <td><input type="text" id="space2d-maximum-y-value-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Line Type:</td>
                  <td>
                    <select id="space2d-line-type-selector" style="width: 120px">
                      <option value="None">None</option>
                      <option value="Solid" selected>Solid</option>
                    </select>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><input type="text" id="space2d-line-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Symbol Type:</td>
                  <td>
                    <select id="space2d-symbol-selector" style="width: 120px">
                      <option value="None">None</option>
                      <option value="Circle" selected>Circle</option>
                      <option value="Square">Square</option>
                      <option value="Dot">Dot</option>
                    </select>
                </tr>
                <tr>
                  <td>Symbol Color:</td>
                  <td><input type="text" id="space2d-symbol-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td><input type="text" id="space2d-x-axis-label-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td><input type="text" id="space2d-y-axis-label-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="text" id="space2d-window-color-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="space2d-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="space2d-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Space2D) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("space2d-name-field") as HTMLInputElement;
      nameInputElement.value = g.getName();
      let lineTypeSelectElement = document.getElementById("space2d-line-type-selector") as HTMLSelectElement;
      lineTypeSelectElement.value = g.getLineType();
      let lineColorInputElement = document.getElementById("space2d-line-color-field") as HTMLInputElement;
      lineColorInputElement.value = g.getLineColor();
      let symbolSelectElement = document.getElementById("space2d-symbol-selector") as HTMLSelectElement;
      symbolSelectElement.value = g.getDataSymbol();
      let symbolColorInputElement = document.getElementById("space2d-symbol-color-field") as HTMLInputElement;
      symbolColorInputElement.value = g.getDataSymbolColor();
      let autoScaleRadioButton = document.getElementById("space2d-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("space2d-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumXValueInputElement = document.getElementById("space2d-minimum-x-value-field") as HTMLInputElement;
      minimumXValueInputElement.value = g.getMinimumXValue().toString();
      let maximumXValueInputElement = document.getElementById("space2d-maximum-x-value-field") as HTMLInputElement;
      maximumXValueInputElement.value = g.getMaximumXValue().toString();
      let minimumYValueInputElement = document.getElementById("space2d-minimum-y-value-field") as HTMLInputElement;
      minimumYValueInputElement.value = g.getMinimumYValue().toString();
      let maximumYValueInputElement = document.getElementById("space2d-maximum-y-value-field") as HTMLInputElement;
      maximumYValueInputElement.value = g.getMaximumYValue().toString();
      let xAxisLableInputElement = document.getElementById("space2d-x-axis-label-field") as HTMLInputElement;
      xAxisLableInputElement.value = g.getXAxisLabel();
      let yAxisLableInputElement = document.getElementById("space2d-y-axis-label-field") as HTMLInputElement;
      yAxisLableInputElement.value = g.getYAxisLabel();
      let windowColorInputElement = document.getElementById("space2d-window-color-field") as HTMLInputElement;
      windowColorInputElement.value = g.getSpaceWindowColor();
      let widthInputElement = document.getElementById("space2d-width-field") as HTMLInputElement;
      widthInputElement.value = g.getWidth().toString();
      let heightInputElement = document.getElementById("space2d-height-field") as HTMLInputElement;
      heightInputElement.value = g.getHeight().toString();
      const okFunction = function () {
        g.setName(nameInputElement.value);
        g.setLineType(lineTypeSelectElement.value);
        g.setLineColor(lineColorInputElement.value);
        g.setDataSymbol(symbolSelectElement.value);
        g.setDataSymbolColor(symbolColorInputElement.value);
        g.setXAxisLabel(xAxisLableInputElement.value);
        g.setYAxisLabel(yAxisLableInputElement.value);
        g.setSpaceWindowColor(windowColorInputElement.value);
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
          flowchart.blockView.requestDraw();
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
      symbolColorInputElement.addEventListener("keyup", enterKeyUp);
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