/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";
import {MyVector} from "../math/MyVector";

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
  private normalize: boolean = false;
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
  private xmin: number = 0;
  private xmax: number = 1;
  private ymin: number = 0;
  private ymax: number = 1;

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
    readonly normalize: boolean;
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
      this.normalize = h.normalize;
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
    let dh = (this.height - this.barHeight) / 2;
    this.portI = [];
    this.portI.push(new Port(this, true, "A", 0, this.barHeight + dh, false));
    this.ports.push(this.portI[0]);
    this.graphWindow = new Rectangle(0, 0, 1, 1);
    this.dataArrays.push(new DataArray(0));
    this.legends.push("A");
    this.lineColors.push("black");
    this.fillColors.push("white");
    this.lineWidths.push(1);
    this.distributions.push(new Array(this.numberOfBins + 1));
  }

  getCopy(): Block {
    let copy = new Histogram("Histogram #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.autoscale = this.autoscale;
    copy.normalize = this.normalize;
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
      this.distributions[i].fill(0);
    }
  }

  setNumberOfBins(numberOfBins: number): void {
    if (this.numberOfBins !== numberOfBins) {
      this.numberOfBins = numberOfBins;
      this.distributions.length = 0;
      for (let i = 0; i < this.dataArrays.length; i++) {
        this.distributions.push(new Array(this.numberOfBins + 1));
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
          this.distributions.push(new Array(this.numberOfBins + 1));
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

  setNormalize(normalize: boolean): void {
    this.normalize = normalize;
  }

  getNormalize(): boolean {
    return this.normalize;
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
      let x0 = this.graphWindow.x + this.graphWindow.width / 2;
      let y0 = this.graphWindow.y + this.graphWindow.height;
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(x0 - 3, y0 - this.graphWindow.height / 3, 3, this.graphWindow.height / 3);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(x0, y0 - this.graphWindow.height / 3 * 2, 3, this.graphWindow.height / 3 * 2);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(x0 + 3, y0 - this.graphWindow.height / 3, 3, this.graphWindow.height / 3);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    } else {
      this.drawAxes(ctx);
      this.drawAxisLabels(ctx);
      if (this.showGridLines) {
        this.drawGridLines(ctx);
      }
      let yOffset = 0.1 * this.graphWindow.height;
      let dx = this.graphWindow.width / (this.numberOfBins + 1);
      let dy = (this.graphWindow.height - yOffset) / this.ymax;
      let x0 = this.graphWindow.x;
      let y0 = this.graphWindow.y + this.graphWindow.height;
      let h;
      let ddx = this.distributions.length <= 1 ? dx : dx / (this.distributions.length + 1);
      for (let i = 0; i < this.distributions.length; i++) {
        ctx.lineWidth = this.lineWidths[i];
        ctx.fillStyle = this.fillColors[i];
        ctx.strokeStyle = this.lineColors[i];
        for (let j = 0; j < this.distributions[i].length; j++) {
          h = this.distributions[i][j] * dy;
          if (h > 0) {
            ctx.beginPath();
            ctx.rect(x0 + dx * j + ddx * i, y0 - h, ddx, h);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
      if (this.portI.length > 1) this.drawLegends(ctx);
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

  private drawAxes(ctx: CanvasRenderingContext2D): void {
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    let y0 = this.graphWindow.y + this.graphWindow.height;
    // draw x-axis tickmarks
    let inx = (this.xmax - this.xmin) / 10;
    let dx = this.graphWindow.width / 10;
    for (let i = 0; i < 11; i++) {
      let tmpX = this.graphWindow.x + dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -4);
      ctx.stroke();
      let xtick = this.xmin + i * inx;
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
      ctx.fillText(iString, tmpX - ctx.measureText(iString).width / 2, y0 + 10);
    }
    // draw y-axis tick marks
    let yOffset = 0.1 * this.graphWindow.height;
    let dy = (this.graphWindow.height - yOffset) / this.ymax;
    ctx.fillText("0", this.graphWindow.x - ctx.measureText("0").width - 5, y0);
    let precision = Math.abs(this.ymax) < 1 ? 2 : Math.round(Math.abs(this.ymax)).toString().length + 1;
    let h = y0 - this.ymax * dy;
    let maxString = (Math.abs(this.ymax) < 0.0001 ? 0 : this.ymax).toPrecision(precision);
    if (Math.abs(this.ymax) >= 1) {
      if (maxString.endsWith(".0")) {
        maxString = this.ymax.toPrecision(precision - 1);
      } else if (maxString.endsWith(".00")) {
        maxString = this.ymax.toPrecision(precision > 2 ? precision - 2 : 1);
      }
    }
    ctx.beginPath();
    ctx.moveTo(this.graphWindow.x, h);
    ctx.lineTo(this.graphWindow.x + 4, h);
    ctx.stroke();
    ctx.fillText(maxString, this.graphWindow.x - ctx.measureText(maxString).width - 5, h);
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

  private drawLegends(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.font = "10px Arial";
    let x0 = this.graphWindow.x + this.graphWindow.width - 50;
    let y0 = this.graphWindow.y + this.graphMargin.top + 10;
    let yi;
    for (let i = 0; i < this.distributions.length; i++) {
      if (this.legends[i].trim() === "") continue;
      yi = y0 + i * 20;
      ctx.fillStyle = "black";
      ctx.fillText(this.legends[i], x0 - ctx.measureText(this.legends[i]).width, yi);
      yi -= 8;
      ctx.fillStyle = this.fillColors[i];
      ctx.lineWidth = this.lineWidths[i];
      ctx.strokeStyle = this.lineColors[i];
      ctx.beginPath();
      ctx.rect(x0 + 12, yi, 20, 10);
      ctx.fill();
      ctx.stroke();
    }
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

  private generateDistributions(): void {
    // detect minimum and maximum of x values
    this.xmin = Number.MAX_VALUE;
    this.xmax = -this.xmin;
    if (this.autoscale) {
      for (let i = 0; i < this.dataArrays.length; i++) {
        let length = this.dataArrays[i].length();
        if (length > 1) {
          let xminxmax = this.dataArrays[i].getMinMax();
          if (this.xmin > xminxmax.min) {
            this.xmin = xminxmax.min;
          }
          if (this.xmax < xminxmax.max) {
            this.xmax = xminxmax.max;
          }
        }
      }
      if (this.xmin == Number.MAX_VALUE) this.xmin = 0;
      if (this.xmax == -Number.MAX_VALUE) this.xmax = 1;
    } else {
      this.xmin = this.minimumXValue;
      this.xmax = this.maximumXValue;
    }
    // calculate the distributions
    let bin = (this.xmax - this.xmin) / this.numberOfBins;
    for (let i = 0; i < this.dataArrays.length; i++) {
      this.distributions[i].fill(0);
      if (this.normalize) {
        for (let j = 0; j < this.dataArrays[i].length(); j++) {
          let k = Math.floor((this.dataArrays[i].data[j] - this.xmin) / bin);
          this.distributions[i][k]++;
        }
        let sum = 0;
        for (let p of this.distributions[i]) {
          sum += p;
        }
        sum = sum <= 0 ? 0 : 1 / sum;
        for (let k = 0; k < this.distributions[i].length; k++) {
          this.distributions[i][k] *= sum;
        }
      } else {
        for (let j = 0; j < this.dataArrays[i].length(); j++) {
          let k = Math.floor((this.dataArrays[i].data[j] - this.xmin) / bin);
          this.distributions[i][k]++;
        }
      }
    }
    // detect minimum and maximum of y values
    this.ymin = Number.MAX_VALUE;
    this.ymax = -this.ymin;
    if (this.autoscale) {
      for (let i = 0; i < this.dataArrays.length; i++) {
        let dist = this.distributions[i];
        let dmin = Math.min(...dist);
        let dmax = Math.max(...dist);
        if (this.ymin > dmin) {
          this.ymin = dmin;
        }
        if (this.ymax < dmax) {
          this.ymax = dmax;
        }
      }
      if (this.ymin === Number.MAX_VALUE) this.ymin = 0;
      if (this.ymax === -Number.MAX_VALUE) this.ymax = 1;
    } else {
      this.ymin = this.minimumYValue;
      this.ymax = this.maximumYValue;
    }
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let v = this.portI[i].getValue();
      if (v !== undefined) {
        if (v instanceof MyVector) {
          this.dataArrays[i].data = v.getValues();
        } else {
          if (Array.isArray(v)) {
            this.dataArrays[i].data = v;
          } else {
            if (this.portI.length > 1) {
              // TODO: NOT a safe way to avoid multi-counting when there are multiple imports
              if (v !== this.dataArrays[i].getLatest()) {
                this.dataArrays[i].data.push(v);
              }
            } else {
              this.dataArrays[i].data.push(v);
            }
          }
        }
      }
    }
    this.generateDistributions();
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
