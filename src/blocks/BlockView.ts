/*
 * @author Charles Xie
 */

import {Flowchart} from "./Flowchart";
import {closeAllContextMenus, contextMenus, flowchart, sound, undoManager} from "../Main";
import {Movable} from "../Movable";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {Port} from "./Port";
import {Connector} from "./Connector";
import {PortConnector} from "./PortConnector";
import {Block} from "./Block";
import {UnivariateFunctionBlock} from "./UnivariateFunctionBlock";
import {BivariateFunctionBlock} from "./BivariateFunctionBlock";
import {MultivariateFunctionBlock} from "./MultivariateFunctionBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {ArithmeticBlock} from "./ArithmeticBlock";
import {ToggleSwitch} from "./ToggleSwitch";
import {MomentarySwitch} from "./MomentarySwitch";
import {Slider} from "./Slider";
import {ItemSelector} from "./ItemSelector";
import {Sticker} from "./Sticker";
import {Beeper} from "./Beeper";
import {TurnoutSwitch} from "./TurnoutSwitch";
import {SeriesBlock} from "./SeriesBlock";
import {ParametricEquationBlock} from "./ParametricEquationBlock";
import {Grapher} from "./Grapher";
import {Space2D} from "./Space2D";
import {Space3D} from "./Space3D";
import {Field2D} from "./Field2D";
import {Surface3D} from "./Surface3D";
import {WorkerBlock} from "./WorkerBlock";
import {ActionBlock} from "./ActionBlock";
import {GlobalVariableBlock} from "./GlobalVariableBlock";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {SwitchStatementBlock} from "./SwitchStatementBlock";
import {RgbaColorBlock} from "./RgbaColorBlock";
import {ComplexNumberBlock} from "./ComplexNumberBlock";
import {BundledFunctionsBlock} from "./BundledFunctionsBlock";
import {BlockUtilities} from "./BlockUtilities";
import {BitwiseOperatorBlock} from "./BitwiseOperatorBlock";
import {FunctionDeclarationBlock} from "./FunctionDeclarationBlock";
import {VectorBlock} from "./VectorBlock";
import {NormalizationBlock} from "./NormalizationBlock";
import {MatrixBlock} from "./MatrixBlock";
import {DeterminantBlock} from "./DeterminantBlock";
import {MatrixInversionBlock} from "./MatrixInversionBlock";
import {MatrixTranspositionBlock} from "./MatrixTranspositionBlock";
import {IntegralBlock} from "./IntegralBlock";
import {FFTBlock} from "./FFTBlock";
import {ODESolverBlock} from "./ODESolverBlock";
import {TransientStateFDMSolverBlock} from "./TransientStateFDMSolverBlock";
import {SteadyStateFDMSolverBlock} from "./SteadyStateFDMSolverBlock";
import {RandomNumberGeneratorBlock} from "./RandomNumberGeneratorBlock";
import {BoundaryConditionBlock} from "./BoundaryConditionBlock";
import {StateIO} from "../StateIO";
import {State} from "../State";
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

export class BlockView {

  readonly canvas: HTMLCanvasElement;

  private selectedMovable: Movable = null;
  private selectedMovableMoved: boolean = false;
  private selectedMovablePreviousX: number;
  private selectedMovablePreviousY: number;
  private keyDownCount: number = 0; // keyDown events are fired continuously when the key is held down. To undo, we need to know the first time it is down.
  private selectedResizeName: string;
  private selectedBlock: Block = null;
  private selectedBlockPreviousRect: Rectangle;
  private selectedBlockResized: boolean = false;
  private copiedBlock: Block;
  private selectedPort: Port;
  private selectedPortConnector: PortConnector;
  private highlightedPortConnectors: PortConnector[];
  private mouseUpExpected: boolean;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;
  private connectorOntheFly: Connector;
  private gridSize: number = 100;
  private blockStyle: string = "Shade";
  private mouseOverPort: Port;
  private contextMenuClickX: number;
  private contextMenuClickY: number;
  private preventMainMouseEvent: boolean = false; // when a block is handling its own mouse events such as dragging a knob, set this flag true
  private longPressStartTime: number;
  private static readonly longPressTime: number = 1000;
  private static readonly resizeNames: string[] = ["upperLeft", "upperRight", "lowerLeft", "lowerRight", "upperMid", "lowerMid", "leftMid", "rightMid"];
  private drawFunc;

  static State = class {

    readonly backgroundColor: string;
    readonly blockStyle: string;

    constructor(view: BlockView) {
      this.backgroundColor = view.getBackgroundColor();
      this.blockStyle = view.getBlockStyle();
    }

  };

  constructor(canvasId: string, flowchart: Flowchart) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.canvas.addEventListener("touchstart", this.touchStart.bind(this), false);
    this.canvas.addEventListener("touchend", this.touchEnd.bind(this), false);
    this.canvas.addEventListener("touchmove", this.touchMove.bind(this), false);
    this.canvas.addEventListener("keydown", this.keyDown.bind(this), false);
    this.canvas.addEventListener("keyup", this.keyUp.bind(this), false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu.bind(this), false);
    document.addEventListener("mouseout", this.mouseOut.bind(this), false); // FIXME: Why add the listener to the document?

    this.selectedBlockPreviousRect = new Rectangle(0, 0, 1, 1);
    this.connectorOntheFly = new Connector();

    let playground = document.getElementById("block-playground") as HTMLDivElement;

