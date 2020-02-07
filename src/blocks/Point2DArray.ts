/*
 * @author Charles Xie
 */

import {Point} from "../math/Point";
import {MinMax} from "./MinMax";

export class Point2DArray {

  private xPoints: number[] = [];
  private yPoints: number[] = [];

  addPoint(x: number, y: number): void {
    this.xPoints.push(x);
    this.yPoints.push(y);
  }

  setXPoints(arr: number[]): void {
    this.xPoints = arr;
  }

  setYPoints(arr: number[]): void {
    this.yPoints = arr;
  }

  getX(i: number): number {
    return this.xPoints[i];
  }

  getY(i: number): number {
    return this.yPoints[i];
  }

  getXminXmax(): MinMax {
    let xmin = Number.MAX_VALUE;
    let xmax = -xmin;
    for (let x of this.xPoints) {
      if (x > xmax) {
        xmax = x;
      }
      if (x < xmin) {
        xmin = x;
      }
    }
    return new MinMax(xmin, xmax);
  }

  getYminYmax(): MinMax {
    let ymin = Number.MAX_VALUE;
    let ymax = -ymin;
    for (let y of this.yPoints) {
      if (y > ymax) {
        ymax = y;
      }
      if (y < ymin) {
        ymin = y;
      }
    }
    return new MinMax(ymin, ymax);
  }

  clear(): void {
    this.xPoints.length = 0;
    this.yPoints.length = 0;
  }

  length(): number {
    return this.xPoints.length;
  }

}
