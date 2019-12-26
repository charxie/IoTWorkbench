/*
 * @author Charles Xie
 */

import {Arc} from "../math/Arc";

export class Pin {

  uid: string;
  name: string;
  arc: Arc;

  private radius: number = 5;

  constructor(uid: string, x: number, y: number, anticlockwise: boolean) {
    this.uid = uid;
    this.arc = new Arc(x, y, this.radius, 0.5 * Math.PI, 1.5 * Math.PI, anticlockwise);
  }

  contains(x: number, y: number): boolean {
    return this.arc.contains(x, y);
  }

}
