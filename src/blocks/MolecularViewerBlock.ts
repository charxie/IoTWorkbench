/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {MolecularViewer} from "./MolecularViewer";
import {Basic3DBlock} from "./Basic3DBlock";

export class MolecularViewerBlock extends Basic3DBlock {

  private portI: Port; // initial conformation
  private portX: Port; // x, y, z ports are only used in the dual mode (which is the default)
  private portY: Port;
  private portZ: Port;
  private numberOfAtoms: number = 0;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly boxSize: number;
    readonly backgroundColor: string;
    readonly cameraPositionX: number;
    readonly cameraPositionY: number;
    readonly cameraPositionZ: number;
    readonly cameraRotationX: number;
    readonly cameraRotationY: number;
    readonly cameraRotationZ: number;

    constructor(m: MolecularViewerBlock) {
      this.name = m.name;
      this.uid = m.uid;
      this.x = m.x;
      this.y = m.y;
      this.width = m.width;
      this.height = m.height;
      this.boxSize = m.view.getBoxSize();
      this.backgroundColor = m.getBackgroundColor();
      this.cameraPositionX = m.view.getCameraPositionX();
      this.cameraPositionY = m.view.getCameraPositionY();
      this.cameraPositionZ = m.view.getCameraPositionZ();
      this.cameraRotationX = m.view.getCameraRotationX();
      this.cameraRotationY = m.view.getCameraRotationY();
      this.cameraRotationZ = m.view.getCameraRotationZ();
    }
  };

  constructor(iconic: boolean, uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(iconic, uid, name, x, y, width, height);
    this.color = "#778EAA";
    let dh = (this.height - this.barHeight) / 5;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false)
    this.portX = new Port(this, true, "X", 0, this.barHeight + 2 * dh, false)
    this.portY = new Port(this, true, "Y", 0, this.barHeight + 3 * dh, false)
    this.portZ = new Port(this, true, "Z", 0, this.barHeight + 4 * dh, false)
    this.ports.push(this.portI);
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
    let copy = new MolecularViewerBlock(false, "Molecular Viewer #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.setBackgroundColor(this.getBackgroundColor());
    copy.setBoxSize(this.getBoxSize());
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
      let title = this.name + " (" + this.numberOfAtoms + " atoms)";
      let titleWidth = ctx.measureText(title).width;
      ctx.fillText(title, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }
  }

  updateModel(): void {
    let vx = this.portX.getValue();
    let vy = this.portY.getValue();
    let vz = this.portZ.getValue();
    if (vx !== undefined && vy !== undefined && vz !== undefined) {
      if (Array.isArray(vx) && Array.isArray(vy) && Array.isArray(vz)) {
        this.numberOfAtoms = vx.length;
      } else {
        this.numberOfAtoms = 0;
      }
    } else {
      this.numberOfAtoms = 0;
    }
    this.view.render();
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 11;
    this.spaceMargin.bottom = 10;
    this.spaceMargin.left = 24;
    this.spaceMargin.right = 10;
    let dh = (this.height - this.barHeight) / 5;
    this.portI.setY(this.barHeight + dh);
    this.portX.setY(this.barHeight + 2 * dh);
    this.portY.setY(this.barHeight + 3 * dh);
    this.portZ.setY(this.barHeight + 4 * dh);
  }

}
