/*
 * @author Charles Xie
 */

import $ from "jquery";
import {system} from "../../Main";
import {MyContextMenu} from "../../MyContextMenu";

export class WorkbenchContextMenu extends MyContextMenu {

  constructor() {
    super();
    this.id = "workbench-context-menu";
  }

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
                <button type="button" class="menu-btn" id="${this.id}-settings-button"><i class="fas fa-cog"></i><span class="menu-text">Settings</span></button>
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

  addListeners(): void {
    let settingsButton = document.getElementById(this.id + "-settings-button");
    settingsButton.addEventListener("click", this.settingsButtonClick.bind(this), false);
  }

  private getSettingsUI(): string {
    return `<div style="font-size: 90%;">
              <table class="w3-table-all w3-left w3-hoverable">
                <tr>
                  <td>Grid lines:</td>
                  <td><input type="checkbox" id="workbench-show-grid-checkbox">Show</td>
                </tr>
              </table>
            </div>`;
  }

  settingsButtonClick(e: MouseEvent): void {
    $("#modal-dialog").html(this.getSettingsUI());
    let showGridCheckBox = document.getElementById("workbench-show-grid-checkbox") as HTMLInputElement;
    showGridCheckBox.checked = system.workbench.showGrid;
    $("#modal-dialog").dialog({
      resizable: false,
      modal: true,
      title: "Workbench Settings",
      height: 400,
      width: 400,
      buttons: {
        'OK': function () {
          system.workbench.showGrid = showGridCheckBox.checked;
          system.workbench.draw();
          localStorage.setItem("Workbench Show Grid", system.workbench.showGrid ? "true" : "false");
          $(this).dialog('close');
        },
        'Cancel': function () {
          $(this).dialog('close');
        }
      }
    });
  }

}
