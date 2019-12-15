/*
 * @author Charles Xie
 */

import {Board} from "./Board";
import {ElectronicComponent} from "./ElectronicComponent";

export class LedLight implements ElectronicComponent {

  name: string;
  color: string = "red";
  radius: number = 4;
  rays: number = 8;
  rayLength: number = 5;
  x: number;
  y: number;
  width: number;
  height: number;
  on: boolean = false;

  private readonly board: Board;

  constructor(board: Board, name: string, color: string, radius: number, rays: number, rayLength: number, x: number, y: number, width: number, height: number) {
    this.board = board;
    this.name = name;
    this.color = color;
    this.radius = radius;
    this.rays = rays;
    this.rayLength = rayLength;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if (this.on) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2;
      let gradient = ctx.createRadialGradient(centerX, centerY, this.radius * 0.25, centerX, centerY, this.radius);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      gradient.addColorStop(0, this.color);
      ctx.fillStyle = gradient;
      ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      let x1, y1, x2, y2;
      let angle, cos, sin;
      ctx.strokeStyle = "white";
      for (let i = 0; i < this.rays; i++) {
        angle = i * Math.PI * 2 / this.rays;
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        x1 = centerX + this.radius * cos * 2 / 3;
        y1 = centerY + this.radius * sin * 2 / 3;
        x2 = centerX + (this.radius + this.rayLength) * cos;
        y2 = centerY + (this.radius + this.rayLength) * sin;
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
    ctx.restore();
  }

  public contains(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  public toggle(x: number, y: number) {
    let inside = this.contains(x, y);
    if (inside) {
      this.on = !this.on;
    }
    return inside;
  }

}
