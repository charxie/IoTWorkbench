/*
 * @author Charles Xie
 */

import {FlowView} from "./FlowView";
import {Block} from "./Block";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {LogicBlock} from "./LogicBlock";
import {ConditionalBlock} from "./ConditionalBlock";
import {MathBlock} from "./MathBlock";

export class Flowchart {

  blocks: Block[] = [];
  flowview: FlowView;

  constructor() {
    this.flowview = new FlowView("flow-view", this);
  }

  addBlock(name: string, x: number, y: number, uid: string): Block {
    let block: Block = null;
    switch (name) {
      case "Conditional Block":
        block = new ConditionalBlock(x, y, 60, 80);
        break;
      case "Logic And Block":
        block = new LogicBlock(x, y, 60, 80, "And");
        break;
      case "Logic Or Block":
        block = new LogicBlock(x, y, 60, 80, "Or");
        break;
      case "Logic Not Block":
        block = new ConditionalBlock(x, y, 60, 80);
        break;
      case "Add Block":
        block = new MathBlock(x, y, 60, 80, "+");
        break;
      case "Multiply Block":
        block = new MathBlock(x, y, 60, 80, "×");
        break;
      case "Rainbow HAT Block":
        block = new RainbowHatBlock(20, 20);
        break;
    }
    if (block != null) {
      block.uid = uid;
      this.blocks.push(block);
    }
    return block;
  }

  draw(): void {
    this.flowview.draw();
  }

}
