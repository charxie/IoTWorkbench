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
// @ts-ignore
import redLedLightImage from "./img/red-led-light.png";
// @ts-ignore
import greenLedLightImage from "./img/green-led-light.png";
// @ts-ignore
import blueLedLightImage from "./img/blue-led-light.png";
// @ts-ignore
import tricolorLedLightImage from "./img/tricolor-led-light.png";
// @ts-ignore
import momentaryButtonImage from "./img/momentary-button.png";
// @ts-ignore
import toggleSwitchImage from "./img/toggle-switch.png";
// @ts-ignore
import piezoBuzzerImage from "./img/piezo-buzzer.png";

export class ComponentsPanel {

  getUi(): string {
    return `<h2 style="text-align: center; vertical-align: top; margin-top: 0;">
                <span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cubes"></i></span> Components</h2>
            <hr>
            <div id="components-scroller" style="overflow-y: auto; height: 360px;">
              <h3 style="text-align: left"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Microcontrollers</h3>
              <div class="row" style="margin-right: 10px; background-color: lightskyblue">
                <div class="column">
                  <img src="${raspberryPiImage}" id="raspberry-pi-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Raspberry Pi">
                </div>
              </div>
              <div class="vertical-divider"></div>
              <h3 style="text-align: left"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> HATs</h3>
              <div class="row" style="margin-right: 10px;  background-color: lightblue">
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
              <div class="vertical-divider"></div>
              <h3 style="text-align: left"><span style="font-size: 1.2em; color: teal; vertical-align: middle"><i class="fas fa-cube"></i></span> Others</h3>
              <div class="row" style="margin-right: 10px;  background-color: lightyellow">
                <div class="column">
                  <img src="${fullBreadboardImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Full Breadboard">
                  <img src="${redLedLightImage}" style="width:100%; cursor: pointer;" title="Red LED Light">
                  <img src="${greenLedLightImage}" style="width:100%; cursor: pointer;" title="Green LED Light">
                  <img src="${blueLedLightImage}" style="width:100%; cursor: pointer;" title="Blue LED Light">
                 <img src="${tricolorLedLightImage}" style="width:100%; cursor: pointer;" title="Tricolor LED Light">
                </div>
                <div class="column">
                  <img src="${halfBreadboardImage}" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Half Breadboard">
                  <img src="${momentaryButtonImage}" style="width:100%; cursor: pointer;" title="Momentary Button">
                  <img src="${toggleSwitchImage}" style="width:100%; cursor: pointer;" title="Toggle Switch">
                  <img src="${piezoBuzzerImage}" style="width:100%; cursor: pointer;" title="Piezo Buzzer">
                </div>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
  }

}
