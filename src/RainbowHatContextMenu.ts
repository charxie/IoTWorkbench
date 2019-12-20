/*
 * @author Charles Xie
 */

import {system} from "./Main";
import {RaspberryPi} from "./components/RaspberryPi";

export class RainbowHatContextMenu {

  constructor() {
  }

  getUi(): string {
    return `<menu id="rainbow-hat-context-menu" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item" id="rainbow-hat-attach-menu-item">
                <button type="button" class="menu-btn" id="rainbow-hat-attach-button"><i class="fas fa-angle-double-down"></i><span class="menu-text">Attach</span></button>
              </li>
              <li class="menu-item" id="rainbow-hat-detach-menu-item">
                <button type="button" class="menu-btn" id="rainbow-hat-detach-button"><i class="fas fa-angle-double-up"></i><span class="menu-text">Detach</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

  addListeners(): void {
    let attachButton = document.getElementById("rainbow-hat-attach-button");
    attachButton.addEventListener("click", this.attachButtonClick.bind(this), false);
    let detachButton = document.getElementById("rainbow-hat-detach-button");
    detachButton.addEventListener("click", this.detachButtonClick.bind(this), false);
  }

  private attachButtonClick(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById("rainbow-hat-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    let i = system.rainbowHat.whichRaspberryPi();
    if (i >= 0) {
      system.rainbowHat.attach(<RaspberryPi>system.mcus[i]);
    }
  }

  private detachButtonClick(e: MouseEvent): void {
    e.preventDefault();
    console.log("detach");
    let menu = document.getElementById("rainbow-hat-context-menu") as HTMLMenuElement;
    menu.classList.remove("show-menu");
    system.rainbowHat.attach(null);
  }

}
