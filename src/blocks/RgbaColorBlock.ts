/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class RgbaColorBlock extends Block {

  private readonly portR: Port;
  private readonly portG: Port;
  private readonly portB: Port;
  private readonly portA: Port;
  private readonly portC: Port;
  private red: number = 128; // color components are within [0, 255]
  private green: number = 128;
  private blue: number = 128;
  private alpha: number = 1; // opacity is within [0, 1]

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly alpha: number;

    constructor(b: RgbaColorBlock) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.red = b.red;
      this.green = b.green;
      this.blue = b.blue;
      this.alpha = b.alpha;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.source = true;
    this.name = name;
    this.symbol = symbol;
    this.color = "#FF1493";
    this.portR = new Port(this, true, "R", 0, this.height / 5, false);
    this.portG = new Port(this, true, "G", 0, this.height * 2 / 5, false);
    this.portB = new Port(this, true, "B", 0, this.height * 3 / 5, false);
    this.portA = new Port(this, true, "A", 0, this.height * 4 / 5, false);
    this.portC = new Port(this, false, "C", this.width, this.height / 2, true);
    this.ports.push(this.portR);
    this.ports.push(this.portG);
    this.ports.push(this.portB);
    this.ports.push(this.portA);
    this.ports.push(this.portC);
    this.margin = 15;
    this.portC.setValue([this.red, this.green, this.blue, this.alpha]);
  }

  getCopy(): Block {
    let b = new RgbaColorBlock("Rgba Color Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height, this.name, this.symbol);
    b.red = this.red;
    b.green = this.green;
    b.blue = this.blue;
    b.alpha = this.alpha;
    return b;
  }

  destroy(): void {
  }

  getRed(): number {
    return this.red;
  }

  setRed(red: number): void {
    this.red = red;
  }

  getGreen(): number {
    return this.green;
  }

  setGreen(green: number): void {
    this.green = green;
  }

  getBlue(): number {
    return this.blue;
  }

  setBlue(blue: number): void {
    this.blue = blue;
  }

  getAlpha(): number {
    return this.alpha;
  }

  setAlpha(alpha: number): void {
    this.alpha = alpha;
  }

  refreshView(): void {
    super.refreshView();
    this.portC.setX(this.width);
    this.portC.setY(this.height / 2);
    this.portR.setY(this.height / 5);
    this.portG.setY(this.height * 2 / 5);
    this.portB.setY(this.height * 3 / 5);
    this.portA.setY(this.height * 4 / 5);
  }

  updateModel(): void {
    let r = this.portR.getValue();
    let g = this.portG.getValue();
    let b = this.portB.getValue();
    let a = this.portA.getValue();
    this.red = r != undefined ? Math.round(r) : 128;
    this.green = g != undefined ? Math.round(g) : 128;
    this.blue = b != undefined ? Math.round(b) : 128;
    this.alpha = a != undefined ? a : 1;
    this.portC.setValue([this.red, this.green, this.blue, this.alpha]);
    this.updateConnectors();
  }

}
