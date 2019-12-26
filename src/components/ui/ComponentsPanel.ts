/*
 * @author Charles Xie
 */

// @ts-ignore
import raspberryPiImage from "../../img/raspberry-pi.png";
// @ts-ignore
import rainbowHatImage from "../../img/rainbow-hat.png";
// @ts-ignore
import senseHatImage from "../../img/sense-hat.png";
// @ts-ignore
import unicornHatImage from "../../img/unicorn-hat.png";
// @ts-ignore
import crickitHatImage from "../../img/crickit-hat.png";
// @ts-ignore
import capacitiveTouchHatImage from "../../img/capacitive-touch-hat.png";
// @ts-ignore
import panTiltHatImage from "../../img/pan-tilt-hat.png";
// @ts-ignore
import fullBreadboardImage from "../../img/full-breadboard.png";
// @ts-ignore
import halfBreadboardImage from "../../img/half-breadboard.png";
// @ts-ignore
import redLedLightImage from "../../img/red-led-light.png";
// @ts-ignore
import greenLedLightImage from "../../img/green-led-light.png";
// @ts-ignore
import blueLedLightImage from "../../img/blue-led-light.png";
// @ts-ignore
import tricolorLedLightImage from "../../img/tricolor-led-light.png";
// @ts-ignore
import momentaryButtonImage from "../../img/momentary-button.png";
// @ts-ignore
import toggleSwitchImage from "../../img/toggle-switch.png";
// @ts-ignore
import piezoBuzzerImage from "../../img/piezo-buzzer.png";

export class ComponentsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; font-size: 18px; vertical-align: top; margin-top: 0; margin-bottom: 10px">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle;"><i class="fas fa-cubes"></i></span> Components</h2>
            <div id="components-scroller" style="overflow-y: auto; height: 400px; margin-top: 0; border-bottom: 2px solid lightgray; border-top: 2px solid lightgray">
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Microcontrollers</h3>
              <div class="row" style="margin-right: 10px; background-color: lightskyblue; border: 1px solid #b81900; border-radius: 4px">
                <div class="column">
                  <img src="${raspberryPiImage}" draggable="true" id="raspberry-pi-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Raspberry Pi" alt="Raspberry Pi">
                </div>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> HATs</h3>
              <div class="row" style="margin-right: 10px;  background-color: lightblue; border: 1px solid #b81900; border-radius: 4px">
                <div class="column">
                  <img src="${rainbowHatImage}" draggable="true" id="rainbow-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Rainbow HAT" alt="Rainbow HAT">
                  <img src="${senseHatImage}" draggable="true" id="sense-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Sense HAT" alt="Sense HAT">
                  <img src="${capacitiveTouchHatImage}" draggable="true" id="capacitive-touch-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Capacitive Touch HAT" alt="Capacitive Touch HAT">
               </div>
                <div class="column">
                  <img src="${unicornHatImage}" draggable="true" id="unicorn-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Unicorn HAT" alt="Unicorn HAT">
                  <img src="${crickitHatImage}" draggable="true" id="crickit-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Crickit HAT" alt="Crickit HAT">
                  <img src="${panTiltHatImage}" draggable="true" id="pan-tilt-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Pan-Tilt HAT" alt="Pan-Tilt HAT">
               </div>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left; font-size: 12px;"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Others</h3>
              <div class="row" style="margin-right: 10px;  background-color: lightyellow; border: 1px solid #b81900; border-radius: 4px">
                <div class="column">
                  <img src="${fullBreadboardImage}" draggable="true" id="full-breadboard-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Full Breadboard" alt="Full Breadboard">
                  <img src="${redLedLightImage}" draggable="true" id="red-led-light-image" style="width:100%; cursor: pointer;" title="Red LED Light" alt="Red LED Light">
                  <img src="${greenLedLightImage}" draggable="true" id="green-led-light-image" style="width:100%; cursor: pointer;" title="Green LED Light" alt="Green LED Light">
                  <img src="${blueLedLightImage}" draggable="true" id="blue-led-light-image" style="width:100%; cursor: pointer;" title="Blue LED Light" alt="Blue LED Light">
                 <img src="${tricolorLedLightImage}" draggable="true" id="tricolor-led-light-image" style="width:100%; cursor: pointer;" title="Tricolor LED Light" alt="Tricolor LED Light">
                </div>
                <div class="column">
                  <img src="${halfBreadboardImage}" draggable="true" id="half-breadboard-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Half Breadboard" alt="Half Breadboard">
                  <img src="${momentaryButtonImage}" draggable="true" id="momentary-button-image" style="width:100%; cursor: pointer;" title="Momentary Button" alt="Momentary Button">
                  <img src="${toggleSwitchImage}" draggable="true" id="toggle-switch-image" style="width:100%; cursor: pointer;" title="Toggle Switch" alt="Toggle Switch">
                  <img src="${piezoBuzzerImage}" draggable="true" id="piezo-buzzer-image" style="width:100%; cursor: pointer;" title="Piezo Buzzer" alt="Piezo Buzzer">
                </div>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
