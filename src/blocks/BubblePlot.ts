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
import {ColorSchemes} from "./ColorSchemes";

export class BubblePlot extends Block {

  private portI: Port;
  private points: Point2DArray;
  private values: number[];
  private minimumXValue: number = 0;
  private maximumXValue: number = 1;
  private minimumYValue: number = 0;
  private maximumYValue: number = 1;
  private minimumZValue: number = 0;
  private maximumZValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private viewWindowColor: string = "white";
  private showGridLines: boolean = false;
  private viewWindow: Rectangle;
  private barHeight: number;
  private readonly viewWindowMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private bubbleType: string = "Circle";
  private defaultColor: string = "white";
  private colorScale: string = "Linear";
  private colorScheme: string = "None";
  private opacity: number = 1;
  private interpolateColor;
  private minimumBubbleRadius = 1;
  private maximumBubbleRadius = 20;
  private pattern;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly viewWindowColor: string;
    readonly showGridLines: boolean;
    readonly autoscale: boolean;
    readonly minimumXValue: number;
    readonly maximumXValue: number;
    readonly minimumYValue: number;
    readonly maximumYValue: number;
    readonly minimumZValue: number;
    readonly maximumZValue: number;
    readonly minimumBubbleRadius: number;
    readonly maximumBubbleRadius: number;
    readonly bubbleType: string;
    readonly defaultColor: string;
    readonly colorScheme: string;
    readonly colorScale: string;
    readonly opacity: number;

