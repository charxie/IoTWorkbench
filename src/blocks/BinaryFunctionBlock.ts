/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {math} from "../Main";
import {Block} from "./Block";
import {Util} from "../Util";

export class BinaryFunctionBlock extends FunctionBlock {

  private variable1Name: string = "x";
  private variable2Name: string = "y";
  private readonly portX: Port;
  private readonly portY: Port;
  private readonly portR: Port;

  static State = class {
    readonly uid: string;
    readonly variable1Name: string;
    readonly variable2Name: string;
    readonly expression: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: BinaryFunctionBlock) {
      this.uid = block.uid;
      this.variable1Name = block.variable1Name;
      this.variable2Name = block.variable2Name;
      this.expression = block.expression;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "F(X, Y)";
    this.name = "Binary Function Block";
    this.expression = "x+y";
    this.color = "#FF6347";
    this.portX = new Port(this, true, "X", 0, this.height / 3, false);
    this.portY = new Port(this, true, "Y", 0, this.height * 2 / 3, false);
    this.portR = new Port(this, false, "F", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  getCopy(): Block {
    let block = new BinaryFunctionBlock("Binary Function Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.expression = this.expression;
    return block;
  }

  destroy(): void {
  }

  setVariable1Name(variable1Name: string): void {
    this.variable1Name = variable1Name;
  }

  getVariable1Name(): string {
    return this.variable1Name;
  }

  setVariable2Name(variable2Name: string): void {
    this.variable2Name = variable2Name;
  }

  getVariable2Name(): string {
    return this.variable2Name;
  }

  getPortName(uid: string): string {
    switch (uid) {
      case "X":
        return this.variable1Name.substring(0, 1);
      case "Y":
        return this.variable2Name.substring(0, 1);
      default:
        return uid;
    }
  }

  refreshView(): void {
    this.portX.setY(this.height / 3);
    this.portY.setY(this.height * 2 / 3);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    this.hasError = false;
    let x = this.portX.getValue();
    let y = this.portY.getValue();
    if (this.expression && x != undefined && y != undefined) {
      try {
        const node = math.parse(this.expression);
        const code = node.compile();
        if (Array.isArray(x) && Array.isArray(y)) {
          let r = new Array(Math.max(x.length, y.length));
          for (let i = 0; i < r.length; i++) {
            r[i] = code.evaluate({
              [this.variable1Name]: i < x.length ? x[i] : 0,
              [this.variable2Name]: i < y.length ? y[i] : 0
            });
          }
          this.portR.setValue(r);
        } else {
          this.portR.setValue(code.evaluate({[this.variable1Name]: x, [this.variable2Name]: y}));
        }
      } catch (e) {
        console.log(e.stack);
        Util.showErrorMessage(e.toString());
        this.hasError = true;
      }
    } else {
      this.portR.setValue(undefined);
    }
    this.updateConnectors();
  }

}
