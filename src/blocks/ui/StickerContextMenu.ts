/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Sticker} from "../Sticker";
import {Util} from "../../Util";

export class StickerContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "sticker-context-menu";
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
                  <td><input type="text" id="sticker-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Decimals:</td>
                  <td><input type="text" id="sticker-decimals-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>User Text:</td>
                  <td><textarea id="sticker-user-text-area" rows="5" style="width: 100%"></textarea>
                </tr>
                <tr>
                  <td>Panel Color:</td>
                  <td><input type="text" id="sticker-panel-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Text Color:</td>
                  <td><input type="text" id="sticker-text-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="sticker-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="sticker-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof Sticker) {
      const sticker = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("sticker-name-field") as HTMLInputElement;
      nameInputElement.value = sticker.getName();
      let decimalsInputElement = document.getElementById("sticker-decimals-field") as HTMLInputElement;
      decimalsInputElement.value = sticker.getDecimals() != undefined ? sticker.getDecimals().toString() : "3";
      let userTextInputElement = document.getElementById("sticker-user-text-area") as HTMLTextAreaElement;
      userTextInputElement.value = sticker.getUserText() != undefined ? sticker.getUserText() : "";
      let panelColorInputElement = document.getElementById("sticker-panel-color-field") as HTMLInputElement;
      panelColorInputElement.value = sticker.getColor();
      let textColorInputElement = document.getElementById("sticker-text-color-field") as HTMLInputElement;
      textColorInputElement.value = sticker.getTextColor();
      let widthInputElement = document.getElementById("sticker-width-field") as HTMLInputElement;
      widthInputElement.value = sticker.getWidth().toString();
      let heightInputElement = document.getElementById("sticker-height-field") as HTMLInputElement;
      heightInputElement.value = sticker.getHeight().toString();
      const okFunction = function () {
        sticker.setName(nameInputElement.value);
        sticker.setUserText(userTextInputElement.value.trim() == "" ? undefined : userTextInputElement.value);
        let success = true;
        let message;
        // set panel color
        let panelColor = Util.getHexColor(panelColorInputElement.value);
        if (panelColor) {
          sticker.setColor(panelColor);
        } else {
          success = false;
          message = panelColorInputElement.value + " is not a valid panel color.";
        }
        // set text color
        let textColor = Util.getHexColor(textColorInputElement.value);
        if (textColor) {
          sticker.setTextColor(textColor);
        } else {
          success = false;
          message = textColorInputElement.value + " is not a valid text color.";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          sticker.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          sticker.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // set decimals
        let decimals = parseInt(decimalsInputElement.value);
        if (isNumber(decimals)) {
          sticker.setDecimals(Math.max(0, decimals));
        } else {
          success = false;
          message = decimalsInputElement.value + " is not valid for decimals.";
        }
        // finish
        if (success) {
          sticker.refreshView();
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
      decimalsInputElement.addEventListener("keyup", enterKeyUp);
      panelColorInputElement.addEventListener("keyup", enterKeyUp);
      textColorInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: sticker.getUid(),
        height: 550,
        width: 400,
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
