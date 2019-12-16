/*
 * @author Charles Xie
 */
import {system} from "./Main";

export class ColorPickerContextMenu {

  getUi(): string {
    return `<menu id="colorpicker-context-menu" class="menu" style="width: 238px; z-index: 10000">
              <li class="menu-item">
                <div id="colorpicker" style="cursor: crosshair; margin: 1px 1px 1px 1px">
                  <canvas id="color-block" height="200" width="200"></canvas>
                  <canvas id="color-strip" height="200" width="30"></canvas>
                </div>
                <div style="display: table; margin: auto; padding: 5px 5px 5px 5px;">
                  <div id="colorpicker-label" style="vertical-align: middle; width: 40px; height: 20px; border: 2px solid black; display: inline-block;"></div>
                  <div class="divider"></div>
                  <button id="colorpicker-cancel-button" style="font: 12px Verdana">Cancel</button>
                  <div class="divider"></div>
                  <button id="colorpicker-ok-button" style="font: 12px Verdana">OK</button>
                </div>
              </li>
            </menu>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
    let cancelButton = document.getElementById("colorpicker-cancel-button") as HTMLButtonElement;
    cancelButton.onclick = function () {
      let menu = document.getElementById("colorpicker-context-menu") as HTMLMenuElement;
      menu.classList.remove("show-menu");
    };
    let okButton = document.getElementById("colorpicker-ok-button") as HTMLButtonElement;
    okButton.onclick = function () {
      system.rainbowHat.setSelectedRgbLedLightColor(system.colorPicker.rgbaColor);
      let menu = document.getElementById("colorpicker-context-menu") as HTMLMenuElement;
      menu.classList.remove("show-menu");
    };
  }

}
