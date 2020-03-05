/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart, math} from "../Main";
import {DataArray} from "./DataArray";
import {SolverBlock} from "./SolverBlock";
import {BoundaryCondition} from "./BoundaryCondition";
import {WorkerBlock} from "./WorkerBlock";

export class SteadyStateFDMSolverBlock extends SolverBlock {

  private variables: string[] = ["x", "y"];
  private equations: string[] = ["T_xx+T_yy=0"];
  private expressions: string[] = [];
  private codes;
  private values: DataArray[];
  private prevValues: DataArray[];
  private initialValues: DataArray[];
  private boundaryValues: BoundaryCondition[];
  private readonly portRN: Port; // port for running
  private readonly portNX: Port; // port for number of steps in x direction
  private readonly portX0: Port; // port for starting point in x direction
  private readonly portDX: Port; // port for steplength in x direction
  private readonly portNY: Port; // port for number of steps in y direction
  private readonly portY0: Port; // port for starting point in y direction
  private readonly portDY: Port; // port for steplength in y direction
  private portI: Port[]; // ports for importing the initial values
  private portB: Port[]; // ports for importing the boundary conditions
  private portO: Port[]; // ports for exporting the final values
  private hasEquationError: boolean = false;
  private hasParserError: boolean = false;
  private hasDeclarationError: boolean = false;
  private relaxationSteps: number = 10;
  private readonly partialDerivativePattern = /[a-zA-Z]+_[a-zA-Z]+/g;

