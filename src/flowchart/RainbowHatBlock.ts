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
    this.pins.push(new Pin("PB", this.width, dy, true)); // coordinates relative to this block
    this.pins.push(new Pin("BA", this.width, 2 * dy, true));
    this.pins.push(new Pin("BB", this.width, 3 * dy, true));
    this.pins.push(new Pin("BC", this.width, 4 * dy, true));
    this.pins.push(new Pin("RL", this.width, 5 * dy, true));
    this.pins.push(new Pin("GL", this.width, 6 * dy, true));
    this.pins.push(new Pin("BL", this.width, 7 * dy, true));
    this.pins.push(new Pin("TS", this.width, 8 * dy, true));
    this.pins.push(new Pin("PS", this.width, 9 * dy, true));
    this.pins.push(new Pin("L1", 0, dy, false));
    this.pins.push(new Pin("L2", 0, 2 * dy, false));
    this.pins.push(new Pin("L3", 0, 3 * dy, false));
    this.pins.push(new Pin("L4", 0, 4 * dy, false));
    this.pins.push(new Pin("L5", 0, 5 * dy, false));
    this.pins.push(new Pin("L6", 0, 6 * dy, false));
    this.pins.push(new Pin("L7", 0, 7 * dy, false));
    this.pins.push(new Pin("DP", 0, 8 * dy, false));
  }

}
