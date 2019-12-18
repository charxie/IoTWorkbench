/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {ElectronicComponent} from "./ElectronicComponent";

export class LedDisplay implements ElectronicComponent {

  name: string;
  color: string = "lightgreen";
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: string = "70px";

  private character: string;
  private readonly board: Board;
  private readonly fontFamily: string = "digital-clock-font";

  constructor(board: Board, name: string, x: number, y: number, width: number, height: number) {
    this.board = board;
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if (this.character) {
      ctx.fillStyle = "lightgreen";
      ctx.font = this.fontSize + " " + this.fontFamily;
      ctx.fillText(this.character, this.x, this.y);
    }
    ctx.restore();
  }

  public setCharacter(character: string): void {
    if (character != null && character.length != 1) throw "Only one character is allowed";
    this.character = character;
  }

  public contains(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
