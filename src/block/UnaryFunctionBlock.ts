/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class UnaryFunctionBlock extends Block {

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
