/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Movable} from "../Movable";
import {Util} from "../Util";

export abstract class Block implements Movable {

  ports: Port[] = [];
  uid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string = "#666666";
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

  getPort(uid: string): Port {
    for (let i = 0; i < this.ports.length; i++) {
      if (this.ports[i].uid == uid) {
        return this.ports[i];
      }
    }
    return null;
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
    shade.addColorStop(this.small ? 0.1 : 0.05, Util.adjust(this.color, 50));
    shade.addColorStop(1, this.color);
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
    ctx.fillStyle = "gray";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.small ? 0.75 : 1;
    ctx.font = this.small ? "12px Times" : "bold 16px Times";
    ctx.font = this.small ? "12px Times" : "bold 16px Times";
    let textMetrics = ctx.measureText(this.name);
    ctx.translate(this.x + this.width / 2 + 5, this.y + this.height / 2 + textMetrics.width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.strokeText(this.name, 0, 0);
    ctx.restore();

    // draw the ports
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let i = 0; i < this.ports.length; i++) {
      this.ports[i].draw(ctx, this.small);
    }

  }

  public toString(): string {
    return this.uid;
  }

}
