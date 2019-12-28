/*
 * @author Charles Xie
 */

import {Flowchart} from "./Flowchart";
import {closeAllContextMenus, contextMenus, sound} from "../Main";
import {Movable} from "../Movable";
import {Block} from "./Block";
import {UnaryFunctionBlock} from "./UnaryFunctionBlock";
import {LogicBlock} from "./LogicBlock";
import {NegationBlock} from "./NegationBlock";
import {MathBlock} from "./MathBlock";
import {HatBlock} from "./HatBlock";
import {Port} from "./Port";
import {Connector} from "./Connector";
import {BinaryFunctionBlock} from "./BinaryFunctionBlock";

export class BlockView {

  flowchart: Flowchart;
  readonly canvas: HTMLCanvasElement;

  private selectedMovable: Movable;
  private selectedPort: Port;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;
  private connector: Connector;
  private gridSize: number = 100;

  constructor(canvasId: string, flowchart: Flowchart) {
    this.flowchart = flowchart;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu.bind(this), false);
    document.addEventListener("mouseleave", this.mouseLeave.bind(this), false);

    this.connector = new Connector();

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
        switch (that.draggedElementId) {
          case "unary-function-block":
            let block = new UnaryFunctionBlock(e.offsetX, e.offsetY, 60, 80);
            block.uid = "Unary Function Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
          case "binary-function-block":
            block = new BinaryFunctionBlock(e.offsetX, e.offsetY, 60, 100);
            block.uid = "Binary Function Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
          case "logic-and-block":
            block = new LogicBlock(e.offsetX, e.offsetY, 60, 80, "And");
            block.uid = "Logic And Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
          case "logic-or-block":
            block = new LogicBlock(e.offsetX, e.offsetY, 60, 80, "Or");
            block.uid = "Logic Or Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
          case "logic-not-block":
            block = new NegationBlock(e.offsetX, e.offsetY, 60, 80);
            block.uid = "Logic Not Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
          case "math-add-block":
            block = new MathBlock(e.offsetX, e.offsetY, 60, 80, "+");
            block.uid = "Add Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
          case "math-multiply-block":
            block = new MathBlock(e.offsetX, e.offsetY, 60, 80, "×");
            block.uid = "Multiply Block #" + Date.now().toString(16);
            that.storeBlock(block);
            break;
        }
      }
    }, false);
  }

  private storeBlock(block: Block): void {
    this.flowchart.blocks.push(block);
    this.draw();
    this.flowchart.storeBlocks();
    this.flowchart.storeBlockLocation(block);
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    this.drawGrid(ctx);
    ctx.lineWidth = 3;
    for (let i = 0; i < this.flowchart.connectors.length; i++) {
      this.flowchart.connectors[i].draw(ctx);
    }
    for (let i = 0; i < this.flowchart.blocks.length; i++) {
      this.flowchart.blocks[i].draw(ctx);
    }
    if (this.selectedPort) {
      this.connector.draw(ctx);
    }
  }

  public drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    for (let i = 1; i <= this.canvas.height / this.gridSize; i++) {
      ctx.moveTo(0, i * this.gridSize);
      ctx.lineTo(this.canvas.width, i * this.gridSize);
    }
    for (let i = 1; i <= this.canvas.width / this.gridSize; i++) {
      ctx.moveTo(i * this.gridSize, 0);
      ctx.lineTo(i * this.gridSize, this.canvas.height);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  // detect if (x, y) is inside this view
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
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

  private mouseDown(e: MouseEvent): void {
    this.selectedMovable = null;
    this.selectedPort = null;
    let x = e.offsetX;
    let y = e.offsetY;
    for (let i = this.flowchart.blocks.length - 1; i >= 0; i--) {
      if (this.flowchart.blocks[i].contains(x, y)) {
        this.selectedMovable = this.flowchart.blocks[i];
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
          for (let i = 0; i < block.ports.length; i++) {
            if (block.ports[i].contains(x - block.x, y - block.y)) {
              this.selectedPort = block.ports[i];
              if (!this.selectedPort.input) {
                let p = this.selectedPort.getAbsolutePoint();
                this.connector.x1 = p.x;
                this.connector.y1 = p.y;
              }
              break outerloop;
            }
          }
        }
    }
  }

  private mouseUp(e: MouseEvent): void {
    let x = e.offsetX;
    let y = e.offsetY;
    outerloop:
      for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
        let block = this.flowchart.blocks[n];
        for (let i = 0; i < block.ports.length; i++) {
          if (block.ports[i].input && block.ports[i].contains(x - block.x, y - block.y)) {
            if (this.flowchart.addPortConnector(this.selectedPort, block.ports[i])) {
              sound.play();
              this.flowchart.storePortConnectors();
            }
            break outerloop;
          }
        }
      }
    this.selectedMovable = null;
    this.selectedPort = null;
    this.draw();
    closeAllContextMenus(); // close all context menus upon mouse left click
  }

  private mouseMove(e: MouseEvent): void {
    let x = e.offsetX;
    let y = e.offsetY
    let overWhat = "Default";
    outerloop:
      for (let n = this.flowchart.blocks.length - 1; n >= 0; n--) {
        let block = this.flowchart.blocks[n];
        if (block.contains(x, y)) {
          overWhat = "Block";
          break outerloop;
        } else {
          for (let i = 0; i < block.ports.length; i++) {
            if (block.ports[i].contains(x - block.x, y - block.y)) {
              overWhat = "Port";
              break outerloop;
            }
          }
        }
      }
    switch (overWhat) {
      case "Port":
        this.canvas.style.cursor = "pointer";
        break;
      case "Block":
        this.canvas.style.cursor = "move";
        break;
      default:
        this.canvas.style.cursor = "default";
        break;
    }

    if (this.selectedMovable != null) {
      this.moveTo(x, y, this.selectedMovable);
      this.draw();
    } else if (this.selectedPort != null) {
      if (!this.selectedPort.input) {
        this.connector.x2 = e.offsetX;
        this.connector.y2 = e.offsetY;
        this.draw();
      }
    }

  }

  private mouseLeave = (e: MouseEvent): void => {
    this.selectedMovable = null;
  };

  private openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    let block = null;
    for (let i = this.flowchart.blocks.length - 1; i >= 0; i--) {
      if (this.flowchart.blocks[i].contains(e.offsetX, e.offsetY)) {
        block = this.flowchart.blocks[i];
        break;
      }
    }
    if (block) {
      contextMenus.block.block = block;
      let menu = document.getElementById("block-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
      let deleteMenuItem = document.getElementById("block-delete-menu-item") as HTMLElement;
      deleteMenuItem.className = block instanceof HatBlock ? "menu-item disabled" : "menu-item";
    } else {
      let menu = document.getElementById("block-view-context-menu") as HTMLMenuElement;
      menu.style.left = e.clientX + "px";
      menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
      menu.classList.add("show-menu");
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
    if (m instanceof Block) {
      this.flowchart.storeBlockLocation(m);
    }
  }

}
