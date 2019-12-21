/*
 * @author Charles Xie
 */

export class LineChartContextMenu {

  id: string = "linechart-context-menu";

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-palette"></i><span class="menu-text">Colors</span></button>
              </li>
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-cog"></i><span class="menu-text">Options</span></button>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
