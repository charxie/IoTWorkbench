/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";

export class Sticker extends Block {

  private text: string;
  private decimals: number = 3;
  private barHeight: number;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly text: string;
    readonly decimals: number;

    constructor(sticker: Sticker) {
      this.name = sticker.name;
      this.uid = sticker.uid;
      this.x = sticker.x;
      this.y = sticker.y;
      this.width = sticker.width;
      this.height = sticker.height;
      this.text = sticker.text;
      this.decimals = sticker.decimals;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#FFF86B";
    this.ports.push(new Port(this, true, "I", 0, this.height / 2, false));
  }

  setDecimals(decimals: number): void {
    this.decimals = decimals;
  }

  getDecimals(): number {
    return this.decimals;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper bar with shade
    this.barHeight = this.height / 4;
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.small ? 0.2 : 0.1, Util.adjust(this.color, -20));
    shade.addColorStop(1, Util.adjust(this.color, -100));
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.small) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Times Roman";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.strokeText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the text area
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    if (this.text) {
      ctx.font = "14px Times Roman";
      ctx.strokeStyle = "black";
      ctx.strokeText(this.text, this.x + 10, this.y + this.barHeight + 20);
    }

    // draw the port
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.ports[0].setY(this.height / 2);
    this.ports[0].draw(ctx, this.small);

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    this.text = this.ports[0].getValue().toFixed(this.decimals); // text is part of the model
  }

  refreshView(): void {
    this.updateModel();
    this.ports[0].setY(this.height / 2);
  }

}
