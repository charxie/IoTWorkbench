/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Pin} from "./Pin";

export class LogicBlock extends Block {

  constructor(x: number, y: number, width: number, height: number, name:string) {
    super(x, y, width, height);
    this.name = name;
    this.pins.push(new Pin("A", 0, this.height / 3, false));
    this.pins.push(new Pin("B", 0, this.height * 2 / 3, false));
    this.pins.push(new Pin("R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
