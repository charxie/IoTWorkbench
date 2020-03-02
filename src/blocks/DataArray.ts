/*
 * @author Charles Xie
 */

import {MinMax} from "./MinMax";

export class DataArray {

  data: number[] = [];

  constructor(size: number) {
    if (size > 0) this.data = new Array(size);
  }

  copy(): DataArray {
    let a = new DataArray(0);
    if (this.data !== undefined) { // data could be undefined as this may be set to the value of an input port
      a.data = this.data.slice();
    }
    return a;
  }

  fill(x: number): void {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = x;
    }
  }

  getMinMax(): MinMax {
    let min = Number.MAX_VALUE;
    let max = -min;
    for (let x of this.data) {
      if (x > max) {
        max = x;
      }
      if (x < min) {
        min = x;
      }
    }
    return new MinMax(min, max);
  }

  length(): number {
    return this.data.length;
  }

}
