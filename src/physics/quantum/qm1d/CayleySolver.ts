/*
 * This is a fast and stable (norm-preserving) solver based on Cayley's form.
 * @author Charles Xie
 */

import {RealTimePropagator} from "./RealTimePropagator";
import {MyComplex} from "../../../math/MyComplex";
import {Tdma} from "../../../math/Tdma";

export class CayleySolver extends RealTimePropagator {

  private a: MyComplex[];
  private b: MyComplex[];
  private c: MyComplex[];
  private d: MyComplex[];

  constructor(nPoints: number) {
    super(nPoints);
    this.a = new Array(nPoints);
    this.b = new Array(nPoints);
    this.c = new Array(nPoints);
    this.d = new Array(nPoints);
    this.a[0] = new MyComplex(0, 0);
    this.c[nPoints - 1] = new MyComplex(0, 0);
  }

  nextStep(): void {

    super.nextStep();

    for (let i = 0; i < this.nPoints; i++) {

      // compute the rhs vector
      this.d[i] = this.psi[i].plus(this.hamiltonian[i][i].times(this.psi[i]));

      if (i > 0) {
        // compute the subdiagonal elements
        this.a[i] = this.hamiltonian[i - 1][i].negate();
        this.d[i] = this.d[i].plus(this.hamiltonian[i - 1][i].times(this.psi[i - 1]));
      }

      // compute the diagonal elements
      this.b[i] = new MyComplex(1, 0).minus(this.hamiltonian[i][i]);

      if (i < this.nPoints - 1) {
        // compute the superdiagonal elements
        this.c[i] = this.hamiltonian[i + 1][i].negate();
        this.d[i] = this.d[i].plus(this.hamiltonian[i + 1][i].times(this.psi[i + 1]));
      }

    }

    this.psi = Tdma.solveComplex(this.a, this.b, this.c, this.d);

    this.iStep++;
    this.computeProperties();

  }

}
