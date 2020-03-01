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
    return `<menu id="${this.id}" class="menu" style="width: 150px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-erase-button"><i class="fas fa-eraser"></i><span class="menu-text">Erase</span></button>
              </li>
              <li class="menu-separator"></li>` + this.getLayerMenu() + `<li class="menu-separator"></li>
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
    let eraseButton = document.getElementById(this.id + "-erase-button");
    eraseButton.addEventListener("click", this.eraseButtonClick.bind(this), false);
    let saveImageButton = document.getElementById(this.id + "-save-image-button");
    saveImageButton.addEventListener("click", this.saveImageButtonClick.bind(this), false);
  }

  private eraseButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    (<Space2D>this.block).erase();
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<Space2D>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="space2d-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Points:</td>
                  <td><input type="text" id="space2d-points-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Input Type:</td>
                  <td>
                    <input type="radio" name="input" id="space2d-dual-input-radio-button" checked> Dual
                    <input type="radio" name="input" id="space2d-point-input-radio-button"> Point
                  </td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td>
                    <input type="radio" name="scale" id="space2d-auto-scale-radio-button" checked> Auto
                    <input type="radio" name="scale" id="space2d-fixed-scale-radio-button"> Fixed
                  </td>
                </tr>
                <tr>
                  <td>Minimum X Value:</td>
                  <td><input type="text" id="space2d-minimum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum X Value:</td>
                  <td><input type="text" id="space2d-maximum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Minimum Y Value:</td>
                  <td><input type="text" id="space2d-minimum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Y Value:</td>
                  <td><input type="text" id="space2d-maximum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Type:</td>
                  <td>
                    <select id="space2d-line-type-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Solid" selected>Solid</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><input type="text" id="space2d-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Type:</td>
                  <td>
                    <select id="space2d-symbol-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Circle" selected>Circle</option>
                      <option value="Square">Square</option>
                      <option value="Dot">Dot</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Symbol Color:</td>
                  <td><input type="text" id="space2d-symbol-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Symbol Radius:</td>
                  <td><input type="text" id="space2d-end-symbol-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Symbols Connection:</td>
                  <td>
                    <select id="space2d-end-symbols-connection-selector" style="width: 100%">
                      <option value="None" selected>None</option>
                      <option value="Line">Line</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td><input type="text" id="space2d-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td><input type="text" id="space2d-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="text" id="space2d-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Grid Lines:</td>
                  <td>
                    <input type="radio" name="grid-lines" id="space2d-no-grid-lines-radio-button" checked> No
                    <input type="radio" name="grid-lines" id="space2d-grid-lines-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="space2d-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="space2d-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Space2D) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("space2d-name-field") as HTMLInputElement;
      nameInputElement.value = g.getName();
      let pointsInputElement = document.getElementById("space2d-points-field") as HTMLInputElement;
      pointsInputElement.value = g.getNumberOfPoints().toString();
      let dualInputRadioButton = document.getElementById("space2d-dual-input-radio-button") as HTMLInputElement;
      dualInputRadioButton.checked = !g.getPointInput();
      let pointInputRadioButton = document.getElementById("space2d-point-input-radio-button") as HTMLInputElement;
      pointInputRadioButton.checked = g.getPointInput();
      let lineTypeSelectElement = document.getElementById("space2d-line-type-selector") as HTMLSelectElement;
      lineTypeSelectElement.value = g.getLineType();
      let lineColorInputElement = document.getElementById("space2d-line-color-field") as HTMLInputElement;
      lineColorInputElement.value = g.getLineColor();
      let symbolSelectElement = document.getElementById("space2d-symbol-selector") as HTMLSelectElement;
      symbolSelectElement.value = g.getDataSymbol();
      let symbolColorInputElement = document.getElementById("space2d-symbol-color-field") as HTMLInputElement;
      symbolColorInputElement.value = g.getDataSymbolColor();
      let endSymbolRadiusInputElement = document.getElementById("space2d-end-symbol-radius-field") as HTMLInputElement;
      endSymbolRadiusInputElement.value = g.getEndSymbolRadius().toString();
      let endSymbolsConnectionSelectElement = document.getElementById("space2d-end-symbols-connection-selector") as HTMLSelectElement;
      endSymbolsConnectionSelectElement.value = g.getEndSymbolsConnection();
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
      let noGridLinesRadioButton = document.getElementById("space2d-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("space2d-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthInputElement = document.getElementById("space2d-width-field") as HTMLInputElement;
      widthInputElement.value = g.getWidth().toString();
      let heightInputElement = document.getElementById("space2d-height-field") as HTMLInputElement;
      heightInputElement.value = g.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set number of points
        let numberOfPoints = parseFloat(pointsInputElement.value);
        if (isNumber(numberOfPoints)) {
          if (numberOfPoints > 10 || numberOfPoints < 1) {
            success = false;
            message = "Number of points must be between 1 and 10";
          } else {
            g.setNumberOfPoints(numberOfPoints);
          }
        } else {
          success = false;
          message = pointsInputElement.value + " is not a valid value for number of points";
        }
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
        // set end symbol radius
        let r = parseInt(endSymbolRadiusInputElement.value);
        if (isNumber(r)) {
          g.setEndSymbolRadius(Math.max(0, r));
        } else {
          success = false;
          message = endSymbolRadiusInputElement.value + " is not a valid radius for end symbol.";
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
          g.setName(nameInputElement.value);
          g.setLineType(lineTypeSelectElement.value);
          g.setLineColor(lineColorInputElement.value);
          g.setDataSymbol(symbolSelectElement.value);
          g.setDataSymbolColor(symbolColorInputElement.value);
          g.setXAxisLabel(xAxisLableInputElement.value);
          g.setYAxisLabel(yAxisLableInputElement.value);
          g.setSpaceWindowColor(windowColorInputElement.value);
          g.setShowGridLines(gridLinesRadioButton.checked);
          g.setAutoScale(autoScaleRadioButton.checked);
          g.setPointInput(pointInputRadioButton.checked);
          g.setEndSymbolsConnection(endSymbolsConnectionSelectElement.value);
          g.refreshView();
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
      pointsInputElement.addEventListener("keyup", enterKeyUp);
      minimumXValueInputElement.addEventListener("keyup", enterKeyUp);
      maximumXValueInputElement.addEventListener("keyup", enterKeyUp);
      minimumYValueInputElement.addEventListener("keyup", enterKeyUp);
      maximumYValueInputElement.addEventListener("keyup", enterKeyUp);
      xAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      yAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      windowColorInputElement.addEventListener("keyup", enterKeyUp);
      lineColorInputElement.addEventListener("keyup", enterKeyUp);
      symbolColorInputElement.addEventListener("keyup", enterKeyUp);
      endSymbolRadiusInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 550,
        width: 450,
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
