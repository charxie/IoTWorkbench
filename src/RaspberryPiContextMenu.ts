/*
 * @author Charles Xie
 */

export class RaspberryPiContextMenu {

  getUi(): string {
    return `<menu id="raspberry-pi-context-menu" class="menu" style="z-index: 10000">
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
