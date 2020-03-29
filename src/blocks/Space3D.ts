/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {flowchart, isNumber} from "../Main";
import {Vector} from "../math/Vector";
import {Point3DArray} from "./Point3DArray";

export class Space3D extends Block {

  private portX: Port; // x, y, z ports are only used in the dual mode (which is the default)
  private portY: Port;
  private portZ: Port;
  private portPoints: Port[]; // only used in the point mode (multiple point streams are supported only in this mode)
  private pointInput: boolean = false;
  private points: Point3DArray[] = [];
  private minimumXValue: number = 0;
  private maximumXValue: number = 1;
  private minimumYValue: number = 0;
  private maximumYValue: number = 1;
  private minimumZValue: number = 0;
  private maximumZValue: number = 1;
  private autoscale: boolean = true;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private zAxisLabel: string = "z";
  private spaceWindowColor: string = "white";
  private endSymbolsConnection: string = "None";
  private spaceWindow: Rectangle;
  private barHeight: number;
  private readonly spaceMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private numberOfZigzags: number[] = [];
  private tempX: number; // temporarily store x, y, and z before pushing them into the point arrays
  private tempY: number;
  private tempZ: number;
  private legends: string[] = [];
  private lineTypes: string[] = [];
  private lineColors: string[] = [];
  private lineThicknesses: number[] = [];
  private dataSymbols: string[] = [];
  private dataSymbolRadii: number[] = [];
  private dataSymbolColors: string[] = [];
  private dataSymbolSpacings: number[] = [];
  private endSymbolRadii: number[] = [];

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly xAxisLabel: string;
    readonly yAxisLabel: string;
    readonly zAxisLabel: string;
    readonly spaceWindowColor: string;
    readonly endSymbolsConnection: string;
    readonly autoscale: boolean;
    readonly minimumXValue: number;
    readonly maximumXValue: number;
    readonly minimumYValue: number;
    readonly maximumYValue: number;
    readonly minimumZValue: number;
    readonly maximumZValue: number;
    readonly pointInput: boolean;
    readonly numberOfPoints: number;
    readonly legends: string[] = [];
    readonly lineTypes: string[] = [];
    readonly lineColors: string[] = [];
    readonly lineThicknesses: number[] = [];
    readonly dataSymbols: string[] = [];
    readonly dataSymbolRadii: number[] = [];
    readonly dataSymbolColors: string[] = [];
    readonly dataSymbolSpacings: number[] = [];
    readonly endSymbolRadii: any[] = [];

