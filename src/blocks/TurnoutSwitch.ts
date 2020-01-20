/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {flowchart, math} from "../Main";
import {Util} from "../Util";

export class TurnoutSwitch extends FunctionBlock {

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

    constructor(block: TurnoutSwitch) {
      this.uid = block.uid;
      this.variableName = block.variableName;
      this.expression = block.expression;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
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
    let turnoutSwitch = new TurnoutSwitch("Turnout Switch #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    turnoutSwitch.variableName = this.variableName;
    turnoutSwitch.expression = this.expression;
    return turnoutSwitch;
  }

  destroy(): void {
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

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (Util.getOS() == "Android") {
      ctx.font = this.iconic ? "italic 9px Noto Serif" : "italic 16px Noto Serif";
    } else {
      ctx.font = this.iconic ? "italic 9px Times" : "italic 16px Times New Roman";
    }
    if (this.expression == undefined || this.expression.trim().length == 0) {
      this.drawText(this.iconic ? this.symbol : this.portX.getValue(), ctx);
    } else {
      this.drawText(this.iconic ? this.symbol : this.expression, ctx);
    }
  }

  refreshView(): void {
    super.refreshView();
    this.portX.setY(this.height / 2);
    this.portT.setX(this.width);
    this.portT.setY(this.height / 3);
    this.portF.setX(this.width);
    this.portF.setY(this.height * 2 / 3);
  }

  private evaluate(x: any): void {
    try {
      if (this.code == null) this.createParser();
      let param = {...flowchart.globalVariables};
      param[this.variableName] = x;
      let result = this.code.evaluate(param);
      this.setOutputs(result);
    } catch (e) {
      console.log(e.stack);
      Util.showErrorMessage(e.toString());
      this.portT.setValue(undefined);
      this.portF.setValue(undefined);
      this.hasError = true;
    }
  }

  updateModel(): void {
    let x = this.portX.getValue();
    if (typeof x == "boolean") {
      if (x) { // evaluate the expression only when the input is true
        if (this.expression && this.expression.length > 0) {
          this.evaluate(x);
        } else {
          this.setOutputs(true);
        }
      } else {
        this.setOutputs(false);
      }
    } else {
      // evaluate the expression when the input is not boolean
      if (this.expression && x != undefined) {
        this.evaluate(x);
      } else {
        this.portT.setValue(undefined);
        this.portF.setValue(undefined);
        // special treatment of a turnout switch that might output to a worker (need to stop it in that case)
        let connectors = flowchart.getConnectorsWithOutput(this.portT);
        if (connectors.length > 0) {
          for (let c of connectors) {
            let inputT = c.getInput();
            inputT.setValue(undefined);
            inputT.getBlock().updateModel();
          }
        }
        connectors = flowchart.getConnectorsWithOutput(this.portF);
        if (connectors.length > 0) {
          for (let c of connectors) {
            let inputF = c.getInput();
            inputF.setValue(undefined);
            inputF.getBlock().updateModel();
          }
        }
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
