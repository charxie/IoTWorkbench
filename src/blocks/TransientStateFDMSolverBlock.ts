/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart, math} from "../Main";
import {DataArray} from "./DataArray";
import {SolverBlock} from "./SolverBlock";

export class TransientStateFDMSolverBlock extends SolverBlock {

  private variables: string[] = ["t", "x"];
  private equations: string[] = ["T_t=T_xx"];
  private functions: string[] = []; // store the left-hand-side function names
  private lhsDerivativeOrders: number[];
  private rhsExpressions: string[] = [];
  private codes;
  private values: DataArray[];
  private prevValues: DataArray[];
  private nextValues: DataArray[];
  private initialValues: DataArray[];
  private readonly portNt: Port; // port for number of time steps
  private readonly portDt: Port; // port for length of time step
  private readonly portNX: Port; // port for number of space steps
  private readonly portX0: Port; // port for starting point in space
  private readonly portDx: Port; // port for length of space step
  private portI: Port[]; // ports for importing the initial results
  private portO: Port[]; // ports for exporting the final results
  private hasEquationError: boolean = false;
  private hasParserError: boolean = false;
  private hasDeclarationError: boolean = false;
  private relaxationSteps: number = 5;
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

    constructor(block: TransientStateFDMSolverBlock) {
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
    this.name = "Transient State FDM Solver Block";
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
          Util.deleteArrayElement(p, this.ports);
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
    let block = new TransientStateFDMSolverBlock("Transient State FDM Solver Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
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
    this.functions.length = 0;
    if (this.lhsDerivativeOrders === undefined || this.lhsDerivativeOrders.length !== n) {
      this.lhsDerivativeOrders = new Array(n);
    }
    this.rhsExpressions.length = 0;
    for (let i = 0; i < n; i++) {
      this.equations[i] = this.equations[i].replace(/\s/g, "");
      let equalSignIndex = this.equations[i].indexOf("=");
      if (equalSignIndex < 0) {
        Util.showBlockError("The equation you input " + this.equations[i] + " misses an equation sign (=).");
        this.hasEquationError = true;
      } else {
        let lhs = this.equations[i].substring(0, equalSignIndex);
        let rhs = this.equations[i].substring(equalSignIndex + 1);
        this.rhsExpressions.push(rhs);
        let matches = lhs.match(this.partialDerivativePattern);
        if (matches != null) {
          let derivativeSignIndex = matches[0].indexOf("_");
          if (derivativeSignIndex < 0) {
            this.lhsDerivativeOrders[i] = 0;
            this.functions.push(lhs);
          } else {
            let order = lhs.substring(derivativeSignIndex + 1);
            this.lhsDerivativeOrders[i] = order.length;
            this.functions.push(lhs.substring(0, derivativeSignIndex));
          }
        }
      }
    }
    if (this.values === undefined || this.values.length !== n) {
      this.values = new Array(n);
      this.prevValues = new Array(n);
      this.nextValues = new Array(n);
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
    if (this.codes === undefined || this.codes.length !== this.rhsExpressions.length) {
      this.codes = new Array(this.rhsExpressions.length);
    }
    this.hasParserError = false;
    try {
      for (let i = 0; i < this.rhsExpressions.length; i++) {
        this.codes[i] = math.parse(this.rhsExpressions[i]).compile();
      }
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasParserError = true;
    }
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

  private explicit(param): void {
    let count = this.portO.length;
    let dt = this.portDt.getValue();
    let dx = this.portDx.getValue();
    let x0 = this.portX0.getValue();
    for (let n = 0; n < count; n++) {
      let len = this.values[n].data.length - 1;
      let exp = this.rhsExpressions[n];
      let functionMatches = [];
      for (let fun of this.functions) {
        let found = false;
        let regex = new RegExp(fun, "g");
        let match: RegExpExecArray = regex.exec(exp);
        while (match != null) {
          if (exp.substr(match.index + 1, 1) !== "_") { // not partial derivative
            found = true;
            break;
          }
          regex.lastIndex = match.index + 1;
          match = regex.exec(exp);
        }
        if (found) {
          functionMatches.push(fun);
        }
      }
      // evaluate the right-hand-side of the n-th PDE
      let derivativeMatches = exp.match(this.partialDerivativePattern);
      for (let j = 1; j < len; j++) {
        param["x"] = x0 + j * dx;
        for (let match of functionMatches) { // this is where we support coupled equations
          param[match] = this.values[this.functions.indexOf(match)].data[j];
        }
        if (derivativeMatches != null && derivativeMatches.length > 0) {
          for (let match of derivativeMatches) {
            let index = match.indexOf("_");
            let order = match.substring(index + 1).length;
            let m = this.functions.indexOf(match.substring(0, index)); // this is where we support coupled equations
            switch (order) {
              case 1: // e.g., transport equation
                param[match] = (this.values[m].data[j] - this.values[m].data[j - 1]) / dx;
                break;
              case 2: // e.g., heat equation
                param[match] = (this.values[m].data[j + 1] + this.values[m].data[j - 1] - 2 * this.values[m].data[j]) / (dx * dx);
                break;
              case 3: // e.g., KdV equation
                if (j > 1 && j < len - 1) {
                  param[match] = (this.values[m].data[j + 2] - 2 * this.values[m].data[j + 1] + 2 * this.values[m].data[j - 1] - this.values[m].data[j - 2]) / (2 * dx * dx * dx);
                } else {
                  param[match] = 0;
                }
                break;
            }
          }
        }
        let rhsResult = this.codes[n].evaluate(param);
        // obtain the next values by shifting the current and previous values to the rhs result
        switch (this.lhsDerivativeOrders[n]) {
          case 0: // TODO: Let's deal with this later
            break;
          case 1:
            // lhs = (this.nextValues[n].data[j] - this.values[n].data[j]) / dt = rhs;
            this.nextValues[n].data[j] = this.values[n].data[j] + rhsResult * dt;
            break;
          case 2: // e.g., wave equation
            // lhs = (this.nextValues[n].data[j] + this.prevValues[n].data[j] - 2 * this.values[n].data[j]) / (dt * dt) = rhs;
            this.nextValues[n].data[j] = 2 * this.values[n].data[j] - this.prevValues[n].data[j] + rhsResult * dt * dt;
            break;
        }
      }
      this.values[n].data[0] = this.values[n].data[len] = 0;
      for (let j = 1; j < len; j++) {
        this.prevValues[n].data[j] = this.values[n].data[j];
        this.values[n].data[j] = this.nextValues[n].data[j];
      }
    }
  }

  private implicit(param): void {
    let count = this.portO.length;
    let dt = this.portDt.getValue();
    let dx = this.portDx.getValue();
    for (let n = 0; n < count; n++) {
      let len = this.values[n].data.length - 1;
      let exp = this.rhsExpressions[n];
      let rhs;
      let matches = exp.match(this.partialDerivativePattern);
      if (matches != null && matches.length > 0) {
        for (let k = 0; k < this.relaxationSteps; k++) {
          for (let j = 1; j < len; j++) {
            switch (this.lhsDerivativeOrders[n]) {
              case 1:
                for (let match of matches) {
                  let order = match.substring(match.indexOf("_") + 1).length;
                  switch (order) {
                    case 1: // transport equation
                      // lhs = (this.nextValues[n].data[j] - this.values[n].data[j]) / dt + this.nextValues[n].data[j] / dx;
                      rhs = this.nextValues[n].data[j - 1] / dx;
                      this.nextValues[n].data[j] = (this.values[n].data[j] + rhs * dt) / (1 + dt / dx);
                      break;
                    case 2: // heat equation
                      // lhs = this.nextValues[n].data[j] * (1 / dt + 2 / (dx * dx)) - this.values[n].data[j] / dt;
                      rhs = (this.nextValues[n].data[j - 1] + this.nextValues[n].data[j + 1]) / (dx * dx);
                      this.nextValues[n].data[j] = (this.values[n].data[j] + rhs * dt) / (1 + 2 * dt / (dx * dx));
                      break;
                  }
                }
                break;
              case 2: // wave equation
                // lhs = (this.prevValues[n].data[j] + this.nextValues[n].data[j] - 2 * this.values[n].data[j]) / (dt * dt);
                // rhs = (this.prevValues[n].data[j - 1] + this.prevValues[n].data[j + 1] - 2 * this.prevValues[n].data[j]
                //      + this.nextValues[n].data[j - 1] + this.nextValues[n].data[j + 1] - 2 * this.nextValues[n].data[j]) / (2 * dx * dx);
                rhs = this.prevValues[n].data[j - 1] + this.prevValues[n].data[j + 1] - 2 * this.prevValues[n].data[j]
                  + this.nextValues[n].data[j - 1] + this.nextValues[n].data[j + 1];
                rhs /= 2 * dx * dx;
                this.nextValues[n].data[j] = (2 * this.values[n].data[j] - this.prevValues[n].data[j] + rhs * dt * dt) / (1 + dt * dt / (dx * dx));
                break;
            }
          }
        }
      }
      this.values[n].data[0] = this.values[n].data[len] = 0;
      for (let j = 1; j < len; j++) {
        this.prevValues[n].data[j] = this.values[n].data[j];
        this.values[n].data[j] = this.nextValues[n].data[j];
      }
    }
  }

  updateModel(): void {
    let count = this.portO.length;
    let nt = this.portNt.getValue();
    let dt = this.portDt.getValue();
    let nx = this.portNX.getValue();
    let dx = this.portDx.getValue();
    for (let n = 0; n < count; n++) {
      if (this.initialValues[n] === undefined) {
        this.initialValues[n] = new DataArray(0);
      }
      this.initialValues[n].data = this.portI[n].getValue();
    }
    this.hasError = this.hasEquationError;
    if (this.equations && nx != undefined && dx != undefined && nt != undefined && dt != undefined) {
      let param = {...flowchart.globalVariables};
      param["t"] = nt * dt;
      for (let n = 0; n < count; n++) {
        if (this.values[n] === undefined && this.initialValues[n] !== undefined) {
          this.values[n] = this.initialValues[n].copy();
          this.prevValues[n] = this.initialValues[n].copy();
          this.nextValues[n] = this.initialValues[n].copy();
        }
      }
      try {
        switch (this.method) {
          case "Explicit":
            this.explicit(param);
            break;
          case "Implicit":
            this.implicit(param);
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
