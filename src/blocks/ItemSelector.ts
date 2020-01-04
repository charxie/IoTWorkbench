/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";

export class ItemSelector extends Block {

  private items: any[] = [1, 2, 3];
  private halfHeight: number;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly items: any[];

    constructor(itemSelector: ItemSelector) {
      this.name = itemSelector.name;
      this.uid = itemSelector.uid;
      this.x = itemSelector.x;
      this.y = itemSelector.y;
      this.width = itemSelector.width;
      this.height = itemSelector.height;
      this.items = itemSelector.items;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#A0522D";
    this.ports.push(new Port(this, false, "I", 0, this.height / 2, false));
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
  }

  setItems(items: any[]): void {
    this.items = items;
  }

  getItems(): any[] {
    return this.items;
  }

  updateModel(): void {
    //this.ports[0].setValue(this.value);
    this.updateConnectors();
  }

  refreshView(): void {
    this.halfHeight = this.height / 2;
    this.ports[0].setY(this.height / 2);
    this.ports[1].setX(this.width);
    this.ports[1].setY(this.height / 2);
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper area with shade
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.halfHeight);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
    shade.addColorStop(1, this.color);
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");

    // draw the name in the upper area if this is not an icon
    if (!this.iconic) {
      ctx.save();
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = this.iconic ? 0.75 : 1;
      ctx.font = this.iconic ? "10px Arial" : "14px Arial";
      let textWidth = ctx.measureText(this.name).width;
      ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + this.halfHeight / 2 + 4);
      ctx.fillText(this.name, 0, 0);
      ctx.restore();
    }

    // draw the lower area
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");

    // draw the drop down list
    if (this.items && this.items.length > 0) {
      ctx.strokeStyle = "gray";
      let m = this.iconic ? 3 : 5;
      ctx.beginPath();
      ctx.rect(this.x + m, this.y + this.halfHeight + m, this.width - 2 * m, this.halfHeight - 2 * m);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.lineWidth = this.iconic ? 0.75 : 1;
      ctx.font = this.iconic ? "9px Arial" : "12px Arial";
      ctx.fillText(this.items[0], this.x + 2 * m, this.y + 3 * this.halfHeight / 2 + 4);
    }

    // draw the ports
    ctx.strokeStyle = "black";
    this.ports[0].draw(ctx, this.iconic);
    this.ports[1].draw(ctx, this.iconic);

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.halfHeight;
  }

  mouseDown(e: MouseEvent): boolean {
    return false;
  }

  mouseUp(e: MouseEvent): void {
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseLeave(e: MouseEvent): void {
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
