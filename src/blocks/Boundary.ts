/*
 * @author Charles Xie
 */

export class Boundary {

  side: string;
  type: string;
  value: number;

  constructor(side: string, type: string, value: number) {
    this.side = side;
    this.type = type;
    this.value = value;
  }

  toString(): string {
    return this.side + ": " + this.type + " " + this.value;
  }

}
