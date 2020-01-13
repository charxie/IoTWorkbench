/*
 * A rectangular printed circuit board (PCB)
 *
 * @author Charles Xie
 */

import {Movable} from "../Movable";
import {Rectangle} from "../math/Rectangle";

export abstract class Board implements Movable {

  readonly canvas: HTMLCanvasElement;
  public handles: Rectangle[] = [];
  uid: string;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  }

  refreshView(): void {
  }

  public getUid(): string {
    return this.uid;
  }

  public getX(): number {
    return this.canvas.offsetLeft;
  }

  public setX(x: number): void {
    this.canvas.style.left = x + "px";
  }

  public getY(): number {
    return this.canvas.offsetTop;
  }

  public setY(y: number): void {
    this.canvas.style.top = y + "px";
  }

  public translateBy(dx: number, dy: number): void {
    this.setX(this.getX() + dx);
    this.setY(this.getY() + dy);
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  public abstract draw(): void;

  // detect if (x, y) is inside this board
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
  }

  abstract drawToolTips(): void;

  abstract updateFirebase(value): void;

  abstract updateFromFirebase(): void;

  turnoff(): void {
  }

  whichHandle(x: number, y: number): number {
    for (let i = 0; i < this.handles.length; i++) {
      if (this.handles[i].contains(x, y)) return i;
    }
    return -1;
  }

  drawHandle(handle: Rectangle, context: CanvasRenderingContext2D): void {
    context.strokeStyle = "yellow";
    context.beginPath();
    context.rect(handle.x, handle.y, handle.width, handle.height);
    context.stroke();
    context.closePath();
  }

}
