/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Port} from "./Port";

export class ImageBlock extends Block {

  private image = new Image();
  private barHeight: number;
  private readonly portO: Port;
  private margin: number = 8;
  private transparent: boolean = false;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly data: string;
    readonly transparent: boolean;

    constructor(block: ImageBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.data = block.image.src; // base64 image data
      this.transparent = block.transparent;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = "⛱";
    this.color = "#4284C4";
    this.source = true;
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portO = new Port(this, false, "O", this.width, this.barHeight + dh, true);
    this.ports.push(this.portO);
  }

  getCopy(): Block {
    let b = new ImageBlock("Image Block #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    b.image.src = this.image.src;
    b.transparent = this.transparent;
    return b;
  }

  setData(data: string): void {
    this.image.src = data;
  }

  getData(): string {
    return this.image.src;
  }

  setTransparent(transparent: boolean): void {
    this.transparent = transparent;
  }

  isTransparent(): boolean {
    return this.transparent;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.transparent) {
      // draw the bar
      switch (flowchart.blockView.getBlockStyle()) {
        case "Shade":
          let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
          shade.addColorStop(0, "white");
          shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
          shade.addColorStop(1, this.color);
          ctx.fillStyle = shade;
          break;
        case "Plain":
          ctx.fillStyle = this.color;
          break;
      }
      ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");

      // draw the title bar
      ctx.fillStyle = "#FFFFFF";
      ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
      if (!this.iconic) {
        ctx.lineWidth = 0.75;
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        let titleWidth = ctx.measureText(this.name).width;
        ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
      }
    }

    ctx.save();
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = this.iconic ? "8px Arial" : "14px Arial";
      let textWidth = ctx.measureText(this.symbol).width;
      ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + (this.height + this.barHeight) / 2 + 4);
      ctx.fillText(this.symbol, 0, 0);
    } else {
      let size = this.height - this.barHeight - 2 * this.margin;
      ctx.drawImage(this.image, this.x + this.margin, this.y + this.barHeight + this.margin, size * this.image.width / this.image.height, size);
    }
    ctx.restore();

    // draw the ports
    if (!this.transparent) {
      ctx.strokeStyle = "black";
      ctx.font = "bold 12px Times";
      this.portO.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portO.setY(this.barHeight + dh);
    this.portO.setX(this.width);
  }

  updateModel(): void {
    this.portO.setValue(this.image.src);
    this.updateConnectors();
  }

}
