/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class LogicBlock extends Block {

  private readonly portA: Port;
  private readonly portB: Port;
  private readonly portR: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#B8860B";
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
    let a: boolean = this.portA.getValue() != 0;
    let b: boolean = this.portB.getValue() != 0;
    switch (this.name) {
      case "AND Block":
        this.portR.setValue((a && b) ? 1 : 0);
        break;
      case "OR Block":
        this.portR.setValue((a || b) ? 1 : 0);
        break;
      case "XOR Block":
        this.portR.setValue(((a && !b) || (!a && b)) ? 1 : 0);
        break;
      case "NOR Block":
        this.portR.setValue(a || b ? 0 : 1);
        break;
      case "XNOR Block":
        this.portR.setValue(a == b ? 1 : 0);
        break;
    }
    this.updateConnectors();
  }

}
