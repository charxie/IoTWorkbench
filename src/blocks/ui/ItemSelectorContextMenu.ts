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

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Name:</td>
                  <td><input type="text" id="item-selector-name-field"></td>
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

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof ItemSelector) {
      const itemSelector = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      let nameInputElement = document.getElementById("item-selector-name-field") as HTMLInputElement;
      nameInputElement.value = itemSelector.getName();
      let itemsInputElement = document.getElementById("item-selector-block-items-field") as HTMLTextAreaElement;
      itemsInputElement.value = JSON.stringify(itemSelector.getItems());
      let widthInputElement = document.getElementById("item-selector-block-width-field") as HTMLInputElement;
      widthInputElement.value = itemSelector.getWidth().toString();
      let heightInputElement = document.getElementById("item-selector-block-height-field") as HTMLInputElement;
      heightInputElement.value = itemSelector.getHeight().toString();
      const okFunction = function () {
        itemSelector.setName(nameInputElement.value);
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
          itemSelector.updateModel();
          itemSelector.refreshView();
          flowchart.draw();
          flowchart.updateResultsForBlock(itemSelector);
          flowchart.storeBlockStates();
          flowchart.storeConnectorStates();
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
