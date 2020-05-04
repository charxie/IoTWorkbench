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
                  <td style="width: 160px">Name:</td>
                  <td colspan="3"><input type="text" id="space2d-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td colspan="3"><input type="text" id="space2d-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="3"><input type="text" id="space2d-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Input Type:</td>
                  <td colspan="3">
                    <input type="radio" name="input" id="space2d-dual-input-radio-button" checked> Dual
                    <input type="radio" name="input" id="space2d-point-input-radio-button"> Point
                  </td>
                </tr>
                <tr>
                  <td>Points:</td>
                  <td colspan="3"><input type="text" id="space2d-points-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td colspan="3">
                    <input type="radio" name="scale" id="space2d-auto-scale-radio-button" checked> Auto
                    <input type="radio" name="scale" id="space2d-fixed-scale-radio-button"> Fixed
                  </td>
                </tr>
                <tr>
                  <td>Minimum X Value:</td>
                  <td colspan="3"><input type="text" id="space2d-minimum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum X Value:</td>
                  <td colspan="3"><input type="text" id="space2d-maximum-x-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Minimum Y Value:</td>
                  <td colspan="3"><input type="text" id="space2d-minimum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Y Value:</td>
                  <td colspan="3"><input type="text" id="space2d-maximum-y-value-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Type:</td>
                  <td><select id="space2d-line-type-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="space2d-line-type-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Solid" selected>Solid</option>
                      <option value="Dashed">Dashed</option>
                      <option value="Dotted">Dotted</option>
                      <option value="Dashdot">Dashdot</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><select id="space2d-line-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="space2d-line-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="space2d-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Width:</td>
                  <td><select id="space2d-line-thickness-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space2d-line-thickness-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Legend:</td>
                  <td><select id="space2d-legend-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space2d-legend-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Type:</td>
                  <td><select id="space2d-symbol-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="space2d-symbol-selector" style="width: 100%">
                      <option value="None" selected>None</option>
                      <option value="Circle">Circle</option>
                      <option value="Square">Square</option>
                      <option value="Triangle Up">Triangle Up</option>
                      <option value="Triangle Down">Triangle Down</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Dot">Dot</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Symbol Color:</td>
                  <td><select id="space2d-symbol-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="space2d-symbol-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="space2d-symbol-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Radius:</td>
                  <td><select id="space2d-symbol-radius-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space2d-symbol-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Spacing:</td>
                  <td><select id="space2d-symbol-spacing-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space2d-symbol-spacing-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Symbol Radius:</td>
                  <td><select id="space2d-end-symbol-radius-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space2d-end-symbol-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Symbol Rotation:</td>
                  <td><select id="space2d-end-symbol-rotation-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <input type="radio" name="end-symbol-rotation" id="space2d-end-symbol-no-rotation-radio-button" checked> No
                    <input type="radio" name="end-symbol-rotation" id="space2d-end-symbol-rotation-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>End Connection:</td>
                  <td><select id="space2d-end-symbol-connection-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="space2d-end-symbol-connection-selector" style="width: 100%">
                      <option value="None" selected>None</option>
                      <option value="Rod">Rod</option>
                      <option value="Line">Line</option>
                      <option value="Zigzag">Zigzag</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Aera Fill:</td>
                  <td><select id="space2d-fill-option-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <input type="radio" name="fill" id="space2d-no-fill-radio-button" checked> No
                    <input type="radio" name="fill" id="space2d-fill-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Fill Color:</td>
                  <td><select id="space2d-fill-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="space2d-fill-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="space2d-fill-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="space2d-window-color-chooser" style="width: 50px"></td>
                  <td colspan="2"><input type="text" id="space2d-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Background:</td>
                  <td><button type="button" id="space2d-window-background-file-button">Select</button></td>
                  <td><button type="button" id="space2d-window-background-remove-button">Remove</button></td>
                  <td><label id="space2d-window-background-file-name-label" style="width: 100%"></label></label></td>
                </tr>
                <tr>
                  <td>Grid Lines:</td>
                  <td colspan="3">
                    <input type="radio" name="grid-lines" id="space2d-no-grid-lines-radio-button" checked> No
                    <input type="radio" name="grid-lines" id="space2d-grid-lines-radio-button"> Yes
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="3"><input type="text" id="space2d-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="3"><input type="text" id="space2d-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private openImageFile(): void {
    let fileDialog = document.getElementById('image-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(target.files[0]); // base64 string
        reader.onload = (e) => {
          (<Space2D>this.block).setBackgroundImageSrc(reader.result.toString());
          target.value = "";
        };
        document.getElementById("space2d-window-background-file-name-label").innerHTML = target.files[0].name;
      }
    };
    fileDialog.click();
  }

  private createSetSelector(id: string): HTMLSelectElement {
    let selector = document.getElementById(id) as HTMLSelectElement;
    let space2d = <Space2D>this.block;
    if (space2d.getPointInput()) {
      let ports = space2d.getPointPorts();
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
    if (this.block instanceof Space2D) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let imageFileOpenButton = document.getElementById("space2d-window-background-file-button") as HTMLButtonElement;
      imageFileOpenButton.onclick = () => this.openImageFile();
      let imageFileRemoveButton = document.getElementById("space2d-window-background-remove-button") as HTMLButtonElement;
      imageFileRemoveButton.onclick = () => {
        g.setBackgroundImageSrc(undefined);
        document.getElementById("space2d-window-background-file-name-label").innerHTML = "No image";
      };

      // temporary storage of properties (don't store the changes to the block object or else we won't be able to cancel)
      let legends: string[] = g.getLegends();
      let lineTypes: string[] = g.getLineTypes();
      let lineColors: string[] = g.getLineColors();
      let lineThicknesses: number[] = g.getLineThicknesses();
      let fillOptions: boolean[] = g.getFillOptions();
      let fillColors: string[] = g.getFillColors();
      let dataSymbols: string[] = g.getDataSymbols();
      let dataSymbolRadii: number[] = g.getDataSymbolRadii();
      let dataSymbolColors: string[] = g.getDataSymbolColors();
      let dataSymbolSpacings: number[] = g.getDataSymbolSpacings();
      let endSymbolRadii: any[] = g.getEndSymbolRadii();
      let endSymbolRotatables: boolean[] = g.getEndSymbolRotatables();
      let endSymbolConnections: string[] = g.getEndSymbolConnections();

      let nameField = document.getElementById("space2d-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let autoScaleRadioButton = document.getElementById("space2d-auto-scale-radio-button") as HTMLInputElement;
      autoScaleRadioButton.checked = g.getAutoScale();
      let fixedScaleRadioButton = document.getElementById("space2d-fixed-scale-radio-button") as HTMLInputElement;
      fixedScaleRadioButton.checked = !g.getAutoScale();
      let minimumXValueField = document.getElementById("space2d-minimum-x-value-field") as HTMLInputElement;
      minimumXValueField.value = g.getMinimumXValue().toString();
      let maximumXValueField = document.getElementById("space2d-maximum-x-value-field") as HTMLInputElement;
      maximumXValueField.value = g.getMaximumXValue().toString();
      let minimumYValueField = document.getElementById("space2d-minimum-y-value-field") as HTMLInputElement;
      minimumYValueField.value = g.getMinimumYValue().toString();
      let maximumYValueField = document.getElementById("space2d-maximum-y-value-field") as HTMLInputElement;
      maximumYValueField.value = g.getMaximumYValue().toString();
      let xAxisLableField = document.getElementById("space2d-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("space2d-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();

      let pointsField = document.getElementById("space2d-points-field") as HTMLInputElement;
      pointsField.value = g.getNumberOfPoints().toString();
      let dualInputRadioButton = document.getElementById("space2d-dual-input-radio-button") as HTMLInputElement;
      dualInputRadioButton.checked = !g.getPointInput();
      let pointInputRadioButton = document.getElementById("space2d-point-input-radio-button") as HTMLInputElement;
      pointInputRadioButton.checked = g.getPointInput();

      let lineTypeSelector = document.getElementById("space2d-line-type-selector") as HTMLSelectElement;
      lineTypeSelector.value = lineTypes[0];
      lineTypeSelector.onchange = () => lineTypes[parseInt(lineTypeSetSelector.value)] = lineTypeSelector.value;
      let lineTypeSetSelector = this.createSetSelector("space2d-line-type-set-selector");
      lineTypeSetSelector.onchange = () => lineTypeSelector.value = lineTypes[parseInt(lineTypeSetSelector.value)];

      let lineColorField = document.getElementById("space2d-line-color-field") as HTMLInputElement;
      lineColorField.value = lineColors[0];
      let lineColorChooser = document.getElementById("space2d-line-color-chooser") as HTMLInputElement;
      lineColorField.onchange = () => lineColors[parseInt(lineColorSetSelector.value)] = lineColorField.value;
      Util.setColorPicker(lineColorChooser, lineColors[0]);
      let lineColorSetSelector = this.createSetSelector("space2d-line-color-set-selector");
      lineColorSetSelector.onchange = () => {
        let c = lineColors[parseInt(lineColorSetSelector.value)];
        lineColorField.value = c;
        Util.setColorPicker(lineColorChooser, c);
      };

      let lineThicknessField = document.getElementById("space2d-line-thickness-field") as HTMLInputElement;
      lineThicknessField.value = lineThicknesses[0].toString();
      lineThicknessField.onchange = () => lineThicknesses[parseInt(lineThicknessSetSelector.value)] = parseFloat(lineThicknessField.value);
      let lineThicknessSetSelector = this.createSetSelector("space2d-line-thickness-set-selector");
      lineThicknessSetSelector.onchange = () => lineThicknessField.value = lineThicknesses[parseInt(lineThicknessSetSelector.value)].toString();

      let noFillRadioButton = document.getElementById("space2d-no-fill-radio-button") as HTMLInputElement;
      noFillRadioButton.checked = !fillOptions[0];
      noFillRadioButton.onchange = () => fillOptions[parseInt(fillOptionSetSelector.value)] = !noFillRadioButton.checked;
      let fillRadioButton = document.getElementById("space2d-fill-radio-button") as HTMLInputElement;
      fillRadioButton.checked = fillOptions[0];
      fillRadioButton.onchange = () => fillOptions[parseInt(fillOptionSetSelector.value)] = fillRadioButton.checked;
      let fillOptionSetSelector = this.createSetSelector("space2d-fill-option-set-selector");
      fillOptionSetSelector.onchange = () => {
        let fill = fillOptions[parseInt(fillOptionSetSelector.value)];
        if (fill) {
          fillRadioButton.checked = true;
          noFillRadioButton.checked = false;
        } else {
          fillRadioButton.checked = false;
          noFillRadioButton.checked = true;
        }
      };

      let fillColorField = document.getElementById("space2d-fill-color-field") as HTMLInputElement;
      fillColorField.value = g.getFillColor(0);
      fillColorField.onchange = () => fillColors[parseInt(fillColorSetSelector.value)] = fillColorField.value;
      let fillColorChooser = document.getElementById("space2d-fill-color-chooser") as HTMLInputElement;
      Util.setColorPicker(fillColorChooser, fillColors[0]);
      let fillColorSetSelector = this.createSetSelector("space2d-fill-color-set-selector");
      fillColorSetSelector.onchange = () => {
        let c = fillColors[parseInt(fillColorSetSelector.value)];
        fillColorField.value = c;
        Util.setColorPicker(fillColorChooser, c);
      };

      let legendField = document.getElementById("space2d-legend-field") as HTMLInputElement;
      legendField.value = legends[0].toString();
      legendField.onchange = () => legends[parseInt(legendPortSelector.value)] = legendField.value;
      let legendPortSelector = this.createSetSelector("space2d-legend-port-selector");
      legendPortSelector.onchange = () => legendField.value = legends[parseInt(legendPortSelector.value)].toString();

      let symbolSelector = document.getElementById("space2d-symbol-selector") as HTMLSelectElement;
      symbolSelector.value = dataSymbols[0];
      symbolSelector.onchange = () => dataSymbols[parseInt(symbolSetSelector.value)] = symbolSelector.value;
      let symbolSetSelector = this.createSetSelector("space2d-symbol-set-selector");
      symbolSetSelector.onchange = () => symbolSelector.value = dataSymbols[parseInt(symbolSetSelector.value)];

      let symbolColorField = document.getElementById("space2d-symbol-color-field") as HTMLInputElement;
      symbolColorField.value = dataSymbolColors[0];
      symbolColorField.onchange = () => dataSymbolColors[parseInt(symbolColorSetSelector.value)] = symbolColorField.value;
      let symbolColorChooser = document.getElementById("space2d-symbol-color-chooser") as HTMLInputElement;
      Util.setColorPicker(symbolColorChooser, dataSymbolColors[0]);
      let symbolColorSetSelector = this.createSetSelector("space2d-symbol-color-set-selector");
      symbolColorSetSelector.onchange = () => {
        let c = dataSymbolColors[parseInt(symbolColorSetSelector.value)];
        symbolColorField.value = c;
        Util.setColorPicker(symbolColorChooser, c);
      };

      let symbolRadiusField = document.getElementById("space2d-symbol-radius-field") as HTMLInputElement;
      symbolRadiusField.value = dataSymbolRadii[0].toString();
      symbolRadiusField.onchange = () => dataSymbolRadii[parseInt(symbolRadiusSetSelector.value)] = parseInt(symbolRadiusField.value);
      let symbolRadiusSetSelector = this.createSetSelector("space2d-symbol-radius-set-selector");
      symbolRadiusSetSelector.onchange = () => symbolRadiusField.value = dataSymbolRadii[parseInt(symbolRadiusSetSelector.value)].toString();

      let symbolSpacingField = document.getElementById("space2d-symbol-spacing-field") as HTMLInputElement;
      symbolSpacingField.value = dataSymbolSpacings[0].toString();
      symbolSpacingField.onchange = () => dataSymbolSpacings[parseInt(symbolSpacingSetSelector.value)] = parseInt(symbolSpacingField.value);
      let symbolSpacingSetSelector = this.createSetSelector("space2d-symbol-spacing-set-selector");
      symbolSpacingSetSelector.onchange = () => symbolSpacingField.value = dataSymbolSpacings[parseInt(symbolSpacingSetSelector.value)].toString();

      let endSymbolRadiusField = document.getElementById("space2d-end-symbol-radius-field") as HTMLInputElement;
      endSymbolRadiusField.value = endSymbolRadii[0] != null ? endSymbolRadii[0].toString() : "10";
      endSymbolRadiusField.onchange = () => {
        if (isNumber(endSymbolRadiusField.value)) {
          endSymbolRadii[parseInt(endSymbolRadiusSetSelector.value)] = parseInt(endSymbolRadiusField.value);
        } else {
          endSymbolRadii[parseInt(endSymbolRadiusSetSelector.value)] = endSymbolRadiusField.value;
        }
      };
      let endSymbolRadiusSetSelector = this.createSetSelector("space2d-end-symbol-radius-set-selector");
      endSymbolRadiusSetSelector.onchange = () => endSymbolRadiusField.value = endSymbolRadii[parseInt(endSymbolRadiusSetSelector.value)].toString();

      let endSymbolNoRotationRadioButton = document.getElementById("space2d-end-symbol-no-rotation-radio-button") as HTMLInputElement;
      endSymbolNoRotationRadioButton.checked = !endSymbolRotatables[0];
      endSymbolNoRotationRadioButton.onchange = () => endSymbolRotatables[parseInt(endSymbolRotationSetSelector.value)] = !endSymbolNoRotationRadioButton.checked;
      let endSymbolRotationRadioButton = document.getElementById("space2d-end-symbol-rotation-radio-button") as HTMLInputElement;
      endSymbolRotationRadioButton.checked = endSymbolRotatables[0];
      endSymbolRotationRadioButton.onchange = () => endSymbolRotatables[parseInt(endSymbolRotationSetSelector.value)] = endSymbolRotationRadioButton.checked;
      let endSymbolRotationSetSelector = this.createSetSelector("space2d-end-symbol-rotation-set-selector");
      endSymbolRotationSetSelector.onchange = () => {
        let rotate = endSymbolRotatables[parseInt(endSymbolRotationSetSelector.value)];
        if (rotate) {
          endSymbolRotationRadioButton.checked = true;
          endSymbolNoRotationRadioButton.checked = false;
        } else {
          endSymbolRotationRadioButton.checked = false;
          endSymbolNoRotationRadioButton.checked = true;
        }
      };

      let endSymbolConnectionSelector = document.getElementById("space2d-end-symbol-connection-selector") as HTMLSelectElement;
      endSymbolConnectionSelector.value = endSymbolConnections[0];
      endSymbolConnectionSelector.onchange = () => endSymbolConnections[parseInt(endSymbolConnectionSetSelector.value)] = endSymbolConnectionSelector.value;
      let endSymbolConnectionSetSelector = this.createSetSelector("space2d-end-symbol-connection-set-selector");
      endSymbolConnectionSetSelector.onchange = () => endSymbolConnectionSelector.value = endSymbolConnections[parseInt(endSymbolConnectionSetSelector.value)];

      let windowColorField = document.getElementById("space2d-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getSpaceWindowColor();
      let windowColorChooser = document.getElementById("space2d-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getSpaceWindowColor());
      let noGridLinesRadioButton = document.getElementById("space2d-no-grid-lines-radio-button") as HTMLInputElement;
      noGridLinesRadioButton.checked = !g.getShowGridLines();
      let gridLinesRadioButton = document.getElementById("space2d-grid-lines-radio-button") as HTMLInputElement;
      gridLinesRadioButton.checked = g.getShowGridLines();
      let widthField = document.getElementById("space2d-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("space2d-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      Util.hookupColorInputs(lineColorField, lineColorChooser);
      Util.hookupColorInputs(symbolColorField, symbolColorChooser);
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
        // check line thicknesses
        for (let lineThickness of lineThicknesses) {
          if (lineThickness < 0) {
            success = false;
            if (g.getPointInput()) {
              message = "Port " + g.getPointPorts()[lineThicknesses.indexOf(lineThickness)].getUid() + " line thickness cannot be negative (" + lineThickness + ")";
            } else {
              message = "Line thickness cannot be negative (" + lineThickness + ")";
            }
            break;
          }
        }
        // check symbol radii
        for (let symbolRadius of dataSymbolRadii) {
          if (symbolRadius < 0) {
            success = false;
            if (g.getPointInput()) {
              message = "Port " + g.getPointPorts()[dataSymbolRadii.indexOf(symbolRadius)].getUid() + " symbol size cannot be negative (" + symbolRadius + ")";
            } else {
              message = "Symbol radius cannot be negative (" + symbolRadius + ")";
            }
            break;
          }
        }
        // check symbol spacings
        for (let symbolSpacing of dataSymbolSpacings) {
          if (symbolSpacing != null && symbolSpacing < 1) {
            success = false;
            if (g.getPointInput()) {
              message = "Port " + g.getPointPorts()[dataSymbolSpacings.indexOf(symbolSpacing)].getUid() + " symbol spacing cannot be less than one (" + symbolSpacing + ")";
            } else {
              message = "Symbol spacing cannot be less than one (" + symbolSpacing + ")";
            }
            break;
          }
        }
        // check end symbol radii
        for (let endSymbolRadius of endSymbolRadii) {
          if (isNumber(endSymbolRadius)) {
            if (endSymbolRadius < 0) {
              success = false;
              if (g.getPointInput()) {
                message = "Port " + g.getPointPorts()[endSymbolRadii.indexOf(endSymbolRadius)].getUid() + " end symbol size cannot be negative (" + endSymbolRadius + ")";
              } else {
                message = "End symbol radius cannot be negative (" + endSymbolRadius + ")";
              }
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
          for (let i = 0; i < lineTypes.length; i++) {
            g.setLegend(i, legends[i]);
            g.setLineType(i, lineTypes[i]);
            g.setLineColor(i, lineColors[i]);
            g.setLineThickness(i, lineThicknesses[i]);
            g.setFillColor(i, fillColors[i]);
            g.setFillOption(i, fillOptions[i]);
            g.setDataSymbol(i, dataSymbols[i]);
            g.setDataSymbolColor(i, dataSymbolColors[i]);
            g.setDataSymbolRadius(i, dataSymbolRadii[i] != null ? dataSymbolRadii[i] : 3);
            g.setDataSymbolSpacing(i, dataSymbolSpacings[i] != null ? dataSymbolSpacings[i] : 1);
            g.setEndSymbolRadius(i, endSymbolRadii[i]);
            g.setEndSymbolConnection(i, endSymbolConnections[i]);
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
      lineThicknessField.addEventListener("keyup", enterKeyUp);
      fillColorField.addEventListener("keyup", enterKeyUp);
      legendField.addEventListener("keyup", enterKeyUp);
      symbolColorField.addEventListener("keyup", enterKeyUp);
      symbolRadiusField.addEventListener("keyup", enterKeyUp);
      symbolSpacingField.addEventListener("keyup", enterKeyUp);
      endSymbolRadiusField.addEventListener("keyup", enterKeyUp);
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
