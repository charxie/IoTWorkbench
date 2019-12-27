/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Pin} from "./Pin";

export class NegationBlock extends Block {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.name = "Not";
    this.pins.push(new Pin("X", 0, this.height / 2, false));
    this.pins.push(new Pin("R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
