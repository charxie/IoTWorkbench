/*
 * @author Charles Xie
 */

import {BlockView} from "./BlockView";
import {Block} from "./Block";
import {PortConnector} from "./PortConnector";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {LogicBlock} from "./LogicBlock";
import {MathBlock} from "./MathBlock";
import {Port} from "./Port";
import {NegationBlock} from "./NegationBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";

export class Flowchart {

  blocks: Block[] = [];
  connectors: PortConnector[] = [];
  blockView: BlockView;

  constructor() {
    this.blockView = new BlockView("block-view", this);
  }

  /* connector methods */

  getConnector(port: Port): PortConnector {
    for (let connector of this.connectors) {
      if (connector.input == port || connector.output == port) {
        return connector;
      }
    }
    return null;
  }

  addPortConnector(output: Port, input: Port, uid: string): boolean {
    let existing = false;
    for (let c of this.connectors) {
      if (c.input == input && c.output == output) {
        existing = true;
        break;
      }
    }
    if (existing) {
      return false;
    }
    let c = new PortConnector(output, input);
    c.uid = uid;
    this.connectors.push(c);
    return true;
  }

  removePortConnector(connector: PortConnector): void {
    this.connectors.splice(this.connectors.indexOf(connector), 1);
    this.storePortConnectors();
  }

  /* block methods */

  removeBlock(uid: string) {
    let selectedBlock: Block = null;
    for (let b of this.blocks) {
      if (uid == b.uid) {
        selectedBlock = b;
        break;
      }
    }
    if (selectedBlock != null) {
      let connectorsToRemove = [];
      for (let c of this.connectors) {
        let block1 = c.input.block;
        let block2 = c.output.block;
        if (block1 == selectedBlock || block2 == selectedBlock) {
          connectorsToRemove.push(this.connectors.indexOf(c));
        }
      }
      if (connectorsToRemove.length > 0) {
        for (let i = connectorsToRemove.length - 1; i >= 0; i--) {
          this.connectors.splice(connectorsToRemove[i], 1);
        }
      }
      this.blocks.splice(this.blocks.indexOf(selectedBlock), 1);
      this.storeBlocks();
    }
  }

  getBlock(uid: string): Block {
    for (let b of this.blocks) {
      if (b.uid == uid) {
        return b;
      }
    }
    return null;
  }

  addBlock(name: string, x: number, y: number, uid: string): Block {
    let block: Block = null;
    switch (name) {
      case "Unary Function Block":
        block = new UnaryFunctionBlock(x, y, 60, 80);
        break;
      case "Binary Function Block":
        block = new BinaryFunctionBlock(x, y, 60, 100);
        break;
      case "And Block":
        block = new LogicBlock(x, y, 60, 80, name, "And");
        break;
      case "Or Block":
        block = new LogicBlock(x, y, 60, 80, name, "Or");
        break;
      case "Not Block":
        block = new NegationBlock(x, y, 60, 80);
        break;
      case "Add Block":
        block = new MathBlock(x, y, 60, 80, name, "+");
        break;
      case "Subtract Block":
        block = new MathBlock(x, y, 60, 80, name, "−");
        break;
      case "Multiply Block":
        block = new MathBlock(x, y, 60, 80, name, "×");
        break;
      case "Divide Block":
        block = new MathBlock(x, y, 60, 80, name, "÷");
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

  /* rendering methods */

  draw(): void {
    this.blockView.draw();
  }

  /* storage methods */

  storePortConnectors(): void {
    let s = "";
    for (let c of this.connectors) {
      s += c.output.block.uid + " @" + c.output.uid + ", " + c.input.block.uid + " @" + c.input.uid + "|";
    }
    s = s.substring(0, s.length - 1);
    localStorage.setItem("Port Connectors", s);
  }

  storeBlocks(): void {
    let s: string = "";
    for (let b of this.blocks) {
      s += b.getUid() + ", ";
    }
    localStorage.setItem("Block Sequence", s.substring(0, s.length - 2));
  }

  storeBlockLocation(block: Block) {
    localStorage.setItem("X: " + block.getUid(), block.getX().toString());
    localStorage.setItem("Y: " + block.getUid(), block.getY().toString());
  }

}
