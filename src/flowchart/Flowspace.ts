/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Point} from "../math/Point";

export class Flowspace {

  private blocks: Block[] = [];

  readonly canvas: HTMLCanvasElement;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this), false);
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this), false);
    this.canvas.addEventListener('contextmenu', this.openContextMenu.bind(this), false);
    this.blocks.push(new Block(20, 20, 160, 100, "X + Y"));
    this.blocks.push(new Block(220, 220, 160, 100, "X * Y"));
  }

  public draw(): void {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].draw(ctx);
    }

    let points = [];
    points.push(new Point(188, 70));
    points.push(new Point(240, 140));
    points.push(new Point(20, 200));
    points.push(new Point(212, 288));
    this.drawSpline(points, ctx);

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

  // detect if (x, y) is inside this workbench
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
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
  }

  private mouseUp(e: MouseEvent): void {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    let context = this.canvas.getContext("2d");
  }

  private mouseMove(e: MouseEvent): void {
    e.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let dx = e.clientX - rect.x;
    let dy = e.clientY - rect.y;
    let context = this.canvas.getContext("2d");
  }

  private openContextMenu(e: MouseEvent): void {
    e.preventDefault();
    let menu = document.getElementById("workbench-context-menu") as HTMLMenuElement;
    menu.style.left = e.clientX + "px";
    menu.style.top = (e.clientY - document.getElementById("tabs").getBoundingClientRect().bottom) + "px";
    menu.classList.add("show-menu");
  }

}
