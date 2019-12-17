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
import longBreadboardImage from "./img/long-breadboard.png";

export class ToolsPanel {

  getUi(): string {
    return `<h2 style="text-align: left; vertical-align: top; margin-top: 0; background-color: lightgoldenrodyellow;
                padding: 10px 10px 10px 10px; border: 1px solid black; border-radius: 4px; box-shadow: 2px 2px 2px gray;">Components</h2>
            <hr>
            <div style="overflow-y: auto; height:360px;">
              <h3 style="text-align: left">Microcontrollers</h3>
              <div class="row">
                <div class="column">
                  <img src="./img/raspberry-pi.png" id="raspberry-pi-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Raspberry Pi">
                </div>
              </div>
              <br><br>
              <h3 style="text-align: left">HATs</h3>
              <div class="row">
                <div class="column">
                  <img id="rainbow-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Rainbow HAT">
                  <img id="sense-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Sense HAT">
                  <img id="capacitive-touch-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Capacitive Touch HAT">
               </div>
                <div class="column">
                  <img id="unicorn-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Unicorn HAT">
                  <img id="crickit-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Crickit HAT">
                  <img id="pan-tilt-hat-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Pan-Tilt HAT">
               </div>
              </div>
              <br><br>
              <h3 style="text-align: left">Others</h3>
              <div class="row">
                <div class="column">
                  <img id="long-breadboard-image" style="width:100%; cursor: pointer; box-shadow: 5px 5px 5px gray;" title="Long Breadboard">
                </div>
              </div>
            </div>`;
  }

  render(selectorId: string): void {
    let element = document.getElementById(selectorId);
    element.innerHTML = this.getUi();
    let image = document.getElementById("raspberry-pi-image") as HTMLImageElement;
    image.src = raspberryPiImage;
    image = document.getElementById("rainbow-hat-image") as HTMLImageElement;
    image.src = rainbowHatImage;
    image = document.getElementById("sense-hat-image") as HTMLImageElement;
    image.src = senseHatImage;
    image = document.getElementById("unicorn-hat-image") as HTMLImageElement;
    image.src = unicornHatImage;
    image = document.getElementById("crickit-hat-image") as HTMLImageElement;
    image.src = crickitHatImage;
    image = document.getElementById("capacitive-touch-hat-image") as HTMLImageElement;
    image.src = capacitiveTouchHatImage;
    image = document.getElementById("pan-tilt-hat-image") as HTMLImageElement;
    image.src = panTiltHatImage;
    image = document.getElementById("long-breadboard-image") as HTMLImageElement;
    image.src = longBreadboardImage;
  }

}
