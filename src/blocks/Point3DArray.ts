/*
 * @author Charles Xie
 */

import {MinMax} from "./MinMax";
import {Vector3} from "three";

export class Point3DArray {

  private points: Vector3[] = [];

  addPoint(x: number, y: number, z: number): void {
    this.points.push(new Vector3(x, y, z));
  }

  getPoints(): Vector3[] {
    return this.points;
  }

  getPoint(i: number): Vector3 {
    return this.points[i];
  }

  getX(i: number): number {
    return this.points[i].x;
  }

  getLatestX(): number {
    return this.points[this.points.length - 1].x;
  }

  getY(i: number): number {
    return this.points[i].y;
  }

  getLatestY(): number {
    return this.points[this.points.length - 1].y;
  }

  getZ(i: number): number {
    return this.points[i].z;
  }

  getLatestZ(): number {
    return this.points[this.points.length - 1].z;
  }

  getXminXmax(): MinMax {
    let xmin = Number.MAX_VALUE;
    let xmax = -xmin;
    for (let v of this.points) {
      if (v.x > xmax) {
        xmax = v.x;
      }
      if (v.x < xmin) {
        xmin = v.x;
      }
    }
    return new MinMax(xmin, xmax);
  }

  getYminYmax(): MinMax {
    let ymin = Number.MAX_VALUE;
    let ymax = -ymin;
    for (let v of this.points) {
      if (v.y > ymax) {
        ymax = v.y;
      }
      if (v.y < ymin) {
        ymin = v.y;
      }
    }
    return new MinMax(ymin, ymax);
  }

  getZminZmax(): MinMax {
    let zmin = Number.MAX_VALUE;
    let zmax = -zmin;
    for (let v of this.points) {
      if (v.z > zmax) {
        zmax = v.z;
      }
      if (v.z < zmin) {
        zmin = v.z;
      }
    }
    return new MinMax(zmin, zmax);
  }

  clear(): void {
    this.points.length = 0;
  }

  length(): number {
    return this.points.length;
  }

}
