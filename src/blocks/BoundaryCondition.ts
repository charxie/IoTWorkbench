/*
 * @author Charles Xie
 */

export class BoundaryCondition {

  type: string;
  northValue: number;
  eastValue: number;
  southValue: number;
  westValue: number;

  constructor(type: string, northValue: number, eastValue: number, southValue: number, westValue: number) {
    this.type = type;
    this.northValue = northValue;
    this.eastValue = eastValue;
    this.southValue = southValue;
    this.westValue = westValue;
  }

  toString(): string {
    return this.type + ": " + this.northValue + ", " + this.eastValue + ", " + this.southValue + ", " + this.westValue;
  }

}
