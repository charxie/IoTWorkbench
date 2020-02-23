/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart} from "../Main";

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
    this.color = "#DDA0DD";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portR = new Port(this, false, "R", this.width, this.height / 2, true);
    this.ports.push(this.portX);
    this.ports.push(this.portR);
    this.margin = 15;
  }

  getCopy(): Block {
    let block = new UnaryFunctionBlock("Unary Function Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.expression = this.expression;
    block.variableName = this.variableName;
    return block;
  }

  getPortName(uid: string): string {
    switch (uid) {
      case "X":
        return this.variableName.substring(0, 1);
      default:
        return uid;
    }
  }

  setVariableName(variableName: string): void {
    this.variableName = variableName;
  }

  getVariableName(): string {
    return this.variableName;
  }

  refreshView(): void {
    super.refreshView();
    this.portX.setY(this.height / 2);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portX.getValue();
    this.hasError = this.hasParserError || this.hasDeclarationError;
    if (this.expression && x != undefined) {
      try {
        if (this.code == undefined) this.createParser();
        let param = {...flowchart.globalVariables};
        if (Array.isArray(x)) {
          let r = new Array(x.length);
          for (let i = 0; i < r.length; i++) {
            param[this.variableName] = x[i];
            r[i] = this.code.evaluate(param);
            // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
            if (r[i].re) {
              r[i] = r[i].re;
            }
          }
          this.portR.setValue(r);
        } else {
          param[this.variableName] = x;
          this.portR.setValue(this.code.evaluate(param));
        }
        this.updateConnectors();
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
    } else {
      this.portR.setValue(undefined);
    }
  }

}
