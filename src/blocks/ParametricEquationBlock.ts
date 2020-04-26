/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {flowchart, math} from "../Main";
import {Block} from "./Block";
import {Util} from "../Util";

export class ParametricEquationBlock extends Block {

  private parameterName1: string = "t";
  private parameterName2: string = "";
  private expressionX: string = "cos(t)";
  private expressionY: string = "sin(t)";
  private expressionZ: string = "";
  private codeX;
  private codeY;
  private codeZ;
  private readonly portT: Port;
  private readonly portV: Port;
  private readonly portX: Port;
  private readonly portY: Port;
  private readonly portZ: Port;
  private hasParserXError: boolean = false;
  private hasParserYError: boolean = false;
  private hasParserZError: boolean = false;
  private hasDeclarationError: boolean = false;

  static State = class {
    readonly uid: string;
    readonly parameterName1: string;
    readonly parameterName2: string;
    readonly expressionX: string;
    readonly expressionY: string;
    readonly expressionZ: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: ParametricEquationBlock) {
      this.uid = block.uid;
      this.parameterName1 = block.parameterName1;
      this.parameterName2 = block.parameterName2;
      this.expressionX = block.expressionX;
      this.expressionY = block.expressionY;
      this.expressionZ = block.expressionZ;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "x(t), y(t)";
    this.name = "Parametric Equation Block";
    this.parameterName1 = "t";
    this.parameterName2 = "";
    this.expressionX = "cos(t)";
    this.expressionY = "sin(t)";
    this.expressionZ = "";
    this.color = "#A0522D";
    this.portT = new Port(this, true, "T", 0, this.height / 3, false);
    this.portV = new Port(this, true, "V", 0, this.height * 2 / 3, false);
    this.portX = new Port(this, false, "X", this.width, this.height / 3, true);
    this.portY = new Port(this, false, "Y", this.width, this.height * 2 / 3, true);
    this.portZ = new Port(this, false, "Z", this.width, this.height, true);
    this.ports.push(this.portT);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
  }

  getCopy(): Block {
    let block = new ParametricEquationBlock("Parametric Equation Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.setParameterName1(this.parameterName1);
    block.setParameterName2(this.parameterName2);
    block.setExpressionX(this.expressionX);
    block.setExpressionY(this.expressionY);
    block.setExpressionZ(this.expressionZ);
    block.useDeclaredFunctions();
    return block;
  }

  destroy(): void {
  }

  setParameterName1(parameterName1: string): void {
    this.parameterName1 = parameterName1;
  }

  getParameterName1(): string {
    return this.parameterName1;
  }

  setParameterName2(parameterName2: string): void {
    let index = this.ports.indexOf(this.portV);
    if (parameterName2.trim() !== "") {
      this.parameterName2 = parameterName2;
      if (index === -1) {
        this.ports.insertAt(1, this.portV);
      }
    } else {
      this.parameterName2 = "";
      if (index !== -1) {
        this.ports.removeItem(this.portV);
      }
    }
    this.refreshView();
  }

  getParameterName2(): string {
    return this.parameterName2;
  }

  setExpressionX(expressionX: string): void {
    this.expressionX = expressionX.replace(/\s/g, "");
    this.createParserX();
  }

  getExpressionX(): string {
    return this.expressionX;
  }

  setExpressionY(expressionY: string): void {
    this.expressionY = expressionY.replace(/\s/g, "");
    this.createParserY();
  }

  getExpressionY(): string {
    return this.expressionY;
  }

  setExpressionZ(expressionZ: string): void {
    let index = this.ports.indexOf(this.portZ);
    if (expressionZ.trim() !== "") {
      this.expressionZ = expressionZ.replace(/\s/g, "");
      this.createParserZ();
      if (index === -1) {
        this.ports.push(this.portZ); // assuming that Z is always the last in the ports array
      }
    } else {
      this.expressionZ = "";
      if (index !== -1) {
        this.ports.pop(); // assuming that Z is always the last in the ports array
      }
    }
    this.refreshView();
  }

  getExpressionZ(): string {
    return this.expressionZ;
  }

  useDeclaredFunctions() {
    this.hasDeclarationError = false;
    let exp = flowchart.replaceWithDeclaredFunctions(this.expressionX);
    if (exp != this.expressionX) {
      try {
        this.codeX = math.parse(exp).compile();
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasDeclarationError = true;
      }
    }
    exp = flowchart.replaceWithDeclaredFunctions(this.expressionY);
    if (exp != this.expressionY) {
      try {
        this.codeY = math.parse(exp).compile();
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasDeclarationError = true;
      }
    }
    if (this.expressionZ !== "") {
      exp = flowchart.replaceWithDeclaredFunctions(this.expressionZ);
      if (exp != this.expressionZ) {
        try {
          this.codeZ = math.parse(exp).compile();
        } catch (e) {
          console.log(e.stack);
          Util.showBlockError(e.toString());
          this.hasDeclarationError = true;
        }
      }
    }
  }

  private createParserX(): void {
    this.hasParserXError = false;
    try {
      this.codeX = math.parse(this.expressionX).compile();
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasParserXError = true;
    }
  }

  private createParserY(): void {
    this.hasParserYError = false;
    try {
      this.codeY = math.parse(this.expressionY).compile();
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasParserYError = true;
    }
  }

  private createParserZ(): void {
    this.hasParserZError = false;
    try {
      this.codeZ = math.parse(this.expressionZ).compile();
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasParserZError = true;
    }
  }

  refreshView(): void {
    super.refreshView();
    if (this.parameterName2 === "") {
      this.portT.setY(this.height / 2);
    } else {
      this.portT.setY(this.height / 3);
      this.portV.setY(this.height * 2 / 3);
    }
    this.portX.setX(this.width);
    this.portY.setX(this.width);
    if (this.expressionZ === "") {
      this.portX.setY(this.height / 3);
      this.portY.setY(this.height * 2 / 3);
    } else {
      this.portZ.setX(this.width);
      this.portX.setY(this.height / 4);
      this.portY.setY(this.height / 2);
      this.portZ.setY(this.height * 3 / 4);
    }
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = Util.getOS() == "Android" ? "italic 9px Noto Serif" : "italic 9px Times New Roman";
      this.drawTextAt(this.symbol, 0, 0, ctx);
    } else {
      ctx.font = Util.getOS() == "Android" ? "italic 16px Noto Serif" : "italic 16px Times New Roman";
      if (this.expressionZ !== "") {
        let h = this.height / 4;
        this.drawTextAt("x=" + this.expressionX, 0, -h, ctx);
        this.drawTextAt("y=" + this.expressionY, 0, 0, ctx);
        this.drawTextAt("z=" + this.expressionZ, 0, h, ctx);
      } else {
        let h = this.height / 3;
        this.drawTextAt("x=" + this.expressionX, 0, -h / 2, ctx);
        this.drawTextAt("y=" + this.expressionY, 0, h / 2, ctx);
      }
    }
  }

