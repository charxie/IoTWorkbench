/*
 * @author Charles Xie
 */

import {Port} from "./Port";

export class PortConnector {

  port1: Port;
  port2: Port;

  constructor(port1: Port, port2: Port) {
    this.port1 = port1;
    this.port2 = port2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    let p = this.port1.getRelativePoint();
    let q = this.port2.getRelativePoint();
    let x1 = this.port1.block.getX() + p.x;
    let y1 = this.port1.block.getY() + p.y;
    let x2 = this.port2.block.getX() + q.x;
    let y2 = this.port2.block.getY() + q.y;
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
