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

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="slider-name-field" style="width: 130px"></td>
                </tr>
                <tr>
                  <td>Source:</td>
                  <td><input type="radio" name="source" id="slider-source-radio-button" checked> Yes
                      <input type="radio" name="source" id="slider-not-source-radio-button"> No</td>
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

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Slider) {
      const slider = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("slider-name-field") as HTMLInputElement;
      nameField.value = slider.getName();
      let sourceRadioButton = document.getElementById("slider-source-radio-button") as HTMLInputElement;
      sourceRadioButton.checked = slider.isSource();
      let notSourceRadioButton = document.getElementById("slider-not-source-radio-button") as HTMLInputElement;
      notSourceRadioButton.checked = !slider.isSource();
      let snapRadioButton = document.getElementById("slider-snap-to-tick-radio-button") as HTMLInputElement;
      snapRadioButton.checked = slider.getSnapToTick();
      let noSnapRadioButton = document.getElementById("slider-no-snap-radio-button") as HTMLInputElement;
      noSnapRadioButton.checked = !slider.getSnapToTick();
      let minimumField = document.getElementById("slider-minimum-field") as HTMLInputElement;
      minimumField.value = slider.getMinimum().toString();
      let maximumField = document.getElementById("slider-maximum-field") as HTMLInputElement;
      maximumField.value = slider.getMaximum().toString();
      let stepsField = document.getElementById("slider-steps-field") as HTMLInputElement;
      stepsField.value = slider.getSteps().toString();
      let valueField = document.getElementById("slider-value-field") as HTMLInputElement;
      valueField.value = slider.getValue().toFixed(3);
      let precisionField = document.getElementById("slider-value-precision-field") as HTMLInputElement;
      precisionField.value = slider.getValuePrecision() != undefined ? slider.getValuePrecision().toString() : "2";
      let widthField = document.getElementById("slider-width-field") as HTMLInputElement;
      widthField.value = Math.round(slider.getWidth()).toString();
      let heightField = document.getElementById("slider-height-field") as HTMLInputElement;
      heightField.value = Math.round(slider.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          slider.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          slider.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // set minimum
        let minimum = parseFloat(minimumField.value);
        if (isNumber(minimum)) {
          slider.setMinimum(minimum);
        } else {
          success = false;
          message = minimumField.value + " is not a valid minimum";
        }
        // set maximum
        let maximum = parseFloat(maximumField.value);
        if (isNumber(maximum)) {
          if (maximum > minimum) {
            slider.setMaximum(maximum);
          } else {
            success = false;
            message = "The set maximum " + maximumField.value + " is not greater than the minimum " + minimum;
          }
        } else {
          success = false;
          message = maximumField.value + " is not a valid maximum";
        }
        // set steps
        let steps = parseFloat(stepsField.value);
        if (isNumber(steps)) {
          slider.setSteps(Math.max(1, steps));
        } else {
          success = false;
          message = stepsField.value + " is not a valid number for steps";
        }
        // set current value
        let value = parseFloat(valueField.value);
        if (isNumber(value)) {
          if (value > maximum) {
            value = maximum
          } else if (value < minimum) {
            value = minimum;
          }
          slider.setValue(value);
        } else {
          success = false;
          message = valueField.value + " is not a valid number for value";
        }
        // set value precision
        let valuePrecision = parseInt(precisionField.value);
        if (isNumber(valuePrecision)) {
          slider.setValuePrecision(Math.max(1, valuePrecision));
        } else {
          success = false;
          message = valueField.value + " is not a valid number for value precision";
        }
        // finish
        if (success) {
          slider.setName(nameField.value);
          slider.setSnapToTick(snapRadioButton.checked);
          slider.setSource(sourceRadioButton.checked);
          slider.refreshView();
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
      minimumField.addEventListener("keyup", enterKeyUp);
      maximumField.addEventListener("keyup", enterKeyUp);
      stepsField.addEventListener("keyup", enterKeyUp);
      valueField.addEventListener("keyup", enterKeyUp);
      precisionField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: slider.getUid(),
        height: 550,
        width: 360,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
