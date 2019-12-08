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
  x: number;
  y: number;
  width: number;
  height: number;
  private imageId: string;
  private gridSize: number = 50;

  constructor(imageId: string, x: number, y: number, width: number, height: number) {
    this.imageId = imageId;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // draw the background image for the board
  public draw(): void {
    let context = this.canvas.getContext('2d');
    let image = document.getElementById(this.imageId) as HTMLImageElement; // preload image
    context.drawImage(image, this.x, this.y);
  }

  // detect if (x, y) is inside the board
  public inside(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  public drawGrid(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.beginPath();
    context.strokeStyle = "LightSkyBlue";
    for (let i = 1; i <= this.canvas.height / this.gridSize; i++) {
      context.moveTo(0, i * this.gridSize);
      context.lineTo(this.canvas.width, i * this.gridSize);
    }
    for (let i = 1; i <= this.canvas.width / this.gridSize; i++) {
      context.moveTo(i * this.gridSize, 0);
      context.lineTo(i * this.gridSize, this.canvas.height);
    }
    context.stroke();
    context.closePath();
    context.restore();
  }

  abstract drawToolTips(): void;

  abstract updateFirebase(value): void;

  abstract updateFromFirebase(): void;

}
