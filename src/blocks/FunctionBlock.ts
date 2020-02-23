/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart, math} from "../Main";
import {Util} from "../Util";

export abstract class FunctionBlock extends Block {

  protected expression: string = "x";
  protected code;

  setExpression(expression: string): void {
    this.expression = expression.replace(/\s/g, "");
    this.createParser();
  }

  getExpression(): string {
    return this.expression;
  }

  useDeclaredFunctions() {
    let exp = flowchart.replaceWithDeclaredFunctions(this.expression);
    if (exp != this.expression) {
      try {
        this.code = math.parse(exp).compile();
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
    }
  }

  protected createParser(): void {
    try {
      this.code = math.parse(this.expression).compile();
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasError = true;
    }
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
