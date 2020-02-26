/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Vector} from "../math/Vector";

export class NormalizationBlock extends Block {

  private readonly portI: Port;
  private readonly portO: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Normalization Block";
    this.symbol = "V̂";
    this.color = "#C39";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    return new NormalizationBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
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
    if (x instanceof Vector) {
      this.portO.setValue(x.normalize());
    } else {
      this.portO.setValue(undefined);
    }
    this.updateConnectors();
  }

}
