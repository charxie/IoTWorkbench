/*
 * @author Charles Xie
 */

import {Flowchart} from "./Flowchart";
import {closeAllContextMenus, contextMenus, flowchart, sound} from "../Main";
import {Movable} from "../Movable";
import {Block} from "./Block";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";
import {NegationBlock} from "./NegationBlock";
import {LogicBlock} from "./LogicBlock";
import {ArithmeticBlock} from "./ArithmeticBlock";
import {HatBlock} from "./HatBlock";
import {Port} from "./Port";
import {Connector} from "./Connector";
import {PortConnector} from "./PortConnector";
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
import {XYGraph} from "./XYGraph";
import {WorkerBlock} from "./WorkerBlock";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class BlockView {

  readonly canvas: HTMLCanvasElement;

  flowchart: Flowchart;
  private selectedMovable: Movable;
  private selectedBlock: Block;
  private selectedPort: Port;
  private selectedPortConnector: PortConnector;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;
  private connectorOntheFly: Connector;
  private gridSize: number = 100;
  private overWhat: any;
  private contextMenuClickX: number;
  private contextMenuClickY: number;
  private preventMainMouseEvent: boolean = false; // when a block is handling its own mouse events, set this flag true
  private touchStartTime: number;
  private static readonly longPressTime: number = 2000;

  static State = class {

    readonly backgroundColor: string;

    constructor(view: BlockView) {
      this.backgroundColor = view.getBackgroundColor();
    }

  };

  constructor(canvasId: string, flowchart: Flowchart) {
    this.flowchart = flowchart;
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
    document.addEventListener("mouseleave", this.mouseLeave.bind(this), false);

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
      if (id == "block-view") {
        let x = e.offsetX;
        let y = e.offsetY;
        let timestamp = Date.now().toString(16);
        switch (that.draggedElementId) {
          case "unary-function-block":
            that.storeBlock(new UnaryFunctionBlock("Unary Function Block #" + timestamp, x - 30, y - 40, 60, 80));
            break;
          case "binary-function-block":
            that.storeBlock(new BinaryFunctionBlock("Binary Function Block #" + timestamp, x - 30, y - 50, 60, 100));
            break;
          case "parametric-equation-block":
            that.storeBlock(new ParametricEquationBlock("Parametric Equation Block #" + timestamp, x - 40, y - 50, 80, 100));
            break;
          case "global-variable-block":
            that.storeBlock(new GlobalVariableBlock("Global Variable Block #" + timestamp, "Global Variable Block", "var", x - 30, y - 40, 60, 80));
            break;
          case "series-block":
            that.storeBlock(new SeriesBlock("Series Block #" + timestamp, x - 30, y - 40, 60, 80, "Series Block", "Series"));
            break;
          case "worker-block":
            that.storeBlock(new WorkerBlock("Worker Block #" + timestamp, "Worker", x - 40, y - 30, 80, 60));
            break;
          case "turnout-switch-block":
            that.storeBlock(new TurnoutSwitch("Turnout Switch #" + timestamp, x - 30, y - 50, 60, 100, "Turnout Switch", "Turnout"));
            break;
          case "logic-and-block":
            that.storeBlock(new LogicBlock("AND Block #" + timestamp, x - 30, y - 40, 60, 80, "AND Block", "AND"));
            break;
          case "logic-not-block":
            that.storeBlock(new NegationBlock("NOT Block #" + timestamp, x - 30, y - 40, 60, 80));
            break;
          case "arithmetic-add-block":
            that.storeBlock(new ArithmeticBlock("Add Block #" + timestamp, x - 30, y - 30, 60, 60, "Add Block", "+"));
            break;
          case "slider-block":
            that.storeBlock(new Slider("Slider #" + timestamp, "Variable", x - 50, y - 30, 100, 60));
            break;
          case "item-selector-block":
            that.storeBlock(new ItemSelector("Item Selector #" + timestamp, "Items", x - 40, y - 30, 80, 60));
            break;
          case "toggle-switch-block":
            that.storeBlock(new ToggleSwitch("Switch #" + timestamp, "Boolean", x - 40, y - 30, 80, 60));
            break;
          case "momentary-switch-block":
            that.storeBlock(new MomentarySwitch("Momentary Switch #" + timestamp, "Boolean", x - 30, y - 30, 60, 60));
            break;
          case "sticker-block":
            that.storeBlock(new Sticker("Sticker #" + timestamp, "Text Display", x - 60, y - 60, 120, 120));
            break;
          case "beeper-block":
            that.storeBlock(new Beeper("Beeper #" + timestamp, "Beeper", x - 50, y - 50, 100, 100));
            break;
          case "grapher-block":
            that.storeBlock(new Grapher("Grapher #" + timestamp, "Graph", x - 100, y - 80, 200, 160));
            break;
          case "xygraph-block":
            that.storeBlock(new XYGraph("X-Y Graph #" + timestamp, "X-Y Graph", x - 100, y - 110, 200, 220));
            break;
        }
      }
    }, false);
  }

  paste(): void {
    if (!flowchart.copiedBlock) return;
    let block = flowchart.copiedBlock.getCopy();
    block.setX(this.contextMenuClickX);
    block.setY(this.contextMenuClickY);
    block.updateModel();
    block.refreshView();
    flowchart.blocks.push(block);
    this.draw();
    flowchart.storeBlockStates();
  }

  private storeBlock(block: Block): void {
    this.flowchart.blocks.push(block);
    block.refreshView();
    this.draw();
    this.flowchart.storeBlockStates();
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.getBackgroundColor(); // we have to do this otherwise its screenshot will not have a color background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid(ctx);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    for (let c of this.flowchart.connectors) {
      c.draw(ctx);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    for (let c of this.flowchart.connectors) {
      c.draw(ctx);
    }
    for (let b of this.flowchart.blocks) {
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
    switch (e.key) {
      case "Delete":
        if (this.selectedBlock != null) {
          flowchart.askToDeleteBlock(this.selectedBlock);
        }
        break;
    }
    this.moveByArrowKey(e.key, true);
    e.stopPropagation();
  }

  private keyDown(e: KeyboardEvent): void {
    e.preventDefault();
    this.moveByArrowKey(e.key, false);
    e.stopPropagation();
  }

  private moveByArrowKey(key: string, storeState: boolean) {
    switch (key) {
      case "ArrowUp":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(0, -5);
          this.selectedBlock.refreshView();
          this.draw();
          if (storeState) this.flowchart.storeBlockStates();
        }
        break;
      case "ArrowDown":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(0, 5);
          this.selectedBlock.refreshView();
          this.draw();
          if (storeState) this.flowchart.storeBlockStates();
        }
        break;
      case "ArrowLeft":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(-5, 0);
          this.selectedBlock.refreshView();
          this.draw();
          if (storeState) this.flowchart.storeBlockStates();
        }
        break;
      case "ArrowRight":
        if (this.selectedBlock != null) {
          this.selectedBlock.translateBy(5, 0);
          this.selectedBlock.refreshView();
          this.draw();
          if (storeState) this.flowchart.storeBlockStates();
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
    this.selectedMovable = null;
    this.selectedPort = null;
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.selectedBlock != null) {
      this.selectedBlock.setSelected(false);
    }
    for (let i = this.flowchart.blocks.length - 1; i >= 0; i--) {
      if (this.flowchart.blocks[i].onDraggableArea(x, y)) {
        this.selectedBlock = this.flowchart.blocks[i];
        this.selectedMovable = this.selectedBlock;
        this.selectedBlock.setSelected(true);
        break;
      } else if (this.flowchart.blocks[i].contains(x, y)) {
        this.selectedBlock = this.flowchart.blocks[i];
        this.selectedBlock.setSelected(true);
        break;
      }
    }
    if (this.selectedMovable != null) {
      this.mouseDownRelativeX = x - this.selectedMovable.getX();
      this.mouseDownRelativeY = y - this.selectedMovable.getY();
    } else {
      outerloop:
        for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
          let block = this.flowchart.blocks[n];
          for (let p of block.getPorts()) {
            if (p.near(x - block.getX(), y - block.getY())) {
              this.selectedPort = p;
              if (this.selectedPort.isInput()) {
                // if the selected port is an input, select one of its connectors
                this.selectedPortConnector = this.flowchart.getConnectorWithInput(this.selectedPort);
              } else {
                // if the selected port is an output, clicking on it starts a new connector
                let p = this.selectedPort.getAbsolutePoint();
                this.connectorOntheFly.x1 = p.x;
                this.connectorOntheFly.y1 = p.y;
              }
              break outerloop;
            }
          }
        }
    }
    let grab = false;
    for (let b of this.flowchart.blocks) {
      // since item selectors have a pull down menu that is larger, we will always invoke their mouse handlers
      if (b instanceof ItemSelector || b.contains(x, y)) {
        if (b.mouseDown(e)) {
          grab = true;
          break;
        }
      }
    }
    this.preventMainMouseEvent = grab;
    this.canvas.style.cursor = grab ? "grabbing" : "default";
    this.draw();
  }

  private mouseUp(e: MouseEvent): void {
    if (e.which == 3 || e.button == 2) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.selectedPort != null) {
      outerloop:
        for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
          let block = this.flowchart.blocks[n];
          for (let p of block.getPorts()) {
            if (p.isInput() && p.near(x - block.getX(), y - block.getY())) {
              if (this.flowchart.addPortConnector(this.selectedPort, p, "Port Connector #" + Date.now().toString(16))) {
                sound.play();
                this.flowchart.traverse(this.selectedPort.getBlock());
                this.flowchart.storeConnectorStates();
              }
              break outerloop;
            }
          }
        }
    }
    this.selectedMovable = null;
    this.selectedPort = null;
    this.preventMainMouseEvent = false;
    for (let b of this.flowchart.blocks) {
      // since item selectors have a pull down menu that is larger, we will always invoke their mouse handlers
      // for sliders and switches, users may drag the knob outside them, so we should always involve their mouse handlers
      if (b instanceof ItemSelector || b instanceof Slider || b instanceof ToggleSwitch || b.contains(x, y)) {
        b.mouseUp(e);
      }
    }
    this.draw();
    closeAllContextMenus(); // close all context menus upon mouse left click
  }

  private mouseMove(e: MouseEvent): void {
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (!this.preventMainMouseEvent) {
      if (this.overWhat != null) {
        if (this.overWhat instanceof Port) {
          this.overWhat.setClose(false);
        }
        this.overWhat = null;
      }
      outerloop:
        for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
          let block = this.flowchart.blocks[n];
          if (block.onDraggableArea(x, y)) {
            this.overWhat = block;
            break;
          } else {
            for (let p of block.getPorts()) {
              if (p.near(x - block.getX(), y - block.getY())) {
                this.overWhat = p;
                break outerloop;
              }
            }
          }
        }

      if (this.selectedMovable != null) {
        this.moveTo(x, y, this.selectedMovable);
      } else if (this.selectedPort != null) {
        if (this.selectedPort.isInput()) {
          if (this.selectedPortConnector) { // if the clicked port is an input and there is a connector to it
            this.flowchart.removePortConnector(this.selectedPortConnector);
            this.selectedPort = this.selectedPortConnector.getOutput(); // switch the selected port to the output end of the selected connector
            let p = this.selectedPort.getAbsolutePoint(); // this activates the connector on the fly that originates from the output end
            this.connectorOntheFly.x1 = p.x;
            this.connectorOntheFly.y1 = p.y;
            this.connectorOntheFly.x2 = e.offsetX;
            this.connectorOntheFly.y2 = e.offsetY;
            this.selectedPortConnector.getInput().setValue(undefined);
            this.selectedPortConnector = null;
            this.flowchart.updateResults();
          }
        } else {
          this.connectorOntheFly.x2 = e.offsetX;
          this.connectorOntheFly.y2 = e.offsetY;
          if (this.overWhat instanceof Port) {
            this.overWhat.setClose(true);
          }
        }
      }
      if (this.overWhat instanceof Port) {
        this.canvas.style.cursor = this.overWhat.isInput() ? "default" : "grab";
      } else if (this.overWhat instanceof Block) {
        this.canvas.style.cursor = "move";
      } else {
        this.canvas.style.cursor = this.selectedPort != null ? "grabbing" : "default";
      }
    }
    for (let b of this.flowchart.blocks) {
      if (b instanceof MomentarySwitch) { // special treatment for momentary switch
        if (b.isPressed() && !b.contains(x, y)) {
          b.setPressed(false);
          b.updateImmediately();
        }
      } else {
        // since item selectors have a pull down menu that is larger, we will always invoke their mouse handlers
        if (b instanceof ItemSelector || b.contains(x, y)) {
          b.mouseMove(e);
        }
      }
    }
    this.draw();
  }

  private mouseLeave = (e: MouseEvent): void => {
    e.preventDefault();
    this.selectedMovable = null;
    for (let b of this.flowchart.blocks) {
      b.mouseLeave(e);
    }
  };

  private openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    closeAllContextMenus(); // close any open context menu
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = this.canvas.getBoundingClientRect();
    this.contextMenuClickX = e.clientX - rect.left;
    this.contextMenuClickY = e.clientY - rect.top;
    let block = null;
    for (let i = this.flowchart.blocks.length - 1; i >= 0; i--) {
      if (this.flowchart.blocks[i].contains(this.contextMenuClickX, this.contextMenuClickY)) {
        block = this.flowchart.blocks[i];
        break;
      }
    }
    this.selectedBlock = block;
    let menu: HTMLMenuElement = null;
    if (block instanceof ArithmeticBlock) {
      contextMenus.arithmeticBlock.block = block;
      menu = document.getElementById("arithmetic-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof SeriesBlock) {
      contextMenus.seriesBlock.block = block;
      menu = document.getElementById("series-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof WorkerBlock) {
      contextMenus.workerBlock.block = block;
      menu = document.getElementById("worker-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof TurnoutSwitch) {
      contextMenus.turnoutSwitch.block = block;
      menu = document.getElementById("turnout-switch-context-menu") as HTMLMenuElement;
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
    } else if (block instanceof ParametricEquationBlock) {
      contextMenus.parametricEquationBlock.block = block;
      menu = document.getElementById("parametric-equation-block-context-menu") as HTMLMenuElement;
    } else if (block instanceof HatBlock) {
      contextMenus.hatBlock.block = block;
      menu = document.getElementById("hat-block-context-menu") as HTMLMenuElement;
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
    } else if (block instanceof XYGraph) {
      contextMenus.xygraph.block = block;
      menu = document.getElementById("xygraph-context-menu") as HTMLMenuElement;
    } else if (block instanceof GlobalVariableBlock) {
      contextMenus.globalVariableBlock.block = block;
      menu = document.getElementById("global-variable-block-context-menu") as HTMLMenuElement;
    } else {
      contextMenus.blockView.view = this;
      menu = document.getElementById("block-view-context-menu") as HTMLMenuElement;
      document.getElementById("block-view-context-menu-paste-menu-item").className = flowchart.copiedBlock ? "menu-item" : "menu-item disabled";
    }
    if (menu != null) {
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
      this.selectedMovable = null;
    }
    if (this.selectedBlock != null) {
      this.draw();
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
      this.flowchart.storeBlockStates();
    }
  }

}
