/*
 * @author Charles Xie
 */

import {Potential1D} from "./Potential1D";

export class MorseWell extends Potential1D {

  private d: number = 2;
  private alpha: number = 1;
  private depth: number = -1;

  constructor(n: number, xmin: number, xmax: number) {
    super(n, xmin, xmax);
    let delta = (xmax - xmin) / n;
    let center = (xmax + xmin) / 2;
    let x, y;
    for (let i = 0; i < n; i++) {
      x = xmin + i * delta;
      y = 1 - Math.exp(-this.alpha * (x - center));
      this.values[i] = this.d * y * y + this.depth;
    }
  }

  public getName(): string {
    return "Morse Well";
  }

}
