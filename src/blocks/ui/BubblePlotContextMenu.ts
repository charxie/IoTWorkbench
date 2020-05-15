/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {BubblePlot} from "../BubblePlot";

export class BubblePlotContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "bubble-plot-block-context-menu";
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
    PngSaver.saveAs((<BubblePlot>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td colspan="2">
                    <input type="radio" name="scale" id="bubble-plot-auto-scale-radio-button" checked> Auto
                    <input type="radio" name="scale" id="bubble-plot-fixed-scale-radio-button"> Fixed
                  </td>
                </tr>
                <tr>
                  <td>Minimum X Value:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-minimum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum X Value:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-maximum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Minimum Y Value:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-minimum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Y Value:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-maximum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Minimum Z Value:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-minimum-z-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Z Value:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-maximum-z-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Minimum Radius:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-minimum-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Radius:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-maximum-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Bubble Color:</td>
                  <td><input type="color" id="bubble-plot-bubble-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="bubble-plot-bubble-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Bubble Type:</td>
                  <td colspan="2">
                    <select id="bubble-plot-bubble-type-selector" style="width: 100%">
                      <option value="Circle" selected>Circle</option>
                      <option value="Square">Square</option>
                      <option value="Triangle Up">Triangle Up</option>
                      <option value="Triangle Down">Triangle Down</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Five-Pointed Star">Five-Pointed Star</option>
                      <option value="Six-Pointed Star">Six-Pointed Star</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="bubble-plot-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="bubble-plot-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Grid Lines:</td>
                  <td colspan="2">
                    <input type="radio" name="grid-lines" id="bubble-plot-no-grid-lines-radio-button" checked> No
                    <input type="radio" name="grid-lines" id="bubble-plot-grid-lines-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="bubble-plot-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof BubblePlot) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("bubble-plot-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let autoScaleRadioButton = document.getElementById("bubble-plot-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("bubble-plot-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumXValueField = document.getElementById("bubble-plot-minimum-x-value-field") as HTMLInputElement;
      minimumXValueField.value = g.getMinimumXValue().toString();
      let maximumXValueField = document.getElementById("bubble-plot-maximum-x-value-field") as HTMLInputElement;
      maximumXValueField.value = g.getMaximumXValue().toString();
      let minimumYValueField = document.getElementById("bubble-plot-minimum-y-value-field") as HTMLInputElement;
      minimumYValueField.value = g.getMinimumYValue().toString();
      let maximumYValueField = document.getElementById("bubble-plot-maximum-y-value-field") as HTMLInputElement;
      maximumYValueField.value = g.getMaximumYValue().toString();
      let minimumZValueField = document.getElementById("bubble-plot-minimum-z-value-field") as HTMLInputElement;
      minimumZValueField.value = g.getMinimumZValue().toString();
      let maximumZValueField = document.getElementById("bubble-plot-maximum-z-value-field") as HTMLInputElement;
      maximumZValueField.value = g.getMaximumZValue().toString();
      let minimumRadiusField = document.getElementById("bubble-plot-minimum-radius-field") as HTMLInputElement;
      minimumRadiusField.value = g.getMinimumBubbleRadius().toString();
      let maximumRadiusField = document.getElementById("bubble-plot-maximum-radius-field") as HTMLInputElement;
      maximumRadiusField.value = g.getMaximumBubbleRadius().toString();
      let xAxisLableField = document.getElementById("bubble-plot-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("bubble-plot-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();
      let bubbleTypeSelector = document.getElementById("bubble-plot-bubble-type-selector") as HTMLSelectElement;
      bubbleTypeSelector.value = g.getBubbleType();
      let bubbleColorField = document.getElementById("bubble-plot-bubble-color-field") as HTMLInputElement;
      bubbleColorField.value = g.getBubbleColor();
      let bubbleColorChooser = document.getElementById("bubble-plot-bubble-color-chooser") as HTMLInputElement;
      Util.setColorPicker(bubbleColorChooser, g.getBubbleColor());
      Util.hookupColorInputs(bubbleColorField, bubbleColorChooser);
      let windowColorField = document.getElementById("bubble-plot-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getViewWindowColor();
      let windowColorChooser = document.getElementById("bubble-plot-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getViewWindowColor());
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      let noGridLinesRadioButton = document.getElementById("bubble-plot-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("bubble-plot-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthField = document.getElementById("bubble-plot-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("bubble-plot-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set minimum X value
        let minimumXValue = parseFloat(minimumXValueField.value);
        if (isNumber(minimumXValue)) {
          g.setMinimumXValue(minimumXValue);
        } else {
          success = false;
          message = minimumXValueField.value + " is not a valid value for minimum X";
        }
        // set maximum X value
        let maximumXValue = parseFloat(maximumXValueField.value);
        if (isNumber(maximumXValue)) {
          g.setMaximumXValue(maximumXValue);
        } else {
          success = false;
          message = maximumXValueField.value + " is not a valid value for maximum X";
        }
        // set minimum Y value
        let minimumYValue = parseFloat(minimumYValueField.value);
        if (isNumber(minimumYValue)) {
          g.setMinimumYValue(minimumYValue);
        } else {
          success = false;
          message = minimumYValueField.value + " is not a valid value for minimum Y";
        }
        // set maximum Y value
        let maximumYValue = parseFloat(maximumYValueField.value);
        if (isNumber(maximumYValue)) {
          g.setMaximumYValue(maximumYValue);
        } else {
          success = false;
          message = maximumYValueField.value + " is not a valid value for maximum Y";
        }
        // set minimum Z value
        let minimumZValue = parseFloat(minimumZValueField.value);
        if (isNumber(minimumZValue)) {
          g.setMinimumZValue(minimumZValue);
        } else {
          success = false;
          message = minimumZValueField.value + " is not a valid value for minimum Z";
        }
        // set maximum Z value
        let maximumZValue = parseFloat(maximumZValueField.value);
        if (isNumber(maximumZValue)) {
          g.setMaximumZValue(maximumZValue);
        } else {
          success = false;
          message = maximumZValueField.value + " is not a valid value for maximum Z";
        }
        // set minimum radius
        let minimumRadius = parseFloat(minimumRadiusField.value);
        if (isNumber(minimumRadius)) {
          g.setMinimumBubbleRadius(minimumRadius);
        } else {
          success = false;
          message = minimumRadiusField.value + " is not a valid value for minimum radius";
        }
        // set maximum radius
        let maximumRadius = parseFloat(maximumRadiusField.value);
        if (isNumber(maximumRadius)) {
          g.setMaximumBubbleRadius(maximumRadius);
        } else {
          success = false;
          message = maximumRadiusField.value + " is not a valid value for maximum radius";
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
          g.setAutoScale(autoScaleRadioButton.checked);
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setBubbleType(bubbleTypeSelector.value);
          g.setBubbleColor(bubbleColorField.value);
          g.setShowGridLines(gridLinesRadioButton.checked);
          g.setViewWindowColor(windowColorField.value);
          g.updateModel();
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
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      minimumXValueField.addEventListener("keyup", enterKeyUp);
      maximumXValueField.addEventListener("keyup", enterKeyUp);
      minimumYValueField.addEventListener("keyup", enterKeyUp);
      maximumYValueField.addEventListener("keyup", enterKeyUp);
      minimumZValueField.addEventListener("keyup", enterKeyUp);
      maximumZValueField.addEventListener("keyup", enterKeyUp);
      minimumRadiusField.addEventListener("keyup", enterKeyUp);
      maximumRadiusField.addEventListener("keyup", enterKeyUp);
      bubbleColorField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 550,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
