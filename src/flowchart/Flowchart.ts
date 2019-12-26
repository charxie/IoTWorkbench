/*
 * @author Charles Xie
 */

import {FlowView} from "./FlowView";
import {Block} from "./Block";
import {RainbowHatBlock} from "./RainbowHatBlock";

export class Flowchart {

  rainbowHatBlock: RainbowHatBlock;
  blocks: Block[] = [];
  flowview: FlowView;

  constructor() {
    this.rainbowHatBlock = new RainbowHatBlock(20, 20, 200, 100);
    //this.blocks.push(new Block(20, 20, 200, 100, "X + Y"));
    //this.blocks.push(new Block(220, 220, 160, 100, "X * Y"));
    this.flowview = new FlowView("flow-view", this);
  }

  draw(): void {
    this.flowview.draw();
  }

}
