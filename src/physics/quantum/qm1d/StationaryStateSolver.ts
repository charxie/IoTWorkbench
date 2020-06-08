/*
 * @author Charles Xie
 */

import {math} from "../../../Main";
import {Particle} from "../Particle";
import {Constants} from "../Constants";

export class StationaryStateSolver {

  private particle: Particle;
  private eigenValues: number[];
  private eigenVectors: number[][];
  private v: number[];  // the potential energy as a function of coordinate V(x)
  private h: number[][]; // the Hamilitonian

  constructor(n: number) {
    this.particle = new Particle();
    this.v = new Array(n);
    this.h = new Array(n)
    this.eigenValues = new Array(n);
    this.eigenVectors = new Array(n);
    for (let i = 0; i < n; i++) {
      this.h[i] = new Array(n);
      this.h[i].fill(0);
      this.eigenVectors[i] = new Array(n);
    }
  }

  public setPotential(v: number[]): void {
    this.v = [...v];
  }

  public getEigenVectors(): number[][] {
    return this.eigenVectors;
  }

  public getEigenValues(): number[] {
    return this.eigenValues;
  }

  /* The Schroedinger equation is approximated as a tridiagonal matrix equation using the finite difference method.
     The second-order derivative is approximated using the central difference approximation: f''=[f(x+d)-2f(x)+f(x-d)]/d^2 */
  public discretizeHamiltonian(length: number): void {
    let n = this.v.length;
    let delta = n / length;
    let a = 0.5 * delta * delta / (this.particle.getMass() * Constants.MASS_UNIT_CONVERTER);
    for (let i = 0; i < n; i++) {
      this.h[i][i] = 2 * a + this.v[i] * Constants.ENERGY_UNIT_CONVERTER;
      if (i > 0) {
        this.h[i][i - 1] = -a;
      }
      if (i < n - 1) {
        this.h[i][i + 1] = -a;
      }
    }
  }

  public solve(): void {
    const solver = math.eigs(this.h); // returns {values: [E1,E2...sorted], vectors: [v1,v2.... corresponding vectors as columns]}
    this.eigenValues = solver.values;
    this.eigenVectors = solver.vectors;
  }

}
