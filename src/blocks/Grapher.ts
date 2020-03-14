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
  private lineThicknesses: number[] = [];
  private fillOptions: boolean[] = [];
  private fillColors: string[] = [];
  private graphSymbols: string[] = [];
  private graphSymbolSizes: number[] = [];
  private graphSymbolColors: string[] = [];
  private graphSymbolSpacings: number[] = [];

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
    readonly lineThicknesses: number[];
    readonly fillOptions: boolean[];
    readonly fillColors: string[];
    readonly graphSymbols: string[];
    readonly graphSymbolSizes: number[];
    readonly graphSymbolColors: string[];
    readonly graphSymbolSpacings: number[];

    constructor(grapher: Grapher) {
      this.name = grapher.name;
      this.uid = grapher.uid;
      this.x = grapher.x;
      this.y = grapher.y;
      this.width = grapher.width;
      this.height = grapher.height;
      this.dataPortNumber = grapher.getDataPorts().length;
      this.xAxisLabel = grapher.xAxisLabel;
      this.yAxisLabel = grapher.yAxisLabel;
      this.graphWindowColor = grapher.graphWindowColor;
      this.autoscale = grapher.autoscale;
      this.minimumValue = grapher.minimumValue;
      this.maximumValue = grapher.maximumValue;
      this.lineTypes = [...grapher.lineTypes];
      this.lineColors = [...grapher.lineColors];
      this.lineThicknesses = [...grapher.lineThicknesses];
      this.fillOptions = [...grapher.fillOptions];
      this.fillColors = [...grapher.fillColors];
      this.graphSymbols = [...grapher.graphSymbols];
      this.graphSymbolSizes = [...grapher.graphSymbolSizes];
      this.graphSymbolColors = [...grapher.graphSymbolColors];
      this.graphSymbolSpacings = [...grapher.graphSymbolSpacings];
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
    this.dataArrays.push(new DataArray(0));
    this.lineTypes.push("Solid");
    this.lineColors.push("black");
    this.lineThicknesses.push(1);
    this.fillOptions.push(false);
    this.fillColors.push("lightgray");
    this.graphSymbols.push("Circle");
    this.graphSymbolSizes.push(3);
    this.graphSymbolColors.push("white");
    this.graphSymbolSpacings.push(2);
  }

  getCopy(): Block {
    let copy = new Grapher("Grapher #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumValue = this.minimumValue;
    copy.maximumValue = this.maximumValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.graphWindowColor = this.graphWindowColor;
    copy.graphSymbols = [...this.graphSymbols];
    copy.graphSymbolSizes = [...this.graphSymbolSizes];
    copy.graphSymbolColors = [...this.graphSymbolColors];
    copy.graphSymbolSpacings = [...this.graphSymbolSpacings];
    copy.lineTypes = [...this.lineTypes];
    copy.lineColors = [...this.lineColors];
    copy.lineThicknesses = [...this.lineThicknesses];
    copy.fillOptions = [...this.fillOptions];
    copy.fillColors = [...this.fillColors];
    copy.setDataPortNumber(this.getDataPorts().length);
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
          this.dataArrays.push(new DataArray(0));
          this.lineTypes.push("Solid");
          this.lineColors.push("black");
          this.lineThicknesses.push(1);
          this.fillOptions.push(false);
          this.fillColors.push("lightgray");
          this.graphSymbols.push("Circle");
          this.graphSymbolSizes.push(3);
          this.graphSymbolColors.push("white");
          this.graphSymbolSpacings.push(2);
        }
      }
    } else if (portNumber < this.portI.length) { // decrease data ports
      for (let i = this.portI.length - 1; i >= portNumber; i--) {
        this.portI.pop();
        flowchart.removeConnectorsToPort(this.ports.pop());
        this.dataArrays.pop();
        this.lineTypes.pop();
        this.lineColors.pop();
        this.lineThicknesses.pop();
        this.fillOptions.pop();
        this.fillColors.pop();
        this.graphSymbols.pop();
        this.graphSymbolSizes.pop();
        this.graphSymbolColors.pop();
        this.graphSymbolSpacings.pop();
      }
    }
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

  setLineColors(lineColors: string[]): void {
    this.lineColors = lineColors;
  }

  getLineColors(): string[] {
    return [...this.lineColors];
  }

  setLineColor(i: number, lineColor: string): void {
    this.lineColors[i] = lineColor;
  }

  getLineColor(index: number): string {
    return this.lineColors[index];
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

  getLineThickness(index: number): number {
    return this.lineThicknesses[index];
  }

  setFillOptions(fillOptions: boolean[]): void {
    this.fillOptions = fillOptions;
  }

  getFillOptions(): boolean[] {
    return [...this.fillOptions];
  }

  setFillOption(i: number, fill: boolean): void {
    this.fillOptions[i] = fill;
  }

  getFillOption(i: number): boolean {
    return this.fillOptions[i];
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

  setLineTypes(lineTypes: string[]): void {
    this.lineTypes = lineTypes;
  }

  getLineTypes(): string[] {
    return [...this.lineTypes];
  }

  setLineType(i: number, lineType: string): void {
    this.lineTypes[i] = lineType;
  }

  getLineType(i: number): string {
    return this.lineTypes[i];
  }

  setGraphSymbols(graphSymbols: string[]): void {
    this.graphSymbols = graphSymbols;
  }

  getGraphSymbols(): string[] {
    return [...this.graphSymbols];
  }

  setGraphSymbol(i: number, graphSymbol: string): void {
    this.graphSymbols[i] = graphSymbol;
  }

  getGraphSymbol(i: number): string {
    return this.graphSymbols[i];
  }

  setGraphSymbolColors(graphSymbolColors: string[]): void {
    this.graphSymbolColors = graphSymbolColors;
  }

  getGraphSymbolColors(): string[] {
    return [...this.graphSymbolColors];
  }

  setGraphSymbolColor(i: number, graphSymbolColor: string): void {
    this.graphSymbolColors[i] = graphSymbolColor;
  }

  getGraphSymbolColor(i: number): string {
    return this.graphSymbolColors[i];
  }

  setGraphSymbolSizes(graphSymbolSizes: number[]): void {
    this.graphSymbolSizes = graphSymbolSizes;
  }

  getGraphSymbolSizes(): number[] {
    return [...this.graphSymbolSizes];
  }

  setGraphSymbolSize(i: number, graphSymbolSize: number): void {
    this.graphSymbolSizes[i] = graphSymbolSize;
  }

  getGraphSymbolSize(i: number): number {
    return this.graphSymbolSizes[i];
  }

  setGraphSymbolSpacings(graphSymbolSpacings: number[]): void {
    this.graphSymbolSpacings = graphSymbolSpacings;
  }

  getGraphSymbolSpacings(): number[] {
    return [...this.graphSymbolSpacings];
  }

  setGraphSymbolSpacing(i: number, graphSymbolSpacing: number): void {
    this.graphSymbolSpacings[i] = Math.round(graphSymbolSpacing);
  }

  getGraphSymbolSpacing(i: number): number {
    return this.graphSymbolSpacings[i];
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
    if (!this.iconic) {
      this.drawAxisLabels(ctx);
      if (maxLength > 1) {
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
    let maxLength = 2;
    for (let da of this.dataArrays) {
      if (da.length() > maxLength) maxLength = da.length();
    }
    let dx = this.graphWindow.width / (maxLength - 1);
    let yOffset = 0.1 * this.graphWindow.height;
    let dy = (this.graphWindow.height - 2 * yOffset) / (max - min);
    let tmpX;
    let tmpY;
    let horizontalAxisY = this.y + this.height - this.graphMargin.bottom;

    // draw the data line
    for (let i = 0; i < this.dataArrays.length; i++) {
      if (this.lineTypes[i] !== "None") {
        ctx.lineWidth = this.lineThicknesses[i];
        let arr = this.dataArrays[i];
        switch (this.lineTypes[i]) {
          case "Solid":
            ctx.setLineDash([]);
            break;
          case "Dashed":
            ctx.setLineDash([5, 3]); // dashes are 5px and spaces are 3px
            break;
          case "Dotted":
            ctx.setLineDash([2, 2]);
            break;
          case "Dashdot":
            ctx.setLineDash([8, 2, 2, 2]);
            break;
        }
        ctx.strokeStyle = this.lineColors[i];
        ctx.font = "10px Arial";
        ctx.beginPath();
        tmpX = this.graphWindow.x;
        tmpY = yOffset + (arr.data[0] - min) * dy;
        ctx.moveTo(tmpX, horizontalAxisY - tmpY);
        for (let k = 1; k < arr.length(); k++) {
          tmpX = this.graphWindow.x + dx * k;
          tmpY = yOffset + (arr.data[k] - min) * dy;
          ctx.lineTo(tmpX, horizontalAxisY - tmpY);
        }
        if (this.fillOptions[i]) {
          ctx.fillStyle = this.fillColors[i];
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    // draw symbols on top of the line
    for (let i = 0; i < this.dataArrays.length; i++) {
      if (this.graphSymbolSizes[i] < 0.1) continue; // don't draw if the size is too small
      let arr = this.dataArrays[i];
      switch (this.graphSymbols[i]) { // put switch outside, though the code is longer, the performance is better
        case "Circle":
          for (let k = 0; k < arr.length(); k++) {
            if (k % this.graphSymbolSpacings[i] === 0) {
              tmpX = this.graphWindow.x + dx * k;
              tmpY = yOffset + (arr.data[k] - min) * dy;
              ctx.beginPath();
              ctx.arc(tmpX, horizontalAxisY - tmpY, this.graphSymbolSizes[i], 0, 2 * Math.PI);
              ctx.closePath();
              ctx.fillStyle = this.graphSymbolColors[i];
              ctx.fill();
              ctx.strokeStyle = this.lineColors[i];
              ctx.stroke();
            }
          }
          break;
        case "Square":
          let r = this.graphSymbolSizes[i];
          let d = 2 * r;
          for (let k = 0; k < arr.length(); k++) {
            if (k % this.graphSymbolSpacings[i] === 0) {
              tmpX = this.graphWindow.x + dx * k;
              tmpY = yOffset + (arr.data[k] - min) * dy;
              ctx.beginPath();
              ctx.rect(tmpX - r, horizontalAxisY - tmpY - r, d, d);
              ctx.fillStyle = this.graphSymbolColors[i];
              ctx.fill();
              ctx.strokeStyle = this.lineColors[i];
              ctx.stroke();
            }
          }
          break;
        case "Triangle Up":
          r = this.graphSymbolSizes[i];
          d = 2 * r;
          for (let k = 0; k < arr.length(); k++) {
            if (k % this.graphSymbolSpacings[i] === 0) {
              tmpX = this.graphWindow.x + dx * k;
              tmpY = yOffset + (arr.data[k] - min) * dy;
              ctx.beginPath();
              ctx.moveTo(tmpX, horizontalAxisY - tmpY - d);
              ctx.lineTo(tmpX - r, horizontalAxisY - tmpY);
              ctx.lineTo(tmpX + r, horizontalAxisY - tmpY);
              ctx.closePath();
              ctx.fillStyle = this.graphSymbolColors[i];
              ctx.fill();
              ctx.strokeStyle = this.lineColors[i];
              ctx.stroke();
            }
          }
          break;
        case "Triangle Down":
          r = this.graphSymbolSizes[i];
          d = 2 * r;
          for (let k = 0; k < arr.length(); k++) {
            if (k % this.graphSymbolSpacings[i] === 0) {
              tmpX = this.graphWindow.x + dx * k;
              tmpY = yOffset + (arr.data[k] - min) * dy;
              ctx.beginPath();
              ctx.moveTo(tmpX, horizontalAxisY - tmpY + r);
              ctx.lineTo(tmpX - r, horizontalAxisY - tmpY - r);
              ctx.lineTo(tmpX + r, horizontalAxisY - tmpY - r);
              ctx.closePath();
              ctx.fillStyle = this.graphSymbolColors[i];
              ctx.fill();
              ctx.strokeStyle = this.lineColors[i];
              ctx.stroke();
            }
          }
          break;
        case "Diamond":
          r = this.graphSymbolSizes[i];
          d = 2 * r;
          for (let k = 0; k < arr.length(); k++) {
            if (k % this.graphSymbolSpacings[i] === 0) {
              tmpX = this.graphWindow.x + dx * k;
              tmpY = yOffset + (arr.data[k] - min) * dy;
              ctx.beginPath();
              ctx.moveTo(tmpX, horizontalAxisY - tmpY + r);
              ctx.lineTo(tmpX - r, horizontalAxisY - tmpY);
              ctx.lineTo(tmpX, horizontalAxisY - tmpY - r);
              ctx.lineTo(tmpX + r, horizontalAxisY - tmpY);
              ctx.closePath();
              ctx.fillStyle = this.graphSymbolColors[i];
              ctx.fill();
              ctx.strokeStyle = this.lineColors[i];
              ctx.stroke();
            }
          }
          break;
      }
    }

    // draw x-axis tick marks
    ctx.fillStyle = "black";
    let spacing = Math.pow(10, Util.countDigits(maxLength) - 1);
    if (spacing === maxLength) {
      spacing /= 10;
    }
    let precision: number;
    if (this.x0 != undefined && this.dx != undefined) {
      let xmax = this.x0 + maxLength * this.dx;
      precision = Math.abs(xmax) < 1 ? 2 : (1 + Math.round(Math.abs(xmax)).toString().length);
    } else {
      precision = maxLength.toString().length;
    }
    for (let i = 0; i <= maxLength; i++) {
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
        if (precision > 1) {
          if (Math.abs(x) < 1) {
            if (Math.abs(x) < 0.000001) {
              xString = "0";
            } else if (xString.endsWith("0")) {
              xString = x.toPrecision(precision - 1);
            }
          } else if (Math.abs(x) >= 1 && xString.endsWith(".0")) {
            xString = x.toPrecision(precision - 1);
          } else if (Math.abs(x) >= 1 && xString.endsWith(".00")) {
            xString = x.toPrecision(precision > 2 ? precision - 2 : 1);
          }
        }
        ctx.fillText(xString, tmpX - ctx.measureText(xString).width / 2, horizontalAxisY + 10);
      }
    }

    // draw y-axis tick marks
    precision = Math.abs(min) < 1 ? 2 : Math.round(Math.abs(min)).toString().length + 1;
    tmpY = yOffset;
    let minString = (Math.abs(min) < 0.0001 ? 0 : min).toPrecision(precision);
    if (Math.abs(min) >= 1) {
      if (minString.endsWith(".0")) {
        minString = min.toPrecision(precision - 1);
      } else if (minString.endsWith(".00")) {
        minString = min.toPrecision(precision > 2 ? precision - 2 : 1);
      }
    }
    ctx.beginPath();
    ctx.moveTo(this.graphWindow.x, horizontalAxisY - tmpY);
    ctx.lineTo(this.graphWindow.x + 4, horizontalAxisY - tmpY);
    ctx.stroke();
    ctx.fillText(minString, this.graphWindow.x - ctx.measureText(minString).width - 5, horizontalAxisY - tmpY);

    precision = Math.abs(max) < 1 ? 2 : Math.round(Math.abs(max)).toString().length + 1;
    tmpY = yOffset + (max - min) * dy;
    let maxString = (Math.abs(max) < 0.0001 ? 0 : max).toPrecision(precision);
    if (Math.abs(max) >= 1) {
      if (maxString.endsWith(".0")) {
        maxString = max.toPrecision(precision - 1);
      } else if (maxString.endsWith(".00")) {
        maxString = max.toPrecision(precision > 2 ? precision - 2 : 1);
      }
    }
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
    this.graphMargin.bottom = 36;
    this.graphMargin.left = 40;
    this.graphMargin.right = 10;
    let dh = (this.height - this.barHeight) / (this.portI.length + 3);
    for (let i = 0; i < this.portI.length; i++) {
      this.portI[i].setY(this.barHeight + (i + 1) * dh);
    }
    this.portX.setY(this.barHeight + (this.portI.length + 1) * dh);
    this.portD.setY(this.barHeight + (this.portI.length + 2) * dh);
  }

}
