/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Pin} from "./Pin";

export class RainbowHatBlock extends Block {

  pins: Pin[] = [];

  constructor(x: number, y: number) {
    super(x, y, 100, 300, "Rainbow HAT");
    let dy = this.height / 11;
    this.pins.push(new Pin("PB", this.width, dy, true)); // coordinates relative to this block
    this.pins.push(new Pin("BA", this.width, 2 * dy, true));
    this.pins.push(new Pin("BB", this.width, 3 * dy, true));
    this.pins.push(new Pin("BC", this.width, 4 * dy, true));
    this.pins.push(new Pin("RL", this.width, 5 * dy, true));
    this.pins.push(new Pin("GL", this.width, 6 * dy, true));
    this.pins.push(new Pin("BL", this.width, 7 * dy, true));
    this.pins.push(new Pin("TS", this.width, 8 * dy, true));
    this.pins.push(new Pin("PS", this.width, 9 * dy, true));
    this.pins.push(new Pin("L1", 0, dy, false));
    this.pins.push(new Pin("L2", 0, 2 * dy, false));
    this.pins.push(new Pin("L3", 0, 3 * dy, false));
    this.pins.push(new Pin("L4", 0, 4 * dy, false));
    this.pins.push(new Pin("L5", 0, 5 * dy, false));
    this.pins.push(new Pin("L6", 0, 6 * dy, false));
    this.pins.push(new Pin("L7", 0, 7 * dy, false));
    this.pins.push(new Pin("DP", 0, 8 * dy, false));
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the block with shade
    var shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    shade.addColorStop(0, "white");
    shade.addColorStop(0.04, "darkgray");
    shade.addColorStop(1, "gray");
    ctx.fillStyle = shade;
    ctx.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);

    // draw the inset
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(this.x + this.margin, this.y + this.margin, this.width - 2 * this.margin, this.height - 2 * this.margin);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw the name
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "bold 16px Arial";
    let textMetrics = ctx.measureText(this.name);
    ctx.translate(this.x + this.width / 2 + 5, this.y + this.height / 2 + textMetrics.width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.name, 0, 0);
    ctx.restore();

    // draw the pins
    ctx.font = "10px Arial";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "lightgray";
    for (let i = 0; i < this.pins.length; i++) {
      ctx.lineWidth = 1;
      ctx.beginPath();
      let a = this.pins[i].arc;
      let ax = a.x + this.x;
      let ay = a.y + this.y;
      ctx.arc(ax, ay, a.radius, a.startAngle, a.endAngle, a.anticlockwise);
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 0.75;
      let t = this.pins[i].uid;
      if (a.anticlockwise) {
        ctx.strokeText(t, ax - ctx.measureText(t).width - 5, ay + 4);
      } else {
        ctx.strokeText(t, ax + 5, ay + 4)
      }
    }

  }

}
