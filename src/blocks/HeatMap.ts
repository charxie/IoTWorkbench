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
  private nx: number;
  private ny: number;
  private gap: number = 1;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private rotated: boolean = false;
  private mouseOverX: number;
  private mouseOverY: number;

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
    readonly rotated: boolean;

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
      this.rotated = b.rotated;
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
    copy.rotated = this.rotated;
    return copy;
  }

  destroy(): void {
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
    this.cellPositions = [];
    this.cellValues = [];
  }

  setRotated(rotated: boolean): void {
    this.rotated = rotated;
  }

  isRotated(): boolean {
    return this.rotated;
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
    this.viewMargin.left = 40;
    this.viewMargin.right = 10;
    this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
  }

  setHeight(height: number): void {
    super.setHeight(height);
    this.barHeight = Math.min(30, this.height / 3);
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 40;
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
    ctx.fillStyle = "#FEEFED";
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
    } else {
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
      if (this.mouseOverX !== undefined && this.mouseOverY !== undefined) {
        if (this.rotated) {
          let kx = Math.round((this.mouseOverX - this.xmin) / this.xinc);
          let ky = Math.round((this.mouseOverY - this.ymin) / this.yinc);
          let kxy = this.nx * ky + kx;
          if (kxy < this.cellValues.length && kxy >= 0) {
            ctx.font = "12px Arial";
            let reading = this.cellValues[kxy].toPrecision(3);
            let rx = kx / this.nx * this.viewWindow.width + this.cellSize / 2;
            let ry = this.viewWindow.height - ky / this.ny * this.viewWindow.height - this.cellSize / 2;
            ctx.fillStyle = "black";
            ctx.fillRoundedRect(this.viewWindow.x + rx - 18, this.viewWindow.y + ry - 14, 36, 20, 4);
            ctx.fillStyle = "white";
            ctx.fillText(reading, this.viewWindow.x + rx - ctx.measureText(reading).width / 2, this.viewWindow.y + ry);
          }
        } else {
          let kx = Math.round((this.mouseOverY - this.ymin) / this.yinc);
          let ky = Math.round((this.mouseOverX - this.xmin) / this.xinc);
          let kxy = this.ny * kx + ky;
          if (kxy < this.cellValues.length && kxy >= 0) {
            ctx.font = "12px Arial";
            let reading = this.cellValues[kxy].toPrecision(3);
            let rx = kx / this.nx * this.viewWindow.width + this.cellSize / 2;
            let ry = this.viewWindow.height - ky / this.ny * this.viewWindow.height - this.cellSize / 2;
            ctx.fillStyle = "black";
            ctx.fillRoundedRect(this.viewWindow.x + rx - 18, this.viewWindow.y + ry - 14, 36, 20, 4);
            ctx.fillStyle = "white";
            ctx.fillText(reading, this.viewWindow.x + rx - ctx.measureText(reading).width / 2, this.viewWindow.y + ry);
          }
        }
      }
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
    let color = d3.scaleLinear().domain(d3.extent(this.cellValues)).interpolate(() => this.interpolateColor);
    for (let i = 0; i < this.cellPositions.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = color(this.cellValues[i]);
      ctx.rect(this.viewWindow.x + this.cellPositions[i].x * this.cellSize + this.gap,
        this.viewWindow.y + this.viewWindow.height - (this.cellPositions[i].y + 1) * this.cellSize + this.gap,
        this.cellSize - 2 * this.gap, this.cellSize - 2 * this.gap);
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
    let colX, colY;
    if (this.rotated) {
      colX = 1; // second column should be x
      colY = 0; // first column should be y
    } else {
      colX = 0; // first column should be x
      colY = 1; // second column should be y
    }
    for (let i = 0; i < rows; i++) {
      if (this.xmin > this.data[colX][i]) {
        this.xmin = this.data[colX][i];
      }
      if (this.xmax < this.data[colX][i]) {
        this.xmax = this.data[colX][i];
      }
      if (this.ymin > this.data[colY][i]) {
        this.ymin = this.data[colY][i];
      }
      if (this.ymax < this.data[colY][i]) {
        this.ymax = this.data[colY][i];
      }
      for (let j = i + 1; j < rows; j++) {
        dx = Math.abs(this.data[colX][j] - this.data[colX][i]);
        dy = Math.abs(this.data[colY][j] - this.data[colY][i]);
        if (dx !== 0 && dx < this.xinc) this.xinc = dx;
        if (dy !== 0 && dy < this.yinc) this.yinc = dy;
      }
    }
    this.nx = (this.xmax - this.xmin) / this.xinc + 1;
    this.ny = (this.ymax - this.ymin) / this.yinc + 1;
    for (let i = 0; i < rows; i++) {
      this.cellPositions.push(new Point((this.data[colX][i] - this.xmin) / this.xinc, (this.data[colY][i] - this.ymin) / this.yinc));
      this.cellValues.push(this.data[2][i]);
    }
    if (this.viewWindow.x === 0 && this.viewWindow.y === 0) {
      this.viewWindow.x = this.x + this.viewMargin.left;
      this.viewWindow.y = this.y + this.barHeight + this.viewMargin.top;
      this.viewWindow.width = this.width - this.viewMargin.left - this.viewMargin.right;
      this.viewWindow.height = this.height - this.barHeight - this.viewMargin.top - this.viewMargin.bottom;
    }
    this.cellSize = Math.min(this.viewWindow.width / this.nx, this.viewWindow.height / this.ny);
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

  mouseMove(e: MouseEvent): void {
    this.setToolTip(e);
  }

  mouseDown(e: MouseEvent): boolean {
    this.setToolTip(e);
    return false;
  }

  private setToolTip(e: MouseEvent): void {
    if (this.data !== undefined) {
      // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
      let rect = flowchart.blockView.canvas.getBoundingClientRect();
      let lx = Math.round((e.clientX - rect.left - this.viewWindow.x - this.cellSize / 2) / this.viewWindow.width * this.nx);
      let ly = this.ny - Math.round((e.clientY - rect.top - this.viewWindow.y + this.cellSize / 2) / this.viewWindow.height * this.ny);
      if (lx >= 0 && lx < this.nx && ly >= 0 && ly < this.ny) {
        if (this.rotated) {
          this.mouseOverX = this.xmin + lx * this.xinc;
          this.mouseOverY = this.ymin + ly * this.yinc;
        } else {
          this.mouseOverX = this.xmin + ly * this.xinc;
          this.mouseOverY = this.ymin + lx * this.yinc;
        }
      }
    }
    flowchart.blockView.requestDraw();
  }

}
