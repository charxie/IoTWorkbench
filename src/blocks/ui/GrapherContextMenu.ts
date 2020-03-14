/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {Grapher} from "../Grapher";
import {PngSaver} from "../../tools/PngSaver";

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
    PngSaver.saveAs((<Grapher>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td style="width: 140px">Name:</td>
                  <td colspan="3"><input type="text" id="grapher-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td colspan="3"><input type="text" id="grapher-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="3"><input type="text" id="grapher-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td colspan="3">
                    <input type="radio" name="scale" id="grapher-auto-scale-radio-button" checked> Auto
                    <input type="radio" name="scale" id="grapher-fixed-scale-radio-button"> Fixed
                  </td>
                </tr>
                <tr>
                  <td>Minimum Value:</td>
                  <td colspan="3"><input type="text" id="grapher-minimum-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Value:</td>
                  <td colspan="3"><input type="text" id="grapher-maximum-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Data Ports:</td>
                  <td colspan="3"><input type="text" id="grapher-data-ports-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Type:</td>
                  <td><select id="grapher-line-type-port-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="grapher-line-type-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Solid" selected>Solid</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><select id="grapher-line-color-port-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="grapher-line-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="grapher-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Type:</td>
                  <td><select id="grapher-symbol-type-port-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="grapher-symbol-type-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Circle" selected>Circle</option>
                      <option value="Square">Square</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Symbol Color:</td>
                  <td><select id="grapher-symbol-color-port-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="grapher-symbol-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="grapher-symbol-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Fill:</td>
                  <td colspan="3">
                    <input type="radio" name="fill" id="grapher-no-fill-radio-button" checked> No
                    <input type="radio" name="fill" id="grapher-fill-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Fill Color:</td>
                  <td><select id="grapher-fill-color-port-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="grapher-fill-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="grapher-fill-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="grapher-window-color-chooser" style="width: 50px"></td>
                  <td colspan="2"><input type="text" id="grapher-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="3"><input type="text" id="grapher-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="3"><input type="text" id="grapher-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private createPortSelector(id: string): HTMLSelectElement {
    let selector = document.getElementById(id) as HTMLSelectElement;
    let ports = (<Grapher>this.block).getDataPorts();
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
    if (this.block instanceof Grapher) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      this.createPortSelector("grapher-symbol-color-port-selector");
      this.createPortSelector("grapher-fill-color-port-selector");

      let nameInputElement = document.getElementById("grapher-name-field") as HTMLInputElement;
      nameInputElement.value = g.getName();
      let dataPortsInputElement = document.getElementById("grapher-data-ports-field") as HTMLInputElement;
      dataPortsInputElement.value = g.getDataPorts().length.toString();

      let lineTypeSelectElement = document.getElementById("grapher-line-type-selector") as HTMLSelectElement;
      lineTypeSelectElement.value = g.getLineType(0);
      lineTypeSelectElement.onchange = () => g.setLineType(parseInt(lineTypePortSelector.value), lineTypeSelectElement.value);
      let lineTypePortSelector = this.createPortSelector("grapher-line-type-port-selector");
      lineTypePortSelector.onchange = () => lineTypeSelectElement.value = g.getLineType(parseInt(lineTypePortSelector.value));

      let symbolTypeSelectElement = document.getElementById("grapher-symbol-type-selector") as HTMLSelectElement;
      symbolTypeSelectElement.value = g.getGraphSymbol(0);
      symbolTypeSelectElement.onchange = () => g.setGraphSymbol(parseInt(symbolTypePortSelector.value), symbolTypeSelectElement.value);
      let symbolTypePortSelector = this.createPortSelector("grapher-symbol-type-port-selector");
      symbolTypePortSelector.onchange = () => symbolTypeSelectElement.value = g.getGraphSymbol(parseInt(symbolTypePortSelector.value));

      let autoScaleRadioButton = document.getElementById("grapher-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("grapher-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumValueInputElement = document.getElementById("grapher-minimum-value-field") as HTMLInputElement;
      minimumValueInputElement.value = g.getMinimumValue().toString();
      let maximumValueInputElement = document.getElementById("grapher-maximum-value-field") as HTMLInputElement;
      maximumValueInputElement.value = g.getMaximumValue().toString();
      let xAxisLableInputElement = document.getElementById("grapher-x-axis-label-field") as HTMLInputElement;
      xAxisLableInputElement.value = g.getXAxisLabel();
      let yAxisLableInputElement = document.getElementById("grapher-y-axis-label-field") as HTMLInputElement;
      yAxisLableInputElement.value = g.getYAxisLabel();
      let windowColorInputElement = document.getElementById("grapher-window-color-field") as HTMLInputElement;
      windowColorInputElement.value = g.getGraphWindowColor();
      let windowColorChooser = document.getElementById("grapher-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getGraphWindowColor());

      let lineColorInputElement = document.getElementById("grapher-line-color-field") as HTMLInputElement;
      lineColorInputElement.value = g.getLineColor(0);
      lineColorInputElement.onchange = () => g.setLineColor(parseInt(lineColorPortSelector.value), lineColorInputElement.value);
      let lineColorChooser = document.getElementById("grapher-line-color-chooser") as HTMLInputElement;
      Util.setColorPicker(lineColorChooser, g.getLineColor(0));
      let lineColorPortSelector = this.createPortSelector("grapher-line-color-port-selector");
      lineColorPortSelector.onchange = () => {
        let i = parseInt(lineColorPortSelector.value);
        let c = g.getLineColor(i);
        lineColorInputElement.value = c;
        Util.setColorPicker(lineColorChooser, c);
      };

      let noFillRadioButton = document.getElementById("grapher-no-fill-radio-button") as HTMLInputElement;
      noFillRadioButton.checked = !g.getFillOption();
      let fillRadioButton = document.getElementById("grapher-fill-radio-button") as HTMLInputElement;
      fillRadioButton.checked = g.getFillOption();
      let fillColorInputElement = document.getElementById("grapher-fill-color-field") as HTMLInputElement;
      fillColorInputElement.value = g.getFillColor();
      let fillColorChooser = document.getElementById("grapher-fill-color-chooser") as HTMLInputElement;
      Util.setColorPicker(fillColorChooser, g.getFillColor());
      let symbolColorInputElement = document.getElementById("grapher-symbol-color-field") as HTMLInputElement;
      symbolColorInputElement.value = g.getGraphSymbolColor();
      let symbolColorChooser = document.getElementById("grapher-symbol-color-chooser") as HTMLInputElement;
      Util.setColorPicker(symbolColorChooser, g.getGraphSymbolColor());
      let widthInputElement = document.getElementById("grapher-width-field") as HTMLInputElement;
      widthInputElement.value = g.getWidth().toString();
      let heightInputElement = document.getElementById("grapher-height-field") as HTMLInputElement;
      heightInputElement.value = g.getHeight().toString();

      Util.hookupColorInputs(windowColorInputElement, windowColorChooser);
      Util.hookupColorInputs(lineColorInputElement, lineColorChooser);
      Util.hookupColorInputs(fillColorInputElement, fillColorChooser);
      Util.hookupColorInputs(symbolColorInputElement, symbolColorChooser);

      const okFunction = () => {
        let success = true;
        let message;
        // set data port number
        let dataPortNumber = parseFloat(dataPortsInputElement.value);
        if (isNumber(dataPortNumber)) {
          if (dataPortNumber > 10 || dataPortNumber < 1) {
            success = false;
            message = "Data port number must be between 1 and 10";
          } else {
            g.setDataPortNumber(dataPortNumber);
          }
        } else {
          success = false;
          message = dataPortsInputElement.value + " is not a valid value for data port number";
        }
        // set minimum value
        let minimumValue = parseFloat(minimumValueInputElement.value);
        if (isNumber(minimumValue)) {
          g.setMinimumValue(minimumValue);
        } else {
          success = false;
          message = minimumValueInputElement.value + " is not a valid value for minimum";
        }
        // set maximum value
        let maximumValue = parseFloat(maximumValueInputElement.value);
        if (isNumber(maximumValue)) {
          g.setMaximumValue(maximumValue);
        } else {
          success = false;
          message = maximumValueInputElement.value + " is not a valid value for maximum";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          g.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          g.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
        }
        // finish
        if (success) {
          g.setName(nameInputElement.value);
          g.setXAxisLabel(xAxisLableInputElement.value);
          g.setYAxisLabel(yAxisLableInputElement.value);
          g.setGraphWindowColor(windowColorInputElement.value);
          g.setAutoScale(autoScaleRadioButton.checked);
          g.setFillOption(fillRadioButton.checked);
          g.setFillColor(fillColorInputElement.value);
          g.setGraphSymbol(parseInt(symbolTypePortSelector.value), symbolTypeSelectElement.value);
          g.setGraphSymbolColor(symbolColorInputElement.value);
          g.setLineType(parseInt(lineTypePortSelector.value), lineTypeSelectElement.value);
          g.setLineColor(parseInt(lineColorPortSelector.value), lineColorInputElement.value);
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
      nameInputElement.addEventListener("keyup", enterKeyUp);
      dataPortsInputElement.addEventListener("keyup", enterKeyUp);
      minimumValueInputElement.addEventListener("keyup", enterKeyUp);
      maximumValueInputElement.addEventListener("keyup", enterKeyUp);
      xAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      yAxisLableInputElement.addEventListener("keyup", enterKeyUp);
      windowColorInputElement.addEventListener("keyup", enterKeyUp);
      lineColorInputElement.addEventListener("keyup", enterKeyUp);
      fillColorInputElement.addEventListener("keyup", enterKeyUp);
      symbolColorInputElement.addEventListener("keyup", enterKeyUp);
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
          'Cancel': () => {
            d.dialog('close');
          }
        }
      });
    }
  }

}
