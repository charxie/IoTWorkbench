/*
 * @author Charles Xie
 */

import {Block} from "./Block";

export abstract class FunctionBlock extends Block {

  protected expression: string = "x";

  setExpression(expression: string): void {
    this.expression = expression;
  }

  getExpression(): string {
    return this.expression;
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.iconic ? "italic 9px Times" : "italic 16px Times";
    this.drawText(this.iconic ? this.symbol : this.expression, ctx);
  }

}
