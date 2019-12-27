/*
 * @author Charles Xie
 */

import {Pin} from "./Pin";

export class Connector {

  pin1: Pin;
  pin2: Pin;

  constructor(pin1: Pin, pin2: Pin) {
    this.pin1 = pin1;
    this.pin2 = pin2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    let p = this.pin1.getPoint();
    let q = this.pin2.getPoint();
    let x1 = this.pin1.block.getX() + p.x;
    let y1 = this.pin1.block.getY() + p.y;
    let x2 = this.pin2.block.getX() + q.x;
    let y2 = this.pin2.block.getY() + q.y;
    let dy = (y2 - y1) / 4;
    let cx = (x1 + x2) / 2;
    let cy = (y1 + y2) / 2;
    ctx.moveTo(x1, y1);
    let x = (cx + x1) / 2;
    let y = (cy + y1) / 2 - dy;
    ctx.quadraticCurveTo(x, y, cx, cy);
    x = (cx + x2) / 2;
    y = (cy + y2) / 2 + dy;
    ctx.quadraticCurveTo(x, y, x2, y2);
    ctx.stroke();
  }

}
