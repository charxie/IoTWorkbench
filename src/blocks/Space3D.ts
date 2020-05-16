/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {flowchart} from "../Main";
import {Vector} from "../math/Vector";
import {LinePlot} from "./LinePlot";
import {Basic3DBlock} from "./Basic3DBlock";

export class Space3D extends Basic3DBlock {

  private portX: Port; // x, y, z ports are only used in the dual mode (which is the default)
  private portY: Port;
  private portZ: Port;
  private portPoints: Port[]; // only used in the point mode (multiple point streams are supported only in this mode)
  private portImages: Port[];
  private pointInput: boolean = false;
  private tempX: number; // temporarily store x, y, and z before pushing them into the point arrays
  private tempY: number;
  private tempZ: number;
  private legends: string[] = [];
  private showImagePorts: boolean = true;

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
    readonly boxSizeX: number;
    readonly boxSizeY: number;
    readonly boxSizeZ: number;
    readonly backgroundColor: string;
    readonly pointInput: boolean;
    readonly numberOfPoints: number;
    readonly legends: string[] = [];
    readonly lineTypes: string[] = [];
    readonly lineColors: string[] = [];
    readonly lineWidths: number[] = [];
    readonly dataSymbols: string[] = [];
    readonly dataSymbolRadii: number[] = [];
    readonly dataSymbolColors: string[] = [];
    readonly dataSymbolSpacings: number[] = [];
    readonly endSymbolRadii: any[] = [];
    readonly endSymbolConnections: string[] = [];
    readonly cameraPositionX: number;
    readonly cameraPositionY: number;
    readonly cameraPositionZ: number;
    readonly cameraRotationX: number;
    readonly cameraRotationY: number;
    readonly cameraRotationZ: number;
    readonly showImagePorts: boolean;

