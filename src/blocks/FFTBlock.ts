/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {ComplexArray} from "jsfft";
import {flowchart} from "../Main";
import {Complex} from "../math/Complex";

export class FFTBlock extends Block {

  private portX: Port;
  private portR: Port;
  private portI: Port;
  private portK: Port;
  private separate: boolean = true;
  private inverse: boolean = false;
  private data: ComplexArray;
  private array1: any[];
  private array2: any[];

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly inverse: boolean;
    readonly separate: boolean;

    constructor(block: FFTBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.inverse = block.inverse;
      this.separate = block.separate;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "FFT Block";
    this.symbol = "ℱ";
    this.color = "#999";
    this.setupPorts();
  }

  setupPorts(): void {
    // disconnect all the port connectors as the ports will be recreated
    if (this.portX) flowchart.removeAllConnectors(this.portX);
    if (this.portR) flowchart.removeAllConnectors(this.portR);
    if (this.portI) flowchart.removeAllConnectors(this.portI);
    if (this.portK) flowchart.removeAllConnectors(this.portK);
    this.ports.length = 0;
    if (this.separate) {
      if (this.inverse) {
        this.symbol = "ℱ⁻¹";
        this.portR = new Port(this, true, "R", 0, this.height / 3, false);
        this.portI = new Port(this, true, "I", 0, this.height * 2 / 3, false);
        this.portX = new Port(this, false, "X", this.width, this.height / 2, true);
        this.ports.push(this.portR);
        this.ports.push(this.portI);
        this.ports.push(this.portX);
      } else {
        this.symbol = "ℱ";
        this.portX = new Port(this, true, "X", 0, this.height / 2, false);
        this.portR = new Port(this, false, "R", this.width, this.height / 3, true);
        this.portI = new Port(this, false, "I", this.width, this.height * 2 / 3, true);
        this.ports.push(this.portX);
        this.ports.push(this.portR);
        this.ports.push(this.portI);
      }
    } else {
      if (this.inverse) {
        this.symbol = "ℱ⁻¹";
        this.portK = new Port(this, true, "K", 0, this.height / 2, false);
        this.portX = new Port(this, false, "X", this.width, this.height / 2, true);
        this.ports.push(this.portK);
        this.ports.push(this.portX);
      } else {
        this.symbol = "ℱ";
        this.portX = new Port(this, true, "X", 0, this.height / 2, false);
        this.portK = new Port(this, false, "K", this.width, this.height / 2, true);
        this.ports.push(this.portX);
        this.ports.push(this.portK);
      }
    }
  }

  getCopy(): Block {
    let b = new FFTBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    b.separate = this.separate;
    b.inverse = this.inverse;
    b.setupPorts();
    return b;
  }

  setInverse(inverse: boolean): void {
    this.inverse = inverse;
  }

  isInverse(): boolean {
    return this.inverse;
  }

  setSeparate(separate: boolean): void {
    this.separate = separate;
  }

  isSeparate(): boolean {
    return this.separate;
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    if (this.separate) {
      if (this.inverse) {
        this.portX.setX(this.width);
        this.portX.setY(this.height / 2);
        this.portR.setX(0);
        this.portR.setY(this.height / 3);
        this.portI.setX(0);
        this.portI.setY(this.height * 2 / 3);
      } else {
        this.portX.setY(this.height / 2);
        this.portR.setX(this.width);
        this.portR.setY(this.height / 3);
        this.portI.setX(this.width);
        this.portI.setY(this.height * 2 / 3);
      }
    } else {
      if (this.inverse) {
        this.portX.setX(this.width);
        this.portX.setY(this.height / 2);
        this.portK.setX(0);
        this.portK.setY(this.height / 2);
      } else {
        this.portX.setY(this.height / 2);
        this.portK.setX(this.width);
        this.portK.setY(this.height / 2);
      }
    }
  }

  updateModel(): void {
    if (this.separate) {
      if (this.portX && this.portR && this.portI) {
        if (this.inverse) {
          let re = this.portR.getValue();
          let im = this.portI.getValue();
          if (Array.isArray(re) && Array.isArray(im)) {
            if (this.data === undefined || this.data.length !== re.length) {
              this.data = new ComplexArray(re.length);
            }
            for (let i = 0; i < re.length; i++) {
              this.data.real[i] = re[i];
              this.data.imag[i] = im[i];
            }
            let result = this.data.InvFFT();
            if (this.array1 === undefined || result.length !== this.array1.length) {
              this.array1 = new Array(result.length);
            }
            for (let i = 0; i < result.length; i++) {
              this.array1[i] = result.real[i];
            }
            this.portX.setValue(this.array1);
          } else {
            this.portX.setValue(undefined);
          }
        } else {
          let x = this.portX.getValue();
          if (Array.isArray(x)) {
            if (this.data === undefined || this.data.length !== x.length) {
              this.data = new ComplexArray(x.length);
            }
            for (let i = 0; i < x.length; i++) {
              this.data.real[i] = x[i];
              this.data.imag[i] = 0;
            }
            let result = this.data.FFT();
            if (this.array1 === undefined || result.length !== this.array1.length) {
              this.array1 = new Array(result.length);
              this.array2 = new Array(result.length);
            }
            for (let i = 0; i < result.length; i++) {
              this.array1[i] = result.real[i];
              this.array2[i] = result.imag[i];
            }
            this.portR.setValue(this.array1);
            this.portI.setValue(this.array2);
          } else {
            this.portR.setValue(undefined);
            this.portI.setValue(undefined);
          }
        }
      }
    } else {
      if (this.portX && this.portK) {
        if (this.inverse) {
          let k = this.portK.getValue();
          if (Array.isArray(k)) {
            if (this.data === undefined || this.data.length !== k.length) {
              this.data = new ComplexArray(k.length);
            }
            for (let i = 0; i < k.length; i++) {
              if (k[i] instanceof Complex) {
                this.data.real[i] = k[i].re;
                this.data.imag[i] = k[i].im;
              } else {
                this.data.real[i] = k[i];
                this.data.imag[i] = 0;
              }
            }
            let result = this.data.InvFFT();
            if (this.array1 === undefined || result.length !== this.array1.length) {
              this.array1 = new Array(result.length);
            }
            for (let i = 0; i < result.length; i++) {
              this.array1[i] = result.real[i];
            }
            this.portX.setValue(this.array1);
          } else {
            this.portX.setValue(undefined);
          }
        } else {
          let x = this.portX.getValue();
          if (Array.isArray(x)) {
            if (this.data === undefined || this.data.length !== x.length) {
              this.data = new ComplexArray(x.length);
            }
            for (let i = 0; i < x.length; i++) {
              this.data.real[i] = x[i];
              this.data.imag[i] = 0;
            }
            let result = this.data.FFT();
            if (this.array1 === undefined || result.length !== this.array1.length) {
              this.array1 = new Array(result.length);
            }
            for (let i = 0; i < result.length; i++) {
              this.array1[i] = new Complex(result.real[i], result.imag[i]);
            }
            this.portK.setValue(this.array1);
          } else {
            this.portK.setValue(undefined);
          }
        }
      }
    }
    this.updateConnectors();
  }

}
