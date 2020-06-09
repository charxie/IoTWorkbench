/*
 * @author Charles Xie
 */

import {Potential1D} from "../Potential1D";

export class CustomPotential extends Potential1D {

  constructor(xmin: number, xmax: number, values: number[]) {
    super(values.length, xmin, xmax);
    this.values = [...values];
  }

}
