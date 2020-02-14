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
    const pattern = /[a-z][a-z0-9]*[']*\([a-z0-9]+\)/g;
    const result = exp.match(pattern);
    if (result == null || result.length == 0) return; // no declared function found in the expression
    Object.keys(flowchart.declaredFunctions).forEach(e => {
      let i = e.indexOf("(");
      let j = e.indexOf(")");
      let functionName1 = e.substring(0, i);
      let variableName1 = e.substring(i + 1, j);
      for (let fun of result) {
        i = fun.indexOf("(");
        let functionName2 = fun.substring(0, i);
        if (functionName1 === functionName2) {
          j = fun.indexOf(")");
          let variableName2 = fun.substring(i + 1, j);
          let fun2 = (<String>flowchart.declaredFunctions[e]).replace(new RegExp(variableName1, "g"), variableName2);
          exp = exp.replace(fun, "(" + fun2 + ")");
        }
      }
    });
    // handle derivatives
    if (this.expression.indexOf("'") != -1) {
      Object.keys(flowchart.declaredFunctions).forEach(e => {
        let i = e.indexOf("(");
        let j = e.indexOf(")");
        let functionName1 = e.substring(0, i) + "'";
        let variableName1 = e.substring(i + 1, j);
        for (let fun of result) {
          i = fun.indexOf("(");
          let functionName2 = fun.substring(0, i);
          if (functionName1 === functionName2) {
            j = fun.indexOf(")");
            let variableName2 = fun.substring(i + 1, j);
            let fun2 = (<String>flowchart.declaredFunctions[e]).replace(new RegExp(variableName1, "g"), variableName2);
            let derivative = math.derivative(fun2, variableName2).toString();
            exp = exp.replace(fun, "(" + derivative + ")");
          }
        }
      });
      if (this.expression.indexOf("''") != -1) {
        Object.keys(flowchart.declaredFunctions).forEach(e => {
          let i = e.indexOf("(");
          let j = e.indexOf(")");
          let functionName1 = e.substring(0, i) + "''";
          let variableName1 = e.substring(i + 1, j);
          for (let fun of result) {
            i = fun.indexOf("(");
            let functionName2 = fun.substring(0, i);
            if (functionName1 === functionName2) {
              j = fun.indexOf(")");
              let variableName2 = fun.substring(i + 1, j);
              let fun2 = (<String>flowchart.declaredFunctions[e]).replace(new RegExp(variableName1, "g"), variableName2);
              let firstOrderDerivative = math.derivative(fun2, variableName2).toString();
              let secondOrderDerivative = math.derivative(firstOrderDerivative, variableName2).toString();
              exp = exp.replace(fun, "(" + secondOrderDerivative + ")");
            }
          }
        });
      }
      if (this.expression.indexOf("'''") != -1) {
        Object.keys(flowchart.declaredFunctions).forEach(e => {
          Object.keys(flowchart.declaredFunctions).forEach(e => {
            let i = e.indexOf("(");
            let j = e.indexOf(")");
            let functionName1 = e.substring(0, i) + "'''";
            let variableName1 = e.substring(i + 1, j);
            for (let fun of result) {
              i = fun.indexOf("(");
              let functionName2 = fun.substring(0, i);
              if (functionName1 === functionName2) {
                j = fun.indexOf(")");
                let variableName2 = fun.substring(i + 1, j);
                let fun2 = (<String>flowchart.declaredFunctions[e]).replace(new RegExp(variableName1, "g"), variableName2);
                let firstOrderDerivative = math.derivative(fun2, variableName2).toString();
                let secondOrderDerivative = math.derivative(firstOrderDerivative, variableName2).toString();
                let thirdOrderDerivative = math.derivative(secondOrderDerivative, variableName2).toString();
                exp = exp.replace(fun, "(" + thirdOrderDerivative + ")");
              }
            }
          });
        });
      }
    }
    if (exp !== this.expression) {
      this.code = math.parse(exp).compile();
    }
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
