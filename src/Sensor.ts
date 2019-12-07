/*
 * @author Charles Xie
 */

import {Board} from "./Board";

export class Sensor {

  name: string;
  x: number;
  y: number;
  width: number;
  height: number;

  private board: Board;
  private on: boolean = false;
  private pressedColor: string = 'white';

  constructor(board: Board, x: number, y: number, width: number, height: number) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    let x0 = this.board.x + this.x;
    let y0 = this.board.y + this.y;
    if (this.on) {
      ctx.fillStyle = this.pressedColor;
      ctx.fillRect(x0, y0, this.width, this.height);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.rect(x0, y0, this.width, this.height);
    ctx.stroke();
  }

  public inside(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
