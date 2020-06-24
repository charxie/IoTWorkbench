/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart} from "../Main";
import {Rectangle} from "../math/Rectangle";
import {StationaryStateSolver} from "../physics/quantum/qm1d/StationaryStateSolver";
import {CustomPotential} from "../physics/quantum/qm1d/potentials/CustomPotential";
import {Quantum1DBlock} from "./Quantum1DBlock";
import {RungeKuttaSolver} from "../physics/quantum/qm1d/RungeKuttaSolver";
import {CayleySolver} from "../physics/quantum/qm1d/CayleySolver";
import {SquareWell} from "../physics/quantum/qm1d/potentials/SquareWell";
import {ElectricField1D} from "../physics/quantum/qm1d/ElectricField1D";
import {RealTimePropagator} from "../physics/quantum/qm1d/RealTimePropagator";
import {MyComplex} from "../math/MyComplex";

export class QuantumDynamics1DBlock extends Quantum1DBlock {

  private portIN: Port;
  private portQB: Port; // Qubit output
  private waveFunction: MyComplex[];
  private stateProbabilities: number[];
  private statePhases: number[];
  private probabilityDensityFunction: number[];
  private dynamicSolver: RealTimePropagator;
  private method: string = "Cayley";
  private solverSteps: number = 10;
  private energyScale: number = 500;
  private showWaveFunction: boolean = false;
  private showProbabilityDensity: boolean = true;
  private showStateSpace: boolean = false;
  private stateSpaceWidth: number = 20;
  private electricFieldIntensityParameter: string;
  private electricFieldFrequencyParameter: string;

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly name: string;
    readonly wavepacketColor: string;
    readonly viewWindowColor: string;
    readonly maxState: number;
    readonly nPoints: number;
    readonly timeStep: number;
    readonly initialState: number;
    readonly initialWavepacketWidth: number;
    readonly initialWavepacketPosition: number;
    readonly initialMomentum: number;
    readonly potentialName: string;
    readonly method: string;
    readonly solverSteps: number;
    readonly energyScale: number;
    readonly dampingFactor: number;
    readonly electricFieldIntensity: number;
    readonly electricFieldFrequency: number;
    readonly electricFieldIntensityParameter: string;
    readonly electricFieldFrequencyParameter: string;
    readonly showWaveFunction: boolean;
    readonly showProbabilityDensity: boolean;
    readonly showStateSpace: boolean;

    constructor(block: QuantumDynamics1DBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.name = block.name;
      this.wavepacketColor = block.wavepacketColor;
      this.viewWindowColor = block.viewWindowColor;
      this.maxState = block.maxState;
      this.nPoints = block.nPoints;
      this.timeStep = block.getTimeStep();
      this.initialState = block.getInitialState();
      this.initialWavepacketWidth = block.getInitialWavepacketWidth();
      this.initialWavepacketPosition = block.getInitialWavepacketPosition();
      this.initialMomentum = block.getInitialMomentum();
      this.potentialName = block.potentialName;
      this.method = block.method;
      this.solverSteps = block.solverSteps;
      this.energyScale = block.energyScale;
      this.dampingFactor = block.getDampingFactor();
      if (block.getElectricField()) {
        this.electricFieldIntensity = block.getElectricField().getIntensity();
        this.electricFieldFrequency = block.getElectricField().getFrequency();
      }
      this.electricFieldIntensityParameter = block.electricFieldIntensityParameter;
      this.electricFieldFrequencyParameter = block.electricFieldFrequencyParameter;
      this.showWaveFunction = block.showWaveFunction;
      this.showProbabilityDensity = block.showProbabilityDensity;
      this.showStateSpace = block.showStateSpace;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "QD1D";
    this.name = "Quantum Dynamics 1D Block";
    this.color = "#CCFCFA";
    this.baseLineOffet = 50;
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 5;
    this.portIN = new Port(this, true, "IN", 0, this.barHeight + dh, false);
    this.portVX = new Port(this, true, "VX", 0, this.barHeight + 2 * dh, false);
    this.portX0 = new Port(this, true, "X0", 0, this.barHeight + 3 * dh, false);
    this.portDX = new Port(this, true, "DX", 0, this.barHeight + 4 * dh, false);
    this.ports.push(this.portIN);
    this.ports.push(this.portVX);
    this.ports.push(this.portX0);
    this.ports.push(this.portDX);
    this.portQB = new Port(this, false, "QB", this.width, (this.barHeight + this.height) / 2, true);
    this.ports.push(this.portQB);
    this.marginX = 30;
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.potential = new SquareWell(this.nPoints, 0, 0, -10, 10);
    this.setMethod("Cayley");
  }

