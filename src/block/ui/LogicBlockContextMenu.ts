/*
 * @author Charles Xie
 */

import $ from "jquery";
import {Block} from "../Block";
import {MyContextMenu} from "../../MyContextMenu";
import {closeAllContextMenus, flowchart, system} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";

export class LogicBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "logic-block-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    super.addListeners();
  }

  getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>ID:</td>
                  <td>${this.block.uid.substring(this.block.uid.indexOf("#"))}</td>
                </tr>
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
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let that = this;
      $("#modal-dialog").html(this.getSettingsUI());
      let e = document.getElementById("logic-block-operator") as HTMLSelectElement;
      e.value = this.block.name;
      $("#modal-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Logic Block Settings",
        height: 300,
        width: 400,
        buttons: {
          'OK': function () {
            that.block.name = e.options[e.selectedIndex].value;
            that.block.symbol = e.options[e.selectedIndex].text;
            that.block.uid = that.block.name + " #" + Date.now().toString(16);
            flowchart.draw();
            // update the local storage since we have changed the UID of this block
            flowchart.storeBlocks();
            flowchart.storeBlockLocation(that.block);
            flowchart.storePortConnectors();
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
