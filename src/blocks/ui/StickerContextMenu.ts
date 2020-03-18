/*
 * @author Charles Xie
 */

import $ from "jquery";
import {BlockContextMenu} from "./BlockContextMenu";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {Sticker} from "../Sticker";
import {Util} from "../../Util";

export class StickerContextMenu extends BlockContextMenu {

  private dialogWidth: number = 450;
  private dialogHeight: number = 580;

  constructor() {
    super();
    this.id = "sticker-context-menu";
  }

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="sticker-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Fraction Digits:</td>
                  <td colspan="2"><input type="text" id="sticker-decimals-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>User Text:</td>
                  <td colspan="2"><textarea id="sticker-user-text-area" rows="8" style="width: 100%"></textarea>
                </tr>
                <tr>
                  <td>Panel Color:</td>
                  <td><input type="color" id="sticker-panel-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="sticker-panel-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Text Color:</td>
                  <td><input type="color" id="sticker-text-color-chooser" style="width: 50px"></td>
                  <td><input type="text" id="sticker-text-color-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="sticker-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="sticker-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(): void {
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
      let panelColorChooser = document.getElementById("sticker-panel-color-chooser") as HTMLInputElement;
      panelColorChooser.value = sticker.getColor();
      let textColorInputElement = document.getElementById("sticker-text-color-field") as HTMLInputElement;
      textColorInputElement.value = sticker.getTextColor();
      let textColorChooser = document.getElementById("sticker-text-color-chooser") as HTMLInputElement;
      textColorChooser.value = sticker.getTextColor();
      let widthInputElement = document.getElementById("sticker-width-field") as HTMLInputElement;
      widthInputElement.value = sticker.getWidth().toString();
      let heightInputElement = document.getElementById("sticker-height-field") as HTMLInputElement;
      heightInputElement.value = sticker.getHeight().toString();
      Util.hookupColorInputs(panelColorInputElement, panelColorChooser);
      Util.hookupColorInputs(textColorInputElement, textColorChooser);
      const okFunction = () => {
        let success = true;
        let message;
        // set panel color
        let panelColor = Util.getHexColor(panelColorInputElement.value);
        if (panelColor) {
          sticker.setColor(panelColor);
        } else {
          success = false;
          message = panelColorInputElement.value + " is not a valid panel color";
        }
        // set text color
        let textColor = Util.getHexColor(textColorInputElement.value);
        if (textColor) {
          sticker.setTextColor(textColor);
        } else {
          success = false;
          message = textColorInputElement.value + " is not a valid text color";
        }
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          sticker.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          sticker.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height";
        }
        // set decimals
        let decimals = parseInt(decimalsInputElement.value);
        if (isNumber(decimals)) {
          sticker.setDecimals(Math.max(0, decimals));
        } else {
          success = false;
          message = decimalsInputElement.value + " is not valid for decimals";
        }
        // finish
        if (success) {
          sticker.setName(nameInputElement.value);
          sticker.setUserText(userTextInputElement.value.trim() == "" ? undefined : userTextInputElement.value);
          sticker.refreshView();
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
      nameInputElement.addEventListener("keyup", enterKeyUp);
      decimalsInputElement.addEventListener("keyup", enterKeyUp);
      panelColorInputElement.addEventListener("keyup", enterKeyUp);
      textColorInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: true,
        modal: true,
        title: sticker.getUid(),
        height: this.dialogHeight,
        width: this.dialogWidth,
        resize: (e, ui) => {
          // @ts-ignore
          this.dialogWidth = ui.size.width;
          // @ts-ignore
          this.dialogHeight = ui.size.height;
        },
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
