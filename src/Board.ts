/*
 * @author Charles Xie
 */

import {System} from "./System";

declare global {
  interface CanvasRenderingContext2D {
    drawTooltip(x, y, h, r, margin, text, centered);

    drawRoundedRect(x, y, w, h, r);

    fillRoundedRect(x, y, w, h, r);
  }
}

export abstract class Board {

  canvas: HTMLCanvasElement;
  private imageId: string;

  constructor(imageId: string) {
    this.imageId = imageId;
  }

  // draw the background image for the board
  public draw(): void {
    let context = this.canvas.getContext('2d');
    let image = document.getElementById(this.imageId) as HTMLImageElement; // preload image
    context.drawImage(image, 0, 0);
  }

  // detect if (x, y) is inside the board
  public inside(x: number, y: number): boolean {
    return x > this.canvas.offsetLeft && x < this.canvas.offsetLeft + this.canvas.width && y > this.canvas.offsetTop && y < this.canvas.offsetTop + this.canvas.height;
  }

  abstract drawToolTips(): void;

  abstract updateFirebase(value): void;

  abstract updateFromFirebase(): void;

}
