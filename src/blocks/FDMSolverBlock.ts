/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart, math} from "../Main";
import {DataArray} from "./DataArray";
import {SolverBlock} from "./SolverBlock";

export class FDMSolverBlock extends SolverBlock {

  private variables: string[] = ["t", "x"];
  private equations: string[] = ["Tt=Txx"];
  private values: DataArray[];
  private intermediateValues: DataArray[];
  private initialValues: DataArray[];
  private readonly portNt: Port; // port for number of time steps
  private readonly portDt: Port; // port for length of time step
  private readonly portNX: Port; // port for number of space steps
  private readonly portX0: Port; // port for starting point in space
  private readonly portDx: Port; // port for length of space step
  private portI: Port[]; // ports for importing the initial results
  private portO: Port[]; // ports for exporting the final results
  private hasEquationError: boolean = false;

  static State = class {
    readonly uid: string;
    readonly variables: string[];
    readonly equations: string[];
    readonly method: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: FDMSolverBlock) {
      this.uid = block.uid;
      this.variables = block.variables;
      this.equations = block.equations;
      this.method = block.method;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "FDM";
    this.name = "FDM Solver Block";
    this.method = "Implicit";
    this.color = "#B0E0E6";
    let dh = this.height / (this.equations.length + 6);
    this.portNt = new Port(this, true, "NT", 0, dh, false);
    this.portDt = new Port(this, true, "DT", 0, 2 * dh, false);
    this.portNX = new Port(this, true, "NX", 0, 3 * dh, false);
    this.portX0 = new Port(this, true, "X0", 0, 4 * dh, false);
    this.portDx = new Port(this, true, "DX", 0, 5 * dh, false);
    this.ports.push(this.portNt);
    this.ports.push(this.portDt);
    this.ports.push(this.portNX);
    this.ports.push(this.portX0);
    this.ports.push(this.portDx);
    this.setInputPorts();
    this.setOutputPorts();
    this.marginX = 25;
    this.marginY = 15;
  }

