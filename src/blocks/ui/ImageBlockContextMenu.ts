/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {ImageBlock} from "../ImageBlock";

export class ImageBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "image-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="image-block-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>File:</td>
                  <td><button type="button" id="image-block-file-button">Open</button></td>
                  <td><label id="image-block-file-name-label" style="width: 100%"></label></label></td>
                </tr>
                <tr>
                  <td>Transparency:</td>
                  <td><input type="radio" name="source" id="image-block-not-transparent-radio-button" checked> No
                      <input type="radio" name="source" id="image-block-transparent-radio-button"> Yes</td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="image-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="image-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  open(): void {
    let that = this;
    let fileDialog = document.getElementById('image-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(target.files[0]); // base64 string
        reader.onload = function (e) {
          (<ImageBlock>that.block).setData(reader.result.toString());
          target.value = "";
        };
        document.getElementById("image-block-file-name-label").innerHTML = target.files[0].name;
      }
    };
    fileDialog.click();
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ImageBlock) {
      let that = this;
      const imageBlock = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let fileOpenButton = document.getElementById("image-block-file-button") as HTMLButtonElement;
      fileOpenButton.onclick = function () {
        that.open();
      };
      let nameInputElement = document.getElementById("image-block-name-field") as HTMLInputElement;
      nameInputElement.value = imageBlock.getName();
      let notTransparentRadioButton = document.getElementById("image-block-not-transparent-radio-button") as HTMLInputElement;
      notTransparentRadioButton.checked = !imageBlock.isTransparent();
      let transparentRadioButton = document.getElementById("image-block-transparent-radio-button") as HTMLInputElement;
      transparentRadioButton.checked = imageBlock.isTransparent();
      let widthInputElement = document.getElementById("image-block-width-field") as HTMLInputElement;
      widthInputElement.value = imageBlock.getWidth().toString();
      let heightInputElement = document.getElementById("image-block-height-field") as HTMLInputElement;
      heightInputElement.value = imageBlock.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          imageBlock.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          imageBlock.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          imageBlock.setName(nameInputElement.value);
          imageBlock.setTransparent(transparentRadioButton.checked);
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(imageBlock);
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
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
      nameInputElement.addEventListener("keyup", enterKeyUp);
      widthInputElement.addEventListener("keyup", enterKeyUp);
      heightInputElement.addEventListener("keyup", enterKeyUp);
      d.dialog({
        resizable: false,
        modal: true,
        title: imageBlock.getUid(),
        height: 400,
        width: 350,
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
