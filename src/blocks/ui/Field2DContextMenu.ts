/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {Field2D} from "../Field2D";

export class Field2DContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "field2d-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 150px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
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
    let saveImageButton = document.getElementById(this.id + "-save-image-button");
    saveImageButton.addEventListener("click", this.saveImageButtonClick.bind(this), false);
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<Field2D>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="field2d-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Contour Lines:</td>
                  <td colspan="2"><input type="text" id="field2d-line-number-field" style="width: 100%"></td>
                </tr>
               <tr>
                  <td>Scale:</td>
                  <td colspan="2">
                    <select id="field2d-scale-type-selector" style="width: 100%">
                      <option value="Linear" selected>Linear</option>
                      <option value="Logarithmic">Logarithmic</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Minimum Color:</td>
                  <td><input type="color" id="field2d-minimum-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="field2d-minimum-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Color:</td>
                  <td><input type="color" id="field2d-maximum-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="field2d-maximum-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Type:</td>
                  <td colspan="2">
                    <select id="field2d-line-type-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Solid" selected>Solid</option>
                    </select>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><input type="color" id="field2d-line-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="field2d-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td colspan="2"><input type="text" id="field2d-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="2"><input type="text" id="field2d-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="field2d-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="field2d-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Grid Lines:</td>
                  <td colspan="2">
                    <input type="radio" name="grid-lines" id="field2d-no-grid-lines-radio-button" checked> No
                    <input type="radio" name="grid-lines" id="field2d-grid-lines-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="field2d-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="field2d-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Field2D) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("field2d-name-field") as HTMLInputElement;
      nameInputElement.value = g.getName();
      let lineNumberInputElement = document.getElementById("field2d-line-number-field") as HTMLInputElement;
      lineNumberInputElement.value = g.getLineNumber().toString();
      let scaleTypeSelectElement = document.getElementById("field2d-scale-type-selector") as HTMLSelectElement;
      scaleTypeSelectElement.value = g.getScaleType();
      let minimumColorInputElement = document.getElementById("field2d-minimum-color-field") as HTMLInputElement;
      minimumColorInputElement.value = g.getMinimumColor();
      let minimumColorChooser = document.getElementById("field2d-minimum-color-chooser") as HTMLInputElement;
      Util.setColorPicker(minimumColorChooser, g.getMinimumColor());
      let maximumColorInputElement = document.getElementById("field2d-maximum-color-field") as HTMLInputElement;
      maximumColorInputElement.value = g.getMaximumColor();
      let maximumColorChooser = document.getElementById("field2d-maximum-color-chooser") as HTMLInputElement;
      Util.setColorPicker(maximumColorChooser, g.getMaximumColor());
      let lineTypeSelectElement = document.getElementById("field2d-line-type-selector") as HTMLSelectElement;
      lineTypeSelectElement.value = g.getLineType();
      let lineColorInputElement = document.getElementById("field2d-line-color-field") as HTMLInputElement;
      lineColorInputElement.value = g.getLineColor();
      let lineColorChooser = document.getElementById("field2d-line-color-chooser") as HTMLInputElement;
      Util.setColorPicker(lineColorChooser, g.getLineColor());
      let xAxisLableInputElement = document.getElementById("field2d-x-axis-label-field") as HTMLInputElement;
      xAxisLableInputElement.value = g.getXAxisLabel();
      let yAxisLableInputElement = document.getElementById("field2d-y-axis-label-field") as HTMLInputElement;
      yAxisLableInputElement.value = g.getYAxisLabel();
      let windowColorInputElement = document.getElementById("field2d-window-color-field") as HTMLInputElement;
      windowColorInputElement.value = g.getFieldWindowColor();
      let windowColorChooser = document.getElementById("field2d-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getFieldWindowColor());
      let noGridLinesRadioButton = document.getElementById("field2d-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("field2d-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthInputElement = document.getElementById("field2d-width-field") as HTMLInputElement;
      widthInputElement.value = g.getWidth().toString();
      let heightInputElement = document.getElementById("field2d-height-field") as HTMLInputElement;
      heightInputElement.value = g.getHeight().toString();
      Util.hookupColorInputs(minimumColorInputElement, minimumColorChooser);
      Util.hookupColorInputs(maximumColorInputElement, maximumColorChooser);
      Util.hookupColorInputs(lineColorInputElement, lineColorChooser);
      Util.hookupColorInputs(windowColorInputElement, windowColorChooser);
      const okFunction = function () {
        let success = true;
        let message;
        // set line number
        let lineNumber = parseInt(lineNumberInputElement.value);
        if (isNumber(lineNumber)) {
          g.setWidth(Math.max(10, lineNumber));
        } else {
          success = false;
          message = lineNumberInputElement.value + " is not a valid line number.";
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
          g.setLineNumber(lineNumber);
          g.setScaleType(scaleTypeSelectElement.value);
          g.setMinimumColor(minimumColorInputElement.value);
          g.setMaximumColor(maximumColorInputElement.value);
          g.setLineType(lineTypeSelectElement.value);
          g.setLineColor(lineColorInputElement.value);
          g.setXAxisLabel(xAxisLableInputElement.value);
          g.setYAxisLabel(yAxisLableInputElement.value);
          g.setFieldWindowColor(windowColorInputElement.value);
          g.setShowGridLines(gridLinesRadioButton.checked);
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
      lineNumberInputElement.addEventListener("keyup", enterKeyUp);
      minimumColorInputElement.addEventListener("keyup", enterKeyUp);
      maximumColorInputElement.addEventListener("keyup", enterKeyUp);
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
        height: 500,
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
