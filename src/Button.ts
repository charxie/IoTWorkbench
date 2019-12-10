/*
 * @author Charles Xie
 */

import {Board} from "./Board";

export class Button {

  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  on: boolean = false;

  private readonly board: Board;
  private pressedColor: string = '#66cccccc';

  constructor(board: Board, x: number, y: number, width: number, height: number) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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

  public inside(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
