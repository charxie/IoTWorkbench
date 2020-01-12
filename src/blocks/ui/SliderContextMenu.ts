/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Slider} from "../Slider";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";

export class SliderContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "slider-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-copy-button"><i class="fas fa-copy"></i><span class="menu-text">Copy</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="slider-name-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Snap:</td>
                  <td><input type="radio" name="snap" id="slider-snap-to-tick-radio-button"> Tick
                      <input type="radio" name="snap" id="slider-no-snap-radio-button" checked> None</td>
                </tr>
                <tr>
                  <td>Minimum:</td>
                  <td><input type="text" id="slider-minimum-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Maximum:</td>
                  <td><input type="text" id="slider-maximum-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Steps:</td>
                  <td><input type="text" id="slider-steps-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Current Value:</td>
                  <td><input type="text" id="slider-value-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Value Precision:</td>
                  <td><input type="text" id="slider-value-precision-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="slider-width-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="slider-height-field" style="width: 130px"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Slider) {
      const slider = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("slider-name-field") as HTMLInputElement;
      nameInputElement.value = slider.getName();
      let snapRadioButton = document.getElementById("slider-snap-to-tick-radio-button") as HTMLInputElement;
      snapRadioButton.checked = slider.getSnapToTick();
      let noSnapRadioButton = document.getElementById("slider-no-snap-radio-button") as HTMLInputElement;
      noSnapRadioButton.checked = !slider.getSnapToTick();
      let minimumInputElement = document.getElementById("slider-minimum-field") as HTMLInputElement;
      minimumInputElement.value = slider.getMinimum().toString();
      let maximumInputElement = document.getElementById("slider-maximum-field") as HTMLInputElement;
      maximumInputElement.value = slider.getMaximum().toString();
      let stepsInputElement = document.getElementById("slider-steps-field") as HTMLInputElement;
      stepsInputElement.value = slider.getSteps().toString();
      let valueInputElement = document.getElementById("slider-value-field") as HTMLInputElement;
      valueInputElement.value = slider.getValue().toFixed(3);
      let precisionInputElement = document.getElementById("slider-value-precision-field") as HTMLInputElement;
      precisionInputElement.value = slider.getValuePrecision() != undefined ? slider.getValuePrecision().toString() : "2";
      let widthInputElement = document.getElementById("slider-width-field") as HTMLInputElement;
      widthInputElement.value = slider.getWidth().toString();
      let heightInputElement = document.getElementById("slider-height-field") as HTMLInputElement;
      heightInputElement.value = slider.getHeight().toString();
      const okFunction = function () {
        slider.setName(nameInputElement.value);
        slider.setSnapToTick(snapRadioButton.checked);
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          slider.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          slider.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // set minimum
        let minimum = parseFloat(minimumInputElement.value);
        if (isNumber(minimum)) {
          slider.setMinimum(minimum);
        } else {
          success = false;
          message = minimumInputElement.value + " is not a valid minimum.";
        }
        // set maximum
        let maximum = parseFloat(maximumInputElement.value);
        if (isNumber(maximum)) {
          slider.setMaximum(maximum);
        } else {
          success = false;
          message = maximumInputElement.value + " is not a valid maximum.";
        }
        // set steps
        let steps = parseFloat(stepsInputElement.value);
        if (isNumber(steps)) {
          slider.setSteps(steps);
        } else {
          success = false;
          message = stepsInputElement.value + " is not a valid number for steps.";
        }
        // set current value
        let value = parseFloat(valueInputElement.value);
        if (isNumber(value)) {
          if (value > maximum) {
            value = maximum
          } else if (value < minimum) {
            value = minimum;
          }
          slider.setValue(value);
        } else {
          success = false;
          message = valueInputElement.value + " is not a valid number for value.";
        }
        // set value precision
        let valuePrecision = parseInt(precisionInputElement.value);
        if (isNumber(valuePrecision)) {
          slider.setValuePrecision(Math.max(1, valuePrecision));
        } else {
          success = false;
          message = valueInputElement.value + " is not a valid number for value precision.";
        }
        // finish
        if (success) {
          slider.refreshView();
          flowchart.storeBlockStates();
          flowchart.draw();
          d.dialog('close');
        } else {
          Util.showErrorMessage(message);
        }
      };
      const enterKeyUp = function (e) {
        if (e.key == "Enter") {
          okFunction();
        }
      };
      nameInputElement.addEventListener("keyup", enterKeyUp);
      minimumInputElement.addEventListener("keyup", enterKeyUp);
      maximumInputElement.addEventListener("keyup", enterKeyUp);
      stepsInputElement.addEventListener("keyup", enterKeyUp);
      valueInputElement.addEventListener("keyup", enterKeyUp);
      precisionInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: slider.getUid(),
        height: 500,
        width: 360,
        buttons: {
          'OK': okFunction,
          'Cancel': function () {
            d.dialog('close');
          }
        }
      });
    }
  }

}
