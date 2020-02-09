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
  private nodes;
  private codes;

  private readonly portI: Port;
  private portO: Port[];

  static State = class {
    readonly uid: string;
    readonly inputName: string;
    readonly expressions: string[];
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: BundledFunctionsBlock) {
      this.uid = block.uid;
      this.inputName = block.inputName;
      this.expressions = block.expressions;
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
    this.margin = 15;
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
      let nm = "A";
      for (let i = 0; i < this.expressions.length; i++) {
        this.portO[i] = new Port(this, false, String.fromCharCode(nm.charCodeAt(0) + i), this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new BundledFunctionsBlock("Bundled Functions Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.inputName = this.inputName;
    block.setExpressions(JSON.parse(JSON.stringify(this.expressions)));
    return block;
  }

  destroy(): void {
  }

  setInputName(inputName: string): void {
    this.inputName = inputName;
  }

  getInputName(): string {
    return this.inputName;
  }

  setExpressions(expressions: any[]): void {
    this.expressions = JSON.parse(JSON.stringify(expressions));
    this.setOutputPorts();
    this.refreshView();
    this.createParsers();
  }

  getExpressions(): any[] {
    return JSON.parse(JSON.stringify(this.expressions));
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

  private createParsers(): void {
    if (this.nodes === undefined || this.nodes.length !== this.expressions.length) {
      this.nodes = new Array(this.expressions.length);
      this.codes = new Array(this.expressions.length);
    }
    for (let i = 0; i < this.expressions.length; i++) {
      this.nodes[i] = math.parse(this.expressions[i]);
      this.codes[i] = this.nodes[i].compile();
    }
  }

  updateModel(): void {
    this.hasError = false;
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
        this.updateConnectors();
      } catch (e) {
        console.log(e.stack);
        Util.showBlockError(e.toString());
        this.hasError = true;
      }
    } else {
      for (let n = 0; n < this.expressions.length; n++) {
        this.portO[n].setValue(undefined);
      }
    }
  }

}
