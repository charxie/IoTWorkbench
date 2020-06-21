/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {BlochSphere} from "../BlochSphere";

export class BlochSphereContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "bloch-sphere-block-context-menu";
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
    PngSaver.saveAs((<BlochSphere>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="bloch-sphere-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Input Type:</td>
                  <td colspan="2">
                    <input type="radio" name="input" id="bloch-sphere-dual-input-radio-button" checked> Dual
                    <input type="radio" name="input" id="bloch-sphere-single-input-radio-button"> Single
                  </td>
                </tr>
                <tr>
                  <td>Theta:</td>
                  <td colspan="2"><input type="text" id="bloch-sphere-theta-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Phi:</td>
                  <td colspan="2"><input type="text" id="bloch-sphere-phi-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Window Color:</td>
                  <td><input type="color" id="bloch-sphere-window-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="bloch-sphere-window-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="bloch-sphere-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="bloch-sphere-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof BlochSphere) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("bloch-sphere-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let dualInputRadioButton = document.getElementById("bloch-sphere-dual-input-radio-button") as HTMLInputElement;
      dualInputRadioButton.checked = !g.getSingleInput();
      let singleInputRadioButton = document.getElementById("bloch-sphere-single-input-radio-button") as HTMLInputElement;
      singleInputRadioButton.checked = g.getSingleInput();
      let thetaField = document.getElementById("bloch-sphere-theta-field") as HTMLInputElement;
      thetaField.value = Math.toDegree(g.getTheta()).toString();
      let phiField = document.getElementById("bloch-sphere-phi-field") as HTMLInputElement;
      phiField.value = Math.toDegree(g.getPhi()).toString();
      let windowColorField = document.getElementById("bloch-sphere-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getViewWindowColor();
      let windowColorChooser = document.getElementById("bloch-sphere-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getViewWindowColor());
      Util.hookupColorInputs(windowColorField, windowColorChooser);
      let widthField = document.getElementById("bloch-sphere-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("bloch-sphere-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set theta
        let theta = parseFloat(thetaField.value);
        if (isNumber(theta)) {
          if (theta < 0) theta = 0;
          else if (theta > 180) theta = 180;
          g.setTheta(Math.toRadian(theta));
        } else {
          success = false;
          message = thetaField.value + " is not valid for theta";
        }
        // set phi
        let phi = parseFloat(phiField.value);
        if (isNumber(phi)) {
          if (phi < -180) phi = -180;
          else if (phi > 180) phi = 180;
          g.setPhi(Math.toRadian(phi));
        } else {
          success = false;
          message = phiField.value + " is not valid for phi";
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
          g.setSingleInput(singleInputRadioButton.checked);
          g.setViewWindowColor(windowColorField.value);
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
      thetaField.addEventListener("keyup", enterKeyUp);
      phiField.addEventListener("keyup", enterKeyUp);
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
