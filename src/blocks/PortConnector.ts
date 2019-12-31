/*
 * @author Charles Xie
 */

import {Port} from "./Port";

export class PortConnector {

  private uid: string;
  private output: Port;
  private input: Port;

  static State = class {
    readonly inputBlockId: string;
    readonly inputPortId: string;
    readonly outputBlockId: string;
    readonly outputPortId: string;

    constructor(c: PortConnector) {
      this.inputPortId = c.input.getUid();
      this.outputPortId = c.output.getUid();
      this.inputBlockId = c.input.getBlock().getUid();
      this.outputBlockId = c.output.getBlock().getUid();
    }
  };

  constructor(uid: string, output: Port, input: Port) {
    this.uid = uid;
    this.output = output;
    this.input = input;
  }

  destroy(): void {
    this.input.setValue(0);
    this.output.setValue(0);
  }

  getUid(): string {
    return this.uid;
  }

  getInput(): Port {
    return this.input;
  }

  getOutput(): Port {
    return this.output;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    let p = this.input.getRelativePoint();
    let q = this.output.getRelativePoint();
    let x1 = this.input.getBlock().getX() + p.x;
    let y1 = this.input.getBlock().getY() + p.y;
    let x2 = this.output.getBlock().getX() + q.x;
    let y2 = this.output.getBlock().getY() + q.y;
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
