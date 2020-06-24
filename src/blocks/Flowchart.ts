/*
 * @author Charles Xie
 */

import $ from "jquery";
import {closeAllContextMenus, examples, flowchart, math, system, getInstanceString} from "../Main";
import {Util} from "../Util";
import {BlockView} from "./BlockView";
import {Block} from "./Block";
import {Port} from "./Port";
import {PortConnector} from "./PortConnector";
import {UnivariateFunctionBlock} from "./UnivariateFunctionBlock";
import {BivariateFunctionBlock} from "./BivariateFunctionBlock";
import {MultivariateFunctionBlock} from "./MultivariateFunctionBlock";
import {ParametricEquationBlock} from "./ParametricEquationBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {ArithmeticBlock} from "./ArithmeticBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
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
import {Space3D} from "./Space3D";
import {Field2D} from "./Field2D";
import {Surface3D} from "./Surface3D";
import {WorkerBlock} from "./WorkerBlock";
import {GlobalVariableBlock} from "./GlobalVariableBlock";
import {SwitchStatementBlock} from "./SwitchStatementBlock";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {RgbaColorBlock} from "./RgbaColorBlock";
import {ComplexNumberBlock} from "./ComplexNumberBlock";
import {ActionBlock} from "./ActionBlock";
import {BundledFunctionsBlock} from "./BundledFunctionsBlock";
import {GlobalBlock} from "./GlobalBlock";
import {BitwiseOperatorBlock} from "./BitwiseOperatorBlock";
import {FunctionDeclarationBlock} from "./FunctionDeclarationBlock";
import {FunctionBlock} from "./FunctionBlock";
import {VectorBlock} from "./VectorBlock";
import {NormalizationBlock} from "./NormalizationBlock";
import {MatrixBlock} from "./MatrixBlock";
import {DeterminantBlock} from "./DeterminantBlock";
import {MatrixInversionBlock} from "./MatrixInversionBlock";
import {MatrixTranspositionBlock} from "./MatrixTranspositionBlock";
import {IntegralBlock} from "./IntegralBlock";
import {FFTBlock} from "./FFTBlock";
import {SolverBlock} from "./SolverBlock";
import {ODESolverBlock} from "./ODESolverBlock";
import {TransientStateFDMSolverBlock} from "./TransientStateFDMSolverBlock";
import {SteadyStateFDMSolverBlock} from "./SteadyStateFDMSolverBlock";
import {RandomNumberGeneratorBlock} from "./RandomNumberGeneratorBlock";
import {BoundaryConditionBlock} from "./BoundaryConditionBlock";
import {ImageBlock} from "./ImageBlock";
import {AudioBlock} from "./AudioBlock";
import {DataBlock} from "./DataBlock";
import {MolecularViewerBlock} from "./MolecularViewerBlock";
import {ArrayInput} from "./ArrayInput";
import {MeanBlock} from "./MeanBlock";
import {UnivariateDescriptiveStatisticsBlock} from "./UnivariateDescriptiveStatisticsBlock";
import {BoxPlot} from "./BoxPlot";
import {Histogram} from "./Histogram";
import {WordCloud} from "./WordCloud";
import {PieChart} from "./PieChart";
import {RegressionBlock} from "./RegressionBlock";
import {CorrelationBlock} from "./CorrelationBlock";
import {StringInput} from "./StringInput";
import {ClusteringBlock} from "./ClusteringBlock";
import {HeatMap} from "./HeatMap";
import {BubblePlot} from "./BubblePlot";
import {ArrayAdapter} from "./ArrayAdapter";
import {ParallelCoordinatesPlot} from "./ParallelCoordinatesPlot";
import {RadarChart} from "./RadarChart";
import {KNNClassifierBlock} from "./KNNClassifierBlock";
import {QuantumStationaryState1DBlock} from "./QuantumStationaryState1DBlock";
import {QuantumDynamics1DBlock} from "./QuantumDynamics1DBlock";
import {BlochSphere} from "./BlochSphere";

export class Flowchart {

  declaredFunctions = {};
  declaredFunctionCodes = {};
  globalVariables = {};
  blocks: Block[] = [];
  connectors: PortConnector[] = [];
  readonly blockView: BlockView;

  private connectedSources: Block[]; // temporary storage
  private notConnectedSources: Block[]; // temporary storage
  private blockConnectionFlag: boolean; // temporary flag
  private globalBlockFlag: boolean; // temporary flag
  private workerBlockFlag: boolean; // temporary flag
  private connectedGlobalVariables: string[] = []; // temporay storage

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