    constructor(b: BubblePlot) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.xAxisLabel = b.xAxisLabel;
      this.yAxisLabel = b.yAxisLabel;
      this.viewWindowColor = b.viewWindowColor;
      this.showGridLines = b.showGridLines;
      this.autoscale = b.autoscale;
      this.minimumXValue = b.minimumXValue;
      this.maximumXValue = b.maximumXValue;
      this.minimumYValue = b.minimumYValue;
      this.maximumYValue = b.maximumYValue;
      this.minimumZValue = b.minimumZValue;
      this.maximumZValue = b.maximumZValue;
      this.minimumBubbleRadius = b.minimumBubbleRadius;
      this.maximumBubbleRadius = b.maximumBubbleRadius;
      this.bubbleType = b.bubbleType;
      this.defaultColor = b.defaultColor;
      this.colorScheme = b.colorScheme;
      this.colorScale = b.colorScale;
      this.opacity = b.opacity;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#CEFA99";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.ports.push(this.portI);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.points = new Point2DArray();
    this.values = [];
  }

  getCopy(): Block {
    let copy = new BubblePlot("Bubble Plot #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.minimumZValue = this.minimumZValue;
    copy.maximumZValue = this.maximumZValue;
    copy.minimumBubbleRadius = this.minimumBubbleRadius;
    copy.maximumBubbleRadius = this.maximumBubbleRadius;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.viewWindowColor = this.viewWindowColor;
    copy.showGridLines = this.showGridLines;
    copy.bubbleType = this.bubbleType;
    copy.defaultColor = this.defaultColor;
    copy.colorScheme = this.colorScheme;
    copy.colorScale = this.colorScale;
    copy.opacity = this.opacity;
    return copy;
  }

  destroy(): void {
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
    this.points.clear();
    flowchart.blockView.requestDraw();
  }

  setMinimumBubbleRadius(minimumBubbleRadius: number): void {
    this.minimumBubbleRadius = minimumBubbleRadius;
  }

  getMinimumBubbleRadius(): number {
    return this.minimumBubbleRadius;
  }

  setMaximumBubbleRadius(maximumBubbleRadius: number): void {
    this.maximumBubbleRadius = maximumBubbleRadius;
  }

  getMaximumBubbleRadius(): number {
    return this.maximumBubbleRadius;
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

  setMinimumZValue(minimumZValue: number): void {
    this.minimumZValue = minimumZValue;
  }

  getMinimumZValue(): number {
    return this.minimumZValue;
  }

  setMaximumZValue(maximumZValue: number): void {
    this.maximumZValue = maximumZValue;
  }

  getMaximumZValue(): number {
    return this.maximumZValue;
  }

  setAutoScale(autoscale: boolean): void {
    this.autoscale = autoscale;
  }

  getAutoScale(): boolean {
    return this.autoscale;
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

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
  }

  setShowGridLines(showGridLines: boolean): void {
    this.showGridLines = showGridLines;
  }

  getShowGridLines(): boolean {
    return this.showGridLines;
  }

  setBubbleType(bubbleType: string): void {
    this.bubbleType = bubbleType;
  }

  getBubbleType(): string {
    return this.bubbleType;
  }

  setDefaultColor(defaultColor: string): void {
    this.defaultColor = defaultColor;
  }

  getDefaultColor(): string {
    return this.defaultColor;
  }

  setOpacity(opacity: number): void {
    this.opacity = opacity;
  }

  getOpacity(): number {
    return this.opacity;
  }

  getColorScheme(): string {
    return this.colorScheme;
  }

  setColorScheme(colorScheme: string): void {
    this.colorScheme = colorScheme;
    this.interpolateColor = colorScheme === "None" ? undefined : ColorSchemes.getInterpolateColorScheme(colorScheme);
  }

  getColorScale(): string {
    return this.colorScale;
  }

  setColorScale(colorScale: string): void {
    this.colorScale = colorScale;
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
      let title = this.name + " (" + this.points.length() + " points)";
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the space
    ctx.fillStyle = "#FFFFEE";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.viewWindow.x = this.x + this.viewWindowMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewWindowMargin.top;
    this.viewWindow.width = this.width - this.viewWindowMargin.left - this.viewWindowMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewWindowMargin.top - this.viewWindowMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.viewWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (this.iconic) {
      let xc = this.viewWindow.x + this.viewWindow.width / 2;
      let yc = this.viewWindow.y + this.viewWindow.height / 2;
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.arc(xc - 5.5, yc - 5.5, 2.5, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xc + 3, yc + 3, 3, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(xc + 6, yc - 2, 4, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.stroke();
    } else {

      this.drawAxisLabels(ctx);
      if (this.showGridLines) {
        this.drawGridLines(ctx);
      }

      // detect minimum and maximum of x and y values from all inputs and calculate the scale factor
      let xmin;
      let xmax;
      let ymin;
      let ymax;
      let zmin = Number.MAX_VALUE;
      let zmax = -zmin;
      if (this.autoscale && this.points.length() > 0) {
        let xminxmax = this.points.getXminXmax();
        xmin = xminxmax.min;
        xmax = xminxmax.max;
        let yminymax = this.points.getYminYmax();
        ymin = yminymax.min;
        ymax = yminymax.max;
        for (let z of this.values) {
          if (z > zmax) {
            zmax = z;
          }
          if (z < zmin) {
            zmin = z;
          }
        }
      } else {
        xmin = this.minimumXValue;
        xmax = this.maximumXValue;
        ymin = this.minimumYValue;
        ymax = this.maximumYValue;
        zmin = this.minimumZValue;
        zmax = this.maximumZValue;
      }
      let dx = xmax === xmin ? 1 : this.viewWindow.width / (xmax - xmin);
      let dy = ymax === ymin ? 1 : this.viewWindow.height / (ymax - ymin);

      // draw bubbles
      ctx.save();
      ctx.translate(this.viewWindow.x, this.viewWindow.y + this.viewWindow.height);
      let length = this.points.length();
      if (length > 1) {
        let radiusScale = d3.scaleLinear().domain([zmin, zmax]).range([this.minimumBubbleRadius, this.maximumBubbleRadius]);
        ctx.lineWidth = 1;
        ctx.fillStyle = Util.isHexColor(this.defaultColor) ? this.defaultColor + Util.alphaToHex(this.opacity) : this.defaultColor;
        ctx.strokeStyle = "black";
        let colorScale;
        if (this.colorScheme !== "None") {
          if (this.colorScale === "Linear") {
            colorScale = d3.scaleLinear().domain([zmin, zmax]).interpolate(() => this.interpolateColor);
          } else if (this.colorScale === "Logarithmic") {
            colorScale = d3.scaleLinear().domain([Math.log(zmin), Math.log(zmax)]).interpolate(() => this.interpolateColor);
          }
        }
        let r;
        switch (this.bubbleType) {
          case "Circle":
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              ctx.beginPath();
              ctx.arc((this.points.getX(i) - xmin) * dx, -(this.points.getY(i) - ymin) * dy, r, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            }
            break;
          case "Square":
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              ctx.beginPath();
              ctx.rect((this.points.getX(i) - xmin) * dx - r, -(this.points.getY(i) - ymin) * dy - r, 2 * r, 2 * r);
              ctx.fill();
              ctx.stroke();
            }
            break;
          case "Triangle Up":
            let tmpX, tmpY;
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              tmpX = (this.points.getX(i) - xmin) * dx;
              tmpY = -(this.points.getY(i) - ymin) * dy;
              ctx.beginPath();
              ctx.moveTo(tmpX, tmpY - r);
              ctx.lineTo(tmpX - r, tmpY + r);
              ctx.lineTo(tmpX + r, tmpY + r);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            break;
          case "Triangle Down":
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              tmpX = (this.points.getX(i) - xmin) * dx;
              tmpY = -(this.points.getY(i) - ymin) * dy;
              ctx.beginPath();
              ctx.moveTo(tmpX, tmpY + r);
              ctx.lineTo(tmpX - r, tmpY - r);
              ctx.lineTo(tmpX + r, tmpY - r);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            break;
          case "Diamond":
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              tmpX = (this.points.getX(i) - xmin) * dx;
              tmpY = -(this.points.getY(i) - ymin) * dy;
              ctx.beginPath();
              ctx.moveTo(tmpX, tmpY + r);
              ctx.lineTo(tmpX - r, tmpY);
              ctx.lineTo(tmpX, tmpY - r);
              ctx.lineTo(tmpX + r, tmpY);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            break;
          case "Five-Pointed Star":
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              tmpX = (this.points.getX(i) - xmin) * dx;
              tmpY = -(this.points.getY(i) - ymin) * dy;
              Util.drawStar(ctx, tmpX, tmpY, r, 5, 2);
            }
            break;
          case "Six-Pointed Star":
            for (let i = 0; i < length; i++) {
              r = radiusScale(this.values[i]);
              if (colorScale) ctx.fillStyle = Util.rgbStringToHex(colorScale(this.values[i])) + Util.alphaToHex(this.opacity);
              tmpX = (this.points.getX(i) - xmin) * dx;
              tmpY = -(this.points.getY(i) - ymin) * dy;
              Util.drawStar(ctx, tmpX, tmpY, r, 6, 2);
            }
            break;
        }

        // draw axis tick marks and labels
        ctx.lineWidth = 1;
        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        let inx = (xmax - xmin) / 10;
        dx = this.viewWindow.width / 10;
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
        dy = this.viewWindow.height / 10;
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

      this.drawLegends(ctx);

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

  private createPattern(ctx: CanvasRenderingContext2D): void {
    if (this.pattern === undefined) {
      let p = document.createElement("canvas")
      p.width = 8;
      p.height = 8;
      let pctx = p.getContext('2d');
      pctx.fillStyle = "gray";
      pctx.lineWidth = 1;
      const n = 8;
      // Top line
      pctx.beginPath();
      pctx.moveTo(0, p.height / n);
      pctx.lineTo(p.width / n, 0);
      pctx.lineTo(0, 0);
      pctx.lineTo(0, p.height / n);
      pctx.fill();
      // Middle line
      pctx.beginPath();
      pctx.moveTo(p.width, p.height / n);
      pctx.lineTo(p.width / n, p.height);
      pctx.lineTo(0, p.height);
      pctx.lineTo(0, p.height * (n - 1) / n);
      pctx.lineTo(p.width * (n - 1) / n, 0);
      pctx.lineTo(p.width, 0);
      pctx.lineTo(p.width, p.height / n);
      pctx.fill();
      // Bottom line
      pctx.beginPath();
      pctx.moveTo(p.width, p.height * (n - 1) / n);
      pctx.lineTo(p.width * (n - 1) / n, p.height);
      pctx.lineTo(p.width, p.height);
      pctx.lineTo(p.width, p.height * (n - 1) / n);
      pctx.fill();
      this.pattern = ctx.createPattern(p, 'repeat');
    }
  }

  private drawLegends(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.viewWindow.x + this.viewWindow.width, this.viewWindow.y + this.viewWindow.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.font = "10px Arial";
    let rmin = this.minimumBubbleRadius;
    let rmax = this.maximumBubbleRadius;
    let minValue = this.minimumZValue.toString();
    let maxValue = this.maximumZValue.toString();
    this.createPattern(ctx);
    ctx.fillStyle = this.pattern;
    switch (this.bubbleType) {
      case "Circle":
        ctx.beginPath();
        ctx.arc(-2 * rmax, -2 * rmax, rmax, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, -2 * rmax - ctx.measureText(maxValue).width / 2, -3.5 * rmax);
        ctx.fillStyle = this.pattern;
        ctx.beginPath();
        ctx.arc(-2 * rmax, -5 * rmax, rmin, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(minValue, -2 * rmax - ctx.measureText(minValue).width / 2, -5.5 * rmax);
        break;
      case "Square":
        ctx.beginPath();
        ctx.rect(-3 * rmax, -3 * rmax, 2 * rmax, 2 * rmax);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, -2 * rmax - ctx.measureText(maxValue).width / 2, -3.5 * rmax);
        ctx.fillStyle = this.pattern;
        ctx.beginPath();
        ctx.rect(-2 * rmax, -5 * rmax, 2 * rmin, 2 * rmin);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(minValue, -2 * rmax - ctx.measureText(minValue).width / 2, -5.5 * rmax);
        break;
      case "Triangle Up":
        let tmpX = -2 * rmax;
        let tmpY = -2 * rmax;
        ctx.beginPath();
        ctx.moveTo(tmpX, tmpY - rmax);
        ctx.lineTo(tmpX - rmax, tmpY + rmax);
        ctx.lineTo(tmpX + rmax, tmpY + rmax);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, tmpX - ctx.measureText(maxValue).width / 2, -3.5 * rmax);
        ctx.fillStyle = this.pattern;
        tmpY = -4.5 * rmax;
        ctx.beginPath();
        ctx.moveTo(tmpX, tmpY - rmin);
        ctx.lineTo(tmpX - rmin, tmpY + rmin);
        ctx.lineTo(tmpX + rmin, tmpY + rmin);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(minValue, tmpX - ctx.measureText(minValue).width / 2, -5 * rmax);
        break;
      case "Triangle Down":
        tmpX = -2 * rmax;
        tmpY = -2 * rmax;
        ctx.beginPath();
        ctx.moveTo(tmpX, tmpY + rmax);
        ctx.lineTo(tmpX - rmax, tmpY - rmax);
        ctx.lineTo(tmpX + rmax, tmpY - rmax);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, tmpX - ctx.measureText(maxValue).width / 2, -3.5 * rmax);
        ctx.fillStyle = this.pattern;
        tmpY = -4.5 * rmax;
        ctx.beginPath();
        ctx.moveTo(tmpX, tmpY + rmin);
        ctx.lineTo(tmpX - rmin, tmpY - rmin);
        ctx.lineTo(tmpX + rmin, tmpY - rmin);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(minValue, tmpX - ctx.measureText(minValue).width / 2, -5 * rmax);
        break;
      case "Diamond":
        tmpX = -2 * rmax;
        tmpY = -2 * rmax;
        ctx.beginPath();
        ctx.moveTo(tmpX, tmpY + rmax);
        ctx.lineTo(tmpX - rmax, tmpY);
        ctx.lineTo(tmpX, tmpY - rmax);
        ctx.lineTo(tmpX + rmax, tmpY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, tmpX - ctx.measureText(maxValue).width / 2, -3.5 * rmax);
        ctx.fillStyle = this.pattern;
        tmpY = -4.5 * rmax;
        ctx.beginPath();
        ctx.moveTo(tmpX, tmpY + rmin);
        ctx.lineTo(tmpX - rmin, tmpY);
        ctx.lineTo(tmpX, tmpY - rmin);
        ctx.lineTo(tmpX + rmin, tmpY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(minValue, tmpX - ctx.measureText(minValue).width / 2, -5 * rmax);
        break;
      case "Five-Pointed Star":
        tmpX = -3 * rmax;
        tmpY = -3 * rmax;
        Util.drawStar(ctx, tmpX, tmpY, rmax, 5, 2);
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, tmpX - ctx.measureText(maxValue).width / 2, -5.5 * rmax);
        ctx.fillStyle = this.pattern;
        tmpY = -rmax * 7;
        Util.drawStar(ctx, tmpX, tmpY, rmin, 5, 2);
        ctx.fillStyle = "black";
        ctx.fillText(minValue, tmpX - ctx.measureText(minValue).width / 2, -8 * rmax);
        break;
      case "Six-Pointed Star":
        tmpX = -2 * rmax;
        tmpY = -2 * rmax;
        Util.drawStar(ctx, tmpX, tmpY, rmax, 6, 2);
        ctx.fillStyle = "black";
        ctx.fillText(maxValue, tmpX - ctx.measureText(maxValue).width / 2, -4 * rmax);
        ctx.fillStyle = this.pattern;
        tmpY = -rmax * 5;
        Util.drawStar(ctx, tmpX, tmpY, rmin, 6, 2);
        ctx.fillStyle = "black";
        ctx.fillText(minValue, tmpX - ctx.measureText(minValue).width / 2, -5.5 * rmax);
        break;
    }
    ctx.restore();
  }

  private drawGridLines(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.viewWindow.x, this.viewWindow.y + this.viewWindow.height);
    ctx.strokeStyle = "lightgray";
    let dx = this.viewWindow.width / 10;
    for (let i = 1; i < 10; i++) {
      let tmpX = dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -this.viewWindow.height);
      ctx.stroke();
    }
    let dy = this.viewWindow.height / 10;
    for (let i = 1; i < 10; i++) {
      let tmpY = -dy * i;
      ctx.beginPath();
      ctx.moveTo(0, tmpY);
      ctx.lineTo(this.viewWindow.width, tmpY);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.viewWindowMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.viewWindow.x + (this.viewWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 25, this.viewWindow.y + (this.viewWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let v = this.portI.getValue();
    if (v !== undefined && Array.isArray(v) && Array.isArray(v[0])) {
      let cols = v[0].length;
      if (cols >= 3) {
        let rows = v.length;
        this.points.clear();
        this.values.length = 0;
        for (let i = 0; i < rows; i++) {
          this.points.addPoint(v[i][0], v[i][1]);
          this.values.push(v[i][2]);
        }
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewWindowMargin.top = 10;
    this.viewWindowMargin.bottom = 40;
    this.viewWindowMargin.left = 60;
    this.viewWindowMargin.right = 16;
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
  }

}
