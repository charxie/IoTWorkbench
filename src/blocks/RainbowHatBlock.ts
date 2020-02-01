/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {HatBlock} from "./HatBlock";
import {Block} from "./Block";
import {system} from "../Main";
import {RainbowHat} from "../components/RainbowHat";
import {Util} from "../Util";

export class RainbowHatBlock extends HatBlock {

  private readonly portPiezoBuzzer: Port;
  private readonly portButtonA: Port;
  private readonly portButtonB: Port;
  private readonly portButtonC: Port;
  private readonly portRedLed: Port;
  private readonly portGreenLed: Port;
  private readonly portBlueLed: Port;
  private readonly portTemperatureSensor: Port;
  private readonly portPressureSensor: Port;
  private readonly portRgbLeds: Port[];
  private readonly portDisplay: Port;
  private readonly portClock: Port;

  constructor(uid: string, x: number, y: number) {
    super(uid, x, y, 125, 250);
    this.name = "Rainbow HAT";
    this.color = "#A9A9A9";

    let dy = this.height / 14;
    this.portRedLed = new Port(this, true, "RL", 0, dy, false); // coordinates relative to this block
    this.portGreenLed = new Port(this, true, "GL", 0, 2 * dy, false);
    this.portBlueLed = new Port(this, true, "BL", 0, 3 * dy, false);
    this.portPiezoBuzzer = new Port(this, true, "PB", 0, 4 * dy, false);
    this.portRgbLeds = [];
    for (let i = 0; i < 7; i++) {
      let p = new Port(this, true, "L" + (i + 1), 0, (i + 5) * dy, false);
      this.portRgbLeds.push(p);
      this.ports.push(p);
    }
    this.portDisplay = new Port(this, true, "DP", 0, 12 * dy, false);
    this.portClock = new Port(this, true, "CK", 0, 13 * dy, false);
    this.ports.push(this.portRedLed);
    this.ports.push(this.portGreenLed);
    this.ports.push(this.portBlueLed);
    this.ports.push(this.portPiezoBuzzer);
    this.ports.push(this.portDisplay);
    this.ports.push(this.portClock);

    dy = this.height / 6;
    this.portTemperatureSensor = new Port(this, false, "TS", this.width, dy, true);
    this.portPressureSensor = new Port(this, false, "PS", this.width, 2 * dy, true);
    this.portButtonA = new Port(this, false, "BA", this.width, 3 * dy, true);
    this.portButtonB = new Port(this, false, "BB", this.width, 4 * dy, true);
    this.portButtonC = new Port(this, false, "BC", this.width, 5 * dy, true);

    this.ports.push(this.portTemperatureSensor);
    this.ports.push(this.portPressureSensor);
    this.ports.push(this.portButtonA);
    this.ports.push(this.portButtonB);
    this.ports.push(this.portButtonC);
  }

  getCopy(): Block {
    let block = new RainbowHatBlock(name + " #" + Date.now().toString(16), this.x, this.y);
    block.width = this.width;
    block.height = this.height;
    return block;
  }

  destroy(): void {
  }

  clearSensorData(): void {
    let id = "Rainbow HAT " + this.uid.substring(this.uid.indexOf("Block") + 5).trim();
    let hat = system.getHatById(id) as RainbowHat;
    if (hat != null) {
      hat.clearSensorData();
    }
  }

  refreshView(): void {
    super.refreshView();
    let dy = this.height / 14;
    this.portRedLed.setY(dy); // coordinates relative to this block
    this.portGreenLed.setY(2 * dy);
    this.portBlueLed.setY(3 * dy);
    this.portPiezoBuzzer.setY(4 * dy);
    for (let i = 0; i < 7; i++) {
      this.portRgbLeds[i].setY((i + 5) * dy);
    }
    this.portDisplay.setY(12 * dy);
    this.portClock.setY(13 * dy);
    dy = this.height / 6;
    this.portTemperatureSensor.setX(this.width);
    this.portTemperatureSensor.setY(dy);
    this.portPressureSensor.setX(this.width);
    this.portPressureSensor.setY(2 * dy);
    this.portButtonA.setX(this.width);
    this.portButtonA.setY(3 * dy);
    this.portButtonB.setX(this.width);
    this.portButtonB.setY(4 * dy);
    this.portButtonC.setX(this.width);
    this.portButtonC.setY(5 * dy);
  }

  updateModel(): void {
    let id = "Rainbow HAT " + this.uid.substring(this.uid.indexOf("Block") + 5).trim();
    let hat = system.getHatById(id) as RainbowHat;
    if (hat != null) {
      // sensors
      this.portTemperatureSensor.setValue(hat.temperatureSensor.data);
      this.portPressureSensor.setValue(hat.barometricPressureSensor.data);

      // buttons
      this.portButtonA.setValue(hat.buttonA.isSelected());
      this.portButtonB.setValue(hat.buttonB.isSelected());
      this.portButtonC.setValue(hat.buttonC.isSelected());

      // rgb LED lights
      let rgbaLeds = [];
      for (let i = 0; i < 7; i++) {
        let v = this.portRgbLeds[i].getValue();
        rgbaLeds.push(v);
        hat.rgbLedLights[i].color = v !== undefined ? Util.rgbaToHex(v[0], v[1], v[2], v[3]) : "#000000";
      }

      this.updateConnectors();

      // update the cyber twin
      let inputRedLed = this.portRedLed.getValue();
      let inputGreenLed = this.portGreenLed.getValue();
      let inputBlueLed = this.portBlueLed.getValue();
      hat.redLedLight.on = inputRedLed;
      hat.greenLedLight.on = inputGreenLed;
      hat.blueLedLight.on = inputBlueLed;
      hat.draw();

      // update the physical twin
      let rgbArray = []; // TODO: alpha not supported yet, so we can't use rgbaLeds directly
      for (let rgba of rgbaLeds) {
        if (rgba === undefined) {
          rgbArray.push([0, 0, 0]);
        } else {
          rgbArray.push([rgba[0], rgba[1], rgba[2]]);
        }
      }
      hat.updateFirebase({
        rainbowRgb: rgbArray,
        redLed: inputRedLed ? inputRedLed : false,
        greenLed: inputGreenLed ? inputGreenLed : false,
        blueLed: inputBlueLed ? inputBlueLed : false
      });
    }
  }

}
