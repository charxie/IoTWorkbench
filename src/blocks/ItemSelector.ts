/*
 * @author Charles Xie
 */

import {Port} from "./Port";
import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Triangle} from "../math/Triangle";
import {GlobalVariableBlock} from "./GlobalVariableBlock";

export class ItemSelector extends Block {

  private items: any[] = [1, 2, 3];
  private selectedIndex: number = 0;
  private halfHeight: number;
  private triangle: Triangle;
  private dropdownMenuOpen: boolean;
  private mBox: number;
  private xBox: number;
  private yBox: number;
  private wBox: number;
  private hBox: number;
  private mouseDownIndex: number;
  private mouseOverIndex: number;
  private readonly portI: Port;
  private readonly portO: Port;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly items: any[];
    readonly selectedIndex: number;
    readonly source: boolean;

    constructor(itemSelector: ItemSelector) {
      this.name = itemSelector.name;
      this.uid = itemSelector.uid;
      this.x = itemSelector.x;
      this.y = itemSelector.y;
      this.width = itemSelector.width;
      this.height = itemSelector.height;
      this.items = JSON.parse(JSON.stringify(itemSelector.items));
      this.selectedIndex = itemSelector.selectedIndex;
      this.source = itemSelector.source;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.source = true;
    this.halfHeight = this.height / 2;
    this.name = name;
    this.color = "#A0522D";
    this.portI = new Port(this, true, "I", 0, this.height / 2, false);
    this.portO = new Port(this, false, "O", this.width, this.height / 2, true);
    this.ports.push(this.portI);
    this.ports.push(this.portO);
    let x1 = this.x + this.width - 10;
    let y1 = this.y + this.halfHeight + 6;
    let x2 = this.x + this.width - 4;
    let y2 = y1;
    let x3 = (x1 + x2) / 2;
    let y3 = this.y + this.halfHeight + 10;
    this.triangle = new Triangle(x1, y1, x2, y2, x3, y3);
  }

  getCopy(): Block {
    let copy = new ItemSelector("Item Selector #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    copy.items = Array.isArray(this.items) ? JSON.parse(JSON.stringify(this.items)) : this.items;
    copy.selectedIndex = this.selectedIndex;
    return copy;
  }

  destroy(): void {
  }

  setItems(items: any[]): void {
    this.items = JSON.parse(JSON.stringify(items));
  }

  getItems(): any[] {
    return JSON.parse(JSON.stringify(this.items));
  }

  setSelectedIndex(i: number): void {
    this.selectedIndex = i;
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  updateModel(): void {
    let input = this.portI.getValue();
    if (input != undefined) {
      this.items = Array.isArray(input) ? JSON.parse(JSON.stringify(input)) : [input];
      this.source = false;
    }
    if (this.items.length > 0) {
      this.selectedIndex = Math.min(this.selectedIndex, this.items.length - 1);
    }
    this.portO.setValue(this.items[this.selectedIndex]);
    this.updateConnectors();
  }

  refreshView(): void {
    super.refreshView();
    this.halfHeight = this.height / 2;
    this.portI.setY(this.height / 2);
    this.portO.setX(this.width);
    this.portO.setY(this.height / 2);
    let x1 = this.x + this.width * 0.7;
    let y1 = this.y + this.halfHeight * 1.3;
    let x2 = this.x + this.width * 0.9;
    let y2 = y1;
    let x3 = (x1 + x2) / 2;
    let y3 = this.y + this.halfHeight * 1.7;
    this.triangle.setPoints(x1, y1, x2, y2, x3, y3);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.halfHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
        shade.addColorStop(1, this.color);
        ctx.fillStyle = shade;
        break;
      case "Plain":
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y, this.width, this.halfHeight, this.radius, "Top");

    // draw the name in the upper area if this is not an icon
    if (!this.iconic) {
      ctx.save();
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = this.iconic ? 0.75 : 1;
      ctx.font = this.iconic ? "10px Arial" : "14px Arial";
      let textWidth = ctx.measureText(this.name).width;
      ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + this.halfHeight / 2 + 4);
      ctx.fillText(this.name, 0, 0);
      ctx.restore();
    }

    // draw the lower area
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.halfHeight, this.width, this.halfHeight, this.radius, "Bottom");

    if (this.selected) {
      this.highlightSelection(ctx);
    }

