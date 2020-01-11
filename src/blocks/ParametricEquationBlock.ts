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
  private secondaryVariables: string[];

  private readonly portT: Port;
  private readonly portX: Port;
  private readonly portY: Port;

  static State = class {
    readonly uid: string;
    readonly expressionX: string;
    readonly expressionY: string;
    readonly secondaryVariables: string[];
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: ParametricEquationBlock) {
      this.uid = block.uid;
      this.expressionX = block.expressionX;
      this.expressionY = block.expressionY;
      if (block.secondaryVariables) {
        this.secondaryVariables = JSON.parse(JSON.stringify(block.secondaryVariables));
      }
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
    block.secondaryVariables = JSON.parse(JSON.stringify(this.secondaryVariables));
    return block;
  }

  destroy(): void {
  }

  setExpressionX(expressionX: string): void {
    this.expressionX = expressionX;
  }

  getExpressionX(): string {
    return this.expressionX;
  }

  setExpressionY(expressionY: string): void {
    this.expressionY = expressionY;
  }

  getExpressionY(): string {
    return this.expressionY;
  }

  addSecondaryVariable(v: string): void {
    if (this.secondaryVariables == undefined) {
      this.secondaryVariables = [];
    }
    this.secondaryVariables.push(v);
  }

  getSecondaryVariables(): string[] {
    return this.secondaryVariables;
  }

  setSecondaryVariables(v: string[]): void {
    this.secondaryVariables = v;
  }

  refreshView(): void {
    this.portT.setY(this.height / 2);
    this.portX.setX(this.width);
    this.portX.setY(this.height / 3);
    this.portY.setX(this.width);
    this.portY.setY(this.height * 2 / 3);
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = "italic 9px Times";
      this.drawTextAt(this.symbol, 0, 0, ctx);
    } else {
      ctx.font = "italic 16px Times";
      this.drawTextAt("x=" + this.expressionX, 0, -10, ctx);
      this.drawTextAt("y=" + this.expressionY, 0, 10, ctx);
    }
  }

  updateModel(): void {
    this.hasError = false;
    let t = this.portT.getValue();
    if (this.expressionX && this.expressionY && t != undefined) {
      try {
        const nodeX = math.parse(this.expressionX);
        const codeX = nodeX.compile();
        const nodeY = math.parse(this.expressionY);
        const codeY = nodeY.compile();
        if (Array.isArray(t)) {
          let x = new Array(t.length);
          let y = new Array(t.length);
          let input = {};
          for (let sv of this.secondaryVariables) {
            input[sv] = flowchart.globalVariables[sv];
            //console.log(sv + "," + flowchart.globalVariables[sv]);
          }
          for (let i = 0; i < t.length; i++) {
            input["t"] = t[i];
            x[i] = codeX.evaluate(input);
            y[i] = codeY.evaluate(input);
          }
          this.portX.setValue(x);
          this.portY.setValue(y);
        } else {
          let input = {t: t};
          this.portX.setValue(codeX.evaluate(input));
          this.portY.setValue(codeY.evaluate(input));
        }
      } catch (e) {
        Util.showErrorMessage(e.toString());
        this.hasError = true;
      }
    } else {
      this.portX.setValue(undefined);
      this.portY.setValue(undefined);
    }
    this.updateConnectors();
  }

}