  static State = class {
    readonly uid: string;
    readonly variables: string[];
    readonly equations: string[];
    readonly method: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: SteadyStateFDMSolverBlock) {
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
    this.name = "Steady State FDM Solver Block";
    this.method = "Jacobi";
    this.color = "#E0C0B6";
    let dh = this.height / (this.equations.length + 8);
    this.portRN = new Port(this, true, "RN", 0, dh, false);
    this.portX0 = new Port(this, true, "X0", 0, 2 * dh, false);
    this.portDX = new Port(this, true, "DX", 0, 3 * dh, false);
    this.portNX = new Port(this, true, "NX", 0, 4 * dh, false);
    this.portY0 = new Port(this, true, "Y0", 0, 5 * dh, false);
    this.portDY = new Port(this, true, "DY", 0, 6 * dh, false);
    this.portNY = new Port(this, true, "NY", 0, 7 * dh, false);
    this.ports.push(this.portRN);
    this.ports.push(this.portX0);
    this.ports.push(this.portDX);
    this.ports.push(this.portNX);
    this.ports.push(this.portY0);
    this.ports.push(this.portDY);
    this.ports.push(this.portNY);
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
          Util.deleteArrayElement(p, this.ports);
        }
      }
      this.portI = new Array(this.equations.length);
      this.portB = new Array(this.equations.length);
      let dh = this.height / (2 * this.equations.length + 7);
      const firstPortName = "A";
      for (let i = 0; i < this.equations.length; i++) {
        let portName = String.fromCharCode(firstPortName.charCodeAt(0) + i);
        this.portI[i] = new Port(this, true, portName + "I", 0, (2 * i + 6) * dh, false);
        this.ports.push(this.portI[i]);
        this.portB[i] = new Port(this, true, portName + "B", 0, (2 * i + 7) * dh, false);
        this.ports.push(this.portB[i]);
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
          Util.deleteArrayElement(p, this.ports);
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
    let block = new SteadyStateFDMSolverBlock("Steady State FDM Solver Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.variables = this.variables.slice();
    block.setEquations(this.equations.slice());
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
    this.expressions.length = 0;
    for (let i = 0; i < n; i++) {
      this.equations[i] = this.equations[i].replace(/\s/g, "");
      let equalSignIndex = this.equations[i].indexOf("=");
      if (equalSignIndex < 0) {
        Util.showBlockError("The equation you input " + this.equations[i] + " misses an equation sign (=).");
        this.hasEquationError = true;
      } else {
        let lhs = this.equations[i].substring(0, equalSignIndex);
        this.expressions.push(lhs);
      }
    }
    if (this.values === undefined || this.values.length !== n) {
      this.values = new Array(n);
      this.prevValues = new Array(n);
    }
    if (this.initialValues === undefined || this.initialValues.length !== n) {
      this.initialValues = new Array(n);
    }
    if (this.boundaryValues === undefined || this.boundaryValues.length !== n) {
      this.boundaryValues = new Array(n);
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
    if (this.codes === undefined || this.codes.length !== this.expressions.length) {
      this.codes = new Array(this.expressions.length);
    }
    this.hasParserError = false;
    try {
      for (let i = 0; i < this.expressions.length; i++) {
        this.codes[i] = math.parse(this.expressions[i]).compile();
      }
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasParserError = true;
    }
  }

  useDeclaredFunctions() {
    this.hasDeclarationError = false;
    try {
      for (let i = 0; i < this.expressions.length; i++) {
        let exp = flowchart.replaceWithDeclaredFunctions(this.expressions[i]);
        if (exp != this.expressions[i]) {
          this.codes[i] = math.parse(exp).compile();
        }
      }
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasDeclarationError = true;
    }
  }

  reset(): void {
    super.reset();
    for (let i = 0; i < this.values.length; i++) {
      this.values[i] = undefined;
      if (this.initialValues[i] != undefined) {
        this.portO[i].setValue(this.initialValues[i].data);
      }
    }
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    let n = this.equations.length;
    let dh = this.height / (2 * n + 8);
    this.portRN.setY(dh);
    this.portX0.setY(2 * dh);
    this.portDX.setY(3 * dh);
    this.portNX.setY(4 * dh);
    this.portY0.setY(5 * dh);
    this.portDY.setY(6 * dh);
    this.portNY.setY(7 * dh);
    for (let i = 0; i < n; i++) {
      this.portI[i].setY((2 * i + 8) * dh);
      this.portB[i].setY((2 * i + 9) * dh);
    }
    dh = this.height / (n + 1);
    for (let i = 0; i < n; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let connector = flowchart.getConnectorWithInput(this.portRN);
    if (connector !== null) {
      let stepWorker = connector.getOutput().getBlock();
      if (stepWorker instanceof WorkerBlock) {
        if (stepWorker.isPaused()) return;
      }
    }
    let steps = this.portRN.getValue();
    if (steps === undefined || steps === 0) return;
    let count = this.portO.length;
    let x0 = this.portX0.getValue();
    let dx = this.portDX.getValue();
    let nx = this.portNX.getValue();
    let y0 = this.portY0.getValue();
    let dy = this.portDY.getValue();
    let ny = this.portNY.getValue();
    this.hasError = this.hasEquationError;
    if (this.equations && x0 != undefined && nx != undefined && dx != undefined && y0 != undefined && ny != undefined && dy != undefined) {
      for (let n = 0; n < count; n++) {
        if (this.initialValues[n] === undefined) {
          this.initialValues[n] = new DataArray(0);
        }
        if (this.portI[n].getValue() !== undefined) {
          this.initialValues[n].data = this.portI[n].getValue();
        } else {
          if (this.initialValues[n].data.length !== nx * ny) {
            this.initialValues[n].data = new Array(nx * ny);
          }
          this.initialValues[n].fill(0);
        }
        this.boundaryValues[n] = this.portB[n].getValue();
      }
      let param = {...flowchart.globalVariables};
      for (let n = 0; n < count; n++) {
        if (this.values[n] === undefined) {
          this.values[n] = new DataArray(nx * ny);
          if (this.initialValues[n] !== undefined) {
            this.values[n] = this.initialValues[n].copy();
          } else {
            this.values[n].fill(0);
          }
          this.prevValues[n] = this.values[n].copy();
        }
      }
      const invdx = 1 / (2 * dx);
      const invdy = 1 / (2 * dy);
      const invdx2 = 1 / (dx * dx);
      const invdy2 = 1 / (dy * dy);
      const invdxdy = 1 / (4 * dx * dy);
      let x, y;
      let factor;
      try {
        for (let n = 0; n < count; n++) {
          let derivativeMatches = this.expressions[n].match(this.partialDerivativePattern);
          if (derivativeMatches === null || derivativeMatches.length === 0) continue;
          switch (this.method) {
            case "Jacobi": // maybe more intuitive, but slower convergence and smaller memory footprint
              for (let r = 0; r < this.relaxationSteps; r++) {
                for (let i = 1; i < nx - 1; i++) {
                  x = x0 + i * dx;
                  param["y"] = x;
                  for (let j = 1; j < ny - 1; j++) {
                    y = y0 + j * dy;
                    param["x"] = y;
                    factor = 0;
                    for (let match of derivativeMatches) {
                      let index = match.indexOf("_");
                      let fun = match.substring(0, index);
                      param[fun] = this.prevValues[n].data[i * ny + j];
                      let variable = match.substring(index + 1);
                      switch (variable) {
                        case "x":
                          param[match] = (this.prevValues[n].data[i * ny + j + 1] - this.prevValues[n].data[i * ny + j - 1]) * invdx;
                          break;
                        case "y":
                          param[match] = (this.prevValues[n].data[(i + 1) * ny + j] - this.prevValues[n].data[(i - 1) * ny + j]) * invdy;
                          break;
                        case "xx":
                          param[match] = (this.prevValues[n].data[i * ny + j + 1] + this.prevValues[n].data[i * ny + j - 1]) * invdx2;
                          factor += 2 * invdx2;
                          break;
                        case "yy":
                          param[match] = (this.prevValues[n].data[(i + 1) * ny + j] + this.prevValues[n].data[(i - 1) * ny + j]) * invdy2;
                          factor += 2 * invdy2;
                          break;
                        case "xy":
                          param[match] = (this.prevValues[n].data[(i + 1) * ny + j + 1] + this.prevValues[n].data[(i - 1) * ny + j - 1]
                            - this.prevValues[n].data[(i + 1) * ny + j - 1] - this.prevValues[n].data[(i - 1) * ny + j + 1]) * invdxdy;
                          break;
                      }
                    }
                    if (factor > 0) {
                      this.values[n].data[i * ny + j] = this.codes[n].evaluate(param) / factor;
                    }
                  }
                }
                this.applyBoundaryConditionToCurrentValues(n, nx, ny, dx, dy);
                for (let i = 0; i < nx; i++) {
                  for (let j = 0; j < ny; j++) {
                    this.prevValues[n].data[i * ny + j] = this.values[n].data[i * ny + j];
                  }
                }
              }
              break;
            case "Gauss-Seidel": // faster convergence and smaller memory footprint
              for (let r = 0; r < this.relaxationSteps; r++) {
                for (let i = 1; i < nx - 1; i++) {
                  x = x0 + i * dx;
                  param["y"] = x;
                  for (let j = 1; j < ny - 1; j++) {
                    y = y0 + j * dy;
                    param["x"] = y;
                    factor = 0;
                    for (let match of derivativeMatches) {
                      let index = match.indexOf("_");
                      let fun = match.substring(0, index);
                      param[fun] = this.values[n].data[i * ny + j];
                      let variable = match.substring(index + 1);
                      switch (variable) {
                        case "x":
                          param[match] = (this.values[n].data[i * ny + j + 1] - this.values[n].data[i * ny + j - 1]) * invdx;
                          break;
                        case "y":
                          param[match] = (this.values[n].data[(i + 1) * ny + j] - this.values[n].data[(i - 1) * ny + j]) * invdy;
                          break;
                        case "xx":
                          param[match] = (this.values[n].data[i * ny + j + 1] + this.values[n].data[i * ny + j - 1]) * invdx2;
                          factor += 2 * invdx2;
                          break;
                        case "yy":
                          param[match] = (this.values[n].data[(i + 1) * ny + j] + this.values[n].data[(i - 1) * ny + j]) * invdy2;
                          factor += 2 * invdy2;
                          break;
                        case "xy":
                          param[match] = (this.values[n].data[(i + 1) * ny + j + 1] + this.values[n].data[(i - 1) * ny + j - 1]
                            - this.values[n].data[(i + 1) * ny + j - 1] - this.values[n].data[(i - 1) * ny + j + 1]) * invdxdy;
                          break;
                      }
                    }
                    if (factor > 0) {
                      this.values[n].data[i * ny + j] = this.codes[n].evaluate(param) / factor;
                    }
                  }
                }
                this.applyBoundaryConditionToCurrentValues(n, nx, ny, dx, dy);
              }
              break;
          }
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

  private applyBoundaryConditionToCurrentValues(n: number, nx: number, ny: number, dx: number, dy: number): void {
    if (this.boundaryValues[n] === undefined) return;
    switch (this.boundaryValues[n].north.type) {
      case "Dirichlet":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[(nx - 1) * ny + j] = this.boundaryValues[n].north.value;
        }
        break;
      case "Neumann":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[(nx - 1) * ny + j] = this.values[n].data[(nx - 2) * ny + j] + this.boundaryValues[n].north.value * dy;
        }
        break;
    }
    switch (this.boundaryValues[n].east.type) {
      case "Dirichlet":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[i * ny + ny - 1] = this.boundaryValues[n].east.value;
        }
        break;
      case "Neumann":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[i * ny + ny - 1] = this.values[n].data[i * ny + ny - 2] + this.boundaryValues[n].east.value * dx;
        }
        break;
    }
    switch (this.boundaryValues[n].south.type) {
      case "Dirichlet":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[j] = this.boundaryValues[n].south.value;
        }
        break;
      case "Neumann":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[j] = this.values[n].data[ny + j] - this.boundaryValues[n].south.value * dy;
        }
        break;
    }
    switch (this.boundaryValues[n].west.type) {
      case "Dirichlet":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[i * ny] = this.boundaryValues[n].west.value;
        }
        break;
      case "Neumann":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[i * ny] = this.values[n].data[i * ny + 1] - this.boundaryValues[n].west.value * dx;
        }
        break;
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
