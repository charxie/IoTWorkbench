/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {HatBlock} from "./HatBlock";

export class RainbowHatBlock extends HatBlock {

  private portPiezoBuzzer: Port;
  private portButtonA: Port;
  private portButtonB: Port;
  private portButtonC: Port;
  private portRedLed: Port;
  private portGreenLed: Port;
  private portBlueLed: Port;
  private portTemperatureSensor: Port;
  private portPressureSensor: Port;
  private portRgbLed1: Port;
  private portRgbLed2: Port;
  private portRgbLed3: Port;
  private portRgbLed4: Port;
  private portRgbLed5: Port;
  private portRgbLed6: Port;
  private portRgbLed7: Port;
  private portDisplay: Port;

  constructor(uid: string, x: number, y: number) {
    super(uid, x, y, 125, 250);
    this.name = "Rainbow HAT";
    this.color = "#808000";

    let dy = this.height / 11;
    this.portPiezoBuzzer = new Port(this, true, "PB", this.width, dy, true); // coordinates relative to this block
    this.portButtonA = new Port(this, false, "BA", this.width, 2 * dy, true);
    this.portButtonB = new Port(this, false, "BB", this.width, 3 * dy, true);
    this.portButtonC = new Port(this, false, "BC", this.width, 4 * dy, true);
    this.portRedLed = new Port(this, true, "RL", this.width, 5 * dy, true);
    this.portGreenLed = new Port(this, true, "GL", this.width, 6 * dy, true);
    this.portBlueLed = new Port(this, true, "BL", this.width, 7 * dy, true);
    this.portTemperatureSensor = new Port(this, false, "TS", this.width, 8 * dy, true);
    this.portPressureSensor = new Port(this, false, "PS", this.width, 9 * dy, true);
    this.portRgbLed1 = new Port(this, true, "L1", 0, dy, false);
    this.portRgbLed2 = new Port(this, true, "L2", 0, 2 * dy, false);
    this.portRgbLed3 = new Port(this, true, "L3", 0, 3 * dy, false);
    this.portRgbLed4 = new Port(this, true, "L4", 0, 4 * dy, false);
    this.portRgbLed5 = new Port(this, true, "L5", 0, 5 * dy, false);
    this.portRgbLed6 = new Port(this, true, "L6", 0, 6 * dy, false);
    this.portRgbLed7 = new Port(this, true, "L7", 0, 7 * dy, false);
    this.portDisplay = new Port(this, true, "DP", 0, 8 * dy, false);

    this.ports.push(this.portPiezoBuzzer);
    this.ports.push(this.portButtonA);
    this.ports.push(this.portButtonB);
    this.ports.push(this.portButtonC);
    this.ports.push(this.portRedLed);
    this.ports.push(this.portGreenLed);
    this.ports.push(this.portBlueLed);
    this.ports.push(this.portTemperatureSensor);
    this.ports.push(this.portPressureSensor);
    this.ports.push(this.portRgbLed1);
    this.ports.push(this.portRgbLed2);
    this.ports.push(this.portRgbLed3);
    this.ports.push(this.portRgbLed4);
    this.ports.push(this.portRgbLed5);
    this.ports.push(this.portRgbLed6);
    this.ports.push(this.portRgbLed7);
    this.ports.push(this.portDisplay);
  }

  refresh(): void {
    super.refresh();
  }

  update(): void {
    super.update();
  }

}
