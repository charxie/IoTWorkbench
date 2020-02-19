/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {ComplexArray} from "jsfft";
import {flowchart} from "../Main";

export class FFTBlock extends Block {

  private portX: Port;
  private portR: Port;
  private portI: Port;
  private inverse: boolean = false;
  private data: ComplexArray;
  private realArray: number[];
  private imagArray: number[];

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly inverse: boolean;

    constructor(block: FFTBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.inverse = block.inverse;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "FFT Block";
    this.symbol = "ℱ";
    this.color = "#999";
    this.margin = 15;
    this.setupPorts();
  }

  private setupPorts(): void {
    // disconnect all the port connectors as the ports will be recreated
    flowchart.removeAllConnectors(this.portX);
    flowchart.removeAllConnectors(this.portR);
    flowchart.removeAllConnectors(this.portI);
    this.ports.length = 0;
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
  }

  getCopy(): Block {
    let b = new FFTBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    b.inverse = this.inverse;
    b.setupPorts();
    return b;
  }

  setInverse(inverse: boolean): void {
    this.inverse = inverse;
    this.setupPorts();
  }

  isInverse(): boolean {
    return this.inverse;
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
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
  }

  updateModel(): void {
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
        if (this.realArray === undefined || result.length !== this.realArray.length) {
          this.realArray = new Array(result.length);
        }
        for (let i = 0; i < result.length; i++) {
          this.realArray[i] = result.real[i];
        }
        this.portX.setValue(this.realArray);
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
        if (this.realArray === undefined || result.length !== this.realArray.length) {
          this.realArray = new Array(result.length);
          this.imagArray = new Array(result.length);
        }
        for (let i = 0; i < result.length; i++) {
          this.realArray[i] = result.real[i];
          this.imagArray[i] = result.imag[i];
        }
        this.portR.setValue(this.realArray);
        this.portI.setValue(this.imagArray);
      } else {
        this.portR.setValue(undefined);
        this.portI.setValue(undefined);
      }
    }
    this.updateConnectors();
  }

}
