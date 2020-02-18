/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {ComplexArray} from "jsfft";

export class FFTBlock extends Block {

  private readonly portI: Port;
  private readonly portO: Port;
  private inverse: boolean = false;
  private data: ComplexArray;

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
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
    this.margin = 15;
  }

  getCopy(): Block {
    let b = new FFTBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    b.inverse = this.inverse;
    return b;
  }

  setInverse(inverse: boolean): void {
    this.inverse = inverse;
  }

  isInverse(): boolean {
    return this.inverse;
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portI.getValue();
    if (Array.isArray(x)) {
      if (this.data === undefined || this.data.length !== x.length) {
        this.data = new ComplexArray(x.length);
        this.data.map((value, i, n) => {
          value.real = x[i];
        });
      }
      console.log(this.data);
      this.portO.setValue(this.data.FFT());
    } else {
      this.portO.setValue(undefined);
    }
    this.updateConnectors();
  }

}
