/*
 * @author Charles Xie
 */

import regression from "regression";
import {Port} from "./Port";
import {Block} from "./Block";

export class RegressionBlock extends Block {

  private type: string = "Linear";
  private readonly portX: Port;
  private readonly portY: Port;
  private readonly portA: Port;
  private readonly portB: Port;

  static State = class {
    readonly uid: string;
    readonly type: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: RegressionBlock) {
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
    this.symbol = "Regression";
    this.name = "Regression Block";
    this.color = "#DDDD66";
    this.portX = new Port(this, true, "X", 0, this.height / 3, false);
    this.portY = new Port(this, true, "Y", 0, this.height / 3 * 2, false);
    this.portA = new Port(this, false, "A", this.width, this.height / 3, true);
    this.portB = new Port(this, false, "B", this.width, this.height / 3 * 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portA);
    this.ports.push(this.portB);
    this.marginX = 20;
  }

  getCopy(): Block {
    let block = new RegressionBlock("Regression Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
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
    this.portA.setX(this.width);
    this.portA.setY(this.height / 3);
    this.portB.setX(this.width);
    this.portB.setY(this.height / 3 * 2);
  }

  updateModel(): void {
    let x = this.portX.getValue();
    let y = this.portY.getValue();
    if (y !== undefined && Array.isArray(y)) {
      if (x !== undefined && Array.isArray(x)) {
        let n = Math.min(y.length, x.length);
        let array = new Array(n);
        for (let i = 0; i < n; i++) {
          array[i] = [x[i], y[i]];
        }
        let result;
        switch (this.type) {
          case "Linear":
            result = regression.linear(array);
            break;
          case "Exponential":
            result = regression.exponential(array);
            break;
          case "Logarithmic":
            result = regression.logarithmic(array);
            break;
          case "Power":
            result = regression.power(array);
            break;
        }
        if (result !== undefined) {
          let parameters = result.equation;
          this.portA.setValue(parameters[0]);
          this.portB.setValue(parameters[1]);
        }
      } else {
        // if x is not set, use natural numbers as x?
      }
      this.updateConnectors();
    }
  }

}
