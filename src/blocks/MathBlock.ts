/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";

export class MathBlock extends Block {

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#008080";
    this.ports.push(new Port(this, true, "A", 0, this.height / 3, false));
    this.ports.push(new Port(this, true, "B", 0, this.height * 2 / 3, false));
    this.ports.push(new Port(this, false, "R", this.width, this.height / 2, true));
    this.margin = 15;
  }

}
