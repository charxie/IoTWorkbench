/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";

export class XYGraph extends Block {

  private portX: Port;
  private portY: Port;
  private xPoints: number[] = [];
  private yPoints: number[] = [];
  private minimumXValue: number = 0;
  private maximumXValue: number = 1;
  private minimumYValue: number = 0;
  private maximumYValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private graphWindowColor: string = "white";
  private graphSymbol: string = "None";
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
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly graphWindowColor: string;
    readonly graphSymbol: string;
    readonly autoscale: boolean;
    readonly minimumXValue: number;
    readonly maximumXValue: number;
    readonly minimumYValue: number;
    readonly maximumYValue: number;

    constructor(g: XYGraph) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.xAxisLabel;
      this.yAxisLabel = g.yAxisLabel;
      this.graphWindowColor = g.graphWindowColor;
      this.graphSymbol = g.graphSymbol;
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
    this.color = "#F0FFFF";
    this.portX = new Port(this, true, "X", 0, this.height / 3, false)
    this.portY = new Port(this, true, "Y", 0, this.height * 2 / 3, false)
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.graphWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new XYGraph("X-Y Graph #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.graphWindowColor = this.graphWindowColor;
    copy.graphSymbol = this.graphSymbol;
    return copy;
  }

  destroy(): void {
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

  setGraphWindowColor(graphWindowColor: string): void {
    this.graphWindowColor = graphWindowColor;
  }

  getGraphWindowColor(): string {
    return this.graphWindowColor;
  }

  setGraphSymbol(graphSymbol: string): void {
    this.graphSymbol = graphSymbol;
  }

  getGraphSymbol(): string {
    return this.graphSymbol;
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
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.graphWindow.x = this.x + this.graphMargin.left;
    this.graphWindow.y = this.y + this.barHeight + this.graphMargin.top;
    this.graphWindow.width = this.width - this.graphMargin.left - this.graphMargin.right;
    this.graphWindow.height = this.height - this.barHeight - this.graphMargin.top - this.graphMargin.bottom;
    ctx.rect(this.graphWindow.x, this.graphWindow.y, this.graphWindow.width, this.graphWindow.height);
    ctx.fillStyle = this.graphWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (!this.iconic) {
      this.drawAxisLabels(ctx);
    }

    // draw X-Y plot
    if (this.xPoints && this.yPoints) {
      let length = Math.min(this.xPoints.length, this.yPoints.length);
      if (length > 0) {
        // detect minimum and maximum of x and y values
        let xmin = Number.MAX_VALUE;
        let xmax = -xmin;
        if (this.autoscale) {
          for (let d of this.xPoints) {
            if (d > xmax) {
              xmax = d;
            }
            if (d < xmin) {
              xmin = d;
            }
          }
        } else {
          xmin = this.minimumXValue;
          xmax = this.maximumXValue;
        }
        let ymin = Number.MAX_VALUE;
        let ymax = -xmin;
        if (this.autoscale) {
          for (let d of this.yPoints) {
            if (d > ymax) {
              ymax = d;
            }
            if (d < ymin) {
              ymin = d;
            }
          }
        } else {
          ymin = this.minimumYValue;
          ymax = this.maximumYValue;
        }
        let dx = this.graphWindow.width / (xmax - xmin);
        let dy = this.graphWindow.height / (ymax - ymin);
        ctx.save();
        ctx.translate(this.graphWindow.x, this.graphWindow.y + this.graphWindow.height);
        ctx.beginPath();
        ctx.moveTo((this.xPoints[0] - xmin) * dx, -(this.yPoints[0] - ymin) * dy);
        for (let i = 0; i < length; i++) {
          ctx.lineTo((this.xPoints[i] - xmin) * dx, -(this.yPoints[i] - ymin) * dy);
        }
        //ctx.closePath();
        ctx.stroke();

        // draw symbols on top of the line
        if (this.graphSymbol != "None") {
          for (let i = 0; i < length; i++) {
            ctx.beginPath();
            ctx.arc((this.xPoints[i] - xmin) * dx, -(this.yPoints[i] - ymin) * dy, 3, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.stroke();
          }
        }

        // draw axis tick marks and labels
        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        let inx = (xmax - xmin) / 10;
        dx = this.graphWindow.width / 10;
        for (let i = 0; i < 11; i++) {
          let tmpX = dx * i;
          ctx.beginPath();
          ctx.moveTo(tmpX, 0);
          ctx.lineTo(tmpX, -4);
          ctx.stroke();
          let iString = (xmin + i * inx).toFixed(1);
          ctx.fillText(iString, tmpX - ctx.measureText(iString).width / 2, 10);
        }
        let iny = (ymax - ymin) / 10;
        dy = this.graphWindow.height / 10;
        for (let i = 0; i < 11; i++) {
          let tmpY = -dy * i;
          ctx.beginPath();
          ctx.moveTo(0, tmpY);
          ctx.lineTo(4, tmpY);
          ctx.stroke();
          let iString = (ymin + i * iny).toFixed(1);
          ctx.fillText(iString, -ctx.measureText(iString).width - 6, tmpY + 4);
        }
        ctx.restore();
      }
    }


    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.portX.draw(ctx, this.iconic);
    this.portY.draw(ctx, this.iconic);

  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.graphMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.graphWindow.x + (this.graphWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 15, this.graphWindow.y + (this.graphWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let v = this.portX.getValue();
    this.xPoints = Array.isArray(v) ? v : [v];
    v = this.portY.getValue();
    this.yPoints = Array.isArray(v) ? v : [v];
  }

  refreshView(): void {
    this.graphMargin.top = 10;
    this.graphMargin.bottom = 40;
    this.graphMargin.left = 40;
    this.graphMargin.right = 10;
    this.portX.setY(this.height / 3);
    this.portY.setY(this.height * 2 / 3);
    this.updateModel();
  }

}
