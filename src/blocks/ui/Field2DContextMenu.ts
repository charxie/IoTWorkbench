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
      let nameField = document.getElementById("field2d-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let lineNumberField = document.getElementById("field2d-line-number-field") as HTMLInputElement;
      lineNumberField.value = g.getLineNumber().toString();
      let scaleTypeSelector = document.getElementById("field2d-scale-type-selector") as HTMLSelectElement;
      scaleTypeSelector.value = g.getScaleType();
      let minimumColorField = document.getElementById("field2d-minimum-color-field") as HTMLInputElement;
      minimumColorField.value = g.getMinimumColor();
      let minimumColorChooser = document.getElementById("field2d-minimum-color-chooser") as HTMLInputElement;
      Util.setColorPicker(minimumColorChooser, g.getMinimumColor());
      let maximumColorField = document.getElementById("field2d-maximum-color-field") as HTMLInputElement;
      maximumColorField.value = g.getMaximumColor();
      let maximumColorChooser = document.getElementById("field2d-maximum-color-chooser") as HTMLInputElement;
      Util.setColorPicker(maximumColorChooser, g.getMaximumColor());
      let lineTypeSelector = document.getElementById("field2d-line-type-selector") as HTMLSelectElement;
      lineTypeSelector.value = g.getLineType();
      let lineColorField = document.getElementById("field2d-line-color-field") as HTMLInputElement;
      lineColorField.value = g.getLineColor();
      let lineColorChooser = document.getElementById("field2d-line-color-chooser") as HTMLInputElement;
      Util.setColorPicker(lineColorChooser, g.getLineColor());
      let xAxisLableField = document.getElementById("field2d-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("field2d-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();
      let windowColorField = document.getElementById("field2d-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getFieldWindowColor();
      let windowColorChooser = document.getElementById("field2d-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getFieldWindowColor());
      let noGridLinesRadioButton = document.getElementById("field2d-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("field2d-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthField = document.getElementById("field2d-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("field2d-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();
      Util.hookupColorInputs(minimumColorField, minimumColorChooser);
      Util.hookupColorInputs(maximumColorField, maximumColorChooser);
      Util.hookupColorInputs(lineColorField, lineColorChooser);
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      const okFunction = () => {
        let success = true;
        let message;
        // set line number
        let lineNumber = parseInt(lineNumberField.value);
        if (isNumber(lineNumber)) {
          g.setWidth(Math.max(10, lineNumber));
        } else {
          success = false;
          message = lineNumberField.value + " is not a valid line number";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          g.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          g.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setLineNumber(lineNumber);
          g.setScaleType(scaleTypeSelector.value);
          g.setMinimumColor(minimumColorField.value);
          g.setMaximumColor(maximumColorField.value);
          g.setLineType(lineTypeSelector.value);
          g.setLineColor(lineColorField.value);
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setFieldWindowColor(windowColorField.value);
          g.setShowGridLines(gridLinesRadioButton.checked);
          g.refreshView();
          flowchart.storeBlockStates();
          flowchart.blockView.requestDraw();
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
      lineNumberField.addEventListener("keyup", enterKeyUp);
      minimumColorField.addEventListener("keyup", enterKeyUp);
      maximumColorField.addEventListener("keyup", enterKeyUp);
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      lineColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 500,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
