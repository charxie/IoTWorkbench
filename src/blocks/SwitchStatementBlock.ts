/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {FunctionBlock} from "./FunctionBlock";
import {flowchart, math} from "../Main";
import {Util} from "../Util";

export class SwitchStatementBlock extends Block {

  private cases: any[];
  private readonly portI: Port;
  private portO: Port[];

  static State = class {
    readonly uid: string;
    readonly cases;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: SwitchStatementBlock) {
      this.uid = block.uid;
      this.cases = block.cases;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.cases = [1, 2, 3];
    this.symbol = symbol;
    this.color = "#EE82EE";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.ports.push(this.portI);
    this.setOutputPorts();
    this.margin = 15;
  }

  private setOutputPorts(): void {
    if (this.portO) {
      for (let p of this.portO) {
        this.ports.pop();
      }
    }
    if (this.portO == undefined || this.portO.length != this.cases.length) {
      this.portO = new Array(this.cases.length);
      let dh = this.height / (this.cases.length + 1);
      let nm = "A";
      for (let i = 0; i < this.cases.length; i++) {
        this.portO[i] = new Port(this, false, String.fromCharCode(nm.charCodeAt(0) + i), this.width, (i + 1) * dh, true);
        this.ports.push(this.portO[i]);
      }
    }
  }

  getCopy(): Block {
    let block = new SwitchStatementBlock("Switch Statement Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    block.cases = JSON.parse(JSON.stringify(this.cases));
    return block;
  }

  destroy(): void {
  }

  setCases(cases: any[]): void {
    this.cases = JSON.parse(JSON.stringify(cases));
    //this.setOutputPorts();
    //this.refreshView();
  }

  getCases(): any[] {
    return JSON.parse(JSON.stringify(this.cases));
  }

  refreshView(): void {
    this.portI.setY(this.height / 2);
    let dh = this.height / (this.cases.length + 1);
    for (let i = 0; i < this.cases.length; i++) {
      this.portO[i].setX(this.width);
      this.portO[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    let x = this.portI.getValue();
    this.updateConnectors();
  }

}
