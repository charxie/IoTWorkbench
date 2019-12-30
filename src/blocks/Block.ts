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
  symbol: string;
  radius: number = 5;
  margin: number = 30; // margin for inset
  small: boolean; // true when used for small icons

  static State = class {
    uid: string;
    x: number;
    y: number;

    constructor(block: Block) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
    }
  };

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update(): void {
  }

  getPort(uid: string): Port {
    for (let p of this.ports) {
      if (p.uid == uid) {
        return p;
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

    // draw the symbol or name (if symbol is not available)
    ctx.save();
    ctx.fillStyle = "gray";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.small ? 0.75 : 1;
    if (this.symbol) {
      let textWidth = ctx.measureText(this.symbol).width;
      if (textWidth < this.width - 2 * this.margin - 20) {
        ctx.font = this.small ? "16px Arial" : "bold 20px Arial";
        textWidth = ctx.measureText(this.symbol).width;
        ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + this.height / 2 + (this.small ? 5 : 7));
      } else {
        ctx.font = this.small ? "12px Arial" : "bold 16px Arial";
        textWidth = ctx.measureText(this.symbol).width;
        ctx.translate(this.x + this.width / 2 + 5, this.y + this.height / 2 + textWidth / 2);
        ctx.rotate(-Math.PI / 2);
      }
      ctx.fillText(this.symbol, 0, 0);
    } else {
      ctx.font = this.small ? "12px Arial" : "bold 16px Arial";
      let textMetrics = ctx.measureText(this.name);
      ctx.translate(this.x + this.width / 2 + 5, this.y + this.height / 2 + textMetrics.width / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(this.name, 0, 0);
    }
    ctx.restore();

    // draw the ports
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.small);
    }

  }

  public toString(): string {
    return this.uid;
  }

}
