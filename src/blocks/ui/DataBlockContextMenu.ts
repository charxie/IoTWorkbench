/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {Util} from "../../Util";
import {DataBlock} from "../DataBlock";

export class DataBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "data-block-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td colspan="2"><input type="text" id="data-block-name-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Source File:</td>
                  <td><button type="button" id="data-block-source-file-button">Open</button></td>
                  <td><label id="data-block-source-file-name-label" style="width: 100%"></label></label></td>
                </tr>
               <tr>
                  <td>Format:</td>
                  <td colspan="2">
                    <select id="data-block-format-selector" style="width: 100%">
                      <option value="CSV" selected>CSV</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Image:</td>
                  <td><button type="button" id="data-block-image-file-button">Open</button></td>
                  <td><label id="data-block-image-file-name-label" style="width: 100%"></label></label></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td colspan="2"><input type="text" id="data-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td colspan="2"><input type="text" id="data-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  private openSourceFile(): void {
    let that = this;
    let fileDialog = document.getElementById('data-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsText(target.files[0]);
        reader.onload = function (e) {
          (<DataBlock>that.block).setDataInput(reader.result.toString());
          target.value = "";
        };
        document.getElementById("data-block-source-file-name-label").innerHTML = target.files[0].name;
      }
    };
    fileDialog.click();
  }

  private openImageFile(): void {
    let that = this;
    let fileDialog = document.getElementById('image-file-dialog') as HTMLInputElement;
    fileDialog.onchange = e => {
      let target = <HTMLInputElement>event.target;
      if (target.files.length) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(target.files[0]); // base64 string
        reader.onload = function (e) {
          (<DataBlock>that.block).setImageSrc(reader.result.toString());
          target.value = "";
        };
        document.getElementById("data-block-image-file-name-label").innerHTML = target.files[0].name;
      }
    };
    fileDialog.click();
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof DataBlock) {
      let that = this;
      const dataBlock = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let sourceFileOpenButton = document.getElementById("data-block-source-file-button") as HTMLButtonElement;
      sourceFileOpenButton.onclick = function () {
        that.openSourceFile();
      };
      let imageFileOpenButton = document.getElementById("data-block-image-file-button") as HTMLButtonElement;
      imageFileOpenButton.onclick = function () {
        that.openImageFile();
      };
      let nameInputElement = document.getElementById("data-block-name-field") as HTMLInputElement;
      nameInputElement.value = dataBlock.getName();
      let formatSelectElement = document.getElementById("data-block-format-selector") as HTMLSelectElement;
      formatSelectElement.value = dataBlock.getFormat();
      let widthInputElement = document.getElementById("data-block-width-field") as HTMLInputElement;
      widthInputElement.value = dataBlock.getWidth().toString();
      let heightInputElement = document.getElementById("data-block-height-field") as HTMLInputElement;
      heightInputElement.value = dataBlock.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          dataBlock.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          dataBlock.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // finish
        if (success) {
          dataBlock.setName(nameInputElement.value);
          dataBlock.setFormat(formatSelectElement.value);
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(dataBlock);
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
        title: dataBlock.getUid(),
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
