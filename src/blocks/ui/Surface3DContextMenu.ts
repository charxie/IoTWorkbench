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
                  <td>Scale:</td>
                  <td colspan="2">
                    <select id="surface3d-scale-type-selector" style="width: 100%">
                      <option value="Linear" selected>Linear</option>
                      <option value="Logarithmic">Logarithmic</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Minimum Color:</td>
                  <td><input type="color" id="surface3d-minimum-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="surface3d-minimum-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Maximum Color:</td>
                  <td><input type="color" id="surface3d-maximum-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="surface3d-maximum-color-field" style="width: 100%"></td>
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
                  <td>Background Color:</td>
                  <td><input type="color" id="surface3d-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="surface3d-window-color-field" style="width: 100%"></td>
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
      let scaleTypeSelector = document.getElementById("surface3d-scale-type-selector") as HTMLSelectElement;
      scaleTypeSelector.value = g.getScaleType();
      let minimumColorField = document.getElementById("surface3d-minimum-color-field") as HTMLInputElement;
      minimumColorField.value = g.getMinimumColor();
      let minimumColorChooser = document.getElementById("surface3d-minimum-color-chooser") as HTMLInputElement;
      Util.setColorPicker(minimumColorChooser, g.getMinimumColor());
      let maximumColorField = document.getElementById("surface3d-maximum-color-field") as HTMLInputElement;
      maximumColorField.value = g.getMaximumColor();
      let maximumColorChooser = document.getElementById("surface3d-maximum-color-chooser") as HTMLInputElement;
      Util.setColorPicker(maximumColorChooser, g.getMaximumColor());
      let xAxisLableField = document.getElementById("surface3d-x-axis-label-field") as HTMLInputElement;
      xAxisLableField.value = g.getXAxisLabel();
      let yAxisLableField = document.getElementById("surface3d-y-axis-label-field") as HTMLInputElement;
      yAxisLableField.value = g.getYAxisLabel();
      let windowColorField = document.getElementById("surface3d-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getViewWindowColor();
      let windowColorChooser = document.getElementById("surface3d-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getViewWindowColor());
      let widthField = document.getElementById("surface3d-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("surface3d-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();
      Util.hookupColorInputs(minimumColorField, minimumColorChooser);
      Util.hookupColorInputs(maximumColorField, maximumColorChooser);
      Util.hookupColorInputs(windowColorField, windowColorChooser);
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
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setScaleType(scaleTypeSelector.value);
          g.setMinimumColor(minimumColorField.value);
          g.setMaximumColor(maximumColorField.value);
          g.setXAxisLabel(xAxisLableField.value);
          g.setYAxisLabel(yAxisLableField.value);
          g.setViewWindowColor(windowColorField.value);
          g.locateOverlay();
          g.rescale();
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
      minimumColorField.addEventListener("keyup", enterKeyUp);
      maximumColorField.addEventListener("keyup", enterKeyUp);
      xAxisLableField.addEventListener("keyup", enterKeyUp);
      yAxisLableField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
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