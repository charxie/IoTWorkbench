/*
 * @author Charles Xie
 */

import {Potential1D} from "../Potential1D";

export class MorseWell extends Potential1D {

  private depth: number = 2;
  private alpha: number = 0.5;

  constructor(n: number, xmin: number, xmax: number) {
    super(n, xmin, xmax);
    let delta = (xmax - xmin) / n;
    let center = (xmax + xmin) / 2;
    let x, y;
    for (let i = 0; i < n; i++) {
      x = xmin + i * delta;
      y = 1 - Math.exp(-this.alpha * (x - center));
      this.values[i] = this.depth * (y * y - 1);
    }
  }

}
