/*
 * @author Charles Xie
 */

import {Boundary} from "./Boundary";

export class BoundaryCondition {

  north: Boundary;
  east: Boundary;
  south: Boundary;
  west: Boundary;

  constructor(northType: string, northValue: number, eastType: string, eastValue: number, southType: string, southValue: number, westType: string, westValue: number) {
    this.north = new Boundary("North", northType, northValue);
    this.east = new Boundary("East", eastType, eastValue);
    this.south = new Boundary("South", southType, southValue);
    this.west = new Boundary("West", westType, westValue);
  }

  copy(): BoundaryCondition {
    return new BoundaryCondition(this.north.type, this.north.value, this.east.type, this.east.value, this.south.type, this.south.value, this.west.type, this.west.value);
  }

  toString(): string {
    return this.north.toString() + "," + this.east.toString() + "," + this.south.toString() + "," + this.west.toString();
  }

}
