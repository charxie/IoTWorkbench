/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";
import {UnivariateDescriptiveStatistics} from "../math/UnivariateDescriptiveStatistics";
import {FiveNumberSummary} from "./FiveNumberSummary";

export class BoxPlot extends Block {

  private portI: Port[];
  private dataArrays: DataArray[] = [];
  private fiveNumberSummaries: FiveNumberSummary[] = [];
  private minimumValue: number = 0;
  private maximumValue: number = 1;
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
  private boxColors: string[] = [];

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly dataPortNumber: number;
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly graphWindowColor: string;
    readonly autoscale: boolean;
    readonly minimumValue: number;
    readonly maximumValue: number;
    readonly legends: string[];
    readonly lineColors: string[];
    readonly lineWidths: number[];
    readonly boxColors: string[];

    constructor(b: BoxPlot) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.dataPortNumber = b.getDataPorts().length;
      this.xAxisLabel = b.xAxisLabel;
      this.yAxisLabel = b.yAxisLabel;
      this.graphWindowColor = b.graphWindowColor;
      this.autoscale = b.autoscale;
      this.minimumValue = b.minimumValue;
      this.maximumValue = b.maximumValue;
      this.legends = [...b.legends];
      this.lineColors = [...b.lineColors];
      this.lineWidths = [...b.lineWidths];
      this.boxColors = [...b.boxColors];
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#DEE";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portI = [];
    this.portI.push(new Port(this, true, "A", 0, this.barHeight + dh, false));
    this.ports.push(this.portI[0]);
    this.graphWindow = new Rectangle(0, 0, 1, 1);
    this.dataArrays.push(new DataArray(0));
    this.fiveNumberSummaries.push(new FiveNumberSummary(0, 0.25, 0.5, 0.75, 1));
    this.legends.push("A");
    this.lineColors.push("black");
    this.boxColors.push("white");
    this.lineWidths.push(1);
  }

  getCopy(): Block {
    let copy = new BoxPlot("Box Plot #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumValue = this.minimumValue;
    copy.maximumValue = this.maximumValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.graphWindowColor = this.graphWindowColor;
    copy.legends = [...this.legends];
    copy.lineColors = [...this.lineColors];
    copy.lineWidths = [...this.lineWidths];
    copy.boxColors = [...this.boxColors];
    copy.setDataPortNumber(this.getDataPorts().length);
    return copy;
  }

  destroy(): void {
  }

  setDataPortNumber(portNumber: number): void {
    if (portNumber > this.portI.length) { // increase data ports
      for (let i = 0; i < portNumber; i++) {
        if (i >= this.portI.length) {
          let p = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, 0, false);
          this.portI.push(p);
          this.ports.push(p);
          this.dataArrays.push(new DataArray(0));
          this.fiveNumberSummaries.push(new FiveNumberSummary(0, 0.25, 0.5, 0.75, 1));
          this.legends.push(p.getUid());
          this.lineColors.push("black");
          this.lineWidths.push(1);
          this.boxColors.push("white");
        }
      }
    } else if (portNumber < this.portI.length) { // decrease data ports
      for (let i = this.portI.length - 1; i >= portNumber; i--) {
        this.portI.pop();
        flowchart.removeConnectorsToPort(this.ports.pop());
        this.dataArrays.pop();
        this.fiveNumberSummaries.pop();
        this.legends.pop();
        this.lineColors.pop();
        this.lineWidths.pop();
        this.boxColors.pop();
      }
    }
    // ensure that extra properties are removed
    let n = this.portI.length;
    this.dataArrays.length = n;
    this.fiveNumberSummaries.length = n;
    this.legends.length = n;
    this.lineColors.length = n;
    this.lineWidths.length = n;
    this.boxColors.length = n;
    this.refreshView();
  }

  getDataPorts(): Port[] {
    return this.portI;
  }

  setMinimumValue(minimumValue: number): void {
    this.minimumValue = minimumValue;
  }

  getMinimumValue(): number {
    return this.minimumValue;
  }

  setMaximumValue(maximumValue: number): void {
    this.maximumValue = maximumValue;
  }

  getMaximumValue(): number {
    return this.maximumValue;
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

  setBoxColors(boxColors: string[]): void {
    this.boxColors = boxColors;
  }

  getBoxColors(): string[] {
    return [...this.boxColors];
  }

  setBoxColor(i: number, boxColor: string): void {
    this.boxColors[i] = boxColor;
  }

  getBoxColor(i: number): string {
    return this.boxColors[i];
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
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      let xc = this.graphWindow.x + this.graphWindow.width / 2;
      let yc = this.graphWindow.y + this.graphWindow.height / 2;
      ctx.moveTo(xc, this.graphWindow.y + this.graphWindow.height - 2);
      ctx.lineTo(xc, this.graphWindow.y + 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.rect(xc - 1.5, yc - 1, 3, 2);
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
    } else {
      this.drawAxisLabels(ctx);
      if (maxLength > 1) {
        this.drawBoxes(ctx);
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

  private drawBoxes(ctx: CanvasRenderingContext2D): void {
    let ymin;
    let ymax;
    if (this.autoscale) {
      ymin = Number.MAX_VALUE;
      ymax = -ymin;
      for (let fns of this.fiveNumberSummaries) {
        if (ymin > fns.min) {
          ymin = fns.min;
        }
        if (ymax < fns.max) {
          ymax = fns.max;
        }
      }
    } else {
      ymin = this.minimumValue;
      ymax = this.maximumValue;
    }
    let yOffset = 0.1 * this.graphWindow.height;
    let dy = (this.graphWindow.height - 2 * yOffset) / (ymax - ymin);
    let n = this.fiveNumberSummaries.length;
    let dx = this.graphWindow.width / (n + 1);
    let y0 = this.graphWindow.y + this.graphWindow.height - yOffset;
    let xi, y1, y2;
    for (let i = 0; i < n; i++) {
      ctx.strokeStyle = this.lineColors[i];
      ctx.lineWidth = this.lineWidths[i];
      xi = this.graphWindow.x + (i + 1) * dx;
      // draw min
      y1 = y0 - (this.fiveNumberSummaries[i].min - ymin) * dy;
      ctx.beginPath();
      ctx.moveTo(xi - dx / 5, y1);
      ctx.lineTo(xi + dx / 5, y1);
      ctx.stroke();
      // draw max
      y2 = y0 - (this.fiveNumberSummaries[i].max - ymin) * dy;
      ctx.beginPath();
      ctx.moveTo(xi - dx / 5, y2);
      ctx.lineTo(xi + dx / 5, y2);
      ctx.stroke();
      // draw line between min and max
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(xi, y1);
      ctx.lineTo(xi, y2);
      ctx.stroke();
      ctx.setLineDash([]);
      // draw box
      y1 = y0 - (this.fiveNumberSummaries[i].q1 - ymin) * dy;
      y2 = y0 - (this.fiveNumberSummaries[i].q3 - ymin) * dy;
      ctx.fillStyle = this.boxColors[i];
      ctx.beginPath();
      ctx.rect(xi - dx / 4, y1, dx / 2, y2 - y1);
      ctx.fill();
      ctx.stroke();
      // draw median
      ctx.lineWidth = this.lineWidths[i] * 4;
      y1 = y0 - (this.fiveNumberSummaries[i].median - ymin) * dy;
      ctx.beginPath();
      ctx.moveTo(xi - dx / 4, y1);
      ctx.lineTo(xi + dx / 4, y1);
      ctx.stroke();
      // draw legends
      ctx.font = "10px Arial";
      ctx.fillStyle = "black";
      let labelWidth = ctx.measureText(this.legends[i]).width;
      ctx.fillText(this.legends[i], xi - labelWidth / 2, y0 + yOffset + 15);
      // draw tickmarks
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xi, y0 + yOffset);
      ctx.lineTo(xi, y0 + yOffset - 6);
      ctx.stroke();
    }

    // draw y-axis tick marks
    ctx.font = "10px Arial";
    ctx.lineWidth = 1;
    let precision = Math.abs(ymin) < 1 ? 2 : Math.round(Math.abs(ymin)).toString().length + 1;
    let minString = (Math.abs(ymin) < 0.0001 ? 0 : ymin).toPrecision(precision);
    if (Math.abs(ymin) >= 1) {
      if (minString.endsWith(".0")) {
        minString = ymin.toPrecision(precision - 1);
      } else if (minString.endsWith(".00")) {
        minString = ymin.toPrecision(precision > 2 ? precision - 2 : 1);
      }
    }
    ctx.beginPath();
    ctx.moveTo(this.graphWindow.x, y0);
    ctx.lineTo(this.graphWindow.x + 4, y0);
    ctx.stroke();
    ctx.fillText(minString, this.graphWindow.x - ctx.measureText(minString).width - 5, y0);
    precision = Math.abs(ymax) < 1 ? 2 : Math.round(Math.abs(ymax)).toString().length + 1;
    y2 = y0 - (ymax - ymin) * dy;
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
    ctx.fillText(this.xAxisLabel, this.graphWindow.x + (this.graphWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 35);
    ctx.save();
    ctx.translate(this.x + 30, this.graphWindow.y + (this.graphWindow.height + ctx.measureText(this.yAxisLabel).width) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let v = this.portI[i].getValue();
      this.dataArrays[i].data = Array.isArray(v) ? v : [v];
      this.fiveNumberSummaries[i].copy(new UnivariateDescriptiveStatistics(this.dataArrays[i].data).getFiveNumberSummary());
    }
  }

  refreshView(): void {
    super.refreshView();
    this.graphMargin.top = 10;
    this.graphMargin.bottom = 50;
    this.graphMargin.left = 40;
    this.graphMargin.right = 10;
    let dh = (this.height - this.barHeight) / (this.portI.length + 1);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY(this.barHeight + (i + 1) * dh);
    }
  }

}
