/*
 * @author Charles Xie
 */
export class ColorPickerContextMenu {

  getUi(): string {
    return `<menu id="colorpicker-context-menu" class="menu" style="width: 200px; z-index: 10000">
              <li class="menu-item">
                <div id="colorpicker">
                  <canvas id="color-block" height="150" width="150"></canvas>
                  <canvas id="color-strip" height="150" width="30"></canvas>
                </div>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
