/*
 * @author Charles Xie
 */

import {system} from "./Main";
import {RaspberryPi} from "./components/RaspberryPi";

export class RaspberryPiContextMenu {

  getUi(): string {
    return `<menu id="raspberry-pi-context-menu" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" id="raspberry-pi-context-menu-delete-button" class="menu-btn"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" id="raspberry-pi-context-menu-settings-button" class="menu-btn"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

  addListeners(): void {
    let deleteButton = document.getElementById("raspberry-pi-context-menu-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
  }

  private deleteButtonClick(e: MouseEvent): void {
    let selectedIndex = -1;
    for (let i = 0; system.mcus.length; i++) {
      let mcu = system.mcus[i];
      if (mcu instanceof RaspberryPi && mcu.selected) {
        selectedIndex = i;
        break;
      }
    }
    if (selectedIndex >= 0) {
      if (confirm("Are you sure you want to delete " + system.mcus[selectedIndex].uid + "?")) {
        system.removeRaspberryPi(selectedIndex);
      }
      system.deselectAll();
    }
  }

}