  updateModel(): void {
    this.hasError = this.hasParserXError || this.hasParserYError || this.hasParserZError || this.hasDeclarationError;
    if (this.expressionX && this.expressionY && this.parameterName1) { // minimum requirement
      if (this.parameterName2.trim() === "") { // parameter 2 is not defined
        let t = this.portT.getValue();
        if (t !== undefined) {
          try {
            if (this.codeX == undefined) this.createParserX();
            if (this.codeY == undefined) this.createParserY();
            if (this.expressionZ !== "" && this.codeZ == undefined) this.createParserZ();
            let param = {...flowchart.globalVariables};
            if (Array.isArray(t)) {
              let x = new Array(t.length);
              let y = new Array(t.length);
              for (let i = 0; i < t.length; i++) {
                param[this.parameterName1] = t[i];
                x[i] = this.codeX.evaluate(param);
                y[i] = this.codeY.evaluate(param);
              }
              this.portX.setValue(x);
              this.portY.setValue(y);
              if (this.expressionZ !== "") {
                let z = new Array(t.length);
                for (let i = 0; i < t.length; i++) {
                  param[this.parameterName1] = t[i];
                  z[i] = this.codeZ.evaluate(param);
                }
                this.portZ.setValue(z);
              }
            } else {
              param[this.parameterName1] = t;
              this.portX.setValue(this.codeX.evaluate(param));
              this.portY.setValue(this.codeY.evaluate(param));
              if (this.expressionZ !== "") {
                this.portZ.setValue(this.codeZ.evaluate(param));
              }
            }
            this.updateConnectors();
          } catch (e) {
            console.log(e.stack);
            Util.showBlockError(e.toString());
            this.hasError = true;
          }
        }
      } else { // parameter 2 is defined
        let u = this.portT.getValue();
        let v = this.portV.getValue();
        if (u !== undefined && v !== undefined) {
          try {
            if (this.codeX === undefined) this.createParserX();
            if (this.codeY === undefined) this.createParserY();
            if (this.codeZ === undefined) this.createParserZ();
            let param = {...flowchart.globalVariables};
            if (Array.isArray(u) && Array.isArray(v)) {
              let n = u.length * v.length;
              let x = new Array(n);
              let y = new Array(n);
              let z = new Array(n);
              for (let i = 0; i < u.length; i++) {
                param[this.parameterName1] = u[i];
                for (let j = 0; j < v.length; j++) {
                  param[this.parameterName2] = v[j];
                  let k = i * v.length + j;
                  x[k] = this.codeX.evaluate(param);
                  y[k] = this.codeY.evaluate(param);
                  z[k] = this.codeZ.evaluate(param);
                }
              }
              this.portX.setValue(x);
              this.portY.setValue(y);
              this.portZ.setValue(z);
            } else {
              param[this.parameterName1] = u;
              param[this.parameterName2] = v;
              this.portX.setValue(this.codeX.evaluate(param));
              this.portY.setValue(this.codeY.evaluate(param));
              this.portZ.setValue(this.codeZ.evaluate(param));
            }
            this.updateConnectors();
          } catch (e) {
            console.log(e.stack);
            Util.showBlockError(e.toString());
            this.hasError = true;
          }
        }
      }
    } else {
      this.portX.setValue(undefined);
      this.portY.setValue(undefined);
      this.portZ.setValue(undefined);
    }
  }

}
