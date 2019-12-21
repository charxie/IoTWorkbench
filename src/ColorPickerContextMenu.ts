/*
 * @author Charles Xie
 */
import {system} from "./Main";
import {RainbowHat} from "./components/RainbowHat";

export class ColorPickerContextMenu {

  rainbowHat: RainbowHat;
  id: string = "colorpicker-context-menu";

  getUi(): string {
    return `<menu id="${this.id}" class="menu" style="width: 338px; z-index: 10000;">
              <li class="menu-item">
                <div id="colorpicker-title" style="text-align: center; padding: 4px; font-family: inherit; font-size: 14px;"></div>
                <div id="colorpicker" style="cursor: crosshair; margin: 1px 1px 1px 1px">
                  <canvas id="color-block" height="300" width="300"></canvas>
                  <canvas id="color-strip" height="300" width="30"></canvas>
                </div>
                <div style="display: table; margin: auto; padding: 5px 5px 5px 5px;">
                  <input type="text" readonly id="colorpicker-hex-code" value="#FFFFFF" style="width: 60px; height: 20px; border: 1px solid black; vertical-align: middle; text-align: center; font: 12px Verdana;">
                  <div class="horizontal-divider"></div>
                  <div id="colorpicker-label" style="vertical-align: middle; width: 20px; height: 20px; border: 2px solid black; display: inline-block;"></div>
                  <div class="horizontal-divider"></div>
                  <button id="colorpicker-cancel-button" style="font: 12px Verdana">Cancel</button>
                  <div class="horizontal-divider"></div>
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
      let menu = document.getElementById(that.id) as HTMLMenuElement;
      menu.classList.remove("show-menu");
    };
    let okButton = document.getElementById("colorpicker-ok-button") as HTMLButtonElement;
    let that = this;
    okButton.onclick = function () {
      if (that.rainbowHat) {
        that.rainbowHat.setSelectedRgbLedLightColor(system.colorPicker.getSelectedColor());
      }
      let menu = document.getElementById(that.id) as HTMLMenuElement;
      menu.classList.remove("show-menu");
    };
    // prevent the mouse event from being propagated to the playground
    let menu = document.getElementById(this.id);
    menu.onmousedown = function (e) {
      e.stopPropagation();
    };
    menu.onmouseup = function (e) {
      e.stopPropagation();
    };
    menu.onmousemove = function (e) {
      e.stopPropagation();
    };
  }

}
