/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {flowchart} from "../Main";
import {SurfacePlot} from "./SurfacePlot";
import {Basic3DBlock} from "./Basic3DBlock";

export class Surface3D extends Basic3DBlock {

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
  private scaleType: string = "Linear";
  private colorScheme: string = "Turbo";

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
    readonly boxSize: number;
    readonly backgroundColor: string;
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
      this.xAxisLabel = g.getXAxisLabel();
      this.yAxisLabel = g.getYAxisLabel();
      this.zAxisLabel = g.getZAxisLabel();
      this.boxSize = g.view.getBoxSize();
      this.backgroundColor = g.getBackgroundColor();
      this.scaleType = g.scaleType;
      this.colorScheme = g.colorScheme;
      this.tripleArrayInput = g.tripleArrayInput;
      this.cameraPositionX = g.view.getCameraPositionX();
      this.cameraPositionY = g.view.getCameraPositionY();
      this.cameraPositionZ = g.view.getCameraPositionZ();
      this.cameraRotationX = g.view.getCameraRotationX();
      this.cameraRotationY = g.view.getCameraRotationY();
      this.cameraRotationZ = g.view.getCameraRotationZ();
    }
  };

  constructor(iconic: boolean, uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(iconic, uid, name, x, y, width, height);
    this.color = "#FEFE8A";
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
    this.marginX = 25;
    if (!iconic) {
      this.view = new SurfacePlot();
      this.overlay = this.view.getDomElement();
      this.overlay.tabIndex = 0;
      this.overlay.style.position = "absolute";
      document.getElementById("block-view-wrapper").append(this.overlay);
      //this.overlay.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
      this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
      this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
    }
  }

  getCopy(): Block {
    let copy = new Surface3D(false, "Surface3D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.setXAxisLabel(this.getXAxisLabel());
    copy.setYAxisLabel(this.getYAxisLabel());
    copy.setZAxisLabel(this.getZAxisLabel());
    copy.setBackgroundColor(this.getBackgroundColor());
    copy.scaleType = this.scaleType;
    copy.colorScheme = this.colorScheme;
    copy.setWidth(this.getWidth());
    copy.setHeight(this.getHeight());
    copy.setTripleArrayInput(this.getTripleArrayInput());
    copy.view.render();
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

  setScaleType(scaleType: string): void {
    this.scaleType = scaleType;
  }

  getScaleType(): string {
    return this.scaleType;
  }

  setColorScheme(colorScheme: string): void {
    this.colorScheme = colorScheme;
    (<SurfacePlot>this.view).setInterpolateColorScheme(colorScheme);
  }

  getColorScheme(): string {
    return this.colorScheme;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 4;
      ctx.fillText("3D", this.viewWindow.x + this.viewWindow.width / 2 - ctx.measureText("3D").width / 2, this.viewWindow.y + this.viewWindow.height / 2 + h / 2);
    } else {
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
  }

  updateModel(): void {
    if (this.tripleArrayInput) {
      this.nu = this.portNU.getValue();
      this.nv = this.portNV.getValue();
      this.dataX = this.portX.getValue();
      this.dataY = this.portY.getValue();
      this.dataZ = this.portZ.getValue();
      if (this.nu !== undefined && this.nv !== undefined && this.dataX !== undefined && this.dataY !== undefined && this.dataZ !== undefined) {
        (<SurfacePlot>this.view).setXyzData(this.nu, this.nv, this.dataX, this.dataY, this.dataZ, this.scaleType);
        this.view.render();
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
        (<SurfacePlot>this.view).setZData(this.x0, this.y0, this.dx, this.dy, this.nu, this.nv, this.data, this.scaleType);
        this.view.render();
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 14;
    this.spaceMargin.bottom = 10;
    this.spaceMargin.left = 36;
    this.spaceMargin.right = 10;
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

}
