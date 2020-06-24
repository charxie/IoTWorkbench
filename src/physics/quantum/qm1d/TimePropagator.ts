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

  nPoints: number;
  delta: number = 0;
  coordinates: number[];
  amplitude: number[];
  iStep: number = 0;
  timeStep: number = 0.01;
  potential: Potential1D;
  particle: Particle;
  eField: ElectricField1D;
  boundary: Boundary;

  // expectations of properties
  totE: number = 0;
  potE: number = 0;
  kinE: number = 0;
  position: number = 0;
  momentum: number = 0;

  // parameters for the initial state
  mu: number = 0;
  sigma: number = 2;
  initialState: number = -1;
  initialStateVector: number[];

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
    if (this.eField) {
      let ef = this.particle.getCharge() * this.eField.getValue(this.getTime());
      let p: number[] = new Array(this.nPoints);
      for (let i = 0; i < this.nPoints; i++) {
        p[i] = this.potential.getValue(i) + ef * (i - this.nPoints / 2);
      }
      return p;
    }
    return this.potential.getValues();
  }

  /* Discretize the Hamiltonian into a matrix using the finite-difference method. */
  abstract generateHamiltonianMatrix(): void;

  setElectricField(eField: ElectricField1D): void {
    this.eField = eField;
  }

  getElectricField(): ElectricField1D {
    return this.eField;
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

  getFemtoseconds(): number {
    return this.getTime() * 24.19 * 0.001;
  }

  abstract setInitialWaveFunction(waveFunction: number[]): void;

  setInitialState(initialState: number): void {
    this.initialState = initialState;
  }

  getInitialState(): number {
    return this.initialState;
  }

  abstract setInitialMomentum(momentum: number): void;

  abstract setInitialMomentumOnly(momentum: number): void;

  abstract getInitialMomentum(): number;

  setInitialWavepacketPosition(mu: number): void {
    this.mu = mu;
    if (this.initialState >= 0) this.initWavepacket();
  }

  setInitialWavepacketPositionOnly(mu: number): void {
    this.mu = mu;
  }

  getInitialWavepacketPosition(): number {
    return this.mu;
  }

  setInitialWavepacketWidth(sigma: number): void {
    this.sigma = sigma;
    if (this.initialState >= 0) this.initWavepacket();
  }

  setInitialWavepacketWidthOnly(sigma: number): void {
    this.sigma = sigma;
  }

  getInitialWavepacketWidth(): number {
    return this.sigma;
  }

  abstract initWavepacket(): void;

  abstract normalizeWavefunction(): void;

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
    this.initWavepacket();
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
