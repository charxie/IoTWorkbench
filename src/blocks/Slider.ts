/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";

export class Slider extends Block {

  private knob: Rectangle;
  private readonly halfHeight: number;
  private knobGrabbed: boolean;
  private knobPosition: number;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private minimum: number = 0;
  private maximum: number = 100;
  private steps: number = 20;
  private value: number = 50;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly minimum: number;
    readonly maximum: number;
    readonly steps: number;
    readonly value: number;

    constructor(slider: Slider) {
      this.name = slider.name;
      this.uid = slider.uid;
      this.x = slider.x;
      this.y = slider.y;
      this.minimum = slider.minimum;
      this.maximum = slider.maximum;
      this.steps = slider.steps;
      this.value = slider.value;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#483D8B";
    this.ports.push(new Port(this, false, null, this.width, this.height / 2, true));
    this.knob = new Rectangle(this.x + this.width / 2 - 2, this.y + this.halfHeight + 4, 4, this.halfHeight - 8);
  }

  setValue(value: number): void {
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  setMinimum(minimum: number): void {
    this.minimum = minimum;
  }

  getMinimum(): number {
    return this.minimum;
  }

  setMaximum(maximum: number): void {
    this.maximum = maximum;
  }

  getMaximum(): number {
    return this.maximum;
  }

  setSteps(steps: number): void {
    this.steps = steps;
  }

  getSteps(): number {
    return this.steps;
  }

  update(): void {
    super.update();
    this.knob.setRect(this.x + this.width / 2 - 3, this.y + this.halfHeight + 4, 6, this.halfHeight - 8);
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

    // draw the track and knob
    ctx.lineWidth = 2;
    ctx.strokeStyle = "dimgray";
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y + this.halfHeight * 3 / 2);
    ctx.lineTo(this.x + this.width - 10, this.y + this.halfHeight * 3 / 2);
    ctx.stroke();
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.rect(this.knob.x, this.knob.y, this.knob.width, this.knob.height);
    ctx.fill();
    ctx.stroke();

    // draw the port
    ctx.font = this.small ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.ports[0].draw(ctx, this.small);

  }

  onKnob(x: number, y: number): boolean {
    return this.knob.contains(x, y);
  }

  mouseDown(e: MouseEvent): void {
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.onKnob(x, y)) {
      this.mouseDownRelativeX = x - this.knob.getCenterX();
      this.mouseDownRelativeY = y - this.knob.getCenterY();
      this.knobGrabbed = true;
      flowchart.blockView.preventMainMouseEvent(true);
    } else {
      flowchart.blockView.preventMainMouseEvent(false);
    }
  }

  mouseUp(e: MouseEvent): void {
    this.knobGrabbed = false;
  }

  mouseMove(e: MouseEvent): void {
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.onKnob(x, y)) {
      if (e.target instanceof HTMLCanvasElement) {
        e.target.style.cursor = this.knobGrabbed ? "grabbing" : "grab";
      }
      if (this.knobGrabbed) {

      }
    }
  }

}
