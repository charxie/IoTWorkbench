/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Movable} from "../Movable";
import {Util} from "../Util";
import {Block} from "./Block";

export class Slider extends Block {

  constructor(name: string, x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.name = name;
    this.color = "#1E90FF";
    this.ports.push(new Port(this, true, "Number Slider", this.width, this.height / 2, true));
  }

  draw(ctx: CanvasRenderingContext2D): void {

    let h = this.height / 2;

    // draw the upper area with shade
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + h);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.small ? 0.1 : 0.05, Util.adjust(this.color, 50));
    shade.addColorStop(1, this.color);
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, h, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, h, this.radius, "Top");

    // draw the name in the upper area
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.small ? 0.75 : 1;
    ctx.font = this.small ? "12px Arial" : "bold 16px Arial";
    let textWidth = ctx.measureText(this.name).width;
    ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + h / 2 + 4);
    ctx.fillText(this.name, 0, 0);
    ctx.restore();

    // draw the lower area
    ctx.fillStyle = "lightgray";
    ctx.fillHalfRoundedRect(this.x, this.y + h, this.width, h, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + h, this.width, h, this.radius, "Bottom");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "dimgray";
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y + h * 3 / 2);
    ctx.lineTo(this.x + this.width - 10, this.y + h * 3 / 2);
    ctx.stroke();
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.rect(this.x + this.width / 2 - 2, this.y + h + 4, 4, h - 8);
    ctx.fill();
    ctx.stroke();

    // draw the port
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.ports[0].draw(ctx, this.small);

  }

}
