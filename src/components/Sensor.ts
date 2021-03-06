/*
 * @author Charles Xie
 */

import {Board} from "./Board";

export class Sensor {

  readonly name: string;
  readonly unit: string;
  readonly data: number[] = [];
  collectionInterval: number = 1; // in seconds
  x: number;
  y: number;
  width: number;
  height: number;
  readonly board: Board;

  private on: boolean = false;
  private pressedColor: string = 'white';

  constructor(board: Board, name: string, unit: string, x: number, y: number, width: number, height: number) {
    this.board = board;
    this.name = name;
    this.unit = unit;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public clear(): void {
    this.data.length = 0;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.on) {
      ctx.fillStyle = this.pressedColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }

  public contains(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
