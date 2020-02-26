/*
 * @author Charles Xie
 */

import {MinMax} from "./MinMax";

export class DataArray {

  data: number[] = [];

  constructor() {
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
