/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {math} from "../Main";
import {Util} from "../Util";

export class ConditionalStatementBlock extends FunctionBlock {

  private variableName: string = "x";
  private readonly portX: Port;
  private readonly portT: Port;
  private readonly portF: Port;

  static State = class {
    readonly uid: string;
    readonly variableName: string;
    readonly expression: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: ConditionalStatementBlock) {
      this.uid = block.uid;
      this.variableName = block.variableName;
      this.expression = block.expression;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number, name: string, symbol: string) {
    super(uid, x, y, width, height);
    this.name = name;
    this.expression = "x>0";
    this.symbol = symbol;
    this.color = "#696969";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portT = new Port(this, false, "T", this.width, this.height / 3, true);
    this.portF = new Port(this, false, "F", this.width, this.height * 2 / 3, true);
    this.ports.push(this.portX);
    this.ports.push(this.portT);
    this.ports.push(this.portF);
    this.margin = 15;
  }

  getCopy(): Block {
    return new ConditionalStatementBlock("Conditional Statement Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height, this.name, this.symbol);
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
    this.portT.setX(this.width);
    this.portT.setY(this.height / 3);
    this.portF.setX(this.width);
    this.portF.setY(this.height * 2 / 3);
  }

  updateModel(): void {
    let x = this.portX.getValue();
    if (typeof x == "boolean") {
      this.setOutputs(x);
    } else {
      if (this.expression && x != undefined) {
        try {
          const node = math.parse(this.expression);
          const code = node.compile();
          let result = code.evaluate({[this.variableName]: x});
          this.setOutputs(result);
        } catch (e) {
          Util.showErrorMessage(e.toString());
          this.portT.setValue(undefined);
          this.portF.setValue(undefined);
          this.hasError = true;
        }
      } else {
        this.portT.setValue(undefined);
        this.portF.setValue(undefined);
      }
    }
    this.updateConnectors();
  }

  private setOutputs(x): void {
    if (x) {
      this.portT.setValue(true);
      this.portF.setValue(undefined);
    } else {
      this.portT.setValue(undefined);
      this.portF.setValue(true);
    }
  }

}
