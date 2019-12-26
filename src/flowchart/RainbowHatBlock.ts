/*
 * @author Charles Xie
 */

import {Block} from "./Block";

export class RainbowHatBlock extends Block {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Rainbow HAT");
  }

  draw(ctx: CanvasRenderingContext2D): void {

    var grd = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    grd.addColorStop(0, "white");
    grd.addColorStop(0.1, "gray");
    grd.addColorStop(1, "dimgray");
    ctx.fillStyle = grd;
    ctx.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.x + this.margin, this.y + this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    let textMetrics = ctx.measureText(this.name);
    ctx.fillText(this.name, this.x + this.width / 2 - textMetrics.width / 2, this.y + this.height / 2 + 8);

    let r = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.height / 3, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.height * 2 / 3, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x + this.width, this.y + this.height / 2, r, 0.5 * Math.PI, 1.5 * Math.PI, true);
    ctx.stroke();

  }


}
