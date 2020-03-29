/*
 * @author Charles Xie
 */

import * as d3 from 'd3';
import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {closeAllContextMenus, flowchart} from "../Main";
import {SurfacePlot} from "./SurfacePlot";

export class Surface3D extends Block {

  private portI: Port;
  private portX0: Port;
  private portDX: Port;
  private portNX: Port;
  private portY0: Port;
  private portDY: Port;
  private portNY: Port;
  private data: number[];
  private x0: number;
  private dx: number;
  private nx: number;
  private y0: number;
  private dy: number;
  private ny: number;
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private zAxisLabel: string = "z";
  private fieldWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private lineType: string;
  private lineColor: string;
  private lineNumber: number = 20;
  private scaleType: string = "Linear";
  private minimumColor: string = "rgb(0, 0, 0)";
  private maximumColor: string = "rgb(255, 255, 255)";
  private minimumRgb: number[] = [0, 0, 0];
  private maximumRgb: number[] = [255, 255, 255];
  private mouseOverX: number;
  private mouseOverY: number;
  private readonly spaceMargin = {
    left: <number>4,
    right: <number>3,
    top: <number>4,
    bottom: <number>4
  };
  private overlay: HTMLCanvasElement;
  private plot: SurfacePlot;

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
    readonly fieldWindowColor: string;
    readonly lineType: string;
    readonly lineColor: string;
    readonly lineNumber: number;
    readonly scaleType: string;
    readonly minimumColor: string;
    readonly maximumColor: string;

