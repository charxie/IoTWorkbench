/*
 * @author Charles Xie
 */

import {HatContextMenu} from "./HatContextMenu";

export class SenseHatContextMenu extends HatContextMenu {

  constructor() {
    super();
    this.id = "sense-hat-context-menu";
  }

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item" id="sense-hat-attach-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-attach-button"><i class="fas fa-angle-double-down"></i><span class="menu-text">Attach</span></button>
              </li>
              <li class="menu-item" id="sense-hat-detach-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-detach-button"><i class="fas fa-angle-double-up"></i><span class="menu-text">Detach</span></button>
              </li>
              <li class="menu-item" id="sense-hat-delete-menu-item">
                <button type="button" class="menu-btn" id="${this.id}-delete-button"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn" id="${this.id}-code-button"><i class="fas fa-code"></i><span class="menu-text">Code</span></button>
              </li>
            </menu>`;
  }

}
