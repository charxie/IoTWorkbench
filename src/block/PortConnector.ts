/*
 * @author Charles Xie
 */

import {Port} from "./Port";

export class PortConnector {

  uid: string;
  output: Port;
  input: Port;

  static State = class {
    inputBlockId: string;
    inputPortId: string;
    outputBlockId: string;
    outputPortId: string;

    constructor(c: PortConnector) {
      this.inputPortId = c.input.uid;
      this.outputPortId = c.output.uid;
      this.inputBlockId = c.input.block.uid;
      this.outputBlockId = c.output.block.uid;
    }
  };

  constructor(output: Port, input: Port) {
    this.output = output;
    this.input = input;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    let p = this.input.getRelativePoint();
    let q = this.output.getRelativePoint();
    let x1 = this.input.block.getX() + p.x;
    let y1 = this.input.block.getY() + p.y;
    let x2 = this.output.block.getX() + q.x;
    let y2 = this.output.block.getY() + q.y;
    let dy = (y2 - y1) / 4;
    let cx = (x1 + x2) / 2;
    let cy = (y1 + y2) / 2;
    ctx.moveTo(x1, y1);
    let x = (cx + x1) / 2; // control point for the first half
    let y = (cy + y1) / 2 - dy;
    ctx.quadraticCurveTo(x, y, cx, cy);
    x = (cx + x2) / 2; // control point for the second half
    y = (cy + y2) / 2 + dy;
    ctx.quadraticCurveTo(x, y, x2, y2);
    ctx.stroke();
  }

}
