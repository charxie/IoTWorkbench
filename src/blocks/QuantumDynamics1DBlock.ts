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
import {TimePropagator} from "../physics/quantum/qm1d/TimePropagator";
import {Quantum1DBlock} from "./Quantum1DBlock";
import {RungeKuttaSolver} from "../physics/quantum/qm1d/RungeKuttaSolver";
import {SquareWell} from "../physics/quantum/qm1d/potentials/SquareWell";

export class QuantumDynamics1DBlock extends Quantum1DBlock {

  private probabilityDensityFunction: number[];
  private initialState: number = -1;
  private dynamicSolver: TimePropagator;
  private baseLineOffet: number = 50;

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly name: string;
    readonly viewWindowColor: string;
    readonly nPoints: number;
    readonly initialState: number;
    readonly potentialName: string;

    constructor(block: QuantumDynamics1DBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.name = block.name;
      this.viewWindowColor = block.viewWindowColor;
      this.nPoints = block.nPoints;
      this.initialState = block.initialState;
      this.potentialName = block.potentialName;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "QD1D";
    this.name = "Quantum Dynamics 1D Block";
    this.color = "#CCFCFA";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portVX = new Port(this, true, "VX", 0, this.barHeight + dh, false);
    this.portX0 = new Port(this, true, "X0", 0, this.barHeight + 2 * dh, false);
    this.portDX = new Port(this, true, "DX", 0, this.barHeight + 3 * dh, false);
    this.ports.push(this.portVX);
    this.ports.push(this.portX0);
    this.ports.push(this.portDX);
    this.marginX = 30;
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.potential = new SquareWell(this.nPoints, -1, 1, -10, 10);
    this.dynamicSolver = new RungeKuttaSolver(this.nPoints);
    this.dynamicSolver.setPotential(this.potential);
    this.dynamicSolver.initPsi();
    this.probabilityDensityFunction = this.dynamicSolver.getAmplitude();
  }

  getCopy(): Block {
    let copy = new QuantumDynamics1DBlock("Quantum Dynamics 1D Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    copy.setViewWindowColor(this.viewWindowColor);
    copy.setName(this.name);
    copy.setNpoints(this.nPoints);
    copy.setInitialState(this.initialState);
    copy.setPotentialName(this.potentialName);
    return copy;
  }

  public setInitialState(initialState: number): void {
    this.initialState = initialState;
  }

  public getInitialState(): number {
    return this.initialState;
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
      let yc = this.viewWindow.y + this.viewWindow.height / 2;
      ctx.beginPath();
      ctx.moveTo(xc - 10, yc);
      ctx.lineTo(xc + 10, yc);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - 10, yc - 5);
      ctx.lineTo(xc + 10, yc - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - 10, yc + 2);
      ctx.lineTo(xc + 10, yc + 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - 10, yc + 4);
      ctx.lineTo(xc + 10, yc + 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc - 10, yc + 5);
      ctx.lineTo(xc + 10, yc + 5);
      ctx.stroke();
    } else {
      if (this.potential !== undefined) {
        this.drawPotential(ctx);
        this.drawProbabilityDensityFunctions(ctx);
        this.drawAxes(ctx);
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

  private drawAxes(ctx: CanvasRenderingContext2D): void {
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let y0 = this.viewWindow.y + this.viewWindow.height;
    // draw x-axis tickmarks
    let inx = (this.potential.getXmax() - this.potential.getXmin()) / 10;
    let dx = this.viewWindow.width / 10;
    for (let i = 0; i < 11; i++) {
      let tmpX = this.viewWindow.x + dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, y0);
      ctx.lineTo(tmpX, y0 - 4);
      ctx.stroke();
      let xtick = this.potential.getXmin() + i * inx;
      let precision = 2;
      if (Math.abs(xtick) >= 1) {
        let diff = Math.abs(xtick - Math.round(xtick));
        precision = Math.round(Math.abs(xtick)).toString().length + (diff < 0.1 ? 0 : 1);
      } else {
        if (xtick.toPrecision(precision).endsWith("0")) {
          precision--;
        }
      }
      let iString = Math.abs(xtick) < 0.01 ? "0" : xtick.toPrecision(precision);
      ctx.fillText(iString, tmpX - ctx.measureText(iString).width / 2, y0 + 10);
    }
    let x0 = this.viewWindow.x + this.viewWindow.width / 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, this.viewWindow.y);
    ctx.stroke();
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "Italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.viewMargin.bottom;
    ctx.fillText("x (Å)", this.viewWindow.x + (this.viewWindow.width - ctx.measureText("x").width) / 2, this.y + horizontalAxisY + 25);
  }

