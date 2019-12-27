/*
 * @author Charles Xie
 */

import {Flowchart} from "./Flowchart";
import {closeAllContextMenus, contextMenus} from "../Main";
import {Movable} from "../Movable";
import {Point} from "../math/Point";
import {Block} from "./Block";
import {ConditionalBlock} from "./ConditionalBlock";
import {LogicBlock} from "./LogicBlock";
import {NegationBlock} from "./NegationBlock";
import {MathBlock} from "./MathBlock";
import {RainbowHatBlock} from "./RainbowHatBlock";
import {HatBlock} from "./HatBlock";

export class FlowView {

  flowchart: Flowchart;
  readonly canvas: HTMLCanvasElement;

  private selectedMovable: Movable;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private draggedElementId: string;

  constructor(canvasId: string, flowchart: Flowchart) {
    this.flowchart = flowchart;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu.bind(this), false);
    document.addEventListener("mouseleave", this.mouseLeave.bind(this), false);

    let playground = document.getElementById("flowchart-playground") as HTMLDivElement;

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
      if (id == "flow-view") {
        switch (that.draggedElementId) {
          case "conditional-block":
            let block = new ConditionalBlock(e.offsetX, e.offsetY, 60, 80);
            block.uid = "Conditional Block #" + Date.now().toString(16);
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
    for (let i = 0; i < this.flowchart.blocks.length; i++) {
      this.flowchart.blocks[i].draw(ctx);
    }
    for (let i = 0; i < this.flowchart.connectors.length; i++) {
      this.flowchart.connectors[i].draw(ctx);
    }
  }

  // detect if (x, y) is inside this flowview
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
    }
  }

  private mouseUp(e: MouseEvent): void {
    this.selectedMovable = null;
    closeAllContextMenus(); // close all context menus upon mouse left click
  }

  private mouseMove(e: MouseEvent): void {
    let x = e.offsetX;
    let y = e.offsetY
    if (this.selectedMovable != null) {
      this.moveTo(x, y, this.selectedMovable);
      this.draw();
      //this.storeLocation(this.selectedMovable);
    } else {
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
      let menu = document.getElementById("flow-view-context-menu") as HTMLMenuElement;
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
