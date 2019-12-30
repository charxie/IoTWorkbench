/*
 * @author Charles Xie
 */

import {BlockView} from "./BlockView";
import {Block} from "./Block";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {MathBlock} from "./MathBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {Port} from "./Port";
import {PortConnector} from "./PortConnector";
import {Slider} from "./Slider";
import {BlockContextMenu} from "./ui/BlockContextMenu";

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
    this.storeConnectorStates();
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
      this.storeBlockStates();
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
      case "NOT Block":
        block = new NegationBlock(x, y, 60, 80);
        break;
      case "AND Block":
        block = new LogicBlock(x, y, 60, 90, name, "AND");
        break;
      case "OR Block":
        block = new LogicBlock(x, y, 60, 90, name, "OR");
        break;
      case "NOR Block":
        block = new LogicBlock(x, y, 60, 90, name, "NOR");
        break;
      case "XOR Block":
        block = new LogicBlock(x, y, 60, 90, name, "XOR");
        break;
      case "XNOR Block":
        block = new LogicBlock(x, y, 60, 90, name, "XNOR");
        break;
      case "Add Block":
        block = new MathBlock(x, y, 60, 60, name, "+");
        break;
      case "Subtract Block":
        block = new MathBlock(x, y, 60, 60, name, "−");
        break;
      case "Multiply Block":
        block = new MathBlock(x, y, 60, 60, name, "×");
        break;
      case "Divide Block":
        block = new MathBlock(x, y, 60, 60, name, "÷");
        break;
      case "Modulus Block":
        block = new MathBlock(x, y, 60, 60, name, "%");
        break;
      case "Exponentiation Block":
        block = new MathBlock(x, y, 60, 60, name, "^");
        break;
      case "Rainbow HAT Block":
        block = new RainbowHatBlock(20, 20);
        break;
      case "Slider":
        block = new Slider(name, x, y, 100, 60);
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

  storeBlockStates(): void {
    let blockStates = [];
    for (let b of this.blocks) {
      blockStates.push(new Block.State(b));
    }
    localStorage.setItem("Block States", JSON.stringify(blockStates));
  }

  storeConnectorStates(): void {
    let connectorStates = [];
    for (let c of this.connectors) {
      if (c.output != null && c.input != null) {
        connectorStates.push(new PortConnector.State(c));
      }
    }
    localStorage.setItem("Connector States", JSON.stringify(connectorStates));
  }

}
