/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";
import {Point2DArray} from "./Point2DArray";
import {ColorSchemes} from "./ColorSchemes";

export class ParallelCoordinatesPlot extends Block {

  private portI: Port[];
  private dataArrays: DataArray[] = [];
  private minimumValues: number[] = [];
  private maximumValues: number[] = [];
  private axisLabels: string[] = [];
  private autoscale: boolean = true;
  private fractionDigits: number = 1;
  private lineWidth: number = 1;
  private colorScheme: string = "Turbo";
  private interpolateColor = d3.interpolateTurbo;
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private readonly viewMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private pointArrays: Point2DArray[];

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly dataPortNumber: number;
    readonly viewWindowColor: string;
    readonly autoscale: boolean;
    readonly fractionDigits: number;
    readonly lineWidth: number;
    readonly colorScheme: string;
    readonly axisLabels: string[];
    readonly minimumValues: number[];
    readonly maximumValues: number[];

    constructor(b: ParallelCoordinatesPlot) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.viewWindowColor = b.viewWindowColor;
      this.autoscale = b.autoscale;
      this.dataPortNumber = b.getDataPorts().length;
      this.lineWidth = b.lineWidth;
      this.colorScheme = b.colorScheme;
      this.fractionDigits = b.fractionDigits;
      this.axisLabels = [...b.axisLabels];
      this.minimumValues = [...b.minimumValues];
      this.maximumValues = [...b.maximumValues];
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#FDFDEE";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = [];
    this.portI.push(new Port(this, true, "A", 0, this.barHeight + dh, false));
    this.ports.push(this.portI[0]);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.dataArrays.push(new DataArray(0));
    this.minimumValues.push(0);
    this.maximumValues.push(1);
    this.axisLabels.push("X");
  }

  getCopy(): Block {
    let copy = new ParallelCoordinatesPlot("Parallel Coordinates Plot #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.autoscale = this.autoscale;
    copy.colorScheme = this.colorScheme;
    copy.lineWidth = this.lineWidth;
    copy.fractionDigits = this.fractionDigits;
    copy.viewWindowColor = this.viewWindowColor;
    copy.minimumValues = [...this.minimumValues];
    copy.maximumValues = [...this.maximumValues];
    copy.axisLabels = [...this.axisLabels];
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
          this.axisLabels.push("X");
          this.minimumValues.push(0);
          this.maximumValues.push(1);
        }
      }
    } else if (portNumber < this.portI.length) { // decrease data ports
      for (let i = this.portI.length - 1; i >= portNumber; i--) {
        this.portI.pop();
        flowchart.removeConnectorsToPort(this.ports.pop());
        this.dataArrays.pop();
        this.axisLabels.pop();
        this.minimumValues.pop();
        this.maximumValues.pop();
      }
    }
    // ensure that extra properties are removed
    let n = this.portI.length;
    this.dataArrays.length = n;
    this.axisLabels.length = n;
    this.minimumValues.length = n;
    this.maximumValues.length = n;
    this.refreshView();
  }

  getDataPorts(): Port[] {
    return this.portI;
  }

  setAutoScale(autoscale: boolean): void {
    this.autoscale = autoscale;
  }

  getAutoScale(): boolean {
    return this.autoscale;
  }

  setFractionDigits(fractionDigits: number): void {
    this.fractionDigits = fractionDigits;
  }

  getFractionDigits(): number {
    return this.fractionDigits;
  }

  setLineWidth(lineWidth: number): void {
    this.lineWidth = lineWidth;
  }

  getLineWidth(): number {
    return this.lineWidth;
  }

  getColorScheme(): string {
    return this.colorScheme;
  }

  setColorScheme(colorScheme: string): void {
    this.colorScheme = colorScheme;
    this.interpolateColor = ColorSchemes.getInterpolateColorScheme(colorScheme);
  }

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
  }

  setMinimumValues(minimumValues: number[]): void {
    this.minimumValues = minimumValues;
  }

  getMinimumValues(): number[] {
    return [...this.minimumValues];
  }

  setMinimumValue(i: number, minimumValue: number): void {
    this.minimumValues[i] = minimumValue;
  }

  getMinimumValue(i: number): number {
    return this.minimumValues[i];
  }

  setMaximumValues(maximumValues: number[]): void {
    this.maximumValues = maximumValues;
  }

  getMaximumValues(): number[] {
    return [...this.maximumValues];
  }

  setMaximumValue(i: number, maximumValue: number): void {
    this.maximumValues[i] = maximumValue;
  }

  getMaximumValue(i: number): number {
    return this.maximumValues[i];
  }

  setAxisLabels(axisLabels: string[]): void {
    this.axisLabels = axisLabels;
  }

  getAxisLabels(): string[] {
    return [...this.axisLabels];
  }

  setAxisLabel(i: number, axisLabel: string): void {
    this.axisLabels[i] = axisLabel;
  }

  getAxisLabel(i: number): string {
    return this.axisLabels[i];
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

    // draw the view area
    ctx.fillStyle = this.color;
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
    let maxLength = 0;
    for (let da of this.dataArrays) {
      if (da.length() > maxLength) maxLength = da.length();
    }
    if (this.iconic) {
      ctx.lineWidth = 1;
      let xc = this.viewWindow.x + this.viewWindow.width / 2;
      let yc = this.viewWindow.y + this.viewWindow.height / 2;
      ctx.beginPath();
      ctx.moveTo(xc - 10, this.viewWindow.y + this.viewWindow.height - 3);
      ctx.lineTo(xc - 10, this.viewWindow.y + 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc, this.viewWindow.y + this.viewWindow.height - 3);
      ctx.lineTo(xc, this.viewWindow.y + 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc + 10, this.viewWindow.y + this.viewWindow.height - 3);
      ctx.lineTo(xc + 10, this.viewWindow.y + 3);
      ctx.stroke();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(xc - 10, this.viewWindow.y + this.viewWindow.height - 8);
      ctx.lineTo(xc, this.viewWindow.y + 8);
      ctx.lineTo(xc + 10, this.viewWindow.y + this.viewWindow.height - 6);
      ctx.stroke();
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(xc - 10, this.viewWindow.y + 8);
      ctx.lineTo(xc, this.viewWindow.y + this.viewWindow.height / 2);
      ctx.lineTo(xc + 10, this.viewWindow.y + 7);
      ctx.stroke();
      ctx.strokeStyle = "purple";
      ctx.beginPath();
      ctx.moveTo(xc - 10, this.viewWindow.y + 12);
      ctx.lineTo(xc, this.viewWindow.y + this.viewWindow.height / 2 + 5);
      ctx.lineTo(xc + 10, this.viewWindow.y + 10);
      ctx.stroke();
    } else {
      if (maxLength > 0) {
        let n = this.dataArrays[0].length();
        for (let i = 0; i < this.dataArrays.length; i++) {
          this.drawAxis(i, ctx);
          if (n > 0) {
            if (n > this.dataArrays[i].length()) n = this.dataArrays[i].length();
          }
        }
        ctx.lineWidth = this.lineWidth;
        let color = d3.scaleLinear().domain(d3.extent([-2, n + 2])).interpolate(() => this.interpolateColor);
        for (let j = 0; j < n; j++) {
          ctx.beginPath();
          for (let i = 0; i < this.dataArrays.length; i++) {
            ctx.strokeStyle = color(j);
            if (i === 0) {
              ctx.moveTo(this.pointArrays[i].getX(j), this.pointArrays[i].getY(j));
            } else {
              ctx.lineTo(this.pointArrays[i].getX(j), this.pointArrays[i].getY(j));
            }
          }
          ctx.stroke();
        }
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

  private drawAxis(i: number, ctx: CanvasRenderingContext2D): void {
    let ymin;
    let ymax;
    if (this.autoscale) {
      ymin = Number.MAX_VALUE;
      ymax = -ymin;
      for (let j = 0; j < this.dataArrays[i].length(); j++) {
        let vij = this.dataArrays[i].data[j];
        if (ymax < vij) {
          ymax = vij;
        }
        if (ymin > vij) {
          ymin = vij;
        }
      }
    } else {
      ymin = this.minimumValues[i];
      ymax = this.maximumValues[i];
    }
    if (this.pointArrays[i] === undefined) {
      this.pointArrays[i] = new Point2DArray();
    } else {
      this.pointArrays[i].clear();
    }
    let xOffset = 0.1 * this.viewWindow.width;
    let dx = (this.viewWindow.width - 2 * xOffset) / (this.dataArrays.length - 1);
    let yOffset = 0.1 * this.viewWindow.height;
    let dy = (this.viewWindow.height - 2 * yOffset) / (ymax - ymin);
    let y0 = this.viewWindow.y + this.viewWindow.height - yOffset;
    let xi = this.viewWindow.x + xOffset + i * dx;
    // set point array for drawing later
    for (let j = 0; j < this.dataArrays[i].length(); j++) {
      this.pointArrays[i].addPoint(xi, y0 - (this.dataArrays[i].data[j] - ymin) * dy);
    }
    // draw axis
    let axisColor = Util.isHexColor(this.viewWindowColor) ? Util.invertHexColor(this.viewWindowColor.toString(), false) : "black";
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xi, y0);
    ctx.lineTo(xi, this.viewWindow.y + yOffset);
    ctx.stroke();
    // draw tickmarks
    ctx.lineWidth = 1;
    ctx.font = "10px Arial";
    ctx.fillStyle = axisColor;
    let yi;
    let label;
    let delta = (ymax - ymin) / 10;
    let h = ctx.measureText("M").width;
    for (let k = 0; k <= 10; k++) {
      yi = y0 - k * (this.viewWindow.height - 2 * yOffset) / 10;
      ctx.beginPath();
      ctx.moveTo(xi, yi);
      ctx.lineTo(xi - 8, yi);
      ctx.stroke();
      label = (ymin + k * delta).toFixed(this.fractionDigits);
      ctx.fillText(label, xi - 20 - ctx.measureText(label).width / 2, yi + h / 2);
    }
    // draw labels
    ctx.font = "12px Arial";
    label = this.axisLabels[i] !== undefined ? this.axisLabels[i] : this.portI[i].getUid();
    ctx.fillText(label, xi - ctx.measureText(label).width / 2, y0 + yOffset / 2);
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    for (let i = 0; i < this.portI.length; i++) {
      let v = this.portI[i].getValue();
      if (v !== undefined) {
        this.dataArrays[i].data = Array.isArray(v) ? v : [v];
      }
    }
    if (this.pointArrays === undefined || this.pointArrays.length !== this.portI.length) {
      this.pointArrays = new Array(this.portI.length);
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewMargin.top = 10;
    this.viewMargin.bottom = 10;
    this.viewMargin.left = 20;
    this.viewMargin.right = 10;
    let dh = (this.height - this.barHeight) / (this.portI.length + 1);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY(this.barHeight + (i + 1) * dh);
    }
  }

}
