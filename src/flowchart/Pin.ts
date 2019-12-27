/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Arc} from "../math/Arc";
import {Point} from "../math/Point";

export class Pin {

  block: Block;
  uid: string;
  name: string;
  arc: Arc;

  private radius: number = 5;

  constructor(block: Block, uid: string, x: number, y: number, anticlockwise: boolean) {
    this.block = block;
    this.uid = uid;
    this.arc = new Arc(x, y, this.radius, 0.5 * Math.PI, 1.5 * Math.PI, anticlockwise);
  }

  getPoint() {
    return new Point(this.arc.x + (this.arc.anticlockwise ? this.radius : -this.radius), this.arc.y);
  }

  contains(x: number, y: number): boolean {
    return this.arc.contains(x, y);
  }

}
