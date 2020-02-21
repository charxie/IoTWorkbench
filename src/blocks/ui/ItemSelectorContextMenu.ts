/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart, isNumber} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {ItemSelector} from "../ItemSelector";
import {Util} from "../../Util";

export class ItemSelectorContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "item-selector-context-menu";
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="item-selector-name-field"></td>
                </tr>
                <tr>
                  <td>Source:</td>
                  <td><input type="radio" name="source" id="item-selector-source-radio-button" checked> Yes
                      <input type="radio" name="source" id="item-selector-not-source-radio-button"> No</td>
                </tr>
                <tr>
                  <td>Items:<div style="font-size: 70%">(e.g., [1, 2, 3]<br>or ["a", "b", "c"])</div></td>
                  <td><textarea id="item-selector-block-items-field" rows="5" style="width: 100%"></textarea></td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="item-selector-block-width-field" style="width: 100%"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="item-selector-block-height-field" style="width: 100%"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ItemSelector) {
      const itemSelector = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("item-selector-name-field") as HTMLInputElement;
      nameInputElement.value = itemSelector.getName();
      let sourceRadioButton = document.getElementById("item-selector-source-radio-button") as HTMLInputElement;
      sourceRadioButton.checked = itemSelector.isSource();
      let notSourceRadioButton = document.getElementById("item-selector-not-source-radio-button") as HTMLInputElement;
      notSourceRadioButton.checked = !itemSelector.isSource();
      let itemsInputElement = document.getElementById("item-selector-block-items-field") as HTMLTextAreaElement;
      itemsInputElement.value = JSON.stringify(itemSelector.getItems());
      itemsInputElement.disabled = itemSelector.hasInput();
      let widthInputElement = document.getElementById("item-selector-block-width-field") as HTMLInputElement;
      widthInputElement.value = itemSelector.getWidth().toString();
      let heightInputElement = document.getElementById("item-selector-block-height-field") as HTMLInputElement;
      heightInputElement.value = itemSelector.getHeight().toString();
      const okFunction = function () {
        let success = true;
        let message;
        // set width
        let w = parseInt(widthInputElement.value);
        if (isNumber(w)) {
          itemSelector.setWidth(Math.max(20, w));
        } else {
          success = false;
          message = widthInputElement.value + " is not a valid width.";
        }
        // set height
        let h = parseInt(heightInputElement.value);
        if (isNumber(h)) {
          itemSelector.setHeight(Math.max(20, h));
        } else {
          success = false;
          message = heightInputElement.value + " is not a valid height.";
        }
        // set items
        try {
          itemSelector.setItems(JSON.parse(itemsInputElement.value));
        } catch (err) {
          success = false;
          message = itemsInputElement.value + " is not a valid array.";
        }
        // finish up
        if (success) {
          itemSelector.setName(nameInputElement.value);
          itemSelector.setSource(sourceRadioButton.checked);
          itemSelector.updateModel();
          itemSelector.refreshView();
          flowchart.blockView.requestDraw();
          flowchart.updateResultsForBlock(itemSelector);
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
        title: itemSelector.getUid(),
        height: 400,
        width: 320,
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
