/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {closeAllContextMenus, flowchart, isNumber} from "../Main";
import {Vector} from "../math/Vector";
import {Point3DArray} from "./Point3DArray";
import {LinePlot} from "./LinePlot";

export class Space3D extends Block {

  private portX: Port; // x, y, z ports are only used in the dual mode (which is the default)
  private portY: Port;
  private portZ: Port;
  private portPoints: Port[]; // only used in the point mode (multiple point streams are supported only in this mode)
  private pointInput: boolean = false;
  private points: Point3DArray[] = [];
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
  private overlay: HTMLCanvasElement;
  private plot: LinePlot;

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
    readonly cameraPositionX: number;
    readonly cameraPositionY: number;
    readonly cameraPositionZ: number;
    readonly cameraRotationX: number;
    readonly cameraRotationY: number;
    readonly cameraRotationZ: number;

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
      this.cameraPositionX = g.plot.getCameraPositionX();
      this.cameraPositionY = g.plot.getCameraPositionY();
      this.cameraPositionZ = g.plot.getCameraPositionZ();
      this.cameraRotationX = g.plot.getCameraRotationX();
      this.cameraRotationY = g.plot.getCameraRotationY();
      this.cameraRotationZ = g.plot.getCameraRotationZ();
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
    this.dataSymbols.push("None");
    this.dataSymbolRadii.push(3);
    this.dataSymbolColors.push("white");
    this.dataSymbolSpacings.push(1);
    this.endSymbolRadii.push(0);
    this.plot = new LinePlot();
    this.overlay = this.plot.getDomElement();
    this.overlay.tabIndex = 0;
    this.overlay.style.position = "absolute";
    document.getElementById("block-view-wrapper").append(this.overlay);
    //this.overlay.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
    this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
    this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
  }

  getCopy(): Block {
    let copy = new Space3D("Space3D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
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
    copy.setWidth(this.getWidth());
    copy.setHeight(this.getHeight());
    copy.plot.render();
    return copy;
  }

  private overlayMouseDown(e: MouseEvent): void {
    if (this.overlay !== undefined) {
      closeAllContextMenus();
      if (flowchart.blockView.getSelectedBlock() !== null) {
        flowchart.blockView.getSelectedBlock().setSelected(false);
      }
      this.setSelected(true);
      flowchart.blockView.setSelectedBlock(this);
      flowchart.blockView.clearResizeName();
      flowchart.blockView.requestDraw();
    }
  }

  private overlayOpenContextMenu(e: MouseEvent): void {
    if (this.overlay !== undefined) {
      if (Util.getSelectedText() === "") {
        flowchart.blockView.openContextMenu(e);
      }
      // if text is selected, use default
    }
  }

  private overlayKeyUp(e: KeyboardEvent): void {
    if (this.overlay !== undefined) {
      flowchart.blockView.keyUp(e);
    }
  }

  locateOverlay(): void {
    this.spaceWindow.x = this.x + this.spaceMargin.left;
    this.spaceWindow.y = this.y + this.barHeight + this.spaceMargin.top;
    this.spaceWindow.width = this.width - this.spaceMargin.left - this.spaceMargin.right;
    this.spaceWindow.height = this.height - this.barHeight - this.spaceMargin.top - this.spaceMargin.bottom;
    this.setX(this.getX());
    this.setY(this.getY());
    this.setWidth(this.getWidth());
    this.setHeight(this.getHeight());
    this.plot.render();
  }

  setCameraPosition(px: number, py: number, pz: number, rx: number, ry: number, rz: number): void {
    this.plot.setCameraPosition(px, py, pz, rx, ry, rz);
  }

  setX(x: number): void {
    super.setX(x);
    if (this.overlay !== undefined) {
      this.overlay.style.left = this.spaceWindow.x + "px";
    }
  }

  setY(y: number): void {
    super.setY(y);
    if (this.overlay !== undefined) {
      this.overlay.style.top = this.spaceWindow.y + "px";
    }
  }

  setWidth(width: number): void {
    super.setWidth(width);
    if (this.overlay !== undefined) {
      this.overlay.style.width = this.spaceWindow.width + "px";
    }
  }

  setHeight(height: number): void {
    super.setHeight(height);
    if (this.overlay !== undefined) {
      this.overlay.style.height = this.spaceWindow.height + "px";
    }
  }

  translateBy(dx: number, dy: number): void {
    super.translateBy(dx, dy);
    if (this.overlay !== undefined) {
      this.overlay.style.left = this.spaceWindow.x + "px";
      this.overlay.style.top = this.spaceWindow.y + "px";
    }
  }

  setRect(rect: Rectangle): void {
    super.setRect(rect);
    if (this.overlay !== undefined) {
      this.overlay.style.left = this.spaceWindow.x + "px";
      this.overlay.style.top = this.spaceWindow.y + "px";
      this.overlay.style.width = this.spaceWindow.width + "px";
      this.overlay.style.height = this.spaceWindow.height + "px";
    }
  }

  destroy(): void {
    if (this.overlay !== undefined) {
      document.getElementById("block-view-wrapper").removeChild(this.overlay);
    }
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
              this.dataSymbols.push("None");
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
    this.plot.setBackgroundColor(spaceWindowColor);
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
    for (let i = 0; i < lineColors.length; i++) {
      this.plot.setLineColor(i, lineColors[i]);
    }
  }

  getLineColors(): string[] {
    return [...this.lineColors];
  }

  setLineColor(i: number, lineColor: string): void {
    this.lineColors[i] = lineColor;
    this.plot.setLineColor(i, lineColor);
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
      let title = this.name + " (" + this.plot.getDataPoints() + " points)";
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
      if (this.pointInput && this.portPoints.length > 1) {
        this.drawLegends(ctx);
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
              if (vp[0] != this.points[i].getLatestX() || vp[1] != this.points[i].getLatestY() || vp[2] != this.points[i].getLatestZ()) {
                this.tempX = vp[0];
                this.tempY = vp[1];
                this.tempZ = vp[2];
              }
            }
            if (this.tempX != undefined && this.tempY != undefined && this.tempZ != undefined) {
              //console.log(i+"="+this.portPoints[i].getUid()+","+this.tempX + "," + this.tempY);
              this.points[i].addPoint(this.tempX, this.tempY, this.tempZ);
              this.tempX = undefined;
              this.tempY = undefined;
              this.tempZ = undefined;
            }
          }
        }
      }
    } else { // trio input mode (support only one curve, but it can accept arrays as the inputs)
      let vx = this.portX.getValue();
      let vy = this.portY.getValue();
      let vz = this.portZ.getValue();
      if (vx !== undefined && vy !== undefined && vz !== undefined) {
        if (!Array.isArray(vx)) {
          if (vx != this.points[0].getLatestX()) { // TODO: Not a reliable way to store x and y at the same time
            this.tempX = vx;
          }
        }
        if (!Array.isArray(vy)) {
          if (vy != this.points[0].getLatestY()) { // TODO: Not a reliable way to store x and y at the same time
            this.tempY = vy;
          }
        }
        if (!Array.isArray(vz)) {
          if (vy != this.points[0].getLatestZ()) { // TODO: Not a reliable way to store x and y at the same time
            this.tempZ = vz;
          }
        }
        // console.log(this.tempX + "," + this.tempY);
        if (this.tempX != undefined && this.tempY != undefined && this.tempZ != undefined) {
          this.points[0].addPoint(this.tempX, this.tempY, this.tempZ);
          this.tempX = undefined;
          this.tempY = undefined;
          this.tempZ = undefined;
        } else {
          if (Array.isArray(vx) && Array.isArray(vy) && Array.isArray(vz)) {
            this.plot.setData(0, vx, vy, vz);
          }
        }
      }
    }
    this.plot.render();
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

  toCanvas(): HTMLCanvasElement {
    return this.overlay;
  }

}
