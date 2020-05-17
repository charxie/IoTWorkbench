/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {ParallelCoordinatesPlot} from "../ParallelCoordinatesPlot";

export class ParallelCoordinatesPlotContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "parallel-coordinates-plot-context-menu";
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
    PngSaver.saveAs((<ParallelCoordinatesPlot>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td style="width: 140px">Name:</td>
                  <td colspan="3"><input type="text" id="parallel-coordinates-plot-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Data Ports:</td>
                  <td colspan="3"><input type="text" id="parallel-coordinates-plot-data-ports-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Width:</td>
                  <td colspan="3"><input type="text" id="parallel-coordinates-plot-line-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Fraction Digits:</td>
                  <td colspan="3"><input type="text" id="parallel-coordinates-plot-fraction-digits-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td colspan="3">
                    <input type="radio" name="scale" id="parallel-coordinates-plot-auto-scale-radio-button" checked> Auto
                    <input type="radio" name="scale" id="parallel-coordinates-plot-fixed-scale-radio-button"> Fixed
                  </td>
                </tr>
                <tr>
                  <td>Minimum:</td>
                  <td><select id="parallel-coordinates-plot-minimum-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="parallel-coordinates-plot-minimum-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum:</td>
                  <td><select id="parallel-coordinates-plot-maximum-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="parallel-coordinates-plot-maximum-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Axis Label:</td>
                  <td><select id="parallel-coordinates-plot-axis-label-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="parallel-coordinates-plot-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Color Scheme:</td>
                  <td colspan="2">
                    <select id="parallel-coordinates-plot-color-scheme-selector" style="width: 100%">
                      <option value="Turbo" selected>Turbo</option>
                      <option value="Reds">Reds</option>
                      <option value="Greens">Greens</option>
                      <option value="Blues">Blues</option>
                      <option value="Greys">Greys</option>
                      <option value="Oranges">Oranges</option>
                      <option value="Purples">Purples</option>
                      <option value="Warm">Warm</option>
                      <option value="Cool">Cool</option>
                      <option value="Magma">Magma</option>
                      <option value="Plasma">Plasma</option>
                      <option value="Inferno">Inferno</option>
                      <option value="Spectral">Spectral</option>
                      <option value="Cividis">Cividis</option>
                      <option value="Viridis">Viridis</option>
                      <option value="Rainbow">Rainbow</option>
                      <option value="Sinebow">Sinebow</option>
                      <option value="Cubehelix">Cubehelix</option>
                      <option value="RdYlBu">RdYlBu</option>
                      <option value="RdYlGn">RdYlGn</option>
                      <option value="RdGy">RdGy</option>
                      <option value="RdBu">RdBu</option>
                      <option value="PuOr">PuOr</option>
                      <option value="PiYG">PiYG</option>
                      <option value="PRGn">PRGn</option>
                      <option value="BrBG">BrBG</option>
                      <option value="BuGn">BuGn</option>
                      <option value="BuPu">BuPu</option>
                      <option value="GnBu">GnBu</option>
                      <option value="OrRd">OrRd</option>
                      <option value="PuBu">PuBu</option>
                      <option value="PuBuGn">PuBuGn</option>
                      <option value="PuRd">PuRd</option>
                      <option value="RdPu">RdPu</option>
                      <option value="YlGn">YlGn</option>
                      <option value="YlGnBu">YlGnBu</option>
                      <option value="YlOrBr">YlOrBr</option>
                      <option value="YlOrRd">YlOrRd</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="parallel-coordinates-plot-window-color-chooser" style="width: 50px"></td>
                  <td colspan="2"><input type="text" id="parallel-coordinates-plot-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="3"><input type="text" id="parallel-coordinates-plot-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="3"><input type="text" id="parallel-coordinates-plot-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private createPortSelector(id: string): HTMLSelectElement {
    let selector = document.getElementById(id) as HTMLSelectElement;
    let ports = (<ParallelCoordinatesPlot>this.block).getDataPorts();
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
    if (this.block instanceof ParallelCoordinatesPlot) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());

      // temporary storage of properties (don't store the changes to the block object or else we won't be able to cancel)
      let axisLabels: string[] = g.getAxisLabels();
      let minimumValues: number[] = g.getMinimumValues();
      let maximumValues: number[] = g.getMaximumValues();

      let nameField = document.getElementById("parallel-coordinates-plot-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let fractionDigitsField = document.getElementById("parallel-coordinates-plot-fraction-digits-field") as HTMLInputElement;
      fractionDigitsField.value = g.getFractionDigits().toString();
      let colorSchemeSelector = document.getElementById("parallel-coordinates-plot-color-scheme-selector") as HTMLSelectElement;
      colorSchemeSelector.value = g.getColorScheme();
      let lineWidthField = document.getElementById("parallel-coordinates-plot-line-width-field") as HTMLInputElement;
      lineWidthField.value = g.getLineWidth().toString();
      let autoScaleRadioButton = document.getElementById("parallel-coordinates-plot-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("parallel-coordinates-plot-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let dataPortsField = document.getElementById("parallel-coordinates-plot-data-ports-field") as HTMLInputElement;
      dataPortsField.value = g.getDataPorts().length.toString();
      let windowColorField = document.getElementById("parallel-coordinates-plot-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getViewWindowColor();
      let windowColorChooser = document.getElementById("parallel-coordinates-plot-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getViewWindowColor());
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      let widthField = document.getElementById("parallel-coordinates-plot-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("parallel-coordinates-plot-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      let axisLabelField = document.getElementById("parallel-coordinates-plot-axis-label-field") as HTMLInputElement;
      axisLabelField.value = axisLabels[0].toString();
      axisLabelField.onchange = () => axisLabels[parseInt(axisLabelPortSelector.value)] = axisLabelField.value;
      let axisLabelPortSelector = this.createPortSelector("parallel-coordinates-plot-axis-label-port-selector");
      axisLabelPortSelector.onchange = () => axisLabelField.value = axisLabels[parseInt(axisLabelPortSelector.value)].toString();

      let minimumField = document.getElementById("parallel-coordinates-plot-minimum-field") as HTMLInputElement;
      minimumField.value = minimumValues[0].toString();
      minimumField.onchange = () => minimumValues[parseInt(minimumPortSelector.value)] = parseFloat(minimumField.value);
      let minimumPortSelector = this.createPortSelector("parallel-coordinates-plot-minimum-port-selector");
      minimumPortSelector.onchange = () => minimumField.value = minimumValues[parseInt(minimumPortSelector.value)].toString();

      let maximumField = document.getElementById("parallel-coordinates-plot-maximum-field") as HTMLInputElement;
      maximumField.value = maximumValues[0].toString();
      maximumField.onchange = () => maximumValues[parseInt(maximumPortSelector.value)] = parseFloat(maximumField.value);
      let maximumPortSelector = this.createPortSelector("parallel-coordinates-plot-maximum-port-selector");
      maximumPortSelector.onchange = () => maximumField.value = maximumValues[parseInt(maximumPortSelector.value)].toString();

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
        // set fraction digits
        let fractionDigits = parseInt(fractionDigitsField.value);
        if (isNumber(fractionDigits)) {
          g.setFractionDigits(Math.max(0, fractionDigits));
        } else {
          success = false;
          message = fractionDigitsField.value + " is not valid for fraction digits";
        }
        // set line width
        let lineWidth = parseInt(lineWidthField.value);
        if (isNumber(lineWidth)) {
          g.setLineWidth(Math.max(1, lineWidth));
        } else {
          success = false;
          message = lineWidthField.value + " is not a valid line width";
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
          g.setColorScheme(colorSchemeSelector.value)
          g.setViewWindowColor(windowColorField.value);
          g.setAutoScale(autoScaleRadioButton.checked);
          for (let i = 0; i < axisLabels.length; i++) {
            g.setAxisLabel(i, axisLabels[i]);
            g.setMinimumValue(i, minimumValues[i]);
            g.setMaximumValue(i, maximumValues[i]);
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
      fractionDigitsField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      lineWidthField.addEventListener("keyup", enterKeyUp);
      axisLabelField.addEventListener("keyup", enterKeyUp);
      minimumField.addEventListener("keyup", enterKeyUp);
      maximumField.addEventListener("keyup", enterKeyUp);
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
