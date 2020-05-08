/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";

export class CorrelationBlock extends Block {

  private type: string = "Pearson";
  private readonly portX: Port;
  private readonly portY: Port;
  private readonly portR: Port;

  static State = class {
    readonly uid: string;
    readonly type: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: CorrelationBlock) {
      this.uid = block.uid;
      this.type = block.type;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Correlation";
    this.name = "Correlation Block";
    this.color = "#66EECC";
    this.portX = new Port(this, true, "X", 0, this.height / 3, false);
    this.portY = new Port(this, true, "Y", 0, this.height / 3 * 2, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portR);
    this.marginX = 20;
  }

  getCopy(): Block {
    let block = new CorrelationBlock("Correlation Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.type = this.type;
    return block;
  }

  destroy() {
  }

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }

  refreshView(): void {
    super.refreshView();
    this.portX.setY(this.height / 3);
    this.portY.setY(this.height / 3 * 2);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portX.getValue();
    let y = this.portY.getValue();
    if (y !== undefined && Array.isArray(y) && x !== undefined && Array.isArray(x)) {
      let n = Math.min(y.length, x.length);
      let result;
      switch (this.type) {
        case "Pearson":
          let meanX = 0;
          let meanY = 0;
          for (let i = 0; i < n; i++) {
            meanX += x[i];
            meanY += y[i];
          }
          meanX /= n;
          meanY /= n;
          let sdx = 0;
          let sdy = 0;
          let cov = 0;
          for (let i = 0; i < n; i++) {
            sdx += (x[i] - meanX) * (x[i] - meanX);
            sdy += (y[i] - meanY) * (y[i] - meanY);
            cov += (x[i] - meanX) * (y[i] - meanY);
          }
          result = cov / Math.sqrt(sdx * sdy);
          break;
      }
      if (result !== undefined) {
        this.portR.setValue(result);
        this.updateConnectors();
      }
    }
  }

}
