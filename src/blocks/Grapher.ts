/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart} from "../Main";
import {DataArray} from "./DataArray";

export class Grapher extends Block {

  private portI: Port[];
  private portX: Port;
  private portD: Port;
  private x0: number;
  private dx: number;
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
  private lineTypes: string[] = [];
  private lineColors: string[] = [];
  private graphSymbols: string[] = [];
  private graphSymbolColors: string[] = [];

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
    readonly lineTypes: string[];
    readonly lineColors: string[];
    readonly graphSymbols: string[];
    readonly graphSymbolColors: string[];

    constructor(grapher: Grapher) {
      this.name = grapher.name;
      this.uid = grapher.uid;
      this.x = grapher.x;
      this.y = grapher.y;
      this.width = grapher.width;
      this.height = grapher.height;
      this.dataPortNumber = grapher.getDataPortNumber();
      this.xAxisLabel = grapher.xAxisLabel;
      this.yAxisLabel = grapher.yAxisLabel;
      this.graphWindowColor = grapher.graphWindowColor;
      this.autoscale = grapher.autoscale;
      this.minimumValue = grapher.minimumValue;
      this.maximumValue = grapher.maximumValue;
      this.lineTypes = grapher.lineTypes;
      this.lineColors = grapher.lineColors;
      this.graphSymbols = grapher.graphSymbols;
      this.graphSymbolColors = grapher.graphSymbolColors;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#F0FFFF";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portI = [];
    this.portI.push(new Port(this, true, "I", 0, this.barHeight + dh, false));
    this.portX = new Port(this, true, "X", 0, this.barHeight + 2 * dh, false);
    this.portD = new Port(this, true, "D", 0, this.barHeight + 3 * dh, false);
    this.ports.push(this.portI[0]);
    this.ports.push(this.portX);
    this.ports.push(this.portD);
    this.graphWindow = new Rectangle(0, 0, 1, 1);
    this.dataArrays.push(new DataArray());
    this.lineTypes.push("Solid");
    this.lineColors.push("black");
    this.graphSymbols.push("Circle");
    this.graphSymbolColors.push("white");
  }

