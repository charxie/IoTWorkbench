/*
 * @author Charles Xie
 */

import {FlowView} from "./FlowView";
import {Block} from "./Block";
import {Connector} from "./Connector";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {ConditionalBlock} from "./ConditionalBlock";
import {LogicBlock} from "./LogicBlock";
import {MathBlock} from "./MathBlock";

export class Flowchart {

  blocks: Block[] = [];
  connectors: Connector[] = [];
  flowview: FlowView;

  constructor() {
    this.flowview = new FlowView("flow-view", this);
  }

  x(): void {
    let a = new LogicBlock(50, 100, 60, 80, "Or");
    let b = new LogicBlock(200, 200, 60, 80, "And");
    this.blocks.push(a);
    this.blocks.push(b);
    let c = new Connector(a.pins[2], b.pins[0]);
    this.connectors.push(c);
  }

  removeBlock(uid: string) {
    let selectedIndex = -1;
    for (let i = 0; i < this.blocks.length; i++) {
      if (uid == this.blocks[i].uid) {
        selectedIndex = i;
        break;
      }
    }
    if (selectedIndex != -1) {
      this.blocks.splice(selectedIndex, 1);
      this.storeBlocks();
    }
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

  storeBlocks(): void {
    let s: string = "";
    for (let i = 0; i < this.blocks.length; i++) {
      s += this.blocks[i].getUid() + ", ";
    }
    localStorage.setItem("Block Sequence", s.substring(0, s.length - 2));
  }

  storeBlockLocation(block: Block) {
    localStorage.setItem("X: " + block.getUid(), block.getX().toString());
    localStorage.setItem("Y: " + block.getUid(), block.getY().toString());
  }


}
