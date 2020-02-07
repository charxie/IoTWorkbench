/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";
import {Point2DArray} from "./Point2DArray";

export class Space2D extends Block {

  private portX: Port;
  private portY: Port;
  private points: Point2DArray = new Point2DArray();
  private pointInput: boolean = false;
  private portPoints: Port[];
  private minimumXValue: number = 0;
  private maximumXValue: number = 1;
  private minimumYValue: number = 0;
  private maximumYValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private spaceWindowColor: string = "white";
  private lineColor: string = "black";
  private lineType: string = "Solid";
  private dataSymbol: string = "None";
  private dataSymbolColor: string = "lightgray";
  private spaceWindow: Rectangle;
  private barHeight: number;
  private readonly spaceMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private tempX: number; // temporarily store x and y before pushing them into the points arrays
  private tempY: number;

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
    readonly lineColor: string;
    readonly lineType: string;
    readonly dataSymbol: string;
    readonly dataSymbolColor: string;
    readonly autoscale: boolean;
    readonly minimumXValue: number;
    readonly maximumXValue: number;
    readonly minimumYValue: number;
    readonly maximumYValue: number;
    readonly pointInput: boolean;
    readonly numberOfPoints: number;

    constructor(g: Space2D) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.xAxisLabel;
      this.yAxisLabel = g.yAxisLabel;
      this.spaceWindowColor = g.spaceWindowColor;
      this.lineColor = g.lineColor;
      this.lineType = g.lineType;
      this.dataSymbol = g.dataSymbol;
      this.dataSymbolColor = g.dataSymbolColor;
      this.autoscale = g.autoscale;
      this.minimumXValue = g.minimumXValue;
      this.maximumXValue = g.maximumXValue;
      this.minimumYValue = g.minimumYValue;
      this.maximumYValue = g.maximumYValue;
      this.pointInput = g.pointInput;
      this.numberOfPoints = g.getNumberOfPoints();
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#87CEFA";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 3;
    this.portX = new Port(this, true, "X", 0, this.barHeight + dh, false)
    this.portY = new Port(this, true, "Y", 0, this.barHeight + 2 * dh, false)
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.spaceWindow = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new Space2D("Space2D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.spaceWindowColor = this.spaceWindowColor;
    copy.lineColor = this.lineColor;
    copy.lineType = this.lineType;
    copy.dataSymbol = this.dataSymbol;
    copy.dataSymbolColor = this.dataSymbolColor;
    copy.pointInput = this.pointInput;
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

  setPointInput(pointInput: boolean): void {
    if (this.pointInput === pointInput) return;
    this.pointInput = pointInput;
    for (let p of this.ports) {
      flowchart.removeConnectorsToPort(p);
    }
    this.ports.length = 0;
    if (this.pointInput) {
      if (this.portPoints == undefined) {
        this.portPoints = [];
        let dh = (this.height - this.barHeight) / 2;
        this.portPoints.push(new Port(this, true, "A", 0, this.barHeight + dh, false));
      }
      for (let p of this.portPoints) {
        this.ports.push(p);
      }
    } else {
      this.ports.push(this.portX);
      this.ports.push(this.portY);
    }
  }

  getPointInput(): boolean {
    return this.pointInput;
  }

  setNumberOfPoints(numberOfPoints: number): void {
    if (this.pointInput) {
      if (numberOfPoints > this.portPoints.length) { // increase data ports
        for (let i = 0; i < numberOfPoints; i++) {
          if (i >= this.portPoints.length) {
            let p = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, 0, false);
            this.portPoints.push(p);
            this.ports.push(p);
            // this.dataArrays.push((new DataArray()));
            // this.lineTypes.push("Solid");
            // this.lineColors.push("black");
            // this.graphSymbols.push("Circle");
            // this.graphSymbolColors.push("white");
          }
        }
      } else if (numberOfPoints < this.portPoints.length) { // decrease data ports
        for (let i = this.portPoints.length - 1; i >= numberOfPoints; i--) {
          this.portPoints.pop();
          flowchart.removeConnectorsToPort(this.ports.pop());
          // this.dataArrays.pop();
          // this.lineTypes.pop();
          // this.lineColors.pop();
          // this.graphSymbols.pop();
          // this.graphSymbolColors.pop();
        }
      }
      this.refreshView();
    }
  }

