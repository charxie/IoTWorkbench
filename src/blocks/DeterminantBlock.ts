/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MyMatrix} from "../math/MyMatrix";

export class DeterminantBlock extends Block {

  private readonly portI: Port;
  private readonly portO: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Determinant Block";
    this.symbol = "|M|";
    this.color = "#06C";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    return new DeterminantBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
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
    if (x instanceof MyMatrix) {
      this.portO.setValue(x.det());
    } else {
      this.portO.setValue(undefined);
    }
    this.updateConnectors();
  }

}
