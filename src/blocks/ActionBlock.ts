/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {flowchart} from "../Main";
import {Util} from "../Util";
import {Port} from "./Port";

export class ActionBlock extends Block {

  private type: string = "Reset";
  private pressed: boolean = false;
  private barHeight: number;
  private readonly portI: Port;
  private readonly portO: Port;

  static State = class {
    readonly name: string;
    readonly uid: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly type: string;
    readonly symbol: string;

    constructor(block: ActionBlock) {
      this.name = block.name;
      this.uid = block.uid;
      this.x = block.x;
      this.y = block.y;
      this.width = block.width;
      this.height = block.height;
      this.type = block.type;
      this.symbol = block.symbol;
    }
  };

  constructor(uid: string, name: string, x: number, y: number, width: number, height: number) {
    super(uid, x, y, width, height);
    this.name = name;
    this.type = "Reset";
    this.symbol = this.type;
    this.color = "#CD5C5C";
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI = new Port(this, true, "I", 0, this.barHeight + dh, false);
    this.portO = new Port(this, false, "O", this.width, this.barHeight + dh, true);
    this.ports.push(this.portO); // the default is reset, and it has only the output port
  }

  getCopy(): Block {
    let b = new ActionBlock("Action Block #" + Date.now().toString(16), this.name, this.x, this.y, this.width, this.height);
    b.setType(this.type);
    b.symbol = this.symbol;
    return b;
  }

  setType(type: string): void {
    if (this.type !== type) {
      this.type = type;
      this.symbol = type;
      for (let p of this.ports) {
        flowchart.removeConnectorsToPort(p);
      }
      this.ports.length = 0;
      switch (this.type) {
        case "Stop":
        case "Stop-And-Reset":
        case "Repaint":
          this.ports.push(this.portI);
          break;
        case "Reset":
        case "Reset-Without-Update":
          this.ports.push(this.portO);
          break;
      }
    }
  }

  getType(): string {
    return this.type;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // draw the bar
    switch (flowchart.blockView.getBlockStyle()) {
      case "Shade":
        let shade = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.barHeight);
        shade.addColorStop(0, "white");
        shade.addColorStop(this.iconic ? 0.4 : 0.2, Util.adjust(this.color, 100));
        shade.addColorStop(1, this.color);
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

    // draw the title bar
    ctx.fillStyle = "#FFFFFF";
    ctx.fillHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.drawHalfRoundedRect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight, this.radius, "Bottom");
    if (!this.iconic) {
      ctx.lineWidth = 0.75;
      ctx.font = "14px Arial";
      ctx.fillStyle = "white";
      let titleWidth = ctx.measureText(this.name).width;
      ctx.fillText(this.name, this.x + this.width / 2 - titleWidth / 2, this.y + this.barHeight / 2 + 3);
    }

    if (this.pressed) {
      ctx.fillStyle = "lightgray";
      ctx.beginPath();
      ctx.rect(this.x, this.y + this.barHeight, this.width, this.height - this.barHeight);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "black";
      ctx.stroke();
    }

    // draw the name in the lower area if this is not an icon
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.iconic ? 0.75 : 1;
    ctx.font = this.iconic ? "8px Arial" : "14px Arial";
    let textWidth = ctx.measureText(this.iconic ? this.name : this.symbol).width;
    ctx.translate(this.x + this.width / 2 - textWidth / 2, this.y + (this.height + this.barHeight) / 2 + 4);
    ctx.fillText(this.iconic ? this.name : this.symbol, 0, 0);
    ctx.restore();

    // draw the ports
    ctx.strokeStyle = "black";
    ctx.font = "bold 12px Times";
    switch (this.type) {
      case "Stop":
      case "Stop-And-Reset":
      case "Repaint":
        this.portI.draw(ctx, this.iconic);
        break;
      case "Reset":
      case "Reset-Without-Update":
        this.portO.draw(ctx, this.iconic);
        break;
    }

    if (this.selected) {
      this.highlightSelection(ctx);
    }

  }

  onDraggableArea(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.barHeight;
  }

  onButton(x: number, y: number): boolean {
    return x > this.x && x < this.x + this.width && y > this.y + this.barHeight && y < this.y + this.height;
  }

  destroy(): void {
  }

  refreshView(): void {
    super.refreshView();
    this.barHeight = Math.min(30, this.height / 3);
    let dh = (this.height - this.barHeight) / 2;
    this.portI.setY(this.barHeight + dh);
    this.portO.setY(this.barHeight + dh);
    this.portO.setX(this.width);
  }

  updateModel(): void {
    switch (this.type) {
      case "Reset":
        flowchart.reset(this);
        flowchart.updateResultsForBlock(this);
        flowchart.erase(this);
        flowchart.storeBlockStates();
        break;
      case "Reset-Without-Update":
        flowchart.reset(this);
        flowchart.updateResultsExcludingAllWorkerBlocks();
        flowchart.updateGlobalBlockChildren();
        flowchart.erase(this);
        flowchart.storeBlockStates();
        break;
      case "Stop":
        if (this.portI.getValue()) {
          flowchart.stopWorker(this);
        }
        break;
      case "Stop-And-Reset":
        if (this.portI.getValue()) {
          flowchart.stopAndResetWorker(this);
        }
        break;
      case "Repaint":
        if (this.portI.getValue() !== undefined) {
          flowchart.updateResultsForNotConnectedSources(this);
        }
        break;
    }
  }

  mouseDown(e: MouseEvent): boolean {
    if (e.which == 3) return; // if this is a right-click event
    if (this.type === "Stop" || this.type === "Stop-And-Reset") return;
    // get the position of a touch relative to the canvas (don't use offsetX and offsetY as they are not supported in TouchEvent)
    let rect = flowchart.blockView.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (this.onButton(x, y)) {
      this.pressed = true;
      this.updateModel();
      return true;
    }
    flowchart.blockView.canvas.style.cursor = "pointer";
    return false;
  }

  mouseUp(e: MouseEvent): void {
    if (this.pressed) {
      this.pressed = false;
    }
    flowchart.blockView.canvas.style.cursor = "default";
  }

  mouseMove(e: MouseEvent): void {
  }

  mouseLeave(e: MouseEvent): void {
    this.pressed = false;
    flowchart.blockView.canvas.style.cursor = "default";
  }

}
