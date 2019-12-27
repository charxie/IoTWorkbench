/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Pin} from "./Pin";

export class ConditionalBlock extends Block {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.name = "F(x)";
    let dy = this.height / 2;
    this.pins.push(new Pin("X", 0, dy, false));
    this.pins.push(new Pin("R", this.width, dy, true));
    this.margin = 15;
  }

}
