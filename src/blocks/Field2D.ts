/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";

export class Field2D extends Block {

  private portI: Port;
  private portX0: Port;
  private portDX: Port;
  private portNX: Port;
  private portY0: Port;
  private portDY: Port;
  private portNY: Port;
  private data: number[];
  private x0: number;
  private dx: number;
  private nx: number;
  private y0: number;
  private dy: number;
  private ny: number;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private fieldWindowColor: string = "white";
  private showGridLines: boolean = false;
  private fieldWindow: Rectangle;
  private barHeight: number;
  private lineType: string;
  private lineColor: string;
  private lineNumber: number = 20;
  private scaleType: string = "Linear";
  private minimumColor: string = "rgb(0, 0, 0)";
  private maximumColor: string = "rgb(255, 255, 255)";
  private minimumRgb: number[] = [0, 0, 0];
  private maximumRgb: number[] = [255, 255, 255];
  private readonly spaceMargin = {
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
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly fieldWindowColor: string;
    readonly showGridLines: boolean;
    readonly lineType: string;
    readonly lineColor: string;
    readonly lineNumber: number;
    readonly scaleType: string;
    readonly minimumColor: string;
    readonly maximumColor: string;

    constructor(g: Field2D) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.xAxisLabel;
      this.yAxisLabel = g.yAxisLabel;
      this.fieldWindowColor = g.fieldWindowColor;
      this.showGridLines = g.showGridLines;
      this.lineColor = g.lineColor;
      this.lineType = g.lineType;
      this.lineNumber = g.lineNumber;
      this.scaleType = g.scaleType;
      this.minimumColor = g.minimumColor;
      this.maximumColor = g.maximumColor;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#66EE66";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 8;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.portX0 = new Port(this, true, "X0", 0, this.barHeight + 2 * dh, false);
    this.portDX = new Port(this, true, "DX", 0, this.barHeight + 3 * dh, false);
    this.portNX = new Port(this, true, "NX", 0, this.barHeight + 4 * dh, false);
    this.portY0 = new Port(this, true, "Y0", 0, this.barHeight + 5 * dh, false);
    this.portDY = new Port(this, true, "DY", 0, this.barHeight + 6 * dh, false);
    this.portNY = new Port(this, true, "NY", 0, this.barHeight + 7 * dh, false);
    this.ports.push(this.portI);
    this.ports.push(this.portX0);
    this.ports.push(this.portDX);
    this.ports.push(this.portNX);
    this.ports.push(this.portY0);
    this.ports.push(this.portDY);
    this.ports.push(this.portNY);
    this.fieldWindow = new Rectangle(0, 0, 1, 1);
    this.lineType = "Solid";
    this.lineColor = "black";
    this.marginX = 25;
  }

