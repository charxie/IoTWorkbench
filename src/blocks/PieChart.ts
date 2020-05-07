/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {Vector} from "../math/Vector";

export class PieChart extends Block {

  private portI: Port;
  private data: number[];
  private angularData: number[];
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private startColor: string = "pink";
  private midColor: string = "lightgreen";
  private endColor: string = "lightblue";
  private fractionDigits: number = 3;
  private mouseOverX: number;
  private mouseOverY: number;
  private readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private colorScale;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly viewWindowColor: string;
    readonly startColor: string;
    readonly midColor: string;
    readonly endColor: string;
    readonly fractionDigits: number;

    constructor(b: PieChart) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.viewWindowColor = b.viewWindowColor;
      this.startColor = b.startColor;
      this.midColor = b.midColor;
      this.endColor = b.endColor;
      this.fractionDigits = b.fractionDigits;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#88EE88";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.ports.push(this.portI);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.marginX = 25;
    this.colorScale = d3.scaleLinear().domain([0, Math.PI, 2 * Math.PI]).range([this.startColor, this.midColor, this.endColor]);
  }

  getCopy(): Block {
    let copy = new PieChart("Pie Chart #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.viewWindowColor = this.viewWindowColor;
    copy.startColor = this.startColor;
    copy.midColor = this.midColor;
    copy.endColor = this.endColor;
    return copy;
  }

  destroy(): void {
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
  }

  setFractionDigits(fractionDigits: number): void {
    this.fractionDigits = fractionDigits;
  }

  getFractionDigits(): number {
    return this.fractionDigits;
  }

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.2 : 0.1, Util.adjust(this.color, -20));
        shade.addColorStop(1, Util.adjust(this.color, -100));
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
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let title = this.name + (this.data === undefined ? "" : " (" + this.data.length + " points)");
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the space
    ctx.fillStyle = "#FDFFFD";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.viewWindow.x = this.x + this.viewMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.viewWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 2;
      ctx.fillText("Pie", this.viewWindow.x + this.viewWindow.width / 2 - ctx.measureText("2D").width / 2, this.viewWindow.y + this.viewWindow.height / 2 + h / 2);
    }

    // draw pie chart
    ctx.save();
    ctx.translate(this.viewWindow.x + this.viewWindow.width / 2, this.viewWindow.y + this.viewWindow.height / 2);
    if (this.angularData !== undefined) {
      let angle = 0;
      let r = Math.min(this.viewWindow.width, this.viewWindow.height) * 0.4;
      for (let i = 0; i < this.angularData.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if (angle === 0) {
          ctx.lineTo(r, 0);
        } else {
          ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        ctx.arc(0, 0, r, angle, angle + this.angularData[i], false);
        ctx.closePath();
        ctx.fillStyle = this.colorScale(this.angularData[i]);
        ctx.fill();
        angle += this.angularData[i];
      }
      angle = 0;
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      let midAngle;
      let dataLabel;
      let dataLabelLength;
      for (let i = 0; i < this.angularData.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if (angle === 0) {
          ctx.lineTo(r, 0);
        } else {
          ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        ctx.arc(0, 0, r, angle, angle + this.angularData[i], false);
        ctx.closePath();
        ctx.stroke();
        midAngle = angle + this.angularData[i] / 2;
        dataLabel = this.data[i].toFixed(this.fractionDigits);
        dataLabelLength = ctx.measureText(dataLabel).width;
        ctx.fillText(dataLabel, (r * Math.cos(midAngle) - dataLabelLength) / 2, r * Math.sin(midAngle) / 2);
        angle += this.angularData[i];
      }
    }
    ctx.restore();

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      p.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let v = this.portI.getValue();
    if (v instanceof Vector) {
      this.data = v.getValues();
    } else {
      if (Array.isArray(v)) {
        this.data = v;
      }
    }
    if (this.data !== undefined) {
      let sum = 0;
      for (let i = 0; i < this.data.length; i++) {
        sum += this.data[i];
      }
      if (sum !== 0) {
        sum = 2 * Math.PI / sum;
        if (this.angularData === undefined || this.angularData.length !== this.data.length) {
          this.angularData = new Array(this.data.length);
        }
        for (let i = 0; i < this.data.length; i++) {
          this.angularData[i] = this.data[i] * sum;
        }
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 10;
    this.viewMargin.left = 10;
    this.viewMargin.right = 10;
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

}
