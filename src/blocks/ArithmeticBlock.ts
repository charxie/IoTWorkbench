/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Complex} from "../math/Complex";
import {Vector} from "../math/Vector";
import {Matrix} from "../math/Matrix";

export class ArithmeticBlock extends Block {

  private readonly portA: Port;
  private readonly portB: Port;
  private readonly portR: Port;

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
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
    return new ArithmeticBlock(this.name + " #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
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
      case "Add Block":
        if (a instanceof Complex && b instanceof Complex) {
          return a.plus(b);
        }
        if (a instanceof Complex) {
          return a.plus(new Complex(b, 0));
        }
        if (b instanceof Complex) {
          return b.plus(new Complex(a, 0));
        }
        if (a instanceof Vector && b instanceof Vector) {
          return a.add(b);
        }
        if (a instanceof Vector && typeof b == "number") {
          return a.shift(b);
        }
        if (b instanceof Vector && typeof a == "number") {
          return b.shift(a);
        }
        return a + b;
      case "Subtract Block":
        if (a instanceof Complex && b instanceof Complex) {
          return a.minus(b);
        }
        if (a instanceof Complex) {
          return a.minus(new Complex(b, 0));
        }
        if (b instanceof Complex) {
          return new Complex(a, 0).minus(b);
        }
        if (a instanceof Vector && b instanceof Vector) {
          return a.subtract(b);
        }
        if (a instanceof Vector && typeof b == "number") {
          return a.shift(-b);
        }
        if (b instanceof Vector && typeof a == "number") {
          return b.negate().shift(a);
        }
        return a - b;
      case "Multiply Block":
        if (a instanceof Complex && b instanceof Complex) {
          return a.times(b);
        }
        if (a instanceof Complex) {
          return a.times(new Complex(b, 0));
        }
        if (b instanceof Complex) {
          return b.times(new Complex(a, 0));
        }
        if (a instanceof Vector && b instanceof Vector) {
          return a.cross(b);
        }
        if (a instanceof Vector && typeof b == "number") {
          return a.scale(b);
        }
        if (b instanceof Vector && typeof a == "number") {
          return b.scale(a);
        }
        if (a instanceof Matrix && b instanceof Vector) {
          return a.multiplyVector(b);
        }
        if (a instanceof Matrix && b instanceof Matrix) {
          return a.multiplyMatrix(b);
        }
        return a * b;
      case "Divide Block":
        if (a instanceof Complex && b instanceof Complex) {
          return a.divides(b);
        }
        if (a instanceof Complex) {
          return a.divides(new Complex(b, 0));
        }
        if (b instanceof Complex) {
          return new Complex(a, 0).divides(b);
        }
        if (a instanceof Vector && typeof b == "number") {
          return a.scale(1 / b);
        }
        return a / b;
      case "Modulus Block":
        return a % b;
      case "Exponentiation Block":
        return a ** b;
      case "Dot Product Block":
        if (a instanceof Vector && b instanceof Vector) {
          return a.dot(b);
        }
        if (a instanceof Vector && typeof b == "number") {
          return a.scale(b);
        }
        if (b instanceof Vector && typeof a == "number") {
          return b.scale(a);
        }
        return a * b;
      default:
        return NaN;
    }
  }

}
