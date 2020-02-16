/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Vector} from "../math/Vector";
import {flowchart} from "../Main";

export class VectorBlock extends Block {

  private portI: Port[];
  private readonly portO: Port;
  private vector: Vector;

  static State = class {
    readonly name: string;
    readonly values: number[];
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: VectorBlock) {
      this.name = block.name;
      this.values = block.vector.getValues();
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#669";
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portO);
    this.margin = 15;
    this.vector = new Vector(2);
    this.vector.setValue(0, 1);
    this.vector.setValue(1, 0);
    this.setInputPorts();
  }

  private setInputPorts(): void {
    if (this.portI == undefined || this.portI.length !== this.vector.length()) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.pop();
        }
      }
      this.portI = new Array(this.vector.length());
      let dh = this.height / (this.vector.length() + 1);
      for (let i = 0; i < this.vector.length(); i++) {
        this.portI[i] = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, (i + 1) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getCopy(): Block {
    let copy = new VectorBlock("Vector Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    copy.setValues(this.vector.getValues());
    return copy;
  }

  destroy(): void {
  }

  getValues(): number[] {
    return this.vector.getValues();
  }

  setValues(values: number[]): void {
    this.vector.setValues(values);
    this.setInputPorts();
  }

  getValue(index: number): number {
    return this.vector.getValue(index);
  }

  setValue(index: number, value: number): void {
    this.vector.setValue(index, value);
  }

  refreshView(): void {
    super.refreshView();
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let dh = this.height / (this.vector.length() + 1);
    for (let i = 0; i < this.vector.length(); i++) {
      this.portI[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let x = this.portI[i].getValue();
      if (x != undefined) {
        this.vector.setValue(i, x);
      }
    }
    this.portO.setValue(this.vector);
    this.updateConnectors();
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = "9px Times New Roman";
      this.drawText(this.symbol ? this.symbol : this.name, ctx);
    } else {
      ctx.font = "16px Times New Roman";
      let s;
      let offset = -this.getHeight() / 2;
      for (let i = 0; i < this.portI.length; i++) {
        s = this.vector.getValue(i).toPrecision(3);
        this.drawTextAt(s, 0, this.portI[i].getY() + offset, ctx);
      }
      // the coordinates are no longer relative to the block below
      let textWidth = ctx.measureText(s).width;
      let x = this.getX() + this.getWidth() / 2 - 6 - textWidth / 2;
      let y1 = this.getY() + this.portI[0].getY() - 6;
      let y2 = this.getY() + this.portI[this.portI.length - 1].getY() + 10;
      ctx.strokeStyle = "black";
      // left square bracket
      ctx.beginPath();
      ctx.moveTo(x + 5, y1);
      ctx.lineTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.lineTo(x + 5, y2);
      ctx.stroke();
      x = this.getX() + this.getWidth() / 2 + 10 + textWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y1);
      ctx.lineTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.lineTo(x - 5, y2);
      ctx.stroke();
    }
  }

}
