/*
 * @author Charles Xie
 */

import {Pin} from "./Pin";
import {HatBlock} from "./HatBlock";

export class RainbowHatBlock extends HatBlock {

  constructor(x: number, y: number) {
    super(x, y, 125, 250);
    this.name = "Rainbow HAT";
    let dy = this.height / 11;
    this.pins.push(new Pin(this,"PB", this.width, dy, true)); // coordinates relative to this block
    this.pins.push(new Pin(this,"BA", this.width, 2 * dy, true));
    this.pins.push(new Pin(this,"BB", this.width, 3 * dy, true));
    this.pins.push(new Pin(this,"BC", this.width, 4 * dy, true));
    this.pins.push(new Pin(this,"RL", this.width, 5 * dy, true));
    this.pins.push(new Pin(this,"GL", this.width, 6 * dy, true));
    this.pins.push(new Pin(this,"BL", this.width, 7 * dy, true));
    this.pins.push(new Pin(this,"TS", this.width, 8 * dy, true));
    this.pins.push(new Pin(this,"PS", this.width, 9 * dy, true));
    this.pins.push(new Pin(this,"L1", 0, dy, false));
    this.pins.push(new Pin(this,"L2", 0, 2 * dy, false));
    this.pins.push(new Pin(this,"L3", 0, 3 * dy, false));
    this.pins.push(new Pin(this,"L4", 0, 4 * dy, false));
    this.pins.push(new Pin(this,"L5", 0, 5 * dy, false));
    this.pins.push(new Pin(this,"L6", 0, 6 * dy, false));
    this.pins.push(new Pin(this,"L7", 0, 7 * dy, false));
    this.pins.push(new Pin(this,"DP", 0, 8 * dy, false));
  }

}
