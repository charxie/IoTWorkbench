/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {flowchart} from "../Main";
import {GlobalBlock} from "./GlobalBlock";

export class GlobalVariableBlock extends GlobalBlock {

  private readonly portX: Port;
  private readonly portO: Port;
  private key: string = "x";
  private value: any;

  static State = class {
    readonly name: string;
    readonly key: string;
    readonly value: any;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(block: GlobalVariableBlock) {
      this.name = block.name;
      this.key = block.key;
      this.value = block.value;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#808000";
    this.portX = new Port(this, true, "X", 0, this.height / 2, false);
    this.portX.setMultiInput(true);
    this.ports.push(this.portX);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portO);
    this.margin = 15;
  }

  getCopy(): Block {
    let copy = new GlobalVariableBlock("Global Variable Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    copy.key = this.key;
    copy.value = this.value;
    return copy;
  }

  destroy(): void {
    flowchart.removeGlobalVariable(this.key);
  }

  getKey(): string {
    return this.key;
  }

  setKey(key: any): void {
    this.key = key;
    this.symbol = key;
  }

  getValue(): any {
    return this.value;
  }

  setValue(value: any): void {
    this.value = value;
  }

  refreshView(): void {
    super.refreshView();
    this.portX.setY(this.height / 2);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
  }

  updateModel(): void {
    let x = this.portX.getValue();
    if (x != undefined) {
      if (Array.isArray(x)) { // only accept the latest value of an array
        if (x.length == 0) {
          x = 0;
        } else {
          x = x[x.length - 1];
        }
      }
      this.value = x;
      flowchart.updateGlobalVariable(this.key, this.value);
    }
    this.portO.setValue(x);
    this.updateConnectors();
  }

}