  private setInputPorts(): void {
    if (this.portI == undefined || this.portI.length != this.equations.length) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.pop();
        }
      }
      this.portI = new Array(this.equations.length);
      let dh = this.height / (this.equations.length + 6);
      const firstPortName = "A";
      for (let i = 0; i < this.equations.length; i++) {
        this.portI[i] = new Port(this, true, String.fromCharCode(firstPortName.charCodeAt(0) + i) + "I", 0, (i + 6) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  private setOutputPorts(): void {
    if (this.portO == undefined || this.portO.length != this.equations.length) {
      if (this.portO) {
        for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portO) {
          this.ports.pop();
        }
      }
      this.portO = new Array(this.equations.length);
      let dh = this.height / (this.equations.length + 1);
      const firstPortName = "A";
      for (let i = 0; i < this.equations.length; i++) {
        this.portO[i] = new Port(this, false, String.fromCharCode(firstPortName.charCodeAt(0) + i) + "F", this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new FDMSolverBlock("FDM Solver Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.variables = this.variables.slice();
    block.equations = this.equations.slice();
    block.method = this.method;
    return block;
  }

  setVariables(variables: string[]): void {
    this.variables = variables.slice();
  }

  getVariables(): string[] {
    return this.variables;
  }

  setEquations(equations: string[]): void {
    this.equations = JSON.parse(JSON.stringify(equations));
    let n = this.equations.length;
    for (let i = 0; i < n; i++) {
      this.equations[i] = this.equations[i].replace(/\s/g, "");
      let equalSignIndex = this.equations[i].indexOf("=");
      if (equalSignIndex < 0) {
        Util.showBlockError("The equation you input " + this.equations[i] + " misses an equation sign (=).");
        this.hasEquationError = true;
      } else {
        let lhs = this.equations[i].substring(0, equalSignIndex);
        let rhs = this.equations[i].substring(equalSignIndex + 1);
      }
    }
    if (this.values === undefined || this.values.length !== n) {
      this.values = new Array(n);
      this.intermediateValues = new Array(n);
    }
    if (this.initialValues === undefined || this.initialValues.length !== n) {
      this.initialValues = new Array(n);
    }
    this.createParsers();
    this.setInputPorts();
    this.setOutputPorts();
    this.refreshView();
  }

  getEquations(): string[] {
    return this.equations.slice();
  }

  private createParsers(): void {
  }

  useDeclaredFunctions() {
  }

  reset(): void {
    super.reset();
    for (let i = 0; i < this.values.length; i++) {
      this.values[i] = undefined;
    }
  }

  refreshView(): void {
    super.refreshView();
    let n = this.equations.length;
    let dh = this.height / (n + 6);
    this.portNt.setY(dh);
    this.portDt.setY(2 * dh);
    this.portNX.setY(3 * dh);
    this.portX0.setY(4 * dh);
    this.portDx.setY(5 * dh);
    for (let i = 0; i < n; i++) {
      this.portI[i].setY((i + 6) * dh);
    }
    dh = this.height / (n + 1);
    for (let i = 0; i < n; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let count = this.portO.length;
    let nt = this.portNt.getValue();
    let dt = this.portDt.getValue();
    let nx = this.portNX.getValue();
    let x0 = this.portX0.getValue();
    let dx = this.portDx.getValue();
    for (let i = 0; i < count; i++) {
      if (this.initialValues[i] === undefined) {
        this.initialValues[i] = new DataArray();
      }
      this.initialValues[i].data = this.portI[i].getValue();
    }
    this.hasError = this.hasEquationError;
    if (this.equations && nx != undefined && dx != undefined && nt != undefined && dt != undefined) {
      let param = {...flowchart.globalVariables};
      for (let v of this.variables) {
        //param[v] = t;
      }
      for (let i = 0; i < count; i++) {
        if (this.values[i] === undefined) {
          this.values[i] = this.initialValues[i].copy();
          this.intermediateValues[i] = this.initialValues[i].copy();
        }
      }
      try {
        switch (this.method) {
          case "Explicit":
            for (let n = 0; n < count; n++) {
              let r = dt / (dx * dx);
              for (let j = 1; j < this.values[n].data.length - 1; j++) {
                this.intermediateValues[n].data[j] = (1 - 2 * r) * this.values[n].data[j] + r * (this.values[n].data[j - 1] + this.values[n].data[j + 1]);
              }
              for (let j = 1; j < this.values[n].data.length - 1; j++) {
                this.values[n].data[j] = this.intermediateValues[n].data[j];
              }
            }
            break;
          case "Implicit":
            let relaxationSteps = 5;
            let r = dt / (dx * dx);
            for (let n = 0; n < count; n++) {
              for (let k = 0; k < relaxationSteps; k++) {
                for (let j = 1; j < this.values[n].data.length - 1; j++) {
                  this.intermediateValues[n].data[j] = this.values[n].data[j] + r * (this.intermediateValues[n].data[j - 1] + this.intermediateValues[n].data[j + 1]);
                  this.intermediateValues[n].data[j] /= (1 + 2 * r);
                }
              }
              for (let j = 1; j < this.values[n].data.length - 1; j++) {
                this.values[n].data[j] = this.intermediateValues[n].data[j];
              }
            }
            break;
        }
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
      for (let i = 0; i < count; i++) {
        this.portO[i].setValue(this.values[i].data);
      }
      this.updateConnectors();
    } else {
      for (let p of this.portO) {
        p.setValue(undefined);
      }
    }
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = Util.getOS() == "Android" ? "italic 9px Noto Serif" : "italic 9px Times New Roman";
      this.drawTextAt(this.symbol, 0, 0, ctx);
    } else {
      ctx.font = Util.getOS() == "Android" ? "italic 16px Noto Serif" : "italic 16px Times New Roman";
      let dh = this.height / (this.equations.length + 1);
      for (let i = 0; i < this.equations.length; i++) {
        this.drawTextAt(this.equations[i], 0, (i + 1) * dh - this.height / 2, ctx);
      }
    }
  }

}
