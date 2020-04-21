/*
 * @author Charles Xie
 */

export class ExpressionPair {

  position: number;
  velocity: number;

  constructor() {
  }

  public toString(): string {
    return "(" + this.position + ', ' + this.velocity + ")";
  }

}
