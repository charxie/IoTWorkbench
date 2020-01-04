/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";

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
                  <td>Width:</td>
                  <td><input type="text" id="item-selector-block-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="item-selector-block-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let block = this.block;
      let d = $("#modal-dialog").html(this.getPropertiesUI());
      let widthInputElement = document.getElementById("item-selector-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("item-selector-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 300,
        buttons: {
          'OK': function () {
            block.setUid(block.getName() + " #" + Date.now().toString(16));
            block.setWidth(parseInt(widthInputElement.value));
            block.setHeight(parseInt(heightInputElement.value));
            block.refreshView();
            flowchart.draw();
            flowchart.updateResults();
            // update the local storage since we have changed the UID of this block
            flowchart.storeBlockStates();
            flowchart.storeConnectorStates();
            $(this).dialog('close');
          },
          'Cancel': function () {
            $(this).dialog('close');
          }
        }
      });
    }
  }

}
