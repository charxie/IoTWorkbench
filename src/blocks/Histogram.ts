/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";

export class Histogram extends Block {

  private portI: Port[];
  private dataArrays: DataArray[] = [];
  private numberOfBins: number = 50;
  private distributions: number[][] = [];
  private minimumXValue: number = 0;
  private maximumXValue: number = 1;
  private minimumYValue: number = 0;
  private maximumYValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "";
  private yAxisLabel: string = "";
  private graphWindowColor: string = "white";
  private graphWindow: Rectangle;
  private barHeight: number;
  private readonly graphMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private legends: string[] = [];
  private lineColors: string[] = [];
  private lineWidths: number[] = [];
  private fillColors: string[] = [];
  private showGridLines: boolean = false;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly dataPortNumber: number;
    readonly numberOfBins: number;
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly graphWindowColor: string;
    readonly showGridLines: boolean;
    readonly autoscale: boolean;
    readonly minimumXValue: number;
    readonly maximumXValue: number;
    readonly minimumYValue: number;
    readonly maximumYValue: number;
    readonly legends: string[];
    readonly lineColors: string[];
    readonly lineWidths: number[];
    readonly fillColors: string[];

    constructor(h: Histogram) {
      this.name = h.name;
      this.uid = h.uid;
      this.x = h.x;
      this.y = h.y;
      this.width = h.width;
      this.height = h.height;
      this.dataPortNumber = h.getDataPorts().length;
      this.numberOfBins = h.numberOfBins;
      this.xAxisLabel = h.xAxisLabel;
      this.yAxisLabel = h.yAxisLabel;
      this.graphWindowColor = h.graphWindowColor;
      this.showGridLines = h.showGridLines;
      this.autoscale = h.autoscale;
      this.minimumXValue = h.minimumXValue;
      this.maximumXValue = h.maximumXValue;
      this.minimumYValue = h.minimumYValue;
      this.maximumYValue = h.maximumYValue;
      this.legends = [...h.legends];
      this.lineColors = [...h.lineColors];
      this.lineWidths = [...h.lineWidths];
      this.fillColors = [...h.fillColors];
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#FEEEFE";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portI = [];
    this.portI.push(new Port(this, true, "A", 0, this.barHeight + dh, false));
    this.ports.push(this.portI[0]);
    this.graphWindow = new Rectangle(0, 0, 1, 1);
    this.dataArrays.push(new DataArray(0));
    this.legends.push("A");
    this.lineColors.push("black");
    this.fillColors.push("white");
    this.lineWidths.push(1);
    this.distributions.push(new Array(this.numberOfBins));
  }

  getCopy(): Block {
    let copy = new Histogram("Histogram #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.graphWindowColor = this.graphWindowColor;
    copy.showGridLines = this.showGridLines;
    copy.legends = [...this.legends];
    copy.lineColors = [...this.lineColors];
    copy.lineWidths = [...this.lineWidths];
    copy.fillColors = [...this.fillColors];
    copy.setDataPortNumber(this.getDataPorts().length);
    copy.setNumberOfBins(this.numberOfBins);
    return copy;
  }

  destroy(): void {
  }

  erase(): void {
    for (let i = 0; i < this.dataArrays.length; i++) {
      this.dataArrays[i].data.length = 0;
    }
  }

  setNumberOfBins(numberOfBins: number): void {
    if (this.numberOfBins !== numberOfBins) {
      this.numberOfBins = numberOfBins;
      this.distributions.length = 0;
      for (let i = 0; i < this.dataArrays.length; i++) {
        this.distributions.push(new Array(this.numberOfBins));
      }
    }
  }

  getNumberOfBins(): number {
    return this.numberOfBins;
  }

  setDataPortNumber(portNumber: number): void {
    if (portNumber > this.portI.length) { // increase data ports
      for (let i = 0; i < portNumber; i++) {
        if (i >= this.portI.length) {
          let p = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, 0, false);
          this.portI.push(p);
          this.ports.push(p);
          this.dataArrays.push(new DataArray(0));
          this.legends.push(p.getUid());
          this.lineColors.push("black");
          this.lineWidths.push(1);
          this.fillColors.push("white");
          this.distributions.push(new Array(this.numberOfBins));
        }
      }
    } else if (portNumber < this.portI.length) { // decrease data ports
      for (let i = this.portI.length - 1; i >= portNumber; i--) {
        this.portI.pop();
        flowchart.removeConnectorsToPort(this.ports.pop());
        this.dataArrays.pop();
        this.legends.pop();
        this.lineColors.pop();
        this.lineWidths.pop();
        this.fillColors.pop();
        this.distributions.pop();
      }
    }
    // ensure that extra properties are removed
    let n = this.portI.length;
    this.dataArrays.length = n;
    this.legends.length = n;
    this.lineColors.length = n;
    this.lineWidths.length = n;
    this.fillColors.length = n;
    this.distributions.length = n;
    this.refreshView();
  }

