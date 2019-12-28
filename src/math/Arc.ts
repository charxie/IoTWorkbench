/*
 * @author Charles Xie
 */

export class Arc {

  public x: number;
  public y: number;
  public radius: number;
  public startAngle: number; // radian
  public endAngle: number; // radian
  public anticlockwise: boolean;

  constructor(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.anticlockwise = anticlockwise;
  }

  public contains(x: number, y: number): boolean {
    let dx = x - this.x;
    let dy = y - this.y;
    return dx * dx + dy * dy < this.radius * this.radius;
  }

  public near(x: number, y: number): boolean {
    let dx = x - this.x;
    let dy = y - this.y;
    return dx * dx + dy * dy < 4 * this.radius * this.radius;
  }

  public toString(): string {
    return "(" + this.x + ", " + this.y + ", " + this.radius + ", " + this.startAngle + ", " + this.endAngle + ", " + this.anticlockwise + ")";
  }

}
