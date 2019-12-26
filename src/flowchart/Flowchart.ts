/*
 * @author Charles Xie
 */

import {FlowView} from "./FlowView";
import {Block} from "./Block";

export class Flowchart {

  blocks: Block[] = [];
  flowview: FlowView;

  constructor() {
    this.blocks.push(new Block(20, 20, 160, 100, "X + Y"));
    this.blocks.push(new Block(220, 220, 160, 100, "X * Y"));
    this.flowview = new FlowView("flow-view", this);
  }

  draw(): void {
    this.flowview.draw();
  }

}
