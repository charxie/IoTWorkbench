/*
 * @author Charles Xie
 */

export class Point {

  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toString(): string {
    return "(" + this.x + ", " + this.y + ")";
  }

}
