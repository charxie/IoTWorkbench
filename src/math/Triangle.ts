/*
 * @author Charles Xie
 */

import {Point} from "./Point";

export class Triangle {

  p1: Point;
  p2: Point;
  p3: Point;

  constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.p3 = new Point(x3, y3);
  }

  public contains(p: Point): boolean {
    let s = this.p1.y * this.p3.x - this.p1.x * this.p3.y + (this.p3.y - this.p1.y) * p.x + (this.p1.x - this.p3.x) * p.y;
    let t = this.p1.x * this.p2.y - this.p1.y * this.p2.x + (this.p1.y - this.p2.y) * p.x + (this.p2.x - this.p1.x) * p.y;
    if ((s < 0) != (t < 0)) return false;
    let a = -this.p2.y * this.p3.x + this.p1.y * (this.p3.x - this.p2.x) + this.p1.x * (this.p2.y - this.p3.y) + this.p2.x * this.p3.y;
    return a < 0 ? (s <= 0 && s + t >= a) : (s >= 0 && s + t <= a);
  }

}
