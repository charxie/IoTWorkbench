/*
 * @author Charles Xie
 */

export class Connector {

  x1: number;
  y1: number;
  x2: number;
  y2: number;

  constructor() {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    let dy = (this.y2 - this.y1) / 4;
    let cx = (this.x1 + this.x2) / 2;
    let cy = (this.y1 + this.y2) / 2;
    ctx.moveTo(this.x1, this.y1);
    let x = (cx + this.x1) / 2;
    let y = (cy + this.y1) / 2 - dy;
    ctx.quadraticCurveTo(x, y, cx, cy);
    x = (cx + this.x2) / 2;
    y = (cy + this.y2) / 2 + dy;
    ctx.quadraticCurveTo(x, y, this.x2, this.y2);
    ctx.stroke();
  }

}
