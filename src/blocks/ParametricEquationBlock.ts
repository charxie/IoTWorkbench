/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {math} from "../Main";
import {Block} from "./Block";
import {Util} from "../Util";

export class ParametricEquationBlock extends Block {

  private expressionX: string = "cos(t)";
  private expressionY: string = "sin(t)";

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
      this.drawTextAt(this.expressionX, 0, -10, ctx);
      this.drawTextAt(this.expressionY, 0, 10, ctx);
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
          for (let i = 0; i < t.length; i++) {
            x[i] = codeX.evaluate({t: t[i]});
            y[i] = codeY.evaluate({t: t[i]});
          }
          this.portX.setValue(x);
          this.portY.setValue(y);
        } else {
          this.portX.setValue(codeX.evaluate({t: t}));
          this.portY.setValue(codeY.evaluate({t: t}));
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
