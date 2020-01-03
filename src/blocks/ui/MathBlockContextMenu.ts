/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";

export class MathBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "math-block-context-menu";
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

  protected getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Operator:</td>
                  <td>
                    R<div class='horizontal-divider'></div>=<div class='horizontal-divider'></div>A<div class='horizontal-divider'></div>
                    <select id="math-block-operator">
                      <option value="Add Block">+</option>
                      <option value="Subtract Block">−</option>
                      <option value="Multiply Block">×</option>
                      <option value="Divide Block">÷</option>
                      <option value="Modulus Block">%</option>
                      <option value="Exponentiation Block">^</option>
                    </select>
                    <div class='horizontal-divider'></div>B
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td><input type="text" id="math-block-width-field"></td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td><input type="text" id="math-block-height-field"></td>
                </tr>
              </table>
            </div>`;
  }

  protected propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let block = this.block;
      $("#modal-dialog").html(this.getPropertiesUI());
      let selectElement = document.getElementById("math-block-operator") as HTMLSelectElement;
      selectElement.value = block.getName();
      let widthInputElement = document.getElementById("math-block-width-field") as HTMLInputElement;
      widthInputElement.value = block.getWidth().toString();
      let heightInputElement = document.getElementById("math-block-height-field") as HTMLInputElement;
      heightInputElement.value = block.getHeight().toString();
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 300,
        width: 300,
        buttons: {
          'OK': function () {
            block.setName(selectElement.options[selectElement.selectedIndex].value);
            block.setSymbol(selectElement.options[selectElement.selectedIndex].text);
            block.setUid(block.getName() + " #" + Date.now().toString(16));
            block.setWidth(parseInt(widthInputElement.value));
            block.setHeight(parseInt(heightInputElement.value));
            block.refreshView();
            flowchart.updateResults();
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
