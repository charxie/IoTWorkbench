/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {PieChart} from "../PieChart";

export class PieChartContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "pie-chart-block-context-menu";
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
    PngSaver.saveAs((<PieChart>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="pie-chart-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Labels:</td>
                  <td colspan="2"><input type="text" id="pie-chart-labels-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Inner Radius:</td>
                  <td colspan="2"><input type="text" id="pie-chart-inner-radius-field" style="width: 100%"></td>
                </tr>
               <tr>
                  <td>Central Label:</td>
                  <td colspan="2"><input type="text" id="pie-chart-donut-label-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Fraction Digits:</td>
                  <td colspan="2"><input type="text" id="pie-chart-fraction-digits-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Start Color:</td>
                  <td><input type="color" id="pie-chart-start-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="pie-chart-start-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Mid Color:</td>
                  <td><input type="color" id="pie-chart-mid-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="pie-chart-mid-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>End Color:</td>
                  <td><input type="color" id="pie-chart-end-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="pie-chart-end-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="pie-chart-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="pie-chart-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="pie-chart-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="pie-chart-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof PieChart) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());

      let nameField = document.getElementById("pie-chart-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let donutLabelField = document.getElementById("pie-chart-donut-label-field") as HTMLInputElement;
      donutLabelField.value = g.getDonutLabel();
      let innerRadiusField = document.getElementById("pie-chart-inner-radius-field") as HTMLInputElement;
      innerRadiusField.value = g.getInnerRadius().toString();
      let labelsField = document.getElementById("pie-chart-labels-field") as HTMLInputElement;
      labelsField.value = g.getLabels() !== undefined ? JSON.stringify(g.getLabels()) : "";
      let fractionDigitsField = document.getElementById("pie-chart-fraction-digits-field") as HTMLInputElement;
      fractionDigitsField.value = g.getFractionDigits().toString();

      let startColorField = document.getElementById("pie-chart-start-color-field") as HTMLInputElement;
      startColorField.value = g.getStartColor();
      let startColorChooser = document.getElementById("pie-chart-start-color-chooser") as HTMLInputElement;
      Util.setColorPicker(startColorChooser, g.getStartColor());
      Util.hookupColorInputs(startColorField, startColorChooser);

      let midColorField = document.getElementById("pie-chart-mid-color-field") as HTMLInputElement;
      midColorField.value = g.getMidColor();
      let midColorChooser = document.getElementById("pie-chart-mid-color-chooser") as HTMLInputElement;
      Util.setColorPicker(midColorChooser, g.getMidColor());
      Util.hookupColorInputs(midColorField, midColorChooser);

      let endColorField = document.getElementById("pie-chart-end-color-field") as HTMLInputElement;
      endColorField.value = g.getEndColor();
      let endColorChooser = document.getElementById("pie-chart-end-color-chooser") as HTMLInputElement;
      Util.setColorPicker(endColorChooser, g.getEndColor());
      Util.hookupColorInputs(endColorField, endColorChooser);

      let windowColorField = document.getElementById("pie-chart-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getViewWindowColor();
      let windowColorChooser = document.getElementById("pie-chart-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getViewWindowColor());
      Util.hookupColorInputs(windowColorField, windowColorChooser);

      let widthField = document.getElementById("pie-chart-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("pie-chart-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      const okFunction = () => {
        let success = true;
        let message;
        // set labels
        if (labelsField.value.trim() !== "") {
          if (JSON.stringify(g.getLabels()) != labelsField.value) {
            try {
              g.setLabels(JSON.parse(labelsField.value));
            } catch (err) {
              console.log(err.stack);
              success = false;
              message = labelsField.value + " is not a valid array";
            }
          }
        }
        // set fraction digits
        let fractionDigits = parseInt(fractionDigitsField.value);
        if (isNumber(fractionDigits)) {
          g.setFractionDigits(Math.max(0, fractionDigits));
        } else {
          success = false;
          message = fractionDigitsField.value + " is not valid for fraction digits";
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
        // set inner radius
        let innerRadius = parseFloat(innerRadiusField.value);
        if (isNumber(innerRadius)) {
          g.setInnerRadius(Math.max(0, innerRadius));
        } else {
          success = false;
          message = innerRadiusField.value + " is not a valid inner radius";
        }
        // finish
        if (success) {
          g.setName(nameField.value);
          g.setDonutLabel(donutLabelField.value);
          g.setStartColor(startColorField.value);
          g.setMidColor(midColorField.value);
          g.setEndColor(endColorField.value);
          g.setViewWindowColor(windowColorField.value);
          g.updateColorScale();
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
      innerRadiusField.addEventListener("keyup", enterKeyUp);
      donutLabelField.addEventListener("keyup", enterKeyUp);
      labelsField.addEventListener("keyup", enterKeyUp);
      fractionDigitsField.addEventListener("keyup", enterKeyUp);
      startColorField.addEventListener("keyup", enterKeyUp);
      midColorField.addEventListener("keyup", enterKeyUp);
      endColorField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 400,
        width: 450,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
