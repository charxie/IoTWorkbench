/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {closeAllContextMenus, flowchart} from "../Main";
import {SurfacePlot} from "./SurfacePlot";

export class Surface3D extends Block {

  private tripleArrayInput: boolean;
  // z array input
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
  private nu: number;
  private y0: number;
  private dy: number;
  private nv: number;
  // x,y,z array input
  private portX: Port;
  private portY: Port;
  private portZ: Port;
  private portNU: Port;
  private portNV: Port;
  private dataX: number[];
  private dataY: number[];
  private dataZ: number[];
  private xAxisLabel: string = "x";
  private yAxisLabel: string = "y";
  private zAxisLabel: string = "z";
  private viewWindowColor: string = "white";
  private viewWindow: Rectangle;
  private barHeight: number;
  private scaleType: string = "Linear";
  private colorScheme: string = "Turbo";
  private readonly viewWindowMargin = {
    left: <number>6,
    right: <number>2,
    top: <number>6,
    bottom: <number>3
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
    readonly viewWindowColor: string;
    readonly scaleType: string;
    readonly colorScheme: string;
    readonly cameraPositionX: number;
    readonly cameraPositionY: number;
    readonly cameraPositionZ: number;
    readonly cameraRotationX: number;
    readonly cameraRotationY: number;
    readonly cameraRotationZ: number;
    readonly tripleArrayInput: boolean;

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
      this.viewWindowColor = g.viewWindowColor;
      this.scaleType = g.scaleType;
      this.colorScheme = g.colorScheme;
      this.tripleArrayInput = g.tripleArrayInput;
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
    this.color = "#FEFE8A";
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
    this.marginX = 25;
    this.plot = new SurfacePlot();
    this.overlay = this.plot.getDomElement();
    this.overlay.tabIndex = 0;
    this.overlay.style.position = "absolute";
    document.getElementById("block-view-wrapper").append(this.overlay);
    //this.overlay.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
    this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
    this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
  }

  getCopy(): Block {
    let copy = new Surface3D("Surface3D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.xAxisLabel = this.xAxisLabel;
    copy.yAxisLabel = this.yAxisLabel;
    copy.zAxisLabel = this.zAxisLabel;
    copy.viewWindowColor = this.viewWindowColor;
    copy.scaleType = this.scaleType;
    copy.colorScheme = this.colorScheme;
    copy.setWidth(this.getWidth());
    copy.setHeight(this.getHeight());
    copy.plot.render();
    return copy;
  }

  setTripleArrayInput(tripleArrayInput: boolean): void {
    if (this.tripleArrayInput !== tripleArrayInput) {
      for (let p of this.ports) {
        flowchart.removeConnectorsToPort(p);
      }
      this.ports.length = 0;
      if (tripleArrayInput) {
        let dh = (this.height - this.barHeight) / 6;
        if (this.portX === undefined) this.portX = new Port(this, true, "X", 0, this.barHeight + dh, false)
        if (this.portY === undefined) this.portY = new Port(this, true, "Y", 0, this.barHeight + 2 * dh, false)
        if (this.portZ === undefined) this.portZ = new Port(this, true, "Z", 0, this.barHeight + 3 * dh, false)
        if (this.portNU === undefined) this.portNU = new Port(this, true, "NU", 0, this.barHeight + 4 * dh, false)
        if (this.portNV === undefined) this.portNV = new Port(this, true, "NV", 0, this.barHeight + 5 * dh, false)
        this.ports.push(this.portX);
        this.ports.push(this.portY);
        this.ports.push(this.portZ);
        this.ports.push(this.portNU);
        this.ports.push(this.portNV);
      } else {
        this.ports.push(this.portI);
        this.ports.push(this.portX0);
        this.ports.push(this.portDX);
        this.ports.push(this.portNX);
        this.ports.push(this.portY0);
        this.ports.push(this.portDY);
        this.ports.push(this.portNY);
      }
      this.tripleArrayInput = tripleArrayInput;
      this.refreshView();
    }
  }

  getTripleArrayInput(): boolean {
    return this.tripleArrayInput;
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
    this.viewWindow.x = this.x + this.viewWindowMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewWindowMargin.top;
    this.viewWindow.width = this.width - this.viewWindowMargin.left - this.viewWindowMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewWindowMargin.top - this.viewWindowMargin.bottom;
    this.setX(this.getX());
    this.setY(this.getY());
    this.setWidth(this.getWidth());
    this.setHeight(this.getHeight());
  }

  setCameraPosition(px: number, py: number, pz: number, rx: number, ry: number, rz: number): void {
    this.plot.setCameraPosition(px, py, pz, rx, ry, rz);
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
      let parent = document.getElementById("block-view-wrapper");
      if (parent.contains(this.overlay)) parent.removeChild(this.overlay);
    }
    this.plot.destroy();
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
  }

