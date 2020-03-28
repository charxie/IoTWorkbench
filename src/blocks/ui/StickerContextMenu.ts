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
                  <td>Text Type:</td>
                  <td colspan="2">
                    <input type="radio" name="text-type" id="sticker-plain-text-radio-button" checked> Plain
                    <input type="radio" name="text-type" id="sticker-html-text-radio-button"> HTML
                  </td>
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
                  <td>Margin X:</td>
                  <td colspan="2"><input type="text" id="sticker-margin-x-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Margin Y:</td>
                  <td colspan="2"><input type="text" id="sticker-margin-y-field" style="width: 100%"></td>
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
      let nameField = document.getElementById("sticker-name-field") as HTMLInputElement;
      nameField.value = sticker.getName();
      let decimalsField = document.getElementById("sticker-decimals-field") as HTMLInputElement;
      decimalsField.value = sticker.getDecimals() != undefined ? sticker.getDecimals().toString() : "3";
      let plainTextRadioButton = document.getElementById("sticker-plain-text-radio-button") as HTMLInputElement;
      plainTextRadioButton.checked = !sticker.getUseHtml();
      let htmlTextRadioButton = document.getElementById("sticker-html-text-radio-button") as HTMLInputElement;
      htmlTextRadioButton.checked = sticker.getUseHtml();
      let userTextArea = document.getElementById("sticker-user-text-area") as HTMLTextAreaElement;
      userTextArea.value = sticker.getUserText() != undefined ? sticker.getUserText() : "";
      let panelColorField = document.getElementById("sticker-panel-color-field") as HTMLInputElement;
      panelColorField.value = sticker.getColor();
      let panelColorChooser = document.getElementById("sticker-panel-color-chooser") as HTMLInputElement;
      panelColorChooser.value = sticker.getColor();
      let textColorField = document.getElementById("sticker-text-color-field") as HTMLInputElement;
      textColorField.value = sticker.getTextColor();
      let textColorChooser = document.getElementById("sticker-text-color-chooser") as HTMLInputElement;
      textColorChooser.value = sticker.getTextColor();
      let marginXField = document.getElementById("sticker-margin-x-field") as HTMLInputElement;
      marginXField.value = sticker.getMarginX().toString();
      let marginYField = document.getElementById("sticker-margin-y-field") as HTMLInputElement;
      marginYField.value = sticker.getMarginY().toString();
      let widthField = document.getElementById("sticker-width-field") as HTMLInputElement;
      widthField.value = Math.round(sticker.getWidth()).toString();
      let heightField = document.getElementById("sticker-height-field") as HTMLInputElement;
      heightField.value = Math.round(sticker.getHeight()).toString();
      Util.hookupColorInputs(panelColorField, panelColorChooser);
      Util.hookupColorInputs(textColorField, textColorChooser);
      const okFunction = () => {
        let success = true;
        let message;
        // set panel color
        let panelColor = Util.getHexColor(panelColorField.value);
        if (panelColor) {
          sticker.setColor(panelColor);
        } else {
          success = false;
          message = panelColorField.value + " is not a valid panel color";
        }
        // set text color
        let textColor = Util.getHexColor(textColorField.value);
        if (textColor) {
          sticker.setTextColor(textColor);
        } else {
          success = false;
          message = textColorField.value + " is not a valid text color";
        }
        // set marginX
        let marginX = parseInt(marginXField.value);
        if (isNumber(marginX)) {
          sticker.setMarginX(Math.max(0, marginX));
        } else {
          success = false;
          message = marginXField.value + " is not a valid margin in the x direction";
        }
        // set marginY
        let marginY = parseInt(marginYField.value);
        if (isNumber(marginY)) {
          sticker.setMarginY(Math.max(0, marginY));
        } else {
          success = false;
          message = marginYField.value + " is not a valid margin in the y direction";
        }
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          sticker.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          sticker.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // set decimals
        let decimals = parseInt(decimalsField.value);
        if (isNumber(decimals)) {
          sticker.setDecimals(Math.max(0, decimals));
        } else {
          success = false;
          message = decimalsField.value + " is not valid for decimals";
        }
        // finish
        if (success) {
          sticker.setName(nameField.value);
          sticker.setUseHtml(htmlTextRadioButton.checked);
          sticker.setUserText(userTextArea.value.trim() == "" ? undefined : userTextArea.value);
          if (sticker.getUseHtml()) {
            sticker.locateHtmlOverlay();
          }
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
      nameField.addEventListener("keyup", enterKeyUp);
      decimalsField.addEventListener("keyup", enterKeyUp);
      panelColorField.addEventListener("keyup", enterKeyUp);
      textColorField.addEventListener("keyup", enterKeyUp);
      marginXField.addEventListener("keyup", enterKeyUp);
      marginYField.addEventListener("keyup", enterKeyUp);
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
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
