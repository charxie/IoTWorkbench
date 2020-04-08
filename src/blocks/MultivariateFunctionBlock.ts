/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {Block} from "./Block";
import {Util} from "../Util";
import {flowchart} from "../Main";

export class MultivariateFunctionBlock extends FunctionBlock {

  private variables: string[] = ["x", "y", "z"];
  private portI: Port[];
  private readonly portR: Port;

  static State = class {
    readonly uid: string;
    readonly variables: string[];
    readonly expression: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly marginX: number;

    constructor(block: MultivariateFunctionBlock) {
      this.uid = block.uid;
      this.variables = block.variables.slice();
      this.expression = block.expression;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.marginX = block.marginX;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "F(X, Y, Z)";
    this.name = "Multivariate Function Block";
    this.expression = "x+y+z";
    this.color = "#2E8B57";
    this.portR = new Port(this, false, "F", this.width, this.height / 2, true);
    this.ports.push(this.portR);
    this.setInputPorts();
  }

  private setInputPorts(): void {
    let nameChanged = false;
    if (this.portI && this.variables && this.portI.length == this.variables.length) {
      for (let i = 0; i < this.portI.length; i++) {
        if (this.portI[i].getUid() != this.variables[i]) {
          nameChanged = true;
          break;
        }
      }
    }
    if (this.portI == undefined || this.portI.length != this.variables.length || nameChanged) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.pop();
        }
      }
      this.portI = new Array(this.variables.length);
      let dh = this.height / (this.variables.length + 1);
      for (let i = 0; i < this.variables.length; i++) {
        this.portI[i] = new Port(this, true, this.variables[i], 0, (i + 1) * dh, false);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new MultivariateFunctionBlock("Multivariate Function Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.setExpression(this.expression);
    block.setVariables(this.variables);
    block.marginX = this.marginX;
    return block;
  }

  setVariables(variables: string[]): void {
    this.variables = [...variables];
    this.setInputPorts();
    this.refreshView();
  }

  getVariables(): string[] {
    return [...this.variables];
  }

  refreshView(): void {
    super.refreshView();
    this.portR.setX(this.width);
    this.portR.setY(this.height / 2);
    let dh = this.height / (this.variables.length + 1);
    for (let i = 0; i < this.variables.length; i++) {
      this.portI[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    this.hasError = this.hasParserError || this.hasDeclarationError;
    let x = new Array(this.variables.length);
    let allSet = true;
    for (let i = 0; i < x.length; i++) {
      x[i] = this.portI[i].getValue();
      if (x[i] == undefined) {
        allSet = false;
        break;
      }
    }
    if (this.expression && allSet) {
      try {
        if (this.code == null) this.createParser();
        let param = {...flowchart.globalVariables};
        let hasArray = false;
        for (let i = 0; i < x.length; i++) {
          if (Array.isArray(x[i])) {
            hasArray = true;
            break;
          }
        }
        let allArray = true;
        for (let i = 0; i < x.length; i++) {
          if (!Array.isArray(x[i])) {
            allArray = false;
            break;
          }
        }
        if (allArray) {
          let maxLength = 0;
          for (let i = 0; i < x.length; i++) {
            if (x[i].length > maxLength) {
              maxLength = x[i].length;
            }
          }
          let r = new Array(maxLength);
          for (let i = 0; i < r.length; i++) {
            for (let k = 0; k < x.length; k++) {
              param[this.variables[k]] = i < x[k].length ? x[k][i] : 0;
            }
            r[i] = this.code.evaluate(param);
            // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
            if (r[i].re) {
              r[i] = r[i].re;
            }
          }
          this.portR.setValue(r);
        } else if (hasArray) {
          let maxLength = 0;
          for (let i = 0; i < x.length; i++) {
            if (Array.isArray(x[i])) {
              if (x[i].length > maxLength) {
                maxLength = x[i].length;
              }
            } else {
              param[this.variables[i]] = x[i];
            }
          }
          let r = new Array(maxLength);
          for (let i = 0; i < r.length; i++) {
            for (let k = 0; k < x.length; k++) {
              if (Array.isArray(x[k])) {
                param[this.variables[k]] = i < x[k].length ? x[k][i] : 0;
              }
            }
            r[i] = this.code.evaluate(param);
            // TODO: if the output is complex, only take the real part. I don't know what else to do at this point
            if (r[i].re) {
              r[i] = r[i].re;
            }
          }
          this.portR.setValue(r);
        } else { // no array
          for (let i = 0; i < x.length; i++) {
            param[this.variables[i]] = x[i];
          }
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
