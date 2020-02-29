/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart} from "../Main";

export class BinaryFunctionBlock extends FunctionBlock {

  private variable1Name: string = "x";
  private variable2Name: string = "y";
  private outputArrayType: string = "1D";
  private readonly portX: Port;
  private readonly portY: Port;
  private readonly portR: Port;

  static State = class {
    readonly uid: string;
    readonly variable1Name: string;
    readonly variable2Name: string;
    readonly expression: string;
    readonly outputArrayType: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: BinaryFunctionBlock) {
      this.uid = block.uid;
      this.variable1Name = block.variable1Name;
      this.variable2Name = block.variable2Name;
      this.expression = block.expression;
      this.outputArrayType = block.outputArrayType;
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
  }

  getCopy(): Block {
    let block = new BinaryFunctionBlock("Binary Function Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.expression = this.expression;
    block.variable1Name = this.variable1Name;
    block.variable2Name = this.variable2Name;
    block.outputArrayType = this.outputArrayType;
    return block;
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

  setOutputArrayType(outputArrayType: string): void {
    this.outputArrayType = outputArrayType;
  }

  getOutputArrayType(): string {
    return this.outputArrayType;
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
    super.refreshView();
    this.portX.setY(this.height / 3);
    this.portY.setY(this.height * 2 / 3);
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
  }

  updateModel(): void {
    this.hasError = this.hasParserError || this.hasDeclarationError;
    let x = this.portX.getValue();
    let y = this.portY.getValue();
    if (this.expression && x != undefined && y != undefined) {
      try {
        if (this.code == undefined) this.createParser();
        let param = {...flowchart.globalVariables};
        if (Array.isArray(x) && Array.isArray(y)) {
          switch (this.outputArrayType) {
            case "1D":
              let r = new Array(Math.max(x.length, y.length));
              for (let i = 0; i < r.length; i++) {
                param[this.variable1Name] = i < x.length ? x[i] : 0;
                param[this.variable2Name] = i < y.length ? y[i] : 0;
                r[i] = this.code.evaluate(param);
                // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
                if (r[i].re) {
                  r[i] = r[i].re;
                }
              }
              this.portR.setValue(r);
              break;
            case "2D":
              r = new Array(x.length * y.length);
              let k = 0;
              for (let i = 0; i < x.length; i++) {
                param[this.variable1Name] = x[i];
                for (let j = 0; j < y.length; j++) {
                  param[this.variable2Name] = y[j];
                  r[k] = this.code.evaluate(param);
                  // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
                  if (r[k].re) {
                    r[k] = r[k].re;
                  }
                  k++;
                }
              }
              this.portR.setValue(r);
              break;
          }
        } else if (Array.isArray(x)) {
          param[this.variable2Name] = y;
          let r = new Array(x.length);
          for (let i = 0; i < r.length; i++) {
            param[this.variable1Name] = x[i];
            r[i] = this.code.evaluate(param);
            // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
            if (r[i].re) {
              r[i] = r[i].re;
            }
          }
          this.portR.setValue(r);
        } else if (Array.isArray(y)) {
          param[this.variable1Name] = x;
          let r = new Array(y.length);
          for (let i = 0; i < r.length; i++) {
            param[this.variable2Name] = y[i];
            r[i] = this.code.evaluate(param);
            // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
            if (r[i].re) {
              r[i] = r[i].re;
            }
          }
          this.portR.setValue(r);
        } else {
          param[this.variable1Name] = x;
          param[this.variable2Name] = y;
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
