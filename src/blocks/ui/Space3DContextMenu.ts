/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {Space3D} from "../Space3D";
import {PngSaver} from "../../tools/PngSaver";

export class Space3DContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "space3d-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 180px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-erase-button"><i class="fas fa-eraser"></i><span class="menu-text">Erase</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-reset-view-angle-button"><i class="fas fa-compass"></i><span class="menu-text">Reset View Angle</span></button>
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
    let resetViewAngleButton = document.getElementById(this.id + "-reset-view-angle-button");
    resetViewAngleButton.addEventListener("click", this.resetViewAngleButtonClick.bind(this), false);
    let saveImageButton = document.getElementById(this.id + "-save-image-button");
    saveImageButton.addEventListener("click", this.saveImageButtonClick.bind(this), false);
  }

  private resetViewAngleButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    (<Space3D>this.block).resetViewAngle();
  }

  private eraseButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    (<Space3D>this.block).erase();
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<Space3D>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td style="width: 160px">Name:</td>
                  <td colspan="3"><input type="text" id="space3d-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>X-Axis Label:</td>
                  <td colspan="3"><input type="text" id="space3d-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="3"><input type="text" id="space3d-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Z-Axis Label:</td>
                  <td colspan="3"><input type="text" id="space3d-z-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Input Type:</td>
                  <td colspan="3">
                    <input type="radio" name="input" id="space3d-trio-input-radio-button" checked> Trio
                    <input type="radio" name="input" id="space3d-point-input-radio-button"> Point
                  </td>
                </tr>
                <tr>
                  <td>Points:</td>
                  <td colspan="3"><input type="text" id="space3d-points-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Type:</td>
                  <td><select id="space3d-line-type-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="space3d-line-type-selector" style="width: 100%">
                      <option value="None">None</option>
                      <option value="Solid" selected>Solid</option>
                      <option value="Dashed">Dashed</option>
                      <option value="Dotted">Dotted</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Line Color:</td>
                  <td><select id="space3d-line-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="space3d-line-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="space3d-line-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Line Widths:</td>
                  <td><select id="space3d-line-width-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space3d-line-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Legend:</td>
                  <td><select id="space3d-legend-port-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space3d-legend-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Type:</td>
                  <td><select id="space3d-symbol-set-selector" style="width: 65px"></select></td>
                  <td colspan="2">
                    <select id="space3d-symbol-selector" style="width: 100%">
                      <option value="None" selected>None</option>
                      <option value="Sphere">Sphere</option>
                      <option value="Cube">Cube</option>
                      <option value="Pyramid Up">Pyramid Up</option>
                      <option value="Pyramid Down">Pyramid Down</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Symbol Color:</td>
                  <td><select id="space3d-symbol-color-set-selector" style="width: 65px"></select></td>
                  <td><input type="color" id="space3d-symbol-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="space3d-symbol-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Radius:</td>
                  <td><select id="space3d-symbol-radius-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space3d-symbol-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Symbol Spacing:</td>
                  <td><select id="space3d-symbol-spacing-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space3d-symbol-spacing-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Symbol Radius:</td>
                  <td><select id="space3d-end-symbol-radius-set-selector" style="width: 65px"></select></td>
                  <td colspan="2"><input type="text" id="space3d-end-symbol-radius-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Connection:</td>
                  <td colspan="3">
                    <select id="space3d-end-symbols-connection-selector" style="width: 100%">
                      <option value="None" selected>None</option>
                      <option value="Line">Line</option>
                      <option value="Zigzag">Zigzag</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="space3d-window-color-chooser" style="width: 50px"></td>
                  <td colspan="2"><input type="text" id="space3d-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="3"><input type="text" id="space3d-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="3"><input type="text" id="space3d-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private createSetSelector(id: string): HTMLSelectElement {
    let selector = document.getElementById(id) as HTMLSelectElement;
    let space3d = <Space3D>this.block;
    if (space3d.getPointInput()) {
      let ports = space3d.getPointPorts();
      for (let p of ports) {
        let option = document.createElement("option");
        option.value = ports.indexOf(p).toString();
        option.text = "Port " + p.getUid();
        selector.appendChild(option);
      }
    } else {
      let option = document.createElement("option");
      option.value = "0";
      option.text = "Trio";
      selector.appendChild(option);
    }
    return selector;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Space3D) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());

      // temporary storage of properties (don't store the changes to the block object or else we won't be able to cancel)
      let legends: string[] = g.getLegends();
      let lineTypes: string[] = g.getLineTypes();
      let lineColors: string[] = g.getLineColors();
      let lineWidths: number[] = g.getLineWidths();
      let dataSymbols: string[] = g.getDataSymbols();
      let dataSymbolRadii: number[] = g.getDataSymbolRadii();
      let dataSymbolColors: string[] = g.getDataSymbolColors();
      let dataSymbolSpacings: number[] = g.getDataSymbolSpacings();
      let endSymbolRadii: any[] = g.getEndSymbolRadii();

      let nameField = document.getElementById("space3d-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let xAxisLableField = document.getElementById("space3d-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("space3d-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();
      let zAxisLableField = document.getElementById("space3d-z-axis-label-field") as HTMLInputElement;
      zAxisLableField.value = g.getZAxisLabel();

      let pointsField = document.getElementById("space3d-points-field") as HTMLInputElement;
      pointsField.value = g.getNumberOfPoints().toString();
      let trioInputRadioButton = document.getElementById("space3d-trio-input-radio-button") as HTMLInputElement;
      trioInputRadioButton.checked = !g.getPointInput();
      let pointInputRadioButton = document.getElementById("space3d-point-input-radio-button") as HTMLInputElement;
      pointInputRadioButton.checked = g.getPointInput();

      let lineTypeSelector = document.getElementById("space3d-line-type-selector") as HTMLSelectElement;
      lineTypeSelector.value = lineTypes[0];
      lineTypeSelector.onchange = () => lineTypes[parseInt(lineTypeSetSelector.value)] = lineTypeSelector.value;
      let lineTypeSetSelector = this.createSetSelector("space3d-line-type-set-selector");
      lineTypeSetSelector.onchange = () => lineTypeSelector.value = lineTypes[parseInt(lineTypeSetSelector.value)];

      let lineColorField = document.getElementById("space3d-line-color-field") as HTMLInputElement;
      lineColorField.value = lineColors[0];
      let lineColorChooser = document.getElementById("space3d-line-color-chooser") as HTMLInputElement;
      lineColorField.onchange = () => lineColors[parseInt(lineColorSetSelector.value)] = lineColorField.value;
      Util.setColorPicker(lineColorChooser, lineColors[0]);
      let lineColorSetSelector = this.createSetSelector("space3d-line-color-set-selector");
      lineColorSetSelector.onchange = () => {
        let c = lineColors[parseInt(lineColorSetSelector.value)];
        lineColorField.value = c;
        Util.setColorPicker(lineColorChooser, c);
      };

      let lineWidthField = document.getElementById("space3d-line-width-field") as HTMLInputElement;
      lineWidthField.value = lineWidths[0].toString();
      lineWidthField.onchange = () => lineWidths[parseInt(lineWidthSetSelector.value)] = parseFloat(lineWidthField.value);
      let lineWidthSetSelector = this.createSetSelector("space3d-line-width-set-selector");
      lineWidthSetSelector.onchange = () => lineWidthField.value = lineWidths[parseInt(lineWidthSetSelector.value)].toString();

      let legendField = document.getElementById("space3d-legend-field") as HTMLInputElement;
      legendField.value = legends[0].toString();
      legendField.onchange = () => legends[parseInt(legendPortSelector.value)] = legendField.value;
      let legendPortSelector = this.createSetSelector("space3d-legend-port-selector");
      legendPortSelector.onchange = () => legendField.value = legends[parseInt(legendPortSelector.value)].toString();

      let symbolSelector = document.getElementById("space3d-symbol-selector") as HTMLSelectElement;
      symbolSelector.value = dataSymbols[0];
      symbolSelector.onchange = () => dataSymbols[parseInt(symbolSetSelector.value)] = symbolSelector.value;
      let symbolSetSelector = this.createSetSelector("space3d-symbol-set-selector");
      symbolSetSelector.onchange = () => symbolSelector.value = dataSymbols[parseInt(symbolSetSelector.value)];

      let symbolColorField = document.getElementById("space3d-symbol-color-field") as HTMLInputElement;
      symbolColorField.value = dataSymbolColors[0];
      symbolColorField.onchange = () => dataSymbolColors[parseInt(symbolColorSetSelector.value)] = symbolColorField.value;
      let symbolColorChooser = document.getElementById("space3d-symbol-color-chooser") as HTMLInputElement;
      Util.setColorPicker(symbolColorChooser, dataSymbolColors[0]);
      let symbolColorSetSelector = this.createSetSelector("space3d-symbol-color-set-selector");
      symbolColorSetSelector.onchange = () => {
        let c = dataSymbolColors[parseInt(symbolColorSetSelector.value)];
        symbolColorField.value = c;
        Util.setColorPicker(symbolColorChooser, c);
      };

      let symbolRadiusField = document.getElementById("space3d-symbol-radius-field") as HTMLInputElement;
      symbolRadiusField.value = dataSymbolRadii[0].toString();
      symbolRadiusField.onchange = () => dataSymbolRadii[parseInt(symbolRadiusSetSelector.value)] = parseFloat(symbolRadiusField.value);
      let symbolRadiusSetSelector = this.createSetSelector("space3d-symbol-radius-set-selector");
      symbolRadiusSetSelector.onchange = () => symbolRadiusField.value = dataSymbolRadii[parseInt(symbolRadiusSetSelector.value)].toString();

      let symbolSpacingField = document.getElementById("space3d-symbol-spacing-field") as HTMLInputElement;
      symbolSpacingField.value = dataSymbolSpacings[0].toString();
      symbolSpacingField.onchange = () => dataSymbolSpacings[parseInt(symbolSpacingSetSelector.value)] = parseFloat(symbolSpacingField.value);
      let symbolSpacingSetSelector = this.createSetSelector("space3d-symbol-spacing-set-selector");
      symbolSpacingSetSelector.onchange = () => symbolSpacingField.value = dataSymbolSpacings[parseInt(symbolSpacingSetSelector.value)].toString();

      let endSymbolRadiusField = document.getElementById("space3d-end-symbol-radius-field") as HTMLInputElement;
      endSymbolRadiusField.value = endSymbolRadii[0] != null ? endSymbolRadii[0].toString() : "10";
      endSymbolRadiusField.onchange = () => {
        if (isNumber(endSymbolRadiusField.value)) {
          endSymbolRadii[parseInt(endSymbolRadiusSetSelector.value)] = parseFloat(endSymbolRadiusField.value);
        } else {
          endSymbolRadii[parseInt(endSymbolRadiusSetSelector.value)] = endSymbolRadiusField.value;
        }
      };
      let endSymbolRadiusSetSelector = this.createSetSelector("space3d-end-symbol-radius-set-selector");
      endSymbolRadiusSetSelector.onchange = () => endSymbolRadiusField.value = endSymbolRadii[parseInt(endSymbolRadiusSetSelector.value)].toString();

      let endSymbolsConnectionSelector = document.getElementById("space3d-end-symbols-connection-selector") as HTMLSelectElement;
      endSymbolsConnectionSelector.value = g.getEndSymbolsConnection();

      let windowColorField = document.getElementById("space3d-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getSpaceWindowColor();
      let windowColorChooser = document.getElementById("space3d-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getSpaceWindowColor());
      let widthField = document.getElementById("space3d-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("space3d-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      Util.hookupColorInputs(lineColorField, lineColorChooser);
      Util.hookupColorInputs(symbolColorField, symbolColorChooser);
      Util.hookupColorInputs(windowColorField, windowColorChooser);

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
          g.setPointInput(pointInputRadioButton.checked);
          g.setEndSymbolsConnection(endSymbolsConnectionSelector.value);
          for (let i = 0; i < lineTypes.length; i++) {
            g.setLegend(i, legends[i]);
            g.setLineType(i, lineTypes[i]);
            g.setLineColor(i, lineColors[i]);
            g.setLineWidth(i, lineWidths[i]);
            g.setDataSymbol(i, dataSymbols[i]);
            g.setDataSymbolColor(i, dataSymbolColors[i]);
            g.setDataSymbolRadius(i, dataSymbolRadii[i] != null ? dataSymbolRadii[i] : 0.5);
            g.setDataSymbolSpacing(i, dataSymbolSpacings[i] != null ? dataSymbolSpacings[i] : 10);
            g.setEndSymbolRadius(i, endSymbolRadii[i]);
          }
          g.locateOverlay();
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
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      lineColorField.addEventListener("keyup", enterKeyUp);
      lineWidthField.addEventListener("keyup", enterKeyUp);
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
