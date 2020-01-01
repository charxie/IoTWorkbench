/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";

export class BinaryFunctionBlock extends FunctionBlock {

  private portX: Port;
  private portY: Port;
  private portR: Port;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "F(X, Y)";
    this.name = "Binary Function Block";
    this.color = "#FF6347";
    this.portX = new Port(this, true, "A", 0, this.height / 3, false);
    this.portY = new Port(this, true, "B", 0, this.height * 2 / 3, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  refreshView(): void {
    this.portX.setY(this.height / 3);
    this.portY.setY(this.height * 2 / 3);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
  }

}
