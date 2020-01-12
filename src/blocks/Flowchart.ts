/*
 * @author Charles Xie
 */

import {BlockView} from "./BlockView";
import {Block} from "./Block";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {ArithmeticBlock} from "./ArithmeticBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {Port} from "./Port";
import {PortConnector} from "./PortConnector";
import {Slider} from "./Slider";
import {Sticker} from "./Sticker";
import {ToggleSwitch} from "./ToggleSwitch";
import {ConditionalStatementBlock} from "./ConditionalStatementBlock";
import {SeriesBlock} from "./SeriesBlock";
import {ItemSelector} from "./ItemSelector";
import {Grapher} from "./Grapher";
import {WorkerBlock} from "./WorkerBlock";
import {ParametricEquationBlock} from "./ParametricEquationBlock";
import {XYGraph} from "./XYGraph";
import {flowchart} from "../Main";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class Flowchart {

  globalVariables = {};
  blocks: Block[] = [];
  connectors: PortConnector[] = [];
  copiedBlock: Block;
  readonly blockView: BlockView;

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

  /* global variables */

  updateGlobalVariable(name: string, value: any): void {
    this.globalVariables[name] = value;
    this.storeGlobalVariables();
  }

  removeGlobalVariable(name: string): void {
    delete this.globalVariables[name];
    this.storeGlobalVariables();
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

  getConnectorWithInput(input: Port): PortConnector {
    for (let connector of this.connectors) {
      if (connector.getInput() == input) {
        return connector;
      }
    }
    return null;
  }

  getConnectorsWithOutput(output: Port): PortConnector[] {
    let connectors = [];
    for (let c of this.connectors) {
      if (c.getOutput() == output) {
        connectors.push(c);
      }
    }
    return connectors;
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
      selectedBlock.destroy();
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
      case "Parametric Equation Block":
        block = new ParametricEquationBlock(uid, x, y, 60, 100);
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
        block = new ArithmeticBlock(uid, x, y, 60, 60, name, "+");
        break;
      case "Subtract Block":
        block = new ArithmeticBlock(uid, x, y, 60, 60, name, "−");
        break;
      case "Multiply Block":
        block = new ArithmeticBlock(uid, x, y, 60, 60, name, "×");
        break;
      case "Divide Block":
        block = new ArithmeticBlock(uid, x, y, 60, 60, name, "÷");
        break;
      case "Modulus Block":
        block = new ArithmeticBlock(uid, x, y, 60, 60, name, "%");
        break;
      case "Exponentiation Block":
        block = new ArithmeticBlock(uid, x, y, 60, 60, name, "^");
        break;
      case "Global Variable Block":
        block = new GlobalVariableBlock(uid, name, "var", x, y, 80, 80);
        break;
      case "Series Block":
        block = new SeriesBlock(uid, x, y, 80, 80, name, "Series");
        break;
      case "Worker Block":
        block = new WorkerBlock(uid, name, x, y, 80, 60);
        break;
      case "Conditional Statement Block":
        block = new ConditionalStatementBlock(uid, x, y, 80, 80, name, "IF");
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
      case "Item Selector":
        block = new ItemSelector(uid, name, x, y, 80, 60);
        break;
      case "Sticker":
        block = new Sticker(uid, name, x, y, 80, 80);
        break;
      case "Grapher":
        block = new Grapher(uid, name, x, y, 200, 160);
        break;
      case "X-Y Graph":
        block = new XYGraph(uid, name, x, y, 200, 220);
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

  updateLocalStorage(): void {
    this.storeGlobalVariables();
    this.storeViewState();
    this.storeBlockStates();
    this.storeConnectorStates();
  }

  storeGlobalVariables(): void {
    localStorage.setItem("Global Variables", JSON.stringify(this.globalVariables));
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

  storeBlockStates(): void {
    let blockStates = [];
    this.saveBlockStatesTo(blockStates);
    localStorage.setItem("Block States", JSON.stringify(blockStates));
  }

  private saveBlockStatesTo(blockStates): void {
    for (let b of this.blocks) {
      if (b instanceof Slider) {
        blockStates.push(new Slider.State(b));
      } else if (b instanceof GlobalVariableBlock) {
        blockStates.push(new GlobalVariableBlock.State(b));
      } else if (b instanceof SeriesBlock) {
        blockStates.push(new SeriesBlock.State(b));
      } else if (b instanceof WorkerBlock) {
        blockStates.push(new WorkerBlock.State(b));
      } else if (b instanceof ItemSelector) {
        blockStates.push(new ItemSelector.State(b));
      } else if (b instanceof ToggleSwitch) {
        blockStates.push(new ToggleSwitch.State(b));
      } else if (b instanceof Sticker) {
        blockStates.push(new Sticker.State(b));
      } else if (b instanceof Grapher) {
        blockStates.push(new Grapher.State(b));
      } else if (b instanceof XYGraph) {
        blockStates.push(new XYGraph.State(b));
      } else if (b instanceof ConditionalStatementBlock) {
        blockStates.push(new ConditionalStatementBlock.State(b));
      } else if (b instanceof UnaryFunctionBlock) {
        blockStates.push(new UnaryFunctionBlock.State(b));
      } else if (b instanceof BinaryFunctionBlock) {
        blockStates.push(new BinaryFunctionBlock.State(b));
      } else if (b instanceof ParametricEquationBlock) {
        blockStates.push(new ParametricEquationBlock.State(b));
      } else {
        blockStates.push(new Block.State(b));
      }
    }
  }

  storeViewState(): void {
    localStorage.setItem("Block View State", JSON.stringify(new BlockView.State(this.blockView)));
  }

  destroy(): void {
    for (let b of this.blocks) {
      b.destroy();
    }
  }

  clear(): void {
    this.destroy();
    this.globalVariables = {};
    this.blocks = [];
    this.connectors = [];
    this.updateLocalStorage();
    this.blockView.draw();
  }

  static State = class {
    readonly blockStates = [];
    readonly connectorStates = [];
    readonly blockViewState;
    readonly globalVariables = {};

    constructor(flowchart: Flowchart) {
      this.globalVariables = JSON.parse(JSON.stringify(flowchart.globalVariables));
      flowchart.saveBlockStatesTo(this.blockStates);
      for (let c of flowchart.connectors) {
        if (c.getOutput() != null && c.getInput() != null) {
          this.connectorStates.push(new PortConnector.State(c));
        }
      }
      this.blockViewState = new BlockView.State(flowchart.blockView);
    }
  };

}
