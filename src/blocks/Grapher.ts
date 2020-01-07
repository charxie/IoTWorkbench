/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";

export class Grapher extends Block {

  private data: number[] = [];
  private minimumValue: number = 0;
  private maximumValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private graphWindowColor: string = "white";
  private graphWindow: Rectangle;
  private barHeight: number;
  private readonly graphMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    constructor(grapher: Grapher) {
      this.name = grapher.name;
      this.uid = grapher.uid;
      this.x = grapher.x;
      this.y = grapher.y;
      this.width = grapher.width;
      this.height = grapher.height;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#F0FFFF";
    this.ports.push(new Port(this, true, "I", 0, this.height / 2, false));
    this.graphWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new Grapher("Grapher #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    return copy;
  }

  draw(ctx: CanvasRenderingContext2D): void {

    // draw the title bar with shade
    this.barHeight = Math.min(30, this.height / 3);
    let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
    shade.addColorStop(0, "white");
    shade.addColorStop(this.iconic ? 0.2 : 0.1, Util.adjust(this.color, -20));
    shade.addColorStop(1, Util.adjust(this.color, -100));
    ctx.fillStyle = shade;
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.barHeight, this.radius, "Top");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the graph area
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.graphWindow.x = this.x + this.graphMargin.left;
    this.graphWindow.y = this.y + this.barHeight + this.graphMargin.top;
    this.graphWindow.width = this.width - this.graphMargin.left - this.graphMargin.right;
    this.graphWindow.height = this.height - this.barHeight - this.graphMargin.top - this.graphMargin.bottom;
    ctx.rect(this.graphWindow.x, this.graphWindow.y, this.graphWindow.width, this.graphWindow.height);
    ctx.stroke();
    this.drawAxisLabels(ctx);
    if (this.data.length > 1) {
      this.drawLineCharts(ctx);
    }

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.ports[0].setY(this.height / 2);
    this.ports[0].draw(ctx, this.iconic);

  }

  private drawLineCharts(ctx: CanvasRenderingContext2D): void {

    // detect minimum and maximum of y values
    let min = Number.MAX_VALUE;
    let max = -min;
    if (this.autoscale) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i] > max) {
          max = this.data[i];
        }
        if (this.data[i] < min) {
          min = this.data[i];
        }
      }
    } else {
      min = this.minimumValue;
      max = this.maximumValue;
    }

    // determine the graph window

    let dx = this.graphWindow.width / (this.data.length - 1);
    let yOffset = 0.1 * this.graphWindow.height;
    let dy = (this.graphWindow.height - 2 * yOffset) / (max - min);

    // draw the data line
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.beginPath();
    let horizontalAxisY = this.y + this.height - this.graphMargin.bottom;
    let tmpX = this.x + this.graphMargin.left;
    let tmpY = yOffset + (this.data[0] - min) * dy;
    ctx.moveTo(tmpX, horizontalAxisY - tmpY);
    ctx.fillText("0", tmpX - 4, horizontalAxisY + 10);
    for (let i = 1; i < this.data.length; i++) {
      tmpX = this.x + this.graphMargin.left + dx * i;
      tmpY = yOffset + (this.data[i] - min) * dy;
      ctx.lineTo(tmpX, horizontalAxisY - tmpY);
    }
    ctx.stroke();

    // draw symbols on top of the line
    for (let i = 0; i < this.data.length; i++) {
      tmpX = this.x + this.graphMargin.left + dx * i;
      tmpY = yOffset + (this.data[i] - min) * dy;
      ctx.beginPath();
      ctx.arc(tmpX, horizontalAxisY - tmpY, 3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.stroke();
    }

    // draw x-axis tick marks
    let spacing = Math.pow(10, Util.countDigits(this.data.length) - 1);
    for (let i = 0; i < this.data.length; i++) {
      if (i % spacing == 0) {
        tmpX = this.x + this.graphMargin.left + dx * i;
        ctx.beginPath();
        ctx.moveTo(tmpX, horizontalAxisY);
        ctx.lineTo(tmpX, horizontalAxisY - 4);
        ctx.stroke();
        ctx.fillText(i.toString(), tmpX - 4, horizontalAxisY + 10);
      }
    }

    // draw y-axis tick marks
    tmpY = yOffset;
    let minString = min.toFixed(2);
    ctx.beginPath();
    ctx.moveTo(this.x + this.graphMargin.left, horizontalAxisY - tmpY);
    ctx.lineTo(this.x + this.graphMargin.left + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.save();
    ctx.translate(this.x + this.graphMargin.left - 10, horizontalAxisY - tmpY + ctx.measureText(minString).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(minString, 0, 0);
    ctx.restore();

    tmpY = yOffset + (max - min) * dy;
    let maxString = max.toFixed(2);
    ctx.beginPath();
    ctx.moveTo(this.x + this.graphMargin.left, horizontalAxisY - tmpY);
    ctx.lineTo(this.x + this.graphMargin.left + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.save();
    ctx.translate(this.x + this.graphMargin.left - 10, horizontalAxisY - tmpY + ctx.measureText(maxString).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(maxString, 0, 0);
    ctx.restore();

  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    let graphWindowWidth = this.width - this.graphMargin.left - this.graphMargin.right;
    let horizontalAxisY = this.height - this.graphMargin.bottom;
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(this.xAxisLabel, this.x + this.graphMargin.left + graphWindowWidth / 2 - ctx.measureText(this.xAxisLabel).width / 2, this.y + horizontalAxisY + 15);
    ctx.save();
    ctx.translate(this.x + 15, this.y + this.height / 2 + ctx.measureText(this.yAxisLabel).width / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let v = this.ports[0].getValue();
    this.data = Array.isArray(v) ? v : [v];
  }

  refreshView(): void {
    this.graphMargin.top = 10;
    this.graphMargin.bottom = 20;
    this.graphMargin.left = 20;
    this.graphMargin.right = 10;
    this.ports[0].setY(this.height / 2);
    this.updateModel();
  }

}
