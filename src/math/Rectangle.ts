/*
 * @author Charles Xie
 */

export class Rectangle {

  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.setRect(x, y, width, height);
  }

  public clone(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  public setRect(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public getXmax(): number {
    return this.x + this.width;
  }

  public getYmax(): number {
    return this.y + this.height;
  }

  public getXmin(): number {
    return this.x;
  }

  public getYmin(): number {
    return this.y;
  }

  public getCenterX(): number {
    return this.x + this.width / 2;
  }

  public getCenterY(): number {
    return this.y + this.height / 2;
  }

  public contains(px: number, py: number): boolean {
    return px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height;
  }

  public intersectRect(r: Rectangle): boolean {
    return !(r.x > this.getXmax() || r.getXmax() < this.x || r.y > this.getYmax() || r.getYmax() < this.y);
  }

  public toString(): string {
    return "[" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + "]";
  }

}
