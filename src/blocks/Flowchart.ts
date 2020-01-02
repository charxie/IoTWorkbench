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
import {Sticker} from "./Sticker";
import {ToggleSwitch} from "./ToggleSwitch";

export class Flowchart {

  blocks: Block[] = [];
  connectors: PortConnector[] = [];
  blockView: BlockView;

  constructor() {
    this.blockView = new BlockView("block-view", this);
  }

  traverse(current: Block): void {
    current.updateModel();
    let outputTo = current.outputTo(); // visit children of current
    for (let next in outputTo) {
      if (outputTo.hasOwnProperty(next)) {
        this.traverse(outputTo[next]);
      }
    }
  }

  updateResults(): void {
    for (let b of this.blocks) {
      if (b.isSource()) {
        this.traverse(b);
      }
    }
    this.draw();
  }

  /* connector methods */

  getConnector(port: Port): PortConnector {
    for (let connector of this.connectors) {
      if (connector.getInput() == port || connector.getOutput() == port) {
        return connector;
      }
    }
    return null;
  }

  addPortConnector(output: Port, input: Port, uid: string): boolean {
    for (let c of this.connectors) {
      if (c.getInput() == input) { // this input port is already taken
        return false;
      }
    }
    let c = new PortConnector(uid, output, input);
    this.connectors.push(c);
    return true;
  }

  removePortConnector(connector: PortConnector): void {
    this.connectors.splice(this.connectors.indexOf(connector), 1);
    connector.destroy();
    this.updateResults();
    this.storeConnectorStates();
  }

  /* block methods */

  removeBlock(uid: string) {
    let selectedBlock: Block = null;
    for (let b of this.blocks) {
      if (uid == b.getUid()) {
        selectedBlock = b;
        break;
      }
    }
    if (selectedBlock != null) {
      let connectorsToRemove = [];
      for (let c of this.connectors) {
        let block1 = c.getInput().getBlock();
        let block2 = c.getOutput().getBlock();
        if (block1 == selectedBlock || block2 == selectedBlock) {
          connectorsToRemove.push(this.connectors.indexOf(c));
          c.destroy();
        }
      }
      if (connectorsToRemove.length > 0) {
        for (let i = connectorsToRemove.length - 1; i >= 0; i--) {
          this.connectors.splice(connectorsToRemove[i], 1);
        }
      }
      this.blocks.splice(this.blocks.indexOf(selectedBlock), 1);
      this.updateResults();
      this.storeBlockStates();
    }
  }

  getBlock(uid: string): Block {
    for (let b of this.blocks) {
      if (b.getUid() == uid) {
        return b;
      }
    }
    return null;
  }

  addBlock(name: string, x: number, y: number, uid: string): Block {
    let block: Block = null;
    switch (name) {
      case "Unary Function Block":
        block = new UnaryFunctionBlock(uid, x, y, 60, 80);
        break;
      case "Binary Function Block":
        block = new BinaryFunctionBlock(uid, x, y, 60, 100);
        break;
      case "NOT Block":
        block = new NegationBlock(uid, x, y, 60, 80);
        break;
      case "AND Block":
        block = new LogicBlock(uid, x, y, 60, 90, name, "AND");
        break;
      case "OR Block":
        block = new LogicBlock(uid, x, y, 60, 90, name, "OR");
        break;
      case "NOR Block":
        block = new LogicBlock(uid, x, y, 60, 90, name, "NOR");
        break;
      case "XOR Block":
        block = new LogicBlock(uid, x, y, 60, 90, name, "XOR");
        break;
      case "XNOR Block":
        block = new LogicBlock(uid, x, y, 60, 90, name, "XNOR");
        break;
      case "Add Block":
        block = new MathBlock(uid, x, y, 60, 60, name, "+");
        break;
      case "Subtract Block":
        block = new MathBlock(uid, x, y, 60, 60, name, "−");
        break;
      case "Multiply Block":
        block = new MathBlock(uid, x, y, 60, 60, name, "×");
        break;
      case "Divide Block":
        block = new MathBlock(uid, x, y, 60, 60, name, "÷");
        break;
      case "Modulus Block":
        block = new MathBlock(uid, x, y, 60, 60, name, "%");
        break;
      case "Exponentiation Block":
        block = new MathBlock(uid, x, y, 60, 60, name, "^");
        break;
      case "Rainbow HAT Block":
        block = new RainbowHatBlock(uid, 20, 20);
        break;
      case "Switch":
        block = new ToggleSwitch(uid, name, x, y, 60, 60);
        break;
      case "Slider":
        block = new Slider(uid, name, x, y, 100, 60);
        break;
      case "Sticker":
        block = new Sticker(uid, name, x, y, 80, 80);
        break;
    }
    if (block != null) {
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
      if (b instanceof Slider) {
        blockStates.push(new Slider.State(b));
      } else if (b instanceof ToggleSwitch) {
        blockStates.push(new ToggleSwitch.State(b));
      } else if (b instanceof Sticker) {
        blockStates.push(new Sticker.State(b));
      } else {
        blockStates.push(new Block.State(b));
      }
    }
    localStorage.setItem("Block States", JSON.stringify(blockStates));
  }

  storeConnectorStates(): void {
    let connectorStates = [];
    for (let c of this.connectors) {
      if (c.getOutput() != null && c.getInput() != null) {
        connectorStates.push(new PortConnector.State(c));
      }
    }
    localStorage.setItem("Connector States", JSON.stringify(connectorStates));
  }

  static State = class {
    readonly blockStates = [];
    readonly connectorStates = [];

    constructor(flowchart: Flowchart) {
      for (let b of flowchart.blocks) {
        if (b instanceof Slider) {
          this.blockStates.push(new Slider.State(b));
        } else if (b instanceof ToggleSwitch) {
          this.blockStates.push(new ToggleSwitch.State(b));
        } else if (b instanceof Sticker) {
          this.blockStates.push(new Sticker.State(b));
        } else {
          this.blockStates.push(new Block.State(b));
        }
      }
      for (let c of flowchart.connectors) {
        if (c.getOutput() != null && c.getInput() != null) {
          this.connectorStates.push(new PortConnector.State(c));
        }
      }
    }
  };

}
