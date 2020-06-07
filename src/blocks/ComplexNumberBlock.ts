/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MyComplex} from "../math/MyComplex";
import {flowchart} from "../Main";

export class ComplexNumberBlock extends Block {

  private portR: Port;
  private portI: Port;
  private portC: Port;
  private real: number = 0;
  private imaginary: number = 0;
  private inverse: boolean = false;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly real: number;
    readonly imaginary: number;
    readonly inverse: boolean;

    constructor(b: ComplexNumberBlock) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.real = b.real;
      this.imaginary = b.imaginary;
      this.inverse = b.inverse;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#BDB76B";
    this.setupPorts();
  }

  private setupPorts(): void {
    // disconnect all the port connectors as the ports will be recreated
    if (this.portR) flowchart.removeAllConnectors(this.portR);
    if (this.portI) flowchart.removeAllConnectors(this.portI);
    if (this.portC) flowchart.removeAllConnectors(this.portC);
    this.ports.length = 0;
    if (this.inverse) {
      this.portR = new Port(this, false, "R", this.width, this.height / 3, true);
      this.portI = new Port(this, false, "I", this.width, this.height * 2 / 3, true);
      this.portC = new Port(this, true, "C", 0, this.height / 2, false);
    } else {
      this.portR = new Port(this, true, "R", 0, this.height / 3, false);
      this.portI = new Port(this, true, "I", 0, this.height * 2 / 3, false);
      this.portC = new Port(this, false, "C", this.width, this.height / 2, true);
    }
    this.ports.push(this.portR);
    this.ports.push(this.portI);
    this.ports.push(this.portC);
    this.portC.setValue(new MyComplex(0, 0));
  }

  getCopy(): Block {
    let b = new ComplexNumberBlock("Complex Number Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    b.real = this.real;
    b.imaginary = this.imaginary;
    return b;
  }

  setInverse(inverse: boolean): void {
    let changed = this.inverse !== inverse;
    this.inverse = inverse;
    if (changed) {
      this.setupPorts();
    }
  }

  isInverse(): boolean {
    return this.inverse;
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
    if (this.inverse) {
      this.portC.setX(0);
      this.portC.setY(this.height / 2);
      this.portR.setX(this.width);
      this.portR.setY(this.height / 3);
      this.portI.setX(this.width);
      this.portI.setY(this.height * 2 / 3);
    } else {
      this.portC.setX(this.width);
      this.portC.setY(this.height / 2);
      this.portR.setY(this.height / 3);
      this.portI.setY(this.height * 2 / 3);
    }
  }

  updateModel(): void {
    if (this.inverse) {
      let c = this.portC.getValue();
      if (c !== undefined) {
        if (Array.isArray(c)) {
          let re = new Array(c.length);
          let im = new Array(c.length);
          for (let i = 0; i < c.length; i++) {
            if (c[i] instanceof MyComplex) {
              re[i] = c[i].re;
              im[i] = c[i].im;
            } else {
              re[i] = c[i];
              im[i] = 0;
            }
          }
          this.portR.setValue(re);
          this.portI.setValue(im);
        } else {
          if (c instanceof MyComplex) {
            this.portR.setValue(c.re);
            this.portI.setValue(c.im);
          } else {
            this.portR.setValue(c);
            this.portI.setValue(0);
          }
        }
      }
    } else {
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
          c.push(new MyComplex(re[i], im[i]));
        }
        this.portC.setValue(c);
      } else if (isReArray && !isImArray) {
        let c = [];
        for (let i = 0; i < re.length; i++) {
          c.push(new MyComplex(re[i], this.imaginary));
        }
        this.portC.setValue(c);
      } else if (isImArray && !isReArray) {
        let c = [];
        for (let i = 0; i < im.length; i++) {
          c.push(new MyComplex(this.real, im[i]));
        }
        this.portC.setValue(c);
      } else {
        this.portC.setValue(new MyComplex(this.real, this.imaginary));
      }
    }
    this.updateConnectors();
  }

}
