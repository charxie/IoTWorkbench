/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, flowchart} from "../../Main";
import {BlockContextMenu} from "./BlockContextMenu";
import {RainbowHatBlock} from "../RainbowHatBlock";
import {RainbowHat} from "../../components/RainbowHat";

export class RainbowHatBlockContextMenu extends BlockContextMenu {

  constructor() {
    super();
    this.id = "rainbow-hat-block-context-menu";
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

  protected getPropertiesUI(): string {
    if (this.block instanceof RainbowHatBlock) {
      let hat = this.block.getHat() as RainbowHat;
      return hat.getProperties();
    }
    return null;
  }

  propertiesButtonClick(e: MouseEvent): void {
    // FIXME: This event will not propagate to its parent. So we have to call this method here to close context menus.
    closeAllContextMenus();
    if (this.block instanceof RainbowHatBlock) {
      const block = this.block;
      const d = $("#modal-dialog").html(this.getPropertiesUI());
      d.dialog({
        resizable: false,
        modal: true,
        title: block.getUid(),
        height: 500,
        width: 400,
        buttons: {
          'Close': function () {
            d.dialog('close');
          }
        }
      });
    }
  }

}
