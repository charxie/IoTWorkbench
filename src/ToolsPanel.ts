/*
 * @author Charles Xie
 */

// @ts-ignore
import raspberryPiImage from "./img/raspberry-pi.png";
// @ts-ignore
import rainbowHatImage from "./img/rainbow-hat.png";
// @ts-ignore
import senseHatImage from "./img/sense-hat.png";
// @ts-ignore
import unicornHatImage from "./img/unicorn-hat.png";
// @ts-ignore
import crickitHatImage from "./img/crickit-hat.png";
// @ts-ignore
import capacitiveTouchHatImage from "./img/capacitive-touch-hat.png";
// @ts-ignore
import panTiltHatImage from "./img/pan-tilt-hat.png";
// @ts-ignore
import fullBreadboardImage from "./img/full-breadboard.png";
// @ts-ignore
import halfBreadboardImage from "./img/half-breadboard.png";

export class ToolsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; vertical-align: top; margin-top: 0; background-color: lightgoldenrodyellow;
                padding: 10px 10px 10px 10px; border: 1px solid black; border-radius: 4px; box-shadow: 2px 2px 2px gray;">Components</h2>
            <hr>
            <div style="overflow-y: auto; height:360px;">
              <h3 style="text-align: left">Microcontrollers</h3>
              <div class="row" style="margin-right: 10px">
                <div class="column">
                  <img src="${raspberryPiImage}" id="raspberry-pi-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Raspberry Pi">
                </div>
              </div>
              <br><br>
              <h3 style="text-align: left">HATs</h3>
              <div class="row" style="margin-right: 10px">
                <div class="column">
                  <img src="${rainbowHatImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Rainbow HAT">
                  <img src="${senseHatImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Sense HAT">
                  <img src="${capacitiveTouchHatImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Capacitive Touch HAT">
               </div>
                <div class="column">
                  <img src="${unicornHatImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Unicorn HAT">
                  <img src="${crickitHatImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Crickit HAT">
                  <img src="${panTiltHatImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Pan-Tilt HAT">
               </div>
              </div>
              <br><br>
              <h3 style="text-align: left">Others</h3>
              <div class="row" style="margin-right: 10px">
                <div class="column">
                  <img src="${fullBreadboardImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Full Breadboard">
                </div>
                <div class="column">
                  <img src="${halfBreadboardImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Half Breadboard">
                </div>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
