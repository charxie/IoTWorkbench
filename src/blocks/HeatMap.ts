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
  private zmin: number;
  private zmax: number;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly colorScheme: string;
    readonly viewWindowColor: string;

    constructor(b: HeatMap) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.colorScheme = b.colorScheme;
      this.viewWindowColor = b.viewWindowColor;
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
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  private createCells(): void {
    let cols = this.data.length;
    if (cols < 3) return;
    let rows = this.data[0].length;
    this.xmin = this.ymin = this.zmin = Number.MAX_VALUE;
    this.xmax = this.ymax = this.zmax = -Number.MAX_VALUE;
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
      if (this.zmin > this.data[2][i]) {
        this.zmin = this.data[2][i];
      }
      if (this.zmax < this.data[2][i]) {
        this.zmax = this.data[2][i];
      }
    }
    for (let i = 0; i < rows; i++) {
      this.cellPositions.push(new Point(this.data[0][i] - this.xmin, this.data[1][i] - this.ymin));
      this.cellValues.push(this.data[2][i]);
    }
    let nx = this.xmax - this.xmin + 1;
    let ny = this.ymax - this.ymin + 1;
    if (this.viewWindow.x === 0 && this.viewWindow.y === 0) {
      this.viewWindow.x = this.x + this.viewMargin.left;
      this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
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
    this.viewMargin.bottom = 10;
    this.viewMargin.left = 10;
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
