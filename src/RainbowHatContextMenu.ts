/*
 * @author Charles Xie
 */

export class RainbowHatContextMenu {

  getUi(): string {
    return `<menu id="rainbow-hat-context-menu" class="menu" style="z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-edit"></i><span class="menu-text">Edit</span></button>
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

}
