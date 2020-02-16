/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class SeriesBlock extends Block {

  private readonly portX: Port;
  private readonly portD: Port;
  private readonly portN: Port;
  private readonly portS: Port;
  private start: number = 0;
  private increment: number = 1;
  private count: number = 10;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly start: number;
    readonly increment: number;
    readonly count: number;

    constructor(seriesBlock: SeriesBlock) {
      this.name = seriesBlock.name;
      this.uid = seriesBlock.uid;
      this.x = seriesBlock.x;
      this.y = seriesBlock.y;
      this.width = seriesBlock.width;
      this.height = seriesBlock.height;
      this.start = seriesBlock.start;
      this.increment = seriesBlock.increment;
      this.count = seriesBlock.count;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.name = name;
    this.symbol = symbol;
    this.color = "#006400";
    this.portX = new Port(this, true, "X", 0, this.height / 4, false);
    this.portD = new Port(this, true, "D", 0, this.height / 2, false);
    this.portN = new Port(this, true, "N", 0, this.height * 3 / 4, false);
    this.portS = new Port(this, false, "S", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portD);
    this.ports.push(this.portN);
    this.ports.push(this.portS);
    this.margin = 15;
    let output = [];
    for (let i = 0; i < this.count; i++) {
      output.push(this.start + i * this.increment);
    }
    this.portS.setValue(output);
  }

  getCopy(): Block {
    return new SeriesBlock("Series Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
  }

  destroy(): void {
  }

  getStart(): number {
    return this.start;
  }

  setStart(start: number): void {
    this.start = start;
  }

  getIncrement(): number {
    return this.increment;
  }

  setIncrement(increment: number): void {
    this.increment = increment;
  }

  getCount(): number {
    return this.count;
  }

  setCount(count: number): void {
    this.count = count;
  }

  refreshView(): void {
    super.refreshView();
    this.portS.setX(this.width);
    this.portS.setY(this.height / 2);
    this.portX.setY(this.height / 4);
    this.portD.setY(this.height / 2);
    this.portN.setY(this.height * 3 / 4);
  }

  updateModel(): void {
    let x0 = this.portX.getValue();
    let dx = this.portD.getValue();
    let nx = this.portN.getValue();
    this.source = (x0 == undefined || dx == undefined || nx == undefined);
    if (x0 != undefined) {
      this.start = x0;
    }
    if (dx != undefined) {
      this.increment = dx;
    }
    if (nx != undefined) {
      this.count = nx;
    }
    let output = [];
    for (let i = 0; i < this.count; i++) {
      output.push(this.start + this.increment * i);
    }
    this.portS.setValue(output);
    this.updateConnectors();
  }

}
