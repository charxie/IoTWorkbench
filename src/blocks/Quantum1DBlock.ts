/*
 * @author Charles Xie
 */

import {Potential1D} from "../physics/quantum/qm1d/Potential1D";
import {Block} from "./Block";
import {Rectangle} from "../math/Rectangle";
import {StationaryStateSolver} from "../physics/quantum/qm1d/StationaryStateSolver";
import {Port} from "./Port";
import {SquareWell} from "../physics/quantum/qm1d/potentials/SquareWell";
import {CoulombWell} from "../physics/quantum/qm1d/potentials/CoulombWell";
import {MorseWell} from "../physics/quantum/qm1d/potentials/MorseWell";
import {HarmonicOscillator} from "../physics/quantum/qm1d/potentials/HarmonicOscillator";
import {AnharmonicOscillator} from "../physics/quantum/qm1d/potentials/AnharmonicOscillator";
import {CoulombWells} from "../physics/quantum/qm1d/potentials/CoulombWells";

export abstract class Quantum1DBlock extends Block {

  protected potentialName: string = "Custom";
  protected nPoints: number = 100;
  protected potential: Potential1D;
  protected energyLevels: number[];
  protected waveFunctions: number[][];
  protected staticSolver: StationaryStateSolver;
  wavepacketColor: string = "#eeeeee";

  portVX: Port; // port for importing potential's values (array)
  portX0: Port; // port for importing potential's beginning coordinate
  portDX: Port; // port for importing potential's coordinate increment
  viewWindowColor: string = "white";
  viewWindow: Rectangle;
  barHeight: number;
  readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };

  destroy() {
  }

  setPotentialName(potentialName: string): void {
    this.potentialName = potentialName;
    this.staticSolve(potentialName);
  }

  getPotentialName(): string {
    return this.potentialName;
  }

  setNpoints(nPoints: number): void {
    if (this.nPoints !== nPoints) {
      if (this.portVX.getValue() === undefined) this.staticSolver = new StationaryStateSolver(nPoints);
      this.nPoints = nPoints;
    }
  }

  getNPoints(): number {
    return this.nPoints;
  }

  setWavepacketColor(wavepacketColor: string): void {
    this.wavepacketColor = wavepacketColor;
  }

  getWavepacketColor(): string {
    return this.wavepacketColor;
  }

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
  }

  staticSolve(name: string): void {
    if (name === "Custom") return;
    switch (name) {
      case "Square Well":
        this.potential = new SquareWell(this.nPoints, -1, 1, -10, 10);
        break;
      case "Coulomb Well":
        this.potential = new CoulombWell(this.nPoints, -10, 10);
        break;
      case "Morse Well":
        this.potential = new MorseWell(this.nPoints, -10, 10);
        break;
      case "Harmonic Oscillator":
        this.potential = new HarmonicOscillator(this.nPoints, -10, 10);
        break;
      case "Anharmonic Oscillator":
        this.potential = new AnharmonicOscillator(this.nPoints, -10, 10);
        break;
      case "Diatomic Molecule":
        this.potential = new CoulombWells(this.nPoints, 2, 1, 0, CoulombWells.DEFAULT, -10, 10);
        break;
      case "Crystal Lattice":
        this.potential = new CoulombWells(this.nPoints, 13, 1.4, 0, CoulombWells.DEFAULT, -10, 10);
        break;
      case "Crystal Lattice in a Field":
        this.potential = new CoulombWells(this.nPoints, 11, 1.5, 0.002, CoulombWells.DEFAULT, -10, 10);
        break;
      case "Crystal Lattice with a Vacancy":
        this.potential = new CoulombWells(this.nPoints, 11, 1.5, 0, CoulombWells.VACANCY, -10, 10);
        break;
      case "Crystal Lattice with an Interstitial":
        this.potential = new CoulombWells(this.nPoints, 11, 1.5, 0, CoulombWells.INTERSTITIAL, -10, 10);
        break;
      default:
        this.potential = new SquareWell(this.nPoints, 0, 0, -10, 10);
    }
    if (this.staticSolver === undefined || this.staticSolver.getPoints() !== this.nPoints) this.staticSolver = new StationaryStateSolver(this.nPoints);
    this.staticSolver.setPotential(this.potential.getValues());
    this.staticSolver.discretizeHamiltonian(this.potential.getXLength());
    this.staticSolver.solve();
    this.energyLevels = this.staticSolver.getEigenValues();
    this.waveFunctions = this.staticSolver.getEigenVectors();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

}
