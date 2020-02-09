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
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
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
import {WorkerBlock} from "./WorkerBlock";
import {ActionBlock} from "./ActionBlock";
import {GlobalVariableBlock} from "./GlobalVariableBlock";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {SwitchStatementBlock} from "./SwitchStatementBlock";
import {MultivariableFunctionBlock} from "./MultivariableFunctionBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {RgbaColorBlock} from "./RgbaColorBlock";
import {ComplexNumberBlock} from "./ComplexNumberBlock";
import {BundledFunctionsBlock} from "./BundledFunctionsBlock";

export class BlockView {

  readonly canvas: HTMLCanvasElement;

  private selectedMovable: Movable;
  private selectedResizeName: string;
  private selectedBlock: Block;
  private copiedBlock: Block;
  private selectedPort: Port;
  private selectedPortConnector: PortConnector;
  private highlightedPortConnectors: PortConnector[];
  private mouseUpExpected: boolean;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private originalRectangle: Rectangle;
  private draggedElementId: string;
  private connectorOntheFly: Connector;
  private gridSize: number = 100;
  private blockStyle: string = "Shade";
  private mouseOverPort: Port;
  private contextMenuClickX: number;
  private contextMenuClickY: number;
  private preventMainMouseEvent: boolean = false; // when a block is handling its own mouse events such as dragging a knob, set this flag true
  private touchStartTime: number;
  private static readonly longPressTime: number = 2000;
  private static readonly resizeNames: string[] = ["upperLeft", "upperRight", "lowerLeft", "lowerRight", "upperMid", "lowerMid", "leftMid", "rightMid"];
  private static readonly dashedLine = [5, 5];
  private static readonly solidLine = [];
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

    this.originalRectangle = new Rectangle(0, 0, 1, 1);
    this.connectorOntheFly = new Connector();

    let playground = document.getElementById("block-playground") as HTMLDivElement;

    // drag and drop support
    let that = this;
    playground.addEventListener("dragstart", function (e) {
      that.draggedElementId = (<HTMLElement>e.target).id;
    });

    // prevent default to allow drop
    playground.addEventListener("dragover", function (e) {
      e.preventDefault();
    }, false);

