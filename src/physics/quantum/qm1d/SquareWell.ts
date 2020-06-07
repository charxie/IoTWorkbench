/*
 * @author Charles Xie
 */

import {Potential1D} from "./Potential1D";

export class SquareWell extends Potential1D {

  private center: number = 0;
  private width: number = 10;

  constructor(n: number, depth: number, height: number, xmin: number, xmax: number) {
    super(n, xmin, xmax);
    let delta = (xmax - xmin) / n;
    let x;
    let w = 0.5 * this.width;
    for (let i = 0; i < n; i++) {
      x = xmin + i * delta;
      if (x < this.center - w) {
        this.value[i] = height;
      } else if (x > this.center + w) {
        this.value[i] = height;
      } else {
        this.value[i] = depth;
      }
    }
  }

  public getName(): string {
    return "Square Well";
  }

}
