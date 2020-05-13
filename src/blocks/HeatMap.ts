/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {ColorSchemes} from "./ColorSchemes";
import {Point} from "../math/Point";

export class HeatMap extends Block {

  private portI: Port;
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private interpolateColor = d3.interpolatePuRd;
  private colorScheme: string = "PuRd";
  private cellSize: number;
  private cellPositions: Point[];
  private cellValues: number[]
  private data: number[][];
  private xmin: number;
  private xmax: number;
  private ymin: number;
  private ymax: number;
  private xinc: number;
  private yinc: number;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly colorScheme: string;
    readonly viewWindowColor: string;
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;

    constructor(b: HeatMap) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.colorScheme = b.colorScheme;
      this.viewWindowColor = b.viewWindowColor;
      this.xAxisLabel = b.xAxisLabel;
      this.yAxisLabel = b.yAxisLabel;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#F96";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.ports.push(this.portI);
    this.marginX = 25;
    this.viewWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new HeatMap("Heat Map #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.colorScheme = this.colorScheme;
    copy.viewWindowColor = this.viewWindowColor;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
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

  setXAxisLabel(xAxisLabel: string): void {
    this.xAxisLabel = xAxisLabel;
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  setYAxisLabel(yAxisLabel: string): void {
    this.yAxisLabel = yAxisLabel;
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setWidth(width: number): void {
    super.setWidth(width)
    this.viewMargin.left = this.viewMargin.right = 10;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
  }

  setHeight(height: number): void {
    super.setHeight(height);
    this.barHeight = Math.min(30, this.height / 3);
    this.viewMargin.top = this.viewMargin.bottom = 10;
    this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
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
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
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
      let xc = this.viewWindow.x + this.viewWindow.width / 2;
      let yc = this.viewWindow.y + this.viewWindow.height / 2;
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.rect(xc - 6.5, yc - 6.5, 6, 6);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "green";
      ctx.rect(xc + 0.5, yc - 6.5, 6, 6);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.rect(xc - 6.5, yc + 0.5, 6, 6);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "orange";
      ctx.rect(xc + 0.5, yc + 0.5, 6, 6);
      ctx.fill();
    }

    // draw heat map
    if (!this.iconic) {
      this.drawAxisLabels(ctx);
      if (this.cellPositions !== undefined) {
        this.drawHeatMap(ctx);
      }
    }

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

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.viewMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.viewWindow.x + (this.viewWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 25);
    ctx.save();
    ctx.translate(this.x + 20, this.viewWindow.y + (this.viewWindow.height + ctx.measureText(this.yAxisLabel).width) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  private drawHeatMap(ctx: CanvasRenderingContext2D): void {
    let gap = 2;
    let color = d3.scaleLinear().domain(d3.extent(this.cellValues)).interpolate(() => this.interpolateColor);
    for (let i = 0; i < this.cellPositions.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = color(this.cellValues[i]);
      ctx.rect(this.viewWindow.x + this.cellPositions[i].x * this.cellSize + gap, this.viewWindow.y + this.cellPositions[i].y * this.cellSize + gap,
        this.cellSize - 2 * gap, this.cellSize - 2 * gap);
      ctx.fill();
    }
    ctx.fillStyle = "black";
    ctx.font = "9px Arial";
    let h = ctx.measureText("M").width / 2;
    let x = this.xmin;
    let label;
    let count = 0;
    do {
      label = x.toString();
      ctx.fillText(label, this.viewWindow.x + (count + 0.5) * this.cellSize - ctx.measureText(label).width / 2, this.viewWindow.y + this.viewWindow.height + h + 6);
      x += this.xinc;
      count++;
    } while (x <= this.xmax);
    let y = this.ymin;
    count = 0;
    do {
      label = y.toString();
      ctx.fillText(label, this.viewWindow.x - ctx.measureText(label).width - 4, this.viewWindow.y + this.viewWindow.height - (count + 0.5) * this.cellSize + h);
      y += this.yinc;
      count++;
    } while (y <= this.ymax);
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  private createCells(): void {
    let cols = this.data.length;
    if (cols < 3) return;
    let rows = this.data[0].length;
    this.xmin = this.ymin = Number.MAX_VALUE;
    this.xmax = this.ymax = -Number.MAX_VALUE;
    this.xinc = this.yinc = Number.MAX_VALUE;
    let dx, dy;
    this.cellPositions = [];
    this.cellValues = [];
    for (let i = 0; i < rows; i++) {
      if (this.xmin > this.data[0][i]) {
        this.xmin = this.data[0][i];
      }
      if (this.xmax < this.data[0][i]) {
        this.xmax = this.data[0][i];
      }
      if (this.ymin > this.data[1][i]) {
        this.ymin = this.data[1][i];
      }
      if (this.ymax < this.data[1][i]) {
        this.ymax = this.data[1][i];
      }
      for (let j = i + 1; j < rows; j++) {
        dx = Math.abs(this.data[0][j] - this.data[0][i]);
        dy = Math.abs(this.data[1][j] - this.data[1][i]);
        if (dx !== 0 && dx < this.xinc) this.xinc = dx;
        if (dy !== 0 && dy < this.yinc) this.yinc = dy;
      }
    }
    let nx = (this.xmax - this.xmin) / this.xinc + 1;
    let ny = (this.ymax - this.ymin) / this.yinc + 1;
    for (let i = 0; i < rows; i++) {
      this.cellPositions.push(new Point((this.data[0][i] - this.xmin) / this.xinc, (this.data[1][i] - this.ymin) / this.yinc));
      this.cellValues.push(this.data[2][i]);
    }
    if (this.viewWindow.x === 0 && this.viewWindow.y === 0) {
      this.viewWindow.x = this.x + this.viewMargin.left;
      this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
      this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
      this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
    }
    this.cellSize = Math.min(this.viewWindow.width / nx, this.viewWindow.height / ny);
  }

  updateModel(): void {
    this.data = this.portI.getValue();
    if (this.data !== undefined && Array.isArray(this.data) && Array.isArray(this.data[0])) {
      this.createCells();
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 40;
    this.viewMargin.left = 40;
    this.viewMargin.right = 10;
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

  getColorScheme(): string {
    return this.colorScheme;
  }

  setColorScheme(colorScheme: string): void {
    this.colorScheme = colorScheme;
    this.interpolateColor = ColorSchemes.getInterpolateColorScheme(colorScheme);
  }

}
