/*
 * @author Charles Xie
 */

import {system} from "./Main";
import {RaspberryPi} from "./components/RaspberryPi";
import {Hat} from "./components/Hat";

export class RainbowHatContextMenu {

  hat: Hat;

  constructor() {
  }

  getUi(): string {
    return `<menu id="rainbow-hat-context-menu" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item" id="rainbow-hat-attach-menu-item">
                <button type="button" class="menu-btn" id="rainbow-hat-context-menu-attach-button"><i class="fas fa-angle-double-down"></i><span class="menu-text">Attach</span></button>
              </li>
              <li class="menu-item" id="rainbow-hat-detach-menu-item">
                <button type="button" class="menu-btn" id="rainbow-hat-context-menu-detach-button"><i class="fas fa-angle-double-up"></i><span class="menu-text">Detach</span></button>
              </li>
              <li class="menu-item" id="rainbow-hat-delete-menu-item">
                <button type="button" class="menu-btn" id="rainbow-hat-context-menu-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="rainbow-hat-context-menu-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

  addListeners(): void {
    let attachButton = document.getElementById("rainbow-hat-context-menu-attach-button");
    attachButton.addEventListener("click", this.attachButtonClick.bind(this), false);
    let detachButton = document.getElementById("rainbow-hat-context-menu-detach-button");
    detachButton.addEventListener("click", this.detachButtonClick.bind(this), false);
    let deleteButton = document.getElementById("rainbow-hat-context-menu-delete-button");
    deleteButton.addEventListener("click", this.deleteButtonClick.bind(this), false);
  }

  private deleteButtonClick(e: MouseEvent): void {
    if (this.hat) {
      if (confirm("Are you sure you want to delete " + this.hat.uid + "?")) {
        system.removeHat(this.hat);
      }
    }
  }

  private attachButtonClick(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById("rainbow-hat-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    let i = this.hat.whichRaspberryPi();
    if (i >= 0) {
      this.hat.attach(<RaspberryPi>system.mcus[i]);
    }
  }

  private detachButtonClick(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById("rainbow-hat-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    this.hat.attach(null);
  }

}
