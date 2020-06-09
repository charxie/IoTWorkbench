/*
 * @author Charles Xie
 */

import {Potential1D} from "../Potential1D";

export class CoulombWell extends Potential1D {

  private k: number = 1;
  private offset: number = -1;

  constructor(n: number, xmin: number, xmax: number) {
    super(n, xmin, xmax);
    const delta = (xmax - xmin) / n;
    const center = (xmax + xmin) / 2;
    let x;
    for (let i = 0; i < n; i++) {
      x = xmin + i * delta;
      this.values[i] = -this.k / Math.abs(x - center);
      if (this.values[i] < this.offset)
        this.values[i] = this.offset;
    }
  }

}
