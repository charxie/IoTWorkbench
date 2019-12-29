/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";

export class BinaryFunctionBlock extends FunctionBlock {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.symbol = "F(X, Y)";
    this.name = "Binary Function Block";
    this.color = "#FF6347";
    let dy = this.height / 3;
    this.ports.push(new Port(this, true, "X", 0, dy, false));
    this.ports.push(new Port(this, true, "Y", 0, 2 * dy, false));
    this.ports.push(new Port(this, false, "R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
