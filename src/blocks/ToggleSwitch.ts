/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";

export class ToggleSwitch extends Block {

  private value: number = 0;
  private knob: Rectangle;
  private knobHalfSize: number = 10;
  private trackLeft: number;
  private trackRight: number;
  private knobGrabbed: boolean;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private readonly halfHeight: number;

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#FF4500";
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.knobHalfSize = (this.width - 16) / 2;
    this.knob = new Rectangle(this.x + this.width / 2 - this.knobHalfSize / 2, this.y + this.halfHeight + 4, this.knobHalfSize, this.halfHeight - 8);
    this.trackLeft = this.x + 8;
    this.trackRight = this.x + this.width - 8;
  }

  setSelected(selected: boolean): void {
    this.value = selected ? 1 : 0;
  }

  isSelected(): boolean {
    return this.value != 0;
  }

  updateModel(): void {
    this.ports[0].setValue(this.value);
    this.updateConnectors();
  }

  refreshView(): void {
    this.trackLeft = this.x + 8;
    this.trackRight = this.x + this.width - 8;
    let x = this.trackLeft + (this.trackRight - this.trackLeft) / 2;
    this.knob.setRect(x - this.knobHalfSize, this.y + this.halfHeight + 4, 2 * this.knobHalfSize, this.halfHeight - 8);
    this.ports[0].setX(this.width);
    this.ports[0].setY(this.height / 2);
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the upper area with shade
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.halfHeight);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.small ? 0.4 : 0.2, Util.adjust(this.color, 100));
    shade.addColorStop(1, this.color);
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");

    // draw the name in the upper area
    ctx.save();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.small ? 0.75 : 1;
    ctx.font = this.small ? "12px Arial" : "bold 16px Arial";
    let textWidth = ctx.measureText(this.name).width;
    ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + this.halfHeight / 2 + 4);
    ctx.fillText(this.name, 0, 0);
    ctx.restore();

    // draw the lower area
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");

    // draw the track
    ctx.lineWidth = 2;
    ctx.strokeStyle = "dimgray";
    ctx.beginPath();
    let y0 = this.y + this.halfHeight * 3 / 2;
    ctx.moveTo(this.trackLeft, y0);
    ctx.lineTo(this.trackRight, y0);
    ctx.stroke();
    ctx.lineWidth = 0.5;

    // draw the knob
    ctx.save();
    ctx.fillStyle = "gray";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "black";
    ctx.beginPath();
    ctx.rect(this.knob.x, this.knob.y, this.knob.width, this.knob.height);
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw the port
    ctx.strokeStyle = "black";
    this.ports[0].draw(ctx, this.small);

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.halfHeight;
  }

}