    constructor(g: Surface3D) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.xAxisLabel;
      this.yAxisLabel = g.yAxisLabel;
      this.zAxisLabel = g.zAxisLabel;
      this.fieldWindowColor = g.fieldWindowColor;
      this.lineColor = g.lineColor;
      this.lineType = g.lineType;
      this.lineNumber = g.lineNumber;
      this.scaleType = g.scaleType;
      this.minimumColor = g.minimumColor;
      this.maximumColor = g.maximumColor;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#88EEAA";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 8;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.portX0 = new Port(this, true, "X0", 0, this.barHeight + 2 * dh, false);
    this.portDX = new Port(this, true, "DX", 0, this.barHeight + 3 * dh, false);
    this.portNX = new Port(this, true, "NX", 0, this.barHeight + 4 * dh, false);
    this.portY0 = new Port(this, true, "Y0", 0, this.barHeight + 5 * dh, false);
    this.portDY = new Port(this, true, "DY", 0, this.barHeight + 6 * dh, false);
    this.portNY = new Port(this, true, "NY", 0, this.barHeight + 7 * dh, false);
    this.ports.push(this.portI);
    this.ports.push(this.portX0);
    this.ports.push(this.portDX);
    this.ports.push(this.portNX);
    this.ports.push(this.portY0);
    this.ports.push(this.portDY);
    this.ports.push(this.portNY);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
    this.lineType = "Solid";
    this.lineColor = "black";
    this.marginX = 25;
    this.plot = new SurfacePlot();
    this.overlay = this.plot.getDomElement();
    this.overlay.tabIndex = 0;
    this.overlay.style.position = "absolute";
    document.getElementById("block-view-wrapper").append(this.overlay);
    this.overlay.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
    this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
    this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
  }

  getCopy(): Block {
    let copy = new Surface3D("Surface3D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.zAxisLabel = this.zAxisLabel;
    copy.fieldWindowColor = this.fieldWindowColor;
    copy.lineColor = this.lineColor;
    copy.lineType = this.lineType;
    copy.lineNumber = this.lineNumber;
    copy.scaleType = this.scaleType;
    copy.minimumColor = this.minimumColor;
    copy.maximumColor = this.maximumColor;
    copy.minimumRgb = this.minimumRgb.slice();
    copy.maximumRgb = this.maximumRgb.slice()
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
    this.viewWindow.x = this.x + this.spaceMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.spaceMargin.top;
    this.viewWindow.width = this.width - this.spaceMargin.left - this.spaceMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.spaceMargin.top - this.spaceMargin.bottom;
    this.setX(this.getX());
    this.setY(this.getY());
    this.setWidth(this.getWidth());
    this.setHeight(this.getHeight());
  }

  setX(x: number): void {
    super.setX(x);
    if (this.overlay !== undefined) {
      this.overlay.style.left = this.viewWindow.x + "px";
    }
  }

  setY(y: number): void {
    super.setY(y);
    if (this.overlay !== undefined) {
      this.overlay.style.top = this.viewWindow.y + "px";
    }
  }

  setWidth(width: number): void {
    super.setWidth(width);
    if (this.overlay !== undefined) {
      this.overlay.style.width = this.viewWindow.width + "px";
    }
  }

  setHeight(height: number): void {
    super.setHeight(height);
    if (this.overlay !== undefined) {
      this.overlay.style.height = this.viewWindow.height + "px";
    }
  }

  translateBy(dx: number, dy: number): void {
    super.translateBy(dx, dy);
    if (this.overlay !== undefined) {
      this.overlay.style.left = this.viewWindow.x + "px";
      this.overlay.style.top = this.viewWindow.y + "px";
    }
  }

  setRect(rect: Rectangle): void {
    super.setRect(rect);
    if (this.overlay !== undefined) {
      this.overlay.style.left = this.viewWindow.x + "px";
      this.overlay.style.top = this.viewWindow.y + "px";
      this.overlay.style.width = this.viewWindow.width + "px";
      this.overlay.style.height = this.viewWindow.height + "px";
    }
  }

  destroy(): void {
    if (this.overlay !== undefined) {
      document.getElementById("block-view-wrapper").removeChild(this.overlay);
    }
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
  }

  setScaleType(scaleType: string): void {
    this.scaleType = scaleType;
  }

  getScaleType(): string {
    return this.scaleType;
  }

  setMinimumColor(minimumColor: string): void {
    this.minimumColor = minimumColor;
    this.minimumRgb.length = 0;
    if (Util.isHexColor(minimumColor)) {
      let c = Util.hexToRgb(minimumColor);
      this.minimumRgb.push(c.r);
      this.minimumRgb.push(c.g);
      this.minimumRgb.push(c.b);
    } else {
      let c = minimumColor.match(/\d+/g);
      if (c !== null) {
        for (let x of c) {
          this.minimumRgb.push(parseInt(x));
        }
      } else {
        let hex = Util.getHexColor(minimumColor);
        if (hex) {
          let a = Util.hexToRgb(hex);
          this.minimumRgb.push(a.r);
          this.minimumRgb.push(a.g);
          this.minimumRgb.push(a.b);
        }
      }
    }
  }

  getMinimumColor(): string {
    return this.minimumColor;
  }

  setMaximumColor(maximumColor: string): void {
    this.maximumColor = maximumColor;
    this.maximumRgb.length = 0;
    if (Util.isHexColor(maximumColor)) {
      let c = Util.hexToRgb(maximumColor);
      this.maximumRgb.push(c.r);
      this.maximumRgb.push(c.g);
      this.maximumRgb.push(c.b);
    } else {
      let c = maximumColor.match(/\d+/g);
      if (c !== null) {
        for (let x of c) {
          this.maximumRgb.push(parseInt(x));
        }
      } else {
        let hex = Util.getHexColor(maximumColor);
        if (hex) {
          let a = Util.hexToRgb(hex);
          this.maximumRgb.push(a.r);
          this.maximumRgb.push(a.g);
          this.maximumRgb.push(a.b);
        }
      }
    }
  }

  getMaximumColor(): string {
    return this.maximumColor;
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

  setFieldWindowColor(fieldWindowColor: string): void {
    this.fieldWindowColor = fieldWindowColor;
  }

  getFieldWindowColor(): string {
    return this.fieldWindowColor;
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

  setLineNumber(lineNumber: number): void {
    this.lineNumber = lineNumber;
  }

  getLineNumber(): number {
    return this.lineNumber;
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
      let title = this.name + (this.data === undefined ? "" : " (" + this.data.length + " points)");
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the space
    ctx.fillStyle = "#FDFFFD";
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.beginPath();
    this.viewWindow.x = this.x + this.spaceMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.spaceMargin.top;
    this.viewWindow.width = this.width - this.spaceMargin.left - this.spaceMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.spaceMargin.top - this.spaceMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.fieldWindowColor;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

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

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.spaceMargin.bottom;
    ctx.fillText(this.xAxisLabel, this.viewWindow.x + (this.viewWindow.width - ctx.measureText(this.xAxisLabel).width) / 2, this.y + horizontalAxisY + 30);
    ctx.save();
    ctx.translate(this.x + 35, this.viewWindow.y + (this.viewWindow.height + ctx.measureText(this.yAxisLabel).width) / 2 + 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(this.yAxisLabel, 0, 0);
    ctx.restore();
  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    this.data = this.portI.getValue();
    this.x0 = this.portX0.getValue();
    this.dx = this.portDX.getValue();
    this.nx = this.portNX.getValue();
    this.y0 = this.portY0.getValue();
    this.dy = this.portDY.getValue();
    this.ny = this.portNY.getValue();
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 10;
    this.spaceMargin.bottom = 40;
    this.spaceMargin.left = 70;
    this.spaceMargin.right = 16;
    let dh = (this.height - this.barHeight) / 8;
    this.portI.setY(this.barHeight + dh);
    this.portX0.setY(this.barHeight + 2 * dh);
    this.portDX.setY(this.barHeight + 3 * dh);
    this.portNX.setY(this.barHeight + 4 * dh);
    this.portY0.setY(this.barHeight + 5 * dh);
    this.portDY.setY(this.barHeight + 6 * dh);
    this.portNY.setY(this.barHeight + 7 * dh);
  }

  mouseMove(e: MouseEvent): void {
    this.setToolTip(e);
  }

  mouseDown(e: MouseEvent): boolean {
    this.setToolTip(e);
    return false;
  }

  private setToolTip(e: MouseEvent): void {
    if (this.data !== undefined) {
      // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
      let rect = flowchart.blockView.canvas.getBoundingClientRect();
      let kx = Math.round((e.clientX - rect.left - this.viewWindow.x) / this.viewWindow.width * this.nx);
      let ky = this.ny - Math.round((e.clientY - rect.top - this.viewWindow.y) / this.viewWindow.height * this.ny);
      if (kx >= 0 && kx < this.nx && ky >= 0 && ky < this.ny) {
        this.mouseOverX = this.x0 + kx * this.dx;
        this.mouseOverY = this.y0 + ky * this.dy;
      }
    }
    flowchart.blockView.requestDraw();
  }

}
