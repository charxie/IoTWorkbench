/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {closeAllContextMenus, flowchart} from "../Main";
import {Rectangle} from "../math/Rectangle";

export class StringInput extends Block {

  private portI: Port;
  private portO: Port;
  private barHeight: number;
  private button: Rectangle;
  private content: string;
  private textArea: HTMLTextAreaElement;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly marginX: number;
    readonly marginY: number;
    readonly textColor: string;
    readonly content: string;
    readonly source: boolean;

    constructor(b: StringInput) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.marginX = b.marginX;
      this.marginY = b.marginY;
      this.textColor = b.textArea.style.color;
      this.content = b.textArea.value;
      this.source = b.source;
    }
  };

  constructor(uid: string, iconic: boolean, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.iconic = iconic;
    this.name = name;
    this.color = "#9CC";
    this.source = true;
    this.initiator = true;
    this.barHeight = Math.min(30, this.height / 3);
    this.portI = new Port(this, true, "I", 0, (this.height + this.barHeight) / 2, false);
    this.portO = new Port(this, false, "O", this.width, (this.height + this.barHeight) / 2, true);
    this.ports.push(this.portO);
    if (!this.iconic) {
      this.textArea = document.createElement("textarea");
      this.textArea.tabIndex = 0;
      this.textArea.style.overflowY = "auto";
      this.textArea.style.position = "absolute";
      this.textArea.style.fontFamily = "Courier New";
      this.textArea.style.fontSize = "12px";
      this.textArea.style.color = "black";
      this.textArea.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
      this.textArea.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
      document.getElementById("block-view-wrapper").append(this.textArea);
    }
    this.button = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new StringInput("String Input #" + Date.now().toString(16), this.iconic, this.name, this.x, this.y, this.width, this.height);
    copy.setContent(this.getContent());
    copy.setTextColor(this.getTextColor());
    copy.marginX = this.marginX;
    copy.marginY = this.marginY;
    copy.setSource(this.source);
    copy.locateOverlay();
    return copy;
  }

  destroy(): void {
    let parent = document.getElementById("block-view-wrapper");
    if (parent.contains(this.textArea)) parent.removeChild(this.textArea);
  }

  // return true if the button is clicked
  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3 || e.button == 2) return false; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.button.contains(x, y)) {
      this.updateAll();
      return true;
    }
    return false;
  }

  private updateAll(): void {
    flowchart.traverse(this);
    if (flowchart.isConnectedToGlobalBlock(this)) {
      flowchart.updateResultsExcludingAllWorkerBlocks();
    }
    flowchart.storeBlockStates();
    flowchart.blockView.requestDraw();
  }

  mouseMove(e: MouseEvent): void {
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.button.contains(x, y)) {
      flowchart.blockView.canvas.style.cursor = "pointer";
    }
  }

  private overlayMouseDown(e: MouseEvent): void {
    closeAllContextMenus();
    if (flowchart.blockView.getSelectedBlock() !== null) {
      flowchart.blockView.getSelectedBlock().setSelected(false);
    }
    this.setSelected(true);
    flowchart.blockView.setSelectedBlock(this);
    flowchart.blockView.clearResizeName();
    flowchart.blockView.requestDraw();
  }

  private overlayOpenContextMenu(e: MouseEvent): void {
    if (Util.getSelectedText() === "") {
      flowchart.blockView.openContextMenu(e);
    }
    // if text is selected, use default
  }

  setSource(source: boolean) {
    this.source = source;
    this.initiator = source;
    if (source) {
      if (this.ports.indexOf(this.portI) !== -1) {
        this.ports.removeItem(this.portI);
      }
    } else {
      if (this.ports.indexOf(this.portI) === -1) {
        this.ports.push(this.portI);
      }
    }
  }

  setTextColor(textColor: string): void {
    this.textArea.style.color = textColor;
  }

  getTextColor(): string {
    return this.textArea.style.color;
  }

  setContent(content: string) {
    this.textArea.value = content;
  }

  getContent(): string {
    return this.textArea.value;
  }

  locateOverlay(): void {
    this.setX(this.getX());
    this.setY(this.getY());
    this.setWidth(this.getWidth());
    this.setHeight(this.getHeight());
  }

  setX(x: number): void {
    super.setX(x);
    this.textArea.style.left = (this.x + this.marginX) + "px";
  }

  setY(y: number): void {
    super.setY(y);
    this.textArea.style.top = (this.y + this.barHeight + this.marginY) + "px";
  }

  setWidth(width: number): void {
    super.setWidth(width);
    this.textArea.style.width = (this.width - 2 * this.marginX) + "px";
  }

  setHeight(height: number): void {
    super.setHeight(height);
    this.textArea.style.height = (this.height - 2 * this.barHeight - 2 * this.marginY) + "px";
  }

  translateBy(dx: number, dy: number): void {
    super.translateBy(dx, dy);
    this.textArea.style.left = (this.x + this.marginX) + "px";
    this.textArea.style.top = (this.y + this.barHeight + this.marginY) + "px";
  }

  setRect(rect: Rectangle): void {
    super.setRect(rect);
    this.textArea.style.left = (this.x + this.marginX) + "px";
    this.textArea.style.top = (this.y + this.barHeight + this.marginY) + "px";
    this.textArea.style.width = (this.width - 2 * this.marginX) + "px";
    this.textArea.style.height = (this.height - this.barHeight - 2 * this.marginY) + "px";
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
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    // draw the text area
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    if (this.iconic) {
      let x = this.x + 4;
      let y = this.y + this.barHeight + 4;
      let w = this.width - 8;
      let h = this.height - this.barHeight - 8;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.font = "10px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("abc", x + w / 2 - 10, y + h / 2 + 4);
      this.button.width = 8;
      this.button.height = 4;
      this.button.x = this.x + (this.width - this.button.width) / 2;
      this.button.y = this.y + this.height - this.button.height - 1.5;
      ctx.fillStyle = "lightgray";
      ctx.fillRoundedRect(this.button.x, this.button.y, this.button.width, this.button.height, 1);
      ctx.strokeStyle = "black";
      ctx.drawRoundedRect(this.button.x, this.button.y, this.button.width, this.button.height, 1);
    } else {
      // draw button
      ctx.font = "10px Arial";
      let buttonNameWidth = ctx.measureText("Update").width;
      this.button.width = buttonNameWidth + 16;
      this.button.height = this.barHeight * 0.9;
      this.button.x = this.x + (this.width - this.button.width) / 2;
      this.button.y = this.y + this.height - this.marginY * 3 / 4 + (this.barHeight - 3 * this.button.height) / 2;
      ctx.fillStyle = "lightgray";
      ctx.fillRoundedRect(this.button.x, this.button.y, this.button.width, this.button.height, 5);
      ctx.strokeStyle = "black";
      ctx.drawRoundedRect(this.button.x, this.button.y, this.button.width, this.button.height, 5);
      ctx.fillStyle = "black";
      ctx.fillText("Update", this.button.x + (this.button.width - buttonNameWidth) / 2, this.button.y + this.button.height - 10);
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
    if (this.source) {
      this.portO.setValue(this.getContent());
    } else {
      this.portO.setValue(this.portI.getValue() ? this.getContent() : undefined);
    }
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portO.setX(this.width);
    this.portO.setY(this.barHeight + dh);
    this.portI.setY(this.barHeight + dh);
  }

  erase(): void {
    this.textArea.value = "";
  }

}
