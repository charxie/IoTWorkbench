/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";

export class LogicBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "logic-block-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 140px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
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
                  <td>Operator:</td>
                  <td>
                    R<div class='horizontal-divider'></div>=<div class='horizontal-divider'></div>A<div class='horizontal-divider'></div>
                    <select id="logic-block-operator">
                      <option value="AND Block">AND</option>
                      <option value="OR Block">OR</option>
                      <option value="XOR Block">XOR</option>
                      <option value="NOR Block">NOR</option>
                      <option value="XNOR Block">XNOR</option>
                    </select>
                    <div class='horizontal-divider'></div>B
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="logic-block-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="logic-block-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let that = this;
      $("#modal-dialog").html(this.getPropertiesUI());
      let selectElement = document.getElementById("logic-block-operator") as HTMLSelectElement;
      selectElement.value = this.block.getName();
      let widthInputElement = document.getElementById("logic-block-width-field") as HTMLInputElement;
      widthInputElement.value = this.block.getWidth().toString();
      let heightInputElement = document.getElementById("logic-block-height-field") as HTMLInputElement;
      heightInputElement.value = this.block.getHeight().toString();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: that.block.getUid(),
        height: 300,
        width: 300,
        buttons: {
          'OK': function () {
            that.block.setName(selectElement.options[selectElement.selectedIndex].value);
            that.block.setSymbol(selectElement.options[selectElement.selectedIndex].text);
            that.block.setUid(that.block.getName() + " #" + Date.now().toString(16));
            that.block.setWidth(parseInt(widthInputElement.value));
            that.block.setHeight(parseInt(heightInputElement.value));
            that.block.refreshView();
            flowchart.draw();
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
