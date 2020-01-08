/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {math} from "../Main";
import {Block} from "./Block";
import {Util} from "../Util";

export class UnaryFunctionBlock extends FunctionBlock {

  private variableName: string = "x";
  private readonly portX: Port;
  private readonly portR: Port;

  static State = class {
    readonly uid: string;
    readonly variableName: string;
    readonly expression: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: UnaryFunctionBlock) {
      this.uid = block.uid;
      this.variableName = block.variableName;
      this.expression = block.expression;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "F(X)";
    this.name = "Unary Function Block";
    this.color = "#FF6347";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  getCopy(): Block {
    let block = new UnaryFunctionBlock("Unary Function Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.expression = this.expression;
    return block;
  }

  destroy(): void {
  }

  setVariableName(variableName: string): void {
    this.variableName = variableName;
  }

  getVariableName(): string {
    return this.variableName;
  }

  refreshView(): void {
    this.portX.setY(this.height / 2);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    this.hasError = false;
    let x = this.portX.getValue();
    if (this.expression && x != undefined) {
      try {
        const node = math.parse(this.expression);
        const code = node.compile();
        if (Array.isArray(x)) {
          let r = [];
          for (let i of x) {
            r.push(code.evaluate({[this.variableName]: i}));
          }
          this.portR.setValue(r);
        } else {
          this.portR.setValue(code.evaluate({[this.variableName]: x}));
        }
      } catch (e) {
        Util.showErrorMessage(e.toString());
        this.hasError = true;
      }
    } else {
      this.portR.setValue(NaN);
    }
    this.updateConnectors();
  }

}
