/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {HatBlock} from "./HatBlock";

export class RainbowHatBlock extends HatBlock {

  constructor(uid: string, x: number, y: number) {
    super(uid, x, y, 125, 250);
    this.name = "Rainbow HAT";
    this.color = "#808000";
    let dy = this.height / 11;
    this.ports.push(new Port(this, true, "PB", this.width, dy, true)); // coordinates relative to this block
    this.ports.push(new Port(this, false, "BA", this.width, 2 * dy, true));
    this.ports.push(new Port(this, false, "BB", this.width, 3 * dy, true));
    this.ports.push(new Port(this, false, "BC", this.width, 4 * dy, true));
    this.ports.push(new Port(this, true, "RL", this.width, 5 * dy, true));
    this.ports.push(new Port(this, true, "GL", this.width, 6 * dy, true));
    this.ports.push(new Port(this, true, "BL", this.width, 7 * dy, true));
    this.ports.push(new Port(this, false, "TS", this.width, 8 * dy, true));
    this.ports.push(new Port(this, false, "PS", this.width, 9 * dy, true));
    this.ports.push(new Port(this, true, "L1", 0, dy, false));
    this.ports.push(new Port(this, true, "L2", 0, 2 * dy, false));
    this.ports.push(new Port(this, true, "L3", 0, 3 * dy, false));
    this.ports.push(new Port(this, true, "L4", 0, 4 * dy, false));
    this.ports.push(new Port(this, true, "L5", 0, 5 * dy, false));
    this.ports.push(new Port(this, true, "L6", 0, 6 * dy, false));
    this.ports.push(new Port(this, true, "L7", 0, 7 * dy, false));
    this.ports.push(new Port(this, true, "DP", 0, 8 * dy, false));
  }

}
