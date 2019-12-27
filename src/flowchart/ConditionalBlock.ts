/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class ConditionalBlock extends Block {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.name = "F(x)";
    let dy = this.height / 2;
    this.ports.push(new Port(this, "X", 0, dy, false));
    this.ports.push(new Port(this,"R", this.width, dy, true));
    this.margin = 15;
  }

}
