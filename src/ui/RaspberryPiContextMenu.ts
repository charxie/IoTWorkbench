/*
 * @author Charles Xie
 */

import {system} from "../Main";
import {RaspberryPi} from "../components/RaspberryPi";
import {ComponentContextMenu} from "./ComponentContextMenu";

export class RaspberryPiContextMenu extends ComponentContextMenu {

  raspberryPi: RaspberryPi;

  constructor() {
    super();
    this.id = "raspberry-pi-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" id="raspberry-pi-context-menu-delete-button" class="menu-btn"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" id="raspberry-pi-context-menu-settings-button" class="menu-btn"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
              </li>
            </menu>`;
  }

  addListeners(): void {
    let deleteButton = document.getElementById("raspberry-pi-context-menu-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
  }

  private deleteButtonClick(e: MouseEvent): void {
    if (this.raspberryPi) {
      if (confirm("Are you sure you want to delete " + this.raspberryPi.uid + "?")) {
        this.raspberryPi.hat = null;
        system.removeRaspberryPi(this.raspberryPi);
      }
    }
  }

}
