/*
 * @author Charles Xie
 */

import {Constants} from "../Constants";

export abstract class Potential1D {

  static readonly VMAX: number = 10;

  protected xmin: number = -Potential1D.VMAX;
  protected xmax: number = Potential1D.VMAX;
  protected values: number[];

  constructor(n: number, xmin: number, xmax: number) {
    this.values = new Array(n);
    this.values.fill(0);
    this.xmin = xmin;
    this.xmax = xmax;
  }

  public getValues(): number[] {
    return this.values;
  }

  public getValue(i: number): number {
    return this.values[i];
  }

  public getPoints(): number {
    return this.values.length;
  }

  public getVmin(): number {
    return Math.max(-Potential1D.VMAX, Math.min(...this.values));
  }

  public getVmax(): number {
    return Math.min(Potential1D.VMAX, Math.max(...this.values));
  }

  public getXmin(): number {
    return this.xmin;
  }

  public getXmax(): number {
    return this.xmax;
  }

  public getXLength(): number {
    return this.xmax - this.xmin;
  }

  /* Cut off the potential function to avoid numeric instability due to large potential value. */
  static truncatePotential(v: number): number {
    if (v > Potential1D.VMAX) {
      v = Potential1D.VMAX;
    } else if (v < -Potential1D.VMAX) {
      v = -Potential1D.VMAX;
    }
    return v * Constants.ENERGY_UNIT_CONVERTER;
  }

}