    playground.addEventListener("drop", function (e) {
      e.preventDefault();
      let id = (<HTMLElement>e.target).id;
      if (id === "block-view") {
        let x = e.offsetX;
        let y = e.offsetY;
        let timestamp = Date.now().toString(16);
        switch (that.draggedElementId) {
          case "unary-function-block":
            that.addBlockUndoable(new UnaryFunctionBlock("Unary Function Block #" + timestamp, x - 30, y - 40, 60, 80));
            break;
          case "binary-function-block":
            that.addBlockUndoable(new BinaryFunctionBlock("Binary Function Block #" + timestamp, x - 30, y - 50, 60, 100));
            break;
          case "multivariable-function-block":
            that.addBlockUndoable(new MultivariableFunctionBlock("Multivariable Function Block #" + timestamp, x - 30, y - 60, 60, 120));
            break;
          case "parametric-equation-block":
            that.addBlockUndoable(new ParametricEquationBlock("Parametric Equation Block #" + timestamp, x - 40, y - 50, 80, 100));
            break;
          case "bundled-functions-block":
            that.addBlockUndoable(new BundledFunctionsBlock("Bundled Functions Block #" + timestamp, x - 40, y - 50, 80, 100));
            break;
          case "global-variable-block":
            that.addBlockUndoable(new GlobalVariableBlock("Global Variable Block #" + timestamp, "Global Variable Block", "var", x - 30, y - 40, 60, 80));
            break;
          case "global-object-block":
            that.addBlockUndoable(new GlobalObjectBlock("Global Object Block #" + timestamp, "Global Object Block", "obj", x - 30, y - 60, 60, 120));
            break;
          case "series-block":
            that.addBlockUndoable(new SeriesBlock("Series Block #" + timestamp, x - 30, y - 40, 60, 80, "Series Block", "Series"));
            break;
          case "rgba-color-block":
            that.addBlockUndoable(new RgbaColorBlock("Rgba Color Block #" + timestamp, x - 30, y - 40, 60, 80, "Rgba Color Block", "RGBA"));
            break;
          case "complex-number-block":
            that.addBlockUndoable(new ComplexNumberBlock("Complex Number Block #" + timestamp, x - 30, y - 40, 60, 80, "Complex Number Block", "a+b*i"));
            break;
          case "worker-block":
            that.addBlockUndoable(new WorkerBlock("Worker Block #" + timestamp, "Worker", x - 40, y - 30, 80, 60));
            break;
          case "action-block":
            that.addBlockUndoable(new ActionBlock("Action Block #" + timestamp, "Action", x - 40, y - 30, 80, 60));
            break;
          case "turnout-switch-block":
            that.addBlockUndoable(new TurnoutSwitch("Turnout Switch #" + timestamp, "Turnout Switch", "Turnout", x - 30, y - 50, 60, 100));
            break;
          case "switch-statement-block":
            that.addBlockUndoable(new SwitchStatementBlock("Switch Statement Block #" + timestamp, "Switch Statement Block", "Switch", x - 30, y - 50, 60, 100));
            break;
          case "logic-and-block":
            that.addBlockUndoable(new LogicBlock("AND Block #" + timestamp, x - 30, y - 40, 60, 80, "AND Block", "AND"));
            break;
          case "logic-not-block":
            that.addBlockUndoable(new NegationBlock("NOT Block #" + timestamp, x - 30, y - 40, 60, 80));
            break;
          case "arithmetic-add-block":
            that.addBlockUndoable(new ArithmeticBlock("Add Block #" + timestamp, x - 30, y - 30, 60, 60, "Add Block", "+"));
            break;
          case "slider-block":
            that.addBlockUndoable(new Slider("Slider #" + timestamp, "Variable", x - 50, y - 30, 100, 60));
            break;
          case "item-selector-block":
            that.addBlockUndoable(new ItemSelector("Item Selector #" + timestamp, "Items", x - 40, y - 30, 80, 60));
            break;
          case "toggle-switch-block":
            that.addBlockUndoable(new ToggleSwitch("Switch #" + timestamp, "Boolean", x - 40, y - 30, 80, 60));
            break;
          case "momentary-switch-block":
            that.addBlockUndoable(new MomentarySwitch("Momentary Switch #" + timestamp, "Boolean", x - 30, y - 30, 60, 60));
            break;
          case "sticker-block":
            that.addBlockUndoable(new Sticker("Sticker #" + timestamp, "Text Display", x - 60, y - 60, 120, 120));
            break;
          case "beeper-block":
            that.addBlockUndoable(new Beeper("Beeper #" + timestamp, "Beeper", x - 50, y - 50, 100, 100));
            break;
          case "grapher-block":
            that.addBlockUndoable(new Grapher("Grapher #" + timestamp, "Graph", x - 100, y - 80, 200, 160));
            break;
          case "space2d-block":
            that.addBlockUndoable(new Space2D("Space2D #" + timestamp, "Space2D", x - 100, y - 110, 200, 220));
            break;
        }
        that.canvas.focus();
      }
    }, false);
  }

  setCopiedBlock(copiedBlock: Block): void {
    this.copiedBlock = copiedBlock;
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

  private addBlockUndoable(block: Block): void {
    this.addBlock(block);
    let that = this;
    undoManager.add({
      undo: function () {
        that.removeBlock(block);
      }, redo: function () {
        that.addBlock(block);
      }
    });
  }

  requestDraw(): void {
    if (this.drawFunc == undefined) {
      let that = this;
      this.drawFunc = function () {
        that.draw();
      }
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

  // detect if (x, y) is inside this view
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
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

  public getX(): number {
    return 10;
  }

  public getY(): number {
    return 10;
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  private keyUp(e: KeyboardEvent): void {
    e.preventDefault();
    if (this.selectedBlock != null) {
      if ((this.selectedBlock instanceof Slider || this.selectedBlock instanceof ToggleSwitch)) {
        this.selectedBlock.keyUp(e);
      } else if (this.selectedBlock instanceof ItemSelector && this.selectedBlock.isDropdownMenuOpen()) {
        this.selectedBlock.keyUp(e);
      }
    }
    switch (e.key) {
      case "Delete":
        if (this.selectedBlock != null) {
          flowchart.askToDeleteBlock(this.selectedBlock);
        }
        break;
      case "c":
        if (e.ctrlKey || e.metaKey) {
          this.copiedBlock = this.selectedBlock;
        }
        break;
      case "v":
        if (e.ctrlKey || e.metaKey) {
          if (this.copiedBlock != null) {
            this.pasteTo(this.copiedBlock.getX() + 20, this.copiedBlock.getY() + 20);
          }
        }
        break;
      case "z":
        if (e.ctrlKey || e.metaKey) {
          if (undoManager.hasUndo()) {
            undoManager.undo();
          }
        }
        break;
      case "y":
        if (e.ctrlKey || e.metaKey) {
          if (undoManager.hasRedo()) {
            undoManager.redo();
          }
        }
        break;
    }
    e.stopPropagation();
  }

  private keyDown(e: KeyboardEvent): void {
    if (this.selectedBlock != null) {
      e.preventDefault();
      if ((this.selectedBlock instanceof Slider || this.selectedBlock instanceof ToggleSwitch)) {
        this.selectedBlock.keyDown(e);
      } else if (this.selectedBlock instanceof ItemSelector && this.selectedBlock.isDropdownMenuOpen()) {
        this.selectedBlock.keyDown(e);
      } else {
        this.moveByArrowKey(e.key, false);
      }
      this.requestDraw();
      e.stopPropagation();
    }
  }

  private moveByArrowKey(key: string, storeState: boolean) {
    switch (key) {
      case "ArrowUp":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(0, -5);
          this.selectedBlock.refreshView();
          if (storeState) flowchart.storeBlockStates();
        }
        break;
      case "ArrowDown":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(0, 5);
          this.selectedBlock.refreshView();
          if (storeState) flowchart.storeBlockStates();
        }
        break;
      case "ArrowLeft":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(-5, 0);
          this.selectedBlock.refreshView();
          if (storeState) flowchart.storeBlockStates();
        }
        break;
      case "ArrowRight":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(5, 0);
          this.selectedBlock.refreshView();
          if (storeState) flowchart.storeBlockStates();
        }
        break;
    }
  }

  private touchStart(e: TouchEvent): void {
    e.preventDefault();
    let touch = e.touches[0];
    this.canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: touch.clientX, clientY: touch.clientY}));
    this.touchStartTime = Date.now();
  }

  private touchMove(e: TouchEvent): void {
    e.preventDefault();
    let touch = e.touches[0];
    this.canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: touch.clientX, clientY: touch.clientY}));
  }

  private touchEnd(e: TouchEvent): void {
    e.preventDefault();
    let touch = e.changedTouches[0];
    if (Date.now() - this.touchStartTime > BlockView.longPressTime) {
      this.canvas.dispatchEvent(new MouseEvent("contextmenu", {clientX: touch.clientX, clientY: touch.clientY}));
    } else {
      this.canvas.dispatchEvent(new MouseEvent("mouseup", {}));
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
              this.originalRectangle.setRect(block.getX(), block.getY(), block.getWidth(), block.getHeight());
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
    this.selectedMovable = null;
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
        this.moveTo(x, y, this.selectedMovable);
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
            let dx, dy, w, h;
            let updateBlock = false;
            switch (this.selectedResizeName) {
              case "upperLeft":
                dx = x - this.originalRectangle.x;
                dy = y - this.originalRectangle.y;
                w = this.originalRectangle.width - dx;
                h = this.originalRectangle.height - dy;
                if (w > 20 && h > 20) {
                  this.selectedBlock.setX(x);
                  this.selectedBlock.setY(y);
                  this.selectedBlock.setWidth(w);
                  this.selectedBlock.setHeight(h);
                  updateBlock = true;
                }
                break;
              case "upperRight":
                dx = x - (this.originalRectangle.x + this.originalRectangle.width);
                dy = y - this.originalRectangle.y;
                w = this.originalRectangle.width + dx;
                h = this.originalRectangle.height - dy;
                if (w > 20 && h > 20) {
                  this.selectedBlock.setX(x - w);
                  this.selectedBlock.setY(y);
                  this.selectedBlock.setWidth(w);
                  this.selectedBlock.setHeight(h);
                  updateBlock = true;
                }
                break;
              case "lowerLeft":
                dx = x - this.originalRectangle.x;
                dy = y - (this.originalRectangle.y + this.originalRectangle.height);
                w = this.originalRectangle.width - dx;
                h = this.originalRectangle.height + dy;
                if (w > 20 && h > 20) {
                  this.selectedBlock.setX(x);
                  this.selectedBlock.setY(y - h);
                  this.selectedBlock.setWidth(w);
                  this.selectedBlock.setHeight(h);
                  updateBlock = true;
                }
                break;
              case "lowerRight":
                dx = x - (this.originalRectangle.x + this.originalRectangle.width);
                dy = y - (this.originalRectangle.y + this.originalRectangle.height);
                w = this.originalRectangle.width + dx;
                h = this.originalRectangle.height + dy;
                if (w > 20 && h > 20) {
                  this.selectedBlock.setX(x - w);
                  this.selectedBlock.setY(y - h);
                  this.selectedBlock.setWidth(w);
                  this.selectedBlock.setHeight(h);
                  updateBlock = true;
                }
                break;
              case "upperMid":
                dy = y - this.originalRectangle.y;
                h = this.originalRectangle.height - dy;
                if (h > 20) {
                  this.selectedBlock.setY(y);
                  this.selectedBlock.setHeight(h);
                  updateBlock = true;
                }
                break;
              case "lowerMid":
                dy = y - (this.originalRectangle.y + this.originalRectangle.height);
                h = this.originalRectangle.height + dy;
                if (h > 20) {
                  this.selectedBlock.setY(y - h);
                  this.selectedBlock.setHeight(h);
                  updateBlock = true;
                }
                break;
              case "leftMid":
                dx = x - this.originalRectangle.x;
                w = this.originalRectangle.width - dx;
                if (w > 20) {
                  this.selectedBlock.setX(x);
                  this.selectedBlock.setWidth(w);
                  updateBlock = true;
                }
                break;
              case "rightMid":
                dx = x - (this.originalRectangle.x + this.originalRectangle.width);
                w = this.originalRectangle.width + dx;
                if (w > 20) {
                  this.selectedBlock.setX(x - w);
                  this.selectedBlock.setWidth(w);
                  updateBlock = true;
                }
                break;
            }
            if (updateBlock) {
              this.selectedBlock.refreshView();
              flowchart.storeBlockStates();
            }
          }
        }
      }
    }

    for (let b of flowchart.blocks) {
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
    this.requestDraw();
  }

  private mouseOut(e: MouseEvent): void {
    e.preventDefault();
    this.selectedMovable = null;
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

  private openContextMenu(e: MouseEvent): void {
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
    let menu: HTMLMenuElement = null;
    if (block instanceof ArithmeticBlock) {
      contextMenus.arithmeticBlock.block = block;
      menu = document.getElementById("arithmetic-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof WorkerBlock) {
      contextMenus.workerBlock.block = block;
      menu = document.getElementById("worker-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof ActionBlock) {
      contextMenus.actionBlock.block = block;
      menu = document.getElementById("action-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof TurnoutSwitch) {
      contextMenus.turnoutSwitch.block = block;
      menu = document.getElementById("turnout-switch-context-menu") as HTMLMenuElement;
    } else if (block instanceof SwitchStatementBlock) {
      contextMenus.switchStatementBlock.block = block;
      menu = document.getElementById("switch-statement-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof NegationBlock) {
      contextMenus.notBlock.block = block;
      menu = document.getElementById("not-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof LogicBlock) {
      contextMenus.logicBlock.block = block;
      menu = document.getElementById("logic-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof UnaryFunctionBlock) {
      contextMenus.unaryFunctionBlock.block = block;
      menu = document.getElementById("unary-function-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof BinaryFunctionBlock) {
      contextMenus.binaryFunctionBlock.block = block;
      menu = document.getElementById("binary-function-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof MultivariableFunctionBlock) {
      contextMenus.multivariableFunctionBlock.block = block;
      menu = document.getElementById("multivariable-function-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof ParametricEquationBlock) {
      contextMenus.parametricEquationBlock.block = block;
      menu = document.getElementById("parametric-equation-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof BundledFunctionsBlock) {
      contextMenus.bundledFunctionsBlock.block = block;
      menu = document.getElementById("bundled-functions-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof Slider) {
      contextMenus.slider.block = block;
      menu = document.getElementById("slider-context-menu") as HTMLMenuElement;
    } else if (block instanceof ItemSelector) {
      contextMenus.itemSelector.block = block;
      menu = document.getElementById("item-selector-context-menu") as HTMLMenuElement;
    } else if (block instanceof ToggleSwitch) {
      contextMenus.toggleSwitch.block = block;
      menu = document.getElementById("toggle-switch-context-menu") as HTMLMenuElement;
    } else if (block instanceof MomentarySwitch) {
      contextMenus.momentarySwitch.block = block;
      menu = document.getElementById("momentary-switch-context-menu") as HTMLMenuElement;
    } else if (block instanceof Sticker) {
      contextMenus.sticker.block = block;
      menu = document.getElementById("sticker-context-menu") as HTMLMenuElement;
    } else if (block instanceof Beeper) {
      contextMenus.beeper.block = block;
      menu = document.getElementById("beeper-context-menu") as HTMLMenuElement;
    } else if (block instanceof Grapher) {
      contextMenus.grapher.block = block;
      menu = document.getElementById("grapher-context-menu") as HTMLMenuElement;
    } else if (block instanceof Space2D) {
      contextMenus.space2d.block = block;
      menu = document.getElementById("space2d-context-menu") as HTMLMenuElement;
    } else if (block instanceof GlobalVariableBlock) {
      contextMenus.globalVariableBlock.block = block;
      menu = document.getElementById("global-variable-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof GlobalObjectBlock) {
      contextMenus.globalObjectBlock.block = block;
      menu = document.getElementById("global-object-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof SeriesBlock) {
      contextMenus.seriesBlock.block = block;
      menu = document.getElementById("series-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof RgbaColorBlock) {
      contextMenus.rgbaColorBlock.block = block;
      menu = document.getElementById("rgba-color-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof ComplexNumberBlock) {
      contextMenus.complexNumberBlock.block = block;
      menu = document.getElementById("complex-number-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof RainbowHatBlock) {
      contextMenus.rainbowHatBlock.block = block;
      menu = document.getElementById("rainbow-hat-block-context-menu") as HTMLMenuElement;
    } else {
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

  private moveTo(x: number, y: number, m: Movable): void {
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

}
