/*
 * @author Charles Xie
 */

export class WorkbenchContextMenu {

  id: string = "workbench-context-menu";

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 120px; z-index: 10000">
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-folder-open"></i><span class="menu-text">Open</span></button>
              </li>
              <li class="menu-item disabled">
                <button type="button" class="menu-btn"><i class="fas fa-download"></i><span class="menu-text">Save</span></button>
              </li>
              <li class="menu-separator"></li>
              <li class="menu-item">
                <button type="button" class="menu-btn"><i class="fas fa-trash"></i><span class="menu-text">Delete</span></button>
              </li>
              <li class="menu-item submenu">
                <button type="button" class="menu-btn"><i class="fas fa-file-import"></i><span class="menu-text">Import</span></button>

                <menu class="menu" style="width: 160px;">
                  <li class="menu-item">
                    <button type="button" class="menu-btn"><span class="menu-text">Breadboard</span></button>
                  </li>

                  <li class="menu-item submenu">
                    <button type="button" class="menu-btn"><span class="menu-text">Sensors</span></button>
                    <menu class="menu" style="width: 120px;">
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">BME280</span></button>
                      </li>
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">TSL2561</span></button>
                      </li>
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">HCSR04</span></button>
                      </li>
                    </menu>
                  </li>

                  <li class="menu-item submenu">
                    <button type="button" class="menu-btn"><span class="menu-text">Actuators</span></button>
                    <menu class="menu" style="width: 180px;">
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">Buzzer</span></button>
                      </li>
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">Servo Motor</span></button>
                      </li>
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">LED Light</span></button>
                      </li>
                      <li class="menu-item">
                        <button type="button" class="menu-btn"><span class="menu-text">Multicolor LED Light</span></button>
                      </li>
                    </menu>
                  </li>

                </menu>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
