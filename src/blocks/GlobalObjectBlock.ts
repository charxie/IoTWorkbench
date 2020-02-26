/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {flowchart} from "../Main";
import {GlobalBlock} from "./GlobalBlock";

export class GlobalObjectBlock extends GlobalBlock {

  private keys: string[] = ["x", "y"];
  private values: number[] = [0, 0];
  private initialValues: number[] = [0, 0];
  private portI: Port[];
  private readonly portO: Port;

  static State = class {
    readonly name: string;
    readonly symbol: string;
    readonly keys: string[];
    readonly values: number[];
    readonly initialValues: number[];
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly marginX: number;

    constructor(block: GlobalObjectBlock) {
      this.name = block.name;
      this.symbol = block.symbol;
      this.keys = block.keys;
      this.values = block.values;
      this.initialValues = block.initialValues;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.marginX = block.marginX;
    }
  };

  constructor(uid: string, name: string, symbol: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = symbol;
    this.color = "#20B2AA";
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portO);
    this.setInputPorts();
  }

  private setInputPorts(): void {
    let nameChanged = false;
    if (this.portI && this.keys && this.portI.length == this.keys.length) {
      for (let i = 0; i < this.portI.length; i++) {
        if (this.portI[i].getUid() != this.keys[i]) {
          nameChanged = true;
          break;
        }
      }
    }
    if (this.portI == undefined || this.portI.length != this.keys.length || nameChanged) {
      if (this.portI) {
        for (let p of this.portI) { // disconnect all the port connectors as the ports will be recreated
          flowchart.removeAllConnectors(p);
        }
        for (let p of this.portI) {
          this.ports.pop();
        }
      }
      this.portI = new Array(this.keys.length);
      let dh = this.height / (this.keys.length + 1);
      for (let i = 0; i < this.keys.length; i++) {
        this.portI[i] = new Port(this, true, this.keys[i], 0, (i + 1) * dh, false);
        this.portI[i].setMultiInput(true);
        this.ports.push(this.portI[i]);
      }
    }
  }

  getCopy(): Block {
    let copy = new GlobalObjectBlock("Global Object Block #" + Date.now().toString(16), this.name, this.symbol, this.x, this.y, this.width, this.height);
    copy.keys = this.keys;
    copy.values = JSON.parse(JSON.stringify(this.values));
    copy.initialValues = JSON.parse(JSON.stringify(this.initialValues));
    copy.marginX = this.marginX;
    return copy;
  }

  destroy(): void {
    for (let key of this.keys) {
      flowchart.removeGlobalVariable(key);
    }
  }

  getKeys(): string[] {
    return JSON.parse(JSON.stringify(this.keys));
  }

  setKeys(keys: string[]): void {
    this.keys = JSON.parse(JSON.stringify(keys));
    this.setInputPorts();
    this.refreshView();
  }

  getValues(): number[] {
    return JSON.parse(JSON.stringify(this.values));
  }

  setValues(values: number[]): void {
    this.values = JSON.parse(JSON.stringify(values));
  }

  getInitialValues(): number[] {
    return JSON.parse(JSON.stringify(this.initialValues));
  }

  setInitialValues(initialValues: number[]): void {
    if (initialValues != undefined) {
      this.initialValues = JSON.parse(JSON.stringify(initialValues));
    }
  }

  reset(): void {
    super.reset();
    if (this.initialValues != undefined) {
      for (let i = 0; i < this.values.length; i++) {
        this.values[i] = this.initialValues[i];
        flowchart.updateGlobalVariable(this.keys[i], this.values[i]);
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let dh = this.height / (this.keys.length + 1);
    for (let i = 0; i < this.keys.length; i++) {
      this.portI[i].setY((i + 1) * dh);
    }
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let x = this.portI[i].getValue();
      if (x != undefined) {
        this.values[i] = x;
        flowchart.updateGlobalVariable(this.keys[i], this.values[i]);
      }
    }
    this.portO.setValue(this.values);
    this.updateConnectors();
  }

}
