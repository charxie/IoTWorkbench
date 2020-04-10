/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {closeAllContextMenus, flowchart} from "../Main";
import {Vector} from "../math/Vector";
import {LinePlot} from "./LinePlot";
import {MolecularViewer} from "./MolecularViewer";

export class MolecularViewerBlock extends Block {

  private portX: Port; // x, y, z ports are only used in the dual mode (which is the default)
  private portY: Port;
  private portZ: Port;
  private spaceWindow: Rectangle;
  private barHeight: number;
  private readonly spaceMargin = {
    left: <number>6,
    right: <number>5,
    top: <number>6,
    bottom: <number>5
  };
  private overlay: HTMLCanvasElement;
  private viewer: MolecularViewer;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly boxSize: number;
    readonly spaceWindowColor: string;
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
      this.boxSize = m.viewer.getBoxSize();
      this.spaceWindowColor = m.getSpaceWindowColor();
      this.cameraPositionX = m.viewer.getCameraPositionX();
      this.cameraPositionY = m.viewer.getCameraPositionY();
      this.cameraPositionZ = m.viewer.getCameraPositionZ();
      this.cameraRotationX = m.viewer.getCameraRotationX();
      this.cameraRotationY = m.viewer.getCameraRotationY();
      this.cameraRotationZ = m.viewer.getCameraRotationZ();
    }
  };

  constructor(iconic: boolean, uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.iconic = iconic;
    this.name = name;
    this.color = "#778EAA";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 4;
    this.portX = new Port(this, true, "X", 0, this.barHeight + dh, false)
    this.portY = new Port(this, true, "Y", 0, this.barHeight + 2 * dh, false)
    this.portZ = new Port(this, true, "Z", 0, this.barHeight + 3 * dh, false)
    this.ports.push(this.portX);
    this.ports.push(this.portY);
    this.ports.push(this.portZ);
    this.spaceWindow = new Rectangle(0, 0, 1, 1);
    if (!iconic) {
      this.viewer = new MolecularViewer();
      this.overlay = this.viewer.getDomElement();
      this.overlay.tabIndex = 0;
      this.overlay.style.position = "absolute";
      document.getElementById("block-view-wrapper").append(this.overlay);
      this.overlay.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
      this.overlay.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
    }
  }

  getCopy(): Block {
    let copy = new MolecularViewerBlock(false, "Molecular Viewer #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.setSpaceWindowColor(this.getSpaceWindowColor());
    copy.setBoxSize(this.getBoxSize());
    copy.locateOverlay();
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
    this.viewer.render();
  }

  resetViewAngle(): void {
    this.viewer.resetViewAngle();
  }

  setCameraPosition(px: number, py: number, pz: number, rx: number, ry: number, rz: number): void {
    this.viewer.setCameraPosition(px, py, pz, rx, ry, rz);
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
      let parent = document.getElementById("block-view-wrapper");
      if (parent.contains(this.overlay)) parent.removeChild(this.overlay);
    }
    this.viewer.destroy();
  }

  setBoxSize(boxSize: number): void {
    this.viewer.setBoxSize(boxSize);
  }

  getBoxSize(): number {
    return this.viewer.getBoxSize();
  }

  setSpaceWindowColor(spaceWindowColor: string): void {
    this.viewer.setBackgroundColor(spaceWindowColor);
  }

  getSpaceWindowColor(): string {
    return this.viewer.getBackgroundColor();
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
      let title = this.name + " (" + " points)";
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
    ctx.fillStyle = this.viewer !== undefined ? this.viewer.getBackgroundColor() : "white";
    ctx.fill();
    ctx.beginPath();
    ctx.rect(this.spaceWindow.x - 3, this.spaceWindow.y - 3, this.spaceWindow.width + 4, this.spaceWindow.height + 4);
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (this.iconic) {
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      let h = ctx.measureText("M").width - 2;
      ctx.fillText("Mol", this.spaceWindow.x + this.spaceWindow.width / 2 - ctx.measureText("Mol").width / 2, this.spaceWindow.y + this.spaceWindow.height / 2 + h / 2);
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

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let vx = this.portX.getValue();
    let vy = this.portY.getValue();
    let vz = this.portZ.getValue();
    if (vx !== undefined && vy !== undefined && vz !== undefined) {
    }
    this.viewer.render();
  }

  refreshView(): void {
    super.refreshView();
    this.spaceMargin.top = 11;
    this.spaceMargin.bottom = 10;
    this.spaceMargin.left = 24;
    this.spaceMargin.right = 10;
    let dh = (this.height - this.barHeight) / 4;
    this.portX.setY(this.barHeight + dh);
    this.portY.setY(this.barHeight + 2 * dh);
    this.portZ.setY(this.barHeight + 3 * dh);
  }

  toCanvas(): HTMLCanvasElement {
    return this.overlay;
  }

}
