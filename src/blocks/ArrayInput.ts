/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Port} from "./Port";
import {Util} from "../Util";
import {closeAllContextMenus, flowchart} from "../Main";
import {Rectangle} from "../math/Rectangle";

export class ArrayInput extends Block {

  private textColor: string = "black";
  private barHeight: number;
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
    readonly text: string;

    constructor(b: ArrayInput) {
      this.name = b.name;
      this.uid = b.uid;
      this.x = b.x;
      this.y = b.y;
      this.width = b.width;
      this.height = b.height;
      this.marginX = b.marginX;
      this.marginY = b.marginY;
      this.textColor = b.textColor;
      this.text = b.textArea.value;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.color = "#CC9";
    this.source = true;
    this.initiator = true;
    this.barHeight = Math.min(30, this.height / 3);
    this.ports.push(new Port(this, false, "O", this.width, this.height / 2, true));
    this.textArea = document.createElement("textarea");
    this.textArea.tabIndex = 0;
    this.textArea.style.overflowY = "auto";
    this.textArea.style.position = "absolute";
    this.textArea.style.fontFamily = "Courier New";
    this.textArea.style.fontSize = "12px";
    this.textArea.style.color = this.textColor;
    this.textArea.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
    this.textArea.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
    this.textArea.addEventListener("keyup", this.overlayKeyUp.bind(this), false);
    document.getElementById("block-view-wrapper").append(this.textArea);
  }

  getCopy(): Block {
    let copy = new ArrayInput("Array Input #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.textColor = this.textColor;
    copy.marginX = this.marginX;
    copy.marginY = this.marginY;
    copy.locateOverlay();
    return copy;
  }

  destroy(): void {
    let parent = document.getElementById("block-view-wrapper");
    if (parent.contains(this.textArea)) parent.removeChild(this.textArea);
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

  private overlayKeyUp(e: KeyboardEvent): void {
    switch (e.key) { // single keys
      case "Enter":
        this.updateAll();
        break;
    }
  }

  private updateAll(): void {
    flowchart.traverse(this);
    if (flowchart.isConnectedToGlobalBlock(this)) {
      flowchart.updateResultsExcludingAllWorkerBlocks();
    }
    flowchart.storeBlockStates();
    flowchart.blockView.requestDraw();
  }

  setTextColor(textColor: string): void {
    this.textColor = textColor;
  }

  getTextColor(): string {
    return this.textColor;
  }

  setText(text: string) {
    this.textArea.value = text;
  }

  getText(): string {
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
    this.textArea.style.height = (this.height - this.barHeight - 2 * this.marginY) + "px";
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
      ctx.fillStyle = this.textColor;
      let name2 = this.name + " (" + ")";
      let titleWidth = ctx.measureText(name2).width;
      ctx.fillText(name2, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
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
      ctx.fillStyle = "black";
      ctx.font = "8px Arial";
      ctx.fillText("[...]", x + 4, y + 7.5);
    }

    // draw the port
    ctx.font = this.iconic ? "9px Arial" : "12px Arial";
    ctx.strokeStyle = "black";
    this.ports[0].draw(ctx, this.iconic);

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  updateModel(): void {
    let array = this.textArea.value.trim().split(/[ ,\n]+/);
    let numbers = new Array(array.length);
    for (let i = 0; i < numbers.length; i++) {
      try {
        numbers[i] = parseFloat(array[i]);
      } catch (e) {
        numbers[i] = array[i];
      }
    }
    this.ports[0].setValue(numbers);
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    this.ports[0].setX(this.width);
    this.ports[0].setY((this.height + this.barHeight) / 2);
  }

  erase(): void {
    this.textArea.value = "";
  }

}
