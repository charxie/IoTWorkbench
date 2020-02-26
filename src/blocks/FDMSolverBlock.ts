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
  private readonly portN: Port; // port for number of space steps
  private readonly portDx: Port; // port for space step
  private readonly portDt: Port; // port for time step
  private portO: Port[]; // ports for export results (unknown functions)
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
    this.method = "Explicit";
    this.color = "#B0E0E6";
    this.portN = new Port(this, true, "N", 0, this.height / 4, false);
    this.portDx = new Port(this, true, "DX", 0, this.height / 2, false);
    this.portDt = new Port(this, true, "DT", 0, this.height * 3 / 4, false);
    this.ports.push(this.portN);
    this.ports.push(this.portDx);
    this.ports.push(this.portDt);
    this.setOutputPorts();
    this.marginX = 25;
    this.marginY = 15;
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
      let nm = "F";
      for (let i = 0; i < this.equations.length; i++) {
        this.portO[i] = new Port(this, false, "F" + (i + 1), this.width, (i + 2) * dh, true);
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
    }
    this.createParsers();
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
    this.portN.setY(this.height / 4);
    this.portDx.setY(this.height / 2);
    this.portDt.setY(this.height * 3 / 4);
    let dh = this.height / (this.equations.length + 1);
    for (let i = 0; i < this.equations.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let n = this.portN.getValue();
    let h = this.portDx.getValue();
    let k = this.portDt.getValue();
    this.hasError = this.hasEquationError;
    if (this.equations && n != undefined && h != undefined && k != undefined) {
      let param = {...flowchart.globalVariables};
      for (let v of this.variables) {
        //param[v] = t;
      }
      let count = this.portO.length;
      for (let i = 0; i < count; i++) {
        if (this.values[i] === undefined) {
          //this.values[i] = param[this.functions[i]];
        }
      }
      try {
        switch (this.method) {
          case "Explicit":
            for (let i = 0; i < count; i++) {
              //param[this.functions[i]] = this.values[i];
            }
            break;
          case "Implicit":
            for (let i = 0; i < count; i++) {
            }
            break;
        }
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
      for (let i = 0; i < count; i++) {
        //this.portO[i].setValue(this.values[i].data);
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
