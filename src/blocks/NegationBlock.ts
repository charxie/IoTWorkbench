/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class NegationBlock extends Block {

  private readonly portX: Port;
  private readonly portR: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "NOT Block";
    this.symbol = "NOT";
    this.color = "#87CEFA";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portR);
  }

  getCopy(): Block {
    return new NegationBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.portX.setY(this.height / 2);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portX.getValue();
    if (x != undefined) {
      if (typeof x == "boolean") {
        this.portR.setValue(!x);
      } else {
        this.portR.setValue(x > 0 ? 0 : 1);
      }
    } else {
      this.portR.setValue(undefined);
    }
    this.updateConnectors();
  }

}
