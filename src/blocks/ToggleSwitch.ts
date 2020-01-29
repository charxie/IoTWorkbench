/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Arc} from "../math/Arc";
import {Stadium} from "../math/Stadium";
import {flowchart} from "../Main";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class ToggleSwitch extends Block {

  private checked: boolean = false;
  private knob: Arc;
  private knobRadius: number = 10;
  private track: Stadium;
  private trackMin: number;
  private trackMax: number;
  private knobGrabbed: boolean;
  private knobSelected: boolean;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private halfHeight: number;
  private xMargin: number = 8;
  private yMargin: number = 4;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly checked: boolean;

    constructor(toggleSwitch: ToggleSwitch) {
      this.name = toggleSwitch.name;
      this.uid = toggleSwitch.uid;
      this.x = toggleSwitch.x;
      this.y = toggleSwitch.y;
      this.width = toggleSwitch.width;
      this.height = toggleSwitch.height;
      this.checked = toggleSwitch.checked;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#FF1493";
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.knobRadius = this.halfHeight / 2 - this.yMargin;
    this.trackMin = this.x + this.knobRadius + this.xMargin;
    this.trackMax = this.x + this.width - this.knobRadius - this.xMargin;
    this.track = new Stadium(this.trackMin, this.y + this.halfHeight + this.yMargin, this.trackMax - this.trackMin, 2 * this.knobRadius);
    this.knob = new Arc(this.trackMin, this.y + this.halfHeight * 3 / 2, this.knobRadius, 0, 2 * Math.PI, true);
  }

  getCopy(): Block {
    let copy = new ToggleSwitch("Switch #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.checked = this.checked;
    return copy;
  }

  destroy(): void {
  }

  setChecked(checked: boolean): void {
    this.checked = checked;
  }

  isChecked(): boolean {
    return this.checked;
  }

  updateModel(): void {
    this.ports[0].setValue(this.checked);
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.xMargin = this.iconic ? 8 : 24;
    this.yMargin = this.iconic ? 2 : 6;
    this.halfHeight = this.height / 2;
    this.knobRadius = this.halfHeight / 2 - this.yMargin;
    this.trackMin = this.x + this.knobRadius + this.xMargin;
    this.trackMax = this.x + this.width - this.knobRadius - this.xMargin;
    this.knob.setCenter(this.checked ? this.trackMax : this.trackMin, this.y + this.halfHeight * 3 / 2);
    this.track.setRect(this.trackMin, this.y + this.halfHeight + this.yMargin, this.trackMax - this.trackMin, 2 * this.knobRadius);
    this.ports[0].setX(this.width);
    this.ports[0].setY(this.height / 2);
  }

  draw(ctx: CanvasRenderingContext2D): void {

    ctx.clearRect(this.x, this.y, this.width, this.height);
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

    // draw the track
    ctx.lineWidth = 2;
    ctx.fillStyle = "lightgray";
    ctx.beginPath();
    ctx.rect(this.track.rectangle.x, this.track.rectangle.y, this.track.rectangle.width, this.track.rectangle.height);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.track.arcLeft.x, this.track.arcLeft.y, this.track.arcLeft.radius, this.track.arcLeft.startAngle, this.track.arcLeft.endAngle, this.track.arcLeft.anticlockwise);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.track.arcRight.x, this.track.arcRight.y, this.track.arcRight.radius, this.track.arcRight.startAngle, this.track.arcRight.endAngle, this.track.arcRight.anticlockwise);
    ctx.fill();
    ctx.lineWidth = 0.5;

    if (!this.iconic) {
      ctx.font = "8px Arial";
      ctx.fillStyle = "black";
      let textWidth = ctx.measureText("OFF").width;
      let textCenterY = this.track.rectangle.getCenterY() + 3;
      ctx.fillText("OFF", this.trackMin - textWidth - 12, textCenterY);
      ctx.fillText("ON", this.trackMax + 13, textCenterY);
    }

    // draw the knob
    ctx.save();
    ctx.fillStyle = "white";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "black";
    ctx.beginPath();
    ctx.arc(this.knob.x, this.knob.y, this.knob.radius, 0, 2 * Math.PI);
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

  onKnob(x: number, y: number): boolean {
    return this.knob.contains(x, y);
  }

  isKnobSelected(): boolean {
    return this.knobSelected;
  }

  private updateAll(): void {
    flowchart.traverse(this);
    if (flowchart.isConnectedToGlobalVariable(this)) {
      flowchart.updateResults();
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
    switch (e.key) {
      case "ArrowLeft":
        this.checked = false;
        this.refreshView();
        break;
      case "ArrowRight":
        this.checked = true;
        this.refreshView();
        break;
    }
  }

  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3) return; // if this is a right-click event
    let x = e.offsetX;
    let y = e.offsetY;
    this.knobSelected = false;
    if (this.onKnob(x, y)) {
      this.mouseDownRelativeX = x - this.knob.x;
      this.mouseDownRelativeY = y - this.knob.y;
      this.knobGrabbed = true;
      this.knobSelected = true;
      return true;
    }
    return false;
  }

  mouseUp(e: MouseEvent): void {
    if (this.knobGrabbed) {
      this.checked = this.knob.x > (this.trackMin + this.trackMax) / 2;
      this.updateAll();
      this.knobGrabbed = false;
    }
    this.knob.x = this.knob.x < (this.trackMin + this.trackMax) / 2 ? this.trackMin : this.trackMax;
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
    if (e.which == 3) return; // if this is a right-click event
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.knobGrabbed) {
      this.knob.x = x - this.mouseDownRelativeX;
      if (this.knob.x < this.trackMin) {
        this.knob.x = this.trackMin;
      } else if (this.knob.x > this.trackMax) {
        this.knob.x = this.trackMax;
      }
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
