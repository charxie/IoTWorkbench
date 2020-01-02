/*
*  A stadium is a two-dimensional geometric shape constructed of a rectangle with semicircles at a pair of opposite sides.
*  See: https://en.wikipedia.org/wiki/Stadium_(geometry)
 * @author Charles Xie
 */

import {Rectangle} from "./Rectangle";
import {Arc} from "./Arc";

export class Stadium {

  public rectangle: Rectangle; // the rectangle in the middle
  public arcLeft: Arc;
  public arcRight: Arc;

  constructor(xRect: number, yRect: number, wRect: number, hRect: number) {
    this.arcLeft = new Arc(0, 0, 5, 0.5 * Math.PI, 1.5 * Math.PI, false);
    this.arcRight = new Arc(0, 0, 5, 0.5 * Math.PI, 1.5 * Math.PI, true);
    this.rectangle = new Rectangle(0, 0, 10, 10);
    this.setRect(xRect, yRect, wRect, hRect);
  }

  public setRect(xRect: number, yRect: number, wRect: number, hRect: number) {
    this.rectangle.setRect(xRect, yRect, wRect, hRect);
    this.arcLeft.radius = hRect / 2;
    this.arcLeft.x = xRect;
    this.arcLeft.y = yRect + this.arcLeft.radius;
    this.arcRight.x = xRect + wRect;
    this.arcRight.y = this.arcLeft.y;
    this.arcRight.radius = this.arcLeft.radius;
  }

  public getXmax(): number {
    return this.rectangle.getXmax() + this.arcRight.radius;
  }

  public getYmax(): number {
    return this.rectangle.getYmax();
  }

  public getXmin(): number {
    return this.rectangle.getXmin() - this.arcLeft.radius;
  }

  public getYmin(): number {
    return this.rectangle.getYmin();
  }

  public getCenterX(): number {
    return this.rectangle.getCenterX();
  }

  public getCenterY(): number {
    return this.rectangle.getCenterY();
  }

  public contains(x: number, y: number): boolean {
    return this.rectangle.contains(x, y) || this.arcLeft.contains(x, y) || this.arcRight.contains(x, y);
  }

  public toString(): string {
    return this.rectangle.toString();
  }

}