  getCopy(): Block {
    let copy = new Field2D("Field2D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.fieldWindowColor = this.fieldWindowColor;
    copy.showGridLines = this.showGridLines;
    copy.lineColor = this.lineColor;
    copy.lineType = this.lineType;
    copy.lineNumber = this.lineNumber;
    copy.scaleType = this.scaleType;
    copy.minimumColor = this.minimumColor;
    copy.maximumColor = this.maximumColor;
    copy.minimumRgb = this.minimumRgb.slice();
    copy.maximumRgb = this.maximumRgb.slice()
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

  setScaleType(scaleType: string): void {
    this.scaleType = scaleType;
  }

  getScaleType(): string {
    return this.scaleType;
  }

  setMinimumColor(minimumColor: string): void {
    this.minimumColor = minimumColor;
    this.minimumRgb.length = 0;
    if (Util.isHexColor(minimumColor)) {
      let c = Util.hexToRgb(minimumColor);
      this.minimumRgb.push(c.r);
      this.minimumRgb.push(c.g);
      this.minimumRgb.push(c.b);
    } else {
      let c = minimumColor.match(/\d+/g);
      if (c !== null) {
        for (let x of c) {
          this.minimumRgb.push(parseInt(x));
        }
      } else {
        let hex = Util.getHexColor(minimumColor);
        if (hex) {
          let a = Util.hexToRgb(hex);
          this.minimumRgb.push(a.r);
          this.minimumRgb.push(a.g);
          this.minimumRgb.push(a.b);
        }
      }
    }
  }

  getMinimumColor(): string {
    return this.minimumColor;
  }

  setMaximumColor(maximumColor: string): void {
    this.maximumColor = maximumColor;
    this.maximumRgb.length = 0;
    if (Util.isHexColor(maximumColor)) {
      let c = Util.hexToRgb(maximumColor);
      this.maximumRgb.push(c.r);
      this.maximumRgb.push(c.g);
      this.maximumRgb.push(c.b);
    } else {
      let c = maximumColor.match(/\d+/g);
      if (c !== null) {
        for (let x of c) {
          this.maximumRgb.push(parseInt(x));
        }
      } else {
        let hex = Util.getHexColor(maximumColor);
        if (hex) {
          let a = Util.hexToRgb(hex);
          this.maximumRgb.push(a.r);
          this.maximumRgb.push(a.g);
          this.maximumRgb.push(a.b);
        }
      }
    }
  }

  getMaximumColor(): string {
    return this.maximumColor;
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

  setFieldWindowColor(fieldWindowColor: string): void {
    this.fieldWindowColor = fieldWindowColor;
  }

  getFieldWindowColor(): string {
    return this.fieldWindowColor;
  }

  setShowGridLines(showGridLines: boolean): void {
    this.showGridLines = showGridLines;
  }

  getShowGridLines(): boolean {
    return this.showGridLines;
  }

  setLineColor(lineColor: string): void {
    this.lineColor = lineColor;
  }

  getLineColor(): string {
    return this.lineColor;
  }

  setLineType(lineType: string): void {
    this.lineType = lineType;
  }

  getLineType(): string {
    return this.lineType;
  }

  setLineNumber(lineNumber: number): void {
    this.lineNumber = lineNumber;
  }

  getLineNumber(): number {
    return this.lineNumber;
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
    this.fieldWindow.x = this.x + this.spaceMargin.left;
    this.fieldWindow.y = this.y + this.barHeight + this.spaceMargin.top;
    this.fieldWindow.width = this.width - this.spaceMargin.left - this.spaceMargin.right;
    this.fieldWindow.height = this.height - this.barHeight - this.spaceMargin.top - this.spaceMargin.bottom;
    ctx.rect(this.fieldWindow.x, this.fieldWindow.y, this.fieldWindow.width, this.fieldWindow.height);
    ctx.fillStyle = this.fieldWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // draw contour plot
    ctx.save();
    ctx.translate(this.fieldWindow.x, this.fieldWindow.y);
    if (this.data !== undefined && Array.isArray(this.data)) {
      if (this.nx === undefined) this.nx = Math.round(Math.sqrt(this.data.length));
      if (this.ny === undefined) this.ny = this.nx;
      let min = Number.MAX_VALUE;
      let max = -min;
      for (let d of this.data) {
        if (d > max) max = d;
        if (d < min) min = d;
      }
      // Compute the contour polygons at specified intervals; return an array of MultiPolygon.
      let contours;
      if (this.scaleType === "Logarithmic") {
        max = max - min + 1;
        min = 1;
        let ncon = Math.log(max);
        contours = d3.contours().size([this.nx, this.ny]).thresholds(d3.range(0, ncon, ncon / this.lineNumber).map(p => Math.exp(p)))(this.data);
      } else {
        contours = d3.contours().size([this.nx, this.ny]).thresholds(d3.range(min, max, (max - min) / this.lineNumber))(this.data);
      }
      let projection = d3.geoIdentity().reflectY(true).scale(this.fieldWindow.width / this.nx, this.fieldWindow.height / this.ny).translate([0, this.fieldWindow.height]);
      let path = d3.geoPath(projection, ctx);
      let lineIndex = 0;
      contours.forEach(c => {
        if (c.coordinates.length == 0) return;
        ctx.beginPath();
        path(c);
        if (this.minimumColor !== this.maximumColor) {
          let scale = Math.min(1, lineIndex / this.lineNumber);
          let r = this.minimumRgb[0] + scale * (this.maximumRgb[0] - this.minimumRgb[0]);
          let g = this.minimumRgb[1] + scale * (this.maximumRgb[1] - this.minimumRgb[1]);
          let b = this.minimumRgb[2] + scale * (this.maximumRgb[2] - this.minimumRgb[2]);
          ctx.fillStyle = Util.rgbToHex(r, g, b);
          ctx.fill();
        }
        switch (this.lineType) {
          case "Solid":
            ctx.strokeStyle = this.lineColor;
            ctx.stroke();
            break;
        }
        lineIndex++;
      });
    }
    ctx.translate(0, this.fieldWindow.height);
    // draw axis tick marks and labels
    if (!this.iconic) {
      ctx.lineWidth = 1;
      ctx.font = "10px Arial";
      ctx.fillStyle = "black";
      let inx = (this.dx === undefined || this.nx === undefined) ? 1 : this.dx * this.nx / 10;
      let dex = this.fieldWindow.width / 10;
      for (let i = 0; i < 11; i++) {
        let tmpX = dex * i;
        ctx.beginPath();
        ctx.moveTo(tmpX, 0);
        ctx.lineTo(tmpX, -4);
        ctx.stroke();
        let xtick = (this.x0 === undefined ? 0 : this.x0) + i * inx;
        let precision = 2;
        if (Math.abs(xtick) >= 1) {
          let diff = Math.abs(xtick - Math.round(xtick));
          precision = Math.round(Math.abs(xtick)).toString().length + (diff < 0.1 ? 0 : 1);
        } else {
          if (xtick.toPrecision(precision).endsWith("0")) {
            precision--;
          }
        }
        let iString = Math.abs(xtick) < 0.01 ? "0" : xtick.toPrecision(precision);
        ctx.fillText(iString, tmpX - ctx.measureText(iString).width / 2, 10);
      }
      let iny = (this.dy === undefined || this.ny === undefined) ? 1 : this.dy * this.ny / 10;
      let dey = this.fieldWindow.height / 10;
      for (let i = 0; i < 11; i++) {
        let tmpY = -dey * i;
        ctx.beginPath();
        ctx.moveTo(0, tmpY);
        ctx.lineTo(4, tmpY);
        ctx.stroke();
        let ytick = (this.y0 === undefined ? 0 : this.y0) + i * iny;
        let precision = 2;
        if (Math.abs(ytick) >= 1) {
          let diff = Math.abs(ytick - Math.round(ytick));
          precision = Math.round(Math.abs(ytick)).toString().length + (diff < 0.1 ? 0 : 1);
        } else {
          if (ytick.toPrecision(precision).endsWith("0")) {
            precision--;
          }
        }
        let iString = Math.abs(ytick) < 0.01 ? "0" : ytick.toPrecision(precision);
        ctx.fillText(iString, -ctx.measureText(iString).width - 6, tmpY + 4);
      }
    }
    ctx.restore();

    if (!this.iconic) {
      this.drawAxisLabels(ctx);
      if (this.showGridLines) {
        this.drawGridLines(ctx);
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

  private drawGridLines(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.fieldWindow.x, this.fieldWindow.y + this.fieldWindow.height);
    ctx.strokeStyle = "lightgray";
    let dx = this.fieldWindow.width / 10;
    for (let i = 1; i < 10; i++) {
      let tmpX = dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -this.fieldWindow.height);
      ctx.stroke();
    }
    let dy = this.fieldWindow.height / 10;
    for (let i = 1; i < 10; i++) {
      let tmpY = -dy * i;
      ctx.beginPath();
      ctx.moveTo(0, tmpY);
      ctx.lineTo(this.fieldWindow.width, tmpY);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.spaceMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.fieldWindow.x + (this.fieldWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 35, this.fieldWindow.y + (this.fieldWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    this.data = this.portI.getValue();
    this.x0 = this.portX0.getValue();
    this.dx = this.portDX.getValue();
    this.nx = this.portNX.getValue();
    this.y0 = this.portY0.getValue();
    this.dy = this.portDY.getValue();
    this.ny = this.portNY.getValue();
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 10;
    this.spaceMargin.bottom = 40;
    this.spaceMargin.left = 70;
    this.spaceMargin.right = 16;
    let dh = (this.height - this.barHeight) / 8;
    this.portI.setY(this.barHeight + dh);
    this.portX0.setY(this.barHeight + 2 * dh);
    this.portDX.setY(this.barHeight + 3 * dh);
    this.portNX.setY(this.barHeight + 4 * dh);
    this.portY0.setY(this.barHeight + 5 * dh);
    this.portDY.setY(this.barHeight + 6 * dh);
    this.portNY.setY(this.barHeight + 7 * dh);
  }

}
