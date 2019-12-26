/*
 * @author Charles Xie
 */

import {Point} from "../math/Point";
import {Flowchart} from "./Flowchart";
import {closeAllContextMenus} from "../Main";

export class FlowView {

  flowchart: Flowchart;
  readonly canvas: HTMLCanvasElement;

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
  }

  private mouseUp(e: MouseEvent): void {
    // close all context menus upon mouse left click
    closeAllContextMenus();
  }

  private mouseMove(e: MouseEvent): void {
    e.preventDefault();
  }

  private openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById("flow-view-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
    menu.classList.add("show-menu");
  }

}
