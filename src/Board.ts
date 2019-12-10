/*
 * @author Charles Xie
 */

import {System} from "./System";
import {Movable} from "./Movable";

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);
  }
}

export abstract class Board implements Movable {

  readonly canvas: HTMLCanvasElement;
  private imageId: string;

  constructor(canvasId: string, imageId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.imageId = imageId;
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

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  // draw the background image for this board
  public draw(): void {
    let context = this.canvas.getContext('2d');
    let image = document.getElementById(this.imageId) as HTMLImageElement; // preload image
    context.drawImage(image, 0, 0);
  }

  // detect if (x, y) is inside this board
  public contains(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
  }

  abstract drawToolTips(): void;

  abstract updateFirebase(value): void;

  abstract updateFromFirebase(): void;

}