    // drag and drop support
    playground.addEventListener("dragstart", (e) => {
      this.draggedElementId = (<HTMLElement>e.target).id;
      if (this.selectedBlock) {
        this.selectedBlock.setSelected(false);
        this.selectedBlock = null;
      }
    });
    playground.addEventListener("dragover", (e) => {
      e.preventDefault(); // prevent default to allow drop
    }, false);
    playground.addEventListener("drop", (e) => {
      e.preventDefault();
      let id = (<HTMLElement>e.target).id;
      if (id === "block-view") {
        let x = e.offsetX;
        let y = e.offsetY;
        this.canvas.focus();
        let b = this.dropBlock(x, y);
        if (b != null) {
          b.setSelected(true);
          this.selectedBlock = b;
        }
      }
    }, false);

    // drag and drop support for mobile browsers (as the above drag-and-drop isn't supported on mobile browsers)
    let clientX, clientY;
    playground.addEventListener("touchstart", (e) => {
      clientX = e.targetTouches[0].clientX;
      clientY = e.targetTouches[0].clientY;
      if (!Util.containsInRect(clientX, clientY, this.canvas.getBoundingClientRect())) {
        if (this.selectedBlock) {
          this.selectedBlock.setSelected(false);
          this.selectedBlock = null;
        }
      }
    });
    playground.addEventListener("touchmove", (e) => {
      //e.preventDefault(); // do not call this as it will disable the zoom and move features
      clientX = e.targetTouches[0].clientX;
      clientY = e.targetTouches[0].clientY;
    }, false);
    playground.addEventListener("touchend", (e) => {
      //e.preventDefault(); // do not call this as it will disable the zoom and move features
      this.draggedElementId = (<HTMLElement>e.target).id;
      let rect = this.canvas.getBoundingClientRect();
      if (Util.containsInRect(clientX, clientY, rect)) {
        let b = this.dropBlock(clientX - rect.x, clientY - rect.y);
        if (b != null) {
          b.setSelected(true);
          this.selectedBlock = b;
        }
      }
    }, false);

  }

  private dropBlock(x: number, y: number): Block {
    let timestamp = Date.now().toString(16);
    let b: Block = null;
    switch (this.draggedElementId) {
      case "function-declaration-block":
        b = this.addBlockUndoable(new FunctionDeclarationBlock("Function Declaration Block #" + timestamp, "Function Declaration Block", "f", x - 80, y - 30, 160, 60));
        break;
      case "univariate-function-block":
        b = this.addBlockUndoable(new UnivariateFunctionBlock("Univariate Function Block #" + timestamp, x - 50, y - 30, 100, 60));
        break;
      case "bivariate-function-block":
        b = this.addBlockUndoable(new BivariateFunctionBlock("Bivariate Function Block #" + timestamp, x - 50, y - 30, 100, 60));
        break;
      case "multivariate-function-block":
        b = this.addBlockUndoable(new MultivariateFunctionBlock("Multivariate Function Block #" + timestamp, x - 50, y - 30, 100, 60));
        break;
      case "parametric-equation-block":
        b = this.addBlockUndoable(new ParametricEquationBlock("Parametric Equation Block #" + timestamp, x - 60, y - 40, 120, 80));
        break;
      case "bundled-functions-block":
        b = this.addBlockUndoable(new BundledFunctionsBlock("Bundled Functions Block #" + timestamp, x - 50, y - 60, 100, 120));
        break;
      case "global-variable-block":
        b = this.addBlockUndoable(new GlobalVariableBlock("Global Variable Block #" + timestamp, "Global Variable Block", "var", x - 40, y - 30, 80, 60));
        break;
      case "global-object-block":
        b = this.addBlockUndoable(new GlobalObjectBlock("Global Object Block #" + timestamp, "Global Object Block", "obj", x - 50, y - 30, 100, 60));
        break;
      case "series-block":
        b = this.addBlockUndoable(new SeriesBlock("Series Block #" + timestamp, "Series Block", "Series", x - 30, y - 50, 60, 100));
        break;
      case "rgba-color-block":
        b = this.addBlockUndoable(new RgbaColorBlock("Rgba Color Block #" + timestamp, "Rgba Color Block", "RGBA", x - 30, y - 40, 60, 80));
        break;
      case "complex-number-block":
        b = this.addBlockUndoable(new ComplexNumberBlock("Complex Number Block #" + timestamp, "Complex Number Block", "a+b*i", x - 30, y - 40, 60, 80));
        break;
      case "vector-block":
        b = this.addBlockUndoable(new VectorBlock("Vector Block #" + timestamp, "Vector Block", "V", x - 50, y - 80, 100, 160));
        break;
      case "normalization-block":
        b = this.addBlockUndoable(new NormalizationBlock("Normalization Block #" + timestamp, x - 30, y - 30, 60, 60));
        break;
      case "matrix-block":
        b = this.addBlockUndoable(new MatrixBlock("Matrix Block #" + timestamp, "Matrix Block", "M", x - 80, y - 80, 160, 160));
        break;
      case "determinant-block":
        b = this.addBlockUndoable(new DeterminantBlock("Determinant Block #" + timestamp, x - 40, y - 30, 80, 60));
        break;
      case "matrix-transposition-block":
        b = this.addBlockUndoable(new MatrixTranspositionBlock("Matrix Transposition Block #" + timestamp, x - 40, y - 30, 80, 60));
        break;
      case "matrix-inversion-block":
        b = this.addBlockUndoable(new MatrixInversionBlock("Matrix Inversion Block #" + timestamp, x - 40, y - 30, 80, 60));
        break;
      case "worker-block":
        b = this.addBlockUndoable(new WorkerBlock("Worker Block #" + timestamp, "Worker", x - 40, y - 30, 80, 60));
        break;
      case "action-block":
        b = this.addBlockUndoable(new ActionBlock("Action Block #" + timestamp, "Action", x - 40, y - 30, 80, 60));
        break;
      case "image-block":
        b = this.addBlockUndoable(new ImageBlock("Image Block #" + timestamp, "Image", x - 50, y - 60, 100, 120));
        break;
      case "audio-block":
        b = this.addBlockUndoable(new AudioBlock("Audio Block #" + timestamp, "Audio", x - 30, y - 30, 60, 60));
        break;
      case "data-block":
        b = this.addBlockUndoable(new DataBlock("Data Block #" + timestamp, "Data", x - 40, y - 40, 80, 80));
        break;
      case "molecular-viewer-block":
        let molecularViewer = new MolecularViewerBlock(false, "Molecular Viewer Block #" + timestamp, "Molecular Viewer", x - 100, y - 120, 200, 240);
        this.addBlockUndoable(molecularViewer);
        molecularViewer.locateOverlay();
        break;
      case "turnout-switch-block":
        b = this.addBlockUndoable(new TurnoutSwitch("Turnout Switch #" + timestamp, "Turnout Switch", "Turnout", x - 50, y - 30, 100, 60));
        break;
      case "switch-statement-block":
        b = this.addBlockUndoable(new SwitchStatementBlock("Switch Statement Block #" + timestamp, "Switch Statement Block", "Switch", x - 30, y - 50, 60, 100));
        break;
      case "logic-and-block":
        b = this.addBlockUndoable(new LogicBlock("AND Block #" + timestamp, "AND Block", "AND", x - 30, y - 40, 60, 80));
        break;
      case "logic-not-block":
        b = this.addBlockUndoable(new NegationBlock("NOT Block #" + timestamp, x - 30, y - 40, 60, 80));
        break;
      case "bitwise-operator-and-block":
        b = this.addBlockUndoable(new BitwiseOperatorBlock("Bitwise AND Block #" + timestamp, "Bitwise AND Block", "&", x - 30, y - 30, 60, 60));
        break;
      case "arithmetic-add-block":
        b = this.addBlockUndoable(new ArithmeticBlock("Add Block #" + timestamp, "Add Block", "+", x - 30, y - 30, 60, 60));
        break;
      case "slider-block":
        b = this.addBlockUndoable(new Slider("Slider #" + timestamp, "Variable", x - 50, y - 30, 100, 60));
        break;
      case "item-selector-block":
        b = this.addBlockUndoable(new ItemSelector("Item Selector #" + timestamp, "Items", x - 40, y - 30, 80, 60));
        break;
      case "toggle-switch-block":
        b = this.addBlockUndoable(new ToggleSwitch("Switch #" + timestamp, "Boolean", x - 40, y - 30, 80, 60));
        break;
      case "momentary-switch-block":
        b = this.addBlockUndoable(new MomentarySwitch("Momentary Switch #" + timestamp, "Boolean", x - 30, y - 30, 60, 60));
        break;
      case "sticker-block":
        b = this.addBlockUndoable(new Sticker("Sticker #" + timestamp, "Text Display", x - 60, y - 60, 120, 120));
        break;
      case "beeper-block":
        b = this.addBlockUndoable(new Beeper("Beeper #" + timestamp, "Beeper", x - 50, y - 50, 100, 100));
        break;
      case "grapher-block":
        b = this.addBlockUndoable(new Grapher("Grapher #" + timestamp, "Graph", x - 100, y - 80, 200, 160));
        break;
      case "box-plot-block":
        b = this.addBlockUndoable(new BoxPlot("Box Plot #" + timestamp, "Box Plot", x - 100, y - 80, 200, 160));
        break;
      case "bubble-plot-block":
        b = this.addBlockUndoable(new BubblePlot("Bubble Plot #" + timestamp, "Bubble Plot", x - 100, y - 80, 200, 160));
        break;
      case "integral-block":
        b = this.addBlockUndoable(new IntegralBlock("Integral Block #" + timestamp, x - 50, y - 40, 100, 80));
        break;
      case "regression-block":
        b = this.addBlockUndoable(new RegressionBlock("Regression Block #" + timestamp, x - 50, y - 40, 100, 80));
        break;
      case "correlation-block":
        b = this.addBlockUndoable(new CorrelationBlock("Correlation Block #" + timestamp, x - 50, y - 40, 100, 80));
        break;
      case "clustering-block":
        b = this.addBlockUndoable(new ClusteringBlock("Clustering Block #" + timestamp, x - 50, y - 40, 100, 80));
        break;
      case "fft-block":
        b = this.addBlockUndoable(new FFTBlock("FFT Block #" + timestamp, x - 30, y - 40, 60, 80));
        break;
      case "ode-solver-block":
        b = this.addBlockUndoable(new ODESolverBlock("ODE Solver Block #" + timestamp, x - 100, y - 40, 200, 80));
        break;
      case "transient-state-fdm-solver-block":
        b = this.addBlockUndoable(new TransientStateFDMSolverBlock("Transient State FDM Solver Block #" + timestamp, x - 100, y - 80, 200, 160));
        break;
      case "steady-state-fdm-solver-block":
        b = this.addBlockUndoable(new SteadyStateFDMSolverBlock("Steady State FDM Solver Block #" + timestamp, x - 100, y - 100, 200, 200));
        break;
      case "boundary-condition-block":
        b = this.addBlockUndoable(new BoundaryConditionBlock("Boundary Condition Block #" + timestamp, x - 50, y - 50, 100, 100));
        break;
      case "histogram-block":
        b = this.addBlockUndoable(new Histogram("Histogram #" + timestamp, "Histogram", x - 100, y - 110, 200, 220));
        break;
      case "pie-chart-block":
        b = this.addBlockUndoable(new PieChart("Pie Chart #" + timestamp, "Pie Chart", x - 100, y - 110, 200, 220));
        break;
      case "heat-map-block":
        b = this.addBlockUndoable(new HeatMap("Heat Map #" + timestamp, "Heat Map", x - 100, y - 110, 200, 220));
        break;
      case "parallel-coordinates-plot-block":
        b = this.addBlockUndoable(new ParallelCoordinatesPlot("Parallel Coordinates Plot #" + timestamp, "Parallel Coordinates Plot", x - 100, y - 110, 200, 220));
        break;
      case "space2d-block":
        b = this.addBlockUndoable(new Space2D("Space2D #" + timestamp, "Space2D", x - 100, y - 110, 200, 220));
        break;
      case "space3d-block":
        let space3d = new Space3D(false, "Space3D #" + timestamp, "Space3D", x - 100, y - 110, 200, 220);
        this.addBlockUndoable(space3d);
        space3d.locateOverlay();
        break;
      case "field2d-block":
        b = this.addBlockUndoable(new Field2D("Field2D #" + timestamp, "Field", x - 100, y - 110, 200, 220));
        break;
      case "surface3d-block":
        let surface3d = new Surface3D(false, "Surface3D #" + timestamp, "Surface Plot", x - 100, y - 110, 200, 220);
        this.addBlockUndoable(surface3d);
        surface3d.locateOverlay();
        break;
      case "random-number-generator-block":
        b = this.addBlockUndoable(new RandomNumberGeneratorBlock("Random Number Generator Block #" + timestamp, x - 30, y - 40, 60, 80));
        break;
      case "array-adapter-block":
        this.addBlockUndoable(new ArrayAdapter("Array Adapter #" + timestamp, x - 50, y - 40, 100, 80));
        break;
      case "array-input-block":
        let arrayInput = new ArrayInput("Array Input #" + timestamp, false, "Array Input", x - 100, y - 100, 200, 200);
        this.addBlockUndoable(arrayInput);
        arrayInput.locateOverlay();
        break;
      case "string-input-block":
        let stringInput = new StringInput("String Input #" + timestamp, false, "String Input", x - 100, y - 100, 200, 200);
        this.addBlockUndoable(stringInput);
        stringInput.locateOverlay();
        break;
      case "mean-block":
        b = this.addBlockUndoable(new MeanBlock("Mean Block #" + timestamp, x - 30, y - 30, 60, 60));
        break;
      case "univariate-descriptive-statistics-block":
        b = this.addBlockUndoable(new UnivariateDescriptiveStatisticsBlock("Univariate Descriptive Statistics Block #" + timestamp, x - 50, y - 100, 100, 200));
        break;
      case "wordcloud-block":
        b = this.addBlockUndoable(new WordCloud("Wordcloud #" + timestamp, "Wordcloud", x - 100, y - 110, 300, 320));
        break;
    }
    return b;
  }

  setSelectedBlock(b: Block): void {
    this.selectedBlock = b;
  }

  getSelectedBlock(): Block {
    return this.selectedBlock;
  }

  setCopiedBlock(b: Block): void {
    this.copiedBlock = b;
  }

  paste(): void {
    this.pasteTo(this.contextMenuClickX, this.contextMenuClickY);
  }

  pasteTo(x: number, y: number): void {
    if (!this.copiedBlock) return;
    let block = this.copiedBlock.getCopy();
    block.setX(x);
    block.setY(y);
    block.updateModel();
    block.refreshView();
    flowchart.blocks.push(block);
    flowchart.storeBlockStates();
    block.setSelected(true);
    if (this.selectedBlock != null) {
      this.selectedBlock.setSelected(false);
    }
    this.selectedBlock = block;
    this.copiedBlock = block;
    this.requestDraw();
  }

  getSelectedPort(): Port {
    return this.selectedPort;
  }

  private removeBlock(block: Block): void {
    flowchart.blocks.splice(flowchart.blocks.indexOf(block), 1);
    block.refreshView();
    flowchart.storeBlockStates();
    this.requestDraw();
  }

  private addBlock(block: Block): void {
    flowchart.blocks.push(block);
    block.refreshView();
    flowchart.storeBlockStates();
    this.requestDraw();
  }

  private addBlockUndoable(block: Block): Block {
    this.addBlock(block);
    undoManager.add({
      undo: () => this.removeBlock(block),
      redo: () => this.addBlock(block)
    });
    return block;
  }

  requestDraw(): void {
    if (this.drawFunc == undefined) {
      this.drawFunc = () => this.draw();
    }
    requestAnimationFrame(this.drawFunc);
  }

  private draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.getBackgroundColor(); // we have to do this otherwise its screenshot will not have a color background
    ctx.beginPath();
    ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fill();
    this.drawGrid(ctx);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    for (let c of flowchart.connectors) {
      c.draw(ctx);
    }
    ctx.lineWidth = 2;
    for (let c of flowchart.connectors) {
      if (this.highlightedPortConnectors == null) {
        ctx.strokeStyle = c.getOutput().getValue() == undefined ? "lightgray" : "white";
      } else {
        ctx.strokeStyle = this.highlightedPortConnectors.indexOf(c) != -1 ? "yellow" : "white";
      }
      c.draw(ctx);
    }
    for (let b of flowchart.blocks) {
      b.draw(ctx);
    }
    if (this.selectedPort && !this.selectedPort.isInput()) {
      ctx.save();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "dimgray";
      ctx.setLineDash([5, 5]); // dashes and spaces
      this.connectorOntheFly.draw(ctx);
      ctx.restore();
    }
  }

  public drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    for (let i = 1; i <= this.canvas.height / this.gridSize; i++) {
      ctx.moveTo(0, i * this.gridSize);
      ctx.lineTo(this.canvas.width, i * this.gridSize);
    }
    for (let i = 1; i <= this.canvas.width / this.gridSize; i++) {
      ctx.moveTo(i * this.gridSize, 0);
      ctx.lineTo(i * this.gridSize, this.canvas.height);
    }
    ctx.stroke();
  }

  public getBackgroundColor(): string {
    return this.canvas.style.backgroundColor;
  }

  public setBackgroundColor(s: string): void {
    this.canvas.style.backgroundColor = s;
  }

  public getBlockStyle(): string {
    return this.blockStyle;
  }

  public setBlockStyle(blockStyle: string): void {
    this.blockStyle = blockStyle;
  }

  keyUp(e: KeyboardEvent): void {
    e.preventDefault();
    if (Util.isArrowKey(e)) {
      if (this.keyDownCount > 0) {
        this.processMoveByArrowKey(e);
        this.keyDownCount = 0;
      }
    }
    if (this.selectedBlock != null) {
      if ((this.selectedBlock instanceof Slider || this.selectedBlock instanceof ToggleSwitch)) {
        this.selectedBlock.keyUp(e);
      } else if (this.selectedBlock instanceof ItemSelector && this.selectedBlock.isDropdownMenuOpen()) {
        this.selectedBlock.keyUp(e);
      }
    }

    switch (e.key) { // single keys
      case "Enter":
        if (this.selectedBlock != null) {
          BlockUtilities.getMenu(this.selectedBlock).openPropertiesWindow(this.selectedBlock);
        }
        break;
      case "Delete":
      case "Backspace":
        if (this.selectedBlock != null) {
          flowchart.askToDeleteBlock(this.selectedBlock);
          this.selectedBlock = null;
        }
        break;
    }
    e.stopPropagation();
  }

  private keyDown(e: KeyboardEvent): void {
    e.preventDefault();
    if (this.selectedBlock != null) {
      if (Util.isArrowKey(e)) {
        if (this.keyDownCount == 0) {
          this.selectedMovablePreviousX = this.selectedBlock.getX();
          this.selectedMovablePreviousY = this.selectedBlock.getY();
        }
        this.keyDownCount++;
      }
      if (this.selectedBlock instanceof Slider && this.selectedBlock.isTrackSelected()) { // support keyevent for slider
        this.selectedBlock.keyDown(e);
      } else if (this.selectedBlock instanceof ItemSelector && this.selectedBlock.isDropdownMenuOpen()) { // support key event for item selector
        this.selectedBlock.keyDown(e);
      } else {
        if (Util.isArrowKey(e)) {
          this.moveByArrowKey(e);
        }
      }
    }

    switch (e.key) { // multiple keys
      case "c": // ctrl+C for copy
        if (this.selectedBlock != null) {
          if (e.ctrlKey || e.metaKey) {
            this.copiedBlock = this.selectedBlock;
          }
        }
        break;
      case "v": // ctrl+V for paste
        if (this.copiedBlock != null) {
          if (e.ctrlKey || e.metaKey) {
            this.pasteTo(this.copiedBlock.getX() + 20, this.copiedBlock.getY() + 20);
          }
        }
        break;
      case "z": // ctrl+Z for undo
        if (e.ctrlKey || e.metaKey) {
          if (undoManager.hasUndo()) {
            undoManager.undo();
          }
        }
        break;
      case "Z": // ctrl+shift+Z for redo
      case "y": // ctrl+Y for redo
        if (e.ctrlKey || e.metaKey) {
          if (undoManager.hasRedo()) {
            undoManager.redo();
          }
        }
        break;
      case "s": // ctrl+S for save
        if (e.ctrlKey || e.metaKey) {
          StateIO.saveAs(JSON.stringify(new State()));
        }
        break;
      case "o": // ctrl+O for open
        if (e.ctrlKey || e.metaKey) {
          StateIO.open();
        }
        break;
      case "n": // ctrl+N for new file (not working in Chrome as it cannot be overridden)
        if (e.ctrlKey || e.metaKey) {
          flowchart.askToClear();
        }
        break;
    }

    this.requestDraw();
    e.stopPropagation();
  }

  private processMoveByArrowKey(e: KeyboardEvent): void {
    if (this.selectedBlock == null) return;
    flowchart.storeBlockStates();
    let oldX = this.selectedMovablePreviousX;
    let oldY = this.selectedMovablePreviousY;
    let newX = this.selectedBlock.getX();
    let newY = this.selectedBlock.getY();
    undoManager.add({
      undo: () => {
        this.moveTo(oldX, oldY, this.selectedBlock);
        this.requestDraw();
      }, redo: () => {
        this.moveTo(newX, newY, this.selectedBlock);
        this.requestDraw();
      }
    });
  }

  private moveByArrowKey(e: KeyboardEvent) {
    const movement = e.shiftKey ? 1 : 5;
    switch (e.key) {
      case "ArrowUp":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(0, -movement);
          this.selectedBlock.refreshView();
        }
        break;
      case "ArrowDown":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(0, movement);
          this.selectedBlock.refreshView();
        }
        break;
      case "ArrowLeft":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(-movement, 0);
          this.selectedBlock.refreshView();
        }
        break;
      case "ArrowRight":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(movement, 0);
          this.selectedBlock.refreshView();
        }
        break;
    }
  }

  private touchStart(e: TouchEvent): void {
    //e.preventDefault();
    let touch = e.touches[0];
    this.canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: touch.clientX, clientY: touch.clientY}));
    this.longPressStartTime = Date.now();
  }

  private touchMove(e: TouchEvent): void {
    if (this.selectedBlock !== null) { // distable default scrolling when a block is selected
      e.preventDefault();
    }
    let touch = e.touches[0];
    this.canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: touch.clientX, clientY: touch.clientY}));
    this.longPressStartTime = Date.now();
  }

  private touchEnd(e: TouchEvent): void {
    if (this.selectedBlock !== null) { // distable default scrolling when a block is selected
      e.preventDefault();
    }
    let touch = e.changedTouches[0];
    if (Date.now() - this.longPressStartTime > BlockView.longPressTime) {
      this.canvas.dispatchEvent(new MouseEvent("contextmenu", {clientX: touch.clientX, clientY: touch.clientY}));
    } else {
      // for some reason, in Chrome on Android, touch.clientX and touch.clientY return 0 here.
      this.canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: touch.pageX, clientY: touch.pageY}));
    }
  }

  private mouseDown(e: MouseEvent): void {
    this.mouseUpExpected = true;
    this.selectedMovable = null;
    this.selectedResizeName = null;
    this.selectedPort = null;
    this.highlightedPortConnectors = null;
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.selectedBlock != null) {
      this.selectedBlock.setSelected(false);
      this.selectedBlock = null;
    }
    outerLoop1:
      for (let i = flowchart.blocks.length - 1; i >= 0; i--) {
        let block = flowchart.blocks[i];
        if (block.onDraggableArea(x, y)) {
          this.selectedBlock = block;
          this.selectedMovable = block;
          this.selectedMovablePreviousX = block.getX();
          this.selectedMovablePreviousY = block.getY();
          this.selectedBlock.setSelected(true);
          break;
        } else if (block.contains(x, y)) {
          this.selectedBlock = block;
          this.selectedBlock.setSelected(true);
          break;
        } else {
          for (let n of BlockView.resizeNames) {
            if (block.onResizeRect(n, x, y)) {
              this.selectedBlock = block;
              this.selectedBlock.setSelected(true);
              this.selectedResizeName = n;
              this.selectedBlockPreviousRect.setRect(block.getX(), block.getY(), block.getWidth(), block.getHeight());
              break outerLoop1;
            }
          }
        }
      }
    if (this.selectedMovable != null) {
      this.mouseDownRelativeX = x - this.selectedMovable.getX();
      this.mouseDownRelativeY = y - this.selectedMovable.getY();
    } else {
      outerLoop2:
        for (let n = flowchart.blocks.length - 1; n >= 0; n--) {
          let block = flowchart.blocks[n];
          for (let p of block.getPorts()) {
            if (p.near(x - block.getX(), y - block.getY())) {
              this.selectedPort = p;
              if (this.selectedPort.isInput()) {
                // if the selected port is an input, select one of its connectors
                this.selectedPortConnector = flowchart.getConnectorWithInput(this.selectedPort);
              } else {
                // if the selected port is an output, clicking on it starts a new connector
                let p = this.selectedPort.getAbsolutePoint();
                this.connectorOntheFly.x1 = p.x;
                this.connectorOntheFly.y1 = p.y;
              }
              break outerLoop2;
            }
          }
        }
    }
    let grab = false;
    for (let b of flowchart.blocks) {
      if (b instanceof ArrayInput || b instanceof StringInput) {
        b.mouseDown(e);
      } else {
        if (b.isSelected()) {
          if (b.mouseDown(e)) {
            grab = true;
            if (b.isSource()) {
              this.highlightedPortConnectors = flowchart.getConnectors(b.getPorts()[0]);
            }
            break;
          }
        }
      }
    }
    this.preventMainMouseEvent = grab;
    this.canvas.style.cursor = grab ? "grabbing" : "default";
    this.requestDraw();
  }

  private mouseUp(e: MouseEvent): void {
    this.mouseUpExpected = false;
    if (e.which === 3 || e.button === 2) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.selectedPort != null) {
      outerLoop1:
        for (let n = flowchart.blocks.length - 1; n >= 0; n--) {
          let block = flowchart.blocks[n];
          for (let p of block.getPorts()) {
            if (p !== this.selectedPort && p.getBlock() !== this.selectedPort.getBlock() && p.isInput() && p.near(x - block.getX(), y - block.getY())) {
              if (flowchart.addPortConnector(this.selectedPort, p, "Port Connector #" + Date.now().toString(16))) {
                sound.play();
                flowchart.traverse(this.selectedPort.getBlock());
                flowchart.storeConnectorStates();
              }
              break outerLoop1;
            }
          }
        }
    }
    outerLoop2:
      for (let n = flowchart.blocks.length - 1; n >= 0; n--) {
        let block = flowchart.blocks[n];
        for (let p of block.getPorts()) {
          if (p.near(x - block.getX(), y - block.getY())) {
            this.highlightedPortConnectors = flowchart.getConnectors(p);
            break outerLoop2;
          }
        }
      }
    if (this.selectedMovable != null) {
      this.mouseMoveToUndable(x, y, this.selectedMovable);
      this.selectedMovable = null;
    }
    if (this.selectedBlock != null && this.selectedBlockResized) {
      this.resizeSelectedBlockUndoable();
    }
    this.selectedPort = null;
    this.selectedResizeName = null;
    this.preventMainMouseEvent = false;
    for (let b of flowchart.blocks) {
      if (b.isSelected()) {
        b.mouseUp(e);
        if (b.isSource()) {
          this.highlightedPortConnectors = null;
        }
      }
    }
    this.requestDraw();
    closeAllContextMenus(); // close all context menus upon mouse left click
  }

  private mouseMove(e: MouseEvent): void {
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.selectedMovable == null) {
      if (this.mouseOverPort != null) { // clear the closeness flag for the previous mouse over port
        this.mouseOverPort.setClose(false);
        this.mouseOverPort = null;
      }
      outerloop: // find the current mouse over port
        for (let n = flowchart.blocks.length - 1; n >= 0; n--) {
          let block = flowchart.blocks[n];
          for (let p of block.getPorts()) {
            if (p.near(x - block.getX(), y - block.getY())) {
              this.mouseOverPort = p;
              break outerloop;
            }
          }
        }
    }

    if (!this.preventMainMouseEvent) {
      if (this.selectedMovable != null) {
        this.mouseMoveTo(x, y, this.selectedMovable);
        this.selectedMovableMoved = true;
      } else if (this.selectedPort != null) {
        if (this.selectedPort.isInput()) {
          if (this.selectedPortConnector) { // if the clicked port is an input and there is a connector to it
            let disconnectedBlock = this.selectedPort.getBlock();
            if (!this.selectedPort.near(x - disconnectedBlock.getX(), y - disconnectedBlock.getY())) { // if the mouse moves away from the port, detach the connector
              flowchart.removePortConnector(this.selectedPortConnector);
              this.selectedPort = this.selectedPortConnector.getOutput(); // switch the selected port to the output end of the selected connector
              let p = this.selectedPort.getAbsolutePoint(); // this activates the connector on the fly that originates from the output end
              this.connectorOntheFly.x1 = p.x;
              this.connectorOntheFly.y1 = p.y;
              this.connectorOntheFly.x2 = e.offsetX;
              this.connectorOntheFly.y2 = e.offsetY;
              this.selectedPortConnector.getInput().setValue(undefined);
              this.selectedPortConnector = null;
              flowchart.updateResultsForBlock(disconnectedBlock);
            }
          }
        } else {
          this.connectorOntheFly.x2 = e.offsetX;
          this.connectorOntheFly.y2 = e.offsetY;
          if (this.mouseOverPort != null) {
            this.mouseOverPort.setClose(true);
          }
        }
      } else {
        if (this.selectedMovable == null) {  // if not moving an object, set cursor for mouse over
          let cursorSet: boolean = false;
          for (let n = flowchart.blocks.length - 1; n >= 0; n--) {
            let block = flowchart.blocks[n];
            if (block.onResizeRect("lowerLeft", x, y)) {
              this.canvas.style.cursor = "sw-resize";
              cursorSet = true;
            } else if (block.onResizeRect("lowerRight", x, y)) {
              this.canvas.style.cursor = "se-resize";
              cursorSet = true;
            } else if (block.onResizeRect("upperLeft", x, y)) {
              this.canvas.style.cursor = "nw-resize";
              cursorSet = true;
            } else if (block.onResizeRect("upperRight", x, y)) {
              this.canvas.style.cursor = "ne-resize";
              cursorSet = true;
            } else if (block.onResizeRect("upperMid", x, y)) {
              this.canvas.style.cursor = "n-resize";
              cursorSet = true;
            } else if (block.onResizeRect("lowerMid", x, y)) {
              this.canvas.style.cursor = "s-resize";
              cursorSet = true;
            } else if (block.onResizeRect("leftMid", x, y)) {
              this.canvas.style.cursor = "w-resize";
              cursorSet = true;
            } else if (block.onResizeRect("rightMid", x, y)) {
              this.canvas.style.cursor = "e-resize";
              cursorSet = true;
            } else if (block.onDraggableArea(x, y)) {
              this.canvas.style.cursor = "move";
              cursorSet = true;
            }
            if (cursorSet) break;
          }
          if (!cursorSet) {
            if (this.mouseOverPort != null) {
              this.canvas.style.cursor = this.mouseOverPort.isInput() ? "default" : "grab";
            } else {
              this.canvas.style.cursor = this.selectedPort != null ? "grabbing" : "default";
            }
          }
          if (this.selectedBlock != null) {
            this.resizeSelectedBlock(x, y);
          }
        }
      }
    }

    for (let b of flowchart.blocks) {
      if (b instanceof ArrayInput || b instanceof StringInput) {
        b.mouseMove(e);
      } else {
        if (b.isSelected()) {
          if (b instanceof MomentarySwitch) { // special treatment for momentary switch
            if (b.isPressed() && !b.contains(x, y)) {
              b.setPressed(false);
              b.updateImmediately();
            }
          } else {
            if (b.contains(x, y)) {
              b.mouseMove(e);
            }
          }
        }
      }
    }
    this.requestDraw();
  }

  private mouseOut(e: MouseEvent): void {
    e.preventDefault();
    this.selectedMovable = null;
    this.clearResizeName();
    for (let b of flowchart.blocks) {
      if (b.isSelected()) {
        // if the mouse is out of this canvas, consider that an mouseup event would follow to terminate whatever
        // is going on with the selected block if it is not already fired. Without this, the mouseup event will
        // never be fired if the user drag the mouse and release it outsider the canvas.
        if (this.mouseUpExpected) {
          b.mouseUp(e);
        }
        b.mouseLeave(e);
      }
    }
  }

  openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    closeAllContextMenus(); // close any open context menu
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    this.contextMenuClickX = e.clientX - rect.left;
    this.contextMenuClickY = e.clientY - rect.top;
    let block = null;
    for (let i = flowchart.blocks.length - 1; i >= 0; i--) {
      if (flowchart.blocks[i].contains(this.contextMenuClickX, this.contextMenuClickY)) {
        block = flowchart.blocks[i];
        break;
      }
    }
    this.selectedBlock = block;
    let menu: HTMLMenuElement = BlockUtilities.getHtmlMenuElement(block);
    if (menu == null) {
      contextMenus.blockView.view = this;
      menu = document.getElementById("block-view-context-menu") as HTMLMenuElement;
      document.getElementById("block-view-context-menu-paste-menu-item").className = this.copiedBlock ? "menu-item" : "menu-item disabled";
      document.getElementById("block-view-context-menu-global-variables-menu-item").className = Util.isEmptyObject(flowchart.globalVariables) ? "menu-item disabled" : "menu-item";
    }
    if (menu != null) {
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
      this.selectedMovable = null;
    }
    if (this.selectedBlock != null) {
      this.requestDraw();
    }
  }

  private mouseMoveTo(x: number, y: number, m: Movable): void {
    let dx = x - this.mouseDownRelativeX;
    let dy = y - this.mouseDownRelativeY;
    let xmax = this.canvas.width - m.getWidth();
    if (dx < 0) {
      dx = 0;
    } else if (dx > xmax) {
      dx = xmax;
    }
    let ymax = this.canvas.height - m.getHeight();
    if (dy < 0) {
      dy = 0;
    } else if (dy > ymax) {
      dy = ymax;
    }
    m.setX(dx);
    m.setY(dy);
    m.refreshView();
    if (m instanceof Block) {
      flowchart.storeBlockStates();
    }
  }

  private mouseMoveToUndable(x: number, y: number, m: Movable): void {
    if (this.selectedMovableMoved) { // fire only when m is actually moved (don't fire for a mouse click without move)
      let oldX = this.selectedMovablePreviousX;
      let oldY = this.selectedMovablePreviousY;
      this.mouseMoveTo(x, y, m);
      let newX = m.getX();
      let newY = m.getY();
      undoManager.add({
        undo: () => {
          this.moveTo(oldX, oldY, m);
          this.requestDraw();
        }, redo: () => {
          this.moveTo(newX, newY, m);
          this.requestDraw();
        }
      });
      this.selectedMovableMoved = false;
    }
  }

  private moveTo(x: number, y: number, m: Movable): void {
    m.setX(x);
    m.setY(y);
    m.refreshView();
    if (m instanceof Block) {
      flowchart.storeBlockStates();
    }
  }

  private resizeSelectedBlockUndoable(): void {
    let block = this.selectedBlock;
    let oldRect = this.selectedBlockPreviousRect.clone();
    let newRect = new Rectangle(this.selectedBlock.getX(), this.selectedBlock.getY(), this.selectedBlock.getWidth(), this.selectedBlock.getHeight());
    undoManager.add({
      undo: () => {
        block.setRect(oldRect);
        block.refreshView();
        this.requestDraw();
        flowchart.storeBlockStates();
      }, redo: () => {
        block.setRect(newRect);
        block.refreshView();
        this.requestDraw();
        flowchart.storeBlockStates();
      }
    });
    this.selectedBlockResized = false;
  }

  clearResizeName(): void {
    this.selectedResizeName = undefined;
  }

  private resizeSelectedBlock(x: number, y: number): void {
    let dx, dy, w, h;
    let updateBlock = false;
    switch (this.selectedResizeName) {
      case "upperLeft":
        dx = x - this.selectedBlockPreviousRect.x;
        dy = y - this.selectedBlockPreviousRect.y;
        w = this.selectedBlockPreviousRect.width - dx;
        h = this.selectedBlockPreviousRect.height - dy;
        if (w > 20 && h > 20) {
          this.selectedBlock.setX(x);
          this.selectedBlock.setY(y);
          this.selectedBlock.setWidth(w);
          this.selectedBlock.setHeight(h);
          updateBlock = true;
        }
        break;
      case "upperRight":
        dx = x - (this.selectedBlockPreviousRect.x + this.selectedBlockPreviousRect.width);
        dy = y - this.selectedBlockPreviousRect.y;
        w = this.selectedBlockPreviousRect.width + dx;
        h = this.selectedBlockPreviousRect.height - dy;
        if (w > 20 && h > 20) {
          this.selectedBlock.setX(x - w);
          this.selectedBlock.setY(y);
          this.selectedBlock.setWidth(w);
          this.selectedBlock.setHeight(h);
          updateBlock = true;
        }
        break;
      case "lowerLeft":
        dx = x - this.selectedBlockPreviousRect.x;
        dy = y - (this.selectedBlockPreviousRect.y + this.selectedBlockPreviousRect.height);
        w = this.selectedBlockPreviousRect.width - dx;
        h = this.selectedBlockPreviousRect.height + dy;
        if (w > 20 && h > 20) {
          this.selectedBlock.setX(x);
          this.selectedBlock.setY(y - h);
          this.selectedBlock.setWidth(w);
          this.selectedBlock.setHeight(h);
          updateBlock = true;
        }
        break;
      case "lowerRight":
        dx = x - (this.selectedBlockPreviousRect.x + this.selectedBlockPreviousRect.width);
        dy = y - (this.selectedBlockPreviousRect.y + this.selectedBlockPreviousRect.height);
        w = this.selectedBlockPreviousRect.width + dx;
        h = this.selectedBlockPreviousRect.height + dy;
        if (w > 20 && h > 20) {
          this.selectedBlock.setX(x - w);
          this.selectedBlock.setY(y - h);
          this.selectedBlock.setWidth(w);
          this.selectedBlock.setHeight(h);
          updateBlock = true;
        }
        break;
      case "upperMid":
        dy = y - this.selectedBlockPreviousRect.y;
        h = this.selectedBlockPreviousRect.height - dy;
        if (h > 20) {
          this.selectedBlock.setY(y);
          this.selectedBlock.setHeight(h);
          updateBlock = true;
        }
        break;
      case "lowerMid":
        dy = y - (this.selectedBlockPreviousRect.y + this.selectedBlockPreviousRect.height);
        h = this.selectedBlockPreviousRect.height + dy;
        if (h > 20) {
          this.selectedBlock.setY(y - h);
          this.selectedBlock.setHeight(h);
          updateBlock = true;
        }
        break;
      case "leftMid":
        dx = x - this.selectedBlockPreviousRect.x;
        w = this.selectedBlockPreviousRect.width - dx;
        if (w > 20) {
          this.selectedBlock.setX(x);
          this.selectedBlock.setWidth(w);
          updateBlock = true;
        }
        break;
      case "rightMid":
        dx = x - (this.selectedBlockPreviousRect.x + this.selectedBlockPreviousRect.width);
        w = this.selectedBlockPreviousRect.width + dx;
        if (w > 20) {
          this.selectedBlock.setX(x - w);
          this.selectedBlock.setWidth(w);
          updateBlock = true;
        }
        break;
    }
    if (updateBlock) {
      this.selectedBlockResized = true;
      this.selectedBlock.refreshView();
      flowchart.storeBlockStates();
    }
  }

}
