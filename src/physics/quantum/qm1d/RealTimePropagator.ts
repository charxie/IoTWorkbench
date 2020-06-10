/*
 * @author Charles Xie
 */

import {MyComplex} from "../../../math/MyComplex";
import {Particle} from "../Particle";
import {TimePropagator} from "./TimePropagator";
import {Constants} from "../Constants";
import {AbsorbingBoundary} from "./AbsorbingBoundary";

export abstract class RealTimePropagator extends TimePropagator {

  hamiltonian: MyComplex[][];
  psi: MyComplex[];

  private p0: number;

  // Schrodinger-Langevin-Kostin dissipation
  private slkFriction: number;
  private phase: number[];
  private foldedPhase: number[];

  constructor(particle: Particle, dimension: number) {
    super();
    this.nPoints = dimension;
    this.hamiltonian = new Array(this.nPoints);
    for (let i = 0; i < this.nPoints; i++) {
      this.hamiltonian[i] = new Array(this.nPoints);
    }
    this.amplitude = new Array(this.nPoints);
    this.psi = new Array(this.nPoints);
    this.coordinates = new Array(this.nPoints);
    for (let i = 0; i < this.nPoints; i++) this.coordinates[i] = i;
    this.particle = particle;
  }

  setSlkFriction(slkFriction: number): void {
    this.slkFriction = slkFriction;
    if (Math.abs(slkFriction) > 0) {
      if (this.phase == null) this.phase = new Array(this.nPoints);
      if (this.foldedPhase == null) this.foldedPhase = new Array(this.nPoints);
    }
  }

  heat(ratio: number): void {
    let k;
    for (let i = 0; i < this.nPoints; i++) {
      k = ratio * this.momentum * (this.potential.getXmin() + i * this.delta);
      this.psi[i] = this.psi[i].times(new MyComplex(Math.cos(k), Math.sin(k)));
    }
  }

  /*Ensure that the phase changes continuous, instead of being folded to [-pi, pi) by the atan(y, x) function.*/
  private calculatePhase(i: number): void {
    let newPhase = this.psi[i].arg();
    let phaseChange = newPhase - this.foldedPhase[i];
    if (phaseChange > Math.PI) {
      phaseChange -= 2 * Math.PI;
    } else if (phaseChange < -Math.PI) {
      phaseChange += 2 * Math.PI;
    }
    this.phase[i] += phaseChange;
    this.foldedPhase[i] = newPhase;
  }

  /* Discretize the Hamiltonian into a matrix using the finite-difference method. */
  generateHamiltonianMatrix(): void {
    let p = this.potential.getXLength();
    this.delta = p / this.nPoints;
    let a = 0.5 / (this.delta * this.delta * this.particle.getMass() * Constants.MASS_UNIT_CONVERTER);
    let ef = this.eField != null ? this.particle.getCharge() * this.eField.getValue(this.getTime()) : 0;
    let slk: boolean = Math.abs(this.slkFriction) > 0 && this.psi[0] != null;
    let ft = 0;
    if (slk) ft = this.calculateExpectation(this.phase);
    for (let i = 0; i < this.nPoints; i++) {
      p = 2 * a + this.clampPotential(this.potential.getValue(i));
      if (ef != 0) {
        p += ef * (i - this.nPoints / 2) * Constants.ENERGY_UNIT_CONVERTER;
      }
      if (slk) {
        this.calculatePhase(i);
        p += this.slkFriction * (this.phase[i] - ft) / (this.particle.getMass() * Constants.MASS_UNIT_CONVERTER);
      }
      if (this.boundary == null) {
        this.hamiltonian[i][i] = new MyComplex(0, -this.timeStep * p);
      } else if (this.boundary instanceof AbsorbingBoundary) {
        let lg = Math.round(this.boundary.getLengthPercentage() * this.nPoints);
        if (i < lg) {
          this.hamiltonian[i][i] = new MyComplex(-this.boundary.getAbsorption() * (lg - i), -this.timeStep);
        } else if (i > this.nPoints - lg) {
          this.hamiltonian[i][i] = new MyComplex(-this.boundary.getAbsorption() * (lg - this.nPoints + i), -this.timeStep * p);
        } else {
          this.hamiltonian[i][i] = new MyComplex(0, -this.timeStep * p);
        }
      }
      if (this.iStep < 1) {
        for (let j = i + 1; j < this.nPoints; j++) {
          this.hamiltonian[i][j] = this.hamiltonian[j][i] = new MyComplex(0, j == i + 1 ? this.timeStep * a : 0);
        }
      }
    }
  }

