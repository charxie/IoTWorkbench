/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MolecularViewer} from "./MolecularViewer";
import {Basic3DBlock} from "./Basic3DBlock";
import {Rectangle} from "../math/Rectangle";

export class MolecularViewerBlock extends Basic3DBlock {

  private portI: Port; // initial conformation
  private portS: Port; // spin the view
  private portX: Port; // x, y, z ports are only used in the dual mode (which is the default)
  private portY: Port;
  private portZ: Port;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly boxSizeX: number;
    readonly boxSizeY: number;
    readonly boxSizeZ: number;
    readonly style: string;
    readonly controlType: string;
    readonly backgroundColor: string;
    readonly cameraPositionX: number;
    readonly cameraPositionY: number;
    readonly cameraPositionZ: number;
    readonly cameraRotationX: number;
    readonly cameraRotationY: number;
    readonly cameraRotationZ: number;
    readonly spin: boolean;

    constructor(m: MolecularViewerBlock) {
      this.name = m.name;
      this.uid = m.uid;
      this.x = m.x;
      this.y = m.y;
      this.width = m.width;
      this.height = m.height;
      this.boxSizeX = m.view.getBoxSizeX();
      this.boxSizeY = m.view.getBoxSizeY();
      this.boxSizeZ = m.view.getBoxSizeZ();
      this.style = m.getStyle();
      this.controlType = m.view.getControlType();
      this.backgroundColor = m.getBackgroundColor();
      this.cameraPositionX = m.view.getCameraPositionX();
      this.cameraPositionY = m.view.getCameraPositionY();
      this.cameraPositionZ = m.view.getCameraPositionZ();
      this.cameraRotationX = m.view.getCameraRotationX();
      this.cameraRotationY = m.view.getCameraRotationY();
      this.cameraRotationZ = m.view.getCameraRotationZ();
      this.spin = (<MolecularViewer>m.view).getSpin();
    }
  };

  constructor(iconic: boolean, uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(iconic, uid, name, x, y, width, height);
    this.color = "#778EAA";
    let dh = (this.height - this.barHeight) / 6;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.portS = new Port(this, true, "S", 0, this.barHeight + 2 * dh, false)
    this.portX = new Port(this, true, "X", 0, this.barHeight + 3 * dh, false)
    this.portY = new Port(this, true, "Y", 0, this.barHeight + 4 * dh, false)
    this.portZ = new Port(this, true, "Z", 0, this.barHeight + 5 * dh, false)
    this.ports.push(this.portI);
    this.ports.push(this.portS);
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portZ);
    if (!iconic) {
      this.view = new MolecularViewer();
      this.overlay = this.view.getDomElement();
      this.overlay.tabIndex = 0;
      this.overlay.style.position = "absolute";
      document.getElementById("block-view-wrapper").append(this.overlay);
      this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
      this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
    }
  }

  getCopy(): Block {
    let copy = new MolecularViewerBlock(false, "Molecular Viewer Block #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.setBackgroundColor(this.getBackgroundColor());
    copy.setStyle(this.getStyle());
    copy.setBoxSizes(this.getBoxSizeX(), this.getBoxSizeY(), this.getBoxSizeZ());
    copy.locateOverlay();
    return copy;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 2;
      ctx.fillText("Mol", this.viewWindow.x + this.viewWindow.width / 2 - ctx.measureText("Mol").width / 2, this.viewWindow.y + this.viewWindow.height / 2 + h / 2);
    } else {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let title = this.name + " (" + (<MolecularViewer>this.view).getNumberOfAtoms() + " atoms)";
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }
  }

  updateModel(): void {
    let vi = this.portI.getValue();
    if (vi !== undefined) {
      let viewer = <MolecularViewer>this.view;
      viewer.loadMolecule(vi);
      let vx = this.portX.getValue();
      let vy = this.portY.getValue();
      let vz = this.portZ.getValue();
      if (vx !== undefined && vy !== undefined && vz !== undefined) {
        if (Array.isArray(vx) && Array.isArray(vy) && Array.isArray(vz)) {
        }
      }
      this.view.render();
    }
    let vs = this.portS.getValue();
    if (vs !== undefined) {
      let viewer = <MolecularViewer>this.view;
      if (vs) {
        viewer.startSpin();
      } else {
        viewer.stopSpin();
      }
    }
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 11;
    this.spaceMargin.bottom = 10;
    this.spaceMargin.left = 24;
    this.spaceMargin.right = 10;
    let dh = (this.height - this.barHeight) / 6;
    this.portI.setY(this.barHeight + dh);
    this.portS.setY(this.barHeight + 2 * dh);
    this.portX.setY(this.barHeight + 3 * dh);
    this.portY.setY(this.barHeight + 4 * dh);
    this.portZ.setY(this.barHeight + 5 * dh);
  }

  setStyle(style: string): void {
    (<MolecularViewer>this.view).setStyle(style);
  }

  getStyle(): string {
    return (<MolecularViewer>this.view).getStyle();
  }

  setSpin(spin: boolean): void {
    (<MolecularViewer>this.view).setSpin(spin);
  }

  getSpin(): boolean {
    return (<MolecularViewer>this.view).getSpin();
  }

  setX(x: number): void {
    super.setX(x);
    (<MolecularViewer>this.view).setX(this.viewWindow.x);
  }

  setY(y: number): void {
    super.setY(y);
    (<MolecularViewer>this.view).setY(this.viewWindow.y);
  }

  setWidth(width: number): void {
    super.setWidth(width);
    (<MolecularViewer>this.view).setWidth(this.viewWindow.width);
  }

  setHeight(height: number): void {
    super.setHeight(height);
    (<MolecularViewer>this.view).setHeight(this.viewWindow.height);
  }

  translateBy(dx: number, dy: number): void {
    super.translateBy(dx, dy);
    (<MolecularViewer>this.view).translateTo(this.viewWindow.x, this.viewWindow.y);
  }

  setRect(rect: Rectangle): void {
    super.setRect(rect);
    (<MolecularViewer>this.view).setRect(this.viewWindow.x, this.viewWindow.y, this.viewWindow.width, this.viewWindow.height);
  }

}
