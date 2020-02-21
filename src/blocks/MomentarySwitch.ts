/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Arc} from "../math/Arc";
import {flowchart} from "../Main";

export class MomentarySwitch extends Block {

  private pressed: boolean = false;
  private fireOnlyAtMouseUp: boolean = false;
  private button: Arc;
  private buttonRadius: number = 10;
  private mouseDownRelativeX: number;
  private mouseDownRelativeY: number;
  private halfHeight: number;
  private yMargin: number = 4;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly fireOnlyAtMouseUp: boolean;

    constructor(momentarySwitch: MomentarySwitch) {
      this.name = momentarySwitch.name;
      this.uid = momentarySwitch.uid;
      this.x = momentarySwitch.x;
      this.y = momentarySwitch.y;
      this.width = momentarySwitch.width;
      this.height = momentarySwitch.height;
      this.fireOnlyAtMouseUp = momentarySwitch.fireOnlyAtMouseUp;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.initiator = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#B22222";
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.buttonRadius = this.halfHeight / 2 - this.yMargin;
    this.button = new Arc(this.x + this.width / 2, this.y + this.halfHeight * 3 / 2, this.buttonRadius, 0, 2 * Math.PI, true);
  }

  getCopy(): Block {
    return new MomentarySwitch("Momentary Switch #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
  }

  destroy(): void {
  }

  setPressed(pressed: boolean): void {
    this.pressed = pressed;
  }

  isPressed(): boolean {
    return this.pressed;
  }

  setFireOnlyAtMouseUp(fireOnlyAtMouseUp: boolean): void {
    this.fireOnlyAtMouseUp = fireOnlyAtMouseUp;
  }

  getFireOnlyAtMouseUp(): boolean {
    return this.fireOnlyAtMouseUp;
  }

  refreshView(): void {
    super.refreshView();
    this.yMargin = this.iconic ? 2 : 6;
    this.halfHeight = this.height / 2;
    this.buttonRadius = this.halfHeight / 2 - this.yMargin;
    this.button.setCenter(this.x + this.width / 2, this.y + this.halfHeight * 3 / 2);
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
    ctx.fillStyle = "white";
    ctx.fillHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");

    // draw the button
    ctx.fillStyle = "crimson";
    if (this.pressed) {
      ctx.beginPath();
      ctx.arc(this.button.x, this.button.y, this.button.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "black";
      ctx.stroke();
    } else {
      ctx.save();
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
      ctx.shadowColor = "black";
      ctx.beginPath();
      ctx.arc(this.button.x, this.button.y, this.button.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
      ctx.lineWidth = 0.75;
    }

    if (!this.iconic) {
      ctx.font = "8px Arial";
      ctx.fillStyle = "white";
      let text = this.pressed ? "ON" : "OFF";
      let textWidth = ctx.measureText(text).width;
      let textHeight = ctx.measureText("M").width;
      ctx.fillText(text, this.button.x - textWidth / 2, this.button.y + textHeight / 2);
    }

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

  onButton(x: number, y: number): boolean {
    return this.button.contains(x, y);
  }

  updateModel(): void {
    this.ports[0].setValue(this.pressed);
    this.updateConnectors();
  }

  updateImmediately(): void {
    flowchart.traverse(this);
    if (flowchart.isConnectedToGlobalBlock(this)) {
      flowchart.updateResultsExcludingAllWorkerBlocks();
    }
  }

  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.onButton(x, y)) {
      this.mouseDownRelativeX = x - this.button.x;
      this.mouseDownRelativeY = y - this.button.y;
      this.pressed = true;
      if (!this.fireOnlyAtMouseUp) {
        this.updateImmediately();
      }
      return true;
    }
    return false;
  }

  mouseUp(e: MouseEvent): void {
    if (this.pressed) {
      if (this.fireOnlyAtMouseUp) {
        this.updateImmediately();
        this.pressed = false;
      } else {
        this.pressed = false;
        this.updateImmediately();
      }
    }
    flowchart.storeBlockStates();
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseLeave(e: MouseEvent): void {
    this.pressed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
