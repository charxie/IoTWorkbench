/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MyComplex} from "../math/MyComplex";
import {MyVector} from "../math/MyVector";
import {MyMatrix} from "../math/MyMatrix";
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
      if (Array.isArray(a[0]) && Array.isArray(b[0])) {
        if (b.length === 1) { // MV
          let m = new MyMatrix(a[0].length, a.length);
          let v = new MyVector(b[0].length);
          m.setValues(a);
          v.setValues(b[0]);
          try {
            this.portR.setValue(this.getResult(m, v));
          } catch (e) {
            console.log(e.stack);
            Util.showBlockError(e.toString());
            this.hasError = true;
          }
        } else if (a.length === 1) { // VM
          Util.showBlockError("VxM not supported");
          this.hasError = true;
        } else { // MM
          let m1 = new MyMatrix(a.length, a[0].length);
          let m2 = new MyMatrix(b.length, b[0].length);
          m1.setValues(a);
          m2.setValues(b);
          try {
            this.portR.setValue(this.getResult(m1, m2));
          } catch (e) {
            console.log(e.stack);
            Util.showBlockError(e.toString());
            this.hasError = true;
          }
        }
      } else if (Array.isArray(a[0]) && !Array.isArray(b[0])) { // MV
        let m = new MyMatrix(a[0].length, a.length);
        let v = new MyVector(b.length);
        m.setValues(a);
        v.setValues(b);
        try {
          this.portR.setValue(this.getResult(m, v));
        } catch (e) {
          console.log(e.stack);
          Util.showBlockError(e.toString());
          this.hasError = true;
        }
      } else if (!Array.isArray(a[0]) && Array.isArray(b[0])) { // VM
        Util.showBlockError("VxM not supported");
        this.hasError = true;
      } else {
        let c = new Array(Math.max(a.length, b.length)); // VV
        for (let i = 0; i < c.length; i++) {
          c[i] = this.getResult(i < a.length ? a[i] : 0, i < b.length ? b[i] : 0);
        }
        this.portR.setValue(c);
      }
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
        if (a instanceof MyComplex && b instanceof MyComplex) {
          return a.plus(b);
        }
        if (a instanceof MyComplex && typeof b === "number") {
          return a.plus(new MyComplex(b, 0));
        }
        if (b instanceof MyComplex && typeof a === "number") {
          return b.plus(new MyComplex(a, 0));
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
        if (a instanceof MyMatrix && b instanceof MyMatrix) {
          return a.addMatrix(b);
        }
        if (a instanceof MyMatrix && typeof b === "number") {
          return a.shiftMatrix(b);
        }
        if (b instanceof MyMatrix && typeof a === "number") {
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
        if (a instanceof MyComplex && b instanceof MyComplex) {
          return a.minus(b);
        }
        if (a instanceof MyComplex && typeof b === "number") {
          return a.minus(new MyComplex(b, 0));
        }
        if (b instanceof MyComplex && typeof a === "number") {
          return new MyComplex(a, 0).minus(b);
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
        if (a instanceof MyMatrix && b instanceof MyMatrix) {
          return a.subtractMatrix(b);
        }
        if (a instanceof MyMatrix && typeof b === "number") {
          return a.shiftMatrix(-b);
        }
        if (b instanceof MyMatrix && typeof a === "number") {
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
        if (a instanceof MyComplex && b instanceof MyComplex) {
          return a.times(b);
        }
        if (a instanceof MyComplex && typeof b === "number") {
          return a.times(new MyComplex(b, 0));
        }
        if (b instanceof MyComplex && typeof a === "number") {
          return b.times(new MyComplex(a, 0));
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
        if (a instanceof MyMatrix && b instanceof MyVector) {
          return a.multiplyVector(b);
        }
        if (a instanceof MyMatrix && b instanceof MyMatrix) {
          return a.multiplyMatrix(b);
        }
        if (a instanceof MyMatrix && typeof b === "number") {
          return a.scaleMatrix(b);
        }
        if (b instanceof MyMatrix && typeof a === "number") {
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
        if (a instanceof MyComplex && b instanceof MyComplex) {
          return a.divide(b);
        }
        if (a instanceof MyComplex && typeof b === "number") {
          return a.divide(new MyComplex(b, 0));
        }
        if (b instanceof MyComplex && typeof a === "number") {
          return new MyComplex(a, 0).divide(b);
        }
        if (a instanceof MyVector && typeof b === "number") {
          return a.scale(1 / b);
        }
        if (b instanceof MyVector) {
          throw new Error("A vector cannot be divided.");
        }
        if (a instanceof MyMatrix && typeof b === "number") {
          return a.scaleMatrix(1 / b);
        }
        if (b instanceof MyMatrix) {
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
        if (a instanceof MyMatrix && typeof b === "number") {
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
