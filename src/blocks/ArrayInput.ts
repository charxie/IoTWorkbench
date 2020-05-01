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
  private button: Rectangle;
  private array: any[][];
  private rowCount: number = 0;
  private colCount: number = 0;
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
    this.ports.push(new Port(this, false, "A", this.width, this.height / 2, true));
    this.textArea = document.createElement("textarea");
    this.textArea.tabIndex = 0;
    this.textArea.style.overflowY = "auto";
    this.textArea.style.position = "absolute";
    this.textArea.style.fontFamily = "Courier New";
    this.textArea.style.fontSize = "12px";
    this.textArea.style.color = this.textColor;
    this.textArea.addEventListener("mousedown", this.overlayMouseDown.bind(this), false);
    this.textArea.addEventListener('contextmenu', this.overlayOpenContextMenu.bind(this), false);
    document.getElementById("block-view-wrapper").append(this.textArea);
    this.button = new Rectangle(0, 0, 1, 1);
  }

  getCopy(): Block {
    let copy = new ArrayInput("Array Input #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.setText(this.getText());
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

  // return true if the button is clicked
  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3 || e.button == 2) return false; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.button.contains(x, y)) {
      this.parseText();
      this.updateAll();
      return true;
    }
    return false;
  }

  private parseText(): void {
    this.textArea.value = this.textArea.value.trim();
    let rows = this.textArea.value.split(/\n+/);
    this.rowCount = rows.length;
    for (let i = 0; i < this.rowCount; i++) {
      let columnValues = rows[i].split(/[ ,\t]+/);
      if (i === 0) {
        this.colCount = columnValues.length;
        this.array = new Array(this.colCount);
        for (let col = 0; col < this.colCount; col++) {
          this.array[col] = new Array(this.rowCount);
        }
      }
      for (let j = 0; j < this.colCount; j++) {
        this.array[j][i] = columnValues[j];
      }
    }
    this.setOutputPorts();
  }

  private setOutputPorts(): void {
    if (this.ports.length !== this.colCount) {
      for (let p of this.ports) { // disconnect all the port connectors as the ports will be recreated
        flowchart.removeAllConnectors(p);
      }
      this.ports.length = 0;
      let dh = this.height / (this.colCount + 1);
      let firstPortName = "A";
      let k = firstPortName.charCodeAt(0);
      for (let i = 0; i < this.colCount; i++) {
        let id = String.fromCharCode(k++);
        this.ports.push(new Port(this, false, id, this.width, (i + 1) * dh, true));
      }
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

  setTextColor(textColor: string): void {
    this.textColor = textColor;
  }

  getTextColor(): string {
    return this.textColor;
  }

  setText(text: string) {
    this.textArea.value = text;
    this.parseText();
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
      ctx.fillStyle = this.textColor;
      let name2 = this.name + " (" + this.rowCount + ")";
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
      this.button.width = Math.max(10, this.width / 4);
      this.button.height = this.barHeight * 0.9;
      this.button.x = this.x + (this.width - this.button.width) / 2;
      this.button.y = this.y + this.height - this.marginY * 3 / 4 + (this.barHeight - 3 * this.button.height) / 2;
      ctx.fillStyle = "lightgray";
      ctx.fillRoundedRect(this.button.x, this.button.y, this.button.width, this.button.height, 5);
      ctx.strokeStyle = "black";
      ctx.drawRoundedRect(this.button.x, this.button.y, this.button.width, this.button.height, 5);
      ctx.font = "10px Arial";
      ctx.fillStyle = "black";
      let buttonNameWidth = ctx.measureText("Update").width;
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
    for (let col = 0; col < this.ports.length; col++) {
      let numbers = new Array(this.array[col].length);
      for (let row = 0; row < numbers.length; row++) {
        try {
          numbers[row] = parseFloat(this.array[col][row]);
        } catch (e) {
          numbers[row] = this.array[col][row];
        }
      }
      this.ports[col].setValue(numbers);
    }
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / (this.ports.length + 1);
    for (let i = 0; i < this.ports.length; i++) {
      this.ports[i].setX(this.width);
      this.ports[i].setY(this.barHeight + (i + 1) * dh);
    }
  }

  erase(): void {
    this.textArea.value = "";
  }

}
