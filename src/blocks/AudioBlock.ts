/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Port} from "./Port";

export class AudioBlock extends Block {

  private audio = new Audio();
  private interruptible: boolean = true;
  private barHeight: number;
  private readonly portI: Port;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly data: string;
    readonly interruptible: boolean;

    constructor(block: AudioBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.data = block.audio.src; // base64 audio data
      this.interruptible = block.interruptible;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.symbol = "♬";
    this.color = "#C28444";
    this.source = true;
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false);
    this.ports.push(this.portI);
  }

  getCopy(): Block {
    let b = new AudioBlock("Audio Block #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    b.audio.src = this.audio.src;
    b.interruptible = this.interruptible;
    return b;
  }

  setData(data: string): void {
    this.audio.src = data;
  }

  getData(): string {
    return this.audio.src;
  }

  setInterruptible(interruptible: boolean): void {
    this.interruptible = interruptible;
  }

  isInterruptible(): boolean {
    return this.interruptible;
  }

  draw(ctx: CanvasRenderingContext2D): void {
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

    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = this.iconic ? "8px Arial" : "14px Arial";
    let textWidth = ctx.measureText(this.symbol).width;
    ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + (this.height + this.barHeight) / 2 + 4);
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();

    // draw the ports
    ctx.strokeStyle = "black";
    ctx.font = "bold 12px Times";
    this.portI.draw(ctx, this.iconic);

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  destroy(): void {
    if (this.audio.src !== undefined) {
      this.audio.pause();
    }
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

  updateModel(): void {
    if (this.portI.getValue()) {
      if (this.audio.src !== undefined) {
        this.audio.play();
      }
    } else {
      if (this.audio.src !== undefined && this.interruptible) {
        this.audio.pause();
      }
    }
  }

}
