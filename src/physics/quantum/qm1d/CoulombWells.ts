/*
 * @author Charles Xie
 */

import {Potential1D} from "./Potential1D";

export class CoulombWells extends Potential1D {

  static readonly DEFAULT = -1;
  static readonly VACANCY = 0;
  static readonly INTERSTITIAL = 1;
  static readonly BINARY_LATTICE = 2;

  private k: number = 0.1;
  private offset: number = -1;

  constructor(n: number, ionCount: number, latticeConstant: number, field: number, type: number, xmin: number, xmax: number) {
    super(n, xmin, xmax);
    const delta = (xmax - xmin) / n;
    const center = (xmax + xmin) / 2;
    const location = new Array(ionCount);
    for (let i = 0; i < ionCount; i++) {
      if (ionCount % 2 === 0) {
        location[i] = center + (i - ionCount / 2 + 0.5) * latticeConstant;
      } else {
        location[i] = center + (i - Math.floor(ionCount / 2)) * latticeConstant;
      }
    }
    let x;
    let defectIndex = ionCount < 3 ? 0 : 1 + Math.round(Math.random() * (ionCount - 2));
    for (let i = 0; i < n; i++) {
      x = xmin + i * delta;
      switch (type) {
        case CoulombWells.DEFAULT:
          for (let j = 0; j < location.length; j++) {
            if (x != location[j]) {
              this.values[i] += field * x - this.k / Math.abs(x - location[j]);
            } else {
              this.values[i] -= 1000;
            }
          }
          break;
        case CoulombWells.BINARY_LATTICE:
          for (let j = 0; j < location.length; j++) {
            if (x != location[j]) {
              this.values[i] += field * x - (0.5 + (j % 2) * 2) * this.k / Math.abs(x - location[j]);
            } else {
              this.values[i] -= 1000;
            }
          }
          break;
        case CoulombWells.VACANCY:
          for (let j = 0; j < location.length; j++) {
            if (j == defectIndex)
              continue;
            if (x != location[j]) {
              this.values[i] += field * x - this.k / Math.abs(x - location[j]);
            } else {
              this.values[i] -= 1000;
            }
          }
          break;
        case CoulombWells.INTERSTITIAL:
          for (let j = 0; j < location.length; j++) {
            if (x != location[j]) {
              this.values[i] += field * x - this.k / Math.abs(x - location[j]);
            } else {
              this.values[i] -= 1000;
            }
          }
          if (x != location[defectIndex] + latticeConstant * 0.5) {
            this.values[i] += field * x - this.k / Math.abs(x - (location[defectIndex] + latticeConstant * 0.5));
          } else {
            this.values[i] -= 1000;
          }
          break;
      }
      if (this.values[i] < this.offset)
        this.values[i] = this.offset;
    }
  }

}
