/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {RainbowHatBlock} from "../RainbowHatBlock";

export class HatBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "hat-block-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 200px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-clear-sensor-data-button"><i class="fas fa-eraser"></i><span class="menu-text">Clear Sensor Data</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-properties-button"><i class="fas fa-cog"></i><span class="menu-text">Properties</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let clearSensorDataButton = document.getElementById(this.id + "-clear-sensor-data-button");
    clearSensorDataButton.addEventListener("click", this.clearSensorDataButtonClick.bind(this), false);
    let settingsButton = document.getElementById(this.id + "-properties-button");
    settingsButton.addEventListener("click", this.propertiesButtonClick.bind(this), false);
  }

  private clearSensorDataButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    (<RainbowHatBlock>this.block).clearSensorData();
    flowchart.blockView.requestDraw();
  }

  getPropertiesUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Type:</td>
                  <td>${this.block.getUid().substring(0, this.block.getUid().indexOf("HAT") + 3)}</td>
                </tr>
                <tr>
                  <td>ID:</td>
                  <td>${this.block.getUid().substring(this.block.getUid().indexOf("#"))}</td>
                </tr>
              </table>
            </div>`;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block) {
      let that = this;
      $("#modal-dialog").html(this.getPropertiesUI()).dialog({
        resizable: false,
        modal: true,
        title: "HAT Block Properties",
        height: 300,
        width: 400,
        buttons: {
          'OK': function () {
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
