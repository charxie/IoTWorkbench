/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {flowchart} from "../Main";
import {Matrix} from "../math/Matrix";
import {MyVector} from "../math/MyVector";

export class MatrixBlock extends Block {

  private portI: Port[];
  private readonly portO: Port;
  private matrix: Matrix;
  private fractionDigits: number = 3;

  static State = class {
    readonly name: string;
    readonly values: number[][];
    readonly fractionDigits: number;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: MatrixBlock) {
      this.name = block.name;
      this.fractionDigits = block.fractionDigits;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.values = block.matrix.getValues().map(function (arr) {
        return arr.slice();
      });
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#C66";
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portO);
    this.matrix = new Matrix(2, 2);
    this.matrix.setValue(0, 0, 1);
    this.matrix.setValue(0, 1, 0);
    this.matrix.setValue(1, 0, 0);
    this.matrix.setValue(1, 1, 1);
    this.setInputPorts();
  }

  private setInputPorts(): void {
    let rows = this.matrix.getRows();
    if (this.portI == undefined || this.portI.length !== rows) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.pop();
        }
      }
      this.portI = new Array(rows);
      let dh = this.height / (rows + 1);
      for (let i = 0; i < rows; i++) {
        this.portI[i] = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, (i + 1) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getCopy(): Block {
    let copy = new MatrixBlock("Matrix Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    copy.setValues(JSON.parse(JSON.stringify(this.matrix.getValues())));
    copy.fractionDigits = this.fractionDigits;
    return copy;
  }

  destroy(): void {
  }

  getFractionDigits(): number {
    return this.fractionDigits;
  }

  setFractionDigits(fractionDigits: number): void {
    this.fractionDigits = fractionDigits;
  }

  getValues(): number[][] {
    return this.matrix.getValues();
  }

  setValues(values: number[][]): void {
    this.matrix.setValues(values);
    this.setInputPorts();
  }

  getValue(row: number, col: number): number {
    return this.matrix.getValue(row, col);
  }

  setValue(row: number, col: number, value: number): void {
    this.matrix.setValue(row, col, value);
  }

  refreshView(): void {
    super.refreshView();
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let dh = this.height / (this.matrix.getRows() + 1);
    for (let i = 0; i < this.matrix.getRows(); i++) {
      this.portI[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let x = this.portI[i].getValue();
      if (x instanceof MyVector) {
        this.matrix.setRowValuesByVector(i, x);
      } else if (Array.isArray(x)) {
        this.matrix.setRowValuesByArray(i, x);
      }
    }
    this.portO.setValue(this.matrix);
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
      let gap = 20;
      let textWidth = ctx.measureText(Math.PI.toFixed(this.fractionDigits)).width;
      let cols = this.matrix.getColumns();
      let rows = this.portI.length;
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          s = this.matrix.getValue(row, col).toFixed(this.fractionDigits);
          this.drawTextAt(s, (col + 0.5 - cols / 2) * (textWidth + gap), this.portI[row].getY() + offset, ctx);
        }
      }
      textWidth = textWidth * cols + gap * (cols - 1);
      // the coordinates are no longer relative to the block below
      let x = this.getX() + this.getWidth() / 2 - 16 - textWidth / 2;
      let y1 = this.getY() + this.portI[0].getY() - 10;
      let y2 = this.getY() + this.portI[rows - 1].getY() + 10;
      ctx.strokeStyle = "black";
      // left square bracket
      ctx.beginPath();
      ctx.moveTo(x + 5, y1);
      ctx.lineTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.lineTo(x + 5, y2);
      ctx.stroke();
      x = this.getX() + this.getWidth() / 2 + 16 + textWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y1);
      ctx.lineTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.lineTo(x - 5, y2);
      ctx.stroke();
    }
  }

}
