/*
 * @author Charles Xie
 */

import {Potential1D} from "./Potential1D";

export class HarmonicOscillator extends Potential1D {

  private k: number = 0.01;
  private offset: number = -1;

  constructor(n: number, xmin: number, xmax: number) {
    super(n, xmin, xmax);
    let delta = (xmax - xmin) / n;
    let center = (xmax + xmin) / 2;
    let x;
    for (let i = 0; i < n; i++) {
      x = xmin + i * delta;
      this.values[i] = this.k * (x - center) * (x - center) + this.offset;
    }
  }

}
