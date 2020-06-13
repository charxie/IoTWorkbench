/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {QuantumDynamics1DBlock} from "../QuantumDynamics1DBlock";

export class QuantumDynamics1DBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "quantum-dynamics-1d-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-name-field" style="width: 100%"></td>
                </tr>
               <tr>
                  <td>Method:</td>
                  <td colspan="2">
                    <select id="quantum-dynamics-1d-block-method-selector" style="width: 100%">
                      <option value="Cayley" selected>Cayley</option>
                      <option value="Runge-Kutta">Runge-Kutta</option>
                    </select>
                  </td>
               </tr>
                <tr>
                  <td>Time Step:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-time-step-field" style="width: 100%"></td>
                </tr>
               <tr>
                  <td>Potential:</td>
                  <td colspan="2">
                    <select id="quantum-dynamics-1d-block-potential-selector" style="width: 100%">
                      <option value="Custom" selected>Custom</option>
                      <option value="Square Well">Square Well</option>
                      <option value="Coulomb Well">Coulomb Well</option>
                      <option value="Morse Well">Morse Well</option>
                      <option value="Harmonic Oscillator">Harmonic Oscillator</option>
                      <option value="Anharmonic Oscillator">Anharmonic Oscillator</option>
                      <option value="Diatomic Molecule">Diatomic Molecule</option>
                      <option value="Crystal Lattice">Crystal Lattice</option>
                      <option value="Crystal Lattice in a Field">Crystal Lattice in a Field</option>
                      <option value="Crystal Lattice with a Vacancy">Crystal Lattice with a Vacancy</option>
                      <option value="Crystal Lattice with an Interstitial">Crystal Lattice with an Interstitial</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Number of Points:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-points-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Initial State:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-initial-state-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Initial Wavepacket Width:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-initial-wavepacket-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Initial Wavepacket Position:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-initial-wavepacket-position-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Initial Momentum:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-initial-momentum-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Wavepacket Color:</td>
                  <td><input type="color" id="quantum-dynamics-1d-block-wavepacket-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="quantum-dynamics-1d-block-wavepacket-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="quantum-dynamics-1d-block-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="quantum-dynamics-1d-block-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="quantum-dynamics-1d-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof QuantumDynamics1DBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("quantum-dynamics-1d-block-name-field") as HTMLInputElement;
      nameField.value = block.getName();
      let methodSelector = document.getElementById("quantum-dynamics-1d-block-method-selector") as HTMLSelectElement;
      methodSelector.value = this.block.getMethod();
      let timeStepField = document.getElementById("quantum-dynamics-1d-block-time-step-field") as HTMLInputElement;
      timeStepField.value = block.getTimeStep().toString();
      let potentialSelector = document.getElementById("quantum-dynamics-1d-block-potential-selector") as HTMLSelectElement;
      potentialSelector.value = this.block.getPotentialName();
      let pointsField = document.getElementById("quantum-dynamics-1d-block-points-field") as HTMLInputElement;
      pointsField.value = Math.round(block.getNPoints()).toString();
      let initialStateField = document.getElementById("quantum-dynamics-1d-block-initial-state-field") as HTMLInputElement;
      initialStateField.value = Math.round(block.getInitialState()).toString();
      let initialWavepacketWidthField = document.getElementById("quantum-dynamics-1d-block-initial-wavepacket-width-field") as HTMLInputElement;
      initialWavepacketWidthField.value = block.getInitialWavepacketWidth().toString();
      let initialWavepacketPositionField = document.getElementById("quantum-dynamics-1d-block-initial-wavepacket-position-field") as HTMLInputElement;
      initialWavepacketPositionField.value = block.getInitialWavepacketPosition().toString();
      let initialMomentumField = document.getElementById("quantum-dynamics-1d-block-initial-momentum-field") as HTMLInputElement;
      initialMomentumField.value = block.getInitialMomentum().toString();

      let wavepacketColorField = document.getElementById("quantum-dynamics-1d-block-wavepacket-color-field") as HTMLInputElement;
      wavepacketColorField.value = block.getWavepacketColor();
      let wavepacketColorChooser = document.getElementById("quantum-dynamics-1d-block-wavepacket-color-chooser") as HTMLInputElement;
      Util.setColorPicker(wavepacketColorChooser, block.getWavepacketColor());
      Util.hookupColorInputs(wavepacketColorField, wavepacketColorChooser);

      let windowColorField = document.getElementById("quantum-dynamics-1d-block-window-color-field") as HTMLInputElement;
      windowColorField.value = block.getViewWindowColor();
      let windowColorChooser = document.getElementById("quantum-dynamics-1d-block-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, block.getViewWindowColor());
      Util.hookupColorInputs(windowColorField, windowColorChooser);

      let widthField = document.getElementById("quantum-dynamics-1d-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(block.getWidth()).toString();
      let heightField = document.getElementById("quantum-dynamics-1d-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(block.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set time step
        let timeStep = parseFloat(timeStepField.value);
        if (isNumber(timeStep)) {
          block.setTimeStep(Math.max(0.01, timeStep));
        } else {
          success = false;
          message = timeStepField.value + " is not a valid number for time step";
        }
        // set points
        let points = parseInt(pointsField.value);
        if (isNumber(points)) {
          block.setNpoints(Math.max(50, points));
        } else {
          success = false;
          message = pointsField.value + " is not a valid number for number of points";
        }
        // set the initial state
        let initialState = parseInt(initialStateField.value);
        let computeInitialState = false;
        if (isNumber(initialState)) {
          if (initialState >= 0 && block.getInitialState() === -1) computeInitialState = true;
          block.setInitialState(Math.max(-1, initialState));
        } else {
          success = false;
          message = initialStateField.value + " is not a valid number for the initial state";
        }
        // set the initial wavepacket width
        let initialWavepacketWidth = parseFloat(initialWavepacketWidthField.value);
        if (isNumber(initialWavepacketWidth)) {
          block.setInitialWavepacketWidth(Math.max(0.01, initialWavepacketWidth));
        } else {
          success = false;
          message = initialWavepacketWidthField.value + " is not a valid number for the initial wavepacket width";
        }
        // set the initial wavepacket position
        let initialWavepacketPosition = parseFloat(initialWavepacketPositionField.value);
        if (isNumber(initialWavepacketPosition)) {
          block.setInitialWavepacketPosition(initialWavepacketPosition);
        } else {
          success = false;
          message = initialWavepacketPositionField.value + " is not a valid number for the initial wavepacket position";
        }
        // set the initial momentum
        let initialMomentum = parseFloat(initialMomentumField.value);
        if (isNumber(initialMomentum)) {
          block.setInitialMomentum(initialMomentum);
        } else {
          success = false;
          message = initialMomentumField.value + " is not a valid number for the initial momentum";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          block.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          block.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish up
        if (success) {
          block.setName(nameField.value);
          block.setMethod(methodSelector.value);
          block.setPotentialName(potentialSelector.value);
          if (computeInitialState) {
            block.findStates();
          }
          block.setInitialWaveFunction();
          block.initWavepacket();
          block.setWavepacketColor(wavepacketColorField.value);
          block.setViewWindowColor(windowColorField.value);
          block.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
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
      timeStepField.addEventListener("keyup", enterKeyUp);
      pointsField.addEventListener("keyup", enterKeyUp);
      initialStateField.addEventListener("keyup", enterKeyUp);
      initialWavepacketWidthField.addEventListener("keyup", enterKeyUp);
      initialWavepacketPositionField.addEventListener("keyup", enterKeyUp);
      initialMomentumField.addEventListener("keyup", enterKeyUp);
      wavepacketColorField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 450,
        width: 550,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
