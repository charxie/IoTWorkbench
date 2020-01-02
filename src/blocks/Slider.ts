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
  private knobHalfSize: number = 4;
  private trackLeft: number;
  private trackRight: number;
  private halfHeight: number;
  private knobGrabbed: boolean;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private minimum: number = 0;
  private maximum: number = 100;
  private steps: number = 10;
  private value: number = 50;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly minimum: number;
    readonly maximum: number;
    readonly steps: number;
    readonly value: number;

    constructor(slider: Slider) {
      this.name = slider.name;
      this.uid = slider.uid;
      this.x = slider.x;
      this.y = slider.y;
      this.width = slider.width;
      this.height = slider.height;
      this.minimum = slider.minimum;
      this.maximum = slider.maximum;
      this.steps = slider.steps;
      this.value = slider.value;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#483D8B";
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.knob = new Rectangle(this.x + this.width / 2 - this.knobHalfSize / 2, this.y + this.halfHeight + 4, this.knobHalfSize, this.halfHeight - 8);
    this.trackLeft = this.x + 8;
    this.trackRight = this.x + this.width - 8;
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

  updateModel(): void {
    this.ports[0].setValue(this.value);
    this.updateConnectors();
  }

  refreshView(): void {
    this.halfHeight = this.height / 2;
    this.trackLeft = this.x + 8;
    this.trackRight = this.x + this.width - 8;
    let x = this.trackLeft + (this.value - this.minimum) / (this.maximum - this.minimum) * (this.trackRight - this.trackLeft);
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
    ctx.font = this.small ? "10px Arial" : "bold 16px Arial";
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

    // draw the track with tickmarks
    ctx.lineWidth = 2;
    ctx.strokeStyle = "dimgray";
    ctx.beginPath();
    let y0 = this.y + this.halfHeight * 3 / 2;
    ctx.moveTo(this.trackLeft, y0);
    ctx.lineTo(this.trackRight, y0);
    ctx.stroke();
    ctx.lineWidth = 0.5;
    let dx = (this.trackRight - this.trackLeft) / this.steps;
    for (let i = 0; i <= this.steps; i++) {
      ctx.beginPath();
      ctx.moveTo(this.trackLeft + dx * i, y0 - 6);
      ctx.lineTo(this.trackLeft + dx * i, y0);
      ctx.stroke();
    }

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

  onKnob(x: number, y: number): boolean {
    return this.knob.contains(x, y);
  }

  mouseDown(e: MouseEvent): boolean {
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.onKnob(x, y)) {
      this.mouseDownRelativeX = x - this.knob.getCenterX();
      this.mouseDownRelativeY = y - this.knob.getCenterY();
      this.knobGrabbed = true;
      return true;
    }
    return false;
  }

  mouseUp(e: MouseEvent): void {
    this.knobGrabbed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.knobGrabbed) {
      this.knob.x = x - this.mouseDownRelativeX;
      if (this.knob.x < this.trackLeft - this.knobHalfSize) {
        this.knob.x = this.trackLeft - this.knobHalfSize;
      } else if (this.knob.x > this.trackRight - this.knobHalfSize) {
        this.knob.x = this.trackRight - this.knobHalfSize;
      }
      this.value = this.minimum + (this.maximum - this.minimum) / (this.trackRight - this.trackLeft) * (this.knob.x + this.knobHalfSize - this.trackLeft);
      this.updateModel();
      flowchart.traverse(this);
      flowchart.storeBlockStates();
    } else {
      if (this.onKnob(x, y)) {
        if (e.target instanceof HTMLCanvasElement) {
          e.target.style.cursor = this.knobGrabbed ? "grabbing" : "grab";
        }
      }
    }
  }

  mouseLeave(e: MouseEvent): void {
    this.knobGrabbed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
