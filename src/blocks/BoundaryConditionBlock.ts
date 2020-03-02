/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {BoundaryCondition} from "./BoundaryCondition";
import {Util} from "../Util";

export class BoundaryConditionBlock extends Block {

  private readonly portN: Port;
  private readonly portE: Port;
  private readonly portS: Port;
  private readonly portW: Port;
  private readonly portO: Port;
  private type: string = "Dirichlet";
  private northValue: number = 0;
  private eastValue: number = 0;
  private southValue: number = 0;
  private westValue: number = 0;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly northValue: number;
    readonly eastValue: number;
    readonly southValue: number;
    readonly westValue: number;
    readonly type: string;

    constructor(block: BoundaryConditionBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.northValue = block.northValue;
      this.eastValue = block.eastValue;
      this.southValue = block.southValue;
      this.westValue = block.westValue;
      this.type = block.type;
    }
  };

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.symbol = "Boundary";
    this.name = "Boundary Condition Block";
    this.color = "#5F9EA0";
    this.portN = new Port(this, true, "N", 0, this.height / 5, false);
    this.portE = new Port(this, true, "E", 0, this.height * 2 / 5, false);
    this.portS = new Port(this, true, "S", 0, this.height * 3 / 5, false);
    this.portW = new Port(this, true, "W", 0, this.height * 4 / 5, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portN);
    this.ports.push(this.portE);
    this.ports.push(this.portS);
    this.ports.push(this.portW);
    this.ports.push(this.portO);
    this.marginX = 20;
  }

  getCopy(): Block {
    let block = new BoundaryConditionBlock("Boundary Condition Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.type = this.type;
    block.northValue = this.northValue;
    block.eastValue = this.eastValue;
    block.southValue = this.southValue;
    block.westValue = this.westValue;
    return block;
  }

  destroy(): void {
  }

  getType(): string {
    return this.type;
  }

  setType(type: string): void {
    this.type = type;
  }

  getNorthValue(): number {
    return this.northValue;
  }

  setNorthValue(northValue: number): void {
    this.northValue = northValue;
  }

  getEastValue(): number {
    return this.eastValue;
  }

  setEastValue(eastValue: number): void {
    this.eastValue = eastValue;
  }

  getSouthValue(): number {
    return this.southValue;
  }

  setSouthValue(southValue: number): void {
    this.southValue = southValue;
  }

  getWestValue(): number {
    return this.westValue;
  }

  setWestValue(westValue: number): void {
    this.westValue = westValue;
  }

  refreshView(): void {
    super.refreshView();
    this.portN.setY(this.height / 5);
    this.portE.setY(this.height * 2 / 5);
    this.portS.setY(this.height * 3 / 5);
    this.portW.setY(this.height * 4 / 5);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
  }

  updateModel(): void {
    this.northValue = this.portN.getValue();
    this.eastValue = this.portE.getValue();
    this.southValue = this.portS.getValue();
    this.westValue = this.portW.getValue();
    this.portO.setValue(new BoundaryCondition(this.type, this.northValue, this.eastValue, this.southValue, this.westValue));
    this.updateConnectors();
  }

}
