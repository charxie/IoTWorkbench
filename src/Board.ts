/*
 * @author Charles Xie
 */

export abstract class Board {

  x: number;
  y: number;
  width: number;
  height: number;
  private imageId: string;

  constructor(imageId: string, x: number, y: number, width: number, height: number) {
    this.imageId = imageId;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // draw the background image for the board
  public draw(context: CanvasRenderingContext2D): void {
    let image = document.getElementById(this.imageId) as HTMLImageElement; // preload image
    context.drawImage(image, this.x, this.y);
  }

  // detect if (x, y) is inside the board
  public inside(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}
