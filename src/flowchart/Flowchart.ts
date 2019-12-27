/*
 * @author Charles Xie
 */

import {FlowView} from "./FlowView";
import {Block} from "./Block";
import {PortConnector} from "./PortConnector";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {ConditionalBlock} from "./ConditionalBlock";
import {LogicBlock} from "./LogicBlock";
import {MathBlock} from "./MathBlock";
import {Port} from "./Port";

export class Flowchart {

  blocks: Block[] = [];
  connectors: PortConnector[] = [];
  flowview: FlowView;

  constructor() {
    this.flowview = new FlowView("flow-view", this);
  }

  addPortConnector(port1: Port, port2: Port): boolean {
    let existing = false;
    for (let i = 0; i < this.connectors.length; i++) {
      if ((this.connectors[i].port1 == port1 && this.connectors[i].port2 == port2) || (this.connectors[i].port1 == port2 && this.connectors[i].port2 == port1)) {
        existing = true;
        break;
      }
    }
    if (existing) {
      return false;
    }
    this.connectors.push(new PortConnector(port1, port2));
    return true;
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
