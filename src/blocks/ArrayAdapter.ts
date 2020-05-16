/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart} from "../Main";

export class ArrayAdapter extends Block {

  private portI: Port[];
  private readonly portO: Port;

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly columns: number;

    constructor(block: ArrayAdapter) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.columns = block.portI.length;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "[...][...]";
    this.name = "Array Adapter";
    this.color = "#E0AB87";
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portO);
    this.setColumns(2);
  }

  destroy() {
  }

  setColumns(columns: number): void {
    if (this.portI === undefined || this.portI.length !== columns) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.pop();
        }
      }
      this.portI = new Array(columns);
      let dh = this.height / (columns + 1);
      for (let i = 0; i < columns; i++) {
        this.portI[i] = new Port(this, true, i.toString(), 0, (i + 1) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getColumns(): number {
    return this.portI.length;
  }

  getCopy(): Block {
    let block = new ArrayAdapter("Array Adapter #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.setColumns(this.getColumns());
    return block;
  }

  refreshView(): void {
    super.refreshView();
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let dh = this.height / (this.portI.length + 1);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let x = new Array(this.portI.length);
    let allSet = true;
    for (let i = 0; i < x.length; i++) {
      x[i] = this.portI[i].getValue();
      if (x[i] === undefined || !Array.isArray(x[i])) {
        allSet = false;
        break;
      }
    }
    if (allSet) {
      let minLength = x[0].length;
      for (let i = 1; i < x.length; i++) {
        if (minLength > x[i].length) minLength = x[i].length;
      }
      let y = new Array(minLength);
      for (let i = 0; i < y.length; i++) {
        y[i] = new Array(x.length);
        for (let j = 0; j < x.length; j++) {
          y[i][j] = x[j][i];
        }
      }
      this.portO.setValue(y);
      this.updateConnectors();
    }
  }

}
