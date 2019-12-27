/*
 * @author Charles Xie
 */

import {Pin} from "./Pin";
import {Movable} from "../Movable";

export abstract class Block implements Movable {

  pins: Pin[] = [];
  uid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  radius: number = 5;
  margin: number = 30; // margin for inset
  small: boolean; // true when used for small icons

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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

    // draw the block with shade
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.small ? 0.1 : 0.05, "darkgray");
    shade.addColorStop(1, "gray");
    ctx.fillStyle = shade;
    ctx.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);

    // draw the inset
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.x + this.margin, this.y + this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw the name
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = this.small ? "12px Arial" : "bold 16px Arial";
    let textMetrics = ctx.measureText(this.name);
    ctx.translate(this.x + this.width / 2 + 5, this.y + this.height / 2 + textMetrics.width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.name, 0, 0);
    ctx.restore();

    // draw the pins
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "lightgray";
    for (let i = 0; i < this.pins.length; i++) {
      ctx.lineWidth = 1;
      ctx.beginPath();
      let a = this.pins[i].arc;
      let ax = a.x + this.x;
      let ay = a.y + this.y;
      ctx.arc(ax, ay, a.radius, a.startAngle, a.endAngle, a.anticlockwise);
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 0.75;
      let t = this.pins[i].uid;
      if (a.anticlockwise) {
        ctx.strokeText(t, ax - ctx.measureText(t).width - (this.small ? 2 : 4), ay + 4);
      } else {
        ctx.strokeText(t, ax + (this.small ? 2 : 4), ay + 4)
      }
    }

  }

}
