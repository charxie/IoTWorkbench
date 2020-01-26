/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {HatBlock} from "./HatBlock";
import {Block} from "./Block";
import {system} from "../Main";

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
  private readonly portRgbLed1: Port;
  private readonly portRgbLed2: Port;
  private readonly portRgbLed3: Port;
  private readonly portRgbLed4: Port;
  private readonly portRgbLed5: Port;
  private readonly portRgbLed6: Port;
  private readonly portRgbLed7: Port;
  private readonly portDisplay: Port;

  constructor(uid: string, x: number, y: number) {
    super(uid, x, y, 125, 250);
    this.name = "Rainbow HAT";
    this.color = "#A9A9A9";

    let dy = this.height / 13;
    this.portRedLed = new Port(this, true, "RL", 0, dy, false); // coordinates relative to this block
    this.portGreenLed = new Port(this, true, "GL", 0, 2 * dy, false);
    this.portBlueLed = new Port(this, true, "BL", 0, 3 * dy, false);
    this.portPiezoBuzzer = new Port(this, true, "PB", 0, 4 * dy, false);
    this.portRgbLed1 = new Port(this, true, "L1", 0, 5 * dy, false);
    this.portRgbLed2 = new Port(this, true, "L2", 0, 6 * dy, false);
    this.portRgbLed3 = new Port(this, true, "L3", 0, 7 * dy, false);
    this.portRgbLed4 = new Port(this, true, "L4", 0, 8 * dy, false);
    this.portRgbLed5 = new Port(this, true, "L5", 0, 9 * dy, false);
    this.portRgbLed6 = new Port(this, true, "L6", 0, 10 * dy, false);
    this.portRgbLed7 = new Port(this, true, "L7", 0, 11 * dy, false);
    this.portDisplay = new Port(this, true, "DP", 0, 12 * dy, false);

    this.ports.push(this.portRedLed);
    this.ports.push(this.portGreenLed);
    this.ports.push(this.portBlueLed);
    this.ports.push(this.portPiezoBuzzer);
    this.ports.push(this.portRgbLed1);
    this.ports.push(this.portRgbLed2);
    this.ports.push(this.portRgbLed3);
    this.ports.push(this.portRgbLed4);
    this.ports.push(this.portRgbLed5);
    this.ports.push(this.portRgbLed6);
    this.ports.push(this.portRgbLed7);
    this.ports.push(this.portDisplay);

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
    return new RainbowHatBlock(name + " #" + Date.now().toString(16), this.x, this.y);
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    let dy = this.height / 13;
    this.portRedLed.setY(dy); // coordinates relative to this block
    this.portGreenLed.setY(2 * dy);
    this.portBlueLed.setY(3 * dy);
    this.portPiezoBuzzer.setY(4 * dy);
    this.portRgbLed1.setY(5 * dy);
    this.portRgbLed2.setY(6 * dy);
    this.portRgbLed3.setY(7 * dy);
    this.portRgbLed4.setY(8 * dy);
    this.portRgbLed5.setY(9 * dy);
    this.portRgbLed6.setY(10 * dy);
    this.portRgbLed7.setY(11 * dy);
    this.portDisplay.setY(12 * dy);
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
    let hat = system.getHatById(id);
    if (hat != null) {
      let inputRedLed = this.portRedLed.getValue();
      let inputGreenLed = this.portGreenLed.getValue();
      let inputBlueLed = this.portBlueLed.getValue();
      hat.updateFirebase({
        redLed: inputRedLed ? inputRedLed : false,
        greenLed: inputGreenLed ? inputGreenLed : false,
        blueLed: inputBlueLed ? inputBlueLed : false
      });
    }
  }

}
