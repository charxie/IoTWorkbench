/*
 * @author Charles Xie
 */

import $ from "jquery";
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
import {Sticker} from "./Sticker";
import {Beeper} from "./Beeper";
import {Slider} from "./Slider";
import {ToggleSwitch} from "./ToggleSwitch";
import {MomentarySwitch} from "./MomentarySwitch";
import {TurnoutSwitch} from "./TurnoutSwitch";
import {SeriesBlock} from "./SeriesBlock";
import {ItemSelector} from "./ItemSelector";
import {Grapher} from "./Grapher";
import {Space2D} from "./Space2D";
import {ParametricEquationBlock} from "./ParametricEquationBlock";
import {WorkerBlock} from "./WorkerBlock";
import {GlobalVariableBlock} from "./GlobalVariableBlock";
import {SwitchStatementBlock} from "./SwitchStatementBlock";
import {MultivariableFunctionBlock} from "./MultivariableFunctionBlock";
import {closeAllContextMenus, flowchart, system} from "../Main";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {RgbaColorBlock} from "./RgbaColorBlock";
import {Util} from "../Util";
import {ComplexNumberBlock} from "./ComplexNumberBlock";

export class Flowchart {

  globalVariables = {};
  blocks: Block[] = [];
  connectors: PortConnector[] = [];
  readonly blockView: BlockView;

  private connectedSources: Block[]; // temporary storage
  private blockConnectionFlag: boolean; // temporary flag
  private globalBlockFlag: boolean; // temporary flag

  constructor() {
    this.blockView = new BlockView("block-view", this);
  }

  traverse(current: Block): void {
    current.updateModel();
    let outputTo = current.outputTo();
    for (let next of outputTo) {
      this.traverse(next);
    }
  }

  // less efficient: this updates all the sources
  updateResults(): void {
    for (let b of this.blocks) {
      if (b.isSource()) {
        this.traverse(b);
      }
    }
    this.blockView.requestDraw();
  }

  // more efficient: this updates only the sources that are connected to the specified block
  updateResultsForBlock(block: Block): void {
    this.findConnectedSources(block);
    this.updateResultsForConnectedSources();
  }

  private updateResultsForConnectedSources(): void {
    if (this.connectedSources == undefined || this.connectedSources.length == 0) return;
    for (let b of this.connectedSources) {
      this.traverse(b);
    }
    this.blockView.requestDraw();
  }

  private findConnectedSources(block: Block): void {
    this.connectedSources = [];
    for (let b of this.blocks) {
      if (b.isSource()) {
        this.blockConnectionFlag = false;
        this.findConnection(b, block);
        if (this.blockConnectionFlag) {
          this.connectedSources.push(b);
        }
      }
    }
  }

  // we cannot use a return function in this recursion as there is an array iteration inside
  // (add return will cause only the first case of the array to be executed)
  private findConnection(start: Block, end: Block): void {
    let outputTo = start.outputTo();
    for (let next of outputTo) {
      if (next === end) {
        this.blockConnectionFlag = true;
        return;
      }
      this.findConnection(next, end);
    }
  }

  // check whether the start and end blocks are directly or indirectly connected
  areBlocksConnected(start: Block, end: Block): boolean {
    this.blockConnectionFlag = false;
    this.findConnection(start, end);
    return this.blockConnectionFlag;
  }

  /* global variables */

  updateGlobalVariable(name: string, value: any): void {
    this.globalVariables[name] = value;
  }

  removeGlobalVariable(name: string): void {
    delete this.globalVariables[name];
  }

  isConnectedToGlobalVariable(block: Block): boolean {
    this.globalBlockFlag = false;
    this.findGlobalVariable(block);
    return this.globalBlockFlag;
  }

  // we cannot use a return function in this recursion as there is an array iteration inside
  // (add return will cause only the first case of the array to be executed)
  private findGlobalVariable(block: Block): void {
    let outputTo = block.outputTo();
    for (let next of outputTo) {
      if (next instanceof GlobalVariableBlock) {
        this.globalBlockFlag = true;
        return;
      }
      this.findGlobalVariable(next);
    }
  }

  /* connector methods */

