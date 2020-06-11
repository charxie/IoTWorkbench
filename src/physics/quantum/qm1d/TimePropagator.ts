/*
 * @author Charles Xie
 */

import {Constants} from "../Constants";
import {Potential1D} from "./Potential1D";
import {Particle} from "../Particle";
import {ElectricField1D} from "./ElectricField1D";
import {Boundary} from "./Boundary";
import {AbsorbingBoundary} from "./AbsorbingBoundary";
import {SquareWell} from "./potentials/SquareWell";

export abstract class TimePropagator {

  static readonly VMAX: number = 5;

  nPoints: number;
  coordinates: number[];
  savedEigenvector: number[];
  amplitude: number[];
  iStep: number = 0;
  timeStep: number = 0.01;
  potential: Potential1D;
  particle: Particle;
  eField: ElectricField1D;
  boundary: Boundary;
  sum: number = 0;
  totE: number = 0;
  potE: number = 0;
  kinE: number = 0;
  position: number = 0;
  momentum: number = 0;
  mu: number = 5;
  sigma: number = 2;
  delta: number = 0;
  initialState: number = -1;

  constructor() {
    this.potential = new SquareWell(this.nPoints, 0, 0, -10, 10);
  }

  setBoundaryCondition(name: string): void {
    if ("ABC" === name) {
      this.boundary = new AbsorbingBoundary();
    } else {
      this.boundary = null;
    }
  }

  heat(ratio: number): void {
  }

  setPotential(potential: Potential1D): void {
    this.potential = potential;
    this.generateHamiltonianMatrix();
  }

  getPotential(): number[] {
    if (this.eField != null) {
      let ef = this.particle.getCharge() * this.eField.getValue(this.getTime());
      let p: number[] = new Array(this.nPoints);
      for (let i = 0; i < this.nPoints; i++) {
        p[i] = this.potential.getValue(i) + ef * (i - this.nPoints / 2);
      }
      return p;
    }
    return this.potential.getValues();
  }

  /* Clamp the potential function to avoid numeric instability due to large potential value. */
  clampPotential(v: number): number {
    if (v > TimePropagator.VMAX) {
      v = TimePropagator.VMAX;
    } else if (v < -TimePropagator.VMAX) {
      v = -TimePropagator.VMAX;
    }
    return v * Constants.ENERGY_UNIT_CONVERTER;
  }

  /* Discretize the Hamiltonian into a matrix using the finite-difference method. */
  abstract generateHamiltonianMatrix(): void;

  setElectricField(eField: ElectricField1D): void {
    this.eField = eField;
  }

  setTimeStep(timestep: number): void {
    this.timeStep = timestep;
  }

  getTimeStep(): number {
    return this.timeStep;
  }

  getTime(): number {
    return this.iStep * this.timeStep;
  }

  abstract setInitialState(initialState: number, eigenVectors: number[][]): void;

  getInitialState(): number {
    return this.initialState;
  }

  setInitialMomentum(p0: number): void {
  }

  setGaussianMu(mu: number): void {
    this.initialState = -1;
    this.mu = mu;
    this.initPsi();
  }

  setGaussianSigma(sigma: number): void {
    this.initialState = -1;
    this.sigma = sigma;
    this.initPsi();
  }

  setGaussianParameters(mu: number, sigma: number): void {
    this.initialState = -1;
    this.mu = mu;
    this.sigma = sigma;
    this.initPsi();
  }

  abstract initPsi(): void;

  abstract normalizePsi(): void;

  abstract getAmplitude(): number[];

  getPosition(): number {
    return this.position;
  }

  getMomentum(): number {
    return this.momentum;
  }

  getKineticEnergy(): number {
    return this.kinE;
  }

  getPotentialEnergy(): number {
    return this.potE;
  }

  init(): void {
    this.initPsi();
    this.position = this.calculateExpectation(this.coordinates);
    this.calculateMomentum();
    this.calculateKineticEnergy();
    if (this.potential) this.potE = this.calculateExpectation(this.potential.getValues());
    this.totE = this.kinE + this.potE;
  }

  reset(): void {
    this.iStep = 0;
    this.init();
  }

  abstract nextStep(): void;

  abstract calculateMomentum(): void;

  abstract calculateKineticEnergy(): void;

  abstract calculateExpectation(prop: number[]): number;

  abstract computeProperties(): void;

}
