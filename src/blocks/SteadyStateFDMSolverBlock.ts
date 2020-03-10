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
  private initValues: DataArray[];
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
  private relaxationFactor: number = 1.5;
  private readonly partialDerivativePattern = /[a-zA-Z]+_[a-zA-Z]+/g;
  private readonly coefficientCodeMap = {};

  static State = class {
    readonly uid: string;
    readonly variables: string[];
    readonly equations: string[];
    readonly method: string;
    readonly relaxationSteps: number;
    readonly relaxationFactor: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: SteadyStateFDMSolverBlock) {
      this.uid = block.uid;
      this.variables = block.variables.slice();
      this.equations = block.equations.slice();
      this.method = block.method;
      this.relaxationSteps = block.relaxationSteps;
      this.relaxationFactor = block.relaxationFactor;
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
    this.method = "Gauss-Seidel";
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
    block.setEquations(this.equations);
    block.method = this.method;
    block.relaxationSteps = this.relaxationSteps;
    block.relaxationFactor = this.relaxationFactor;
    return block;
  }

  setRelaxationSteps(relaxationSteps: number): void {
    this.relaxationSteps = relaxationSteps;
  }

  getRelaxationSteps(): number {
    return this.relaxationSteps;
  }

  setRelaxationFactor(relaxationFactor: number): void {
    this.relaxationFactor = relaxationFactor;
  }

  getRelaxationFactor(): number {
    return this.relaxationFactor;
  }

  setVariables(variables: string[]): void {
    this.variables = variables.slice();
  }

  getVariables(): string[] {
    return this.variables;
  }

  setEquations(equations: string[]): void {
    this.equations = equations.slice();
    let n = this.equations.length;
    this.expressions.length = 0;
    for (let i = 0; i < n; i++) {
      this.equations[i] = this.equations[i].removeAllSpaces(); // no space is allowed before parsing
      let equalSignIndex = this.equations[i].indexOf("=");
      if (equalSignIndex < 0) {
        Util.showBlockError("The equation you input " + this.equations[i] + " misses an equation sign (=).");
        this.hasEquationError = true;
      } else {
        this.expressions.push(this.equations[i].substring(0, equalSignIndex)); // store the right-hand-side expression
      }
    }
    if (this.values === undefined || this.values.length !== n) {
      this.values = new Array(n);
      this.prevValues = new Array(n); // this is needed for the Jacobi method
    }
    if (this.initValues === undefined || this.initValues.length !== n) {
      this.initValues = new Array(n);
    }
    if (this.boundaryValues === undefined || this.boundaryValues.length !== n) {
      this.boundaryValues = new Array(n);
    }
    this.createParsers();
    this.setInputPorts();
    this.setOutputPorts();
    this.refreshView();
  }

  // coefficients may use global variables and declared functions
  findCoefficients(): void {
    for (let i = 0; i < this.expressions.length; i++) {
      let terms = this.expressions[i].split(/(?=[+-])/g);
      let functionNames = [];
      try {
        for (let term of terms) {
          let deriv = term.match(this.partialDerivativePattern);
          if (deriv !== null) {
            let s = deriv.toString();
            let coeff = term.replaceAll(s, "1");
            coeff = flowchart.replaceWithDeclaredFunctions(coeff);
            this.coefficientCodeMap[s] = math.parse(coeff).compile();
            let index = s.indexOf("_");
            let name = s.substring(0, index);
            if (functionNames.indexOf(name) === -1) {
              functionNames.push(name);
            }
          }
        }
        for (let term of terms) {
          let t = term.match(this.partialDerivativePattern);
          if (t === null) {
            for (let name of functionNames) {
              if (term.indexOf(name) !== -1) {
                let coeff = term.replaceAll(name, "1");
                coeff = flowchart.replaceWithDeclaredFunctions(coeff);
                this.coefficientCodeMap[name] = math.parse(coeff).compile();
              }
            }
          }
        }
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasEquationError = true;
      }
    }
    //console.log(this.coefficientCodeMap)
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
      for (let i = 0; i < this.codes.length; i++) {
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
      if (this.initValues[i] != undefined) {
        this.portO[i].setValue(this.initValues[i].data);
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
    this.hasError = this.hasEquationError || this.hasDeclarationError;
    if (this.equations && x0 != undefined && nx != undefined && dx != undefined && y0 != undefined && ny != undefined && dy != undefined) {
      for (let n = 0; n < count; n++) {
        if (this.initValues[n] === undefined) {
          this.initValues[n] = new DataArray(0);
        }
        if (this.portI[n].getValue() !== undefined) {
          this.initValues[n].data = this.portI[n].getValue();
        } else {
          if (this.initValues[n].data.length !== nx * ny) {
            this.initValues[n].data = new Array(nx * ny);
          }
          this.initValues[n].fill(0);
        }
        this.boundaryValues[n] = this.portB[n].getValue();
      }
      let param = {...flowchart.globalVariables};
      for (let n = 0; n < count; n++) {
        if (this.values[n] === undefined) {
          this.values[n] = new DataArray(nx * ny);
          if (this.initValues[n] !== undefined) {
            this.values[n] = this.initValues[n].copy();
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
      let fun;
      let divider;
      try {
        for (let n = 0; n < count; n++) {
          let derivativeMatches = this.expressions[n].match(this.partialDerivativePattern);
          if (derivativeMatches === null || derivativeMatches.length === 0) continue;
          switch (this.method) {
            case "Jacobi": // maybe more intuitive, but slower convergence and larger memory footprint
              for (let r = 0; r < this.relaxationSteps; r++) {
                for (let i = 1; i < nx - 1; i++) {
                  x = x0 + i * dx;
                  param["x"] = x;
                  for (let j = 1; j < ny - 1; j++) {
                    y = y0 + j * dy;
                    param["y"] = y;
                    divider = 0;
                    for (let match of derivativeMatches) {
                      let index = match.indexOf("_");
                      fun = match.substring(0, index);
                      param[fun] = 0;
                      let prefactor = this.coefficientCodeMap[match.toString()].evaluate(param);
                      let variable = match.substring(index + 1);
                      switch (variable) {
                        case "x":
                          param[match] = (this.prevValues[n].data[j * nx + i + 1] - this.prevValues[n].data[j * nx + i - 1]) * invdx;
                          break;
                        case "y":
                          param[match] = (this.prevValues[n].data[(j + 1) * nx + i] - this.prevValues[n].data[(j - 1) * nx + i]) * invdy;
                          break;
                        case "xx":
                          param[match] = (this.prevValues[n].data[j * nx + i + 1] + this.prevValues[n].data[j * nx + i - 1]) * invdx2;
                          divider += prefactor * 2 * invdx2;
                          break;
                        case "yy":
                          param[match] = (this.prevValues[n].data[(j + 1) * nx + i] + this.prevValues[n].data[(j - 1) * nx + i]) * invdy2;
                          divider += prefactor * 2 * invdy2;
                          break;
                        case "xy":
                          param[match] = (this.prevValues[n].data[(j + 1) * nx + i + 1] + this.prevValues[n].data[(j - 1) * nx + i - 1]
                            - this.prevValues[n].data[(j + 1) * nx + i - 1] - this.prevValues[n].data[(j - 1) * nx + i + 1]) * invdxdy;
                          break;
                      }
                    }
                    if (this.coefficientCodeMap[fun]) {
                      divider -= this.coefficientCodeMap[fun].evaluate(param);
                    }
                    if (divider !== 0) {
                      //if (i == 1 && j == 1) console.log(param)
                      this.values[n].data[j * nx + i] = this.codes[n].evaluate(param) / divider;
                    }
                  }
                }
                this.applyBoundaryConditionToCurrentValues(n, nx, ny, dx, dy);
                for (let i = 0; i < nx; i++) {
                  for (let j = 0; j < ny; j++) {
                    this.prevValues[n].data[j * nx + i] = this.values[n].data[j * nx + i];
                  }
                }
              }
              break;
            case "Gauss-Seidel": // faster convergence and smaller memory footprint
              for (let r = 0; r < this.relaxationSteps; r++) {
                for (let i = 1; i < nx - 1; i++) {
                  x = x0 + i * dx;
                  param["x"] = x;
                  for (let j = 1; j < ny - 1; j++) {
                    y = y0 + j * dy;
                    param["y"] = y;
                    divider = 0;
                    for (let match of derivativeMatches) {
                      let index = match.indexOf("_");
                      let fun = match.substring(0, index);
                      param[fun] = 0;
                      let prefactor = this.coefficientCodeMap[match.toString()].evaluate(param);
                      let variable = match.substring(index + 1);
                      switch (variable) {
                        case "x":
                          param[match] = (this.values[n].data[j * nx + i + 1] - this.values[n].data[j * nx + i - 1]) * invdx;
                          break;
                        case "y":
                          param[match] = (this.values[n].data[(j + 1) * nx + i] - this.values[n].data[(j - 1) * nx + i]) * invdy;
                          break;
                        case "xx":
                          param[match] = (this.values[n].data[j * nx + i + 1] + this.values[n].data[j * nx + i - 1]) * invdx2;
                          divider += prefactor * 2 * invdx2;
                          break;
                        case "yy":
                          param[match] = (this.values[n].data[(j + 1) * nx + i] + this.values[n].data[(j - 1) * nx + i]) * invdy2;
                          divider += prefactor * 2 * invdy2;
                          break;
                        case "xy":
                          param[match] = (this.values[n].data[(j + 1) * nx + i + 1] + this.values[n].data[(j - 1) * nx + i - 1]
                            - this.values[n].data[(j + 1) * nx + i - 1] - this.values[n].data[(j - 1) * nx + i + 1]) * invdxdy;
                          break;
                      }
                    }
                    if (this.coefficientCodeMap[fun]) {
                      divider -= this.coefficientCodeMap[fun].evaluate(param);
                    }
                    if (divider !== 0) {
                      this.values[n].data[j * nx + i] = this.codes[n].evaluate(param) / divider;
                    }
                  }
                }
                this.applyBoundaryConditionToCurrentValues(n, nx, ny, dx, dy);
              }
              break;
            case "Successive Over-Relaxation":
              for (let r = 0; r < this.relaxationSteps; r++) {
                for (let i = 1; i < nx - 1; i++) {
                  x = x0 + i * dx;
                  param["x"] = x;
                  for (let j = 1; j < ny - 1; j++) {
                    y = y0 + j * dy;
                    param["y"] = y;
                    divider = 0;
                    for (let match of derivativeMatches) {
                      let index = match.indexOf("_");
                      let fun = match.substring(0, index);
                      param[fun] = 0;
                      let prefactor = this.coefficientCodeMap[match.toString()].evaluate(param);
                      let variable = match.substring(index + 1);
                      switch (variable) {
                        case "x":
                          param[match] = (this.values[n].data[j * nx + i + 1] - this.values[n].data[j * nx + i - 1]) * invdx;
                          break;
                        case "y":
                          param[match] = (this.values[n].data[(j + 1) * nx + i] - this.values[n].data[(j - 1) * nx + i]) * invdy;
                          break;
                        case "xx":
                          param[match] = (this.values[n].data[j * nx + i + 1] + this.values[n].data[j * nx + i - 1]) * invdx2;
                          divider += prefactor * 2 * invdx2;
                          break;
                        case "yy":
                          param[match] = (this.values[n].data[(j + 1) * nx + i] + this.values[n].data[(j - 1) * nx + i]) * invdy2;
                          divider += prefactor * 2 * invdy2;
                          break;
                        case "xy":
                          param[match] = (this.values[n].data[(j + 1) * nx + i + 1] + this.values[n].data[(j - 1) * nx + i - 1]
                            - this.values[n].data[(j + 1) * nx + i - 1] - this.values[n].data[(j - 1) * nx + i + 1]) * invdxdy;
                          break;
                      }
                    }
                    if (this.coefficientCodeMap[fun]) {
                      divider -= this.coefficientCodeMap[fun].evaluate(param);
                    }
                    if (divider > 0) {
                      this.values[n].data[j * nx + i] = (1 - this.relaxationFactor) * this.values[n].data[j * nx + i] + this.relaxationFactor * this.codes[n].evaluate(param) / divider;
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
        for (let i = 0; i < nx; i++) {
          this.values[n].data[(ny - 1) * nx + i] = this.boundaryValues[n].north.value;
        }
        break;
      case "Neumann":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[(ny - 1) * nx + i] = this.values[n].data[(ny - 2) * nx + i] + this.boundaryValues[n].north.value * dy;
        }
        break;
    }
    switch (this.boundaryValues[n].east.type) {
      case "Dirichlet":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[j * nx + nx - 1] = this.boundaryValues[n].east.value;
        }
        break;
      case "Neumann":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[j * nx + nx - 1] = this.values[n].data[j * nx + nx - 2] + this.boundaryValues[n].east.value * dx;
        }
        break;
    }
    switch (this.boundaryValues[n].south.type) {
      case "Dirichlet":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[i] = this.boundaryValues[n].south.value;
        }
        break;
      case "Neumann":
        for (let i = 0; i < nx; i++) {
          this.values[n].data[i] = this.values[n].data[nx + i] - this.boundaryValues[n].south.value * dy;
        }
        break;
    }
    switch (this.boundaryValues[n].west.type) {
      case "Dirichlet":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[j * nx] = this.boundaryValues[n].west.value;
        }
        break;
      case "Neumann":
        for (let j = 0; j < ny; j++) {
          this.values[n].data[j * nx] = this.values[n].data[j * nx + 1] - this.boundaryValues[n].west.value * dx;
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