  getConnectorBetweenPorts(input: Port, output: Port): PortConnector {
    for (let c of this.connectors) {
      if (c.getInput() === input && c.getOutput() === output) {
        return c;
      }
    }
    return null;
  }

  getConnectors(port: Port): PortConnector[] {
    let connectors: PortConnector[] = [];
    for (let c of this.connectors) {
      if (c.getInput() === port || c.getOutput() === port) {
        connectors.push(c);
      }
    }
    return connectors;
  }

  getConnectorWithInput(input: Port): PortConnector {
    for (let i = this.connectors.length - 1; i >= 0; i--) { // last come, first serve
      let c = this.connectors[i];
      if (c.getInput() === input) {
        return c;
      }
    }
    return null;
  }

  getConnectorsWithOutput(output: Port): PortConnector[] {
    let connectors = [];
    for (let c of this.connectors) {
      if (c.getOutput() === output) {
        connectors.push(c);
      }
    }
    return connectors;
  }

  removeAllConnectors(port: Port): void {
    let connectors = this.getConnectors(port);
    if (connectors != null) {
      for (let c of connectors) {
        flowchart.removePortConnector(c);
      }
    }
  }

  addPortConnector(output: Port, input: Port, uid: string): boolean {
    for (let c of this.connectors) {
      // if this input port is already taken (except for one that can take multiple inputs)
      if (c.getInput() === input && !c.getInput().hasMultiInput()) {
        return false;
      }
      // if there is already a connector between the ports
      if (c.getInput() === input && c.getOutput() === output) {
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
    this.storeConnectorStates();
  }

  /* block methods */

  removeBlock(uid: string) {
    let selectedBlock: Block = null;
    for (let b of this.blocks) {
      if (uid === b.getUid()) {
        selectedBlock = b;
        break;
      }
    }
    if (selectedBlock != null) {
      let indicesOfConnectorsToRemove = [];
      let connectorsToRemove = [];
      for (let c of this.connectors) {
        let block1 = c.getInput().getBlock();
        let block2 = c.getOutput().getBlock();
        if (block1 === selectedBlock || block2 === selectedBlock) {
          indicesOfConnectorsToRemove.push(this.connectors.indexOf(c));
          connectorsToRemove.push(c);
        }
      }
      this.findConnectedSources(selectedBlock);
      if (indicesOfConnectorsToRemove.length > 0) {
        for (let i = indicesOfConnectorsToRemove.length - 1; i >= 0; i--) {
          this.connectors.splice(indicesOfConnectorsToRemove[i], 1);
        }
        // must destroy after connectors are updated, otherwise some updates of block triggered by the destruction may still propagate
        for (let c of connectorsToRemove) {
          c.destroy();
        }
      }
      this.blocks.splice(this.blocks.indexOf(selectedBlock), 1);
      if (connectorsToRemove.length > 0 && this.connectedSources.length > 0) { // no need to update results if the deleted block is not connected to a source
        this.updateResultsForConnectedSources();
      }
      this.storeBlockStates();
      selectedBlock.destroy();
    }
  }

  askToDeleteBlock(block: Block): void {
    let message = "<div style='font-size: 90%;'>Are you sure you want to delete " + block.getUid() + "?</div>";
    let that = this;
    $("#modal-dialog").html(message).dialog({
      resizable: false,
      modal: true,
      title: "Delete",
      height: 200,
      width: 300,
      buttons: {
        'OK': function () {
          that.removeBlock(block.getUid());
          that.blockView.requestDraw();
          $(this).dialog('close');
        },
        'Cancel': function () {
          $(this).dialog('close');
        }
      }
    });
  }

  getBlock(uid: string): Block {
    for (let b of this.blocks) {
      if (b.getUid() === uid) {
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
      case "Multivariable Function Block":
        block = new MultivariableFunctionBlock(uid, x, y, 60, 120);
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
      case "Global Object Block":
        block = new GlobalObjectBlock(uid, name, "obj", x, y, 80, 120);
        break;
      case "Series Block":
        block = new SeriesBlock(uid, x, y, 80, 80, name, "Series");
        break;
      case "Rgba Color Block":
        block = new RgbaColorBlock(uid, x, y, 80, 80, name, "RGBA");
        break;
      case "Complex Number Block":
        block = new ComplexNumberBlock(uid, x, y, 80, 80, name, "a+b*i");
        break;
      case "Worker Block":
        block = new WorkerBlock(uid, name, x, y, 80, 60);
        break;
      case "Turnout Switch":
        block = new TurnoutSwitch(uid, name, "Turnout", x, y, 60, 100);
        break;
      case "Switch Statement Block":
        block = new SwitchStatementBlock(uid, name, "Switch", x, y, 60, 100);
        break;
      case "Switch":
        block = new ToggleSwitch(uid, name, x, y, 60, 60);
        break;
      case "Momentary Switch":
        block = new MomentarySwitch(uid, name, x, y, 60, 60);
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
      case "Beeper":
        block = new Beeper(uid, name, x, y, 100, 100);
        break;
      case "Grapher":
        block = new Grapher(uid, name, x, y, 200, 160);
        break;
      case "Space2D":
        block = new Space2D(uid, name, x, y, 200, 220);
        break;
      case "Rainbow HAT Block":
        block = new RainbowHatBlock(uid, x, y);
        break;
    }
    if (block != null) {
      this.blocks.push(block);
    }
    return block;
  }

  addModelBlockIfMissing(): void {
    for (let m of system.hats) {
      let modelName = m.uid.substring(0, m.uid.indexOf("#") - 1);
      let blockName = modelName + " Block";
      let blockId = m.uid.replace(modelName, blockName);
      if (this.getBlock(blockId) == null) {
        this.addBlock(blockName, 10, 10, blockId);
      }
    }
  }

  /* storage methods */

  updateLocalStorage(): void {
    this.storeViewState();
    this.storeBlockStates();
    this.storeConnectorStates();
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

  saveBlockStatesTo(blockStates): void {
    for (let b of this.blocks) {
      if (b instanceof Slider) {
        blockStates.push(new Slider.State(b));
      } else if (b instanceof GlobalVariableBlock) {
        blockStates.push(new GlobalVariableBlock.State(b));
      } else if (b instanceof GlobalObjectBlock) {
        blockStates.push(new GlobalObjectBlock.State(b));
      } else if (b instanceof SeriesBlock) {
        blockStates.push(new SeriesBlock.State(b));
      } else if (b instanceof RgbaColorBlock) {
        blockStates.push(new RgbaColorBlock.State(b));
      } else if (b instanceof ComplexNumberBlock) {
        blockStates.push(new ComplexNumberBlock.State(b));
      } else if (b instanceof WorkerBlock) {
        blockStates.push(new WorkerBlock.State(b));
      } else if (b instanceof ItemSelector) {
        blockStates.push(new ItemSelector.State(b));
      } else if (b instanceof ToggleSwitch) {
        blockStates.push(new ToggleSwitch.State(b));
      } else if (b instanceof MomentarySwitch) {
        blockStates.push(new MomentarySwitch.State(b));
      } else if (b instanceof Sticker) {
        blockStates.push(new Sticker.State(b));
      } else if (b instanceof Beeper) {
        blockStates.push(new Beeper.State(b));
      } else if (b instanceof Grapher) {
        blockStates.push(new Grapher.State(b));
      } else if (b instanceof Space2D) {
        blockStates.push(new Space2D.State(b));
      } else if (b instanceof TurnoutSwitch) {
        blockStates.push(new TurnoutSwitch.State(b));
      } else if (b instanceof SwitchStatementBlock) {
        blockStates.push(new SwitchStatementBlock.State(b));
      } else if (b instanceof UnaryFunctionBlock) {
        blockStates.push(new UnaryFunctionBlock.State(b));
      } else if (b instanceof BinaryFunctionBlock) {
        blockStates.push(new BinaryFunctionBlock.State(b));
      } else if (b instanceof MultivariableFunctionBlock) {
        blockStates.push(new MultivariableFunctionBlock.State(b));
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
    closeAllContextMenus();
  }

  clear(): void {
    this.destroy();
    Util.clearObject(this.globalVariables);
    this.blocks.length = 0;
    this.connectors.length = 0;
    this.updateLocalStorage();
    this.blockView.requestDraw();
  }

}
