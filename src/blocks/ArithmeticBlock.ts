/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Complex} from "../math/Complex";
import {MyVector} from "../math/MyVector";
import {Matrix} from "../math/Matrix";
import {Util} from "../Util";

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
    this.hasError = false;
    let a = this.portA.getValue();
    let b = this.portB.getValue();
    if (Array.isArray(a) && Array.isArray(b)) {
      let c = new Array(Math.max(a.length, b.length));
      for (let i = 0; i < c.length; i++) {
        c[i] = this.getResult(i < a.length ? a[i] : 0, i < b.length ? b[i] : 0);
      }
      this.portR.setValue(c);
    } else {
      if (a !== undefined && b !== undefined) {
        try {
          this.portR.setValue(this.getResult(a, b));
        } catch (e) {
          console.log(e.stack);
          Util.showBlockError(e.toString());
          this.hasError = true;
        }
      }
    }
    this.updateConnectors();
  }

  private getResult(a, b): any {
    switch (this.name) {
      case "Add Block":
        if (Array.isArray(a) && typeof b === "number") {
          return a.map(x => {
            return x + b;
          });
        }
        if (typeof a === "number" && Array.isArray(b)) {
          return b.map(x => {
            return a + x;
          });
        }
        if (typeof a === "number" && typeof b === "number") {
          return a + b;
        }
        if (a instanceof Complex && b instanceof Complex) {
          return a.plus(b);
        }
        if (a instanceof Complex && typeof b === "number") {
          return a.plus(new Complex(b, 0));
        }
        if (b instanceof Complex && typeof a === "number") {
          return b.plus(new Complex(a, 0));
        }
        if (a instanceof MyVector && b instanceof MyVector) {
          return a.add(b);
        }
        if (a instanceof MyVector && typeof b === "number") {
          return a.shift(b);
        }
        if (b instanceof MyVector && typeof a === "number") {
          return b.shift(a);
        }
        if (a instanceof Matrix && b instanceof Matrix) {
          return a.addMatrix(b);
        }
        if (a instanceof Matrix && typeof b === "number") {
          return a.shiftMatrix(b);
        }
        if (b instanceof Matrix && typeof a === "number") {
          return b.shiftMatrix(a);
        }
        throw new Error("Cannot add " + b + " to " + a);
      case "Subtract Block":
        if (Array.isArray(a) && typeof b === "number") {
          return a.map(x => {
            return x - b;
          });
        }
        if (typeof a === "number" && Array.isArray(b)) {
          return b.map(x => {
            return a - x;
          });
        }
        if (typeof a === "number" && typeof b === "number") {
          return a - b;
        }
        if (a instanceof Complex && b instanceof Complex) {
          return a.minus(b);
        }
        if (a instanceof Complex && typeof b === "number") {
          return a.minus(new Complex(b, 0));
        }
        if (b instanceof Complex && typeof a === "number") {
          return new Complex(a, 0).minus(b);
        }
        if (a instanceof MyVector && b instanceof MyVector) {
          return a.subtract(b);
        }
        if (a instanceof MyVector && typeof b === "number") {
          return a.shift(-b);
        }
        if (b instanceof MyVector && typeof a === "number") {
          return b.negate().shift(a);
        }
        if (a instanceof Matrix && b instanceof Matrix) {
          return a.subtractMatrix(b);
        }
        if (a instanceof Matrix && typeof b === "number") {
          return a.shiftMatrix(-b);
        }
        if (b instanceof Matrix && typeof a === "number") {
          return b.negateMatrix().shiftMatrix(a);
        }
        throw new Error("Cannot subtract " + b + " from " + a);
      case "Multiply Block":
        if (Array.isArray(a) && typeof b === "number") {
          return a.map(x => {
            return x * b;
          });
        }
        if (typeof a === "number" && Array.isArray(b)) {
          return b.map(x => {
            return a * x;
          });
        }
        if (typeof a === "number" && typeof b === "number") {
          return a * b;
        }
        if (a instanceof Complex && b instanceof Complex) {
          return a.times(b);
        }
        if (a instanceof Complex && typeof b === "number") {
          return a.times(new Complex(b, 0));
        }
        if (b instanceof Complex && typeof a === "number") {
          return b.times(new Complex(a, 0));
        }
        if (a instanceof MyVector && b instanceof MyVector) {
          return a.cross(b);
        }
        if (a instanceof MyVector && typeof b === "number") {
          return a.scale(b);
        }
        if (b instanceof MyVector && typeof a === "number") {
          return b.scale(a);
        }
        if (a instanceof Matrix && b instanceof MyVector) {
          return a.multiplyVector(b);
        }
        if (a instanceof Matrix && b instanceof Matrix) {
          return a.multiplyMatrix(b);
        }
        if (a instanceof Matrix && typeof b === "number") {
          return a.scaleMatrix(b);
        }
        if (b instanceof Matrix && typeof a === "number") {
          return b.scaleMatrix(a);
        }
        throw new Error("Cannot multiply " + a + " by " + b);
      case "Divide Block":
        if (Array.isArray(a) && typeof b === "number") {
          return a.map(x => {
            return x / b;
          });
        }
        if (typeof a === "number" && Array.isArray(b)) {
          return b.map(x => {
            return a / x;
          });
        }
        if (typeof a === "number" && typeof b === "number") {
          return a / b;
        }
        if (a instanceof Complex && b instanceof Complex) {
          return a.divides(b);
        }
        if (a instanceof Complex && typeof b === "number") {
          return a.divides(new Complex(b, 0));
        }
        if (b instanceof Complex && typeof a === "number") {
          return new Complex(a, 0).divides(b);
        }
        if (a instanceof MyVector && typeof b === "number") {
          return a.scale(1 / b);
        }
        if (b instanceof MyVector) {
          throw new Error("A vector cannot be divided.");
        }
        if (a instanceof Matrix && typeof b === "number") {
          return a.scaleMatrix(1 / b);
        }
        if (b instanceof Matrix) {
          throw new Error("A matrix cannot be divided.");
        }
        throw new Error("Cannot divide " + a + " by " + b);
      case "Modulus Block":
        if (Array.isArray(a) && typeof b === "number") {
          return a.map(x => {
            return x % b;
          });
        }
        if (typeof a === "number" && Array.isArray(b)) {
          return b.map(x => {
            return a % x;
          });
        }
        if (typeof a === "number" && typeof b === "number") {
          return a % b;
        }
        if (a instanceof MyVector && typeof b === "number") {
          return a.modulus(b);
        }
        if (a instanceof Matrix && typeof b === "number") {
          return a.modulusMatrix(b);
        }
        throw new Error("Modulus of " + a + " and " + b + " is not supported");
      case "Exponentiation Block":
        if (typeof a === "number" && typeof b === "number") {
          return a ** b;
        }
        throw new Error("Expoentiaation of " + a + " by " + b + " is not supported");
      case "Dot Product Block":
        if (a instanceof MyVector && b instanceof MyVector) {
          return a.dot(b);
        }
        throw new Error("Dot product of " + a + " and " + b + " is not supported");
      default:
        return NaN;
    }
  }

}
