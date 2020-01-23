/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {flowchart, math} from "../Main";
import {Block} from "./Block";
import {Util} from "../Util";

export class ParametricEquationBlock extends Block {

  private expressionX: string = "cos(t)";
  private expressionY: string = "sin(t)";
  private nodeX;
  private codeX;
  private nodeY;
  private codeY;

  private readonly portT: Port;
  private readonly portX: Port;
  private readonly portY: Port;

  static State = class {
    readonly uid: string;
    readonly expressionX: string;
    readonly expressionY: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: ParametricEquationBlock) {
      this.uid = block.uid;
      this.expressionX = block.expressionX;
      this.expressionY = block.expressionY;
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
    this.expressionX = "cos(t)";
    this.expressionY = "sin(t)";
    this.color = "#A0522D";
    this.portT = new Port(this, true, "T", 0, this.height / 2, false);
    this.portX = new Port(this, false, "X", this.width, this.height / 3, true);
    this.portY = new Port(this, false, "Y", this.width, this.height * 2 / 3, true);
    this.ports.push(this.portT);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.margin = 15;
  }

  getCopy(): Block {
    let block = new ParametricEquationBlock("Parametric Equation Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.expressionX = this.expressionX;
    block.expressionY = this.expressionY;
    return block;
  }

  destroy(): void {
  }

  setExpressionX(expressionX: string): void {
    this.expressionX = expressionX;
    this.createParserX();
  }

  getExpressionX(): string {
    return this.expressionX;
  }

  setExpressionY(expressionY: string): void {
    this.expressionY = expressionY;
    this.createParserY();
  }

  getExpressionY(): string {
    return this.expressionY;
  }

  private createParserX(): void {
    this.nodeX = math.parse(this.expressionX);
    this.codeX = this.nodeX.compile();
  }

  private createParserY(): void {
    this.nodeY = math.parse(this.expressionY);
    this.codeY = this.nodeY.compile();
  }

  refreshView(): void {
    super.refreshView();
    this.portT.setY(this.height / 2);
    this.portX.setX(this.width);
    this.portX.setY(this.height / 3);
    this.portY.setX(this.width);
    this.portY.setY(this.height * 2 / 3);
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = Util.getOS() == "Android" ? "italic 9px Noto Serif" : "italic 9px Times New Roman";
      this.drawTextAt(this.symbol, 0, 0, ctx);
    } else {
      ctx.font = Util.getOS() == "Android" ? "italic 16px Noto Serif" : "italic 16px Times New Roman";
      this.drawTextAt("x=" + this.expressionX, 0, -10, ctx);
      this.drawTextAt("y=" + this.expressionY, 0, 10, ctx);
    }
  }

  updateModel(): void {
    this.hasError = false;
    let t = this.portT.getValue();
    if (this.expressionX && this.expressionY && t != undefined) {
      try {
        if (this.codeX == undefined) this.createParserX();
        if (this.codeY == undefined) this.createParserY();
        let param = {...flowchart.globalVariables};
        if (Array.isArray(t)) {
          let x = new Array(t.length);
          let y = new Array(t.length);
          for (let i = 0; i < t.length; i++) {
            param["t"] = t[i];
            x[i] = this.codeX.evaluate(param);
            y[i] = this.codeY.evaluate(param);
          }
          this.portX.setValue(x);
          this.portY.setValue(y);
        } else {
          param["t"] = t;
          this.portX.setValue(this.codeX.evaluate(param));
          this.portY.setValue(this.codeY.evaluate(param));
        }
        this.updateConnectors();
      } catch (e) {
        console.log(e.stack);
        Util.showErrorMessage(e.toString());
        this.hasError = true;
      }
    } else {
      this.portX.setValue(undefined);
      this.portY.setValue(undefined);
    }
  }

}
