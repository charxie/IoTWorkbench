/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart, math} from "../Main";
import {SolverBlock} from "./SolverBlock";

export class ODESolverBlock extends SolverBlock {

  private variableName: string = "t";
  private equations: string[] = ["x'=y", "y'=x"];
  private functions: string[] = []; // store the left-hand-side function names
  private expressions: string[] = []; // store the right-hand-side expressions
  private values: number[];
  private velocities: number[];
  private derivativeOrders: number[];
  private readonly portN: Port;
  private readonly portH: Port;
  private readonly portT: Port;
  private portO: Port[];
  private codes;
  private hasEquationError: boolean = false;
  private hasParserError: boolean = false;
  private hasDeclarationError: boolean = false;

  static State = class {
    readonly uid: string;
    readonly variableName: string;
    readonly equations: string[];
    readonly method: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: ODESolverBlock) {
      this.uid = block.uid;
      this.variableName = block.variableName;
      this.equations = block.equations.slice();
      this.method = block.method;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "ODE";
    this.name = "ODE Solver Block";
    this.method = "RK4";
    this.color = "#3CB371";
    this.portN = new Port(this, true, "N", 0, this.height / 3, false);
    this.portH = new Port(this, true, "H", 0, this.height * 2 / 3, false);
    this.ports.push(this.portN);
    this.ports.push(this.portH);
    let dh = this.height / (this.equations.length + 2);
    this.portT = new Port(this, false, "T", this.width, dh, true);
    this.ports.push(this.portT);
    this.setOutputPorts();
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
      let dh = this.height / (this.equations.length + 2);
      const firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < this.equations.length; i++) {
        let id = String.fromCharCode(k++);
        if (id === "H" || id === "N" || id === "T") { // skip over the existing port names
          id = String.fromCharCode(k++);
        }
        this.portO[i] = new Port(this, false, id, this.width, (i + 2) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new ODESolverBlock("ODE Solver Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.variableName = this.variableName;
    block.setEquations(this.equations);
    block.method = this.method;
    return block;
  }

  setVariableName(variableName: string): void {
    this.variableName = variableName;
  }

  getVariableName(): string {
    return this.variableName;
  }

  setEquations(equations: string[]): void {
    this.equations = equations.slice();
    let n = this.equations.length;
    if (this.derivativeOrders === undefined || this.derivativeOrders.length !== n) {
      this.derivativeOrders = new Array(n);
    }
    this.expressions.length = 0;
    this.functions.length = 0;
    for (let i = 0; i < n; i++) {
      this.equations[i] = this.equations[i].removeAllSpaces();
      let equalSignIndex = this.equations[i].indexOf("=");
      if (equalSignIndex < 0) {
        Util.showBlockError("The equation you input " + this.equations[i] + " misses an equation sign (=)");
        this.hasEquationError = true;
      } else {
        let lhs = this.equations[i].substring(0, equalSignIndex);
        let rhs = this.equations[i].substring(equalSignIndex + 1);
        let apostropheCount = (lhs.match(/'/g) || []).length;
        if (apostropheCount <= 0) {
          this.derivativeOrders[i] = 0;
          this.functions.push(lhs);
        } else {
          this.derivativeOrders[i] = apostropheCount;
          this.functions.push(lhs.substring(0, lhs.indexOf("'")));
        }
        this.expressions.push(rhs);
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
    for (let i = 0; i < this.expressions.length; i++) {
      let exp = flowchart.replaceWithDeclaredFunctions(this.expressions[i]);
      if (exp != this.expressions[i]) {
        try {
          this.codes[i] = math.parse(exp).compile();
        } catch (e) {
          console.log(e.stack);
          Util.showBlockError(e.toString());
          this.hasDeclarationError = true;
        }
      }
    }
  }

  reset(): void {
    super.reset();
    for (let i = 0; i < this.values.length; i++) {
      this.values[i] = undefined;
    }
  }

  refreshView(): void {
    super.refreshView();
    this.portN.setY(this.height / 3);
    this.portH.setY(this.height * 2 / 3);
    let dh = this.height / (this.equations.length + 2);
    this.portT.setX(this.width);
    this.portT.setY(dh);
    for (let i = 0; i < this.equations.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 2) * dh);
    }
  }

  updateModel(): void {
    let n = this.portN.getValue();
    let h = this.portH.getValue();
    this.hasError = this.hasEquationError || this.hasParserError || this.hasDeclarationError;
    if (this.equations && n != undefined && h != undefined) {
      let t = n * h;
      this.portT.setValue(t);
      let param = {...flowchart.globalVariables};
      param[this.variableName] = t;
      let count = this.portO.length;
      for (let i = 0; i < count; i++) {
        if (this.values[i] === undefined) {
          this.values[i] = param[this.functions[i]];
        }
      }
      try {
        switch (this.method) {
          case "Velocity-Verlet":
            if (this.velocities === undefined || this.velocities.length !== count) {
              this.velocities = new Array(count);
              for (let i = 0; i < count; i++) {
                this.velocities[i] = 0;
              }
            }
            let vm;
            for (let i = 0; i < count; i++) {
              if (this.derivativeOrders[i] === 2) {
                vm = this.velocities[i] + this.codes[i].evaluate(param) * h / 2;
                this.values[i] += vm * h;
                param[this.functions[i]] = this.values[i];
                this.velocities[i] = vm + this.codes[i].evaluate(param) * h / 2;
              } else if (this.derivativeOrders[i] === 1) {
                this.values[i] = this.velocities[i - 1];
                param[this.expressions[i]] = this.values[i];
              }
            }
            break;
          case "Euler":
            for (let i = 0; i < count; i++) {
              if (this.derivativeOrders[i] === 1) {
                this.values[i] += h * this.codes[i].evaluate(param);
              } else if (this.derivativeOrders[i] === 0) {
                this.values[i] = this.codes[i].evaluate(param);
              }
              param[this.functions[i]] = this.values[i];
            }
            break;
          case "RK4":
            let h2 = h / 2;
            let f0, k1, k2, k3, k4;
            for (let i = 0; i < count; i++) {
              if (this.derivativeOrders[i] === 1) {
                f0 = this.values[i];
                k1 = this.codes[i].evaluate(param);
                param[this.variableName] = t + h2;
                param[this.functions[i]] = f0 + k1 * h2;
                k2 = this.codes[i].evaluate(param);
                param[this.functions[i]] = f0 + k2 * h2;
                k3 = this.codes[i].evaluate(param);
                param[this.variableName] = t + h;
                param[this.functions[i]] = f0 + k3 * h;
                k4 = this.codes[i].evaluate(param);
                this.values[i] += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
              } else if (this.derivativeOrders[i] === 0) {
                this.values[i] = this.codes[i].evaluate(param);
              }
              param[this.functions[i]] = this.values[i];
            }
            break;
        }
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
      for (let i = 0; i < count; i++) {
        this.portO[i].setValue(this.values[i]);
      }
      this.updateConnectors();
    } else {
      this.portT.setValue(undefined);
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