  getDataPorts(): Port[] {
    return this.portI;
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

  setShowGridLines(showGridLines: boolean): void {
    this.showGridLines = showGridLines;
  }

  getShowGridLines(): boolean {
    return this.showGridLines;
  }

  setLegends(legends: string[]): void {
    this.legends = legends;
  }

  getLegends(): string[] {
    return [...this.legends];
  }

  setLegend(i: number, legend: string): void {
    this.legends[i] = legend;
  }

  getLegend(i: number): string {
    return this.legends[i];
  }

  setLineColors(lineColors: string[]): void {
    this.lineColors = lineColors;
  }

  getLineColors(): string[] {
    return [...this.lineColors];
  }

  setLineColor(i: number, lineColor: string): void {
    this.lineColors[i] = lineColor;
  }

  getLineColor(i: number): string {
    return this.lineColors[i];
  }

  setLineWidths(lineWidths: number[]): void {
    this.lineWidths = lineWidths;
  }

  getLineWidths(): number[] {
    return [...this.lineWidths];
  }

  setLineWidth(i: number, lineWidth: number): void {
    this.lineWidths[i] = lineWidth;
  }

  getLineWidth(i: number): number {
    return this.lineWidths[i];
  }

  setFillColors(fillColors: string[]): void {
    this.fillColors = fillColors;
  }

  getFillColors(): string[] {
    return [...this.fillColors];
  }

  setFillColor(i: number, fillColor: string): void {
    this.fillColors[i] = fillColor;
  }

  getFillColor(i: number): string {
    return this.fillColors[i];
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
    let maxLength = 0;
    for (let da of this.dataArrays) {
      if (da.length() > maxLength) maxLength = da.length();
    }
    if (this.iconic) {
      ctx.lineWidth = 0.5;
      let x0 = this.graphWindow.x;
      let y0 = this.graphWindow.y + this.graphWindow.height;
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(x0 + 3.5, y0 - 4, 3, 4);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(x0 + 7, y0 - 8, 3, 8);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(x0 + 10.5, y0 - 4, 3, 4);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    } else {
      this.drawAxisLabels(ctx);
      if (this.showGridLines) {
        this.drawGridLines(ctx);
      }
      this.drawBars(ctx);
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

  private drawBars(ctx: CanvasRenderingContext2D): void {
    // detect minimum and maximum of x and y values from all inputs and calculate the scale factor
    let xmin = Number.MAX_VALUE;
    let xmax = -xmin;
    let ymin = Number.MAX_VALUE;
    let ymax = -ymin;
    if (this.autoscale) {
      for (let i = 0; i < this.dataArrays.length; i++) {
        let length = this.dataArrays[i].length();
        if (length > 1) {
          let xminxmax = this.dataArrays[i].getMinMax();
          if (xmin > xminxmax.min) {
            xmin = xminxmax.min;
          }
          if (xmax < xminxmax.max) {
            xmax = xminxmax.max;
          }
          let dist = this.distributions[i];
          let dmin = Math.min(...dist);
          let dmax = Math.max(...dist);
          if (ymin > dmin) {
            ymin = dmin;
          }
          if (ymax < dmax) {
            ymax = dmax;
          }
        }
      }
      if (xmin == Number.MAX_VALUE) xmin = 0;
      if (xmax == -Number.MAX_VALUE) xmax = 1;
      if (ymin == Number.MAX_VALUE) ymin = 0;
      if (ymax == -Number.MAX_VALUE) ymax = 1;
    } else {
      xmin = this.minimumXValue;
      xmax = this.maximumXValue;
      ymin = this.minimumYValue;
      ymax = this.maximumYValue;
    }
    let yOffset = 0.1 * this.graphWindow.height;
    let dx = this.graphWindow.width / (this.numberOfBins + 1);
    let dy = ymax === ymin ? 1 : (this.graphWindow.height - yOffset) / (ymax - ymin);
    let bin = (xmax - xmin) / this.numberOfBins;
    let x0 = this.graphWindow.x;
    let y0 = this.graphWindow.y + this.graphWindow.height;
    for (let i = 0; i < this.dataArrays.length; i++) {
      this.distributions[i].fill(0);
      for (let j = 0; j < this.dataArrays[i].data.length; j++) {
        let p = this.dataArrays[i].data[j];
        let k = Math.floor((p - xmin) / bin);
        this.distributions[i][k]++;
        let y2 = this.distributions[i][k] * dy;
        ctx.lineWidth = this.lineWidths[i];
        ctx.beginPath();
        ctx.fillStyle = this.fillColors[i];
        ctx.rect(x0 + dx * k, y0 - y2, dx, y2);
        ctx.fill();
        ctx.strokeStyle = this.lineColors[i];
        ctx.stroke();
      }
    }
    // draw y-axis tick marks
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillText("0", this.graphWindow.x - ctx.measureText("0").width - 5, y0);
    let precision = Math.abs(ymax) < 1 ? 2 : Math.round(Math.abs(ymax)).toString().length + 1;
    let y2 = y0 - ymax * dy;
    let maxString = (Math.abs(ymax) < 0.0001 ? 0 : ymax).toPrecision(precision);
    if (Math.abs(ymax) >= 1) {
      if (maxString.endsWith(".0")) {
        maxString = ymax.toPrecision(precision - 1);
      } else if (maxString.endsWith(".00")) {
        maxString = ymax.toPrecision(precision > 2 ? precision - 2 : 1);
      }
    }
    ctx.beginPath();
    ctx.moveTo(this.graphWindow.x, y2);
    ctx.lineTo(this.graphWindow.x + 4, y2);
    ctx.stroke();
    ctx.fillText(maxString, this.graphWindow.x - ctx.measureText(maxString).width - 5, y2);
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.graphMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.graphWindow.x + (this.graphWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 25);
    ctx.save();
    ctx.translate(this.x + 30, this.graphWindow.y + (this.graphWindow.height + ctx.measureText(this.yAxisLabel).width) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  private drawGridLines(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.graphWindow.x, this.graphWindow.y + this.graphWindow.height);
    ctx.strokeStyle = "lightgray";
    let dx = this.graphWindow.width / 10;
    for (let i = 1; i < 10; i++) {
      let tmpX = dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -this.graphWindow.height);
      ctx.stroke();
    }
    let dy = this.graphWindow.height / 10;
    for (let i = 1; i < 10; i++) {
      let tmpY = -dy * i;
      ctx.beginPath();
      ctx.moveTo(0, tmpY);
      ctx.lineTo(this.graphWindow.width, tmpY);
      ctx.stroke();
    }
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let v = this.portI[i].getValue();
      if (v !== undefined) {
        if (Array.isArray(v)) {
          this.dataArrays[i].data = v;
        } else {
          this.dataArrays[i].data.push(v);
        }
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.graphMargin.top = 10;
    this.graphMargin.bottom = 35;
    this.graphMargin.left = 40;
    this.graphMargin.right = 10;
    let dh = (this.height - this.barHeight) / (this.portI.length + 1);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY(this.barHeight + (i + 1) * dh);
    }
  }

}
