/*
 * @author Charles Xie
 */

import {Constants} from "../Constants";
import {Potential1D} from "./Potential1D";
import {Particle} from "../Particle";
import {ElectricField1D} from "./ElectricField1D";
import {Boundary} from "./Boundary";
import {AbsorbingBoundary} from "./AbsorbingBoundary";

export abstract class TimePropagator {

  static readonly VMAX: number = 5;

  static readonly OUTPUT_INTERVAL: number = 50;

  n: number;
  coordinate: number[];
  savedEigenvector: number[];
  amplitude: number[];
  iStep: number;
  timeStep: number = 0.01;
  potential: Potential1D;
  particle: Particle;
  eField: ElectricField1D;
  boundary: Boundary;
  sum: number;
  totE: number;
  potE: number;
  kinE: number;
  position: number;
  momentum: number;
  running: boolean;
  notifyReset: boolean;
  mu: number = 10;
  sigma: number = 10;
  delta: number;
  initState: number = -1;

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
      let p: number[] = new Array(this.n);
      for (let i = 0; i < this.n; i++) {
        p[i] = this.potential.getValue(i) + ef * (i - this.n / 2);
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

  abstract setInitialState(initState: number, eigenVectors: number[][]): void;

  getInitialState(): number {
    return this.initState;
  }

  setInitialMomentum(p0: number): void {
  }

  setGaussianMu(mu: number): void {
    this.initState = -1;
    this.mu = mu;
    this.initPsi();
  }

  setGaussianSigma(sigma: number): void {
    this.initState = -1;
    this.sigma = sigma;
    this.initPsi();
  }

  setGaussianParameters(mu: number, sigma: number): void {
    this.initState = -1;
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
    this.position = this.calculateExpectation(this.coordinate);
    this.calculateMomentum();
    this.calculateKineticEnergy();
    if (this.potential) this.potE = this.calculateExpectation(this.potential.getValues());
    this.totE = this.kinE + this.potE;
  }

  stop(): void {
    this.running = false;
  }

  run(): void {
    if (!this.running) {
      this.running = true;
      while (this.running)
        this.nextStep();
      if (this.notifyReset) {
        this.init();
        this.notifyReset = false;
      }
    }
  }

  reset(): void {
    this.iStep = 0;
    if (this.running) {
      this.stop();
      this.notifyReset = true;
    } else {
      this.init();
    }
  }

  abstract nextStep(): void;

  abstract calculateMomentum(): void;

  abstract calculateKineticEnergy(): void;

  abstract calculateExpectation(prop: number[]): number;

  abstract outputProperties(): void;

}
