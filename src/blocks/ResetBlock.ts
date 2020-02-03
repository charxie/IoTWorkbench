/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {WorkerBlock} from "./WorkerBlock";
import {GlobalObjectBlock} from "./GlobalObjectBlock";
import {Space2D} from "./Space2D";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class ResetBlock extends Block {

  private pressed: boolean = false;
  private barHeight: number;

  constructor(uid: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = "Reset Block";
    this.symbol = "Reset";
    this.color = "#CD5C5C";
    this.margin = 15;
    this.barHeight = Math.min(30, this.height / 3);
  }

  getCopy(): Block {
    return new ResetBlock(this.name + " #" + Date.now().toString(16), this.x, this.y, this.width, this.height);
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

    // draw the lower area
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");

    if (this.pressed) {
      ctx.fillStyle = "lightgray";
      ctx.beginPath();
      ctx.rect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "black";
      ctx.stroke();
    }

    // draw the name in the lower area if this is not an icon
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.iconic ? 0.75 : 1;
    ctx.font = this.iconic ? "8px Arial" : "14px Arial";
    let textWidth = ctx.measureText(this.symbol).width;
    ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + (this.height + this.barHeight) / 2 + 4);
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  onButton(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y + this.barHeight && y < this.y + this.height;
  }

  destroy(): void {
  }

  updateModel(): void {
    for (let b of flowchart.blocks) {
      if (b instanceof WorkerBlock) {
        b.reset();
      } else if (b instanceof GlobalVariableBlock) {
        //b.reset();
      } else if (b instanceof GlobalObjectBlock) {
        //b.reset();
      } else if (b instanceof Space2D) {
        b.erase();
      }
    }
  }

  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.onButton(x, y)) {
      this.pressed = true;
      this.updateModel();
      return true;
    }
    flowchart.blockView.canvas.style.cursor = "pointer";
    return false;
  }

  mouseUp(e: MouseEvent): void {
    if (this.pressed) {
      this.pressed = false;
    }
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseLeave(e: MouseEvent): void {
    this.pressed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