  getNumberOfPoints(): number {
    if (this.pointInput) {
      return this.portPoints.length;
    }
    return 1;
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

  setSpaceWindowColor(spaceWindowColor: string): void {
    this.spaceWindowColor = spaceWindowColor;
  }

  getSpaceWindowColor(): string {
    return this.spaceWindowColor;
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

  setDataSymbol(dataSymbol: string): void {
    this.dataSymbol = dataSymbol;
  }

  getDataSymbol(): string {
    return this.dataSymbol;
  }

  setDataSymbolColor(dataSymbolColor: string): void {
    this.dataSymbolColor = dataSymbolColor;
  }

  getDataSymbolColor(): string {
    return this.dataSymbolColor;
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
    ctx.fillStyle = "#EEFFFF";
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
    }

    // draw X-Y plot
    if (this.points) {
      let length = this.points.length();
      if (length > 1) {
        ctx.strokeStyle = this.lineColor;
        // detect minimum and maximum of x and y values
        let xmin, xmax, ymin, ymax;
        if (this.autoscale) {
          let xminxmax = this.points.getXminXmax();
          xmin = xminxmax.min;
          xmax = xminxmax.max;
        } else {
          xmin = this.minimumXValue;
          xmax = this.maximumXValue;
        }
        if (this.autoscale) {
          let yminymax = this.points.getYminYmax();
          ymin = yminymax.min;
          ymax = yminymax.max;
        } else {
          ymin = this.minimumYValue;
          ymax = this.maximumYValue;
        }
        let dx = xmax === xmin ? 1 : this.spaceWindow.width / (xmax - xmin);
        let dy = ymax === ymin ? 1 : this.spaceWindow.height / (ymax - ymin);
        ctx.save();
        ctx.translate(this.spaceWindow.x, this.spaceWindow.y + this.spaceWindow.height);
        if (this.lineType === "Solid") {
          ctx.beginPath();
          ctx.moveTo((this.points.getX(0) - xmin) * dx, -(this.points.getY(0) - ymin) * dy);
          for (let i = 0; i < length; i++) {
            ctx.lineTo((this.points.getX(i) - xmin) * dx, -(this.points.getY(i) - ymin) * dy);
          }
          ctx.stroke();
        }

        // draw symbols on top of the line
        switch (this.dataSymbol) {
          case "Circle":
            for (let i = 0; i < length; i++) {
              ctx.beginPath();
              ctx.arc((this.points.getX(i) - xmin) * dx, -(this.points.getY(i) - ymin) * dy, 3, 0, 2 * Math.PI);
              ctx.fillStyle = this.dataSymbolColor;
              ctx.fill();
              ctx.strokeStyle = this.lineColor;
              ctx.stroke();
            }
            break;
          case "Square":
            for (let i = 0; i < length; i++) {
              ctx.beginPath();
              ctx.rect((this.points.getX(i) - xmin) * dx - 2, -(this.points.getY(i) - ymin) * dy - 2, 4, 4);
              ctx.fillStyle = this.dataSymbolColor;
              ctx.fill();
              ctx.strokeStyle = this.lineColor;
              ctx.stroke();
            }
            break;
          case "Dot":
            for (let i = 0; i < length; i++) {
              ctx.beginPath();
              ctx.rect((this.points.getX(i) - xmin) * dx - 1.5, -(this.points.getY(i) - ymin) * dy - 1.5, 3, 3);
              ctx.fillStyle = this.dataSymbolColor;
              ctx.fill();
            }
            break;
        }

        // draw axis tick marks and labels
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
          if (Math.abs(xtick) > 1) {
            let diff = Math.abs(xtick - Math.round(xtick));
            precision = Math.round(xtick).toString().length + (diff < 0.1 ? 0 : 1);
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
          if (Math.abs(ytick) > 1) {
            let diff = Math.abs(ytick - Math.round(ytick));
            precision = Math.round(ytick).toString().length + (diff < 0.1 ? 0 : 1);
          }
          let iString = Math.abs(ytick) < 0.01 ? "0" : ytick.toPrecision(precision);
          ctx.fillText(iString, -ctx.measureText(iString).width - 6, tmpY + 4);
        }
        ctx.restore();
      }
    }


    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    if (this.pointInput) {
      for (let p of this.portPoints) {
        p.draw(ctx, this.iconic);
      }
    } else {
      this.portX.draw(ctx, this.iconic);
      this.portY.draw(ctx, this.iconic);
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.spaceMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.spaceWindow.x + (this.spaceWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 15, this.spaceWindow.y + (this.spaceWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    if (this.pointInput) { // point input mode
      let vp = this.portPoints[0].getValue();
      if (vp != undefined) {
        if (Array.isArray(vp) && vp.length > 1) {
          let px = this.points.getX(this.points.length() - 1);
          let py = this.points.getY(this.points.length() - 1);
          if (vp[0] != px || vp[1] != py) {
            this.tempX = vp[0];
            this.tempY = vp[1];
          }
        }
      }
    } else { // dual input mode
      let vx = this.portX.getValue();
      if (vx != undefined) {
        if (Array.isArray(vx)) {
          this.points.setXPoints(vx);
        } else {
          let px = this.points.getX(this.points.length() - 1);
          if (vx != px) { // TODO: Not a reliable way to store x and y at the same time
            this.tempX = vx;
          }
        }
      }
      let vy = this.portY.getValue();
      if (vy != undefined) {
        if (Array.isArray(vy)) {
          this.points.setYPoints(vy);
        } else {
          let py = this.points.getY(this.points.length() - 1);
          if (vy != py) { // TODO: Not a reliable way to store x and y at the same time
            this.tempY = vy;
          }
        }
      }
    }
    // console.log(this.xPoints.length + "=" + this.yPoints.length + ":" + this.tempX + "," + this.tempY);
    if (this.tempX != undefined && this.tempY != undefined) {
      this.points.addPoint(this.tempX, this.tempY);
      this.tempX = undefined;
      this.tempY = undefined;
    }
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 10;
    this.spaceMargin.bottom = 40;
    this.spaceMargin.left = 40;
    this.spaceMargin.right = 10;
    if (this.pointInput) {
      let dh = (this.height - this.barHeight) / (this.portPoints.length + 1);
      for (let i = 0; i < this.portPoints.length; i++) {
        this.portPoints[i].setY(this.barHeight + dh * (i + 1));
      }
    } else {
      let dh = (this.height - this.barHeight) / 3;
      this.portX.setY(this.barHeight + dh);
      this.portY.setY(this.barHeight + 2 * dh);
    }
    //this.updateModel();
  }

  toCanvas(): HTMLCanvasElement {
    let c = document.createElement('canvas');
    c.width = this.width;
    c.height = this.height;
    let newContext = c.getContext('2d');
    newContext.drawImage(flowchart.blockView.canvas, this.x, this.y, this.width, this.height, 0, 0, c.width, c.height);
    return c;
  }

}