  private drawPotential(ctx: CanvasRenderingContext2D): void {
    let bottom = this.viewWindow.y + this.viewWindow.height - this.baseLineOffet;
    let h = this.viewWindow.height / 2;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.viewWindow.x + 1, bottom - h + 1, this.viewWindow.width - 2, h - 2);
    ctx.fill();
    let vmin = this.potential.getVmin();
    let vmax = this.potential.getVmax();
    if (vmin === vmax) return;
    let vlen = this.potential.getPoints();
    let dx = this.viewWindow.width / vlen;
    let dv = h / (vmax - vmin);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 3;
    ctx.beginPath();
    let firstTime = true;
    for (let i = 0; i < vlen; i++) {
      if (this.potential.getValue(i) <= vmax && this.potential.getValue(i) >= vmin) {
        if (firstTime) {
          ctx.moveTo(this.viewWindow.x + i * dx, bottom - (this.potential.getValue(i) - vmin) * dv);
          firstTime = false;
        } else {
          ctx.lineTo(this.viewWindow.x + i * dx, bottom - (this.potential.getValue(i) - vmin) * dv);
        }
      }
    }
    // fill the gap between the last point and the right border line
    let projected = 2 * this.potential.getValue(vlen - 1) - this.potential.getValue(vlen - 2);
    if (projected <= vmax && projected >= vmin) {
      ctx.lineTo(this.viewWindow.x + vlen * dx, bottom - (projected - vmin) * dv);
    }
    ctx.stroke();
  }

  private drawProbabilityDensityFunctions(ctx: CanvasRenderingContext2D): void {
    if (this.probabilityDensityFunction === undefined) return;
    let n = this.probabilityDensityFunction.length;
    let bottom = this.viewWindow.y + this.viewWindow.height - this.baseLineOffet;
    let h = this.viewWindow.height * 2;
    let dx = this.viewWindow.width / n;
    ctx.beginPath();
    ctx.moveTo(this.viewWindow.x, bottom);
    for (let i = 0; i < n; i++) {
      ctx.lineTo(this.viewWindow.x + i * dx, bottom - h * this.probabilityDensityFunction[i]);
    }
    ctx.lineTo(this.viewWindow.x + this.viewWindow.width, bottom);
    ctx.closePath();
    ctx.fillStyle = "#eeeeee";
    ctx.fill();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseDown(e: MouseEvent): boolean {
    return false;
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 30;
    this.viewMargin.left = 30;
    this.viewMargin.right = 10;
    let dh = (this.height - this.barHeight) / 4;
    this.portVX.setY(this.barHeight + dh);
    this.portX0.setY(this.barHeight + dh * 2);
    this.portDX.setY(this.barHeight + dh * 3);
  }

  updateModel(): void {
    let vx = this.portVX.getValue();
    if (vx === undefined) return;
    if (Array.isArray(vx)) { // custom potential
      let x0 = this.portX0.getValue();
      let dx = this.portDX.getValue();
      if (typeof x0 !== "number" || typeof dx !== "number" || typeof vx[0] !== "number") return;
      this.potential = new CustomPotential(x0, x0 + dx * vx.length, vx);
      if (this.staticSolver === undefined || this.staticSolver.getPoints() !== vx.length) this.staticSolver = new StationaryStateSolver(vx.length);
      this.staticSolver.setPotential(vx);
      this.staticSolver.discretizeHamiltonian(dx * vx.length);
      this.staticSolver.solve();
      this.energyLevels = this.staticSolver.getEigenValues();
      this.waveFunctions = this.staticSolver.getEigenVectors();
    } else if (typeof vx === "string") {
      this.staticSolve(vx);
    }
  }

}
