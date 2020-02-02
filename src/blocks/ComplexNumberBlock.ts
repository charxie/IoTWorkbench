/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Complex} from "../math/Complex";

export class ComplexNumberBlock extends Block {

  private readonly portR: Port;
  private readonly portI: Port;
  private readonly portC: Port;
  private real: number = 0;
  private imaginary: number = 0;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly real: number;
    readonly imaginary: number;

    constructor(b: ComplexNumberBlock) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.real = b.real;
      this.imaginary = b.imaginary;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.source = true;
    this.name = name;
    this.symbol = symbol;
    this.color = "#BDB76B";
    this.portR = new Port(this, true, "R", 0, this.height / 3, false);
    this.portI = new Port(this, true, "I", 0, this.height * 2 / 3, false);
    this.portC = new Port(this, false, "C", this.width, this.height / 2, true);
    this.ports.push(this.portR);
    this.ports.push(this.portI);
    this.ports.push(this.portC);
    this.margin = 15;
    this.portC.setValue(new Complex(0, 0));
  }

  getCopy(): Block {
    let b = new ComplexNumberBlock("Complex Number Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height, this.name, this.symbol);
    b.real = this.real;
    b.imaginary = this.imaginary;
    return b;
  }

  destroy(): void {
  }

  getReal(): number {
    return this.real;
  }

  setReal(real: number): void {
    this.real = real;
  }

  getImaginary(): number {
    return this.imaginary;
  }

  setImaginary(imaginary: number): void {
    this.imaginary = imaginary;
  }

  refreshView(): void {
    super.refreshView();
    this.portC.setX(this.width);
    this.portC.setY(this.height / 2);
    this.portR.setY(this.height / 3);
    this.portI.setY(this.height * 2 / 3);
  }

  updateModel(): void {
    let re = this.portR.getValue();
    let im = this.portI.getValue();
    let isReArray = false;
    if (re !== undefined) {
      if (Array.isArray(re)) {
        isReArray = true;
        this.real = re[re.length - 1];
      } else {
        this.real = re;
      }
    } else {
      this.real = 0;
    }
    let isImArray = false;
    if (im !== undefined) {
      if (Array.isArray(im)) {
        isImArray = true;
        this.imaginary = im[im.length - 1];
      } else {
        this.imaginary = im;
      }
    } else {
      this.imaginary = 0;
    }
    if (isReArray && isImArray) {
      let length = Math.min(re.length, im.length);
      let c = [];
      for (let i = 0; i < length; i++) {
        c.push(new Complex(re[i], im[i]));
      }
      this.portC.setValue(c);
    } else if (isReArray && !isImArray) {
      let c = [];
      for (let i = 0; i < re.length; i++) {
        c.push(new Complex(re[i], this.imaginary));
      }
      this.portC.setValue(c);
    } else if (isImArray && !isReArray) {
      let c = [];
      for (let i = 0; i < im.length; i++) {
        c.push(new Complex(this.real, im[i]));
      }
      this.portC.setValue(c);
    } else {
      this.portC.setValue(new Complex(this.real, this.imaginary));
    }
    this.updateConnectors();
  }

}