    constructor(g: Space3D) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.xAxisLabel;
      this.yAxisLabel = g.yAxisLabel;
      this.zAxisLabel = g.zAxisLabel;
      this.spaceWindowColor = g.spaceWindowColor;
      this.endSymbolsConnection = g.endSymbolsConnection;
      this.autoscale = g.autoscale;
      this.minimumXValue = g.minimumXValue;
      this.maximumXValue = g.maximumXValue;
      this.minimumYValue = g.minimumYValue;
      this.maximumYValue = g.maximumYValue;
      this.minimumZValue = g.minimumZValue;
      this.maximumZValue = g.maximumZValue;
      this.pointInput = g.pointInput;
      this.numberOfPoints = g.getNumberOfPoints();
      this.legends = [...g.legends];
      this.lineTypes = [...g.lineTypes];
      this.lineColors = [...g.lineColors];
      this.lineThicknesses = [...g.lineThicknesses];
      this.dataSymbols = [...g.dataSymbols];
      this.dataSymbolRadii = [...g.dataSymbolRadii];
      this.dataSymbolColors = [...g.dataSymbolColors];
      this.dataSymbolSpacings = [...g.dataSymbolSpacings];
      this.endSymbolRadii = [...g.endSymbolRadii];
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#A78ECA";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portX = new Port(this, true, "X", 0, this.barHeight + dh, false)
    this.portY = new Port(this, true, "Y", 0, this.barHeight + 2 * dh, false)
    this.portZ = new Port(this, true, "Z", 0, this.barHeight + 3 * dh, false)
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portZ);
    this.spaceWindow = new Rectangle(0, 0, 1, 1);
    this.points.push(new Point3DArray());
    this.legends.push("A");
    this.lineTypes.push("Solid");
    this.lineColors.push("black");
    this.lineThicknesses.push(1);
    this.dataSymbols.push("Circle");
    this.dataSymbolRadii.push(3);
    this.dataSymbolColors.push("white");
    this.dataSymbolSpacings.push(1);
    this.endSymbolRadii.push(0);
  }

  getCopy(): Block {
    let copy = new Space3D("Space3D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.minimumXValue = this.minimumXValue;
    copy.maximumXValue = this.maximumXValue;
    copy.minimumYValue = this.minimumYValue;
    copy.maximumYValue = this.maximumYValue;
    copy.minimumZValue = this.minimumZValue;
    copy.maximumZValue = this.maximumZValue;
    copy.autoscale = this.autoscale;
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.zAxisLabel = this.zAxisLabel;
    copy.spaceWindowColor = this.spaceWindowColor;
    copy.endSymbolsConnection = this.endSymbolsConnection;
    copy.setPointInput(this.pointInput);
    copy.setNumberOfPoints(this.getNumberOfPoints());
    copy.legends = [...this.legends];
    copy.lineColors = [...this.lineColors];
    copy.lineTypes = [...this.lineTypes];
    copy.lineThicknesses = [...this.lineThicknesses];
    copy.dataSymbols = [...this.dataSymbols];
    copy.dataSymbolRadii = [...this.dataSymbolRadii];
    copy.dataSymbolColors = [...this.dataSymbolColors];
    copy.dataSymbolSpacings = [...this.dataSymbolSpacings];
    copy.endSymbolRadii = [...this.endSymbolRadii];
    return copy;
  }

  destroy(): void {
  }

  getPointPorts(): Port[] {
    return this.portPoints;
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
    for (let p of this.points) {
      p.clear();
    }
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
      let dh = (this.height - this.barHeight) / 3;
      if (this.portPoints == undefined) {
        this.portPoints = [];
        this.portPoints.push(new Port(this, true, "A", 0, this.barHeight + dh, false));
      }
      for (let p of this.portPoints) {
        this.ports.push(p);
      }
    } else {
      this.ports.push(this.portX);
      this.ports.push(this.portY);
      this.ports.push(this.portZ);
    }
  }

  getPointInput(): boolean {
    return this.pointInput;
  }

  setNumberOfPoints(numberOfPoints: number): void {
    if (this.pointInput) {
      if (numberOfPoints > this.portPoints.length) { // increase data ports
        // test if the line and symbol properties have already been set (this happens when loading an existing state)
        let notSet = this.legends.length == this.portPoints.length;
        for (let i = 0; i < numberOfPoints; i++) {
          if (i >= this.portPoints.length) {
            let p = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, 0, false);
            this.portPoints.push(p);
            this.ports.push(p);
            this.points.push(new Point3DArray());
            if (notSet) {
              this.legends.push(p.getUid());
              this.lineTypes.push("Solid");
              this.lineColors.push("black");
              this.lineThicknesses.push(1);
              this.dataSymbols.push("Circle");
              this.dataSymbolRadii.push(3);
              this.dataSymbolColors.push("white");
              this.dataSymbolSpacings.push(1);
              this.endSymbolRadii.push(0);
            }
          }
        }
      } else if (numberOfPoints < this.portPoints.length) { // decrease data ports
        for (let i = this.portPoints.length - 1; i >= numberOfPoints; i--) {
          this.portPoints.pop();
          this.points.pop();
          flowchart.removeConnectorsToPort(this.ports.pop());
          this.legends.pop();
          this.lineTypes.pop();
          this.lineColors.pop();
          this.lineThicknesses.pop();
          this.dataSymbols.pop();
          this.dataSymbolRadii.pop();
          this.dataSymbolColors.pop();
          this.dataSymbolSpacings.pop();
          this.endSymbolRadii.pop();
        }
      }
      let n = this.portPoints.length;
      this.points.length = n;
      this.legends.length = n;
      this.lineTypes.length = n;
      this.lineColors.length = n;
      this.lineThicknesses.length = n;
      this.dataSymbols.length = n;
      this.dataSymbolRadii.length = n;
      this.dataSymbolColors.length = n;
      this.dataSymbolSpacings.length = n;
      this.endSymbolRadii.length = n;
      this.refreshView();
    }
  }

  getNumberOfPoints(): number {
    return this.pointInput ? this.portPoints.length : 1;
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

  setZAxisLabel(zAxisLabel: string): void {
    this.zAxisLabel = zAxisLabel;
  }

  getZAxisLabel(): string {
    return this.zAxisLabel;
  }

  setSpaceWindowColor(spaceWindowColor: string): void {
    this.spaceWindowColor = spaceWindowColor;
  }

  getSpaceWindowColor(): string {
    return this.spaceWindowColor;
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

  setDataSymbols(dataSymbols: string[]): void {
    this.dataSymbols = dataSymbols;
  }

  getDataSymbols(): string[] {
    return [...this.dataSymbols];
  }

  setDataSymbol(i: number, dataSymbol: string): void {
    this.dataSymbols[i] = dataSymbol;
  }

  getDataSymbol(i: number): string {
    return this.dataSymbols[i];
  }

  setDataSymbolColors(dataSymbolColors: string[]): void {
    this.dataSymbolColors = dataSymbolColors;
  }

  getDataSymbolColors(): string[] {
    return [...this.dataSymbolColors];
  }

  setDataSymbolColor(i: number, dataSymbolColor: string): void {
    this.dataSymbolColors[i] = dataSymbolColor;
  }

  getDataSymbolColor(i: number): string {
    return this.dataSymbolColors[i];
  }

  setDataSymbolSpacings(dataSymbolSpacings: number[]): void {
    this.dataSymbolSpacings = dataSymbolSpacings;
  }

  getDataSymbolSpacings(): number[] {
    return [...this.dataSymbolSpacings];
  }

  setDataSymbolSpacing(i: number, dataSymbolSpacing: number): void {
    this.dataSymbolSpacings[i] = dataSymbolSpacing;
  }

  getDataSymbolSpacing(i: number): number {
    return this.dataSymbolSpacings[i];
  }

  setDataSymbolRadii(dataSymbolRadii: number[]): void {
    this.dataSymbolRadii = dataSymbolRadii;
  }

  getDataSymbolRadii(): number[] {
    return [...this.dataSymbolRadii];
  }

  setDataSymbolRadius(i: number, dataSymbolRadius: number): void {
    this.dataSymbolRadii[i] = dataSymbolRadius;
  }

  getDataSymbolRadius(i: number): number {
    return this.dataSymbolRadii[i];
  }

  setEndSymbolRadii(endSymbolRadii: number[]): void {
    this.endSymbolRadii = endSymbolRadii;
  }

  getEndSymbolRadii(): number[] {
    return this.endSymbolRadii;
  }

  setEndSymbolRadius(i: number, endSymbolRadius: number): void {
    this.endSymbolRadii[i] = endSymbolRadius;
  }

  getEndSymbolRadius(i: number): number {
    return this.endSymbolRadii[i];
  }

  setEndSymbolsConnection(endSymbolsConnection: string): void {
    this.endSymbolsConnection = endSymbolsConnection;
  }

  getEndSymbolsConnection(): string {
    return this.endSymbolsConnection;
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
      let maxPoints = this.points[0].length();
      for (let i = 1; i < this.points.length; i++) {
        if (maxPoints < this.points[i].length()) maxPoints = this.points[i].length();
      }
      let title = this.name + " (" + maxPoints + " points)";
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
      if (this.pointInput && this.portPoints.length > 1) {
        this.drawLegends(ctx);
      }
    }

    // detect minimum and maximum of x and y values from all inputs and calculate the scale factor
    let xmin = Number.MAX_VALUE;
    let xmax = -xmin;
    let ymin = Number.MAX_VALUE;
    let ymax = -ymin;
    if (this.autoscale) {
      for (let p of this.points) {
        let length = p.length();
        if (length > 1) {
          let xminxmax = p.getXminXmax();
          if (xmin > xminxmax.min) {
            xmin = xminxmax.min;
          }
          if (xmax < xminxmax.max) {
            xmax = xminxmax.max;
          }
          let yminymax = p.getYminYmax();
          if (ymin > yminymax.min) {
            ymin = yminymax.min;
          }
          if (ymax < yminymax.max) {
            ymax = yminymax.max;
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
    let dx = xmax === xmin ? 1 : this.spaceWindow.width / (xmax - xmin);
    let dy = ymax === ymin ? 1 : this.spaceWindow.height / (ymax - ymin);

    // draw X-Y plot
    ctx.save();
    ctx.translate(this.spaceWindow.x, this.spaceWindow.y + this.spaceWindow.height);
    for (let p of this.points) {
      let length = p.length();
      if (length > 1) {
        let index = this.points.indexOf(p);
        if (this.lineTypes[index] !== "None") {
          ctx.lineWidth = this.lineThicknesses[index];
          ctx.strokeStyle = this.lineColors[index];
          switch (this.lineTypes[index]) {
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
          ctx.beginPath();
          ctx.moveTo((p.getX(0) - xmin) * dx, -(p.getY(0) - ymin) * dy);
          for (let i = 1; i < length; i++) {
            ctx.lineTo((p.getX(i) - xmin) * dx, -(p.getY(i) - ymin) * dy);
          }
          ctx.stroke();
        }

        // draw symbols on top of the line
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        let r = this.dataSymbolRadii[index];
        switch (this.dataSymbols[index]) {
          case "Circle":
            for (let i = 0; i < length; i++) {
              if (i % this.dataSymbolSpacings[index] === 0) {
                ctx.beginPath();
                ctx.arc((p.getX(i) - xmin) * dx, -(p.getY(i) - ymin) * dy, r, 0, 2 * Math.PI);
                ctx.fillStyle = this.dataSymbolColors[index];
                ctx.fill();
                ctx.strokeStyle = this.lineColors[index];
                ctx.stroke();
              }
            }
            break;
          case "Square":
            for (let i = 0; i < length; i++) {
              if (i % this.dataSymbolSpacings[index] === 0) {
                ctx.beginPath();
                ctx.rect((p.getX(i) - xmin) * dx - r, -(p.getY(i) - ymin) * dy - r, 2 * r, 2 * r);
                ctx.fillStyle = this.dataSymbolColors[index];
                ctx.fill();
                ctx.strokeStyle = this.lineColors[index];
                ctx.stroke();
              }
            }
            break;
          case "Dot":
            for (let i = 0; i < length; i++) {
              if (i % this.dataSymbolSpacings[index] === 0) {
                ctx.beginPath();
                ctx.rect((p.getX(i) - xmin) * dx - 1, -(p.getY(i) - ymin) * dy - 1, 2, 2);
                ctx.fillStyle = this.dataSymbolColors[index];
                ctx.fill();
              }
            }
            break;
          case "Triangle Up":
            let tmpX, tmpY;
            for (let i = 0; i < length; i++) {
              if (i % this.dataSymbolSpacings[index] === 0) {
                tmpX = (p.getX(i) - xmin) * dx;
                tmpY = -(p.getY(i) - ymin) * dy;
                ctx.beginPath();
                ctx.moveTo(tmpX, tmpY - r);
                ctx.lineTo(tmpX - r, tmpY + r);
                ctx.lineTo(tmpX + r, tmpY + r);
                ctx.closePath();
                ctx.fillStyle = this.dataSymbolColors[index];
                ctx.fill();
                ctx.strokeStyle = this.lineColors[index];
                ctx.stroke();
              }
            }
            break;
          case "Triangle Down":
            for (let i = 0; i < length; i++) {
              if (i % this.dataSymbolSpacings[index] === 0) {
                tmpX = (p.getX(i) - xmin) * dx;
                tmpY = -(p.getY(i) - ymin) * dy;
                ctx.beginPath();
                ctx.moveTo(tmpX, tmpY + r);
                ctx.lineTo(tmpX - r, tmpY - r);
                ctx.lineTo(tmpX + r, tmpY - r);
                ctx.closePath();
                ctx.fillStyle = this.dataSymbolColors[index];
                ctx.fill();
                ctx.strokeStyle = this.lineColors[index];
                ctx.stroke();
              }
            }
            break;
          case "Diamond":
            for (let i = 0; i < length; i++) {
              if (i % this.dataSymbolSpacings[index] === 0) {
                tmpX = (p.getX(i) - xmin) * dx;
                tmpY = -(p.getY(i) - ymin) * dy;
                ctx.beginPath();
                ctx.moveTo(tmpX, tmpY + r);
                ctx.lineTo(tmpX - r, tmpY);
                ctx.lineTo(tmpX, tmpY - r);
                ctx.lineTo(tmpX + r, tmpY);
                ctx.closePath();
                ctx.fillStyle = this.dataSymbolColors[index];
                ctx.fill();
                ctx.strokeStyle = this.lineColors[index];
                ctx.stroke();
              }
            }
            break;
        }
      }
    }

    if (this.endSymbolsConnection !== "None") {
      let xi, yi, xj, yj;
      if (this.numberOfZigzags === undefined || this.numberOfZigzags.length !== this.points.length - 1) {
        this.numberOfZigzags = new Array(this.points.length - 1);
      }
      for (let i = 0; i < this.points.length - 1; i++) {
        xi = (this.points[i].getLatestX() - xmin) * dx;
        yi = -(this.points[i].getLatestY() - ymin) * dy;
        //ctx.strokeStyle = this.dataSymbolColors[i];
        ctx.strokeStyle = this.lineColors[i];
        xj = (this.points[i + 1].getLatestX() - xmin) * dx;
        yj = -(this.points[i + 1].getLatestY() - ymin) * dy;
        ctx.beginPath();
        ctx.moveTo(xi, yi);
        switch (this.endSymbolsConnection) {
          case "Line":
            ctx.lineWidth = 5;
            ctx.lineTo(xj, yj);
            break;
          case "Zigzag":
            ctx.lineWidth = 2;
            if (this.numberOfZigzags[i] === undefined) {
              this.numberOfZigzags[i] = Math.round(Math.hypot(xj - xi, yj - yi) / 8);
            }
            let dx = (xj - xi) / this.numberOfZigzags[i];
            let dy = (yj - yi) / this.numberOfZigzags[i];
            let dr = Math.hypot(dx, dy);
            let cx = dy / dr;
            let cy = -dx / dr;
            for (let k = 0; k <= this.numberOfZigzags[i]; k++) {
              let xk = xi + dx * k;
              let yk = yi + dy * k;
              if (k % 2 == 0) {
                xk += cx * 5;
                yk += cy * 5
              } else {
                xk -= cx * 5;
                yk -= cy * 5
              }
              ctx.lineTo(xk, yk);
            }
            break;
        }
        ctx.stroke();
      }
    }

    for (let p of this.points) {
      let i = p.length() - 1;
      if (i >= 0) {
        let index = this.points.indexOf(p);
        let endSymbolRadius = this.endSymbolRadii[index];
        if (!isNumber(endSymbolRadius)) {
          endSymbolRadius = flowchart.globalVariables[endSymbolRadius];
        }
        if (endSymbolRadius > 0) {
          ctx.lineWidth = this.lineThicknesses[index];
          ctx.beginPath();
          ctx.arc((p.getX(i) - xmin) * dx, -(p.getY(i) - ymin) * dy, endSymbolRadius, 0, 2 * Math.PI);
          ctx.fillStyle = this.dataSymbolColors[index];
          ctx.fill();
          ctx.strokeStyle = this.lineColors[index];
          ctx.stroke();
        }
      }
    }

    // draw axis tick marks and labels
    if (!this.iconic) {
      ctx.lineWidth = 1;
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
      dy = this.spaceWindow.height / 10;
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

  private drawLegends(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.font = "10px Arial";
    let x0 = this.spaceWindow.x + this.spaceWindow.width - 50;
    let y0 = this.spaceWindow.y + this.spaceMargin.top + 10;
    let yi;
    for (let i = 0; i < this.portPoints.length; i++) {
      if (this.legends[i].trim() === "") continue;
      yi = y0 + i * 20;
      ctx.fillStyle = "black";
      ctx.fillText(this.legends[i], x0 - ctx.measureText(this.legends[i]).width, yi);
      yi -= 4;
      if (this.lineTypes[i] !== "None") {
        ctx.beginPath();
        ctx.moveTo(x0 + 10, yi);
        ctx.lineTo(x0 + 40, yi);
        ctx.lineWidth = this.lineThicknesses[i];
        ctx.strokeStyle = this.lineColors[i];
        switch (this.lineTypes[i]) {
          case "Solid":
            ctx.setLineDash([]);
            break;
          case "Dashed":
            ctx.setLineDash([5, 3]);
            break;
          case "Dotted":
            ctx.setLineDash([2, 2]);
            break;
          case "Dashdot":
            ctx.setLineDash([8, 2, 2, 2]);
            break;
        }
        ctx.stroke();
      }
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      let xi = x0 + 25;
      let r = this.dataSymbolRadii[i];
      switch (this.dataSymbols[i]) {
        case "Circle":
          ctx.beginPath();
          ctx.arc(xi, yi, r, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fillStyle = this.dataSymbolColors[i];
          ctx.fill();
          ctx.strokeStyle = this.lineColors[i];
          ctx.stroke();
          break;
        case "Square":
          let d = 2 * r;
          ctx.beginPath();
          ctx.rect(xi - r, yi - r, d, d);
          ctx.fillStyle = this.dataSymbolColors[i];
          ctx.fill();
          ctx.strokeStyle = this.lineColors[i];
          ctx.stroke();
          break;
        case "Triangle Up":
          ctx.beginPath();
          ctx.moveTo(xi, yi - r);
          ctx.lineTo(xi - r, yi + r);
          ctx.lineTo(xi + r, yi + r);
          ctx.closePath();
          ctx.fillStyle = this.dataSymbolColors[i];
          ctx.fill();
          ctx.strokeStyle = this.lineColors[i];
          ctx.stroke();
          break;
        case "Triangle Down":
          ctx.beginPath();
          ctx.moveTo(xi, yi + r);
          ctx.lineTo(xi - r, yi - r);
          ctx.lineTo(xi + r, yi - r);
          ctx.closePath();
          ctx.fillStyle = this.dataSymbolColors[i];
          ctx.fill();
          ctx.strokeStyle = this.lineColors[i];
          ctx.stroke();
          break;
        case "Diamond":
          ctx.beginPath();
          ctx.moveTo(xi, yi + r);
          ctx.lineTo(xi - r, yi);
          ctx.lineTo(xi, yi - r);
          ctx.lineTo(xi + r, yi);
          ctx.closePath();
          ctx.fillStyle = this.dataSymbolColors[i];
          ctx.fill();
          ctx.strokeStyle = this.lineColors[i];
          ctx.stroke();
          break;
        case "Dot":
          ctx.beginPath();
          ctx.rect(xi - 2, yi - 2, 4, 4);
          ctx.fillStyle = this.dataSymbolColors[i];
          ctx.fill();
          break;
      }
    }
    ctx.restore();
  }

  private drawGridLines(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.spaceWindow.x, this.spaceWindow.y + this.spaceWindow.height);
    ctx.strokeStyle = "lightgray";
    let dx = this.spaceWindow.width / 10;
    for (let i = 1; i < 10; i++) {
      let tmpX = dx * i;
      ctx.beginPath();
      ctx.moveTo(tmpX, 0);
      ctx.lineTo(tmpX, -this.spaceWindow.height);
      ctx.stroke();
    }
    let dy = this.spaceWindow.height / 10;
    for (let i = 1; i < 10; i++) {
      let tmpY = -dy * i;
      ctx.beginPath();
      ctx.moveTo(0, tmpY);
      ctx.lineTo(this.spaceWindow.width, tmpY);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.spaceMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.spaceWindow.x + (this.spaceWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 25, this.spaceWindow.y + (this.spaceWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    if (this.pointInput) { // point input mode (support multiple curves, but it doesn't accept array as inputs)
      if (this.portPoints != undefined) {
        for (let i = 0; i < this.portPoints.length; i++) {
          let vp = this.portPoints[i].getValue();
          if (vp != undefined) {
            if (vp instanceof Vector) {
              vp = vp.getValues();
            }
            if (Array.isArray(vp) && vp.length > 1) {
              if (vp[0] != this.points[i].getLatestX() || vp[1] != this.points[i].getLatestY()) {
                this.tempX = vp[0];
                this.tempY = vp[1];
              }
            }
            if (this.tempX != undefined && this.tempY != undefined) {
              //console.log(i+"="+this.portPoints[i].getUid()+","+this.tempX + "," + this.tempY);
              this.points[i].addPoint(this.tempX, this.tempY, this.tempZ);
              this.tempX = undefined;
              this.tempY = undefined;
            }
          }
        }
      }
    } else { // dual input mode (support only one curve, but it can accept arrays as the inputs)
      let vx = this.portX.getValue();
      if (vx != undefined) {
        if (Array.isArray(vx)) {
          this.points[0].setXPoints(vx);
        } else {
          if (vx != this.points[0].getLatestX()) { // TODO: Not a reliable way to store x and y at the same time
            this.tempX = vx;
          }
        }
      }
      let vy = this.portY.getValue();
      if (vy != undefined) {
        if (Array.isArray(vy)) {
          this.points[0].setYPoints(vy);
        } else {
          if (vy != this.points[0].getLatestY()) { // TODO: Not a reliable way to store x and y at the same time
            this.tempY = vy;
          }
        }
      }
      let vz = this.portZ.getValue();
      if (vz != undefined) {
        if (Array.isArray(vz)) {
          this.points[0].setZPoints(vz);
        } else {
          if (vy != this.points[0].getLatestZ()) { // TODO: Not a reliable way to store x and y at the same time
            this.tempZ = vz;
          }
        }
      }
      // console.log(this.tempX + "," + this.tempY);
      if (this.tempX != undefined && this.tempY != undefined && this.tempZ != undefined) {
        this.points[0].addPoint(this.tempX, this.tempY, this.tempZ);
        this.tempX = undefined;
        this.tempY = undefined;
        this.tempZ = undefined;
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 10;
    this.spaceMargin.bottom = 40;
    this.spaceMargin.left = 60;
    this.spaceMargin.right = 16;
    if (this.pointInput) {
      let dh = (this.height - this.barHeight) / (this.portPoints.length + 1);
      for (let i = 0; i < this.portPoints.length; i++) {
        this.portPoints[i].setY(this.barHeight + dh * (i + 1));
      }
    } else {
      let dh = (this.height - this.barHeight) / 4;
      this.portX.setY(this.barHeight + dh);
      this.portY.setY(this.barHeight + 2 * dh);
      this.portZ.setY(this.barHeight + 3 * dh);
    }
  }

  // toCanvas(): HTMLCanvasElement {
  //   return this.overlay;
  // }

}