  getCopy(): Block {
    let copy = new Grapher("Grapher #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumValue = this.minimumValue;
    copy.maximumValue = this.maximumValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.graphWindowColor = this.graphWindowColor;
    copy.graphSymbols = JSON.parse(JSON.stringify(this.graphSymbols));
    copy.graphSymbolColors = JSON.parse(JSON.stringify(this.graphSymbolColors));
    copy.lineTypes = JSON.parse(JSON.stringify(this.lineTypes));
    copy.lineColors = JSON.parse(JSON.stringify(this.lineColors));
    copy.setDataPortNumber(this.getDataPortNumber());
    return copy;
  }

  destroy(): void {
  }

  setDataPortNumber(portNumber: number): void {
    if (portNumber > this.portI.length) { // increase data ports
      for (let i = 0; i < portNumber; i++) {
        if (i >= this.portI.length) {
          let p = new Port(this, true, String.fromCharCode("I".charCodeAt(0) + i), 0, 0, false);
          this.portI.push(p);
          this.ports.push(p);
          this.dataArrays.push(new DataArray());
          this.lineTypes.push("Solid");
          this.lineColors.push("black");
          this.graphSymbols.push("Circle");
          this.graphSymbolColors.push("white");
        }
      }
    } else if (portNumber < this.portI.length) { // decrease data ports
      for (let i = this.portI.length - 1; i >= portNumber; i--) {
        this.portI.pop();
        flowchart.removeConnectorsToPort(this.ports.pop());
        this.dataArrays.pop();
        this.lineTypes.pop();
        this.lineColors.pop();
        this.graphSymbols.pop();
        this.graphSymbolColors.pop();
      }
    }
    this.refreshView();
  }

  getDataPortNumber(): number {
    return this.portI.length;
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

  setLineColors(lineColors: string[]): void {
    this.lineColors = lineColors;
  }

  setLineColor(lineColor: string): void {
    for (let i = 0; i < this.lineColors.length; i++) {
      this.lineColors[i] = lineColor;
    }
  }

  getLineColor(): string {
    return this.lineColors[0];
  }

  setLineTypes(lineTypes: string[]): void {
    this.lineTypes = lineTypes;
  }

  setLineType(lineType: string): void {
    for (let i = 0; i < this.lineTypes.length; i++) {
      this.lineTypes[i] = lineType;
    }
  }

  getLineType(): string {
    return this.lineTypes[0];
  }

  setGraphSymbols(graphSymbols: string[]): void {
    this.graphSymbols = graphSymbols;
  }

  setGraphSymbol(graphSymbol: string): void {
    for (let i = 0; i < this.graphSymbols.length; i++) {
      this.graphSymbols[i] = graphSymbol;
    }
  }

  getGraphSymbol(): string {
    return this.graphSymbols[0];
  }

  setGraphSymbolColors(graphSymbolColors: string[]): void {
    this.graphSymbolColors = graphSymbolColors;
  }

  setGraphSymbolColor(graphSymbolColor: string): void {
    for (let i = 0; i < this.graphSymbolColors.length; i++) {
      this.graphSymbolColors[i] = graphSymbolColor;
    }
  }

  getGraphSymbolColor(): string {
    return this.graphSymbolColors[0];
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
    if (!this.iconic) {
      this.drawAxisLabels(ctx);
      if (this.dataArrays[0].length() > 1) {
        this.drawLineCharts(ctx);
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

  private drawLineCharts(ctx: CanvasRenderingContext2D): void {

    // detect minimum and maximum of y values
    let min = Number.MAX_VALUE;
    let max = -min;
    if (this.autoscale) {
      for (let arr of this.dataArrays) {
        let minmax = arr.getMinMax();
        if (min > minmax.min) {
          min = minmax.min;
        }
        if (max < minmax.max) {
          max = minmax.max;
        }
      }
    } else {
      min = this.minimumValue;
      max = this.maximumValue;
    }

    // determine the graph window

    let dx = this.graphWindow.width / (this.dataArrays[0].length() - 1);
    let yOffset = 0.1 * this.graphWindow.height;
    let dy = (this.graphWindow.height - 2 * yOffset) / (max - min);
    let tmpX;
    let tmpY;
    let horizontalAxisY = this.y + this.height - this.graphMargin.bottom;

    // draw the data line
    ctx.lineWidth = 1;
    for (let i = 0; i < this.dataArrays.length; i++) {
      let arr = this.dataArrays[i];
      switch (this.lineTypes[i]) {
        case "Solid":
          ctx.strokeStyle = this.lineColors[i];
          ctx.font = "10px Arial";
          ctx.fillStyle = "black";
          ctx.beginPath();
          tmpX = this.graphWindow.x;
          tmpY = yOffset + (arr.data[0] - min) * dy;
          ctx.moveTo(tmpX, horizontalAxisY - tmpY);
          for (let i = 1; i < arr.length(); i++) {
            tmpX = this.graphWindow.x + dx * i;
            tmpY = yOffset + (arr.data[i] - min) * dy;
            ctx.lineTo(tmpX, horizontalAxisY - tmpY);
          }
          ctx.stroke();
          break;
      }
    }

    ctx.lineWidth = 1;
    // draw symbols on top of the line
    for (let i = 0; i < this.dataArrays.length; i++) {
      let arr = this.dataArrays[i];
      switch (this.graphSymbols[i]) { // put switch outside, though the code is longer, the performance is better
        case "Circle":
          for (let i = 0; i < arr.length(); i++) {
            tmpX = this.graphWindow.x + dx * i;
            tmpY = yOffset + (arr.data[i] - min) * dy;
            ctx.beginPath();
            ctx.arc(tmpX, horizontalAxisY - tmpY, 3, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = this.graphSymbolColors[i];
            ctx.fill();
            ctx.strokeStyle = this.lineColors[i];
            ctx.stroke();
          }
          break;
        case "Square":
          for (let i = 0; i < arr.length(); i++) {
            tmpX = this.graphWindow.x + dx * i;
            tmpY = yOffset + (arr.data[i] - min) * dy;
            ctx.beginPath();
            ctx.rect(tmpX - 2, horizontalAxisY - tmpY - 2, 4, 4);
            ctx.fillStyle = this.graphSymbolColors[i];
            ctx.fill();
            ctx.strokeStyle = this.lineColors[i];
            ctx.stroke();
          }
          break;
      }
    }

    // draw x-axis tick marks
    ctx.fillStyle = "black";
    let spacing = Math.pow(10, Util.countDigits(this.dataArrays[0].length()) - 1);
    if (spacing === this.dataArrays[0].length()) {
      spacing /= 10;
    }
    let precision: number;
    if (this.x0 != undefined && this.dx != undefined) {
      let xmax = this.x0 + this.dataArrays[0].length() * this.dx;
      precision = xmax < 1 ? 2 : (1 + Math.round(xmax).toString().length);
    } else {
      precision = this.dataArrays[0].data.length.toString().length;
    }
    for (let i = 0; i <= this.dataArrays[0].length(); i++) {
      if (i % spacing == 0) {
        tmpX = this.graphWindow.x + dx * i;
        ctx.beginPath();
        ctx.moveTo(tmpX, horizontalAxisY);
        ctx.lineTo(tmpX, horizontalAxisY - 4);
        ctx.stroke();
        let x = i;
        if (this.x0 != undefined && this.dx != undefined) {
          x = this.x0 + i * this.dx;
        }
        let xString = x.toPrecision(precision);
        ctx.fillText(xString, tmpX - 4 - ctx.measureText(xString).width / 2, horizontalAxisY + 10);
      }
    }

    // draw y-axis tick marks
    precision = min < 1 ? 2 : Math.round(min).toString().length;
    tmpY = yOffset;
    let minString = (Math.abs(min) < 0.000001 ? 0 : min).toPrecision(precision);
    ctx.beginPath();
    ctx.moveTo(this.graphWindow.x, horizontalAxisY - tmpY);
    ctx.lineTo(this.graphWindow.x + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.fillText(minString, this.graphWindow.x - ctx.measureText(minString).width - 5, horizontalAxisY - tmpY);

    precision = max < 1 ? 2 : Math.round(max).toString().length;
    tmpY = yOffset + (max - min) * dy;
    let maxString = (Math.abs(max) < 0.000001 ? 0 : max).toPrecision(precision);
    ctx.beginPath();
    ctx.moveTo(this.graphWindow.x, horizontalAxisY - tmpY);
    ctx.lineTo(this.graphWindow.x + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.fillText(maxString, this.graphWindow.x - ctx.measureText(maxString).width - 5, horizontalAxisY - tmpY);

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
    let x0 = this.portX.getValue();
    if (x0 != undefined) {
      this.x0 = x0;
    }
    let dx = this.portD.getValue();
    if (dx != undefined) {
      this.dx = dx;
    }
  }

  refreshView(): void {
    super.refreshView();
    this.graphMargin.top = 10;
    this.graphMargin.bottom = 30;
    this.graphMargin.left = 40;
    this.graphMargin.right = 10;
    let dh = (this.height - this.barHeight) / (this.portI.length + 3);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY(this.barHeight + (i + 1) * dh);
    }
    this.portX.setY(this.barHeight + (this.portI.length + 1) * dh);
    this.portD.setY(this.barHeight + (this.portI.length + 2) * dh);
    this.updateModel();
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
