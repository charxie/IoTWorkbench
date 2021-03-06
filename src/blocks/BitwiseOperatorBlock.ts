/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class BitwiseOperatorBlock extends Block {

  private readonly portA: Port;
  private readonly portB: Port;
  private readonly portR: Port;

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#09F";
    this.portA = new Port(this, true, "A", 0, this.height / 3, false);
    this.portB = new Port(this, true, "B", 0, this.height * 2 / 3, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portA);
    this.ports.push(this.portB);
    this.ports.push(this.portR);
  }

  getCopy(): Block {
    return new BitwiseOperatorBlock(this.name + " #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
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
    let a = this.portA.getValue();
    let b = this.portB.getValue();
    if (Array.isArray(a) && Array.isArray(b)) {
      let c = new Array(Math.max(a.length, b.length));
      for (let i = 0; i < c.length; i++) {
        c[i] = this.getResult(i < a.length ? a[i] : 0, i < b.length ? b[i] : 0);
      }
      this.portR.setValue(c);
    } else {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      this.portR.setValue(this.getResult(a, b));
    }
    this.updateConnectors();
  }

  private getResult(a, b): any {
    switch (this.name) {
      case "Bitwise AND Block":
        return a & b;
      case "Bitwise OR Block":
        return a | b;
      case "Bitwise XOR Block":
        return a ^ b;
      case "Bitwise NOT Block":
        return ~a;
      case "Bitwise Left Shift Block":
        return a << b;
      case "Bitwise Signed Right Shift Block":
        return a >> b;
      case "Bitwise Zero-Fill Right Shift Block":
        return a >>> b;
      default:
        return NaN;
    }
  }

}
