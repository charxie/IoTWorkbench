/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {flowchart} from "../Main";

export class MathBlock extends Block {

  private portA: Port;
  private portB: Port;
  private portR: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#008080";
    this.portA = new Port(this, true, "A", 0, this.height / 3, false);
    this.portB = new Port(this, true, "B", 0, this.height * 2 / 3, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portA);
    this.ports.push(this.portB);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  refreshView(): void {
    this.portA.setY(this.height / 3);
    this.portB.setY(this.height * 2 / 3);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    let a = this.portA.getValue();
    let b = this.portB.getValue();
    switch (this.name) {
      case "Add Block":
        this.portR.setValue(a + b);
        break;
      case "Subtract Block":
        this.portR.setValue(a - b);
        break;
      case "Multiply Block":
        this.portR.setValue(a * b);
        break;
      case "Divide Block":
        this.portR.setValue(a / b);
        break;
      case "Modulus Block":
        this.portR.setValue(a % b);
        break;
      case "Exponentiation Block":
        this.portR.setValue(a ** b);
        break;
    }
    this.updateConnectors();
  }

}
