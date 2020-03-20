/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {Beeper} from "../Beeper";

export class BeeperContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "beeper-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="beeper-name-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Oscillator Type:</td>
                  <td>
                    <select id="beeper-oscillator-type-selector" style="width: 120px">
                      <option value="sine">sine</option>
                      <option value="square">square</option>
                      <option value="sawtooth">sawtooth</option>
                      <option value="triangle">triangle</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Frequency:</td>
                  <td><input type="text" id="beeper-frequency-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Volume:</td>
                  <td><input type="text" id="beeper-volume-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="beeper-width-field" style="width: 120px"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="beeper-height-field" style="width: 120px"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Beeper) {
      const beeper = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("beeper-name-field") as HTMLInputElement;
      nameField.value = beeper.getName();
      let typeSelector = document.getElementById("beeper-oscillator-type-selector") as HTMLSelectElement;
      typeSelector.value = beeper.getOscillatorType();
      let frequencyField = document.getElementById("beeper-frequency-field") as HTMLInputElement;
      frequencyField.value = beeper.getFrequency().toString();
      let volumeField = document.getElementById("beeper-volume-field") as HTMLInputElement;
      volumeField.value = beeper.getVolume().toString();
      let widthField = document.getElementById("beeper-width-field") as HTMLInputElement;
      widthField.value = Math.round(beeper.getWidth()).toString();
      let heightField = document.getElementById("beeper-height-field") as HTMLInputElement;
      heightField.value = Math.round(beeper.getHeight()).toString();
      const okFunction = () => {
        beeper.setName(nameField.value);
        beeper.setOscillatorType(typeSelector.value);
        let success = true;
        let message;
        // set frequency
        let f = parseFloat(frequencyField.value);
        if (isNumber(f)) {
          beeper.setFrequency(Math.max(0.001, f));
        } else {
          success = false;
          message = frequencyField.value + " is not a valid frequency";
        }
        // set volume
        let v = parseFloat(volumeField.value);
        if (isNumber(v)) {
          beeper.setVolume(Math.max(0.000001, v));
        } else {
          success = false;
          message = volumeField.value + " is not a valid volume";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          beeper.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          beeper.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        if (success) {
          beeper.refreshView();
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
      frequencyField.addEventListener("keyup", enterKeyUp);
      volumeField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: beeper.getUid(),
        height: 400,
        width: 320,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
