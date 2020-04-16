/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {Surface3D} from "../Surface3D";

export class Surface3DContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "surface3d-context-menu";
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
    let resetViewAngleButton = document.getElementById(this.id + "-reset-view-angle-button");
    resetViewAngleButton.addEventListener("click", this.resetViewAngleButtonClick.bind(this), false);
    let saveImageButton = document.getElementById(this.id + "-save-image-button");
    saveImageButton.addEventListener("click", this.saveImageButtonClick.bind(this), false);
  }

  private resetViewAngleButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    (<Surface3D>this.block).resetViewAngle();
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<Surface3D>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="surface3d-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Input Type:</td>
                  <td colspan="2">
                    <input type="radio" name="input-type" id="surface3d-z-input-radio-button" checked> Only z
                    <input type="radio" name="input-type" id="surface3d-xyz-input-radio-button"> xyz
                  </td>
                </tr>
                <tr>
                  <td>Scale:</td>
                  <td colspan="2">
                    <select id="surface3d-scale-type-selector" style="width: 100%">
                      <option value="Linear" selected>Linear</option>
                      <option value="Logarithmic">Logarithmic</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Color Scheme:</td>
                  <td colspan="2">
                    <select id="surface3d-color-scheme-selector" style="width: 100%">
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
                  <td>X-Axis Label:</td>
                  <td colspan="2"><input type="text" id="surface3d-x-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Y-Axis Label:</td>
                  <td colspan="2"><input type="text" id="surface3d-y-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Z-Axis Label:</td>
                  <td colspan="2"><input type="text" id="surface3d-z-axis-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Box Size:</td>
                  <td colspan="2"><input type="text" id="surface3d-box-size-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Background Color:</td>
                  <td><input type="color" id="surface3d-background-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="surface3d-background-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="surface3d-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="surface3d-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Surface3D) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("surface3d-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let zInputRadioButton = document.getElementById("surface3d-z-input-radio-button") as HTMLInputElement;
      zInputRadioButton.checked = !g.getTripleArrayInput();
      let xyzInputRadioButton = document.getElementById("surface3d-xyz-input-radio-button") as HTMLInputElement;
      xyzInputRadioButton.checked = g.getTripleArrayInput();
      let scaleTypeSelector = document.getElementById("surface3d-scale-type-selector") as HTMLSelectElement;
      scaleTypeSelector.value = g.getScaleType();
      let colorSchemeSelector = document.getElementById("surface3d-color-scheme-selector") as HTMLSelectElement;
      colorSchemeSelector.value = g.getColorScheme();
      let boxSizeField = document.getElementById("surface3d-box-size-field") as HTMLInputElement;
      boxSizeField.value = JSON.stringify([g.getBoxSizeX(), g.getBoxSizeY(), g.getBoxSizeZ()]);
      let xAxisLableField = document.getElementById("surface3d-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("surface3d-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();
      let zAxisLableField = document.getElementById("surface3d-z-axis-label-field") as HTMLInputElement;
      zAxisLableField.value = g.getZAxisLabel();
      let backgroundColorField = document.getElementById("surface3d-background-color-field") as HTMLInputElement;
      backgroundColorField.value = g.getBackgroundColor();
      let backgroundColorChooser = document.getElementById("surface3d-background-color-chooser") as HTMLInputElement;
      Util.setColorPicker(backgroundColorChooser, g.getBackgroundColor());
      let widthField = document.getElementById("surface3d-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("surface3d-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();
      Util.hookupColorInputs(backgroundColorField, backgroundColorChooser);
      const okFunction = () => {
        let success = true;
        let message;
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
        // set box
        let boxSizes;
        try {
          boxSizes = JSON.parse(boxSizeField.value);
        } catch (err) {
          console.log(err.stack);
          success = false;
          message = boxSizeField.value + " is not a valid array";
        }
        if (Array.isArray(boxSizes)) {
          if (boxSizes.length !== 3) {
            success = false;
            message = boxSizeField.value + " must have three elements";
          }
        } else {
          success = false;
          message = boxSizeField.value + " is not an array";
        }
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setTripleArrayInput(xyzInputRadioButton.checked);
          g.setScaleType(scaleTypeSelector.value);
          g.setColorScheme(colorSchemeSelector.value)
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setZAxisLabel(zAxisLableField.value);
          g.setBoxSizes(Math.max(0, boxSizes[0]), Math.max(0, boxSizes[1]), Math.max(0, boxSizes[2]));
          g.setBackgroundColor(backgroundColorField.value);
          g.locateOverlay();
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
      boxSizeField.addEventListener("keyup", enterKeyUp);
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      zAxisLableField.addEventListener("keyup", enterKeyUp);
      backgroundColorField.addEventListener("keyup", enterKeyUp);
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
