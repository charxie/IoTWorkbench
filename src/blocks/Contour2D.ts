/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {Point2DArray} from "./Point2DArray";
import {TestFunctions} from "../math/TestFunctions";

export class Contour2D extends Block {

  private portI: Port;
  private data: number[];
  private autoscale: boolean = true;
  private minimumXValue: number = 0;
  private maximumXValue: number = 1;
  private minimumYValue: number = 0;
  private maximumYValue: number = 1;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private spaceWindowColor: string = "white";
  private showGridLines: boolean = false;
  private spaceWindow: Rectangle;
  private barHeight: number;
  private readonly spaceMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private lineType: string;
  private lineColor: string;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly spaceWindowColor: string;
    readonly showGridLines: boolean;
    readonly minimumXValue: number;
    readonly maximumXValue: number;
    readonly minimumYValue: number;
    readonly maximumYValue: number;
    readonly autoscale: boolean;
    readonly lineType: string;
    readonly lineColor: string;

    constructor(g: Contour2D) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.xAxisLabel;
      this.yAxisLabel = g.yAxisLabel;
      this.spaceWindowColor = g.spaceWindowColor;
      this.showGridLines = g.showGridLines;
      this.lineColor = g.lineColor;
      this.lineType = g.lineType;
      this.autoscale = g.autoscale;
      this.minimumXValue = g.minimumXValue;
      this.maximumXValue = g.maximumXValue;
      this.minimumYValue = g.minimumYValue;
      this.maximumYValue = g.maximumYValue;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#66EE66";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.ports.push(this.portI);
    this.spaceWindow = new Rectangle(0, 0, 1, 1);
    this.lineType = "Solid";
    this.lineColor = "black";
  }

  getCopy(): Block {
    let copy = new Contour2D("Contour2D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.spaceWindowColor = this.spaceWindowColor;
    copy.showGridLines = this.showGridLines;
    copy.lineColor = this.lineColor;
    copy.lineType = this.lineType;
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

  setAutoScale(autoscale: boolean): void {
    this.autoscale = autoscale;
  }

  getAutoScale(): boolean {
    return this.autoscale;
  }

  setMinimumXValue(minimumXValue: number): void {
    this.minimumXValue = minimumXValue;
  }

  getMinimumXValue(): number {
    return this.minimumXValue;
  }

  setMaximumXValue(maximumXValue: number): void {
    this.maximumXValue = maximumXValue;
  }

  getMaximumXValue(): number {
    return this.maximumXValue;
  }

  setMinimumYValue(minimumYValue: number): void {
    this.minimumYValue = minimumYValue;
  }

  getMinimumYValue(): number {
    return this.minimumYValue;
  }

  setMaximumYValue(maximumYValue: number): void {
    this.maximumYValue = maximumYValue;
  }

  getMaximumYValue(): number {
    return this.maximumYValue;
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

  setSpaceWindowColor(spaceWindowColor: string): void {
    this.spaceWindowColor = spaceWindowColor;
  }

  getSpaceWindowColor(): string {
    return this.spaceWindowColor;
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
    this.spaceWindow.x = this.x + this.spaceMargin.left;
    this.spaceWindow.y = this.y + this.barHeight + this.spaceMargin.top;
    this.spaceWindow.width = this.width - this.spaceMargin.left - this.spaceMargin.right;
    this.spaceWindow.height = this.height - this.barHeight - this.spaceMargin.top - this.spaceMargin.bottom;
    ctx.rect(this.spaceWindow.x, this.spaceWindow.y, this.spaceWindow.width, this.spaceWindow.height);
    ctx.fillStyle = this.spaceWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (!this.iconic) {
      this.drawAxisLabels(ctx);
      if (this.showGridLines) {
        this.drawGridLines(ctx);
      }
    }

    // detect minimum and maximum of x and y values from all inputs and calculate the scale factor
    let xmin = this.minimumXValue;
    let xmax = this.maximumXValue;
    let ymin = this.minimumYValue;
    let ymax = this.maximumYValue;
    let dx = xmax === xmin ? 1 : this.spaceWindow.width / (xmax - xmin);
    let dy = ymax === ymin ? 1 : this.spaceWindow.height / (ymax - ymin);

    // draw contour plot
    ctx.save();
    ctx.translate(this.spaceWindow.x, this.spaceWindow.y);

    if (this.data !== undefined) {
      let n = Math.round(Math.sqrt(this.data.length));
      let m = n;
      // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
      let contours = d3.contours().size([n, m]).thresholds(d3.range(0, 100, 5))(this.data);
      let projection = d3.geoIdentity().scale(this.spaceWindow.width / n, this.spaceWindow.height / m);
      let path = d3.geoPath(projection, ctx);
      let index = 0;
      contours.forEach(c => {
        if (c.coordinates.length == 0) return;
        ctx.beginPath();
        path(c);
        let i2 = Math.min(255, index);
        ctx.fillStyle = Util.rgbToHex(i2, i2, i2);
        ctx.fill();
        ctx.strokeStyle = "gray";
        ctx.stroke();
        index++;
      });
    }


    // // Populate a grid of n×m values where -2 ≤ x ≤ 2 and -2 ≤ y ≤ 1.
    // let n = 256, m = 256, values = new Array(n * m);
    // for (var j = 0.5, k = 0; j < m; ++j) {
    //   for (var i = 0.5; i < n; ++i, ++k) {
    //     values[k] = TestFunctions.goldsteinPrice(i / n * 4 - 2, 1 - j / m * 3);
    //   }
    // }
    //
    // // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
    // let contours = d3.contours()
    //   .size([n, m])
    //   .thresholds(d3.range(2, 21).map(p => Math.pow(2, p)))
    //   (values);
    // let projection = d3.geoIdentity().scale(this.spaceWindow.width / n, this.spaceWindow.height / m);
    // let path = d3.geoPath(projection, ctx);
    // let index = 0;
    // contours.forEach(c => {
    //   if (c.coordinates.length == 0) return;
    //   ctx.beginPath();
    //   path(c);
    //   ctx.fillStyle = Util.rgbToHex(index * 25, index * 25, 255 - index * 25);
    //   ctx.fill();
    //   ctx.strokeStyle = "gray";
    //   ctx.stroke();
    //   index++;
    // });

    ctx.translate(0, this.spaceWindow.height);

    // draw axis tick marks and labels
    if (!this.iconic) {
      ctx.lineWidth = 1;
      ctx.font = "10px Arial";
      ctx.fillStyle = "black";
      let inx = (xmax - xmin) / 10;
      dx = this.spaceWindow.width / 10;
      for (let i = 0; i < 11; i++) {
        let tmpX = dx * i;
        ctx.beginPath();
        ctx.moveTo(tmpX, 0);
        ctx.lineTo(tmpX, -4);
        ctx.stroke();
        let xtick = xmin + i * inx;
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
      let iny = (ymax - ymin) / 10;
      dy = this.spaceWindow.height / 10;
      for (let i = 0; i < 11; i++) {
        let tmpY = -dy * i;
        ctx.beginPath();
        ctx.moveTo(0, tmpY);
        ctx.lineTo(4, tmpY);
        ctx.stroke();
        let ytick = ymin + i * iny;
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

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.portI.draw(ctx, this.iconic);

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  private drawGridLines(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.spaceWindow.x, this.spaceWindow.y + this.spaceWindow.height);
    ctx.strokeStyle = "lightgray";
    let dx = this.spaceWindow.width / 10;
    for (let i = 1; i < 10; i++) {
      let tmpX = dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -this.spaceWindow.height);
      ctx.stroke();
    }
    let dy = this.spaceWindow.height / 10;
    for (let i = 1; i < 10; i++) {
      let tmpY = -dy * i;
      ctx.beginPath();
      ctx.moveTo(0, tmpY);
      ctx.lineTo(this.spaceWindow.width, tmpY);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.spaceMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.spaceWindow.x + (this.spaceWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 25, this.spaceWindow.y + (this.spaceWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let array = this.portI.getValue();
    if (Array.isArray(array)) {
      this.data = array;
    }
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 10;
    this.spaceMargin.bottom = 40;
    this.spaceMargin.left = 60;
    this.spaceMargin.right = 16;
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

}
