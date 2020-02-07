/*
 * @author Charles Xie
 */

export class Point {

  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.set(x, y);
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  translate(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  public toString(): string {
    return "(" + this.x + ", " + this.y + ")";
  }

}
