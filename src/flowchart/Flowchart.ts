/*
 * @author Charles Xie
 */

import {FlowView} from "./FlowView";
import {Block} from "./Block";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {ConditionalBlock} from "./ConditionalBlock";
import {LogicBlock} from "./LogicBlock";
import {NegationBlock} from "./NegationBlock";

export class Flowchart {

  blocks: Block[] = [];
  flowview: FlowView;

  constructor() {
    this.blocks.push(new RainbowHatBlock(20, 20));
    this.blocks.push(new ConditionalBlock(200, 50, 60, 80));
    this.blocks.push(new LogicBlock(300, 120, 60, 80, "Or"));
    this.blocks.push(new LogicBlock(390, 120, 60, 80, "And"));
    this.blocks.push(new NegationBlock(480, 150, 60,80));
    this.flowview = new FlowView("flow-view", this);
  }

  draw(): void {
    this.flowview.draw();
  }

}
