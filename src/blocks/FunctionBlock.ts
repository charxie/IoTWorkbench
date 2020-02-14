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
    let exp = this.expression;
    Object.keys(flowchart.functionDeclarations).forEach(e => {
      exp = exp.replace(e, "(" + flowchart.functionDeclarations[e] + ")");
    });
    if (exp !== this.expression) {
      this.code = math.parse(exp).compile();
    }
    //console.log(exp)
  }

  protected createParser(): void {
    this.code = math.parse(this.expression).compile();
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
