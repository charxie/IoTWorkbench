/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Util} from "../../Util";
import {StringInput} from "../StringInput";

export class StringInputContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "string-input-context-menu";
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
                <button type="button" class="menu-btn" id="${this.id}-erase-button"><i class="fas fa-eraser"></i><span class="menu-text">Erase</span></button>
              </li>
              <li class="menu-separator"></li>` + this.getLayerMenu() + `<li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
    let eraseButton = document.getElementById(this.id + "-erase-button");
    eraseButton.addEventListener("click", this.eraseButtonClick.bind(this), false);
  }

  private eraseButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    (<StringInput>this.block).erase();
    flowchart.blockView.requestDraw();
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="string-input-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Text Color:</td>
                  <td><input type="color" id="string-input-text-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="string-input-text-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Margin X:</td>
                  <td colspan="2"><input type="text" id="string-input-margin-x-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Margin Y:</td>
                  <td colspan="2"><input type="text" id="string-input-margin-y-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="string-input-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="string-input-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof StringInput) {
      const stringInput = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameField = document.getElementById("string-input-name-field") as HTMLInputElement;
      nameField.value = stringInput.getName();
      let textColorField = document.getElementById("string-input-text-color-field") as HTMLInputElement;
      textColorField.value = stringInput.getTextColor();
      let textColorChooser = document.getElementById("string-input-text-color-chooser") as HTMLInputElement;
      textColorChooser.value = stringInput.getTextColor();
      let marginXField = document.getElementById("string-input-margin-x-field") as HTMLInputElement;
      marginXField.value = stringInput.getMarginX().toString();
      let marginYField = document.getElementById("string-input-margin-y-field") as HTMLInputElement;
      marginYField.value = stringInput.getMarginY().toString();
      let widthField = document.getElementById("string-input-width-field") as HTMLInputElement;
      widthField.value = Math.round(stringInput.getWidth()).toString();
      let heightField = document.getElementById("string-input-height-field") as HTMLInputElement;
      heightField.value = Math.round(stringInput.getHeight()).toString();
      Util.hookupColorInputs(textColorField, textColorChooser);
      const okFunction = () => {
        let success = true;
        let message;
        // set text color
        let textColor = Util.getHexColor(textColorField.value);
        if (textColor) {
          stringInput.setTextColor(textColor);
        } else {
          success = false;
          message = textColorField.value + " is not a valid text color";
        }
        // set marginX
        let marginX = parseInt(marginXField.value);
        if (isNumber(marginX)) {
          stringInput.setMarginX(Math.max(0, marginX));
        } else {
          success = false;
          message = marginXField.value + " is not a valid margin in the x direction";
        }
        // set marginY
        let marginY = parseInt(marginYField.value);
        if (isNumber(marginY)) {
          stringInput.setMarginY(Math.max(0, marginY));
        } else {
          success = false;
          message = marginYField.value + " is not a valid margin in the y direction";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          stringInput.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          stringInput.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish
        if (success) {
          stringInput.setName(nameField.value);
          stringInput.locateOverlay();
          stringInput.refreshView();
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
      textColorField.addEventListener("keyup", enterKeyUp);
      marginXField.addEventListener("keyup", enterKeyUp);
      marginYField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: true,
        modal: true,
        title: stringInput.getUid(),
        height: 400,
        width: 400,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
