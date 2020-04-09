/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {PngSaver} from "../../tools/PngSaver";
import {MolecularViewerBlock} from "../MolecularViewerBlock";

export class MolecularViewerContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "molecular-viewer-context-menu";
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
    (<MolecularViewerBlock>this.block).resetViewAngle();
  }

  private saveImageButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    PngSaver.saveAs((<MolecularViewerBlock>this.block).toCanvas());
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td style="width: 160px">Name:</td>
                  <td colspan="3"><input type="text" id="space3d-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Box Size:</td>
                  <td colspan="3"><input type="text" id="space3d-box-size-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>View Control:</td>
                  <td colspan="3">
                    <select id="space3d-control-selector" style="width: 100%">
                      <option value="Orbit" selected>Orbit</option>
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

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof MolecularViewerBlock) {
      const g = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("space3d-name-field") as HTMLInputElement;
      nameField.value = g.getName();
      let boxSizeField = document.getElementById("space3d-box-size-field") as HTMLInputElement;
      boxSizeField.value = g.getBoxSize().toString();
      let windowColorField = document.getElementById("space3d-window-color-field") as HTMLInputElement;
      windowColorField.value = g.getSpaceWindowColor();
      let windowColorChooser = document.getElementById("space3d-window-color-chooser") as HTMLInputElement;
      Util.setColorPicker(windowColorChooser, g.getSpaceWindowColor());
      let widthField = document.getElementById("space3d-width-field") as HTMLInputElement;
      widthField.value = Math.round(g.getWidth()).toString();
      let heightField = document.getElementById("space3d-height-field") as HTMLInputElement;
      heightField.value = Math.round(g.getHeight()).toString();

      const okFunction = () => {
        let success = true;
        let message;
        // set box size
        let boxSize = parseInt(boxSizeField.value);
        if (!isNumber(boxSize)) {
          success = false;
          message = boxSizeField.value + " is not a valid box size";
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
          g.setBoxSize(Math.max(0, boxSize));
          g.setSpaceWindowColor(windowColorField.value);
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
      boxSizeField.addEventListener("keyup", enterKeyUp);
      windowColorField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: g.getUid(),
        height: 400,
        width: 480,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
