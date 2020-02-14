/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";

export class FunctionDeclarationBlock extends Block {

  private variableName: string = "x";
  private functionName: string = "f";
  private expression: string = "x";

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly variableName: string;
    readonly functionName: string;
    readonly expression: any;

    constructor(block: FunctionDeclarationBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.variableName = block.variableName;
      this.functionName = block.functionName;
      this.expression = block.expression;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#FCF";
    this.margin = 15;
  }

  getCopy(): Block {
    let copy = new FunctionDeclarationBlock("Function Declaration Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    copy.variableName = this.variableName;
    copy.functionName = this.functionName;
    copy.expression = this.expression;
    return copy;
  }

  destroy(): void {
    flowchart.removeGlobalVariable(this.functionName);
  }

  getVariableName(): string {
    return this.variableName;
  }

  setVariableName(variableName: string): void {
    this.variableName = variableName;
  }

  getFunctionName(): string {
    return this.functionName;
  }

  setFunctionName(functionName: string): void {
    this.functionName = functionName;
    this.symbol = functionName;
  }

  getKey(): string {
    return this.functionName + "(" + this.variableName + ")";
  }

  getExpression(): string {
    return this.expression;
  }

  setExpression(expression: string): void {
    this.expression = expression;
  }

  updateModel(): void {
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = "Italic 9px Times New Roman";
      this.drawText(this.symbol ? this.symbol : this.name, ctx);
    } else {
      if (Util.getOS() == "Android") {
        ctx.font = this.iconic ? "italic 9px Noto Serif" : "italic 16px Noto Serif";
      } else {
        ctx.font = this.iconic ? "italic 9px Times New Roman" : "italic 16px Times New Roman";
      }
      let s = this.symbol ? this.symbol : this.name;
      this.drawText(s + "(" + this.variableName + ")" + " = " + this.expression, ctx);
    }
  }

}
