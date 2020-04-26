/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {flowchart, math} from "../Main";
import {Block} from "./Block";
import {Util} from "../Util";
import {GlobalBlock} from "./GlobalBlock";

export class BundledFunctionsBlock extends Block {

  private inputName: string = "x";
  private expressions: string[] = ["cos(x)", "sin(x)", "tan(x)"];
  private updateImmediately: boolean = true;
  private codes;
  private readonly portI: Port;
  private portO: Port[];
  private hasParserError: boolean = false;
  private hasDeclarationError: boolean = false;

  static State = class {
    readonly uid: string;
    readonly inputName: string;
    readonly expressions: string[];
    readonly updateImmediately: boolean;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: BundledFunctionsBlock) {
      this.uid = block.uid;
      this.inputName = block.inputName;
      this.expressions = block.expressions;
      this.updateImmediately = block.updateImmediately;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "f, g, h";
    this.name = "Bundled Functions Block";
    this.inputName = "x";
    this.color = "#39C";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.ports.push(this.portI);
    this.setOutputPorts();
  }

  private setOutputPorts(): void {
    if (this.portO == undefined || this.portO.length != this.expressions.length) {
      if (this.portO) {
        for (let p of this.portO) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portO) {
          this.ports.pop();
        }
      }
      this.portO = new Array(this.expressions.length);
      let dh = this.height / (this.expressions.length + 1);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < this.expressions.length; i++) {
        let id = String.fromCharCode(k++);
        if (id === "I") { // skip over the existing port names
          id = String.fromCharCode(k++);
        }
        this.portO[i] = new Port(this, false, id, this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new BundledFunctionsBlock("Bundled Functions Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.inputName = this.inputName;
    block.updateImmediately = this.updateImmediately;
    block.setExpressions(this.expressions);
    return block;
  }

  destroy(): void {
  }

  setUpdateImmediately(updateImmediately: boolean): void {
    this.updateImmediately = updateImmediately;
  }

  getUpdateImmediately(): boolean {
    return this.updateImmediately;
  }

  setInputName(inputName: string): void {
    this.inputName = inputName;
  }

  getInputName(): string {
    return this.inputName;
  }

  setExpressions(expressions: any[]): void {
    this.expressions = expressions.slice();
    for (let i = 0; i < this.expressions.length; i++) {
      this.expressions[i] = this.expressions[i].replace(/\s/g, "");
    }
    this.setOutputPorts();
    this.refreshView();
    this.createParsers();
  }

  getExpressions(): any[] {
    return this.expressions.slice();
  }

  refreshView(): void {
    super.refreshView();
    this.portI.setY(this.height / 2);
    let dh = this.height / (this.expressions.length + 1);
    for (let i = 0; i < this.expressions.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  protected drawLabel(ctx: CanvasRenderingContext2D): void {
    if (this.iconic) {
      ctx.font = Util.getOS() == "Android" ? "italic 9px Noto Serif" : "italic 9px Times New Roman";
      this.drawTextAt(this.symbol, 0, 0, ctx);
    } else {
      ctx.font = Util.getOS() == "Android" ? "italic 16px Noto Serif" : "italic 16px Times New Roman";
      let dh = this.height / (this.expressions.length + 1);
      for (let i = 0; i < this.expressions.length; i++) {
        this.drawTextAt(this.expressions[i], 0, (i + 1) * dh - this.height / 2, ctx);
      }
    }
  }

  useDeclaredFunctions() {
    this.hasDeclarationError = false;
    for (let i = 0; i < this.expressions.length; i++) {
      let exp = flowchart.replaceWithDeclaredFunctions(this.expressions[i]);
      if (exp != this.expressions[i]) {
        try {
          this.codes[i] = math.parse(exp).compile();
        } catch (e) {
          console.log(e.stack);
          Util.showBlockError(e.toString());
          this.hasDeclarationError = true;
        }
      }
    }
  }

  private createParsers(): void {
    if (this.codes === undefined || this.codes.length !== this.expressions.length) {
      this.codes = new Array(this.expressions.length);
    }
    this.hasParserError = false;
    try {
      for (let i = 0; i < this.expressions.length; i++) {
        this.codes[i] = math.parse(this.expressions[i]).compile();
      }
    } catch (e) {
      console.log(e.stack);
      Util.showBlockError(e.toString());
      this.hasParserError = true;
    }
  }

  updateModel(): void {
    this.hasError = this.hasParserError || this.hasDeclarationError;
    let x = this.portI.getValue();
    if (this.expressions && this.inputName && x != undefined) {
      try {
        if (this.codes == undefined) this.createParsers();
        let param = {...flowchart.globalVariables};
        if (Array.isArray(x)) {
          for (let n = 0; n < this.expressions.length; n++) {
            let y = new Array(x.length);
            for (let i = 0; i < x.length; i++) {
              param[this.inputName] = x[i];
              y[i] = this.codes[n].evaluate(param);
            }
            this.portO[n].setValue(y);
          }
        } else {
          param[this.inputName] = x;
          for (let n = 0; n < this.expressions.length; n++) {
            if (this.portO[n]) {
              this.portO[n].setValue(this.codes[n].evaluate(param));
              // update the global variables at each step, or the solution for an iterative method will be incorrect
              // however, there are cases such as a discrete map that should not update until all functions have been evaluated
              if (this.updateImmediately) {
                let connectors = flowchart.getConnectorsWithOutput(this.portO[n]);
                for (let c of connectors) {
                  let input = c.getInput();
                  if (input.getBlock() instanceof GlobalBlock) {
                    param[input.getUid()] = this.portO[n].getValue();
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
    } else {
      for (let n = 0; n < this.portO.length; n++) {
        this.portO[n].setValue(undefined);
      }
    }
    this.updateConnectors();
  }

}
