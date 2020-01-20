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

  getCopy(): Block {
    return new LogicBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height, this.name, this.symbol);
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.portA.setY(this.height / 3);
    this.portB.setY(this.height * 2 / 3);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    let av = this.portA.getValue();
    let bv = this.portB.getValue();
    if (av != undefined && bv != undefined) {
      let a: boolean = typeof av == "boolean" ? av : (av ? av != 0 : false);
      let b: boolean = typeof bv == "boolean" ? bv : (bv ? bv != 0 : false);
      switch (this.name) {
        case "AND Block":
          this.portR.setValue(a && b);
          break;
        case "OR Block":
          this.portR.setValue(a || b);
          break;
        case "XOR Block":
          this.portR.setValue((a && !b) || (!a && b));
          break;
        case "NOR Block":
          this.portR.setValue(!(a || b));
          break;
        case "XNOR Block":
          this.portR.setValue(a == b);
          break;
      }
    } else {
      this.portR.setValue(undefined);
    }
    this.updateConnectors();
  }

}