  resetViewAngle(): void {
    this.plot.resetViewAngle();
  }

  setScaleType(scaleType: string): void {
    this.scaleType = scaleType;
  }

  getScaleType(): string {
    return this.scaleType;
  }

  setColorScheme(colorScheme: string): void {
    this.colorScheme = colorScheme;
    this.plot.setInterpolateColorScheme(colorScheme);
  }

  getColorScheme(): string {
    return this.colorScheme;
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

  setViewWindowColor(viewWindowColor: string): void {
    this.viewWindowColor = viewWindowColor;
    this.plot.setBackgroundColor(viewWindowColor);
  }

  getViewWindowColor(): string {
    return this.viewWindowColor;
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
      let title;
      if (this.tripleArrayInput) {
        title = this.name + (this.dataZ === undefined ? "" : " (" + this.dataZ.length + " points)");
      } else {
        title = this.name + (this.data === undefined ? "" : " (" + this.data.length + " points)");
      }
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
    this.viewWindow.x = this.x + this.viewWindowMargin.left;
    this.viewWindow.y = this.y + this.barHeight + this.viewWindowMargin.top;
    this.viewWindow.width = this.width - this.viewWindowMargin.left - this.viewWindowMargin.right;
    this.viewWindow.height = this.height - this.barHeight - this.viewWindowMargin.top - this.viewWindowMargin.bottom;
    ctx.rect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
    ctx.fillStyle = this.viewWindowColor;
    ctx.fill();
    ctx.beginPath();
    ctx.rect(this.viewWindow.x - 3, this.viewWindow.y - 3, this.viewWindow.width + 2, this.viewWindow.height + 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.iconic ? 1 : 2;
    ctx.stroke();
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 4;
      ctx.fillText("3D", this.viewWindow.x + this.viewWindow.width / 2 - ctx.measureText("3D").width / 2, this.viewWindow.y + this.viewWindow.height / 2 + h / 2);
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

  private drawAxisLabels(ctx: CanvasRenderingContext2D): void {
    ctx.font = "italic 15px Times New Roman";
    ctx.fillStyle = "black";
    let horizontalAxisY = this.height - this.viewWindowMargin.bottom;
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
    if (this.tripleArrayInput) {
      this.nu = this.portNU.getValue();
      this.nv = this.portNV.getValue();
      this.dataX = this.portX.getValue();
      this.dataY = this.portY.getValue();
      this.dataZ = this.portZ.getValue();
      if (this.nu !== undefined && this.nv !== undefined && this.dataX !== undefined && this.dataY !== undefined && this.dataZ !== undefined) {
        this.plot.setXyzData(this.nu, this.nv, this.dataX, this.dataY, this.dataZ, this.scaleType);
        this.plot.render();
      }
    } else {
      this.data = this.portI.getValue();
      this.x0 = this.portX0.getValue();
      this.dx = this.portDX.getValue();
      this.nu = this.portNX.getValue();
      this.y0 = this.portY0.getValue();
      this.dy = this.portDY.getValue();
      this.nv = this.portNY.getValue();
      if (this.x0 !== undefined && this.y0 !== undefined && this.dx !== undefined && this.dy !== undefined && this.nu !== undefined && this.nv !== undefined && this.data !== undefined) {
        this.plot.setZData(this.x0, this.y0, this.dx, this.dy, this.nu, this.nv, this.data, this.scaleType);
        this.plot.render();
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.viewWindowMargin.top = 14;
    this.viewWindowMargin.bottom = 10;
    this.viewWindowMargin.left = 36;
    this.viewWindowMargin.right = 10;
    if (this.tripleArrayInput) {
      let dh = (this.height - this.barHeight) / 6;
      this.portX.setY(this.barHeight + dh);
      this.portY.setY(this.barHeight + 2 * dh);
      this.portZ.setY(this.barHeight + 3 * dh);
      this.portNU.setY(this.barHeight + 4 * dh);
      this.portNV.setY(this.barHeight + 5 * dh);
    } else {
      let dh = (this.height - this.barHeight) / 8;
      this.portI.setY(this.barHeight + dh);
      this.portX0.setY(this.barHeight + 2 * dh);
      this.portDX.setY(this.barHeight + 3 * dh);
      this.portNX.setY(this.barHeight + 4 * dh);
      this.portY0.setY(this.barHeight + 5 * dh);
      this.portDY.setY(this.barHeight + 6 * dh);
      this.portNY.setY(this.barHeight + 7 * dh);
    }
  }

  toCanvas(): HTMLCanvasElement {
    return this.overlay;
  }

}
