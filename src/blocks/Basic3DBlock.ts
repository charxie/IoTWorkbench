/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Util} from "../Util";
import {Rectangle} from "../math/Rectangle";
import {closeAllContextMenus, flowchart} from "../Main";
import {Basic3D} from "./Basic3D";

export abstract class Basic3DBlock extends Block {

  protected viewWindow: Rectangle;
  protected barHeight: number;
  protected readonly spaceMargin = {
    left: <number>6,
    right: <number>5,
    top: <number>6,
    bottom: <number>5
  };
  protected overlay: HTMLCanvasElement;
  protected view: Basic3D;

  constructor(iconic: boolean, uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.iconic = iconic;
    this.name = name;
    this.barHeight = Math.min(30, this.height / 3);
    this.viewWindow = new Rectangle(0, 0, 1, 1);
  }

  protected overlayMouseDown(e: MouseEvent): void {
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

  protected overlayOpenContextMenu(e: MouseEvent): void {
    if (this.overlay !== undefined) {
      flowchart.blockView.openContextMenu(e);
    }
  }

  protected overlayKeyUp(e: KeyboardEvent): void {
    if (this.overlay !== undefined) {
      flowchart.blockView.keyUp(e);
    }
  }

  resetViewAngle(): void {
    this.view.resetViewAngle();
  }

  setCameraPosition(px: number, py: number, pz: number, rx: number, ry: number, rz: number): void {
    this.view.setCameraPosition(px, py, pz, rx, ry, rz);
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
    this.view.render();
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
    this.view.destroy();
  }

  setBoxSize(boxSize: number): void {
    this.view.setBoxSize(boxSize);
  }

  getBoxSize(): number {
    return this.view.getBoxSize();
  }

  setXAxisLabel(xAxisLabel: string): void {
    this.view.setXAxisLabel(xAxisLabel);
  }

  getXAxisLabel(): string {
    return this.view.getXAxisLabel();
  }

  setYAxisLabel(yAxisLabel: string): void {
    this.view.setYAxisLabel(yAxisLabel);
  }

  getYAxisLabel(): string {
    return this.view.getYAxisLabel();
  }

  setZAxisLabel(zAxisLabel: string): void {
    this.view.setZAxisLabel(zAxisLabel);
  }

  getZAxisLabel(): string {
    return this.view.getZAxisLabel();
  }

  setBackgroundColor(viewWindowColor: string): void {
    this.view.setBackgroundColor(viewWindowColor);
  }

  getBackgroundColor(): string {
    return this.view.getBackgroundColor();
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

    // draw the view window
    ctx.fillStyle = "#EEFFFF";
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
    ctx.fillStyle = this.view !== undefined ? this.view.getBackgroundColor() : "white";
    ctx.fill();
    ctx.beginPath();
    ctx.rect(this.viewWindow.x - 3, this.viewWindow.y - 3, this.viewWindow.width + 4, this.viewWindow.height + 4);
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

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  toCanvas(): HTMLCanvasElement {
    return this.overlay;
  }

}