  getCopy(): Block {
    let copy = new QuantumDynamics1DBlock("Quantum Dynamics 1D Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    copy.setWavepacketColor(this.wavepacketColor);
    copy.setViewWindowColor(this.viewWindowColor);
    copy.setName(this.name);
    copy.setNpoints(this.nPoints);
    copy.setTimeStep(this.getTimeStep());
    copy.setMaxState(this.maxState);
    copy.setInitialState(this.getInitialState());
    copy.setInitialWavepacketWidth(this.getInitialWavepacketWidth());
    copy.setInitialWavepacketPosition(this.getInitialWavepacketPosition());
    copy.setInitialMomentum(this.getInitialMomentum());
    copy.setPotentialName(this.potentialName);
    copy.setMethod(this.method);
    copy.setSolverSteps(this.solverSteps);
    copy.setEnergyScale(this.energyScale);
    copy.setDampingFactor(this.getDampingFactor());
    if (this.getElectricField()) copy.setElectricField(this.getElectricField().copy());
    copy.setShowWaveFunction(this.showWaveFunction);
    copy.setShowProbabilityDensity(this.showProbabilityDensity);
    copy.setShowStateSpace(this.showStateSpace);
    copy.setElectricFieldIntensityParameter(this.electricFieldIntensityParameter);
    copy.setElectricFieldFrequencyParameter(this.electricFieldFrequencyParameter);
    return copy;
  }

  reset(): void {
    super.reset();
    this.dynamicSolver.reset();
    this.computeStateProbabilities();
    this.updateOutput();
  }

  initWavepacket(): void {
    this.dynamicSolver.initWavepacket();
  }

  public setMethod(method: string): void {
    if (this.method === method && this.dynamicSolver !== undefined) return;
    this.method = method;
    // save solver parameters before switching
    let timeStep;
    let initialState;
    let initialMomentum;
    let initialWavepacketPosition;
    let initialWavepacketWidth;
    let electricField;
    let dampingFactor;
    if (this.dynamicSolver !== undefined) {
      timeStep = this.getTimeStep();
      initialState = this.getInitialState();
      initialMomentum = this.getInitialMomentum();
      initialWavepacketPosition = this.getInitialWavepacketPosition();
      initialWavepacketWidth = this.getInitialWavepacketWidth();
      dampingFactor = this.getDampingFactor();
      electricField = this.getElectricField() ? this.getElectricField().copy() : undefined;
    } else {
      timeStep = 0.2;
      initialState = -1;
      initialMomentum = 0;
      initialWavepacketPosition = 0;
      initialWavepacketWidth = 2;
      dampingFactor = 0;
      electricField = undefined;
    }
    switch (method) {
      case "Runge-Kutta":
        this.dynamicSolver = new RungeKuttaSolver(this.nPoints);
        break;
      default:
        this.dynamicSolver = new CayleySolver(this.nPoints);
    }
    this.setTimeStep(timeStep);
    this.setInitialState(initialState);
    this.dynamicSolver.setInitialMomentumOnly(initialMomentum);
    this.dynamicSolver.setInitialWavepacketPositionOnly(initialWavepacketPosition);
    this.dynamicSolver.setInitialWavepacketWidthOnly(initialWavepacketWidth);
    this.dynamicSolver.setElectricField(electricField);
    this.dynamicSolver.setPotential(this.potential);
    this.setDampingFactor(dampingFactor);
    this.dynamicSolver.initWavepacket();
    this.probabilityDensityFunction = this.dynamicSolver.getAmplitude();
    this.waveFunction = this.dynamicSolver.getWaveFunction();
  }

  public getMethod(): string {
    return this.method;
  }

  public setShowWaveFunction(showWaveFunction: boolean): void {
    this.showWaveFunction = showWaveFunction;
  }

  public getShowWaveFunction(): boolean {
    return this.showWaveFunction;
  }

  public setShowProbabilityDensity(showProbabilityDensity: boolean): void {
    this.showProbabilityDensity = showProbabilityDensity;
  }

  public getShowProbabilityDensity(): boolean {
    return this.showProbabilityDensity;
  }

  public setShowStateSpace(showStateSpace: boolean): void {
    this.showStateSpace = showStateSpace;
  }

  public getShowStateSpace(): boolean {
    return this.showStateSpace;
  }

  public setSolverSteps(solverSteps: number): void {
    this.solverSteps = solverSteps;
  }

  public getSolverSteps(): number {
    return this.solverSteps;
  }

  public setEnergyScale(energyScale: number): void {
    this.energyScale = energyScale;
  }

  public getEnergyScale(): number {
    return this.energyScale;
  }

  public setTimeStep(timeStep: number): void {
    this.dynamicSolver.setTimeStep(timeStep);
  }

  public getTimeStep(): number {
    return this.dynamicSolver.getTimeStep();
  }

  public setInitialState(initialState: number): void {
    this.dynamicSolver.setInitialState(initialState);
  }

  setInitialWaveFunction(): void {
    if (this.waveFunctions === undefined || this.getInitialState() < 0) return;
    let wfun = new Array(this.energyLevels.length);
    for (let i = 0; i < wfun.length; i++) {
      wfun[i] = this.waveFunctions[i][this.getInitialState()];
    }
    this.dynamicSolver.setInitialWaveFunction(wfun);
  }

  public getInitialState(): number {
    return this.dynamicSolver.getInitialState();
  }

  setInitialMomentum(momentum: number): void {
    this.dynamicSolver.setInitialMomentum(momentum);
  }

  getInitialMomentum(): number {
    return this.dynamicSolver.getInitialMomentum();
  }

  setInitialWavepacketWidth(sigma: number): void {
    this.dynamicSolver.setInitialWavepacketWidth(sigma);
  }

  getInitialWavepacketWidth(): number {
    return this.dynamicSolver.getInitialWavepacketWidth();
  }

  setInitialWavepacketPosition(mu: number): void {
    this.dynamicSolver.setInitialWavepacketPosition(mu);
  }

  getInitialWavepacketPosition(): number {
    return this.dynamicSolver.getInitialWavepacketPosition();
  }

  public setDampingFactor(dampingFactor: number): void {
    this.dynamicSolver.setDampingFactor(dampingFactor);
  }

  public getDampingFactor(): number {
    return this.dynamicSolver.getDampingFactor();
  }

  setElectricField(eField: ElectricField1D): void {
    this.dynamicSolver.setElectricField(eField);
  }

  getElectricField(): ElectricField1D {
    return this.dynamicSolver.getElectricField();
  }

  setElectricFieldIntensityParameter(p: string): void {
    this.electricFieldIntensityParameter = p;
  }

  getElectricFieldIntensityParameter(): string {
    return this.electricFieldIntensityParameter;
  }

  updateElectricFieldIntensity(): void {
    if (this.electricFieldIntensityParameter) {
      let value = flowchart.globalVariables[this.electricFieldIntensityParameter];
      if (value !== undefined) {
        if (value <= 0) {
          this.setElectricField(undefined);
        } else {
          let eField = this.getElectricField();
          if (eField) {
            eField.setIntensity(value);
          } else {
            let ef = new ElectricField1D();
            ef.setIntensity(value);
            this.setElectricField(ef);
          }
        }
      }
    }
  }

  setElectricFieldFrequencyParameter(p: string): void {
    this.electricFieldFrequencyParameter = p;
  }

  getElectricFieldFrequencyParameter(): string {
    return this.electricFieldFrequencyParameter;
  }

  updateElectricFieldFrequency(): void {
    if (this.electricFieldFrequencyParameter) {
      let value = flowchart.globalVariables[this.electricFieldFrequencyParameter];
      if (value !== undefined) {
        let eField = this.getElectricField();
        if (eField) {
          eField.setFrequency(value);
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.2 : 0.1, Util.adjust(this.color, -20));
        shade.addColorStop(1, Util.adjust(this.color, -100));
        ctx.fillStyle = shade;
        break;
      case "Plain":
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the space
    ctx.fillStyle = "#FEEFED";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.viewWindow.x = this.x + this.viewMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.viewWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (this.iconic) {
      let xc = this.viewWindow.x + this.viewWindow.width / 2;
      let yc = this.viewWindow.y + this.viewWindow.height - 5;
      ctx.beginPath();
      ctx.moveTo(xc - 10, yc);
      ctx.lineTo(xc + 10, yc);
      ctx.stroke();
      ctx.beginPath();
      let g;
      for (let i = -10; i < 10; i += 2) {
        g = 0.5 * this.viewWindow.height * Math.exp(-i * i / 10);
        if (i === -10) {
          ctx.moveTo(xc + i, yc - g);
        } else {
          ctx.lineTo(xc + i, yc - g);
        }
      }
      ctx.stroke();
    } else {
      if (this.potential !== undefined) {
        if (this.showProbabilityDensity) this.drawProbabilityDensityFunction(ctx);
        if (this.showWaveFunction) this.drawWaveFunction(ctx);
        this.drawPotential(ctx);
        this.drawElectricField(ctx);
        this.drawAxes(ctx);
        this.drawClock(ctx);
        this.drawResults(ctx);
        if (this.showStateSpace) this.drawStateSpace(ctx);
      }
      this.drawAxisLabels(ctx);
    }

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  private drawClock(ctx: CanvasRenderingContext2D): void {
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    let time = Math.round(this.dynamicSolver.getTime() * 24.19 * 0.001) + " fs 🕑";
    ctx.fillText(time, this.viewWindow.x + this.viewWindow.width - ctx.measureText(time).width - 8, this.viewWindow.y + this.viewWindow.height - 10);
  }

  private drawResults(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.showStateSpace ? this.viewWindow.x + this.stateSpaceWidth : this.viewWindow.x, this.viewWindow.y);
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("E", 10, 15);
    ctx.fillText("K", 10, 30);
    ctx.fillText("V", 10, 45);
    let k = Math.abs(this.dynamicSolver.getKineticEnergy()) * this.energyScale;
    let v = Math.abs(this.dynamicSolver.getPotentialEnergy()) * this.energyScale;
    let e = k + v;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    if (e > 0) {
      ctx.fillStyle = "magenta";
      ctx.beginPath();
      ctx.rect(30, 6, e, 10);
      ctx.fill();
      ctx.stroke();
    }
    if (v > 0) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.rect(30, 21, v, 10);
      ctx.fill();
      ctx.stroke();
    }
    if (k > 0) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.rect(30, 36, k, 10);
      ctx.fill();
      ctx.stroke();
    }
    let position = this.dynamicSolver.getPosition();
    let momentum = this.dynamicSolver.getMomentum();
    let x;
    if (this.showStateSpace) {
      x = position * (this.viewWindow.width - this.stateSpaceWidth) / this.probabilityDensityFunction.length;
    } else {
      x = position * this.viewWindow.width / this.probabilityDensityFunction.length;
    }
    ctx.strokeStyle = "gray";
    ctx.setLineDash([2, 2]);
    ctx.drawLine(x, 0, x, this.viewWindow.height);
    ctx.strokeStyle = "green";
    ctx.setLineDash([]);
    let y = this.viewWindow.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    x += momentum * 20;
    ctx.lineTo(x, y);
    ctx.stroke();
    if (Math.abs(momentum) > 0.1) {
      let dv = 5 * Math.sign(momentum);
      ctx.drawLine(x, y, x - dv, y - dv);
      ctx.drawLine(x, y, x - dv, y + dv);
    }
    ctx.restore();
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "Italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.viewMargin.bottom;
    ctx.fillText("x (Å)", this.viewWindow.x + (this.viewWindow.width - ctx.measureText("x").width) / 2, this.y + horizontalAxisY + 25);
  }

  private drawAxes(ctx: CanvasRenderingContext2D): void {
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let x0 = this.showStateSpace ? this.viewWindow.x + this.stateSpaceWidth : this.viewWindow.x;
    let y0 = this.viewWindow.y + this.viewWindow.height;
    // draw x-axis tickmarks
    let inx = (this.potential.getXmax() - this.potential.getXmin()) / 10;
    let dx = (this.showStateSpace ? this.viewWindow.width - this.stateSpaceWidth : this.viewWindow.width) / 10;
    let tmpX, xtick, precision, diff, iString;
    for (let i = 0; i < 11; i++) {
      tmpX = x0 + dx * i;
      ctx.drawLine(tmpX, y0, tmpX, y0 - 4);
      xtick = this.potential.getXmin() + i * inx;
      precision = 2;
      if (Math.abs(xtick) >= 1) {
        diff = Math.abs(xtick - Math.round(xtick));
        precision = Math.round(Math.abs(xtick)).toString().length + (diff < 0.1 ? 0 : 1);
      } else {
        if (xtick.toPrecision(precision).endsWith("0")) {
          precision--;
        }
      }
      iString = Math.abs(xtick) < 0.01 ? "0" : xtick.toPrecision(precision);
      ctx.fillText(iString, tmpX - ctx.measureText(iString).width / 2, y0 + 10);
    }
    x0 = this.showStateSpace ? this.viewWindow.x + (this.stateSpaceWidth + this.viewWindow.width) / 2 : this.viewWindow.x + this.viewWindow.width / 2;
    ctx.drawLine(x0, y0, x0, this.viewWindow.y);
    let vmin = this.potential.getVmin();
    let vmax = this.potential.getVmax();
    ctx.lineWidth = 0.5;
    let h = this.viewWindow.height - 2 * this.baseLineOffet;
    let bottom = y0 - this.baseLineOffet;
    let dv = h / (vmax - vmin);
    let y;
    for (let i = 1; i <= 5; i++) {
      y = bottom - i * (vmax - vmin) / 5 * dv;
      ctx.drawLine(x0 - 5, y, x0 + 5, y);
      ctx.fillText((vmin + i * (vmax - vmin) / 5).toFixed(1), x0 + 10, y + 3);
    }
    ctx.save();
    ctx.font = "12px Arial";
    ctx.translate(x0 - 10, bottom - (vmax - vmin) / 2 * dv);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("V(x) (eV)", -ctx.measureText("V(x) (eV)").width / 2, 0);
    ctx.restore();
  }

  private drawStateSpace(ctx: CanvasRenderingContext2D): void {
    if (this.energyLevels === undefined) return;
    let emin = this.energyLevels[0];
    let emax = this.energyLevels[this.maxState];
    let h = this.viewWindow.height - this.baseLineOffet;
    let dh = h / (emax - emin);
    let bottom = this.viewWindow.y + this.viewWindow.height - this.baseLineOffet;
    ctx.fillStyle = "#eeeeee88";
    ctx.fillRect(this.viewWindow.x, this.viewWindow.y, this.stateSpaceWidth, this.viewWindow.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.font = "9px Arial";
    let label;
    let r;
    let x;
    let y;
    let ySelected;
    for (let i = 0; i < this.maxState; i++) {
      y = bottom - dh * (this.energyLevels[i] - this.energyLevels[0]);
      ctx.beginPath();
      ctx.moveTo(this.viewWindow.x, y);
      ctx.lineTo(this.viewWindow.x + this.stateSpaceWidth, y)
      if (i === this.selectedEnergyLevel) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 4;
        ctx.stroke();
        ySelected = y;
      }
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
      label = "|" + (i + 1) + "⟩";
      ctx.fillStyle = "black";
      ctx.fillText(label, this.viewWindow.x - ctx.measureText(label).width - 4, y + 3);
      if (this.stateProbabilities) {
        r = this.stateProbabilities[i] * this.stateSpaceWidth * 0.35;
        x = this.viewWindow.x + this.stateSpaceWidth / 2;
        ctx.fillStyle = "LawnGreen";
        ctx.fillCircle(x, y, r);
        ctx.drawCircle(x, y, r);
      }
    }
    ctx.drawLine(this.viewWindow.x + this.stateSpaceWidth, this.viewWindow.y, this.viewWindow.x + this.stateSpaceWidth, this.viewWindow.y + this.viewWindow.height);
    if (this.selectedEnergyLevel >= 0) {
      ctx.font = "10px Arial";
      let label = "E" + Util.subscriptNumbers((this.selectedEnergyLevel + 1).toString()) + "=" + this.energyLevels[this.selectedEnergyLevel].toFixed(4) + " eV";
      let w1 = ctx.measureText(label).width + 12;
      let h1 = 20;
      let x1 = this.viewWindow.x + this.stateSpaceWidth + 4;
      let y1 = ySelected + 10;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.rect(x1, y1 - h1, w1, h1);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.stroke();
      ctx.fillText(label, x1 + 6, y1 - 6);
    }
  }

  selectEnergyLevel(e: MouseEvent): void {
    if (this.energyLevels !== undefined) {
      // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
      let rect = flowchart.blockView.canvas.getBoundingClientRect();
      let x = e.clientX - rect.left - this.viewWindow.x;
      let y = e.clientY - rect.top - this.viewWindow.y;
      if (x > 0 && x < this.viewWindow.width && y > 0 && y < this.viewWindow.height) {
        let de = this.energyLevels[this.maxState] - this.energyLevels[0];
        let h = this.viewWindow.height - this.baseLineOffet;
        let dh = h / de;
        let y = e.clientY - rect.top;
        let bottom = this.viewWindow.y + this.viewWindow.height - this.baseLineOffet;
        let energy = (bottom - y) / dh + this.energyLevels[0];
        let minDistance = Number.MAX_VALUE;
        let distance;
        for (let i = 0; i < this.maxState; i++) {
          distance = Math.abs(energy - this.energyLevels[i]);
          if (distance < minDistance) {
            this.selectedEnergyLevel = i;
            minDistance = distance;
          }
        }
      }
      flowchart.blockView.requestDraw();
    }
  }

  private drawPotential(ctx: CanvasRenderingContext2D): void {
    let h = this.viewWindow.height - this.baseLineOffet;
    let bottom = this.viewWindow.y + h;
    let vmin = this.potential.getVmin();
    let vmax = this.potential.getVmax();
    if (vmin === vmax) return;
    let vlen = this.potential.getPoints();
    let dx = this.showStateSpace ? (this.viewWindow.width - this.stateSpaceWidth) / vlen : this.viewWindow.width / vlen;
    let x0 = this.showStateSpace ? this.viewWindow.x + this.stateSpaceWidth : this.viewWindow.x;
    let dv = (h - this.baseLineOffet) / (vmax - vmin);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 3;
    ctx.beginPath();
    let firstTime = true;
    let y;
    for (let i = 0; i < vlen; i++) {
      y = bottom - (this.potential.getValue(i) - vmin) * dv;
      if (y <= this.viewWindow.y + this.viewWindow.height && y >= this.viewWindow.y) {
        if (firstTime) {
          ctx.moveTo(x0 + i * dx, y);
          firstTime = false;
        } else {
          ctx.lineTo(x0 + i * dx, y);
        }
      }
    }
    // fill the gap between the last point and the right border line
    let projected = 2 * this.potential.getValue(vlen - 1) - this.potential.getValue(vlen - 2);
    if (projected <= vmax && projected >= vmin) {
      ctx.lineTo(x0 + vlen * dx, bottom - (projected - vmin) * dv);
    }
    ctx.stroke();
  }

  private drawElectricField(ctx: CanvasRenderingContext2D): void {
    let eField = this.dynamicSolver.getElectricField();
    if (eField === undefined) return;
    let time = this.dynamicSolver.getTime();
    let eFieldValue = eField.getValue(time);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let x1 = this.viewWindow.x + this.viewWindow.width;
    let y1 = this.viewWindow.y;
    ctx.drawLine(x1 - 60, y1 + 40, x1 - 20, y1 + 40);
    if (eFieldValue < 0) {
      ctx.drawLine(x1 - 20, y1 + 40, x1 - 25, y1 + 35);
      ctx.drawLine(x1 - 20, y1 + 40, x1 - 25, y1 + 45);
    } else {
      ctx.drawLine(x1 - 60, y1 + 40, x1 - 55, y1 + 35);
      ctx.drawLine(x1 - 60, y1 + 40, x1 - 55, y1 + 45);
    }
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    let s = "Electric Field";
    ctx.fillText(s, x1 - ctx.measureText(s).width - 10, y1 + 20);
    let x0 = x1 - 40;
    let y0 = y1 + 50;
    let dx = 40;
    let dy = 60;
    ctx.fillStyle = "cyan";
    ctx.fillRect(x0 - dx / 2, y0, dx, dy);
    ctx.fillStyle = "black";
    ctx.drawRect(x0 - dx / 2, y0, dx, dy);
    ctx.drawLine(x0, y0, x0, y0 + dy);
    let x = eFieldValue / eField.getIntensity() * 0.5 * dx;
    ctx.fillStyle = "red";
    ctx.fillCircle(x0 - x, y0, 2);
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(x0 - x, y0);
    for (let i = 1; i < dy; i++) {
      x = eField.getValue(time - this.getTimeStep() * i * 5) / eField.getIntensity() * 0.5 * dx;
      ctx.lineTo(x0 - x, y0 + i);
    }
    ctx.stroke();
  }

  private drawWaveFunction(ctx: CanvasRenderingContext2D): void {
    if (this.waveFunction === undefined) return;
    let n = this.waveFunction.length;
    let bottom = this.viewWindow.y + this.viewWindow.height / 2;
    let x0 = this.showStateSpace ? this.viewWindow.x + this.stateSpaceWidth : this.viewWindow.x;
    let dx = (this.showStateSpace ? this.viewWindow.width - this.stateSpaceWidth : this.viewWindow.width) / n;
    let h = this.viewWindow.height / 2;
    ctx.lineWidth = 1;
    // draw the real part
    ctx.beginPath();
    ctx.moveTo(x0, bottom);
    for (let i = 0; i < n; i++) {
      ctx.lineTo(x0 + i * dx, bottom - h * this.waveFunction[i].re);
    }
    ctx.lineTo(this.viewWindow.x + this.viewWindow.width, bottom);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    // draw the imaginary part
    ctx.beginPath();
    ctx.moveTo(x0, bottom);
    for (let i = 0; i < n; i++) {
      ctx.lineTo(x0 + i * dx, bottom - h * this.waveFunction[i].im);
    }
    ctx.lineTo(this.viewWindow.x + this.viewWindow.width, bottom);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  private drawProbabilityDensityFunction(ctx: CanvasRenderingContext2D): void {
    if (this.probabilityDensityFunction === undefined) return;
    let n = this.probabilityDensityFunction.length;
    let bottom = this.viewWindow.y + this.viewWindow.height - this.baseLineOffet;
    let h = this.viewWindow.height * 4;
    let x0 = this.showStateSpace ? this.viewWindow.x + this.stateSpaceWidth : this.viewWindow.x;
    let dx = (this.showStateSpace ? this.viewWindow.width - this.stateSpaceWidth : this.viewWindow.width) / n;
    ctx.beginPath();
    ctx.moveTo(x0, bottom);
    for (let i = 0; i < n; i++) {
      ctx.lineTo(x0 + i * dx, bottom - h * this.probabilityDensityFunction[i]);
    }
    ctx.lineTo(this.viewWindow.x + this.viewWindow.width, bottom);
    ctx.closePath();
    ctx.fillStyle = this.wavepacketColor;
    ctx.fill();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 30;
    this.viewMargin.left = this.showStateSpace ? 40 : 30;
    this.viewMargin.right = 30;
    this.portQB.setX(this.width);
    this.portQB.setY((this.height + this.barHeight) / 2);
    let dh = (this.height - this.barHeight) / 5;
    this.portIN.setY(this.barHeight + dh);
    this.portVX.setY(this.barHeight + dh * 2);
    this.portX0.setY(this.barHeight + dh * 3);
    this.portDX.setY(this.barHeight + dh * 4);
  }

  updateModel(): void {
    let vx = this.portVX.getValue();
    if (Array.isArray(vx)) { // custom potential
      let x0 = this.portX0.getValue();
      let dx = this.portDX.getValue();
      if (typeof x0 !== "number" || typeof dx !== "number" || typeof vx[0] !== "number") return;
      if (this.potential === undefined || !Util.arrayEqual(this.potential.getValues(), vx)) {
        this.potential = new CustomPotential(x0, x0 + dx * vx.length, vx);
        this.dynamicSolver.setPotential(this.potential);
        if (this.getInitialState() >= 0) { // we need to calculate the wave function of the initial state
          this.findStates();
          this.setInitialWaveFunction();
        }
      }
    }
    let steps = this.portIN.getValue();
    if (steps === undefined || steps === 0) return;
    this.updateElectricFieldIntensity();
    this.updateElectricFieldFrequency();
    for (let i = 0; i < this.solverSteps; i++) this.dynamicSolver.nextStep();
    this.probabilityDensityFunction = this.dynamicSolver.getAmplitude();
    this.waveFunction = this.dynamicSolver.getWaveFunction();
    if (this.showStateSpace && this.waveFunctions) {
      this.computeStateProbabilities();
    }
    this.updateOutput();
  }

  private updateOutput(): void {
    if (this.getElectricField() && this.energyLevels) {
      let finalState = this.findEnergyLevel(this.getElectricField().getFrequency() + this.energyLevels[this.getInitialState()]);
      let tls: number[] = new Array(2);
      tls[0] = Math.atan(this.stateProbabilities[finalState] / this.stateProbabilities[this.getInitialState()]) * 2;
      tls[1] = this.statePhases[finalState] - this.statePhases[this.getInitialState()];
      this.portQB.setValue(tls);
      this.updateConnectors();
    }
  }

  private findEnergyLevel(energy: number): number {
    if (this.energyLevels === undefined) return 0;
    let s = 0;
    let min = Number.MAX_VALUE;
    let dif;
    for (let i = 0; i < this.energyLevels.length; i++) {
      dif = Math.abs(this.energyLevels[i] - energy);
      if (dif < min) {
        min = dif;
        s = i;
      }
    }
    return s;
  }

  private computeStateProbabilities(): void {
    if (this.waveFunction && this.waveFunctions) {
      if (this.stateProbabilities === undefined || this.stateProbabilities.length !== this.waveFunction.length) {
        this.stateProbabilities = new Array(this.waveFunction.length);
      }
      if (this.statePhases === undefined || this.statePhases.length !== this.waveFunction.length) {
        this.statePhases = new Array(this.waveFunction.length);
      }
      let sumRe = 0;
      let sumIm = 0;
      //let sumWeight = 0;
      for (let k = 0; k < this.stateProbabilities.length; k++) {
        sumRe = 0;
        sumIm = 0;
        for (let i = 0; i < this.waveFunction.length; i++) {
          sumRe += this.waveFunctions[i][k] * this.waveFunction[i].re;
          sumIm += this.waveFunctions[i][k] * this.waveFunction[i].im;
        }
        this.stateProbabilities[k] = sumRe * sumRe + sumIm * sumIm;
        this.statePhases[k] = Math.atan2(sumIm, sumRe);
        //sumWeight += this.stateProbabilities[k];
      }
    }
  }

  findStates(): void {
    if (this.potential === undefined) return;
    if (this.staticSolver === undefined || this.staticSolver.getPoints() !== this.potential.getPoints()) {
      this.staticSolver = new StationaryStateSolver(this.potential.getPoints());
    }
    this.staticSolver.setPotential(this.potential.getValues());
    this.staticSolver.discretizeHamiltonian(this.potential.getXLength());
    this.staticSolver.solve();
    this.energyLevels = this.staticSolver.getEigenValues();
    this.waveFunctions = this.staticSolver.getEigenVectors();
  }

}
