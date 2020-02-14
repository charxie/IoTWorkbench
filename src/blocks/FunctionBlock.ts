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
    Object.keys(flowchart.declaredFunctions).forEach(e => {
      exp = exp.replace(e, "(" + flowchart.declaredFunctions[e] + ")");
    });
    // handle derivatives
    if (this.expression.indexOf("'") != -1) {
      if (this.expression.indexOf("'''") != -1) {
        Object.keys(flowchart.declaredFunctions).forEach(e => {
          let i = e.indexOf("(");
          if (i > 0) {
            let j = e.indexOf(")");
            let variable = e.substr(i + 1, j - i - 1);
            let s = e.slice(0, i) + "'''" + e.slice(i);
            let firstOrderDerivative = math.derivative(flowchart.declaredFunctions[e], variable).toString();
            let secondOrderDerivative = math.derivative(firstOrderDerivative, variable).toString();
            let thirdOrderDerivative = math.derivative(secondOrderDerivative, variable).toString();
            exp = exp.replace(s, "(" + thirdOrderDerivative + ")");
          }
        });
      }
      if (this.expression.indexOf("''") != -1) {
        Object.keys(flowchart.declaredFunctions).forEach(e => {
          let i = e.indexOf("(");
          if (i > 0) {
            let j = e.indexOf(")");
            let variable = e.substr(i + 1, j - i - 1);
            let s = e.slice(0, i) + "''" + e.slice(i);
            let firstOrderDerivative = math.derivative(flowchart.declaredFunctions[e], variable).toString();
            let secondOrderDerivative = math.derivative(firstOrderDerivative, variable).toString();
            exp = exp.replace(s, "(" + secondOrderDerivative + ")");
          }
        });
      }
      Object.keys(flowchart.declaredFunctions).forEach(e => {
        let i = e.indexOf("(");
        if (i > 0) {
          let j = e.indexOf(")");
          let variable = e.substr(i + 1, j - i - 1);
          let s = e.slice(0, i) + "'" + e.slice(i);
          let derivative = math.derivative(flowchart.declaredFunctions[e], variable).toString();
          exp = exp.replace(s, "(" + derivative + ")");
        }
      });
    }
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