    constructor(g: Space3D) {
      this.name = g.name;
      this.uid = g.uid;
      this.x = g.x;
      this.y = g.y;
      this.width = g.width;
      this.height = g.height;
      this.xAxisLabel = g.getXAxisLabel();
      this.yAxisLabel = g.getYAxisLabel();
      this.zAxisLabel = g.getZAxisLabel();
      this.boxSizeX = g.view.getBoxSizeX();
      this.boxSizeY = g.view.getBoxSizeY();
      this.boxSizeZ = g.view.getBoxSizeZ();
      this.backgroundColor = g.getBackgroundColor();
      this.pointInput = g.pointInput;
      this.numberOfPoints = g.getNumberOfPoints();
      this.legends = [...g.legends];
      let p = <LinePlot>g.view;
      this.lineTypes = [...p.lineTypes];
      this.lineColors = [...p.lineColors];
      this.lineWidths = [...p.lineWidths];
      this.dataSymbols = [...p.dataSymbols];
      this.dataSymbolRadii = [...p.dataSymbolRadii];
      this.dataSymbolColors = [...p.dataSymbolColors];
      this.dataSymbolSpacings = [...p.dataSymbolSpacings];
      this.endSymbolRadii = [...p.endSymbolRadii];
      this.endSymbolConnections = [...p.endSymbolConnections];
      this.cameraPositionX = p.getCameraPositionX();
      this.cameraPositionY = p.getCameraPositionY();
      this.cameraPositionZ = p.getCameraPositionZ();
      this.cameraRotationX = p.getCameraRotationX();
      this.cameraRotationY = p.getCameraRotationY();
      this.cameraRotationZ = p.getCameraRotationZ();
      this.showImagePorts = g.showImagePorts;
    }
  };

  constructor(iconic: boolean, uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(iconic, uid, name, x, y, width, height);
    this.color = "#A78ECA";
    let dh = (this.height - this.barHeight) / 4;
    this.portX = new Port(this, true, "X", 0, this.barHeight + dh, false)
    this.portY = new Port(this, true, "Y", 0, this.barHeight + 2 * dh, false)
    this.portZ = new Port(this, true, "Z", 0, this.barHeight + 3 * dh, false)
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portZ);
    this.legends.push("A");
    if (!iconic) {
      this.view = new LinePlot();
      let p = <LinePlot>this.view;
      p.pushPointArray();
      p.lineTypes.push("Solid");
      p.lineColors.push("black");
      p.lineWidths.push(1);
      p.dataSymbols.push("None");
      p.dataSymbolRadii.push(3);
      p.dataSymbolColors.push("white");
      p.dataSymbolSpacings.push(1);
      p.endSymbolRadii.push(0);
      this.overlay = p.getDomElement();
      this.overlay.tabIndex = 0;
      this.overlay.style.position = "absolute";
      document.getElementById("block-view-wrapper").append(this.overlay);
      //this.overlay.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
      this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
      this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
    }
  }

  getCopy(): Block {
    let copy = new Space3D(false, "Space3D #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.setXAxisLabel(this.getXAxisLabel());
    copy.setYAxisLabel(this.getYAxisLabel());
    copy.setZAxisLabel(this.getZAxisLabel());
    copy.setBackgroundColor(this.getBackgroundColor());
    copy.setPointInput(this.pointInput);
    copy.setNumberOfPoints(this.getNumberOfPoints());
    copy.showImagePorts = this.showImagePorts;
    copy.legends = [...this.legends];
    let p = <LinePlot>copy.view;
    let q = <LinePlot>this.view;
    p.lineColors = [...q.lineColors];
    p.lineTypes = [...q.lineTypes];
    p.lineWidths = [...q.lineWidths];
    p.dataSymbols = [...q.dataSymbols];
    p.dataSymbolRadii = [...q.dataSymbolRadii];
    p.dataSymbolColors = [...q.dataSymbolColors];
    p.dataSymbolSpacings = [...q.dataSymbolSpacings];
    p.endSymbolRadii = [...q.endSymbolRadii];
    p.endSymbolConnections = [...q.endSymbolConnections];
    copy.setBoxSizes(this.getBoxSizeX(), this.getBoxSizeY(), this.getBoxSizeZ());
    copy.locateOverlay();
    return copy;
  }

  getPointPorts(): Port[] {
    return this.portPoints;
  }

  reset(): void {
    super.reset();
    this.erase();
  }

  erase(): void {
    (<LinePlot>this.view).erase();
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
      if (this.portImages == undefined) {
        this.portImages = [];
        this.portImages.push(new Port(this, true, "AI", 0, this.barHeight + 2 * dh, false));
      }
      for (let p of this.portImages) {
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
      let v = <LinePlot>this.view;
      if (numberOfPoints > this.portPoints.length) { // increase data ports
        // test if the line and symbol properties have already been set (this happens when loading an existing state)
        let notSet = this.legends.length == this.portPoints.length;
        for (let i = 0; i < numberOfPoints; i++) {
          if (i >= this.portPoints.length) {
            let p = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i), 0, 0, false);
            this.portPoints.push(p);
            this.ports.push(p);
            v.pushPointArray();
            let pi = new Port(this, true, String.fromCharCode("A".charCodeAt(0) + i) + "I", 0, 0, false);
            this.portImages.push(pi);
            this.ports.push(pi);
            if (notSet) {
              this.legends.push(p.getUid());
            }
          }
        }
      } else if (numberOfPoints < this.portPoints.length) { // decrease data ports
        for (let i = this.portPoints.length - 1; i >= numberOfPoints; i--) {
          this.portPoints.pop();
          v.popPointArray();
          flowchart.removeConnectorsToPort(this.ports.pop());
          this.portImages.pop();
          flowchart.removeConnectorsToPort(this.ports.pop());
          this.legends.pop();
        }
      }
      let n = this.portPoints.length;
      this.legends.length = n;
      v.setPointArrayLength(n);
      v.lineTypes.length = n;
      v.lineColors.length = n;
      v.lineWidths.length = n;
      v.dataSymbols.length = n;
      v.dataSymbolRadii.length = n;
      v.dataSymbolColors.length = n;
      v.dataSymbolSpacings.length = n;
      v.endSymbolRadii.length = n;
      v.endSymbolConnections.length = n;
      this.refreshView();
    }
  }

  getNumberOfPoints(): number {
    return this.pointInput ? this.portPoints.length : 1;
  }

  setShowImagePorts(showImagePorts: boolean): void {
    this.showImagePorts = showImagePorts;
  }

  getShowImagePorts(): boolean {
    return this.showImagePorts;
  }

  isImagePortConnected(): boolean {
    if (this.portImages) {
      for (let p of this.portImages) {
        if (flowchart.getConnectorWithInput(p) !== null) return true;
      }
    }
    return false;
  }

  setLegends(legends: string[]): void {
    this.legends = legends;
  }

  getLegends(): string[] {
    return this.legends;
  }

  setLegend(i: number, legend: string): void {
    this.legends[i] = legend;
  }

  getLegend(i: number): string {
    return this.legends[i];
  }

  setLineColors(lineColors: string[]): void {
    for (let i = 0; i < lineColors.length; i++) {
      (<LinePlot>this.view).setLineColor(i, lineColors[i]);
    }
  }

  getLineColors(): string[] {
    return (<LinePlot>this.view).lineColors;
  }

  setLineColor(i: number, lineColor: string): void {
    (<LinePlot>this.view).setLineColor(i, lineColor);
  }

  getLineColor(i: number): string {
    return (<LinePlot>this.view).lineColors[i];
  }

  setLineTypes(lineTypes: string[]): void {
    for (let i = 0; i < lineTypes.length; i++) {
      (<LinePlot>this.view).setLineType(i, lineTypes[i]);
    }
  }

  getLineTypes(): string[] {
    return (<LinePlot>this.view).lineTypes;
  }

  setLineType(i: number, lineType: string): void {
    (<LinePlot>this.view).setLineType(i, lineType);
  }

  getLineType(i: number): string {
    return (<LinePlot>this.view).lineTypes[i];
  }

  setLineWidths(lineWidths: number[]): void {
    for (let i = 0; i < lineWidths.length; i++) {
      (<LinePlot>this.view).setLineWidth(i, lineWidths[i]);
    }
  }

  getLineWidths(): number[] {
    return (<LinePlot>this.view).lineWidths;
  }

  setLineWidth(i: number, lineWidth: number): void {
    (<LinePlot>this.view).setLineWidth(i, lineWidth);
  }

  getLineWidth(i: number): number {
    return (<LinePlot>this.view).lineWidths[i];
  }

  setDataSymbols(dataSymbols: string[]): void {
    for (let i = 0; i < dataSymbols.length; i++) {
      (<LinePlot>this.view).setDataSymbol(i, dataSymbols[i]);
    }
  }

  getDataSymbols(): string[] {
    return (<LinePlot>this.view).dataSymbols;
  }

  setDataSymbol(i: number, dataSymbol: string): void {
    (<LinePlot>this.view).setDataSymbol(i, dataSymbol);
  }

  getDataSymbol(i: number): string {
    return (<LinePlot>this.view).dataSymbols[i];
  }

  setDataSymbolColors(dataSymbolColors: string[]): void {
    for (let i = 0; i < dataSymbolColors.length; i++) {
      (<LinePlot>this.view).setDataSymbolColor(i, dataSymbolColors[i]);
    }
  }

  getDataSymbolColors(): string[] {
    return (<LinePlot>this.view).dataSymbolColors;
  }

  setDataSymbolColor(i: number, dataSymbolColor: string): void {
    (<LinePlot>this.view).setDataSymbolColor(i, dataSymbolColor);
  }

  getDataSymbolColor(i: number): string {
    return (<LinePlot>this.view).dataSymbolColors[i];
  }

  setDataSymbolSpacings(dataSymbolSpacings: number[]): void {
    for (let i = 0; i < dataSymbolSpacings.length; i++) {
      (<LinePlot>this.view).setDataSymbolSpacing(i, dataSymbolSpacings[i]);
    }
  }

  getDataSymbolSpacings(): number[] {
    return (<LinePlot>this.view).dataSymbolSpacings;
  }

  setDataSymbolSpacing(i: number, dataSymbolSpacing: number): void {
    (<LinePlot>this.view).setDataSymbolSpacing(i, dataSymbolSpacing);
  }

  getDataSymbolSpacing(i: number): number {
    return (<LinePlot>this.view).dataSymbolSpacings[i];
  }

  setDataSymbolRadii(dataSymbolRadii: number[]): void {
    for (let i = 0; i < dataSymbolRadii.length; i++) {
      (<LinePlot>this.view).setDataSymbolRadius(i, dataSymbolRadii[i]);
    }
  }

  getDataSymbolRadii(): number[] {
    return (<LinePlot>this.view).dataSymbolRadii;
  }

  setDataSymbolRadius(i: number, dataSymbolRadius: number): void {
    (<LinePlot>this.view).setDataSymbolRadius(i, dataSymbolRadius);
  }

  getDataSymbolRadius(i: number): number {
    return (<LinePlot>this.view).dataSymbolRadii[i];
  }

  setEndSymbolRadii(endSymbolRadii: number[]): void {
    for (let i = 0; i < endSymbolRadii.length; i++) {
      (<LinePlot>this.view).setEndSymbolRadius(i, endSymbolRadii[i]);
    }
  }

  getEndSymbolRadii(): number[] {
    return (<LinePlot>this.view).endSymbolRadii;
  }

  setEndSymbolRadius(i: number, endSymbolRadius: number): void {
    (<LinePlot>this.view).setEndSymbolRadius(i, endSymbolRadius);
  }

  getEndSymbolRadius(i: number): number {
    return (<LinePlot>this.view).endSymbolRadii[i];
  }

  setEndSymbolConnections(endSymbolConnections: string[]): void {
    for (let i = 0; i < endSymbolConnections.length; i++) {
      (<LinePlot>this.view).setEndSymbolConnection(i, endSymbolConnections[i]);
    }
  }

  getEndSymbolConnections(): string[] {
    return (<LinePlot>this.view).endSymbolConnections;
  }

  setEndSymbolConnection(i: number, endSymbolConnection: string): void {
    (<LinePlot>this.view).setEndSymbolConnection(i, endSymbolConnection);
  }

  getEndSymbolConnection(i: number): string {
    return (<LinePlot>this.view).endSymbolConnections[i];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 2;
      ctx.fillText("3D", this.viewWindow.x + this.viewWindow.width / 2 - ctx.measureText("3D").width / 2, this.viewWindow.y + this.viewWindow.height / 2 + h / 2);
    } else {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let title = this.name + " (" + (<LinePlot>this.view).getDataPoints() + " points)";
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }
  }

  drawPorts(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    for (let p of this.ports) {
      if (this.showImagePorts) {
        p.draw(ctx, this.iconic);
      } else {
        if (this.portImages === undefined || (this.portImages !== undefined && this.portImages.indexOf(p) === -1)) {
          p.draw(ctx, this.iconic);
        }
      }
    }
  }

  // return all the data points in a coordinate array
  getFlatData(): number[][] {
    return (<LinePlot>this.view).getFlatData();
  }

  updateModel(): void {
    if (this.pointInput) { // point input mode (support multiple curves, but it doesn't accept array as inputs)
      if (this.portPoints != undefined) {
        for (let i = 0; i < this.portPoints.length; i++) {
          let vp = this.portPoints[i].getValue();
          if (vp != undefined) {
            let is2DArray = Array.isArray(vp) && vp[0].constructor === Array;
            if (is2DArray) {
              (<LinePlot>this.view).clearDataPoints(i);
              for (let k = 0; k < vp.length; k++) {
                if (vp[k].length === 3) {
                  (<LinePlot>this.view).addPoint(i, vp[k][0], vp[k][1], vp[k][2]);
                } else if (vp[k].length === 2) {
                  (<LinePlot>this.view).addPoint(i, vp[k][0], vp[k][1], 0);
                } else if (vp[k].length === 1) {
                  (<LinePlot>this.view).addPoint(i, vp[k][0], 0, 0);
                }
              }
            } else {
              if (vp instanceof Vector) {
                vp = vp.getValues();
              }
              if (Array.isArray(vp) && vp.length > 1) {
                let v = (<LinePlot>this.view).getLatestPoint(i);
                if ((v !== null && (vp[0] !== v.x || vp[1] !== v.y || vp[2] !== v.z)) || v === null) {
                  this.tempX = vp[0];
                  this.tempY = vp[1];
                  this.tempZ = vp[2];
                }
              }
              if (this.tempX != undefined && this.tempY != undefined && this.tempZ != undefined) {
                //console.log(i+"="+this.portPoints[i].getUid()+","+this.tempX + "," + this.tempY);
                (<LinePlot>this.view).addPoint(i, this.tempX, this.tempY, this.tempZ);
                this.tempX = undefined;
                this.tempY = undefined;
                this.tempZ = undefined;
              }
            }
          }
        }
      }
      if (this.portImages != undefined) {
        for (let i = 0; i < this.portImages.length; i++) {
          (<LinePlot>this.view).setEndSymbolTexture(i, this.portImages[i].getValue());
        }
      }
    } else { // trio input mode (support only one curve, but it can accept arrays as the inputs)
      let vx = this.portX.getValue();
      let vy = this.portY.getValue();
      let vz = this.portZ.getValue();
      if (vx !== undefined && vy !== undefined && vz !== undefined) {
        let v = (<LinePlot>this.view).getLatestPoint(0);
        if (!Array.isArray(vx)) {
          if (!v || vx != v.x) { // TODO: Not a reliable way to store x and y at the same time
            this.tempX = vx;
          }
        }
        if (!Array.isArray(vy)) {
          if (!v || vy != v.y) { // TODO: Not a reliable way to store x and y at the same time
            this.tempY = vy;
          }
        }
        if (!Array.isArray(vz)) {
          if (!v || vy != v.z) { // TODO: Not a reliable way to store x and y at the same time
            this.tempZ = vz;
          }
        }
        // console.log(this.tempX + "," + this.tempY);
        if (this.tempX != undefined && this.tempY != undefined && this.tempZ != undefined) {
          (<LinePlot>this.view).addPoint(0, this.tempX, this.tempY, this.tempZ);
          this.tempX = undefined;
          this.tempY = undefined;
          this.tempZ = undefined;
        } else {
          if (Array.isArray(vx) && Array.isArray(vy) && Array.isArray(vz)) {
            (<LinePlot>this.view).setData(0, vx, vy, vz);
          }
        }
      }
    }
    this.view.render();
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 11;
    this.spaceMargin.bottom = 10;
    this.spaceMargin.left = 24;
    this.spaceMargin.right = 10;
    if (this.pointInput) {
      if (this.showImagePorts) {
        let dh = (this.height - this.barHeight) / (2 * this.portPoints.length + 1);
        for (let i = 0; i < this.portPoints.length; i++) {
          this.portPoints[i].setY(this.barHeight + dh * (2 * i + 1));
          this.portImages[i].setY(this.barHeight + dh * (2 * i + 2));
        }
      } else {
        let dh = (this.height - this.barHeight) / (this.portPoints.length + 1);
        for (let i = 0; i < this.portPoints.length; i++) {
          this.portPoints[i].setY(this.barHeight + dh * (i + 1));
        }
      }
    } else {
      let dh = (this.height - this.barHeight) / 4;
      this.portX.setY(this.barHeight + dh);
      this.portY.setY(this.barHeight + 2 * dh);
      this.portZ.setY(this.barHeight + 3 * dh);
    }
  }

}