  // sometimes traversing from a block itself to update its children can cause an infinite loop. This method bypasses the parent itself.
  traverseChildren(parent: Block): void {
    let ports = parent.getPorts();
    for (let p of ports) {
      if (!p.isInput()) {
        let connectors = this.getConnectors(p);
        for (let c of connectors) {
          this.traverse(c.getInput().getBlock());
        }
      }
    }
  }

  reset(block: Block): void {
    let outputTo = block.outputTo();
    for (let next of outputTo) {
      next.reset();
      this.reset(next);
    }
  }

  resetGlobalBlocks(): void {
    for (let b of this.blocks) {
      if (b instanceof GlobalBlock) {
        b.reset();
      }
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
    if (this.connectedSources === undefined || this.connectedSources.length === 0) return;
    for (let b of this.connectedSources) {
      this.traverse(b);
    }
    this.blockView.requestDraw();
  }

  updateResultsForNotConnectedSources(block: Block): void {
    this.findNotConnectedSources(block);
    if (this.notConnectedSources === undefined || this.notConnectedSources.length === 0) return;
    for (let b of this.notConnectedSources) {
      this.traverse(b);
    }
    this.blockView.requestDraw();
  }

  updateResultsExcludingAllWorkerBlocks(): void {
    for (let b of this.blocks) {
      // if the source block is connected to a worker, it is expected to rely on the worker to update all blocks that are connected to it
      if (b.isInitiator() && !this.isConnectedToWorkerBlock(b)) {
        this.traverse(b);
      }
    }
    this.blockView.requestDraw();
  }

  updateGlobalBlockChildren(): void {
    for (let b of this.blocks) {
      if (b instanceof GlobalBlock) {
        if (b instanceof GlobalVariableBlock) {
          b.getOutputPort().setValue(b.getValue());
        } else if (b instanceof GlobalObjectBlock) {
          b.getOutputPort().setValue(b.getValues());
        }
        b.updateConnectors();
        this.traverseChildren(b);
      }
    }
  }

  resetConnectedBlocks(block: Block) {
    let outputTo = block.outputTo();
    for (let next of outputTo) {
      next.reset();
      this.resetConnectedBlocks(next);
    }
  }

  isConnectedToWorkerBlock(block: Block): boolean {
    this.workerBlockFlag = false;
    this.findWorkerBlock(block);
    return this.workerBlockFlag;
  }

  // we cannot use a return function in this recursion as there is an array iteration inside
  // (add return will cause only the first case of the array to be executed)
  private findWorkerBlock(block: Block): void {
    let outputTo = block.outputTo();
    for (let next of outputTo) {
      if (next instanceof WorkerBlock) {
        this.workerBlockFlag = true;
        return;
      }
      this.findWorkerBlock(next);
    }
  }

  stopWorker(block: Block): void {
    for (let b of this.blocks) {
      if (b instanceof WorkerBlock) {
        if (this.areBlocksConnected(b, block)) {
          b.stop(false);
        }
      }
    }
    this.blockView.requestDraw();
  }

  stopAndResetWorker(block: Block): void {
    for (let b of this.blocks) {
      if (b instanceof WorkerBlock) {
        if (this.areBlocksConnected(b, block)) {
          b.stop(true);
        }
      }
    }
    this.blockView.requestDraw();
  }

  confirmSources(): void {
    for (let b of this.blocks) {
      this.confirmSource(b);
    }
  }

  private confirmSource(block: Block): void {
    if (block.isSource()) {
      let count = 0;
      let global = false;
      for (let c of this.connectors) {
        if (c.getOutput().getBlock() == block) {
          count++;
          if (c.getInput().getBlock() instanceof GlobalBlock) {
            global = true;
          }
        }
      }
      if (count == 1 && global) { // when this block is connected to only one global block, it is considered as a non-source block
        block.setSource(false);
      }
    }
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

  private findNotConnectedSources(block: Block): void {
    this.notConnectedSources = [];
    for (let b of this.blocks) {
      if (b.isSource()) {
        this.blockConnectionFlag = false;
        this.findConnection(b, block);
        if (!this.blockConnectionFlag) {
          this.notConnectedSources.push(b);
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

  erase(invoker: Block): void {
    for (let b of this.blocks) {
      if (flowchart.areBlocksConnected(invoker, b)) {
        if (b instanceof Space2D || b instanceof Space3D || b instanceof Histogram || b instanceof PieChart || b instanceof HeatMap) {
          b.erase();
        } else if (b instanceof Sticker) {
          if (b.getKeepResult()) {
            b.erase();
          }
        }
      }
    }
  }

  /* function declarations */

  updateFunctionDeclaration(block: FunctionDeclarationBlock): void {
    let name = block.getKey();
    let expression = block.getExpression();
    if (this.isFunctionExpressionDeclared(name, expression) && this.isFunctionNameDeclared(name)) return;
    let i = name.indexOf("(");
    let functionName = name.substring(0, i);
    for (let key in this.declaredFunctions) {
      let funName = key.substring(0, key.indexOf("("));
      if (funName === functionName) {
        this.removeFunctionDeclaration(key);
      }
    }
    this.declaredFunctions[name] = expression;
    if (block) block.setHasError(false);
    try {
      this.declaredFunctionCodes[name] = math.parse(expression).compile();
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      if (block) block.setHasError(true);
    }
  }

  isFunctionNameDeclared(name: string): boolean {
    let i = name.indexOf("(");
    let functionName = name.substring(0, i);
    for (let key in this.declaredFunctions) {
      i = key.indexOf("(");
      let fName = key.substring(0, i);
      if (fName === functionName) {
        return true;
      }
    }
    return false;
  }

  isFunctionExpressionDeclared(name: string, expression: string): boolean {
    let i = name.indexOf("(");
    let j = name.indexOf(")");
    let variableName = name.substring(i + 1, j);
    for (let key in this.declaredFunctions) {
      i = key.indexOf("(");
      j = key.indexOf(")");
      let vName = key.substring(i + 1, j);
      let exp = this.declaredFunctions[key].replace(new RegExp(vName, "g"), variableName);
      if (exp === expression) {
        return true;
      }
    }
    return false;
  }

  useDeclaredFunctions() {
    for (let b of this.blocks) {
      if (b instanceof FunctionBlock || b instanceof BundledFunctionsBlock || b instanceof ParametricEquationBlock || b instanceof SolverBlock) {
        b.useDeclaredFunctions();
      }
    }
  }

  private replaceWithDeclaredFunctionsAndDerivatives(exp: string, result: RegExpMatchArray, order: number): string {
    const wordPattern = /\w/g;
    Object.keys(this.declaredFunctions).forEach(e => {
      let i = e.indexOf("(");
      let j = e.indexOf(")");
      let functionName1 = e.substring(0, i);
      if (order > 0) {
        for (let i = 0; i < order; i++) {
          functionName1 += "'";
        }
      }
      let variableNames1 = e.substring(i + 1, j).split(",");
      for (let fun2 of result) {
        i = fun2.indexOf("(");
        let functionName2 = fun2.substring(0, i);
        if (functionName1 === functionName2) {
          j = fun2.indexOf(")");
          let variableNames2 = fun2.substring(i + 1, j).split(",");
          if (variableNames2.length === variableNames1.length) { // the numbers of arguments of the functions with the same name must be equal
            let fun1 = this.declaredFunctions[e] as string;
            for (let nvar = 0; nvar < variableNames1.length; nvar++) {
              if (variableNames2[nvar] !== variableNames1[nvar]) { // use the variable found in the actual function for the declared function before replacement
                let regex = new RegExp(variableNames1[nvar], "g");
                let match: RegExpExecArray = regex.exec(fun1);
                while (match != null) {
                  let c1 = match.index > 0 ? fun1.charAt(match.index - 1) : null;
                  let c2 = match.index + variableNames1[nvar].length < fun1.length ? fun1.charAt(match.index + variableNames1[nvar].length) : null;
                  let realVariable = true;
                  if ((c1 != null && c1.match(wordPattern) != null) || (c2 != null && c2.match(wordPattern) != null)) {
                    realVariable = false;
                  }
                  if (realVariable) {
                    fun1 = fun1.replaceFromTo(match.index, match.index + variableNames1[nvar].length, variableNames2[nvar]);
                  }
                  regex.lastIndex = match.index + 1;
                  match = regex.exec(fun1);
                }
              }
            }
            switch (order) {
              case 0:
                exp = exp.replace(fun2, "(" + fun1 + ")");
                break;
              case 1: // WARNING: I cannot handle the derivative of a multivariable function now
                let derivative = math.derivative(fun1, variableNames2[0]).toString();
                exp = exp.replace(fun2, "(" + derivative + ")");
                break;
              case 2:
                let firstOrderDerivative = math.derivative(fun1, variableNames2[0]).toString();
                let secondOrderDerivative = math.derivative(firstOrderDerivative, variableNames2[0]).toString();
                exp = exp.replace(fun2, "(" + secondOrderDerivative + ")");
                break;
              case 3:
                let firstOrderDerivative3 = math.derivative(fun1, variableNames2[0]).toString();
                let secondOrderDerivative3 = math.derivative(firstOrderDerivative3, variableNames2[0]).toString();
                let thirdOrderDerivative = math.derivative(secondOrderDerivative3, variableNames2[0]).toString();
                exp = exp.replace(fun2, "(" + thirdOrderDerivative + ")");
                break;
            }
          }
        }
      }
    });
    return exp;
  }

  replaceWithDeclaredFunctions(expression: string): string {
    let exp = expression;
    const pattern = /[A-Za-z][\w]*[']*\(-?[A-Za-z0-9]+(,-?[A-Za-z0-9]+)*\)/g;
    const result = exp.match(pattern);
    if (result == null || result.length == 0) return exp; // no declared function found in the expression
    exp = this.replaceWithDeclaredFunctionsAndDerivatives(exp, result, 0);
    if (expression.indexOf("'") != -1) {
      exp = this.replaceWithDeclaredFunctionsAndDerivatives(exp, result, 1)
      if (expression.indexOf("''") != -1) {
        exp = this.replaceWithDeclaredFunctionsAndDerivatives(exp, result, 2)
        if (expression.indexOf("'''") != -1) {
          exp = this.replaceWithDeclaredFunctionsAndDerivatives(exp, result, 3);
        }
      }
    }
    return exp;
  }

  removeFunctionDeclaration(name: string): void {
    delete this.declaredFunctions[name];
    delete this.declaredFunctionCodes[name];
  }

  /* global variables */

  updateGlobalVariable(name: string, value: any): void {
    this.globalVariables[name] = value;
  }

  removeGlobalVariable(name: string): void {
    delete this.globalVariables[name];
  }

  isConnectedToGlobalBlock(block: Block): boolean {
    this.globalBlockFlag = false;
    this.findGlobalBlock(block);
    return this.globalBlockFlag;
  }

  // we cannot use a return function in this recursion as there is an array iteration inside
  // (add return will cause only the first case of the array to be executed)
  private findGlobalBlock(block: Block): void {
    let outputTo = block.outputTo();
    for (let next of outputTo) {
      if (next instanceof GlobalBlock) {
        this.globalBlockFlag = true;
        return;
      }
      this.findGlobalBlock(next);
    }
  }

  updateResultsForAffectedSources(a: Block): void {
    const agv = this.getConnectedGlobalVariables(a).slice();
    if (agv.length > 0) {
      for (let b of this.blocks) {
        if (b.isSource()) {
          const bgv = this.getConnectedGlobalVariables(b);
          let overlap = agv.filter(x => -1 !== bgv.indexOf(x));
          if (overlap !== null && overlap.length > 0) {
            this.traverse(b);
          }
        }
      }
      this.blockView.requestDraw();
    }
  }

  private getConnectedGlobalVariables(block: Block): string[] {
    this.connectedGlobalVariables.length = 0;
    this.findGlobalVariables(block);
    return this.connectedGlobalVariables;
  }

  // we cannot use a return function in this recursion as there is an array iteration inside
  // (add return will cause only the first case of the array to be executed)
  private findGlobalVariables(block: Block): void {
    let outputTo = block.outputTo();
    for (let next of outputTo) {
      if (next instanceof GlobalVariableBlock) {
        if (this.connectedGlobalVariables.indexOf(next.getKey()) === -1) {
          this.connectedGlobalVariables.push(next.getKey());
        }
      } else if (next instanceof GlobalObjectBlock) {
        for (let key of next.getKeys()) {
          if (this.connectedGlobalVariables.indexOf(key) === -1) {
            this.connectedGlobalVariables.push(key);
          }
        }
      }
      this.findGlobalVariables(next);
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

  removeConnectorsToPort(port: Port): void {
    let connectors = this.getConnectors(port);
    for (let c of connectors) {
      this.removePortConnector(c);
    }
  }

  /* block methods */

  sendToBack(block: Block): void {
    let index = this.blocks.indexOf(block);
    if (index >= 0) {
      this.blocks.splice(index, 1);
      this.blocks.unshift(block);
      this.blockView.requestDraw();
      this.storeBlockStates();
    }
  }

  sendBackward(block: Block): void {
    let index = this.blocks.indexOf(block);
    if (index >= 1) {
      let x = this.blocks[index - 1];
      this.blocks[index - 1] = block;
      this.blocks[index] = x;
      this.blockView.requestDraw();
      this.storeBlockStates();
    }
  }

  bringForward(block: Block): void {
    let index = this.blocks.indexOf(block);
    if (index >= 0 && index < this.blocks.length - 1) {
      let x = this.blocks[index + 1];
      this.blocks[index + 1] = block;
      this.blocks[index] = x;
      this.blockView.requestDraw();
      this.storeBlockStates();
    }
  }

  bringToFront(block: Block): void {
    let index = this.blocks.indexOf(block);
    if (index >= 0) {
      this.blocks.splice(index, 1);
      this.blocks.push(block);
      this.blockView.requestDraw();
      this.storeBlockStates();
    }
  }

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
    let d = $("#modal-dialog").html("<div style='font-size: 90%;'>Are you sure you want to delete " + block.getUid() + "?</div>");
    d.dialog({
      resizable: false,
      modal: true,
      title: "Delete",
      height: 200,
      width: 300,
      buttons: {
        'OK': () => {
          this.removeBlock(block.getUid());
          this.blockView.requestDraw();
          d.dialog('close');
        },
        'Cancel': () => d.dialog('close')
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
      case "Function Declaration Block":
        block = new FunctionDeclarationBlock(uid, name, "f", x, y, 60, 80);
        break;
      case "Univariate Function Block":
        block = new UnivariateFunctionBlock(uid, x, y, 60, 80);
        break;
      case "Bivariate Function Block":
        block = new BivariateFunctionBlock(uid, x, y, 60, 100);
        break;
      case "Multivariate Function Block":
        block = new MultivariateFunctionBlock(uid, x, y, 60, 120);
        break;
      case "Parametric Equation Block":
        block = new ParametricEquationBlock(uid, x, y, 60, 100);
        break;
      case "Bundled Functions Block":
        block = new BundledFunctionsBlock(uid, x, y, 60, 100);
        break;
      case "Bitwise AND Block":
        block = new BitwiseOperatorBlock(uid, name, "&", x, y, 60, 60);
        break;
      case "Bitwise OR Block":
        block = new BitwiseOperatorBlock(uid, name, "|", x, y, 60, 60);
        break;
      case "Bitwise XOR Block":
        block = new BitwiseOperatorBlock(uid, name, "^", x, y, 60, 60);
        break;
      case "Bitwise NOT Block":
        block = new BitwiseOperatorBlock(uid, name, "~", x, y, 60, 60);
        break;
      case "Bitwise Left Shift Block":
        block = new BitwiseOperatorBlock(uid, name, "<<", x, y, 80, 60);
        break;
      case "Bitwise Signed Right Shift Block":
        block = new BitwiseOperatorBlock(uid, name, ">>", x, y, 80, 60);
        break;
      case "Bitwise Zero-Fill Right Shift Block":
        block = new BitwiseOperatorBlock(uid, name, ">>>", x, y, 80, 60);
        break;
      case "NOT Block":
        block = new NegationBlock(uid, x, y, 60, 80);
        break;
      case "AND Block":
        block = new LogicBlock(uid, name, "AND", x, y, 60, 90);
        break;
      case "OR Block":
        block = new LogicBlock(uid, name, "OR", x, y, 60, 90);
        break;
      case "NOR Block":
        block = new LogicBlock(uid, name, "NOR", x, y, 60, 90);
        break;
      case "XOR Block":
        block = new LogicBlock(uid, name, "XOR", x, y, 60, 90);
        break;
      case "XNOR Block":
        block = new LogicBlock(uid, name, "XNOR", x, y, 60, 90);
        break;
      case "Add Block":
        block = new ArithmeticBlock(uid, name, "+", x, y, 60, 60);
        break;
      case "Subtract Block":
        block = new ArithmeticBlock(uid, name, "−", x, y, 60, 60);
        break;
      case "Multiply Block":
        block = new ArithmeticBlock(uid, name, "×", x, y, 60, 60);
        break;
      case "Divide Block":
        block = new ArithmeticBlock(uid, name, "÷", x, y, 60, 60);
        break;
      case "Modulus Block":
        block = new ArithmeticBlock(uid, name, "%", x, y, 60, 60);
        break;
      case "Exponentiation Block":
        block = new ArithmeticBlock(uid, name, "^", x, y, 60, 60);
        break;
      case "Dot Product Block":
        block = new ArithmeticBlock(uid, name, "•", x, y, 60, 60);
        break;
      case "Global Variable Block":
        block = new GlobalVariableBlock(uid, name, "var", x, y, 80, 80);
        break;
      case "Global Object Block":
        block = new GlobalObjectBlock(uid, name, "obj", x, y, 80, 120);
        break;
      case "Series Block":
        block = new SeriesBlock(uid, name, "Series", x, y, 80, 80);
        break;
      case "Rgba Color Block":
        block = new RgbaColorBlock(uid, name, "RGBA", x, y, 80, 80);
        break;
      case "Complex Number Block":
        block = new ComplexNumberBlock(uid, name, "a+b*i", x, y, 80, 80);
        break;
      case "Vector Block":
        block = new VectorBlock(uid, name, "V", x, y, 80, 80);
        break;
      case "Normalization Block":
        block = new NormalizationBlock(uid, x, y, 60, 60);
        break;
      case "Matrix Block":
        block = new MatrixBlock(uid, name, "M", x, y, 60, 60);
        break;
      case "Determinant Block":
        block = new DeterminantBlock(uid, x, y, 60, 60);
        break;
      case "Matrix Transposition Block":
        block = new MatrixTranspositionBlock(uid, x, y, 60, 60);
        break;
      case "Matrix Inversion Block":
        block = new MatrixInversionBlock(uid, x, y, 60, 60);
        break;
      case "Worker Block":
        block = new WorkerBlock(uid, name, x, y, 80, 60);
        break;
      case "Action Block":
        block = new ActionBlock(uid, name, x, y, 80, 60);
        break;
      case "Image Block":
        block = new ImageBlock(uid, name, x, y, 80, 60);
        break;
      case "Audio Block":
        block = new AudioBlock(uid, name, x, y, 80, 60);
        break;
      case "Data Block":
        block = new DataBlock(uid, name, x, y, 80, 60);
        break;
      case "Molecular Viewer Block":
        block = new MolecularViewerBlock(false, uid, name, x, y, 80, 60);
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
      case "Box Plot":
        block = new BoxPlot(uid, name, x, y, 200, 160);
        break;
      case "Bubble Plot":
        block = new BubblePlot(uid, name, x, y, 200, 160);
        break;
      case "Integral Block":
        block = new IntegralBlock(uid, x, y, 200, 160);
        break;
      case "Regression Block":
        block = new RegressionBlock(uid, x, y, 200, 160);
        break;
      case "Correlation Block":
        block = new CorrelationBlock(uid, x, y, 200, 160);
        break;
      case "Clustering Block":
        block = new ClusteringBlock(uid, x, y, 200, 160);
        break;
      case "KNN Classifier Block":
        block = new KNNClassifierBlock(uid, x, y, 200, 160);
        break;
      case "FFT Block":
        block = new FFTBlock(uid, x, y, 200, 160);
        break;
      case "ODE Solver Block":
        block = new ODESolverBlock(uid, x, y, 200, 160);
        break;
      case "Transient State FDM Solver Block":
        block = new TransientStateFDMSolverBlock(uid, x, y, 200, 160);
        break;
      case "Steady State FDM Solver Block":
        block = new SteadyStateFDMSolverBlock(uid, x, y, 200, 160);
        break;
      case "Boundary Condition Block":
        block = new BoundaryConditionBlock(uid, x, y, 200, 160);
        break;
      case "Histogram":
        block = new Histogram(uid, name, x, y, 200, 220);
        break;
      case "Pie Chart":
        block = new PieChart(uid, name, x, y, 200, 220);
        break;
      case "Heat Map":
        block = new HeatMap(uid, name, x, y, 200, 220);
        break;
      case "Radar Chart":
        block = new RadarChart(uid, name, x, y, 200, 220);
        break;
      case "Parallel Coordinates Plot":
        block = new ParallelCoordinatesPlot(uid, name, x, y, 200, 220);
        break;
      case "Space2D":
        block = new Space2D(uid, name, x, y, 200, 220);
        break;
      case "Space3D":
        block = new Space3D(false, uid, name, x, y, 200, 220);
        break;
      case "Field2D":
        block = new Field2D(uid, name, x, y, 200, 220);
        break;
      case "Surface3D":
        block = new Surface3D(false, uid, name, x, y, 200, 220);
        break;
      case "Random Number Generator Block":
        block = new RandomNumberGeneratorBlock(uid, x, y, 200, 220);
        break;
      case "Array Adapter":
        block = new ArrayAdapter(uid, x, y, 80, 80);
        break;
      case "Array Input":
        block = new ArrayInput(uid, false, name, x, y, 80, 80);
        break;
      case "String Input":
        block = new StringInput(uid, false, name, x, y, 80, 80);
        break;
      case "Mean Block":
        block = new MeanBlock(uid, x, y, 60, 60);
        break;
      case "Univariate Descriptive Statistics Block":
        block = new UnivariateDescriptiveStatisticsBlock(uid, x, y, 60, 60);
        break;
      case "Wordcloud":
        block = new WordCloud(uid, name, x, y, 300, 320);
        break;
      case "Quantum Stationary State 1D Block":
        block = new QuantumStationaryState1DBlock(uid, x, y, 200, 160);
        break;
      case "Quantum Dynamics 1D Block":
        block = new QuantumDynamics1DBlock(uid, x, y, 200, 160);
        break;
      case "Bloch Sphere Block":
        block = new BlochSphere(uid, name, x, y, 200, 160);
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
    localStorage.setItem(getInstanceString("Connector States"), JSON.stringify(connectorStates));
  }

  storeBlockStates(): void {
    let blockStates = [];
    this.saveBlockStatesTo(blockStates);
    localStorage.setItem(getInstanceString("Block States"), JSON.stringify(blockStates));
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
      } else if (b instanceof FunctionDeclarationBlock) {
        blockStates.push(new FunctionDeclarationBlock.State(b));
      } else if (b instanceof RgbaColorBlock) {
        blockStates.push(new RgbaColorBlock.State(b));
      } else if (b instanceof ComplexNumberBlock) {
        blockStates.push(new ComplexNumberBlock.State(b));
      } else if (b instanceof VectorBlock) {
        blockStates.push(new VectorBlock.State(b));
      } else if (b instanceof MatrixBlock) {
        blockStates.push(new MatrixBlock.State(b));
      } else if (b instanceof MatrixTranspositionBlock) {
        blockStates.push(new MatrixTranspositionBlock.State(b));
      } else if (b instanceof WorkerBlock) {
        blockStates.push(new WorkerBlock.State(b));
      } else if (b instanceof ActionBlock) {
        blockStates.push(new ActionBlock.State(b));
      } else if (b instanceof ImageBlock) {
        blockStates.push(new ImageBlock.State(b));
      } else if (b instanceof AudioBlock) {
        blockStates.push(new AudioBlock.State(b));
      } else if (b instanceof DataBlock) {
        blockStates.push(new DataBlock.State(b));
      } else if (b instanceof MolecularViewerBlock) {
        blockStates.push(new MolecularViewerBlock.State(b));
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
      } else if (b instanceof BoxPlot) {
        blockStates.push(new BoxPlot.State(b));
      } else if (b instanceof BubblePlot) {
        blockStates.push(new BubblePlot.State(b));
      } else if (b instanceof IntegralBlock) {
        blockStates.push(new IntegralBlock.State(b));
      } else if (b instanceof RegressionBlock) {
        blockStates.push(new RegressionBlock.State(b));
      } else if (b instanceof CorrelationBlock) {
        blockStates.push(new CorrelationBlock.State(b));
      } else if (b instanceof ClusteringBlock) {
        blockStates.push(new ClusteringBlock.State(b));
      } else if (b instanceof KNNClassifierBlock) {
        blockStates.push(new KNNClassifierBlock.State(b));
      } else if (b instanceof FFTBlock) {
        blockStates.push(new FFTBlock.State(b));
      } else if (b instanceof ODESolverBlock) {
        blockStates.push(new ODESolverBlock.State(b));
      } else if (b instanceof TransientStateFDMSolverBlock) {
        blockStates.push(new TransientStateFDMSolverBlock.State(b));
      } else if (b instanceof SteadyStateFDMSolverBlock) {
        blockStates.push(new SteadyStateFDMSolverBlock.State(b));
      } else if (b instanceof BoundaryConditionBlock) {
        blockStates.push(new BoundaryConditionBlock.State(b));
      } else if (b instanceof Histogram) {
        blockStates.push(new Histogram.State(b));
      } else if (b instanceof PieChart) {
        blockStates.push(new PieChart.State(b));
      } else if (b instanceof HeatMap) {
        blockStates.push(new HeatMap.State(b));
      } else if (b instanceof RadarChart) {
        blockStates.push(new RadarChart.State(b));
      } else if (b instanceof ParallelCoordinatesPlot) {
        blockStates.push(new ParallelCoordinatesPlot.State(b));
      } else if (b instanceof Space2D) {
        blockStates.push(new Space2D.State(b));
      } else if (b instanceof Space3D) {
        blockStates.push(new Space3D.State(b));
      } else if (b instanceof Field2D) {
        blockStates.push(new Field2D.State(b));
      } else if (b instanceof Surface3D) {
        blockStates.push(new Surface3D.State(b));
      } else if (b instanceof TurnoutSwitch) {
        blockStates.push(new TurnoutSwitch.State(b));
      } else if (b instanceof SwitchStatementBlock) {
        blockStates.push(new SwitchStatementBlock.State(b));
      } else if (b instanceof UnivariateFunctionBlock) {
        blockStates.push(new UnivariateFunctionBlock.State(b));
      } else if (b instanceof BivariateFunctionBlock) {
        blockStates.push(new BivariateFunctionBlock.State(b));
      } else if (b instanceof MultivariateFunctionBlock) {
        blockStates.push(new MultivariateFunctionBlock.State(b));
      } else if (b instanceof ParametricEquationBlock) {
        blockStates.push(new ParametricEquationBlock.State(b));
      } else if (b instanceof BundledFunctionsBlock) {
        blockStates.push(new BundledFunctionsBlock.State(b));
      } else if (b instanceof RandomNumberGeneratorBlock) {
        blockStates.push(new RandomNumberGeneratorBlock.State(b));
      } else if (b instanceof ArrayAdapter) {
        blockStates.push(new ArrayAdapter.State(b));
      } else if (b instanceof ArrayInput) {
        blockStates.push(new ArrayInput.State(b));
      } else if (b instanceof StringInput) {
        blockStates.push(new StringInput.State(b));
      } else if (b instanceof MeanBlock) {
        blockStates.push(new MeanBlock.State(b));
      } else if (b instanceof UnivariateDescriptiveStatisticsBlock) {
        blockStates.push(new UnivariateDescriptiveStatisticsBlock.State(b));
      } else if (b instanceof WordCloud) {
        blockStates.push(new WordCloud.State(b));
      } else if (b instanceof QuantumStationaryState1DBlock) {
        blockStates.push(new QuantumStationaryState1DBlock.State(b));
      } else if (b instanceof QuantumDynamics1DBlock) {
        blockStates.push(new QuantumDynamics1DBlock.State(b));
      } else if (b instanceof BlochSphere) {
        blockStates.push(new BlochSphere.State(b));
      } else {
        blockStates.push(new Block.State(b));
      }
    }
  }

  storeViewState(): void {
    localStorage.setItem(getInstanceString("Block View State"), JSON.stringify(new BlockView.State(this.blockView)));
  }

  destroy(): void {
    for (let b of this.blocks) {
      b.destroy();
    }
    closeAllContextMenus();
  }

  clear(): void {
    this.destroy();
    Util.clearObject(this.declaredFunctions);
    Util.clearObject(this.declaredFunctionCodes);
    Util.clearObject(this.globalVariables);
    this.blocks.length = 0;
    this.connectors.length = 0;
    this.updateLocalStorage();
    this.blockView.requestDraw();
  }

  askToClear(): void {
    if (this.blocks.length > 0 || this.connectors.length > 0) {
      let d = $("#modal-dialog").html("<div style='font-size: 90%;'>Are you sure you want to clear the code?</div>");
      d.dialog({
        resizable: false,
        modal: true,
        title: "Clear",
        height: 150,
        width: 350,
        buttons: {
          'OK': () => {
            this.clear();
            examples.deselect();
            d.dialog('close');
          },
          'Cancel': () => d.dialog('close')
        }
      });
    }

  }

}
