/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {HatBlock} from "./HatBlock";

export class RainbowHatBlock extends HatBlock {

  constructor(x: number, y: number) {
    super(x, y, 125, 250);
    this.name = "Rainbow HAT";
    this.color = "#808000";
    let dy = this.height / 11;
    this.ports.push(new Port(this,"PB", this.width, dy, true)); // coordinates relative to this block
    this.ports.push(new Port(this,"BA", this.width, 2 * dy, true));
    this.ports.push(new Port(this,"BB", this.width, 3 * dy, true));
    this.ports.push(new Port(this,"BC", this.width, 4 * dy, true));
    this.ports.push(new Port(this,"RL", this.width, 5 * dy, true));
    this.ports.push(new Port(this,"GL", this.width, 6 * dy, true));
    this.ports.push(new Port(this,"BL", this.width, 7 * dy, true));
    this.ports.push(new Port(this,"TS", this.width, 8 * dy, true));
    this.ports.push(new Port(this,"PS", this.width, 9 * dy, true));
    this.ports.push(new Port(this,"L1", 0, dy, false));
    this.ports.push(new Port(this,"L2", 0, 2 * dy, false));
    this.ports.push(new Port(this,"L3", 0, 3 * dy, false));
    this.ports.push(new Port(this,"L4", 0, 4 * dy, false));
    this.ports.push(new Port(this,"L5", 0, 5 * dy, false));
    this.ports.push(new Port(this,"L6", 0, 6 * dy, false));
    this.ports.push(new Port(this,"L7", 0, 7 * dy, false));
    this.ports.push(new Port(this,"DP", 0, 8 * dy, false));
  }

}
