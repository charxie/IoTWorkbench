/*
 * @author Charles Xie
 */

export class Rectangle {

  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public contains(px: number, py: number): boolean {
    return px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height;
  }

  public toString(): string {
    return "[" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + "]";
  }

}
