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
                  <td>Symbol Size:</td>
                  <td><select id="grapher-symbol-size-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="grapher-symbol-size-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Color:</td>
                  <td><select id="grapher-symbol-color-port-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="grapher-symbol-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="grapher-symbol-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Aera Fill:</td>
                  <td><select id="grapher-fill-option-port-selector" style="width: 65px"></select></td>
                  <td colspan="2">
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

      let nameField = document.getElementById("grapher-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let xAxisLableField = document.getElementById("grapher-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("grapher-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();

      let autoScaleRadioButton = document.getElementById("grapher-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("grapher-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumValueField = document.getElementById("grapher-minimum-value-field") as HTMLInputElement;
      minimumValueField.value = g.getMinimumValue().toString();
      let maximumValueField = document.getElementById("grapher-maximum-value-field") as HTMLInputElement;
      maximumValueField.value = g.getMaximumValue().toString();

      let dataPortsField = document.getElementById("grapher-data-ports-field") as HTMLInputElement;
      dataPortsField.value = g.getDataPorts().length.toString();

      let lineTypeSelector = document.getElementById("grapher-line-type-selector") as HTMLSelectElement;
      lineTypeSelector.value = g.getLineType(0);
      lineTypeSelector.onchange = () => g.setLineType(parseInt(lineTypePortSelector.value), lineTypeSelector.value);
      let lineTypePortSelector = this.createPortSelector("grapher-line-type-port-selector");
      lineTypePortSelector.onchange = () => lineTypeSelector.value = g.getLineType(parseInt(lineTypePortSelector.value));

      let symbolTypeSelector = document.getElementById("grapher-symbol-type-selector") as HTMLSelectElement;
      symbolTypeSelector.value = g.getGraphSymbol(0);
      symbolTypeSelector.onchange = () => g.setGraphSymbol(parseInt(symbolTypePortSelector.value), symbolTypeSelector.value);
      let symbolTypePortSelector = this.createPortSelector("grapher-symbol-type-port-selector");
      symbolTypePortSelector.onchange = () => symbolTypeSelector.value = g.getGraphSymbol(parseInt(symbolTypePortSelector.value));

      let symbolSizeField = document.getElementById("grapher-symbol-size-field") as HTMLInputElement;
      symbolSizeField.value = g.getGraphSymbolSize(0).toString();
      symbolSizeField.onchange = () => g.setGraphSymbolSize(parseInt(symbolSizePortSelector.value), parseInt(symbolSizeField.value));
      let symbolSizePortSelector = this.createPortSelector("grapher-symbol-size-port-selector");
      symbolSizePortSelector.onchange = () => symbolSizeField.value = g.getGraphSymbolSize(parseInt(symbolSizePortSelector.value)).toString();

      let symbolColorField = document.getElementById("grapher-symbol-color-field") as HTMLInputElement;
      symbolColorField.value = g.getGraphSymbolColor(0);
      symbolColorField.onchange = () => g.setGraphSymbolColor(parseInt(symbolColorPortSelector.value), symbolColorField.value);
      let symbolColorChooser = document.getElementById("grapher-symbol-color-chooser") as HTMLInputElement;
      Util.setColorPicker(symbolColorChooser, g.getGraphSymbolColor(0));
      let symbolColorPortSelector = this.createPortSelector("grapher-symbol-color-port-selector");
      symbolColorPortSelector.onchange = () => {
        let c = g.getGraphSymbolColor(parseInt(symbolColorPortSelector.value));
        symbolColorField.value = c;
        Util.setColorPicker(symbolColorChooser, c);
      };

      let lineColorField = document.getElementById("grapher-line-color-field") as HTMLInputElement;
      lineColorField.value = g.getLineColor(0);
      lineColorField.onchange = () => g.setLineColor(parseInt(lineColorPortSelector.value), lineColorField.value);
      let lineColorChooser = document.getElementById("grapher-line-color-chooser") as HTMLInputElement;
      Util.setColorPicker(lineColorChooser, g.getLineColor(0));
      let lineColorPortSelector = this.createPortSelector("grapher-line-color-port-selector");
      lineColorPortSelector.onchange = () => {
        let c = g.getLineColor(parseInt(lineColorPortSelector.value));
        lineColorField.value = c;
        Util.setColorPicker(lineColorChooser, c);
      };

      let noFillRadioButton = document.getElementById("grapher-no-fill-radio-button") as HTMLInputElement;
      noFillRadioButton.checked = !g.getFillOption(0);
      noFillRadioButton.onchange = () => g.setFillOption(parseInt(fillOptionPortSelector.value), !noFillRadioButton.checked);
      let fillRadioButton = document.getElementById("grapher-fill-radio-button") as HTMLInputElement;
      fillRadioButton.checked = g.getFillOption(0);
      fillRadioButton.onchange = () => g.setFillOption(parseInt(fillOptionPortSelector.value), fillRadioButton.checked);
      let fillOptionPortSelector = this.createPortSelector("grapher-fill-option-port-selector");
      fillOptionPortSelector.onchange = () => {
        let fill = g.getFillOption(parseInt(fillOptionPortSelector.value));
        if (fill) {
          fillRadioButton.checked = true;
          noFillRadioButton.checked = false;
        } else {
          fillRadioButton.checked = false;
          noFillRadioButton.checked = true;
        }
      };

      let fillColorField = document.getElementById("grapher-fill-color-field") as HTMLInputElement;
      fillColorField.value = g.getFillColor(0);
      fillColorField.onchange = () => g.setFillColor(parseInt(fillColorPortSelector.value), fillColorField.value);
      let fillColorChooser = document.getElementById("grapher-fill-color-chooser") as HTMLInputElement;
      Util.setColorPicker(fillColorChooser, g.getFillColor(0));
      let fillColorPortSelector = this.createPortSelector("grapher-fill-color-port-selector");
      fillColorPortSelector.onchange = () => {
        let c = g.getFillColor(parseInt(fillColorPortSelector.value));
        fillColorField.value = c;
        Util.setColorPicker(fillColorChooser, c);
      };

      let windowColorField = document.getElementById("grapher-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getGraphWindowColor();
      let windowColorChooser = document.getElementById("grapher-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getGraphWindowColor());
      let widthField = document.getElementById("grapher-width-field") as HTMLInputElement;
      widthField.value = g.getWidth().toString();
      let heightField = document.getElementById("grapher-height-field") as HTMLInputElement;
      heightField.value = g.getHeight().toString();

      Util.hookupColorInputs(windowColorField, windowColorChooser);
      Util.hookupColorInputs(lineColorField, lineColorChooser);
      Util.hookupColorInputs(fillColorField, fillColorChooser);
      Util.hookupColorInputs(symbolColorField, symbolColorChooser);

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
        // set minimum value
        let minimumValue = parseFloat(minimumValueField.value);
        if (isNumber(minimumValue)) {
          g.setMinimumValue(minimumValue);
        } else {
          success = false;
          message = minimumValueField.value + " is not a valid value for minimum";
        }
        // set maximum value
        let maximumValue = parseFloat(maximumValueField.value);
        if (isNumber(maximumValue)) {
          g.setMaximumValue(maximumValue);
        } else {
          success = false;
          message = maximumValueField.value + " is not a valid value for maximum";
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
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setGraphWindowColor(windowColorField.value);
          g.setAutoScale(autoScaleRadioButton.checked);
          g.setFillOption(parseInt(fillOptionPortSelector.value), fillRadioButton.checked);
          g.setFillColor(parseInt(fillColorPortSelector.value), fillColorField.value);
          g.setGraphSymbol(parseInt(symbolTypePortSelector.value), symbolTypeSelector.value);
          g.setGraphSymbolColor(parseInt(symbolColorPortSelector.value), symbolColorField.value);
          g.setLineType(parseInt(lineTypePortSelector.value), lineTypeSelector.value);
          g.setLineColor(parseInt(lineColorPortSelector.value), lineColorField.value);
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
      minimumValueField.addEventListener("keyup", enterKeyUp);
      maximumValueField.addEventListener("keyup", enterKeyUp);
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      lineColorField.addEventListener("keyup", enterKeyUp);
      fillColorField.addEventListener("keyup", enterKeyUp);
      symbolSizeField.addEventListener("keyup", enterKeyUp);
      symbolColorField.addEventListener("keyup", enterKeyUp);
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
          'Cancel': () => {
            d.dialog('close');
          }
        }
      });
    }
  }

}
