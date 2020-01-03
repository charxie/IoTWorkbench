/*
 * @author Charles Xie
 */

import {Block} from "./Block";

export abstract class FunctionBlock extends Block {

  protected expression: string = "x";

  static State = class {
    readonly uid: string;
    readonly expression: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: FunctionBlock) {
      this.uid = block.uid;
      this.expression = block.expression;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

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
