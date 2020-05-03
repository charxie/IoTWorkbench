/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";

export class BoxPlot extends Block {

  private portI: Port[];
  private dataArrays: DataArray[] = [];
  private minimumValue: number = 0;
  private maximumValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
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
  private lineThicknesses: number[] = [];
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
    readonly lineThicknesses: number[];
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
      this.lineThicknesses = [...b.lineThicknesses];
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
    this.legends.push("A");
    this.lineColors.push("black");
    this.boxColors.push("white");
    this.lineThicknesses.push(1);
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
    copy.lineThicknesses = [...this.lineThicknesses];
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
          this.legends.push(p.getUid());
          this.lineColors.push("black");
          this.lineThicknesses.push(1);
          this.boxColors.push("white");
        }
      }
    } else if (portNumber < this.portI.length) { // decrease data ports
      for (let i = this.portI.length - 1; i >= portNumber; i--) {
        this.portI.pop();
        flowchart.removeConnectorsToPort(this.ports.pop());
        this.dataArrays.pop();
        this.legends.pop();
        this.lineColors.pop();
        this.lineThicknesses.pop();
        this.boxColors.pop();
      }
    }
    // ensure that extra properties are removed
    let n = this.portI.length;
    this.dataArrays.length = n;
    this.legends.length = n;
    this.lineColors.length = n;
    this.lineThicknesses.length = n;
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

  setLineThicknesses(lineThicknesses: number[]): void {
    this.lineThicknesses = lineThicknesses;
  }

  getLineThicknesses(): number[] {
    return [...this.lineThicknesses];
  }

  setLineThickness(i: number, lineThickness: number): void {
    this.lineThicknesses[i] = lineThickness;
  }

  getLineThickness(i: number): number {
    return this.lineThicknesses[i];
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
      if (this.portI.length > 1) {
        this.drawLegends(ctx);
      }
      if (maxLength > 1) {
        this.drawBox(ctx);
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

  private drawBox(ctx: CanvasRenderingContext2D): void {

  }

  private drawLegends(ctx: CanvasRenderingContext2D): void {

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

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let v = this.portI[i].getValue();
      this.dataArrays[i].data = Array.isArray(v) ? v : [v];
    }
  }

  refreshView(): void {
    super.refreshView();
    this.graphMargin.top = 10;
    this.graphMargin.bottom = 36;
    this.graphMargin.left = 40;
    this.graphMargin.right = 10;
    let dh = (this.height - this.barHeight) / (this.portI.length + 1);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY(this.barHeight + (i + 1) * dh);
    }
  }

}