  setInitialState(initState: number, eigenVector: number[][]): void {
    this.initialState = initState;
    if (this.savedEigenvector == null)
      this.savedEigenvector = new Array(this.nPoints);
    for (let i = 0; i < this.nPoints; i++) {
      this.savedEigenvector[i] = eigenVector[initState][i];
      this.psi[i] = new MyComplex(this.savedEigenvector[i], 0);
    }
    this.initPsi();
  }

  getInitialState(): number {
    return this.initialState;
  }

  setInitialMomentum(p0: number): void {
    this.p0 = p0;
    this.initPsi();
  }

  initPsi(): void {
    if (this.initialState < 0) { // if no initial state is set, use a Gaussian
      let k, g;
      for (let i = 0; i < this.nPoints; i++) {
        k = this.potential.getXmin() + i * this.delta;
        g = Math.exp(-(k - this.mu) * (k - this.mu) / (this.sigma * this.sigma));
        k = this.p0 * k;
        this.psi[i] = new MyComplex(g * Math.cos(k), g * Math.sin(k));
      }
      this.normalizePsi();
    } else {
      if (this.savedEigenvector != null) {
        let k, g;
        for (let i = 0; i < this.nPoints; i++) {
          k = this.p0 * (this.potential.getXmin() + i * this.delta);
          g = this.savedEigenvector[i];
          this.psi[i] = new MyComplex(g * Math.cos(k), g * Math.sin(k));
        }
      }
    }
    for (let i = 0; i < this.nPoints; i++) {
      this.amplitude[i] = this.psi[i].absSquare();
    }
    if (Math.abs(this.slkFriction) > 0) {
      for (let i = 0; i < this.nPoints; i++) {
        this.phase[i] = this.psi[i].arg();
        this.foldedPhase[i] = this.phase[i];
      }
    }
  }

  normalizePsi(): void {
    this.sum = 0;
    for (let i = 0; i < this.nPoints; i++)
      this.sum += this.psi[i].absSquare();
    this.sum = 1.0 / Math.sqrt(this.sum);
    for (let i = 0; i < this.nPoints; i++)
      this.psi[i] = new MyComplex(this.psi[i].re * this.sum, this.psi[i].im * this.sum);
  }

  getAmplitude(): number[] {
    return this.amplitude;

  }

  nextStep(): void {
    this.generateHamiltonianMatrix();
  }

  calculateMomentum(): void {
    let m = new MyComplex(0, 0);
    let delta2 = this.delta * 2;
    // must use central difference, or we will have a non-zero imaginary component for momentum
    let z;
    for (let i = 1; i < this.nPoints - 1; i++) {
      z = new MyComplex((this.psi[i + 1].re - this.psi[i - 1].re) / delta2, (this.psi[i + 1].im - this.psi[i - 1].im) / delta2);
      m = m.plus(this.psi[i].conjugate().times(z));
    }
    this.momentum = m.im;
  }

  calculateKineticEnergy(): void {
    this.kinE = 0;
    let ke = new MyComplex(0, 0);
    let z;
    for (let i = 1; i < this.nPoints - 1; i++) {
      z = new MyComplex(this.psi[i + 1].re - 2 * this.psi[i].re + this.psi[i - 1].re, this.psi[i + 1].im - 2 * this.psi[i].im + this.psi[i - 1].im);
      ke = ke.plus(this.psi[i].conjugate().times(z));
    }
    let delta2 = -2 * this.particle.getMass() * this.delta * this.delta;
    this.kinE = ke.re / (delta2 * Constants.MASS_UNIT_CONVERTER * Constants.ENERGY_UNIT_CONVERTER);
  }

  calculateExpectation(prop: number[]): number {
    let result = 0;
    let z: MyComplex;
    for (let i = 0; i < this.nPoints; i++) {
      z = this.psi[i].conjugate().times(new MyComplex(prop[i] * this.psi[i].re, prop[i] * this.psi[i].im));
      result += z.re;
    }
    return result;
  }

  outputProperties(): void {
    this.sum = 0.0;
    for (let i = 0; i < this.nPoints; i++) {
      this.amplitude[i] = this.psi[i].absSquare();
      this.sum += this.amplitude[i];
    }
    this.position = this.calculateExpectation(this.coordinates);
    this.calculateMomentum();
    this.calculateKineticEnergy();
    this.potE = this.calculateExpectation(this.getPotential());
    this.totE = this.kinE + this.potE;
    if (this.iStep % 1000 == 0) {
      console.log(">>> %5.0f = %10.5f, %10.5f, %10.5f, %10.5f", this.getTime(), this.sum, this.totE, this.potE, this.kinE);
    }
  }

}
