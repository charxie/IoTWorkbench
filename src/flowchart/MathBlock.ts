/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Pin} from "./Pin";

export class MathBlock extends Block {

  constructor(x: number, y: number, width: number, height: number, name:string) {
    super(x, y, width, height);
    this.name = name;
    this.pins.push(new Pin(this,"A", 0, this.height / 3, false));
    this.pins.push(new Pin(this,"B", 0, this.height * 2 / 3, false));
    this.pins.push(new Pin(this,"R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
