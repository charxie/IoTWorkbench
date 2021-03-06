/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class Slider extends Block {

  private knob: Rectangle;
  private knobHalfSize: number = 4;
  private trackLeft: number;
  private trackRight: number;
  private halfHeight: number;
  private knobGrabbed: boolean;
  private knobSelected: boolean;
  private trackSelected: boolean;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private minimum: number = 0;
  private maximum: number = 100;
  private steps: number = 10;
  private value: number = 50;
  private snapToTick: boolean;
  private valuePrecision: number = 2;
  private static readonly dashedLine = [2, 2];

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
    readonly source: boolean;
    readonly snapToTick: boolean;
    readonly valuePrecision: number;

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
      this.source = slider.source;
      this.snapToTick = slider.snapToTick;
      this.valuePrecision = slider.valuePrecision;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.initiator = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#A8BBAB";
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.knob = new Rectangle(this.x + this.width / 2 - this.knobHalfSize / 2, this.y + this.halfHeight + 4, this.knobHalfSize, this.halfHeight - 8);
    this.trackLeft = this.x + 8;
    this.trackRight = this.x + this.width - 8;
  }

  getCopy(): Block {
    let copy = new Slider("Slider #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimum = this.minimum;
    copy.maximum = this.maximum;
    copy.steps = this.steps;
    copy.value = this.value;
    copy.snapToTick = this.snapToTick;
    copy.source = this.source;
    copy.valuePrecision = this.valuePrecision;
    return copy;
  }

  destroy(): void {
  }

  setValue(value: number): void {
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  setValuePrecision(valuePrecision: number): void {
    this.valuePrecision = valuePrecision;
  }

  getValuePrecision(): number {
    return this.valuePrecision;
  }

  setSnapToTick(snapToTick: boolean): void {
    this.snapToTick = snapToTick;
  }

  getSnapToTick(): boolean {
    return this.snapToTick;
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

  isKnobSelected(): boolean {
    return this.knobSelected;
  }

  isTrackSelected(): boolean {
    return this.trackSelected;
  }

  updateModel(): void {
    this.ports[0].setValue(this.value);
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.halfHeight = this.height / 2;
    this.trackLeft = this.x + 8;
    this.trackRight = this.x + this.width - 8;
    let x = this.trackLeft + (this.value - this.minimum) / (this.maximum - this.minimum) * (this.trackRight - this.trackLeft);
    this.knob.setRect(x - this.knobHalfSize, this.y + this.halfHeight + 4, 2 * this.knobHalfSize, this.halfHeight - 8);
    this.ports[0].setX(this.width);
    this.ports[0].setY(this.height / 2);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.halfHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
        shade.addColorStop(1, this.color);
        ctx.fillStyle = shade;
        break;
      case "Plain":
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");

    // draw the name in the upper area if this is not an icon
    if (!this.iconic) {
      ctx.save();
      ctx.fillStyle = "dimgray";
      ctx.strokeStyle = "black";
      ctx.lineWidth = this.iconic ? 0.75 : 1;
      ctx.font = this.iconic ? "10px Arial" : "11px Arial";
      let t = this.name + "=" + this.value.toPrecision(this.valuePrecision);
      let textWidth = ctx.measureText(t).width;
      ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + this.halfHeight / 2 + 4);
      ctx.fillText(t, 0, 0);
      ctx.restore();
    }

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
    if (this.trackSelected) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "gray";
      ctx.setLineDash(Slider.dashedLine);
      ctx.beginPath();
      ctx.rect(this.trackLeft, this.knob.y, this.trackRight - this.trackLeft, this.knob.height);
      ctx.stroke();
      ctx.restore();
    }

    // draw the knob
    ctx.save();
    ctx.fillStyle = "lightgray";
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
    this.ports[0].draw(ctx, this.iconic);

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.halfHeight;
  }

  private onKnob(x: number, y: number): boolean {
    return this.knob.contains(x, y);
  }

  private onTrack(x: number, y: number): boolean {
    return x < this.trackRight && x > this.trackLeft && y < this.knob.getYmax() && y > this.knob.getYmin();
  }

  private setValueFromKnob(x: number): void {
    this.knob.x = x;
    if (this.knob.x < this.trackLeft - this.knobHalfSize) {
      this.knob.x = this.trackLeft - this.knobHalfSize;
    } else if (this.knob.x > this.trackRight - this.knobHalfSize) {
      this.knob.x = this.trackRight - this.knobHalfSize;
    }
    this.value = this.minimum + (this.maximum - this.minimum) / (this.trackRight - this.trackLeft) * (this.knob.x + this.knobHalfSize - this.trackLeft);
  }

  private updateAll(): void {
    flowchart.traverse(this);
    if (flowchart.isConnectedToGlobalBlock(this)) {
      flowchart.updateResultsExcludingAllWorkerBlocks();
    }
    flowchart.storeBlockStates();
  }

  keyUp(e: KeyboardEvent): void {
    let update = false;
    switch (e.key) {
      case "ArrowLeft":
        update = true;
        break;
      case "ArrowRight":
        update = true;
        break;
    }
    if (update) {
      this.updateAll();
      flowchart.blockView.requestDraw();
    }
  }

  keyDown(e: KeyboardEvent): void {
    let dv = (this.maximum - this.minimum) / this.steps;
    switch (e.key) {
      case "ArrowLeft":
        this.setValue(Math.max(this.value - dv, this.minimum));
        this.refreshView();
        break;
      case "ArrowRight":
        this.setValue(Math.min(this.value + dv, this.maximum));
        this.refreshView();
        break;
    }
  }

  // return true if the knob is grabbed
  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3 || e.button == 2) return false; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    this.knobSelected = false;
    this.trackSelected = false;
    if (this.onKnob(x, y)) {
      this.mouseDownRelativeX = x - this.knob.getCenterX();
      this.mouseDownRelativeY = y - this.knob.getCenterY();
      this.knobGrabbed = true;
      this.knobSelected = true;
      this.trackSelected = true;
      return true;
    }
    if (this.onTrack(x, y)) {
      this.trackSelected = true;
    }
    return false;
  }

  mouseUp(e: MouseEvent): void {
    if (e.which == 3 || e.button == 2) return; // if this is a right-click event
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.onDraggableArea(x, y)) return;
    let onTrack = this.onTrack(x, y);
    if (!this.knobGrabbed && onTrack) {
      this.setValueFromKnob(x - this.knobHalfSize);
    }
    if (this.snapToTick) {
      let d = (this.maximum - this.minimum) / this.steps;
      let n = Math.round(this.value / d);
      this.value = n * d;
      this.refreshView();
      this.updateAll();
    } else {
      if (!this.knobGrabbed && onTrack) {
        this.updateAll();
      }
      // if the knob is grabbed, updateAll is already called in the mouseMove method
    }
    this.knobGrabbed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
    if (e.which == 3 || e.button == 2) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.knobGrabbed) {
      this.setValueFromKnob(x - this.mouseDownRelativeX);
      this.updateAll();
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
