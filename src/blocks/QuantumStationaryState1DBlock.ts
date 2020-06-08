/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Potential1D} from "../physics/quantum/qm1d/Potential1D";
import {SquareWell} from "../physics/quantum/qm1d/SquareWell";
import {StationaryStateSolver} from "../physics/quantum/qm1d/StationaryStateSolver";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";

export class QuantumStationaryState1DBlock extends Block {

  private steps: number = 100;
  private maxState: number = 10;  // highest number of energy levels from the ground state we will show
  private potential: Potential1D;
  private energyLevels: number[];
  private waveFunctions: number[][];
  private readonly portVX: Port; // port for importing potential
  private readonly portEL: Port; // port for exporting energy levels
  private readonly portWF: Port; // port for exporting wave functions
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private selectedEnergyLevel: number = 0;

  static State = class {
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly viewWindowColor: string;
    readonly steps: number;
    readonly maxState: number;

    constructor(block: QuantumStationaryState1DBlock) {
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.viewWindowColor = block.viewWindowColor;
      this.steps = block.steps;
      this.maxState = block.maxState;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Q1D";
    this.name = "Quantum Stationary State 1D Block";
    this.color = "#C0DCFA";
    this.barHeight = Math.min(30, this.height / 3);
    this.portVX = new Port(this, true, "VX", 0, this.height / 2, false);
    this.ports.push(this.portVX);
    let dh = this.height / 3;
    this.portEL = new Port(this, false, "EL", this.width, dh, true);
    this.portWF = new Port(this, false, "WF", this.width, 2 * dh, true);
    this.ports.push(this.portEL);
    this.ports.push(this.portWF);
    this.marginX = 30;
    this.viewWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new QuantumStationaryState1DBlock("Quantum Stationary State 1D Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    copy.viewWindowColor = this.viewWindowColor;
    copy.setSteps(this.steps);
    copy.setMaxState(this.maxState);
    return copy;
  }

  destroy() {
  }

  setSteps(steps: number): void {
    this.steps = steps;
  }

  getSteps(): number {
    return this.steps;
  }

  public setMaxState(maxState: number): void {
    this.maxState = maxState;
  }

  public getMaxState(): number {
    return this.maxState;
  }

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
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
        if (this.energyLevels !== undefined) {
          this.drawEnergyLevels(ctx);
        }
        if (this.waveFunctions !== undefined) {
          this.drawWaveFunctions(ctx);
        }
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
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -4);
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
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.viewMargin.bottom;
    ctx.fillText("x", this.viewWindow.x + (this.viewWindow.width - ctx.measureText("x").width) / 2, this.y + horizontalAxisY + 25);
  }

  private drawPotential(ctx: CanvasRenderingContext2D): void {
    let bottom = this.viewWindow.y + this.viewWindow.height;
    let h = this.viewWindow.height / 2;
    ctx.fillStyle = "#eeeeee";
    ctx.beginPath();
    ctx.rect(this.viewWindow.x, bottom - h, this.viewWindow.width, h);
    ctx.fill();
  }

  private drawEnergyLevels(ctx: CanvasRenderingContext2D): void {
    this.drawPotential(ctx);
    let emin = this.energyLevels[0];
    let emax = this.energyLevels[this.maxState];
    let h = this.viewWindow.height / 2;
    let dh = h / (emax - emin);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    let bottom = this.viewWindow.y + this.viewWindow.height;
    let y;
    for (let i = 0; i < this.maxState; i++) {
      y = bottom - dh * (this.energyLevels[i] - this.energyLevels[0]);
      ctx.beginPath();
      ctx.moveTo(this.viewWindow.x, y);
      ctx.lineTo(this.viewWindow.x + this.viewWindow.width, y);
      ctx.stroke();
    }
  }

  private drawWaveFunctions(ctx: CanvasRenderingContext2D): void {
    if (this.selectedEnergyLevel < 0) return;
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    let n = this.waveFunctions.length;
    let bottom = this.viewWindow.y + this.viewWindow.height / 4;
    let h = this.viewWindow.height / 2;
    let dx = this.viewWindow.width / n;
    ctx.beginPath();
    ctx.moveTo(this.viewWindow.x, bottom - h * this.waveFunctions[0][this.selectedEnergyLevel]);
    for (let i = 1; i < n; i++) {
      ctx.lineTo(this.viewWindow.x + i * dx, bottom - h *this.waveFunctions[i][this.selectedEnergyLevel]);
    }
    ctx.stroke();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 30;
    this.viewMargin.left = 30;
    this.viewMargin.right = 30;
    this.portEL.setX(this.width);
    this.portWF.setX(this.width);
    this.portVX.setY(this.height / 2);
    let dh = this.height / 3;
    this.portEL.setY(dh);
    this.portWF.setY(2 * dh);
  }

  updateModel(): void {
    let vx = this.portVX.getValue();
    if (vx === undefined) return;
    if (vx) {
      this.potential = new SquareWell(this.steps, 0, 0, -10, 10);
      let solver = new StationaryStateSolver(this.steps);
      solver.setPotential(this.potential.getPotential());
      solver.discretizeHamiltonian(this.potential.getXmax() - this.potential.getXmin());
      solver.solve();
      this.energyLevels = solver.getEigenValues();
      this.waveFunctions = solver.getEigenVectors();
    }
  }

}
