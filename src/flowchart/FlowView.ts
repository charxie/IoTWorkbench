/*
 * @author Charles Xie
 */

import {Point} from "../math/Point";
import {Flowchart} from "./Flowchart";
import {closeAllContextMenus} from "../Main";
import {Movable} from "../Movable";
import {Hat} from "../components/Hat";
import {RaspberryPi} from "../components/RaspberryPi";

export class FlowView {

  flowchart: Flowchart;
  readonly canvas: HTMLCanvasElement;

  private selectedMovable: Movable;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;

  constructor(canvasId: string, flowchart: Flowchart) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu.bind(this), false);
    this.flowchart = flowchart;
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.flowchart.rainbowHatBlock.draw(ctx);
    for (let i = 0; i < this.flowchart.blocks.length; i++) {
      this.flowchart.blocks[i].draw(ctx);
    }
    // let points = [];
    // points.push(new Point(188, 70));
    // points.push(new Point(240, 140));
    // points.push(new Point(20, 200));
    // points.push(new Point(212, 288));
    // this.drawSpline(points, ctx);
  }

  private drawSpline(points: Point[], ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let i;
    for (i = 1; i < points.length - 2; i++) {
      let xc = (points[i].x + points[i + 1].x) / 2;
      let yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    ctx.stroke();
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
    if (this.flowchart.rainbowHatBlock.contains(x, y)) {
      this.selectedMovable = this.flowchart.rainbowHatBlock;
    }
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
      let block = this.flowchart.rainbowHatBlock;
      for (let i = 0; i < block.pins.length; i++) {
        if (block.pins[i].contains(x - block.x, y - block.y)) {
          overWhat = "Pin";
          break;
        }
      }
      if (block.contains(x, y)) {
        overWhat = "Block";
      }
      switch (overWhat) {
        case "Pin":
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

  private openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById("flow-view-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
    menu.classList.add("show-menu");
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
  }

}
