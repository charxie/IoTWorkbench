/*
 * @author Charles Xie
 */

import {RealTimePropagator} from "./RealTimePropagator";
import {MyComplex} from "../../../math/MyComplex";

export class RungeKuttaSolver extends RealTimePropagator {

  private static readonly HALF = new MyComplex(0.5, 0.0);
  private static readonly TWO = new MyComplex(2.0, 0.0);
  private static readonly ONE_SIXTH = new MyComplex(1.0 / 6.0, 0.0);

  private f1: MyComplex[];
  private f2: MyComplex[];
  private f3: MyComplex[];
  private f4: MyComplex[];
  private temp: MyComplex[];

  constructor(nPoints: number) {
    super(nPoints);
    this.f1 = new Array(this.nPoints);
    this.f2 = new Array(this.nPoints);
    this.f3 = new Array(this.nPoints);
    this.f4 = new Array(this.nPoints);
    this.temp = new Array(this.nPoints);
  }

  nextStep(): void {

    super.nextStep();

    let z: MyComplex;
    let z2: MyComplex;
    let z3: MyComplex;
    for (let i = 0; i < this.nPoints; i++) {
      this.f1[i] = new MyComplex(0, 0);
      for (let j = 0; j < this.nPoints; j++) {
        z = this.hamiltonian[i][j];
        if (z.absSquare() > 0) {
          z = z.times(this.psi[j]);
          this.f1[i] = this.f1[i].plus(z);
        }
      }
    }
    for (let i = 0; i < this.nPoints; i++) {
      z = RungeKuttaSolver.HALF.times(this.f1[i]);
      this.temp[i] = this.psi[i].plus(z);
    }

    for (let i = 0; i < this.nPoints; i++) {
      this.f2[i] = new MyComplex(0, 0);
      for (let j = 0; j < this.nPoints; j++) {
        z = this.hamiltonian[i][j];
        if (z.absSquare() > 0) {
          z = z.times(this.temp[j]);
          this.f2[i] = this.f2[i].plus(z);
        }
      }
    }
    for (let i = 0; i < this.nPoints; i++) {
      z = RungeKuttaSolver.HALF.times(this.f2[i]);
      this.temp[i] = this.psi[i].plus(z);
    }

    for (let i = 0; i < this.nPoints; i++) {
      this.f3[i] = new MyComplex(0, 0);
      for (let j = 0; j < this.nPoints; j++) {
        z = this.hamiltonian[i][j];
        if (z.absSquare() > 0) {
          z = z.times(this.temp[j]);
          this.f3[i] = this.f3[i].plus(z);
        }
      }
    }
    for (let i = 0; i < this.nPoints; i++) {
      this.temp[i] = this.psi[i].plus(this.f3[i]);
    }

    for (let i = 0; i < this.nPoints; i++) {
      this.f4[i] = new MyComplex(0, 0);
      for (let j = 0; j < this.nPoints; j++) {
        z = this.hamiltonian[i][j];
        if (z.absSquare() > 0) {
          z = z.times(this.temp[j]);
          this.f4[i] = this.f4[i].plus(z);
        }
      }
    }

    for (let i = 0; i < this.nPoints; i++) {
      z2 = RungeKuttaSolver.TWO.times(this.f2[i]);
      z3 = RungeKuttaSolver.TWO.times(this.f3[i]);
      z = z2.plus(z3);
      z2 = z.plus(this.f1[i]);
      z3 = z2.plus(this.f4[i]);
      z = RungeKuttaSolver.ONE_SIXTH.times(z3);
      this.psi[i] = this.psi[i].plus(z);
    }

    this.iStep++;
    this.computeProperties();

  }

}
