/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class ArithmeticBlock extends Block {

  private readonly portA: Port;
  private readonly portB: Port;
  private readonly portR: Port;

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

  getCopy(): Block {
    return new ArithmeticBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height, this.name, this.symbol);
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

  private getResult(a, b): number {
    switch (this.name) {
      case "Add Block":
        return a + b;
      case "Subtract Block":
        return a - b;
      case "Multiply Block":
        return a * b;
      case "Divide Block":
        return a / b;
      case "Modulus Block":
        return a % b;
      case "Exponentiation Block":
        return a ** b;
      default:
        return NaN;
    }
  }

}
