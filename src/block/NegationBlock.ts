/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class NegationBlock extends Block {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.name = "Not";
    this.color = "#B8860B";
    this.ports.push(new Port(this, true, "X", 0, this.height / 2, false));
    this.ports.push(new Port(this, false, "R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
