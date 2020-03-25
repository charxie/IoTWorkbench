/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {AudioBlock} from "../AudioBlock";

export class AudioBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "audio-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="audio-block-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>File:</td>
                  <td><button type="button" id="audio-block-file-button">Select</button></td>
                  <td><label id="audio-block-file-name-label" style="width: 100%"></label></label></td>
                </tr>
                <tr>
                  <td>Interruptible:</td>
                  <td><input type="radio" name="short" id="audio-block-interruptible-radio-button" checked> Yes
                      <input type="radio" name="short" id="audio-block-not-interruptible-radio-button"> No</td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="audio-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="audio-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private open(): void {
    let fileDialog = document.getElementById('audio-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(target.files[0]); // base64 string
        reader.onload = (e) => {
          (<AudioBlock>this.block).setData(reader.result.toString());
          target.value = "";
        };
        document.getElementById("audio-block-file-name-label").innerHTML = target.files[0].name;
      }
    };
    fileDialog.click();
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof AudioBlock) {
      const audioBlock = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let fileOpenButton = document.getElementById("audio-block-file-button") as HTMLButtonElement;
      fileOpenButton.onclick = () => this.open();
      let interruptibleRadioButton = document.getElementById("audio-block-interruptible-radio-button") as HTMLInputElement;
      interruptibleRadioButton.checked = audioBlock.isInterruptible();
      let notInterruptibleRadioButton = document.getElementById("audio-block-not-interruptible-radio-button") as HTMLInputElement;
      notInterruptibleRadioButton.checked = !audioBlock.isInterruptible();
      let nameField = document.getElementById("audio-block-name-field") as HTMLInputElement;
      nameField.value = audioBlock.getName();
      let widthField = document.getElementById("audio-block-width-field") as HTMLInputElement;
      widthField.value = Math.round(audioBlock.getWidth()).toString();
      let heightField = document.getElementById("audio-block-height-field") as HTMLInputElement;
      heightField.value = Math.round(audioBlock.getHeight()).toString();
      const okFunction = () => {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthField.value);
        if (isNumber(w)) {
          audioBlock.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthField.value + " is not a valid width";
        }
        // set height
        let h = parseInt(heightField.value);
        if (isNumber(h)) {
          audioBlock.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightField.value + " is not a valid height";
        }
        // finish
        if (success) {
          audioBlock.setName(nameField.value);
          audioBlock.setInterruptible(interruptibleRadioButton.checked);
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(audioBlock);
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
      widthField.addEventListener("keyup", enterKeyUp);
      heightField.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: audioBlock.getUid(),
        height: 350,
        width: 350,
        buttons: {
          'OK': okFunction,
          'Cancel': () => d.dialog('close')
        }
      });
    }
  }

}
