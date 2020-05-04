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
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
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
    PngSaver.saveAs((<Histogram>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td style="width: 140px">Name:</td>
                  <td colspan="3"><input type="text" id="histogram-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Data Ports:</td>
                  <td colspan="3"><input type="text" id="histogram-data-ports-field" style="width: 100%"></td>
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
                  <td>Number of Bins:</td>
                  <td colspan="3"><input type="text" id="histogram-bin-number-field" style="width: 100%"></td>
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
                  <td>Legend:</td>
                  <td><select id="histogram-legend-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="histogram-legend-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><select id="histogram-line-color-port-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="histogram-line-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="histogram-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Width:</td>
                  <td><select id="histogram-line-width-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="histogram-line-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Fill Color:</td>
                  <td><select id="histogram-fill-color-port-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="histogram-fill-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="histogram-fill-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="histogram-window-color-chooser" style="width: 50px"></td>
                  <td colspan="2"><input type="text" id="histogram-window-color-field" style="width: 100%"></td>
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

  private createPortSelector(id: string): HTMLSelectElement {
    let selector = document.getElementById(id) as HTMLSelectElement;
    let ports = (<Histogram>this.block).getDataPorts();
    for (let p of ports) {
      let option = document.createElement("option");
      option.value = ports.indexOf(p).toString();
      option.text = "Port " + p.getUid();
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
      let xAxisLableField = document.getElementById("histogram-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("histogram-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();
      let numberOfBinsField = document.getElementById("histogram-bin-number-field") as HTMLInputElement;
      numberOfBinsField.value = g.getNumberOfBins().toString();

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

      let dataPortsField = document.getElementById("histogram-data-ports-field") as HTMLInputElement;
      dataPortsField.value = g.getDataPorts().length.toString();

      let lineColorField = document.getElementById("histogram-line-color-field") as HTMLInputElement;
      lineColorField.value = lineColors[0];
      lineColorField.onchange = () => lineColors[parseInt(lineColorPortSelector.value)] = lineColorField.value;
      let lineColorChooser = document.getElementById("histogram-line-color-chooser") as HTMLInputElement;
      Util.setColorPicker(lineColorChooser, lineColors[0]);
      let lineColorPortSelector = this.createPortSelector("histogram-line-color-port-selector");
      lineColorPortSelector.onchange = () => {
        let c = lineColors[parseInt(lineColorPortSelector.value)];
        lineColorField.value = c;
        Util.setColorPicker(lineColorChooser, c);
      };

      let lineWidthField = document.getElementById("histogram-line-width-field") as HTMLInputElement;
      lineWidthField.value = lineWidths[0].toString();
      lineWidthField.onchange = () => lineWidths[parseInt(lineWidthPortSelector.value)] = parseFloat(lineWidthField.value);
      let lineWidthPortSelector = this.createPortSelector("histogram-line-width-port-selector");
      lineWidthPortSelector.onchange = () => lineWidthField.value = lineWidths[parseInt(lineWidthPortSelector.value)].toString();

      let legendField = document.getElementById("histogram-legend-field") as HTMLInputElement;
      legendField.value = legends[0].toString();
      legendField.onchange = () => legends[parseInt(legendPortSelector.value)] = legendField.value;
      let legendPortSelector = this.createPortSelector("histogram-legend-port-selector");
      legendPortSelector.onchange = () => legendField.value = legends[parseInt(legendPortSelector.value)].toString();

      let fillColorField = document.getElementById("histogram-fill-color-field") as HTMLInputElement;
      fillColorField.value = g.getFillColor(0);
      fillColorField.onchange = () => fillColors[parseInt(fillColorPortSelector.value)] = fillColorField.value;
      let fillColorChooser = document.getElementById("histogram-fill-color-chooser") as HTMLInputElement;
      Util.setColorPicker(fillColorChooser, fillColors[0]);
      let fillColorPortSelector = this.createPortSelector("histogram-fill-color-port-selector");
      fillColorPortSelector.onchange = () => {
        let c = fillColors[parseInt(fillColorPortSelector.value)];
        fillColorField.value = c;
        Util.setColorPicker(fillColorChooser, c);
      };

      let windowColorField = document.getElementById("histogram-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getGraphWindowColor();
      let windowColorChooser = document.getElementById("histogram-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getGraphWindowColor());
      let noGridLinesRadioButton = document.getElementById("histogram-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("histogram-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthField = document.getElementById("histogram-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("histogram-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      Util.hookupColorInputs(windowColorField, windowColorChooser);
      Util.hookupColorInputs(lineColorField, lineColorChooser);
      Util.hookupColorInputs(fillColorField, fillColorChooser);

      const okFunction = () => {
        let success = true;
        let message;
        // set data port number
        let dataPortNumber = parseFloat(dataPortsField.value);
        if (isNumber(dataPortNumber)) {
          if (dataPortNumber > 10 || dataPortNumber < 1) {
            success = false;
            message = "Data port number must be between 1 and 10";
          } else {
            g.setDataPortNumber(dataPortNumber);
          }
        } else {
          success = false;
          message = dataPortsField.value + " is not a valid value for data port number";
        }
        // set minimum x value
        let minimumXValue = parseFloat(minimumXValueField.value);
        if (isNumber(minimumXValue)) {
          g.setMinimumXValue(minimumXValue);
        } else {
          success = false;
          message = minimumXValueField.value + " is not a valid value for minimum x";
        }
        // set maximum x value
        let maximumXValue = parseFloat(maximumXValueField.value);
        if (isNumber(maximumXValue)) {
          g.setMaximumXValue(maximumXValue);
        } else {
          success = false;
          message = maximumXValueField.value + " is not a valid value for maximum x";
        }
        // set minimum y value
        let minimumYValue = parseFloat(minimumYValueField.value);
        if (isNumber(minimumYValue)) {
          g.setMinimumYValue(minimumYValue);
        } else {
          success = false;
          message = minimumYValueField.value + " is not a valid value for minimum y";
        }
        // set maximum y value
        let maximumYValue = parseFloat(maximumYValueField.value);
        if (isNumber(maximumYValue)) {
          g.setMaximumYValue(maximumYValue);
        } else {
          success = false;
          message = maximumYValueField.value + " is not a valid value for maximum y";
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
        // check line widths
        for (let lineWidth of lineWidths) {
          if (lineWidth < 0) {
            success = false;
            message = "Port " + g.getDataPorts()[lineWidths.indexOf(lineWidth)].getUid() + " line width cannot be negative (" + lineWidth + ")";
            break;
          }
        }
        // set number of bins
        let bins = parseInt(numberOfBinsField.value);
        if (isNumber(bins)) {
          g.setNumberOfBins(Math.max(2, bins));
        } else {
          success = false;
          message = numberOfBinsField.value + " is not a valid number of bins";
        }
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setGraphWindowColor(windowColorField.value);
          g.setShowGridLines(gridLinesRadioButton.checked);
          g.setAutoScale(autoScaleRadioButton.checked);
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
      const enterKeyUp = (e) => {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      nameField.addEventListener("keyup", enterKeyUp);
      dataPortsField.addEventListener("keyup", enterKeyUp);
      minimumXValueField.addEventListener("keyup", enterKeyUp);
      maximumXValueField.addEventListener("keyup", enterKeyUp);
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      legendField.addEventListener("keyup", enterKeyUp);
      lineColorField.addEventListener("keyup", enterKeyUp);
      lineWidthField.addEventListener("keyup", enterKeyUp);
      fillColorField.addEventListener("keyup", enterKeyUp);
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
