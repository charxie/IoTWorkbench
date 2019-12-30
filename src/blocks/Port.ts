/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Arc} from "../math/Arc";
import {Point} from "../math/Point";

export class Port {

  input: boolean; // a port must be either input or output. If this is false, then this is a port for output.
  close: boolean; // when a connector end is close to this port
  block: Block;
  uid: string;
  name: string;
  arc: Arc;

  private radius: number = 5;

  constructor(block: Block, input: boolean, uid: string, x: number, y: number, anticlockwise: boolean) {
    this.block = block;
    this.input = input;
    this.uid = uid;
    this.arc = new Arc(x, y, this.radius, 0.5 * Math.PI, 1.5 * Math.PI, anticlockwise);
  }

  getRelativePoint(): Point {
    return new Point(this.arc.x + (this.arc.anticlockwise ? this.radius : -this.radius), this.arc.y);
  }

  getAbsolutePoint(): Point {
    let p = this.getRelativePoint();
    p.translate(this.block.x, this.block.y);
    return p;
  }

  contains(x: number, y: number): boolean {
    return this.arc.contains(x, y);
  }

  near(x: number, y: number): boolean {
    return this.arc.near(x, y);
  }

  draw(ctx: CanvasRenderingContext2D, small: boolean): void {
    ctx.save();
    let ax = this.arc.x + this.block.x;
    let ay = this.arc.y + this.block.y;
    ctx.lineWidth = small ? 1 : 2;
    if (this.close && this.input) {
      let shade = ctx.createRadialGradient(ax, ay, this.radius, ax, ay, 3 * this.radius);
      shade.addColorStop(1, "gold");
      shade.addColorStop(0.25, "yellow");
      shade.addColorStop(0, "white");
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(ax, ay, 3 * this.arc.radius, this.arc.startAngle, this.arc.endAngle, this.arc.anticlockwise);
      ctx.fill();
    }
    ctx.fillStyle = this.input ? "white" : "darkgray";
    ctx.beginPath();
    ctx.arc(ax, ay, this.arc.radius, this.arc.startAngle, this.arc.endAngle, this.arc.anticlockwise);
    ctx.fill();
    ctx.stroke();
    if (!small) {
      ctx.lineWidth = 0.75;
      let t = this.uid;
      if (t != null) {
        if (this.arc.anticlockwise) {
          ctx.strokeText(t, ax - ctx.measureText(t).width - (small ? 2 : 4), ay + 4);
        } else {
          ctx.strokeText(t, ax + (small ? 2 : 4), ay + 4)
        }
      }
      ctx.restore();
    }
  }

  public toString(): string {
    return this.block.toString() + " @" + this.uid;
  }

}
