/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {ElectronicComponent} from "./ElectronicComponent";

export class LedLight implements ElectronicComponent {

  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  on: boolean = false;

  private radius: number = 4;
  private rays: number = 8;
  private color: string = "red";
  private readonly board: Board;

  constructor(board: Board, color: string, x: number, y: number, width: number, height: number) {
    this.name = "LED Light";
    this.board = board;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.on) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2;
      ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      let x1, y1, x2, y2;
      let angle, cos, sin;
      let gap = 2;
      for (let i = 0; i < this.rays; i++) {
        angle = i * Math.PI * 2 / this.rays;
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        x1 = centerX + this.radius * cos;
        y1 = centerY + this.radius * sin;
        x2 = centerX + (this.radius * 3 + gap) * cos;
        y2 = centerY + (this.radius * 3 + gap) * sin;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
      }
    } else {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }

  public inside(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  public toggle(x: number, y: number) {
    let inside = this.inside(x, y);
    if (inside) {
      this.on = !this.on;
    }
    return inside;
  }

}
