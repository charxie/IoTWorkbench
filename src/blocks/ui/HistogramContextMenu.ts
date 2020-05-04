/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {Histogram} from "../Histogram";

export class HistogramContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "histogram-context-menu";
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
    (<Histogram>this.block).erase();
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<Histogram>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td style="width: 160px">Name:</td>
                  <td colspan="3"><input type="text" id="histogram-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td colspan="3"><input type="text" id="histogram-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="3"><input type="text" id="histogram-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Input Type:</td>
                  <td colspan="3">
                    <input type="radio" name="input" id="histogram-dual-input-radio-button" checked> Dual
                    <input type="radio" name="input" id="histogram-point-input-radio-button"> Point
                  </td>
                </tr>
                <tr>
                  <td>Points:</td>
                  <td colspan="3"><input type="text" id="histogram-points-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td colspan="3">
                    <input type="radio" name="scale" id="histogram-auto-scale-radio-button" checked> Auto
                    <input type="radio" name="scale" id="histogram-fixed-scale-radio-button"> Fixed
                  </td>
                </tr>
                <tr>
                  <td>Minimum X Value:</td>
                  <td colspan="3"><input type="text" id="histogram-minimum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum X Value:</td>
                  <td colspan="3"><input type="text" id="histogram-maximum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Minimum Y Value:</td>
                  <td colspan="3"><input type="text" id="histogram-minimum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Y Value:</td>
                  <td colspan="3"><input type="text" id="histogram-maximum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><select id="histogram-line-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="histogram-line-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="histogram-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Width:</td>
                  <td><select id="histogram-line-width-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="histogram-line-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Legend:</td>
                  <td><select id="histogram-legend-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="histogram-legend-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Fill Color:</td>
                  <td><select id="histogram-fill-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="histogram-fill-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="histogram-fill-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="histogram-window-color-chooser" style="width: 50px"></td>
                  <td colspan="2"><input type="text" id="histogram-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Background:</td>
                  <td><button type="button" id="histogram-window-background-file-button">Select</button></td>
                  <td><button type="button" id="histogram-window-background-remove-button">Remove</button></td>
                  <td><label id="histogram-window-background-file-name-label" style="width: 100%"></label></label></td>
                </tr>
                <tr>
                  <td>Grid Lines:</td>
                  <td colspan="3">
                    <input type="radio" name="grid-lines" id="histogram-no-grid-lines-radio-button" checked> No
                    <input type="radio" name="grid-lines" id="histogram-grid-lines-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="3"><input type="text" id="histogram-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="3"><input type="text" id="histogram-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private createSetSelector(id: string): HTMLSelectElement {
    let selector = document.getElementById(id) as HTMLSelectElement;
    let histogram = <Histogram>this.block;
    if (histogram.getPointInput()) {
      let ports = histogram.getPointPorts();
      for (let p of ports) {
        let option = document.createElement("option");
        option.value = ports.indexOf(p).toString();
        option.text = "Port " + p.getUid();
        selector.appendChild(option);
      }
    } else {
      let option = document.createElement("option");
      option.value = "0";
      option.text = "Dual";
      selector.appendChild(option);
    }
    return selector;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Histogram) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());

      // temporary storage of properties (don't store the changes to the block object or else we won't be able to cancel)
      let legends: string[] = g.getLegends();
      let lineColors: string[] = g.getLineColors();
      let lineWidths: number[] = g.getLineWidths();
      let fillColors: string[] = g.getFillColors();

      let nameField = document.getElementById("histogram-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let autoScaleRadioButton = document.getElementById("histogram-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("histogram-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumXValueField = document.getElementById("histogram-minimum-x-value-field") as HTMLInputElement;
      minimumXValueField.value = g.getMinimumXValue().toString();
      let maximumXValueField = document.getElementById("histogram-maximum-x-value-field") as HTMLInputElement;
      maximumXValueField.value = g.getMaximumXValue().toString();
      let minimumYValueField = document.getElementById("histogram-minimum-y-value-field") as HTMLInputElement;
      minimumYValueField.value = g.getMinimumYValue().toString();
      let maximumYValueField = document.getElementById("histogram-maximum-y-value-field") as HTMLInputElement;
      maximumYValueField.value = g.getMaximumYValue().toString();
      let xAxisLableField = document.getElementById("histogram-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("histogram-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();

      let pointsField = document.getElementById("histogram-points-field") as HTMLInputElement;
      pointsField.value = g.getNumberOfPoints().toString();
      let dualInputRadioButton = document.getElementById("histogram-dual-input-radio-button") as HTMLInputElement;
      dualInputRadioButton.checked = !g.getPointInput();
      let pointInputRadioButton = document.getElementById("histogram-point-input-radio-button") as HTMLInputElement;
      pointInputRadioButton.checked = g.getPointInput();

      let lineColorField = document.getElementById("histogram-line-color-field") as HTMLInputElement;
      lineColorField.value = lineColors[0];
      let lineColorChooser = document.getElementById("histogram-line-color-chooser") as HTMLInputElement;
      lineColorField.onchange = () => lineColors[parseInt(lineColorSetSelector.value)] = lineColorField.value;
      Util.setColorPicker(lineColorChooser, lineColors[0]);
      let lineColorSetSelector = this.createSetSelector("histogram-line-color-set-selector");
      lineColorSetSelector.onchange = () => {
        let c = lineColors[parseInt(lineColorSetSelector.value)];
        lineColorField.value = c;
        Util.setColorPicker(lineColorChooser, c);
      };

      let lineWidthField = document.getElementById("histogram-line-width-field") as HTMLInputElement;
      lineWidthField.value = lineWidths[0].toString();
      lineWidthField.onchange = () => lineWidths[parseInt(lineWidthSetSelector.value)] = parseFloat(lineWidthField.value);
      let lineWidthSetSelector = this.createSetSelector("histogram-line-width-set-selector");
      lineWidthSetSelector.onchange = () => lineWidthField.value = lineWidths[parseInt(lineWidthSetSelector.value)].toString();

      let fillColorField = document.getElementById("histogram-fill-color-field") as HTMLInputElement;
      fillColorField.value = g.getFillColor(0);
      fillColorField.onchange = () => fillColors[parseInt(fillColorSetSelector.value)] = fillColorField.value;
      let fillColorChooser = document.getElementById("histogram-fill-color-chooser") as HTMLInputElement;
      Util.setColorPicker(fillColorChooser, fillColors[0]);
      let fillColorSetSelector = this.createSetSelector("histogram-fill-color-set-selector");
      fillColorSetSelector.onchange = () => {
        let c = fillColors[parseInt(fillColorSetSelector.value)];
        fillColorField.value = c;
        Util.setColorPicker(fillColorChooser, c);
      };

      let legendField = document.getElementById("histogram-legend-field") as HTMLInputElement;
      legendField.value = legends[0].toString();
      legendField.onchange = () => legends[parseInt(legendPortSelector.value)] = legendField.value;
      let legendPortSelector = this.createSetSelector("histogram-legend-port-selector");
      legendPortSelector.onchange = () => legendField.value = legends[parseInt(legendPortSelector.value)].toString();

      let windowColorField = document.getElementById("histogram-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getSpaceWindowColor();
      let windowColorChooser = document.getElementById("histogram-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getSpaceWindowColor());
      let noGridLinesRadioButton = document.getElementById("histogram-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("histogram-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthField = document.getElementById("histogram-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("histogram-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      Util.hookupColorInputs(lineColorField, lineColorChooser);
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      Util.hookupColorInputs(fillColorField, fillColorChooser);

      const okFunction = () => {
        let success = true;
        let message;
        // set number of points
        let numberOfPoints = parseFloat(pointsField.value);
        if (isNumber(numberOfPoints)) {
          if (numberOfPoints > 10 || numberOfPoints < 1) {
            success = false;
            message = "Number of points must be between 1 and 10";
          } else {
            g.setNumberOfPoints(numberOfPoints);
          }
        } else {
          success = false;
          message = pointsField.value + " is not a valid value for number of points";
        }
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
        // check line width
        for (let lineWidth of lineWidths) {
          if (lineWidth < 0) {
            success = false;
            if (g.getPointInput()) {
              message = "Port " + g.getPointPorts()[lineWidths.indexOf(lineWidth)].getUid() + " line width cannot be negative (" + lineWidth + ")";
            } else {
              message = "Line width cannot be negative (" + lineWidth + ")";
            }
            break;
          }
        }
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setSpaceWindowColor(windowColorField.value);
          g.setShowGridLines(gridLinesRadioButton.checked);
          g.setAutoScale(autoScaleRadioButton.checked);
          g.setPointInput(pointInputRadioButton.checked);
          for (let i = 0; i < legends.length; i++) {
            g.setLegend(i, legends[i]);
            g.setLineColor(i, lineColors[i]);
            g.setLineWidth(i, lineWidths[i]);
            g.setFillColor(i, fillColors[i]);
          }
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
      nameField.addEventListener("keyup", enterKeyUp);
      pointsField.addEventListener("keyup", enterKeyUp);
      minimumXValueField.addEventListener("keyup", enterKeyUp);
      maximumXValueField.addEventListener("keyup", enterKeyUp);
      minimumYValueField.addEventListener("keyup", enterKeyUp);
      maximumYValueField.addEventListener("keyup", enterKeyUp);
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      lineColorField.addEventListener("keyup", enterKeyUp);
      lineWidthField.addEventListener("keyup", enterKeyUp);
      fillColorField.addEventListener("keyup", enterKeyUp);
      legendField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 550,
        width: 480,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
