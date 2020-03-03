/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {BoundaryCondition} from "./BoundaryCondition";

export class BoundaryConditionBlock extends Block {

  private readonly portN: Port;
  private readonly portE: Port;
  private readonly portS: Port;
  private readonly portW: Port;
  private readonly portO: Port;
  boundaryCondition: BoundaryCondition;

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
    readonly northType: string;
    readonly eastType: string;
    readonly southType: string;
    readonly westType: string;

    constructor(block: BoundaryConditionBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.northValue = block.boundaryCondition.north.value;
      this.eastValue = block.boundaryCondition.east.value;
      this.southValue = block.boundaryCondition.south.value;
      this.westValue = block.boundaryCondition.west.value;
      this.northType = block.boundaryCondition.north.type;
      this.eastType = block.boundaryCondition.east.type;
      this.southType = block.boundaryCondition.south.type;
      this.westType = block.boundaryCondition.west.type;
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
    this.boundaryCondition = new BoundaryCondition("Dirichlet", 0, "Dirichlet", 0, "Dirichlet", 0, "Dirichlet", 0);
  }

  getCopy(): Block {
    let block = new BoundaryConditionBlock("Boundary Condition Block #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
    block.boundaryCondition = this.boundaryCondition.copy();
    return block;
  }

  destroy(): void {
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
    this.boundaryCondition.north.value = this.portN.getValue();
    this.boundaryCondition.east.value = this.portE.getValue();
    this.boundaryCondition.south.value = this.portS.getValue();
    this.boundaryCondition.west.value = this.portW.getValue();
    this.portO.setValue(this.boundaryCondition);
    this.updateConnectors();
  }

}