    // draw the drop down list
    if (this.items && this.items.length > 0) {
      ctx.strokeStyle = "gray";
      this.mBox = this.iconic ? 3 : 5;
      this.xBox = this.x + this.mBox;
      this.yBox = this.y + this.halfHeight + this.mBox;
      this.wBox = this.width - 2 * this.mBox;
      this.hBox = this.halfHeight - 2 * this.mBox;
      ctx.beginPath();
      ctx.rect(this.xBox, this.yBox, this.wBox, this.hBox);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.lineWidth = this.iconic ? 0.75 : 1;
      ctx.font = this.iconic ? "9px Arial" : "12px Arial";
      ctx.fillText(this.items[this.selectedIndex], this.xBox + this.mBox, this.y + 3 * this.halfHeight / 2 + 4);
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.moveTo(this.triangle.p1.x, this.triangle.p1.y);
      ctx.lineTo(this.triangle.p2.x, this.triangle.p2.y);
      ctx.lineTo(this.triangle.p3.x, this.triangle.p3.y);
      ctx.fill();
      if (this.dropdownMenuOpen) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.rect(this.xBox, this.yBox + this.hBox, this.wBox, this.hBox * this.items.length);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "steelblue";
        if (this.mouseOverIndex >= 0) {
          ctx.rect(this.xBox, this.yBox + this.hBox * (1 + this.mouseOverIndex), this.wBox, this.hBox);
        } else if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
          ctx.rect(this.xBox, this.yBox + this.hBox * (1 + this.selectedIndex), this.wBox, this.hBox);
        }
        ctx.fill();
        for (let i = 0; i < this.items.length; i++) {
          ctx.fillStyle = i == this.mouseOverIndex ? "white" : "black";
          ctx.fillText(this.items[i], this.xBox + this.mBox, this.yBox + (i + 1) * this.hBox + this.hBox / 2 + 4);
        }
      }
    }

    // draw the ports
    ctx.strokeStyle = "black";
    this.portI.draw(ctx, this.iconic);
    this.portO.draw(ctx, this.iconic);

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.halfHeight;
  }

  onTriangle(x: number, y: number): boolean {
    return this.triangle.contains(x, y);
  }

  isDropdownMenuOpen(): boolean {
    return this.dropdownMenuOpen;
  }

  hasInput(): boolean {
    return this.portI.getValue() !== undefined;
  }

  contains(x: number, y: number): boolean {
    if (this.dropdownMenuOpen) {
      return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height) ||
        (x > this.xBox && y > this.yBox + this.hBox && x < this.xBox + this.wBox && y < this.yBox + this.hBox * (1 + this.items.length));
    }
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

  private updateAll(): void {
    flowchart.traverse(this);
    if (flowchart.isConnectedToGlobalBlock(this)) {
      flowchart.updateResultsExcludingAllWorkerBlocks();
    }
    flowchart.storeBlockStates();
  }

  keyUp(e: KeyboardEvent): void {
    if (this.dropdownMenuOpen) {
      let update = false;
      switch (e.key) {
        case "ArrowUp":
          update = true;
          break;
        case "ArrowDown":
          update = true;
          break;
      }
      if (update) {
        this.updateAll();
        flowchart.blockView.requestDraw();
      }
    }
  }

  keyDown(e: KeyboardEvent): void {
    if (this.dropdownMenuOpen) {
      this.mouseOverIndex = -1;
      this.mouseDownIndex = -1;
      switch (e.key) {
        case "ArrowUp":
          this.selectedIndex--;
          if (this.selectedIndex < 0) {
            this.selectedIndex = 0;
          }
          this.refreshView();
          break;
        case "ArrowDown":
          this.selectedIndex++;
          if (this.selectedIndex >= this.items.length) {
            this.selectedIndex = this.items.length - 1;
          }
          this.refreshView();
          break;
      }
    }
  }

  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3 || e.button == 2) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.onTriangle(x, y)) {
      this.dropdownMenuOpen = !this.dropdownMenuOpen;
      flowchart.blockView.requestDraw();
      return true;
    }
    this.mouseDownIndex = -1;
    if (this.dropdownMenuOpen) {
      if (x > this.xBox && x < this.xBox + this.wBox) {
        this.mouseDownIndex = Math.round((y - this.yBox - this.hBox) / (this.hBox * this.items.length) * (this.items.length - 1));
        if (this.mouseDownIndex < 0) {
          this.mouseDownIndex = 0;
        } else if (this.mouseDownIndex > this.items.length - 1) {
          this.mouseDownIndex = this.items.length - 1;
        }
      }
    }
    return false;
  }

  mouseUp(e: MouseEvent): void {
    if (e.which == 3 || e.button == 2) return; // if this is a right-click event
    if (this.dropdownMenuOpen) {
      if (this.mouseDownIndex >= 0) {
        this.selectedIndex = this.mouseDownIndex;
        this.dropdownMenuOpen = false;
        this.mouseDownIndex = -1;
        this.updateAll();
      }
    }
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
    if (e.which == 3 || e.button == 2) return; // if this is a right-click event
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.onTriangle(x, y)) {
      if (e.target instanceof HTMLCanvasElement) {
        e.target.style.cursor = "pointer";
      }
    } else {
      this.mouseOverIndex = -1;
      if (this.dropdownMenuOpen) {
        if (x > this.xBox && x < this.xBox + this.wBox) {
          this.mouseOverIndex = Math.round((y - this.yBox - this.hBox) / (this.hBox * this.items.length) * (this.items.length - 1));
          if (this.mouseOverIndex < 0) {
            this.mouseOverIndex = 0;
          } else if (this.mouseOverIndex > this.items.length - 1) {
            this.mouseOverIndex = this.items.length - 1;
          }
          flowchart.blockView.requestDraw();
        }
      }
    }
  }

  mouseLeave(e: MouseEvent): void {
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
