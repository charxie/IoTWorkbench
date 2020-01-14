/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Arc} from "../math/Arc";
import {flowchart} from "../Main";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class MomentarySwitch extends Block {

  private checked: boolean = false;
  private knob: Arc;
  private knobRadius: number = 10;
  private knobGrabbed: boolean;
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

    constructor(momentarySwitch: MomentarySwitch) {
      this.name = momentarySwitch.name;
      this.uid = momentarySwitch.uid;
      this.x = momentarySwitch.x;
      this.y = momentarySwitch.y;
      this.width = momentarySwitch.width;
      this.height = momentarySwitch.height;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#B22222";
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.knobRadius = this.halfHeight / 2 - this.yMargin;
    this.knob = new Arc(this.x + this.knobRadius + this.xMargin, this.y + this.halfHeight * 3 / 2, this.knobRadius, 0, 2 * Math.PI, true);
  }

  getCopy(): Block {
    let copy = new MomentarySwitch("Momentary Switch #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
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
    this.xMargin = this.iconic ? 8 : 24;
    this.yMargin = this.iconic ? 2 : 6;
    this.halfHeight = this.height / 2;
    this.knobRadius = this.halfHeight / 2 - this.yMargin;
    this.knob.setCenter(this.x + this.knobRadius + this.xMargin, this.y + this.halfHeight * 3 / 2);
    this.ports[0].setX(this.width);
    this.ports[0].setY(this.height / 2);
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

    if (!this.iconic) {
      ctx.font = "8px Arial";
      ctx.fillStyle = "black";
      let textWidth = ctx.measureText("OFF").width;
      //ctx.fillText("OFF", this.knob.x - textWidth - 12, textCenterY);
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

  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3) return; // if this is a right-click event
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.onKnob(x, y)) {
      this.mouseDownRelativeX = x - this.knob.x;
      this.mouseDownRelativeY = y - this.knob.y;
      this.knobGrabbed = true;
      return true;
    }
    return false;
  }

  mouseUp(e: MouseEvent): void {
    this.updateModel();
    flowchart.traverse(this);
    if (this.isExportedToGlobalVariable()) {
      flowchart.updateResults();
    }
    flowchart.storeBlockStates();
    this.knobGrabbed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
    if (e.which == 3) return; // if this is a right-click event
    let x = e.offsetX;
    let y = e.offsetY;
    if (this.knobGrabbed) {
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

  isExportedToGlobalVariable(): boolean {
    let connectors = flowchart.getConnectorsWithOutput(this.ports[0]);
    if (connectors.length > 0) {
      for (let c of connectors) {
        if (c.getInput().getBlock() instanceof GlobalVariableBlock) return true;
      }
    }
    return false;
  }

}
