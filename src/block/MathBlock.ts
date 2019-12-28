/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class MathBlock extends Block {

  constructor(x: number, y: number, width: number, height: number, name:string) {
    super(x, y, width, height);
    this.name = name;
    this.color="#008080";
    this.ports.push(new Port(this,"A", 0, this.height / 3, false));
    this.ports.push(new Port(this,"B", 0, this.height * 2 / 3, false));
    this.ports.push(new Port(this,"R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
