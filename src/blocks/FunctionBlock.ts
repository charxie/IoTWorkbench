/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {math} from "../Main";
import {Util} from "../Util";

export abstract class FunctionBlock extends Block {

  protected expression: string = "x";
  protected node;
  protected code;

  setExpression(expression: string): void {
    this.expression = expression;
    this.createParser();
  }

  getExpression(): string {
    return this.expression;
  }

  protected createParser(): void {
    this.node = math.parse(this.expression);
    this.code = this.node.compile();
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (Util.getOS() == "Android") {
      ctx.font = this.iconic ? "italic 9px Noto Serif" : "italic 16px Noto Serif";
    } else {
      ctx.font = this.iconic ? "italic 9px Times" : "italic 16px Times New Roman";
    }
    this.drawText(this.iconic ? this.symbol : this.expression, ctx);
  }

}
