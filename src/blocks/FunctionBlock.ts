/*
 * @author Charles Xie
 */

import {Block} from "./Block";

export abstract class FunctionBlock extends Block {

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

  protected expression: string = "x";

  setExpression(expression: string): void {
    this.expression = expression;
    this.symbol = null;
    this.name = expression;
  }

  getExpression(): string {
    return this.expression;
  }

}
