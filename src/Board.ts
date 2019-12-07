/*
 * @author Charles Xie
 */

export class Board {

  x: number;
  y: number;
  width: number;
  height: number;
  private imageId: string;

  constructor(imageId, x, y, width, height) {
    this.imageId = imageId;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(context: CanvasRenderingContext2D) {
    let image = document.getElementById(this.imageId) as HTMLImageElement; // preload image
    context.drawImage(image, this.x, this.y);
  }

  public inside(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
