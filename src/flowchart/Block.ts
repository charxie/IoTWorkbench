/*
 * @author Charles Xie
 */

import {Movable} from "../Movable";

export class Block implements Movable {

  uid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  radius: number = 5;
  margin: number = 30; // margin for inset

  constructor(x: number, y: number, width: number, height: number, name: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
  }

  getUid(): string {
    return this.uid;
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): void {
    this.x = x;
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): void {
    this.y = y;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  contains(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    ctx.fillStyle = "lightgray";
    ctx.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.x + this.margin, this.y + this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    let textMetrics = ctx.measureText(this.name);
    ctx.fillText(this.name, this.x + this.width / 2 - textMetrics.width / 2, this.y + this.height / 2 + 8);

    let r = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.height / 3, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.height * 2 / 3, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x + this.width, this.y + this.height / 2, r, 0.5 * Math.PI, 1.5 * Math.PI, true);
    ctx.stroke();

  }


}
