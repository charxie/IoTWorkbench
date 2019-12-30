/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";

export class UnaryFunctionBlock extends FunctionBlock {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.symbol = "F(X)";
    this.name = "Unary Function Block";
    this.color = "#FF6347";
    let dy = this.height / 2;
    this.ports.push(new Port(this, true, "X", 0, dy, false));
    this.ports.push(new Port(this, false, "R", this.width, dy, true));
    this.margin = 15;
  }

}
